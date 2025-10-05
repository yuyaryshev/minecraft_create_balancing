interface FindPathContext {
    results: string[][];
    lookingfor: string;
}

function findPathIncludes_recursive(c: FindPathContext, json: any, path: string[] = []) {
    for (let k in json) {
        if (typeof json[k] === "object") {
            findPathIncludes_recursive(c, json[k], [...path, k]);
        } else {
            if ((json[k] + "").toLocaleLowerCase().includes(c.lookingfor)) {
                c.results.push([...path, k]);
            }
        }
    }
}
export function findPathsThatInclude(json: any, lookingfor: string): string[][] {
    const c: FindPathContext = { lookingfor: lookingfor.toLowerCase(), results: [] };
    findPathIncludes_recursive(c, json, []);
    return c.results;
}

export function printPathsThatInclude(json: any, lookingfor: string): void {
    for (let r of findPathsThatInclude(json, lookingfor)) {
        console.log(`CODE00000008 ${r.join("/")}`);
    }
}
