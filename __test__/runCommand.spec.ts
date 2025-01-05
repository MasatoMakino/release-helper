import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanMerged } from "../src/cleanMerged.js";
import {
	addReleaseNoteTemplate,
	checkNpmTestCompletion,
	initLabel,
} from "../src/init/index.js";
import { postversion } from "../src/postversion.js";
import { preversion } from "../src/preversion.js";
import { previewRelease } from "../src/previewRelease.js";
import { release } from "../src/release.js";
import { runCommand } from "../src/runCommand.js";

vi.mock("../src/preversion.js");
vi.mock("../src/postversion.js");
vi.mock("../src/release.js");
vi.mock("../src/previewRelease.js");
vi.mock("../src/cleanMerged.js");
vi.mock("../src/init/index.js");

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

	it("should run the command with --help", () => {
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

		await vi.waitFor(() => {
			expect(mockPreversion).toBeCalledWith({
				defaultBranch: "main",
				dryRun: false,
				testCommand: "npm test",
			});
		});

		mockPreversion.mockRestore();
	});

	it("should run the command postversion", async () => {
		const mockPostversion = vi.mocked(postversion).mockResolvedValue();

		process.argv = ["node", "cli.ts", "postversion"];
		runCommand();

		await vi.waitFor(() => {
			expect(mockPostversion).toBeCalledWith({
				defaultBranch: "main",
				dryRun: false,
				useAutoMerge: true,
			});
		});

		mockPostversion.mockRestore();
	});

	it("should run the command release", async () => {
		const mockRelease = vi.mocked(release).mockResolvedValue();

		process.argv = ["node", "cli.ts", "release"];
		runCommand();

		await vi.waitFor(() => {
			expect(mockRelease).toBeCalledWith({
				defaultBranch: "main",
				dryRun: false,
			});
		});

		mockRelease.mockRestore();
	});

	it("should run the command preview", async () => {
		const mockPreview = vi.mocked(previewRelease).mockResolvedValue();

		process.argv = ["node", "cli.ts", "preview"];
		runCommand();

		await vi.waitFor(() => {
			expect(mockPreview).toBeCalledWith();
		});
		mockPreview.mockRestore();
	});

	it("should run the command generate-release-template", async () => {
		const mock = vi.mocked(addReleaseNoteTemplate).mockResolvedValue();

		process.argv = ["node", "cli.ts", "generate-release-template"];
		runCommand();

		await vi.waitFor(() => {
			expect(mock).toBeCalledWith(false);
		});
		mock.mockRestore();
	});

	it("should run the command clean-merged", async () => {
		const mock = vi.mocked(cleanMerged).mockResolvedValue();

		process.argv = ["node", "cli.ts", "clean-merged"];
		runCommand();

		await vi.waitFor(() => {
			expect(mock).toBeCalledWith({
				defaultBranch: "main",
				dryRun: false,
			});
		});

		mock.mockRestore();
	});

	it("should run the command init", async () => {
		const mockInitLabel = vi.mocked(initLabel).mockResolvedValue();
		const mockAddReleaseNoteTemplate = vi
			.mocked(addReleaseNoteTemplate)
			.mockResolvedValue();
		const mockCheckNpmTestCompletion = vi
			.mocked(checkNpmTestCompletion)
			.mockResolvedValue();

		const spyLog = vi.spyOn(console, "log").mockReturnValue();

		process.argv = ["node", "cli.js", "init"];
		runCommand();

		await vi.waitFor(() => {
			expect(mockInitLabel).toBeCalledWith();
			expect(mockAddReleaseNoteTemplate).toBeCalledWith();
			expect(mockCheckNpmTestCompletion).toBeCalled();
		});

		spyLog.mockRestore();
	});
});
