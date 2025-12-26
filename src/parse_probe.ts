// Before using this run /probejs configure toggle_
// recipe_json
// registry_dumps
// registry_literals
// json_intermediates

import { mcAllPaths } from "./minecraft_paths.js";
import { outputFileSync, outputJsonSync, readFileSync, readJsonSync } from "fs-extra";
import { findPathsThatInclude, printPathsThatInclude } from "./json_utils.js";
import JSON5 from "json5";

export function parse_probe() {
    const ttt = readJsonSync(`G:\\G\\minecraft_prism_launcher_ely_by\\instances\\YYA\\minecraft\\kubejs\\probe\\cache\\yy_9746part.json`);
    console.log(`CODE00000081 `, ttt);
    return;
    const probe_mergedClassesContentStr = readFileSync(mcAllPaths.probe_mergedClasses, "utf-8");
    const probe_mergedClassesContent = JSON5.parse(probe_mergedClassesContentStr);
    const probe_mergedClassesContentPart = probe_mergedClassesContent[9746];
    outputJsonSync(
        `G:\\G\\minecraft_prism_launcher_ely_by\\instances\\YYA\\minecraft\\kubejs\\probe\\cache\\yy_9746part.json`,
        probe_mergedClassesContentPart,
    );
    // printPathsThatInclude(probe_mergedClassesContent, `minecraft:coarse_dirt`);
    // console.log(probe_mergedClassesContent);
}
parse_probe();
