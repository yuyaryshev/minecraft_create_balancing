import { iterateSourceJsonPaths} from "./minecraft_paths.js";
import { join as joinPath } from "path";
import { readFile, readFileSync, outputFileSync } from "fs-extra";
import { readDirRecursive } from "ystd_server";
import { Dirent } from "fs";

import { anyJson, array, constant, Decoder, number, object, oneOf, optional, string } from "@mojotech/json-type-validation";

export type LootTableFileType =
    | "minecraft:block"
    | "minecraft:chest"
    | "minecraft:entity"
    | "minecraft:gift"
    | "minecraft:fishing"
    | "minecraft:barter"
    | "minecraft:advancement_reward"
    | undefined;
export const decoderLootTableFileType: Decoder<LootTableFileType> = optional(
    oneOf(
        constant("minecraft:block"),
        constant("minecraft:chest"),
        constant("minecraft:entity"),
        constant("minecraft:gift"),
        constant("minecraft:fishing"),
        constant("minecraft:barter"),
        constant("minecraft:advancement_reward"),
    ),
);

export interface LootTablePoolEmptyEntry {
    type: "minecraft:empty";
    weight?: number;
}
export const decoderLootTablePoolEmptyEntry: Decoder<LootTablePoolEmptyEntry> = object({
    type: constant("minecraft:empty"),
    weight: optional(number()),
});

export interface LootTablePoolBasicEntry {
    type: string;
    name: string;
    weight?: number;
}
export const decoderLootTablePoolBasicEntry: Decoder<LootTablePoolBasicEntry> = object({
    type: string(),
    name: string(),
    weight: optional(number()),
});

export function isLootTablePoolEntryWithName(a: LootTablePoolEntry): a is LootTablePoolBasicEntry {
    return !!(a as any).name;
}

export interface LootTablePoolEntryWithChildren {
    type: string;
    children: LootTablePoolEntry[];
    weight?: number;
}
export const decoderLootTablePoolEntryWithChildren: Decoder<LootTablePoolEntryWithChildren> = object({
    type: string(),
    children: array(anyJson()), // array(decoderLootTablePoolEntry)
    weight: optional(number()),
});

export function isLootTablePoolEntryWithChildren(a: LootTablePoolEntry): a is LootTablePoolEntryWithChildren {
    return !!(a as any).children;
}

export type LootTablePoolEntry = LootTablePoolEmptyEntry | LootTablePoolBasicEntry | LootTablePoolEntryWithChildren;
export const decoderLootTablePoolEntry: Decoder<LootTablePoolEntry> = oneOf<LootTablePoolEntry>(
    decoderLootTablePoolEmptyEntry,
    decoderLootTablePoolBasicEntry,
    decoderLootTablePoolEntryWithChildren,
);

export interface LootTablePoolCondition {
    condition: string;
    term?: any;
}
export const decoderLootTablePoolCondition: Decoder<LootTablePoolCondition> = object({
    condition: string(),
    term: optional(anyJson()),
});

export interface LootTablePool {
    rolls: any;
    bonus_rolls?: any;
    entries: LootTablePoolEntry[];
    conditions?: LootTablePoolCondition[];
}
export const decoderLootTablePool: Decoder<LootTablePool> = object({
    rolls: anyJson(),
    bonus_rolls: optional(anyJson()),
    entries: array(decoderLootTablePoolEntry),
    conditions: optional(array(decoderLootTablePoolCondition)),
});

export interface LootTableFile {
    type: LootTableFileType;
    pools?: LootTablePool[];
}

export const decoderLootTableFile: Decoder<LootTableFile> = object({
    type: decoderLootTableFileType,
    pools: optional(array(decoderLootTablePool)),
});

const problemMaterials: { [key: string]: string } = {
    gold: "gold",
    iron: "iron",
    steel: "steel",
    diamond: "diamond",
    netherite: "netherite",
};

const skipWords = ["button", "door", "fence", ""];

const problemWordWithNuggetValue: { [key: string]: number } = {
    pickaxe: 3 * 9,
    axe: 3 * 9,
    hoe: 2 * 9,
    sword: 2 * 9,
    shovel: 9,
    armor: 8 * 9,
    chestplate: 8 * 9,
    leggins: 5 * 9,
    boots: 4 * 9,
    helm: 5 * 9,
    ingot: 9,
    nugget: 1,
    block: 9 * 9,
    ore: 9,
    raw: 9,
    diamond: 9,
};

