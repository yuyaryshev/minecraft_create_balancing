import { digTime } from "./minecraft_digTime.js";

export interface MinecraftRecipeItem {
    item: string;
    count?: number;
}

export interface MinecraftExactRecipe {
    type: string;
    pattern: string[];
    key: {
        [key: string]: MinecraftRecipeItem;
    };
    result: MinecraftRecipeItem;
}
export function isExactRecipe(recipe: MinecraftRecipe): recipe is MinecraftExactRecipe {
    return !!(recipe as any).pattern;
}

export interface MinecraftLooseRecipe {
    type: string;
    ingredients: MinecraftRecipeItem[];
    result: MinecraftRecipeItem;
}
export function isLooseRecipe(recipe: MinecraftRecipe): recipe is MinecraftLooseRecipe {
    return !(recipe as any).pattern;
}

export type MinecraftRecipe = MinecraftExactRecipe | MinecraftLooseRecipe;

function isRaw(ingredientName: string) {
    return false;
}

function ingredientsOf(recipe: MinecraftRecipe): MinecraftRecipeItem[] {
    if (isExactRecipe(recipe)) {
        const r: MinecraftRecipeItem[] = [];
        for (const k1 in recipe.key) {
            r.push(recipe.key[k1]);
        }
        return r;
    }
    return recipe.ingredients;
}

function ingredientsToStats(ingredients: MinecraftRecipeItem[]) {
    const stats: any = {};
    for (const ingredient of ingredients) {
        stats[ingredient.item] = ingredient.count || 1;
    }
    return stats;
}

function multiplyStats(stats: any, multiplicator: number): any {
    const r: any = {};
    for (const k in stats) {
        r[k] = stats[k] * multiplicator;
    }
    return r;
}

function isRawIngredient(ingredientName: string) {
    return ingredientName.includes(":raw_");
}

function mergeStats(targetStats: any, sourceStats: any, count: number) {
    for (const k in sourceStats) {
        if (targetStats[k] === undefined) {
            targetStats[k] = sourceStats[k] * count;
        } else {
            targetStats[k] = targetStats[k] + sourceStats[k] * count;
        }
    }
}

export function digMinutesFromPerHour(ph: number): number {
    return 1.0 / (ph / 60.0);
}

export function timeStr(timeInMinutes: number) {
    if (timeInMinutes > 120) {
        return Math.round((timeInMinutes / 60) * 10) / 10 + "h";
    }

    if (timeInMinutes > 3) {
        return Math.round(timeInMinutes * 10) / 10 + "m";
    }

    return Math.round(timeInMinutes * 60 * 10) / 10 + "s";
}

export function recipesStats(recipes: MinecraftRecipe[]) {
    const statData: any = {};
    function digTimeTotals(recipeName: string) {
        const rawCounts: any = expectRawCount(recipeName);
        const digTimes: any = {};
        let totalDigTime: number = 0;
        for (const k in rawCounts) {
            if (!digTime[k]) {
                throw new Error(`CODE00000001 ${k} - no digTime for this resource!`);
            }
            digTimes[k] = rawCounts[k] * digTime[k];
            totalDigTime += digTimes[k];
        }
        const digTimeStrs: any = {};
        for (const k in digTimes) {
            digTimeStrs[k] = timeStr(digTimes[k]);
        }
        statData[recipeName] = { rawCounts, digTimes, totalDigTime, digTimeStrs, totalDigTimeStr: timeStr(totalDigTime) };
    }

    function expectRecipeByResult(recipeName: string) {
        if (recipeByResult[recipeName]) {
            return recipeByResult[recipeName];
        }
        throw new Error(`CODE00000140 Recipe for '${recipeName}' - not found!`);
    }

    function expectRawCount(recipeName: string) {
        if (recipeRawStats[recipeName]) return recipeRawStats[recipeName];

        const r = rawCountsOf(expectRecipeByResult(recipeName));
        recipeRawStats[recipeName] = r;
        return r;
    }

    function rawCountsOf(recipe: MinecraftRecipe) {
        const r: any = {};

        const ingredients = ingredientsOf(recipe);

        const stats0: any = {};
        for (const ingredient of ingredients) {
            if (isRawIngredient(ingredient.item)) {
                stats0[ingredient.item] = (stats0[ingredient.item] || 0) + (ingredient.count || 1);
            } else {
                const subStats = expectRawCount(ingredient.item);
                mergeStats(stats0, subStats, ingredient.count || 1);
            }
        }

        const stats = recipe.result.count !== undefined && recipe.result.count !== 1 ? multiplyStats(stats0, 1 / recipe.result.count) : stats0;

        // for (const ingredient of ingredients) {
        // }
        // 1 / recipe.result.count;

        recipeRawStats[recipe.result.item] = stats;
    }

    const recipeByResult: { [key: string]: MinecraftRecipe } = {};

    for (const recipe of recipes) {
        const rs = recipe.result.item;
        if (!recipeByResult[rs]) {
            recipeByResult[rs] = recipe;
        }
    }

    const recipeRawStats: any = {};

    for (const recipe of recipes) {
        rawCountsOf(recipe);
    }

    for (const recipe of recipes) {
        digTimeTotals(recipe.result.item);
    }
    return statData;
}
