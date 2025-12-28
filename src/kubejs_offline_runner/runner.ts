import { readdirSync } from "fs-extra";
import { join, resolve } from "node:path";
import { SnapshotData, SnapshotRecipe } from "./snapshot";
import { RunnerError } from "./errors";

export interface KubeJsFiles {
    assets: string[];
    client_scripts: string[];
    config: string[];
    contentpacks: string[];
    data: string[];
    mixin_scripts: string[];
    server_scripts: string[];
    startup_scripts: string[];
}

export interface KubeJsOfflineRunnerOpts {
    scriptsFilter?: string;
    executeServerRecipes?: boolean;
    executeServerTags?: boolean;
    executeLootModifiers?: boolean;
}

export interface RunnerResult {
    errors: RunnerError[];
}

interface SnapshotIndex {
    items: Set<string> | null;
    recipeTypes: Set<string> | null;
    recipes: Map<string, SnapshotRecipe>;
    recipesByOutput: Map<string, SnapshotRecipe[]>;
    tagsByRegistry: Map<string, Set<string>>;
    blocks: Set<string> | null;
    fluids: Set<string> | null;
}

interface RunnerContext {
    snapshot: SnapshotData;
    snapshotIndex: SnapshotIndex;
    errors: RunnerError[];
    errorKeys: Set<string>;
    currentScriptPath?: string;
}

interface CallSite {
    file?: string;
    line?: number;
    column?: number;
}

interface EventSession {
    name: string;
    changes: number;
    callSite: CallSite;
}

function readDirFilenames(dir: string): string[] {
    let results: string[] = [];
    const list = readdirSync(dir, { withFileTypes: true });
    for (const entry of list) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(readDirFilenames(fullPath));
        } else {
            results.push(fullPath);
        }
    }
    return results;
}

export function gatherKubejsFiles(pathToMinecraftInstance: string): KubeJsFiles {
    const kubeJsFolderPath = resolve(join(pathToMinecraftInstance, "kubejs"));
    const files: KubeJsFiles = {
        assets: [],
        client_scripts: [],
        config: [],
        contentpacks: [],
        data: [],
        mixin_scripts: [],
        server_scripts: [],
        startup_scripts: [],
    };

    for (const subfolder in files) {
        (files as any)[subfolder].push(...readDirFilenames(join(kubeJsFolderPath, subfolder)));
    }

    return files;
}

export function runOfflineScripts(files: KubeJsFiles, snapshot: SnapshotData, opts?: KubeJsOfflineRunnerOpts): RunnerResult {
    const ctx: RunnerContext = {
        snapshot,
        snapshotIndex: buildSnapshotIndex(snapshot),
        errors: [],
        errorKeys: new Set(),
    };

    for (const scriptPath of files.server_scripts) {
        if (opts?.scriptsFilter && !scriptPath.includes(opts.scriptsFilter)) {
            continue;
        }
        ctx.currentScriptPath = scriptPath;
        try {
            const kubejsGlobals = buildGlobals(ctx, opts);
            Object.assign(globalThis, kubejsGlobals);
            delete require.cache[require.resolve(scriptPath)];
            require(scriptPath);
        } catch (e: any) {
            ctx.errors.push({
                type: "script_error",
                message: `Failed to run script: ${e?.message ?? e}`,
                file: scriptPath,
            });
        } finally {
            ctx.currentScriptPath = undefined;
        }
    }

    return { errors: ctx.errors };
}

function buildSnapshotIndex(snapshot: SnapshotData): SnapshotIndex {
    const items = snapshot.items ? new Set(snapshot.items) : null;
    const recipeTypes = snapshot.recipeTypes ? new Set(snapshot.recipeTypes) : null;
    const recipes = new Map<string, SnapshotRecipe>();
    const recipesByOutput = new Map<string, SnapshotRecipe[]>();
    const tagsByRegistry = new Map<string, Set<string>>();
    const blocks = snapshot.blocks ? new Set(snapshot.blocks) : null;
    const fluids = snapshot.fluids ? new Set(snapshot.fluids) : null;

    for (const recipe of snapshot.recipes ?? []) {
        recipes.set(recipe.id, recipe);
        for (const output of recipe.outputs ?? []) {
            const list = recipesByOutput.get(output) ?? [];
            list.push(recipe);
            recipesByOutput.set(output, list);
        }
    }

    for (const registryName of Object.keys(snapshot.tags ?? {})) {
        const tagSet = new Set<string>();
        const tags = snapshot.tags?.[registryName] ?? {};
        for (const tagId of Object.keys(tags)) {
            tagSet.add(tagId);
        }
        tagsByRegistry.set(registryName, tagSet);
    }

    return {
        items,
        recipeTypes,
        recipes,
        recipesByOutput,
        tagsByRegistry,
        blocks,
        fluids,
    };
}

