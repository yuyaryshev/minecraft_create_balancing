import { defaultCompare } from "ystd";

export type MultiSplitKey = {
    keys: string[] | string;
    splitByCommas?: boolean;
};

export interface MultiSplitKeys {
    [key: string]: MultiSplitKey;
}

interface PSItem {
    k: string;
    st: number;
    len: number;
}

export interface MultiSplitOpts {}

export function multiSplit(s0: string, keys: MultiSplitKeys, opts?: MultiSplitOpts) {
    const r: any = {};
    let s = s0.trim() + "\n";

    const ps: PSItem[] = [];
    for (let k in keys) {
        const mk: MultiSplitKey = keys[k];

        let marks = mk.keys;
        if (!Array.isArray(marks)) {
            marks = [marks];
        }

        for (let mark of marks) {
            const st = s.indexOf(mark);
            ps.push({ k, st, len: mark.length });
        }
    }

    ps.sort((a: PSItem, b: PSItem) => defaultCompare(a.st, b.st));

    let prev = 0;
    let prevKey: string | undefined = undefined;
    for (let { k, st, len } of ps) {
        const prevStr = s.slice(prev, st);
        const mark = s.slice(st, st + len);

        if (prevKey) {
            r[prevKey] = prevStr.trim();
        }
        prevKey = k;
        prev = st + len;
    }

    for (let k in r) {
        if (keys[k].splitByCommas) {
            r[k] = r[k].split(",").map((s: string) => s.trim());
        }
    }

    return r;
}
