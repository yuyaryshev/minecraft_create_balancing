import { readFileSync, outputFileSync, writeFileSync } from "fs-extra";
import { readDirRecursiveToStrArray } from "ystd_server";
import { items_tagging_strings } from "./items_tagging_strings.js";
const paths = {
    itemIds: `D:\\b\\Mine\\GIT_Work\\minecraft\\minecraft_create_balancing\\items_and_tags\\item_ids.txt`,
    itemIdsByLLM: `D:\\b\\Mine\\GIT_Work\\minecraft\\minecraft_create_balancing\\items_and_tags\\item_ids_by_llm.txt`,
    itemIdsOut: `D:\\b\\Mine\\GIT_Work\\minecraft\\minecraft_create_balancing\\items_and_tags\\item_ids_out.txt`,
    itemIdsMarked: `D:\\b\\Mine\\GIT_Work\\minecraft\\minecraft_create_balancing\\items_and_tags\\item_ids_marked.js`,
    taggingScriptsDir: `G:\\G_minecraft\\minecraft\\minecraft_prism_launcher_ely_by\\instances\\yy_modpack_1_20_forge\\minecraft\\kubejs\\server_scripts`,
};

const markers = {
    start: `ServerEvents.tags('item', event => {`,
    end: `});`,
    lineBeginning: `event.add('yyitems:`,
    lineSplitter: `'`,
};

export function items_tagging() {
    const itemIdsStr = readFileSync(paths.itemIds, "utf-8");
    const itemIds = itemIdsStr
        .split("\n")
        .map((s) => s.split(".withTag")[0].trim())
        .filter((s) => s.length);
    const itemIdsOut = new Set<string>(itemIds);
    const taggedItemIts = new Set<string>();

    const itemIdsByLLMStr = readFileSync(paths.itemIdsByLLM, "utf-8");
    const itemIdsByLLM_lines = itemIdsByLLMStr.split("\n").map((s) => {
        itemIdsOut.delete(s.trim());
        return s.trim();
    });

    const scriptPaths = readDirRecursiveToStrArray(paths.taggingScriptsDir).filter((s) => s.includes("\\yy_tags_") && s.endsWith(".js"));
    for (let scriptPath of scriptPaths) {
        const scriptContentStr = readFileSync(scriptPath, "utf-8");

        const scriptContentStr1 = scriptContentStr.split(markers.start)[1];
        const scriptContentStr2 = scriptContentStr1.split(markers.end)[0].trim();
        const lines = scriptContentStr2
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s.startsWith(markers.lineBeginning));

        for (let line of lines) {
            const itemId = line.split("'").slice(-2)[0].trim();
            taggedItemIts.add(itemId);
            itemIdsOut.delete(itemId);
        }
    }

    //removeOtherMods(itemIdsOut);

    const newTaggedItemIdsStrs: string[] = tagNewItemIds(itemIdsOut);
    newTaggedItemIdsStrs.sort();

    console.log(`CODE00000066 Writing to '${paths.itemIdsOut}'`);
    writeFileSync(paths.itemIdsOut, promt + [...itemIdsOut].join("\n"), "utf-8");

    console.log(`CODE00000067 Writing to '${paths.itemIdsMarked}'`);
    writeFileSync(paths.itemIdsMarked, newTaggedItemIdsStrs.join("\n"), "utf-8");
}

function tagNewItemIds(itemIdsOut: Set<string>): string[] {
    const r: string[] = [];
    for (let itemId of itemIdsOut) {
        const tag = tagItemId(itemId);
        if (tag !== undefined) {
            r.push(`event.add('yyitems:${tag}', '${itemId}');`);
            itemIdsOut.delete(itemId);
        }
    }
    return r;
}

function tagItemId(itemId: string): string | undefined {
    for (let tag in items_tagging_strings) {
        for (let p of (items_tagging_strings as any)[tag]) {
            const itemIdW = "_" + itemId.split(":").join("_").split("/").join("_") + "_";
            if (itemIdW.includes("_" + p + "_")) {
                if (tag === "ddd") {
                    for (let tag2 in items_tagging_strings) {
                    }
                }
                return tag;
            }
        }
    }
}

const mods = new Set([
    "create",
    "create_connected",
    "createbigcannons",
    "create_new_age",
    "create_new_age_accumulators",
    "create_pneuequip",
    "create_factory_logistics",
    "create_enchantment_industry",
    "create_fantasizing",
    "create_sa",
    "create_refilling_boxes",
    "create_mobile_packages",
    "create_cultivation",
    "create_blaze_burner_fuels",
    "create_tools_n_weapons",
    "create_power_loader",
    "create_jetpack",
    "create_high_pressure",
    "create_pattern_schematics",
    "create_mechanical_extruder",
    "create_central_kitchen",
    "createsifter",
    "createmetallurgy",
    "createdieselgenerators",
    "createenderlink",
    "createcobblestone",
    "createfood", // production-type automation
    "mechanical_botany", // automation of Botania processes
    "botania",
    "aiotbotania",
    "supplementaries",
    "suppsquared",
    "extra_gauges",
    "projectred_core",
    "projectred_integration",
    "projectred_transmission",
    "projectred_fabrication",
    "redstonepen",
    "toms_storage",
    "storagedrawers",
    "drill_drain",
    "sliceanddice",
    "balancedflight",
    "delivery_director",
    "create_factory_logistics",
    "escalated",
]);

function removeOtherMods(itemIdsOut: Set<string>): void {
    for (let itemId of itemIdsOut) {
        const mod = itemId.split(":")[0].trim();
        if (!mods.has(mod)) {
            itemIdsOut.delete(itemId);
        }
    }
}

const promt =
    `Hi, ChatGPT! I need your help in classifying items for my minecraft modpack.
Please output exactly in this format:
// aaa
item_id
item_id
item_id

// bbb
item_id
item_id
item_id

You can skip empty categories. You can make additional list for a category if you forgot to add something. My categories are isolated, have no intersections - that is if an item belongs to one category it can't belong to another
My categories:
ddd - decorations, variations and itermediates. Decoration blocks (like chiseled) and items (like cosmetic baubles), misc items that has no recipe like monster spawn eggs and buckets of all fluids, monster heads.
\tAnd variations - all items of different colors or wood types except for the first/main one. For example Create have brown_toolbox - that is crafted. And then one can dye toolbox into different colors.
\tbrown_toolbox should go to ccc, and all other colors - to ddd. Drawers - also have many woods variants. Oak wood variants should go to ccc and all the rest to ddd.
\tAlso metals (blocks, nuggets, ingots) go here and other intermediate products that are not be used directly for automation. 
bbb - botania automation (only non decorative items: exclude decorative baubles and initial flowers and dyes)
ccc - automation & storage (create machines, pistons, etc, but not decorative blocks and variations)
rrr - redstone and signal processing
ttt - tools including Paxels, AIOTs and multitools
www - weapons - excluding tools (ttt)
aaa - armor
fff - food and food only - items that player can eat directly. Not kitchen tools, not food ingredients.
ooo - other - put here all that you don't know, can't classify or goes to many categories.

Below is list of item ids to be categorized. Please use only them, dont generate your own even if some categories are left empty (because this is only part of the list, and all the rest will be categorized in other promts).
`.trim() + `\n\n`;

items_tagging();