function buildGlobals(ctx: RunnerContext, opts?: KubeJsOfflineRunnerOpts) {
    return {
        __KUBEJS_OFFLINE__: true,
        ServerEvents: buildServerEvents(ctx, opts),
        LootJS: buildLootJs(ctx, opts),
        Item: buildItemHelper(ctx),
        Fluid: buildFluidHelper(),
        ItemFilter: buildItemFilter(),
        Utils: buildUtilsHelper(),
        Platform: buildPlatformHelper(),
        ID: buildIdHelper(),
        JsonIO: buildJsonIoHelper(),
        JsonUtils: buildJsonUtilsHelper(),
        StringUtils: buildStringUtilsHelper(),
        KMath: Math,
        Java: buildJavaHelper(),
        PlayerEvents: buildNoopEventGroup(),
        ItemEvents: buildNoopEventGroup(),
        BlockEvents: buildNoopEventGroup(),
        EntityEvents: buildNoopEventGroup(),
        LevelEvents: buildNoopEventGroup(),
        StartupEvents: buildNoopEventGroup(),
        NetworkEvents: buildNoopEventGroup(),
        RecipeViewerEvents: buildNoopEventGroup(),
    };
}

function buildServerEvents(ctx: RunnerContext, opts?: KubeJsOfflineRunnerOpts) {
    return {
        recipes: (callback: (event: any) => void) => {
            if (opts?.executeServerRecipes === false) {
                return;
            }
            runEvent(ctx, "ServerEvents.recipes", callback, createRecipesEvent(ctx));
        },
        tags: (registry: string, callback: (event: any) => void) => {
            if (opts?.executeServerTags === false) {
                return;
            }
            runEvent(ctx, `ServerEvents.tags(${registry})`, callback, createTagsEvent(ctx, registry));
        },
    };
}

function buildLootJs(ctx: RunnerContext, opts?: KubeJsOfflineRunnerOpts) {
    return {
        modifiers: (callback: (event: any) => void) => {
            if (opts?.executeLootModifiers === false) {
                return;
            }
            runEvent(ctx, "LootJS.modifiers", callback, createLootModifiersEvent(ctx));
        },
    };
}

function buildNoopEventGroup() {
    return new Proxy(
        {},
        {
            get() {
                return () => {
                    // no-op
                };
            },
        },
    );
}

function runEvent(ctx: RunnerContext, name: string, callback: (event: any) => void, eventObj: any) {
    const callSite = captureCallSite(ctx.currentScriptPath);
    const session: EventSession = { name, changes: 0, callSite };

    function markChange() {
        session.changes += 1;
    }

    if (typeof eventObj.__setChangeHook === "function") {
        eventObj.__setChangeHook(markChange);
    }

    try {
        callback(eventObj);
    } catch (e: any) {
        ctx.errors.push({
            type: "script_error",
            message: `${name} failed: ${e?.message ?? e}`,
            file: callSite.file,
            line: callSite.line,
            column: callSite.column,
        });
        return;
    }

    if (session.changes === 0) {
        ctx.errors.push({
            type: "noop_event",
            message: `${name} made no changes`,
            file: callSite.file,
            line: callSite.line,
            column: callSite.column,
        });
    }
}

