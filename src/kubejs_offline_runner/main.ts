import { join, resolve } from "node:path";
import { loadOrRefreshSnapshot } from "./snapshot";
import { formatRunnerError } from "./errors";
import { gatherKubejsFiles, runOfflineScripts } from "./runner";

export interface CliOptions {
    instancePath: string;
    scriptsFilter?: string;
    snapshotPath?: string;
    logPath?: string;
    dumpStartMarker?: string;
    dumpEndMarker?: string;
    dumpLineMarker?: string;
}

export function kubejs_offline_runner(opts: CliOptions) {
    const instancePath = resolve(opts.instancePath);
    const logPath = opts.logPath ?? join(instancePath, "logs", "latest.log");
    const snapshotPath =
        opts.snapshotPath ?? join(instancePath, "kubejs_offline_runner", "snapshot.json");

    const snapshot = loadOrRefreshSnapshot(logPath, snapshotPath, {
        dumpStartMarker: opts.dumpStartMarker,
        dumpEndMarker: opts.dumpEndMarker,
        dumpLineMarker: opts.dumpLineMarker,
    });

    const files = gatherKubejsFiles(instancePath);
    const result = runOfflineScripts(files, snapshot, {
        scriptsFilter: opts.scriptsFilter,
    });

    if (result.errors.length > 0) {
        for (const err of result.errors) {
            console.error(formatRunnerError(err));
        }
    } else {
        console.log("KubeJS offline runner: no errors.");
    }
}

function parseArgs(argv: string[]): CliOptions | null {
    if (argv.length === 0) {
        return null;
    }

    const opts: Partial<CliOptions> = {};
    const positional: string[] = [];

    for (const arg of argv) {
        if (!arg.startsWith("--")) {
            positional.push(arg);
            continue;
        }
        const [key, value] = arg.slice(2).split("=", 2);
        switch (key) {
            case "instance":
                opts.instancePath = value;
                break;
            case "filter":
                opts.scriptsFilter = value;
                break;
            case "snapshot":
                opts.snapshotPath = value;
                break;
            case "log":
                opts.logPath = value;
                break;
            case "dump-start":
                opts.dumpStartMarker = value;
                break;
            case "dump-end":
                opts.dumpEndMarker = value;
                break;
            case "dump-line":
                opts.dumpLineMarker = value;
                break;
            default:
                break;
        }
    }

    if (!opts.instancePath && positional[0]) {
        opts.instancePath = positional[0];
    }

    if (!opts.instancePath) {
        return null;
    }

    return opts as CliOptions;
}

if (require.main === module) {
    const opts = parseArgs(process.argv.slice(2));
    if (!opts) {
        console.error(
            "Usage: node main.js <minecraft_instance_path> [--filter=... --log=... --snapshot=...]",
        );
        process.exit(1);
    }
    kubejs_offline_runner(opts);
}
