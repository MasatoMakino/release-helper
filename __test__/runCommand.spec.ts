import { beforeEach, describe, expect, it, vi } from "vitest";
import { postversion } from "../src/postversion.js";
import { preversion } from "../src/preversion.js";
import { runCommand } from "../src/runCommand.js";

vi.mock("../src/preversion.js");
vi.mock("../src/postversion.js");

describe("runCommand", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	const mockFunctions = () => {
		const stdOutSpy = vi
			.spyOn(process.stdout, "write")
			// @ts-ignore
			.mockImplementation(() => {});
		const mockExit = vi
			.spyOn(process, "exit")
			// @ts-ignore
			.mockImplementation(() => {});
		return { stdOutSpy, mockExit };
	};

	it("should run the command with --help", async () => {
		const { stdOutSpy, mockExit } = mockFunctions();

		process.argv = ["node", "cli.ts", "--help"];
		runCommand();
		expect(stdOutSpy).toHaveBeenCalledWith(expect.stringContaining("Usage:"));

		expect(mockExit).toHaveBeenCalledWith(0);
		stdOutSpy.mockRestore();
		mockExit.mockRestore();
	});

	it("should run the command previersion", async () => {
		const mockPreversion = vi.mocked(preversion).mockResolvedValue();

		process.argv = ["node", "cli.ts", "preversion"];
		runCommand();

		expect(mockPreversion).toBeCalledWith({
			defaultBranch: "main",
			dryRun: false,
			testCommand: "npm test",
		});
		mockPreversion.mockRestore();
	});

	it("should run the command postversion", async () => {
		const mockPostversion = vi.mocked(postversion).mockResolvedValue();

		process.argv = ["node", "cli.ts", "postversion"];
		runCommand();

		expect(mockPostversion).toBeCalledWith({
			defaultBranch: "main",
			dryRun: false,
			useAutoMerge: true,
		});
		mockPostversion.mockRestore();
	});
});
