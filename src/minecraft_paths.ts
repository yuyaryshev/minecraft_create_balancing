import { join as joinPath } from "path";
import { readFile, readFileSync, outputFileSync } from "fs-extra";
import { readDirRecursive } from "ystd_server";
import { Dirent } from "fs";
import { parse } from "json5";

const sourceJsonPaths = [`g:\\g\\minecraft\\mods_tables`];
const allJsonPaths = [...sourceJsonPaths, "g:\\g\\minecraft\\kubejs\\data"];

export type JsonCallback = (param: JsonCallbackParam) => boolean | void | undefined;
export type JsonCallbackWithContent = (param: JsonCallbackParamWithContent) => boolean | void | undefined;

interface JsonCallbackParam0 {
    basePath: string;
    isSourcePath: boolean;
    fullPath: string;
    dirent: Dirent;
}

export interface JsonCallbackParam extends JsonCallbackParam0 {
    relPathStr: string;
    relDirArr: string[];
    modFile: string; // '1.18.2-forge-40.1.30'
    modFolder: string; // 'minecraft', 'create', ...
    collectionName: string; // 'assets
    fileCat: string; // 'recipes', 'blockstates'
    fileSubCat: string; // 'smelting', 'cutting'

    fullFileId: string;
    fileName: string;
    fileNameWithExt: string;
}

function enrichJsonParam(p: JsonCallbackParam0): JsonCallbackParam {
    const relPathStr = p.fullPath.substr(p.basePath.length + 1);
    const relPathArr = relPathStr.split("\\");
    const fileNameWithExt = relPathArr[relPathArr.length - 1];
    const fileName = relPathArr[relPathArr.length - 1].split(".").slice(0, -1).join(".");

    const relDirArr = relPathArr.slice(0, -1);
    const modFile = relDirArr[0];
    const modFolder = relDirArr[2];
    const collectionName = relDirArr[1];
    const fileCat = relDirArr[3];
    const fileSubCat = relDirArr[4];
    const fullFileIdArr = [...relDirArr.slice(4)];
    fullFileIdArr.push(fileName);
    const fullFileId = `${modFolder}:${fullFileIdArr.join("/")}`;
    return {
        ...p,
        modFile,
        modFolder,
        collectionName,
        fileCat,
        fileSubCat,
        relDirArr,
        relPathStr,
        fullFileId,
        fileName,
        fileNameWithExt,
    };
}

export interface JsonCallbackParamWithContent extends JsonCallbackParam {
    contentStr: string;
    content: any;
}

export function enrichJsonParamWithContent(p0: JsonCallbackParam0): JsonCallbackParamWithContent {
    const p = enrichJsonParam(p0);
    const contentStr = readFileSync(p0.fullPath, "utf-8");
    let content;
    let additionalFields: any = {};
    try {
        content = parse(contentStr);
        additionalFields.name = content.name;
        additionalFields.type = content.type;
        additionalFields.result = content.result;
        additionalFields.resultName = content.result?.item;
    } catch (e: any) {}

    return {
        ...additionalFields,
        ...p,
        contentStr,
        content,
    };
}

export function iterateAllJsonPaths(callback: JsonCallback) {
    for (const basePath of allJsonPaths) {
        const isSourcePath = sourceJsonPaths.includes(basePath);
        readDirRecursive(basePath, (path: string, dirent: Dirent) => {
            const fullPath = joinPath(path, dirent.name);
            if (!dirent.isDirectory() && fullPath.endsWith(".json")) {
                return callback(enrichJsonParam({ basePath, fullPath, dirent, isSourcePath }));
            }
        });
    }
}

export function iterateSourceJsonPaths(callback: JsonCallback) {
    for (const basePath of sourceJsonPaths) {
        readDirRecursive(basePath, (path: string, dirent: Dirent) => {
            const fullPath = joinPath(path, dirent.name);
            if (!dirent.isDirectory() && fullPath.endsWith(".json")) {
                return callback(enrichJsonParam({ basePath, fullPath, dirent, isSourcePath: true }));
            }
        });
    }
}

export function iterateSourceJsonPathsWithContent(callback: JsonCallbackWithContent) {
    for (const basePath of sourceJsonPaths) {
        readDirRecursive(basePath, (path: string, dirent: Dirent) => {
            const fullPath = joinPath(path, dirent.name);
            if (!dirent.isDirectory() && fullPath.endsWith(".json")) {
                return callback(enrichJsonParamWithContent({ basePath, fullPath, dirent, isSourcePath: true }));
            }
        });
    }
}

export type ForEachJsonCallback = (param: ForEachJsonCallbackParam) => void;
export interface ForEachJsonCallbackParam {
    jpath: string[];
    entry: any;
}

export function forEachJsonEntry(json: any, callback: ForEachJsonCallback, jpath: string[] = []) {
    if (json) {
        callback({ jpath, entry: json });
        for (let k in json) {
            if (typeof json[k] === "object") {
                forEachJsonEntry(json[k], callback, [...jpath, k]);
            }
        }
    }
}