const modsWhitelist = new Set([
    "securitycraft",
    "ae2",
    "artifacts",
    "biggerreactors",
    "chunkloaders",
    "comforts",
    "create",
    "createaddition",
    "customportals",
    "goldenhopper",
    "ironchest",
    "mekanism",
    "mekanismgenerators",
    "mob_grinding_utils",
    "modularrouters",
    "moreminecarts",
    "forbidden_arcanus",
    "occultism",
    "pipez",
    "plus_the_end",
    "portality",
    "prettypipes",
    "reliquary",
    "steampowered",
    "storagedrawers",
    "supercircuitmaker",
    "tradingpost",
    "tinyredstone",
    "waterstrainer",
    "wormhole",
    "rsx",
    "valhelsia_structures",
    "magistuarmory",
]);

const knownDrops: { [key: string]: "keep" | "replace" } = {
    "minecraft:deepslate_diamond_ore": "replace",
    "minecraft:diamond": "replace",
    "minecraft:deepslate_gold_ore": "replace",
    "minecraft:raw_gold": "replace",
    "minecraft:deepslate_iron_ore": "replace",
    "minecraft:raw_iron": "replace",
    "minecraft:diamond_block": "replace",
    "minecraft:diamond_ore": "replace",
    "minecraft:gold_nugget": "replace",
    "minecraft:gold_block": "replace",
    "minecraft:gold_ore": "replace",
    "minecraft:iron_bars": "keep",
    "minecraft:iron_block": "replace",
    "minecraft:iron_door": "keep",
    "minecraft:iron_ore": "replace",
    "minecraft:iron_trapdoor": "keep",
    "minecraft:netherite_block": "replace",
    "minecraft:nether_gold_ore": "replace",
    "minecraft:raw_gold_block": "replace",
    "minecraft:raw_iron_block": "replace",
    "minecraft:golden_apple": "keep",
    "minecraft:enchanted_golden_apple": "keep",
    "minecraft:iron_pickaxe": "replace",
    "minecraft:iron_ingot": "replace",
    "minecraft:gold_ingot": "replace",
    "minecraft:golden_sword": "replace",
    "minecraft:golden_chestplate": "replace",
    "minecraft:golden_helmet": "replace",
    "minecraft:golden_leggings": "replace",
    "minecraft:golden_boots": "replace",
    "minecraft:golden_axe": "replace",
    "minecraft:iron_nugget": "replace",
    "minecraft:diamond_shovel": "replace",
    "minecraft:diamond_pickaxe": "replace",
    "minecraft:netherite_scrap": "keep",
    "minecraft:golden_carrot": "keep",
    "minecraft:iron_sword": "replace",
    "minecraft:netherite_ingot": "replace",
    "minecraft:diamond_sword": "replace",
    "minecraft:diamond_chestplate": "replace",
    "minecraft:diamond_helmet": "replace",
    "minecraft:diamond_leggings": "replace",
    "minecraft:diamond_boots": "replace",
    "minecraft:iron_horse_armor": "keep",
    "minecraft:golden_horse_armor": "keep",
    "minecraft:diamond_horse_armor": "keep",
    "minecraft:iron_boots": "replace",
    "minecraft:iron_chestplate": "replace",
    "minecraft:iron_leggings": "replace",
    "minecraft:iron_helmet": "replace",
    "minecraft:iron_shovel": "replace",
    "minecraft:flint_and_steel": "keep",
    "minecraft:golden_hoe": "replace",
    "minecraft:golden_shovel": "replace",
    "minecraft:golden_pickaxe": "replace",
    "minecraft:diamond_hoe": "replace",
    "minecraft:iron_axe": "replace",
    "minecraft:diamond_axe": "replace",
    "farmersdelight:diamond_knife": "replace",
    "farmersdelight:golden_knife": "replace",
    "farmersdelight:iron_knife": "replace",
    "minecraft:iron_hoe": "replace",
};

const replacementItems: { [key: string]: { [key: number]: string } } = {
    gold: {
        20: "create:zinc_block",
        9: "minecraft:pointed_dripstone",
        1: "create:andesite_alloy",
    },
    iron: {
        20: "create:zinc_block",
        9: "create:zinc_ore",
        1: "create:andesite_alloy",
    },
    steel: {
        20: "create:zinc_block",
        9: "create:zinc_block",
        1: "create:zinc_ore",
    },
    diamond: {
        20: "create:zinc_block",
        9: "create:brass_ingot",
        1: "create:brass_ingot",
    },
    netherite: {
        20: "minecraft:netherite_scrap",
        9: "minecraft:netherite_scrap",
        1: "minecraft:netherite_scrap",
    },
};

function makeReplaceWithMappings() {
    const r: any = {};
    for (const dropName in knownDrops) {
        if (knownDrops[dropName] === "replace") {
            let nuggetsValue = 1;
            for (const word in problemWordWithNuggetValue) {
                const c = problemWordWithNuggetValue[word];
                if (dropName.includes(word) && c > nuggetsValue) {
                    nuggetsValue = c;
                }
            }

            let material = "iron";
            for (const k in problemMaterials) {
                if (dropName.includes(k)) {
                    material = problemMaterials[k];
                }
            }

            let nuggetsValueCategory = 1;
            if (nuggetsValue >= 9) {
                nuggetsValueCategory = 9;
            }

            if (nuggetsValue >= 20) {
                nuggetsValueCategory = 20;
            }

            let replacementItem = replacementItems[material][nuggetsValueCategory] || "create:andesite_alloy";
            r[dropName] = replacementItem;
        }
    }
    return r;
}

