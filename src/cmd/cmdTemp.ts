import { getDictionaries, refreshDictionaries, searchAllDictionaries } from "../dictionaries.js";
import { validateAllKubeJsScripts } from "../validate_kubejs_scripts.js";

//refreshDictionaries();
// validateAllKubeJsScripts();
// console.table(searchAllDictionaries('belt','create'));
// 'minecraft:dried_kelp_block'
// console.table(searchAllDictionaries('occultism','silver'));

type Material = "poor_raw" | "raw_nugget" | "grain";
const poor_raw_input = 100;

function furnace(amount: number, material: Material): number {
    switch (material) {
        case "poor_raw":
            return amount * 1;
        case "raw_nugget":
            return amount * 3;
    }
    throw new Error(`CODE00000000 furnace Invalid input material = ${material}`);
}

function blasting(amount: number, material: Material): number {
    switch (material) {
        case "poor_raw":
            return amount * 3;
        case "raw_nugget":
            return amount * 5;
    }
    throw new Error(`CODE00000000 blasting Invalid input material = ${material}`);
}

function melting(amount: number, material: Material): number {
    switch (material) {
        case "raw_nugget":
            return amount * 16;
        case "grain":
            return amount * 2;
    }
    throw new Error(`CODE00000000 melting Invalid input material = ${material}`);
}

function milling(amount: number): number {
    return amount * 2;
}

function crushing(amount: number): number {
    return amount * 3;
}

const two_inp: Material[] = ["poor_raw", "raw_nugget"];

const maxOutput = melting(crushing(poor_raw_input), "raw_nugget");

const results = [
    {
        name: "furnace",
        none: Math.round((100 * melting(furnace(poor_raw_input, "poor_raw"), "grain")) / maxOutput),
        milling: Math.round((100 * melting(furnace(milling(poor_raw_input), "raw_nugget"), "grain")) / maxOutput),
        crushing: Math.round((100 * melting(furnace(crushing(poor_raw_input), "raw_nugget"), "grain")) / maxOutput),
    },

    {
        name: "blasting",
        none: Math.round((100 * melting(blasting(poor_raw_input, "poor_raw"), "grain")) / maxOutput),
        milling: Math.round((100 * melting(blasting(milling(poor_raw_input), "raw_nugget"), "grain")) / maxOutput),
        crushing: Math.round((100 * melting(blasting(crushing(poor_raw_input), "raw_nugget"), "grain")) / maxOutput),
    },
    {
        name: "melting",
        none: "n/a",
        milling: Math.round((100 * melting(milling(poor_raw_input), "raw_nugget")) / maxOutput),
        crushing: Math.round((100 * melting(crushing(poor_raw_input), "raw_nugget")) / maxOutput),
    },
];

console.table(results);

const results2 = [
    {
        name: "furnace",
        none: melting(furnace(poor_raw_input, "poor_raw"), "grain"),
        milling: melting(furnace(milling(poor_raw_input), "raw_nugget"), "grain"),
        crushing: melting(furnace(crushing(poor_raw_input), "raw_nugget"), "grain"),
    },

    {
        name: "blasting",
        none: melting(blasting(poor_raw_input, "poor_raw"), "grain"),
        milling: melting(blasting(milling(poor_raw_input), "raw_nugget"), "grain"),
        crushing: melting(blasting(crushing(poor_raw_input), "raw_nugget"), "grain"),
    },
    {
        name: "melting",
        none: "n/a",
        milling: melting(milling(poor_raw_input), "raw_nugget"),
        crushing: melting(crushing(poor_raw_input), "raw_nugget"),
    },
];

console.table(results2);
