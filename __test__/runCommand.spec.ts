import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanMerged } from "../src/cleanMerged.js";
import { addReleaseNoteTemplate } from "../src/init/addReleaseNoteTemplate.js";
import { postversion } from "../src/postversion.js";
import { preversion } from "../src/preversion.js";
import { previewRelease } from "../src/previewRelease.js";
import { release } from "../src/release.js";
import { runCommand } from "../src/runCommand.js";

vi.mock("../src/preversion.js");
vi.mock("../src/postversion.js");
vi.mock("../src/release.js");
vi.mock("../src/previewRelease.js");
vi.mock("../src/init/addReleaseNoteTemplate.js");
vi.mock("../src/cleanMerged.js");

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

	it("should run the command release", async () => {
		const mockRelease = vi.mocked(release).mockResolvedValue();

		process.argv = ["node", "cli.ts", "release"];
		runCommand();

		expect(mockRelease).toBeCalledWith({
			defaultBranch: "main",
			dryRun: false,
		});
		mockRelease.mockRestore();
	});

	it("should run the command preview", async () => {
		const mockPreview = vi.mocked(previewRelease).mockResolvedValue();

		process.argv = ["node", "cli.ts", "preview"];
		runCommand();

		expect(mockPreview).toBeCalledWith();
		mockPreview.mockRestore();
	});

	it("should run the command generate-release-template", async () => {
		const mock = vi.mocked(addReleaseNoteTemplate).mockResolvedValue();

		process.argv = ["node", "cli.ts", "generate-release-template"];
		runCommand();

		expect(mock).toBeCalledWith(false);
		mock.mockRestore();
	});

	it("should run the command clean-merged", async () => {
		const mock = vi.mocked(cleanMerged).mockResolvedValue();

		process.argv = ["node", "cli.ts", "clean-merged"];
		runCommand();

		expect(mock).toBeCalledWith({
			defaultBranch: "main",
			dryRun: false,
		});
		mock.mockRestore();
	});
});
