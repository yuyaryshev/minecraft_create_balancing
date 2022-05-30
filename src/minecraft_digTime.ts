import {digMinutesFromPerHour} from "./minecraft_recipe_utils.js";

export const digTime: any = {
    "minecraft:diamond": digMinutesFromPerHour(30),
    "minecraft:raw_iron": digMinutesFromPerHour(300),
    "minecraft:raw_copper": digMinutesFromPerHour(400),
    "minecraft:raw_gold": digMinutesFromPerHour(150),
};