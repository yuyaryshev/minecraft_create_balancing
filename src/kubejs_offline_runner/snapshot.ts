import { readFileSync } from "fs-extra";
import { existsSync } from "fs";
import { outputFileSync, statSync } from "fs-extra";

export interface SnapshotMeta {
    logPath: string;
    logSize: number;
    logMtimeMs: number;
    createdAt: string;
}

export interface SnapshotRecipe {
    id: string;
    type?: string;
    outputs?: string[];
    inputs?: string[];
}

export interface SnapshotData {
    meta?: SnapshotMeta;
    items?: string[];
    tags?: Record<string, Record<string, string[]>>;
    recipeTypes?: string[];
    recipes?: SnapshotRecipe[];
    fluids?: string[];
    blocks?: string[];
}

export interface SnapshotLoadOpts {
    dumpStartMarker?: string;
    dumpEndMarker?: string;
    dumpLineMarker?: string;
}

const DEFAULT_START_MARKER = "KUBEJS_OFFLINE_DUMP_START";
const DEFAULT_END_MARKER = "KUBEJS_OFFLINE_DUMP_END";
const DEFAULT_LINE_MARKER = "KUBEJS_OFFLINE_DUMP";

export function loadOrRefreshSnapshot(
    logPath: string,
    snapshotPath: string,
    opts?: SnapshotLoadOpts,
): SnapshotData {
    const cached = readSnapshotFile(snapshotPath);
    let logStat: { size: number; mtimeMs: number } | null = null;

    try {
        logStat = statSync(logPath);
    } catch {
        if (cached) {
            return cached;
        }
        throw new Error(`Log file not found and no snapshot cache at ${snapshotPath}`);
    }

    if (
        cached?.meta &&
        cached.meta.logSize === logStat.size &&
        cached.meta.logMtimeMs === logStat.mtimeMs
    ) {
        return cached;
    }

    const logText = readFileSync(logPath, "utf8");
    const jsonText = extractSnapshotJson(logText, opts);
    const data = JSON.parse(jsonText) as SnapshotData;
    data.meta = {
        logPath,
        logSize: logStat.size,
        logMtimeMs: logStat.mtimeMs,
        createdAt: new Date().toISOString(),
    };
    outputFileSync(snapshotPath, JSON.stringify(data, null, 2));
    return data;
}

function readSnapshotFile(snapshotPath: string): SnapshotData | null {
    if (!existsSync(snapshotPath)) {
        return null;
    }

    try {
        const text = readFileSync(snapshotPath, "utf8");
        return JSON.parse(text) as SnapshotData;
    } catch {
        return null;
    }
}

function extractSnapshotJson(logText: string, opts?: SnapshotLoadOpts): string {
    const startMarker = opts?.dumpStartMarker ?? DEFAULT_START_MARKER;
    const endMarker = opts?.dumpEndMarker ?? DEFAULT_END_MARKER;
    const lineMarker = opts?.dumpLineMarker ?? DEFAULT_LINE_MARKER;

    const startIdx = logText.lastIndexOf(startMarker);
    if (startIdx >= 0) {
        const endIdx = logText.indexOf(endMarker, startIdx + startMarker.length);
        if (endIdx >= 0) {
            const raw = logText.slice(startIdx + startMarker.length, endIdx);
            return raw.trim();
        }

        const line = getLineAt(logText, startIdx);
        const afterMarker = line.slice(line.indexOf(startMarker) + startMarker.length);
        const sameLineJson = afterMarker.trim();
        if (sameLineJson.startsWith("{")) {
            return sameLineJson;
        }
    }

    const lineJson = findLineJson(logText, lineMarker);
    if (lineJson) {
        return lineJson;
    }

    throw new Error(`Snapshot JSON not found in log. Expected markers: ${startMarker}/${endMarker} or ${lineMarker}.`);
}

function getLineAt(text: string, index: number): string {
    const start = text.lastIndexOf("\n", index);
    const end = text.indexOf("\n", index);
    const lineStart = start === -1 ? 0 : start + 1;
    const lineEnd = end === -1 ? text.length : end;
    return text.slice(lineStart, lineEnd);
}

function findLineJson(text: string, marker: string): string | null {
    const lines = text.split(/\r?\n/);
    for (let i = lines.length - 1; i >= 0; i -= 1) {
        const line = lines[i];
        const idx = line.indexOf(marker);
        if (idx === -1) {
            continue;
        }
        const jsonText = line.slice(idx + marker.length).trim();
        if (jsonText.startsWith("{")) {
            return jsonText;
        }
    }
    return null;
}
