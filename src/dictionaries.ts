import { outputFileSync, readdirSync, readFileSync } from "fs-extra";
import { dictionariesPath } from "./constants.js";
import { enrichJsonParamWithContent, forEachJsonEntry, iterateSourceJsonPaths } from "./minecraft_paths.js";
import { resolve } from "path";

export interface Dictionaries {
    itemNames: Set<string>;
    tagNames: Set<string>;
    recipeNames: Set<string>;
}

export interface DictionariesFile {
    itemNames: string[];
    tagNames: string[];
    recipeNames: string[];
}

let dictionaries: Dictionaries | undefined;

export function getDictionaries(): Dictionaries {
    if (dictionaries) {
        return dictionaries;
    }

    try {
        reloadDictionaries();
        return dictionaries!;
    } catch (e: any) {
        refreshDictionaries();
        reloadDictionaries();
        return dictionaries!;
    }
}

function reloadDictionaries() {
    const dictionaries0 = JSON.parse(readFileSync(dictionariesPath, "utf-8")) as DictionariesFile;
    dictionaries = {
        itemNames: new Set(dictionaries0.itemNames),
        tagNames: new Set(dictionaries0.tagNames),
        recipeNames: new Set(dictionaries0.recipeNames),
    };
}

export function refreshDictionaries() {
    console.log(`${dictionariesPath} - refreshing...`);
    const itemNames: Set<string> = new Set();
    const tagNames: Set<string> = new Set();
    const recipeNames: Set<string> = new Set();

    const glueItemsPath = resolve(
        __dirname,
        ..."../../../create_modpack_glue/build/resources/main/assets/create_modpack_glue/models/item".split("/"),
    );
    readdirSync(glueItemsPath).map((s) => itemNames.add(`create_modpack_glue:${s.split(".")[0]}`));

    iterateSourceJsonPaths((p0) => {
        if (p0.fileCat === "recipes" && p0.isSourcePath === true) {
            const p1 = enrichJsonParamWithContent(p0);
            recipeNames.add(p1.fullFileId);
            const { contentStr, content, ...paramToLog } = p1;
            forEachJsonEntry(content, ({ entry }) => {
                if (typeof entry["item"] === "string") {
                    itemNames.add(entry["item"]);
                }
                if (typeof entry["tag"] === "string") {
                    tagNames.add(entry["tag"]);
                }
            });
        }
    });

    const dictionaries: DictionariesFile = {
        tagNames: [...tagNames],
        itemNames: [...itemNames],
        recipeNames: [...recipeNames],
    };

    const dictionariesStr = JSON.stringify(dictionaries, undefined, 4);
    outputFileSync(dictionariesPath, dictionariesStr, "utf-8");
    console.log(`${dictionariesPath} - refreshed with ${itemNames.size} items, ${tagNames.size} tags, ${recipeNames.size} recipes`);
}

export function searchAllDictionaries(...partOrRegexp: (string | RegExp)[]) {
    const results: any[] = [];
    function matchesSearch(s: string): boolean {
        for (const pred of partOrRegexp) {
            if (!(typeof pred === "string" ? s.includes(pred) : !!s.match(pred))) {
                return false;
            }
        }
        return true;
    }

    const d = getDictionaries();

    for (const itemName of d.itemNames) {
        if (matchesSearch(itemName)) {
            results.push({ t: "item", n: itemName });
        }
    }

    for (const tagName of d.tagNames) {
        if (matchesSearch(tagName)) {
            results.push({ t: "tag", n: tagName });
        }
    }

    for (const recipeName of d.recipeNames) {
        if (matchesSearch(recipeName)) {
            results.push({ t: "recipe", n: recipeName });
        }
    }

    return results;
}
