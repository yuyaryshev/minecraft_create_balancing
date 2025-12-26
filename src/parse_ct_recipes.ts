/*
ChatGPT please help me with this little parser.
I need your help only with one function below, I've marked that with a comment.

Please use markers.lineRecipeName constants to implement it.
Also don't hardcode any line positions and sizes, but instead just split the input with privided constants and maybe commas.

If that's possible - use regexp to do in single split.

*/

import { mcAllPaths } from "./minecraft_paths.js";
import { outputFileSync, outputJsonSync, readFileSync, readJsonSync } from "fs-extra";
import { findPathsThatInclude, printPathsThatInclude } from "./json_utils.js";
import JSON5 from "json5";
import { multiSplit, MultiSplitKeys } from "./multiSplit.js";

const markers = {
    dumpStart: `[INFO][CraftTweaker-Commands]: Dumping all recipes!`,
    dumpEnd: `[INFO][CraftTweaker-Commands]: Recipe List list generated!`,
    recipeType: `[INFO][CraftTweaker-Commands]: Recipe type:`,
    lineRecipeName: {
        recipeId: { keys: `~~ Recipe name:` },
        outputs: { keys: `, Outputs:` },
        inputs: { keys: `, Inputs:` },
        recipeClass: { keys: `, Recipe Class:` },
        recipeSerializer: { keys: `, Recipe Serializer:` },
        end: { keys: `~~\n` },
    },
    lineCraftingTableShaped: {
        recipeId: { keys: `craftingTable.addShaped(` },
        // outputs: { keys: `, Outputs:` },
        // inputs: { keys: `, Inputs:` },
        // recipeClass: { keys: `, Recipe Class:` },
        // recipeSerializer: { keys: `, Recipe Serializer:` },
        end: { keys: `\n` },
    },
    lineCraftingTableShapeless: {
        recipeId: { keys: `craftingTable.addShapeless(` },
        // outputs: { keys: `, Outputs:` },
        // inputs: { keys: `, Inputs:` },
        // recipeClass: { keys: `, Recipe Class:` },
        // recipeSerializer: { keys: `, Recipe Serializer:` },
        end: { keys: `\n` },
    },
    lineFurnaceAddRecipe: {
        recipeId: { keys: `furnace.addRecipe(` },
        // outputs: { keys: `, Outputs:` },
        // inputs: { keys: `, Inputs:` },
        // recipeClass: { keys: `, Recipe Class:` },
        // recipeSerializer: { keys: `, Recipe Serializer:` },
        end: { keys: `\n` },
    },
};

export interface Recipe0 {
    line: string;
    recipeId: string;
    outputs: string;
    inputs: string;
    recipeClass: string;
    recipeSerializer?: string;
}

export function parse_ct_recipes() {
    const fileContents = readFileSync(
        `G:\\G_minecraft\\minecraft\\minecraft_prism_launcher_ely_by\\instances\\yy_modpack_1_20_forge\\minecraft\\logs\\crafttweaker_bak.log`,
        "utf-8",
    );

    const dumps0 = fileContents.split(markers.dumpEnd);
    const dump0 = dumps0[dumps0.length - 2]; // Get last dump
    const dump = dump0.split(markers.dumpStart).slice(-1)[0];

    const recipeTypeDumpParts = dump.split(markers.recipeType);
    recipeTypeDumpParts.shift();

    const recipes: Recipe0[] = [];
    for (let recipeTypeDumpPart of recipeTypeDumpParts) {
        const recipesFromThisPart = parse_ct_recipeTypePart(recipeTypeDumpPart);
        recipes.push(...recipesFromThisPart);
    }

    const filtered = recipes.filter((r) => {
        // const b = r.line.includes(`create`) && r.inputs.includes("iron_sheet");

        const b1 = r.line.includes(`create`);
        const b5 = r.inputs.includes("iron") && !r.outputs.includes("iron");

        // const b21 = r.line.includes(`<tag:items:forge:ingots/iron>`);
        // const b22 = r.line.includes(`<tag:items:forge:plates/iron>`);
        // const b23 = r.line.includes(`<tag:items:forge:nuggets/iron>`);
        // const b24 = r.line.includes(`<tag:items:forge:storage_blocks/iron>`);

        // const b = b1 && (b21 || b22 || b23 || b24);

        const b = b1 && b5;

        if (
            r.line.includes(`dieselgenerators`) ||
            r.line.includes(`create_sa:`) ||
            r.line.includes(`enchantment`) ||
            r.line.includes(`createmetallurgy:`) ||
            r.line.includes(`:energising/`) ||
            r.line.includes(`:pressing/`) ||
            r.line.includes(`stoneCutter.`) ||
            r.line.includes(`reinforced_motor`) ||
            r.line.includes(`elevator_pulley`) ||
            r.line.includes(`diamond_drill`) ||
            r.line.includes(`golden_drill`) ||
            r.line.includes(`iron_drill`) ||
            r.line.includes(`create:mixing/andesite_alloy`) ||
            r.line.includes(`create:crafting/materials/andesite_alloy`)
            // -----------------
            // r.line.includes(`create_vibrant_vaults:`)
        ) {
            return false;
        }

        // <tag:items:forge:ingots/iron>
        // <tag:items:forge:plates/iron>
        return b;
    });

    const filteredLines = filtered.map((r) => r.line);
    filteredLines.sort();
    console.log(`CODE00000078 filteredLines = \n`, filteredLines.join("\n"));
    console.log(`CODE00000079 filtered.length = \n`, filtered.length);
    //console.log(`CODE00000080 `, recipes, filtered);
    return;
}

