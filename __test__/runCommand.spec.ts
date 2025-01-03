import { beforeEach, describe, expect, it, vi } from "vitest";
import { runCommand } from "../src/runCommand.js";

describe("runCommand", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("should run the command with --help", async () => {
		const stdOutSpy = vi
			.spyOn(process.stdout, "write")
			// @ts-ignore
			.mockImplementation(() => {});
		const mockExit = vi
			.spyOn(process, "exit")
			// @ts-ignore
			.mockImplementation(() => {});

		process.argv = ["node", "cli.ts", "--help"];
		runCommand();
		expect(stdOutSpy).toHaveBeenCalledWith(expect.stringContaining("Usage:"));

		expect(mockExit).toHaveBeenCalledWith(0);
		stdOutSpy.mockRestore();
		mockExit.mockRestore();
	});
});
