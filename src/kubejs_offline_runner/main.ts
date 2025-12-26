import { readFile, readFileSync, outputFileSync, readdirSync } from "fs-extra";
import { join, resolve } from "node:path";

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
}

export function kubejs_offline_runner(pathToMinecraftInstance: string, opts: KubeJsOfflineRunnerOpts) {
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

    for (let subfolder in files) {
        (files as any)[subfolder].push(...readDirFilenames(join(kubeJsFolderPath, subfolder)));
    }

    runServerScripts(files, opts);
}

interface KubejsRecipeFilter {
    id?: string;
    input?: string;
}

interface ServerEvents_recipes_Event {
    replaceInput(
        filter: KubejsRecipeFilter, // Arg 1: the filter
        f: string, // Arg 2: the item to replace
        t: string, // Arg 3: the item to replace it with
    ): void;
    remove(): void; // TODO KubeJs remove args
    shapeless(): void; // TODO KubeJs remove args
}

type ServerEvents_recipes_Callback = (event: ServerEvents_recipes_Event) => void;

function runServerScripts(files: KubeJsFiles, opts: KubeJsOfflineRunnerOpts) {
    for (let scriptPath of files.server_scripts) {
        if (opts?.scriptsFilter && !scriptPath.includes(opts.scriptsFilter)) {
            continue;
        }

        try {
            const kubejsGlobals = {
                ServerEvents: {
                    recipes: (callback: ServerEvents_recipes_Callback) => {
                        const event: ServerEvents_recipes_Event = {
                            replaceInput: (
                                filter: KubejsRecipeFilter, // Arg 1: the filter
                                f: string, // Arg 2: the item to replace
                                t: string, // Arg 3: the item to replace it with
                            ): void => {
                                // TODO replaceInput @notImplemented yet
                                console.warn(`CODE00000069 replaceInput - started!`, { filter, f, t });
                                console.warn(`CODE00000070 replaceInput - finished!`);
                            },
                            remove: (): void => {
                                // TODO remove @notImplemented yet
                                console.warn(`CODE00000071 remove - started!`);
                                console.warn(`CODE00000072 remove - finished!`);
                            },
                            shapeless: (): void => {
                                // TODO shapeless @notImplemented yet
                                console.warn(`CODE00000071 shapeless - started!`);
                                console.warn(`CODE00000072 shapeless - finished!`);
                            },
                        };
                        console.warn(`CODE00000073 ServerEvents.recipes - started!`);
                        callback(event);
                        console.warn(`CODE00000074 ServerEvents.recipes - finished!`);
                    },
                },
                Item: {
                    of: () => {
                        // TODO Item.of
                    },
                },
            };

            Object.assign(globalThis, kubejsGlobals);
            const script = require(scriptPath);
        } catch (e: any) {
            console.error(`CODE00000075 Failed to run script '${scriptPath}' because of error:\n${e.message}\n${e.stack}`);
        }
    }
}

// kubejs_offline_runner(`G:\\G_minecraft\\minecraft\\minecraft_prism_launcher_ely_by\\instances\\yy_modpack_1_20_forge\\minecraft`, {
//     scriptsFilter: "yy_replace_iron_with_andesite.js",
// });

kubejs_offline_runner(`D:\\b\\Mine\\GIT_Work\\minecraft\\minecraft_create_balancing\\KubeJsScripts_for_testing\\minecraft`, {
    scriptsFilter: "yy_replace_iron_with_andesite.js",
});