function parse_ct_recipeTypePart(inputStr: string) {
    const lines = inputStr.split("\n");
    const recipeType0 = lines.shift();

    const recipes: Recipe0[] = [];
    for (let line of lines) {
        if (line.length < 20) {
            continue;
        }
        if (line.includes(`[WARN]`)) {
            continue;
        }

        const r = parse_ct_recipe_line(line);
        if (r) {
            recipes.push(r);
        }
    }
    return recipes;
}

const prefixes = new Set();
function parse_ct_recipe_line(line: string) {
    const r = parse_ct_recipe_line__recipe_name(line) || parse_ct_recipe_line__simplePrefixed(line);
    if (!r) {
        debugger;
        const prefix = line.split("(")[0] + "(";
        if (!prefixes.has(prefix)) {
            prefixes.add(prefix);
            console.log(JSON5.stringify([...prefixes]));
            debugger;
        }
    }

    return r;
}

function parse_ct_recipe_line__recipe_name(line: string): Recipe0 | undefined {
    if (!line.trim().startsWith(markers.lineRecipeName.recipeId.keys)) {
        return undefined;
    }

    const r: any = multiSplit(line, markers.lineRecipeName);
    r.line = line;
    return r;
}

function parse_ct_recipe_line__simplePrefixed(line0: string): Recipe0 | undefined {
    const line = line0.trim();
    const prefixes: any = {
        shaped: `craftingTable.addShaped(`,
        shapeless: `craftingTable.addShapeless(`,
        furnace: `furnace.addRecipe(`,
        blastFurnace: `blastFurnace.addRecipe(`,
        campfire: `campfire.addRecipe(`,
        farmersdelight_cooking: `<recipetype:farmersdelight:cooking>.addRecipe(`,
        stoneCutter: `stoneCutter.addRecipe(`,
        smithingTransform: `smithing.addTransformRecipe(`,
        smithingTrim: `smithing.addTrimRecipe(`,
        smoker: `smoker.addRecipe(`,
        farmersdelight_cutting: `<recipetype:farmersdelight:cutting>.addRecipe(`,
    };

    for (let k in prefixes) {
        const prefix = prefixes[k];
        if (line.startsWith(prefix)) {
            const s1 = line.slice(prefix.length);
            const [recipeId, outputs, ...other0] = s1.split(",");
            const inputs = other0.join(",");
            const r: Recipe0 = { recipeId, inputs, outputs, recipeClass: k, line };
            return r;
        }
    }
}

parse_ct_recipes();

