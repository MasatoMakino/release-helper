import { addReleaseNoteTemplate } from "@/init/addReleaseNoteTemplate.js";
import { describe, expect, it, vi } from "vitest";

describe("addReleaseNoteTemplate", () => {
	it("should copy release.yml to .github directory", async () => {
		const mockConsoleLog = vi.spyOn(console, "log");
		await addReleaseNoteTemplate(true);
		expect(mockConsoleLog).toHaveBeenCalledWith(
			"Copied release.yml file to .github/workflows directory",
		);
		mockConsoleLog.mockRestore();
	});

	it("should skip copying release.yml if file already exists", async () => {
		const mockConsoleLog = vi.spyOn(console, "log");
		await addReleaseNoteTemplate();
		expect(mockConsoleLog).toHaveBeenCalledWith(
			"File '.github/release.yml' already exists. Command skipped copying release.yml file.",
		);
		mockConsoleLog.mockRestore();
	});
});
