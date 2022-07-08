import { forEachJsonEntry } from "./minecraft_paths.js";
import { getDictionaries } from "./dictionaries.js";

export function checkRecipeName(s: string) {
    if (typeof s !== "string") {
        console.trace(`CODE00000009 ${s} - recipe name isn't a string!`);
        return;
    }

    if (!getDictionaries().recipeNames.has(s)) {
        console.trace(`CODE00000004 ${s} - recipe does not exist!`);
    }
}

export function checkItemName(s: string) {
    if (typeof s !== "string") {
        console.trace(`CODE00000003 ${s} - item name isn't a string!`);
        return;
    }

    if (!getDictionaries().itemNames.has(s)) {
        console.trace(`CODE00000005 ${s} - item does not exist!`);
    }
}

export function checkEntityName(s: string) {
    if (typeof s !== "string") {
        console.trace(`CODE00000006 ${s} - entity name isn't a string!`);
        return;
    }

    // For now no dictionary available, so no checks
    //
    // if (!getDictionaries().entityNames.has(s)) {
    //     console.trace(`CODE00000007 ${s} - entity does not exist!`);
    // }
}

export function checkFluidName(s: string) {
    if (typeof s !== "string") {
        console.trace(`CODE00000008 ${s} - fluid name isn't a string!`);
        return;
    }

    // For now no dictionary available, so no checks
    //
    // if (!getDictionaries().entityNames.has(s)) {
    //     console.trace(`CODE00000010 ${s} - entity does not exist!`);
    // }
}

export function checkItemNameOrTag(s: string) {
    if (typeof s !== "string") {
        console.trace(`CODE00000027 ${s} - item/tag name isn't a string!`);
        return;
    }

    if (s.startsWith("#")) {
        checkTagName(s.substr(1));
    } else {
        checkItemName(s);
    }
}

export function checkTagName(s: string) {
    if (typeof s !== "string") {
        console.trace(`CODE00000028 ${s} - tag name isn't a string!`);
        return;
    }

    if (!getDictionaries().tagNames.has(s)) {
        console.trace(`CODE00000024 ${s} - tag does not exist!`);
    }
}

export function checkMinecraftJson(input: string | object): string | undefined {
    if (typeof input === "string") {
        try {
            input = JSON.parse(input);
        } catch (e: any) {
            return e.message;
        }
    }

    forEachJsonEntry(input, ({ entry }) => {
        if (typeof entry["item"] === "string") {
            checkItemName(entry["item"]);
        }
        if (typeof entry["tag"] === "string") {
            checkTagName(entry["tag"]);
        }
    });
}
