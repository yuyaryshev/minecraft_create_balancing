import { readFileSync } from "fs-extra";
import { checkEntityName, checkFluidName, checkItemName, checkItemNameOrTag, checkMinecraftJson, checkRecipeName } from "./check_minecraft_json.js";
import { getDictionaries } from "./dictionaries.js";

let delayedCalls: any[][] = [[], [], [], [], [], [], [], [], [], []];
let missingEventNames: string[] = [];
export function validateKubeJsScript(pathToScript: string) {
    const scriptStr = readFileSync(pathToScript, "utf-8");

    let settings = {};
    function onEvent(eventName: string, callback: (eventObj: any) => void) {
        switch (eventName) {
            case "recipes":
                delayedCalls[4].push(() => callback(makeEventValidator_recipes()));
                break;
            case "item.tags":
                delayedCalls[2].push(() => callback(makeEventValidator_item_tags()));
                break;
            case "player.logged_in":
                delayedCalls[4].push(() => callback(makeEventValidator_player_logged_in()));
                break;
            case "entity.loot_tables":
                delayedCalls[4].push(() => callback(makeEventValidator_entity_loot_tables()));
                break;
            case "fluid.tags":
                delayedCalls[2].push(() => callback(makeEventValidator_fluid_tags()));
                break;
            case "item.modification":
                delayedCalls[4].push(() => callback(makeEventValidator_item_modification()));
                break;
            default:
                missingEventNames.push(eventName);
        }
    }

    const compiledScipt = eval(scriptStr + `\n//# sourceURL=${pathToScript}`);

    for (const c1 of delayedCalls) {
        for (const c2 of c1) {
            c2();
        }
    }
}

function eventNameToFuncName(s: string): string {
    return s.split(".").join("_");
}

function makeEventValidator_recipes() {
    return {
        remove: (obj: any) => {
            if (typeof obj.id === "string") {
                checkRecipeName(obj.id);
            }
        },
        replaceInput: (selector: any, srcIngredient: string, trgIngredient: string) => {
            if (typeof selector?.id === "string") {
                checkRecipeName(selector.id);
            }
            checkItemNameOrTag(srcIngredient);
            checkItemNameOrTag(trgIngredient);
        },
        recipes: {
            create: {
                pressing: (a: any) => {
                    checkMinecraftJson(a);
                },
                mixing: (a: any) => {
                    checkMinecraftJson(a);
                },
                milling: (a: any) => {
                    checkMinecraftJson(a);
                },
                crushing: (a: any) => {
                    checkMinecraftJson(a);
                },
            },
        },
        blasting: (result: string, ingredient: string) => {
            checkItemNameOrTag(result);
            checkItemNameOrTag(ingredient);
        },
        custom: (a: any) => {
            checkMinecraftJson(a);
        },
        shaped: (result: string, shape: string[], ingredients: any) => {
            checkItemName(result);
            let rowLength: number = shape[0].length;
            for (const row of shape) {
                if (row.length !== rowLength) {
                    console.trace(`CODE00000011 Shaped recipe ${result} has invalid shape!`);
                }
            }

            const allKeys = new Set<string>();
            for (let k of shape.join("")) {
                if (k !== " ") {
                    allKeys.add(k);
                }
            }

            for (let k of allKeys) {
                if (!ingredients[k]) {
                    console.trace(`CODE00000012 Key '${k}' is not resolved in ingredients of a shaped recipe ${result}!`);
                }
            }

            if (typeof ingredients !== "object") {
                console.trace(`CODE00000030 Ingredients should be an object!`);
            }

            for (const k in ingredients) {
                const v = ingredients[k];
                if (!allKeys.has(k)) {
                    console.trace(`CODE00000031 Ingredient '${k}' not present in shape of a shaped recipe ${result}!`);
                }
                if (typeof v === "string") {
                    checkItemNameOrTag(v);
                } else {
                    checkMinecraftJson(v);
                }
            }
        },
    };
}

function makeEventValidator_player_logged_in() {
    return {
        player: {
            give: (itemName: string) => {
                checkItemName(itemName);
            },
            stages: {
                has: () => {},
                add: () => {},
            },
        },
    };
}

function makeEventValidator_entity_loot_tables() {
    return {
        addEntity: (entityName: string, callback: any) => {
            checkEntityName(entityName);
        },
    };
}

function makeEventValidator_item_tags() {
    return {
        add: (itemName: string, tagName: string) => {
            checkItemName(itemName);
            getDictionaries().tagNames.add(tagName);
        },
    };
}

function makeEventValidator_fluid_tags() {
    return {
        add: (fluidName: string, tagName: string) => {
            checkFluidName(fluidName);
            getDictionaries().tagNames.add(tagName);
        },
    };
}

function makeEventValidator_item_modification() {
    return {
        modify: (itemName: string, callback: (item: any) => void) => {
            checkItemName(itemName);
        },
    };
}

export function validateAllKubeJsScripts() {
    validateKubeJsScript(`G:\\g\\minecraft\\kubejs\\server_scripts\\script.js`);
    validateKubeJsScript(`G:\\g\\minecraft\\kubejs\\startup_scripts\\script.js`);

    if (missingEventNames.length) {
        console.trace(`Some events doesn't have a validator!`);

        console.trace(`Add the following code to switch:`);
        console.trace(
            missingEventNames
                .map((n) => `case '${n}': delayedCalls[4].push(() => callback(makeEventValidator_${eventNameToFuncName(n)}())); break;\n`)
                .join(""),
        );

        console.trace(`Implement the functions:`);
        console.trace(
            missingEventNames
                .map(
                    (n) =>
                        `function makeEventValidator_${eventNameToFuncName(
                            n,
                        )}() {\n\tconsole.trace(\`CODE00000002 Validator for ${n} not implemented!\`);\n\treturn {};\n};\n\n`,
                )
                .join(""),
        );
    }
}