function createRecipesEvent(ctx: RunnerContext) {
    const changeHook = { fn: () => {} };

    const event = {
        __setChangeHook(fn: () => void) {
            changeHook.fn = fn;
        },
        remove(filter: any) {
            const matches = filterRecipes(ctx, filter);
            if (matches.length > 0) {
                changeHook.fn();
            }
        },
        replaceInput(filter: any, from: any, to: any) {
            validateItemArg(ctx, from);
            validateItemArg(ctx, to);
            const matches = filterRecipes(ctx, filter);
            if (matches.length > 0) {
                changeHook.fn();
            }
        },
        replaceOutput(filter: any, from: any, to: any) {
            validateItemArg(ctx, from);
            validateItemArg(ctx, to);
            const matches = filterRecipes(ctx, filter);
            if (matches.length > 0) {
                changeHook.fn();
            }
        },
        shaped(output: any, pattern: any, key: any) {
            validateItemArg(ctx, output);
            for (const value of Object.values(key ?? {})) {
                validateItemArg(ctx, value);
            }
            changeHook.fn();
            return createRecipeBuilder(ctx, changeHook);
        },
        shapeless(output: any, inputs: any[]) {
            validateItemArg(ctx, output);
            for (const input of inputs ?? []) {
                validateItemArg(ctx, input);
            }
            changeHook.fn();
            return createRecipeBuilder(ctx, changeHook);
        },
        smelting(output: any, input: any) {
            validateItemArg(ctx, output);
            validateItemArg(ctx, input);
            changeHook.fn();
            return createRecipeBuilder(ctx, changeHook);
        },
        blasting(output: any, input: any) {
            validateItemArg(ctx, output);
            validateItemArg(ctx, input);
            changeHook.fn();
            return createRecipeBuilder(ctx, changeHook);
        },
        stonecutting(output: any, input: any) {
            validateItemArg(ctx, output);
            if (Array.isArray(input)) {
                for (const value of input) {
                    validateItemArg(ctx, value);
                }
            } else {
                validateItemArg(ctx, input);
            }
            changeHook.fn();
            return createRecipeBuilder(ctx, changeHook);
        },
        custom(json: any) {
            if (json?.type) {
                validateRecipeType(ctx, json.type);
            }
            changeHook.fn();
        },
        forEachRecipe(filter: any, callback: (recipe: any) => void) {
            const matches = filterRecipes(ctx, filter);
            for (const recipe of matches) {
                const recipeRef = {
                    id: recipe.id,
                    remove() {
                        changeHook.fn();
                    },
                };
                callback(recipeRef);
            }
        },
    };

    Object.defineProperty(event, "recipes", {
        get() {
            return createRecipeNamespaces(ctx, changeHook);
        },
    });

    return event;
}

function createRecipeNamespaces(ctx: RunnerContext, changeHook: { fn: () => void }) {
    return new Proxy(
        {},
        {
            get(_target, namespace: string) {
                return createRecipeNamespace(ctx, changeHook, namespace);
            },
        },
    );
}

function createRecipeNamespace(ctx: RunnerContext, changeHook: { fn: () => void }, namespace: string) {
    return new Proxy(
        {},
        {
            get(_target, typeName: string) {
                return (output: any, inputs: any) => {
                    validateItemArg(ctx, output);
                    if (Array.isArray(inputs)) {
                        for (const input of inputs) {
                            validateItemArg(ctx, input);
                        }
                    } else {
                        validateItemArg(ctx, inputs);
                    }
                    changeHook.fn();
                    return createRecipeBuilder(ctx, changeHook, `${namespace}:${typeName}`);
                };
            },
        },
    );
}

function createRecipeBuilder(ctx: RunnerContext, changeHook: { fn: () => void }, recipeType?: string) {
    if (recipeType) {
        validateRecipeType(ctx, recipeType);
    }
    return {
        id(_id: string) {
            changeHook.fn();
            return this;
        },
        processingTime(_ticks: number) {
            changeHook.fn();
            return this;
        },
        heated() {
            changeHook.fn();
            return this;
        },
        superheated() {
            changeHook.fn();
            return this;
        },
    };
}

function createTagsEvent(ctx: RunnerContext, registry: string) {
    const changeHook = { fn: () => {} };
    return {
        __setChangeHook(fn: () => void) {
            changeHook.fn = fn;
        },
        add(tagId: string, value: any) {
            validateTag(ctx, registry, tagId);
            validateItemArg(ctx, value);
            changeHook.fn();
        },
        remove(tagId: string, value: any) {
            validateTag(ctx, registry, tagId);
            validateItemArg(ctx, value);
            changeHook.fn();
        },
        removeAll(tagId: string) {
            validateTag(ctx, registry, tagId);
            changeHook.fn();
        },
    };
}

function createLootModifiersEvent(ctx: RunnerContext) {
    const changeHook = { fn: () => {} };
    return {
        __setChangeHook(fn: () => void) {
            changeHook.fn = fn;
        },
        addBlockLootModifier(blockId: string) {
            if (ctx.snapshotIndex.blocks && !ctx.snapshotIndex.blocks.has(blockId)) {
                pushError(ctx, "missing_item", `Unknown block id '${blockId}'`);
            }
            const api = {
                removeLoot(_filter: any) {
                    changeHook.fn();
                    return api;
                },
                addLoot(itemId: string) {
                    validateItemId(ctx, itemId);
                    changeHook.fn();
                    return api;
                },
                addWeightedLoot(_weights: number[], items: any[]) {
                    for (const item of items ?? []) {
                        validateItemArg(ctx, item);
                    }
                    changeHook.fn();
                    return api;
                },
            };
            return api;
        },
    };
}