/*
Example of input text for this parser:

[09:37:57.291][INFO][CraftTweaker-Commands]: Dumping all recipes!
[09:37:57.648][INFO][CraftTweaker-Commands]: Recipe type: '<recipetype:create:compacting>'
  ~~ Recipe name: create_blaze_burner_fuels:charcoal_briquette_compacting, Outputs: <item:create_blaze_burner_fuels:charcoal_briquettes> * 9, Inputs: [<item:minecraft:charcoal>, <item:minecraft:charcoal>, <item:minecraft:charcoal>, <item:minecraft:clay_ball>, <item:minecraft:wheat>], Recipe Class: com.simibubi.create.content.kinetics.mixer.CompactingRecipe, Recipe Serializer: create:compacting ~~
  ~~ Recipe name: create_blaze_burner_fuels:coal_briquette_compacting, Outputs: <item:create_blaze_burner_fuels:coal_briquettes> * 9, Inputs: [<item:minecraft:coal>, <item:minecraft:coal>, <item:minecraft:coal>, <item:minecraft:clay_ball>, <item:minecraft:wheat>], Recipe Class: com.simibubi.create.content.kinetics.mixer.CompactingRecipe, Recipe Serializer: create:compacting ~~
  ~~ Recipe name: create:compacting/andesite_from_flint, Outputs: <item:minecraft:andesite>, Inputs: [<item:minecraft:flint>, <item:minecraft:flint>, <item:minecraft:gravel>], Recipe Class: com.simibubi.create.content.kinetics.mixer.CompactingRecipe, Recipe Serializer: create:compacting ~~
  ~~ Recipe name: create:compacting/blaze_cake, Outputs: <item:create:blaze_cake_base>, Inputs: [<tag:items:forge:eggs>, <item:minecraft:sugar>, <item:create:cinder_flour>], Recipe Class: com.simibubi.create.content.kinetics.mixer.CompactingRecipe, Recipe Serializer: create:compacting ~~
  ~~ Recipe name: create_central_kitchen:compacting/cake, Outputs: <item:minecraft:cake>, Inputs: [<tag:items:forge:eggs>, <item:minecraft:sugar>, <item:minecraft:sugar>, <tag:items:forge:flour/wheat>, <tag:items:forge:flour/wheat>, <tag:items:forge:flour/wheat>], Recipe Class: com.simibubi.create.content.kinetics.mixer.CompactingRecipe, Recipe Serializer: create:compacting ~~
  ~~ Recipe name: create:compacting/cake_mold, Outputs: <item:ratatouille:cake_mold>, Inputs: [<item:create:iron_sheet>, <item:create:iron_sheet>, <item:create:iron_sheet>], Recipe Class: com.simibubi.create.content.kinetics.mixer.CompactingRecipe, Recipe Serializer: create:compacting ~~

[09:37:57.649][INFO][CraftTweaker-Commands]: Recipe type: '<recipetype:createbigcannons:melting>'
  ~~ Recipe name: createbigcannons:melting/melt_bronze_nugget, Outputs: <item:minecraft:air>.withTag({Damage: 0, Potion: "minecraft:water_breathing"}), Inputs: [<tag:items:createbigcannons:nugget_bronze>], Recipe Class: rbasamoyai.createbigcannons.crafting.foundry.MeltingRecipe, Recipe Serializer: createbigcannons:melting ~~
  ~~ Recipe name: createbigcannons:melting/melt_cast_iron_block, Outputs: <item:minecraft:air>.withTag({Damage: 0, Potion: "minecraft:water_breathing"}), Inputs: [<tag:items:createbigcannons:block_cast_iron>], Recipe Class: rbasamoyai.createbigcannons.crafting.foundry.MeltingRecipe, Recipe Serializer: createbigcannons:melting ~~
  ~~ Recipe name: createbigcannons:melting/melt_cast_iron_ingot, Outputs: <item:minecraft:air>.withTag({Damage: 0, Potion: "minecraft:water_breathing"}), Inputs: [<tag:items:createbigcannons:ingot_cast_iron>], Recipe Class: rbasamoyai.createbigcannons.crafting.foundry.MeltingRecipe, Recipe Serializer: createbigcannons:melting ~~
  ~~ Recipe name: createbigcannons:melting/melt_cast_iron_nugget, Outputs: <item:minecraft:air>.withTag({Damage: 0, Potion: "minecraft:water_breathing"}), Inputs: [<tag:items:createbigcannons:nugget_cast_iron>], Recipe Class: rbasamoyai.createbigcannons.crafting.foundry.MeltingRecipe, Recipe Serializer: createbigcannons:melting ~~

[09:37:57.650][INFO][CraftTweaker-Commands]: Recipe List list generated! Check the logs/crafttweaker.log file!




*/
