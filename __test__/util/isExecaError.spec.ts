import { execa } from "execa";
import { describe, expect, it } from "vitest";
import {
	isExecaError,
	isExecaErrorWithErrorCode,
} from "../../src/util/index.js";

describe("isExecaError", () => {
	it("should return true for ExecaError", async () => {
		try {
			await execa("not", ["exit", "command", "with", "error"]);
		} catch (error) {
			expect(isExecaError(error)).toBe(true);
		}
	});

	it("should return false for non-ExecaError", () => {
		const error = new Error("An error occurred");
		expect(isExecaError(error)).toBe(false);
	});
});

describe("isExecaErrorWithErrorCode", () => {
	it("should return true for ExecaError with matching error code", async () => {
		try {
			await execa("not", ["exit", "command", "with", "error"]);
		} catch (error) {
			expect(isExecaErrorWithErrorCode(error, "")).toBe(true);
		}
	});

	it("should return false for ExecaError without matching error code", async () => {
		try {
			await execa("not", ["exit", "command", "with", "error"]);
		} catch (error) {
			expect(isExecaErrorWithErrorCode(error, "not match code")).toBe(false);
		}
	});

	it("should return false for non-ExecaError", () => {
		const error = new Error("An error occurred");
		expect(isExecaErrorWithErrorCode(error, "1234")).toBe(false);
	});
});
