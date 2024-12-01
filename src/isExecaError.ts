import type { ExecaError } from "execa";

export function isExecaError(e: unknown): e is ExecaError {
	return (e as ExecaError).name === "ExecaError";
}

export function isExecaErrorWithErrorCode(e: unknown, code: string): boolean {
	return (
		isExecaError(e) &&
		e.stderr !== undefined &&
		typeof e.stderr === "string" &&
		e.stderr.includes(code)
	);
}