class ItemStackRef {
    public id: string;
    public count?: number;
    public nbt?: unknown;
    public chance?: number;

    public constructor(id: string, countOrNbt?: number | unknown) {
        this.id = id;
        if (typeof countOrNbt === "number") {
            this.count = countOrNbt;
        } else if (countOrNbt !== undefined) {
            this.nbt = countOrNbt;
        }
    }

    public withChance(chance: number) {
        const next = new ItemStackRef(this.id, this.count ?? this.nbt);
        next.chance = chance;
        return next;
    }
}

function buildItemHelper(ctx: RunnerContext) {
    return {
        of: (id: string, countOrNbt?: number | unknown) => new ItemStackRef(id, countOrNbt),
        exists: (id: string) => {
            if (!id) {
                return false;
            }
            if (!ctx.snapshotIndex.items) {
                return true;
            }
            return ctx.snapshotIndex.items.has(normalizeItemId(id));
        },
    };
}

function buildFluidHelper() {
    return {
        water: (amount: number) => ({ type: "fluid", id: "minecraft:water", amount }),
    };
}

function buildItemFilter() {
    const alwaysTrue = { __kind: "ItemFilter", alwaysTrue: true };
    return {
        ALWAYS_TRUE: alwaysTrue,
        of: (value: any) => ({ __kind: "ItemFilter", value }),
    };
}

function buildUtilsHelper() {
    return {
        server: {
            runCommandSilent(_command: string) {
                return null;
            },
            runCommand(_command: string) {
                return null;
            },
        },
    };
}

function buildPlatformHelper() {
    return {
        isLoaded(_modId: string) {
            return true;
        },
    };
}

function buildIdHelper() {
    return {
        string(id: string) {
            return id;
        },
        mc(id: string) {
            return id;
        },
    };
}

function buildJsonIoHelper() {
    return {
        toPrettyString(value: unknown) {
            return JSON.stringify(value, null, 2);
        },
        toJsonString(value: unknown) {
            return JSON.stringify(value);
        },
        parseJson(text: string) {
            return JSON.parse(text);
        },
    };
}

function buildJsonUtilsHelper() {
    return {
        of(value: unknown) {
            return value;
        },
        objectOf(value: unknown) {
            return value ?? {};
        },
        arrayOf(value: unknown) {
            return Array.isArray(value) ? value : [];
        },
    };
}

function buildStringUtilsHelper() {
    return {
        snakeCaseToCamelCase(value: string) {
            return value.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
        },
    };
}

function buildJavaHelper() {
    return {
        loadClass(className: string) {
            throw new Error(`Java.loadClass is not supported in offline runner (${className})`);
        },
        type(className: string) {
            throw new Error(`Java.type is not supported in offline runner (${className})`);
        },
    };
}

function filterRecipes(ctx: RunnerContext, filter: any): SnapshotRecipe[] {
    if (!filter) {
        return [];
    }

    const recipes = Array.from(ctx.snapshotIndex.recipes.values());

    if (filter.id && typeof filter.id === "string") {
        if (!ctx.snapshotIndex.recipes.has(filter.id)) {
            pushError(ctx, "missing_recipe", `Unknown recipe id '${filter.id}'`);
            return [];
        }
    }

    let result = recipes;

    if (filter.mod && typeof filter.mod === "string") {
        result = result.filter((r) => r.id.startsWith(`${filter.mod}:`));
    }

    if (filter.id) {
        if (filter.id instanceof RegExp) {
            result = result.filter((r) => filter.id.test(r.id));
        } else if (typeof filter.id === "string") {
            result = result.filter((r) => r.id === filter.id);
        }
    }

    if (filter.output) {
        if (filter.output instanceof RegExp) {
            result = result.filter((r) => (r.outputs ?? []).some((o) => filter.output.test(o)));
        } else if (typeof filter.output === "string") {
            result = result.filter((r) => (r.outputs ?? []).includes(normalizeItemId(filter.output)));
            validateItemId(ctx, filter.output);
        }
    }

    return result;
}

function validateRecipeType(ctx: RunnerContext, typeId: string) {
    if (!ctx.snapshotIndex.recipeTypes) {
        return;
    }
    if (!ctx.snapshotIndex.recipeTypes.has(typeId)) {
        pushError(ctx, "missing_recipe_type", `Unknown recipe type '${typeId}'`);
    }
}

