export type RunnerErrorType =
    | "missing_item"
    | "missing_recipe"
    | "missing_tag"
    | "missing_recipe_type"
    | "noop_event"
    | "script_error";

export interface RunnerError {
    type: RunnerErrorType;
    message: string;
    file?: string;
    line?: number;
    column?: number;
}

export function formatRunnerError(err: RunnerError): string {
    const location = err.file ? `${err.file}${err.line ? `:${err.line}${err.column ? `:${err.column}` : ""}` : ""}` : "unknown";
    return `[${err.type}] ${location} - ${err.message}`;
}
