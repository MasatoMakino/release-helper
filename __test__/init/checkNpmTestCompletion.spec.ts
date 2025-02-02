import { checkNpmTestCompletion } from "@/init/checkNpmTestCompletion.js";
import { ExecaError, execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa");

describe("checkNpmTestCompletion", () => {
	const execaMock = vi.mocked(execa);

	beforeEach(() => {
		execaMock.mockClear();
		vi.clearAllMocks();
	});

	it("should log success message when npm test completes successfully", async () => {
		// @ts-ignore
		execaMock.mockResolvedValue({});
		const consoleLogMock = vi
			.spyOn(console, "log")
			.mockImplementation(() => {});

		await checkNpmTestCompletion();

		expect(execaMock).toHaveBeenCalledWith("npm", ["test"], {
			timeout: 180000,
		});
		expect(consoleLogMock).toHaveBeenCalledWith(
			"Tests script completed successfully.",
		);
		consoleLogMock.mockRestore();
	});

	it("should log failure message when npm test exits with code 1", async () => {
		const error = new ExecaError();
		error.exitCode = 1;
		error.failed = true;
		error.stderr = "Test failed";

		execaMock.mockRejectedValue(error);
		const consoleLogMock = vi
			.spyOn(console, "log")
			.mockImplementation(() => {});

		await checkNpmTestCompletion();

		expect(consoleLogMock).toHaveBeenCalledWith(
			"Tests failed. Please fix the failing tests.",
		);
		consoleLogMock.mockRestore();
	});

	it("should log timeout message when npm test times out", async () => {
		const error = new ExecaError();
		error.timedOut = true;

		execaMock.mockRejectedValue(error);

		const consoleLogMock = vi
			.spyOn(console, "log")
			.mockImplementation(() => {});

		await checkNpmTestCompletion();

		expect(consoleLogMock).toHaveBeenCalledWith(
			"Tests were found but did not complete within the allotted time. Please disable the watch mode option if it is enabled.",
		);
		consoleLogMock.mockRestore();
	});

	it("should log missing script message when test script is not found", async () => {
		const error = new ExecaError();
		error.failed = true;
		error.stderr = 'npm error Missing script: "test"';

		execaMock.mockRejectedValue(error);
		const consoleLogMock = vi
			.spyOn(console, "log")
			.mockImplementation(() => {});

		await checkNpmTestCompletion();

		expect(consoleLogMock).toHaveBeenCalledWith(
			"Tests not exist. Please add test script to package.json.",
		);
		consoleLogMock.mockRestore();
	});

	it("should rethrow error for unexpected errors", async () => {
		const error = new Error("Unexpected error");
		execaMock.mockRejectedValue(error);
		const consoleLogMock = vi
			.spyOn(console, "log")
			.mockImplementation(() => {});

		await expect(checkNpmTestCompletion()).rejects.toThrow("Unexpected error");
		consoleLogMock.mockRestore();
	});
});
