import {
    enrichJsonParamWithContent,
    forEachJsonEntry,
    iterateAllJsonPaths,
    iterateSourceJsonPaths,
    iterateSourceJsonPathsWithContent,
    JsonCallbackParamWithContent,
} from "./minecraft_paths.js";
import { join as joinPath } from "path";
import { readFile, readFileSync, outputFileSync } from "fs-extra";
import { readDirRecursive } from "ystd_server";
import { Dirent } from "fs";
import {dictionariesPath} from "./constants.js";
import {getDictionaries} from "./dictionaries.js";

const fullSet = new Set();
function allJsonsMain() {
    const dicts = getDictionaries();
    console.log(dicts);
    return;
    iterateSourceJsonPaths((p0) => {
        if (p0.fileCat === "recipes") {
            const p1 = enrichJsonParamWithContent(p0);
            const { contentStr, content, ...paramToLog } = p1;
            forEachJsonEntry(content, ({ entry }) => {
                if (entry.type === "item") {
                }
            });
            // // if (fullPath.includes("\\loot_tables\\") && !dirent.isDirectory() && fullPath.endsWith(".json")) {
            // // }
            console.log(paramToLog);
        }
    });
    console.log([...fullSet].map((s) => JSON.stringify(s)).join(",\n"));
}

console.log("allJsonsMain 290758r93w4hf");
allJsonsMain();
