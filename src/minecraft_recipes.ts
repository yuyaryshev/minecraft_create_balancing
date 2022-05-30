import type {MinecraftRecipe} from "./minecraft_recipe_utils";

export const recipes: MinecraftRecipe[] = [
    {
        type: "minecraft:crafting_shaped",
        pattern: ["#R#", "ROR", "#R#"],
        key: {
            "#": {
                item: "minecraft:raw_iron",
            },
            R: {
                item: "minecraft:raw_copper",
            },
            O: {
                item: "minecraft:raw_gold",
            },
        },
        result: {
            item: "minecraft:spyglass",
            count: 1,
        },
    },
    {
        type: "minecraft:crafting_shapeless",
        ingredients: [
            {
                item: "minecraft:raw_iron",
            },
            {
                item: "minecraft:raw_copper",
            },
            {
                item: "minecraft:raw_iron",
            },
            {
                item: "minecraft:raw_copper",
            },
            {
                item: "minecraft:raw_gold",
            },
            {
                item: "minecraft:raw_copper",
            },
            {
                item: "minecraft:raw_iron",
            },
            {
                item: "minecraft:raw_copper",
            },
            {
                item: "minecraft:raw_iron",
            },
        ],
        result: {
            item: "minecraft:spyglass2",
            count: 1,
        },
    },
];