export function loadLootTables() {
    const allDrops: any = {};
    const allModsWithDrops: Set<string> = new Set();
    const allLootTableTypes: Set<string> = new Set();
    const problemFiles: Set<string> = new Set();

    iterateSourceJsonPaths(({fullPath, dirent}) => {
        if (fullPath.includes("\\loot_tables\\") && !dirent.isDirectory() && fullPath.endsWith(".json")) {
            const contentStr = readFileSync(fullPath, "utf-8");
            const parsed: LootTableFile = JSON.parse(contentStr);
            (parsed as any).__y_file_path = fullPath;

            if (parsed.type === undefined || parsed.type.startsWith("minecraft:")) {
                try {
                    decoderLootTableFile.runWithException(parsed);
                } catch (e: any) {
                    console.log(fullPath);
                    console.log(parsed);
                    console.error(e);
                    console.log("");
                }
            }

            allLootTableTypes.add(parsed.type || "undefined");
            if (!parsed.type || !["minecraft:block"].includes(parsed.type)) {
                for (const pool of parsed.pools || []) {
                    for (const entry of allEntriesRecursive(pool.entries)) {
                        if (isLootTablePoolEntryWithName(entry)) {
                            const modName = entry.name.split(":")[0];

                            if (!allDrops[entry.name]) {
                                allDrops[entry.name] = [];
                            }
                            allDrops[entry.name].push(parsed);
                        }
                    }
                }
            }
        }
    });

    //    console.log(allLootTableTypes);

    for (const name of Object.keys(allDrops)) {
        let needsAttension = false;
        let material: string = "UNKNOWN";
        const modName = name.split(":")[0];
        allModsWithDrops.add(modName);

        if (!modsWhitelist.has(modName)) {
            for (const m of Object.keys(problemMaterials)) {
                if (name.includes(m)) {
                    needsAttension = true;
                    material = m;
                }
            }

            for (const m of Object.keys(problemMaterials)) {
                if (name.includes(m)) {
                    needsAttension = true;
                    material = m;
                }
            }

            if (needsAttension && material === "UNKNOWN") {
                material = name.split(":")[1].split("_")[0] || "UNKNOWN";
            }

            if (needsAttension && !knownDrops[name]) {
                const tableSamples = allDrops[name];
                if (Object.keys(tableSamples).length > 100000) {
                    console.log("");
                }
                console.log(`"${name}": ${needsAttension ? "WARN_" + material : "undefinded"},`);
            }

            if (knownDrops[name] === "replace") {
                const tableSamples = allDrops[name];
                for (const tableSample of tableSamples) {
                    problemFiles.add((tableSample as any).__y_file_path);
                }

                if (Object.keys(tableSamples).length > 100000) {
                    console.log("");
                }
            }
        }
    }

    // Show all mods with drops
    // for (const modWithDrops of allModsWithDrops) {
    //     console.log(modWithDrops);
    // }

    const replacementMappings = makeReplaceWithMappings();
    // console.log(replacementMappings);

    function replaceAll(s: string) {
        for (const k in replacementMappings) {
            const v = replacementMappings[k];
            s = s.split(JSON.stringify(k)).join(JSON.stringify(v));
        }
        return s;
    }

    // Show all problem files and replace all recipes

    iterateSourceJsonPaths(({fullPath, dirent}) => {
        if (!dirent.isDirectory() && fullPath.endsWith('.json')) {
            if (fullPath.includes("dungeoncrawl") && fullPath.includes("treasure")) {
                problemFiles.add(fullPath);
            }
        }
    });

    for (const problemFile of problemFiles) {
        const oldContent = readFileSync(problemFile, "utf-8");
        const targetFile = `G:\\G\\Minecraft\\kubejs\\data\\` + problemFile.split(`\\data\\`)[1];
        const newContent = replaceAll(oldContent);
        outputFileSync(targetFile, newContent, "utf-8");
        if(!targetFile || targetFile.includes('undefined')) {
            console.log(targetFile);
        }
        console.log(targetFile);
    }
}

export function allEntriesRecursive(entries: LootTablePoolEntry[], allEntries: LootTablePoolEntry[] = []): LootTablePoolEntry[] {
    for (const entry of entries) {
        allEntries.push(entry);
        if (isLootTablePoolEntryWithChildren(entry)) {
            allEntriesRecursive(entry.children, allEntries);
        }
    }
    return allEntries;
}

export function lootTablesStats() {}