function validateItemArg(ctx: RunnerContext, arg: any) {
    for (const itemId of extractItemIds(arg)) {
        validateItemId(ctx, itemId);
    }
    for (const tagId of extractTagIds(arg)) {
        validateTag(ctx, "item", tagId);
    }
}

function validateItemId(ctx: RunnerContext, rawId: string) {
    if (!ctx.snapshotIndex.items) {
        return;
    }
    const id = normalizeItemId(rawId);
    if (!ctx.snapshotIndex.items.has(id)) {
        pushError(ctx, "missing_item", `Unknown item id '${id}'`);
    }
}

function validateTag(ctx: RunnerContext, registry: string, tagId: string) {
    const tags = ctx.snapshotIndex.tagsByRegistry.get(registry);
    if (!tags || tags.size === 0) {
        return;
    }
    const normalized = normalizeTagId(tagId);
    if (!tags.has(normalized)) {
        pushError(ctx, "missing_tag", `Unknown tag '${normalized}' in registry '${registry}'`);
    }
}

function normalizeItemId(rawId: string): string {
    const trimmed = rawId.trim();
    const match = trimmed.match(/^(\d+)\s*x\s+(.+)$/i);
    if (match) {
        return match[2].trim();
    }
    return trimmed;
}

function normalizeTagId(rawId: string): string {
    return rawId.startsWith("#") ? rawId.slice(1) : rawId;
}

function extractItemIds(arg: any): string[] {
    if (!arg) {
        return [];
    }
    if (arg instanceof ItemStackRef) {
        return [arg.id];
    }
    if (typeof arg === "string") {
        if (arg.trim().startsWith("#")) {
            return [];
        }
        if (arg.includes(":")) {
            return [normalizeItemId(arg)];
        }
        return [];
    }
    if (Array.isArray(arg)) {
        return arg.flatMap((v) => extractItemIds(v));
    }
    if (typeof arg === "object") {
        if (arg.type === "fluid") {
            return [];
        }
        if (typeof arg.item === "string") {
            return [normalizeItemId(arg.item)];
        }
        if (typeof arg.fluid === "string") {
            return [];
        }
        if (typeof arg.id === "string") {
            return [normalizeItemId(arg.id)];
        }
        return [];
    }
    return [];
}

function extractTagIds(arg: any): string[] {
    if (!arg) {
        return [];
    }
    if (typeof arg === "string") {
        if (arg.trim().startsWith("#")) {
            return [normalizeTagId(arg)];
        }
        return [];
    }
    if (Array.isArray(arg)) {
        return arg.flatMap((v) => extractTagIds(v));
    }
    if (typeof arg === "object") {
        if (typeof arg.tag === "string") {
            return [normalizeTagId(arg.tag)];
        }
        return [];
    }
    return [];
}

function pushError(ctx: RunnerContext, type: RunnerError["type"], message: string) {
    const callSite = captureCallSite(ctx.currentScriptPath);
    const key = [
        type,
        message,
        callSite.file ?? "",
        callSite.line ?? "",
        callSite.column ?? "",
    ].join("|");
    if (ctx.errorKeys.has(key)) {
        return;
    }
    ctx.errorKeys.add(key);
    ctx.errors.push({
        type,
        message,
        file: callSite.file,
        line: callSite.line,
        column: callSite.column,
    });
}

function captureCallSite(scriptPath?: string): CallSite {
    const stack = new Error().stack ?? "";
    const lines = stack.split(/\r?\n/).slice(1);
    const normalizedTarget = scriptPath ? scriptPath.toLowerCase() : null;

    for (const line of lines) {
        const match = parseStackLine(line);
        if (!match) {
            continue;
        }
        if (!normalizedTarget || match.file.toLowerCase().includes(normalizedTarget)) {
            return match;
        }
    }

    for (const line of lines) {
        const match = parseStackLine(line);
        if (match) {
            return match;
        }
    }

    return {};
}

function parseStackLine(line: string): CallSite | null {
    const trimmed = line.trim();
    const withParens = trimmed.match(/\((.+):(\d+):(\d+)\)$/);
    if (withParens) {
        return {
            file: withParens[1],
            line: Number(withParens[2]),
            column: Number(withParens[3]),
        };
    }
    const noParens = trimmed.match(/at (.+):(\d+):(\d+)$/);
    if (noParens) {
        return {
            file: noParens[1],
            line: Number(noParens[2]),
            column: Number(noParens[3]),
        };
    }
    return null;
}
