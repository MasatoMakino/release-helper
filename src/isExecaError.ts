import type { ExecaError } from "execa";

export function isExecaError(e: unknown): e is ExecaError {
	return (e as ExecaError).name === "ExecaError";
}
