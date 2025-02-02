import { previewRelease } from "@/previewRelease.js";
import { getReleaseNoteBody, getTagVersion } from "@/util/index.js";
import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa");
vi.mock("@/util/index.js");

describe("previewRelease", () => {
	const execaMock = vi.mocked(execa);
	const getTagVersionMock = vi.mocked(getTagVersion);
	const getReleaseNoteBodyMock = vi.mocked(getReleaseNoteBody);

	beforeEach(() => {
		execaMock.mockClear();
		getTagVersionMock.mockClear();
		getReleaseNoteBodyMock.mockClear();
	});

	it("should create and delete a release successfully", async () => {
		getTagVersionMock.mockResolvedValue("v1.0.0");
		getReleaseNoteBodyMock.mockResolvedValue("Release notes");
		const spyLog = vi.spyOn(console, "log").mockImplementation(() => {});
		//@ts-ignore
		execaMock.mockResolvedValueOnce({});

		await previewRelease();

		expect(getTagVersionMock).toHaveBeenCalled();
		expect(execaMock).toHaveBeenNthCalledWith(1, "gh", [
			"release",
			"create",
			"v1.0.0-preview0",
			"--notes-start-tag",
			"v1.0.0",
			"--generate-notes",
			"--draft",
		]);
		expect(getReleaseNoteBodyMock).toHaveBeenCalledWith("v1.0.0-preview0");
		expect(spyLog).toHaveBeenCalledWith("Release notes");
		expect(execaMock).toHaveBeenNthCalledWith(2, "gh", [
			"release",
			"delete",
			"v1.0.0-preview0",
		]);
		spyLog.mockRestore();
	});

	it("should handle execa failure during release creation", async () => {
		getTagVersionMock.mockResolvedValue("v1.0.0");
		execaMock.mockRejectedValue(new Error("Failed to create release"));

		await expect(previewRelease()).rejects.toThrow("Failed to create release");

		expect(execa).toHaveBeenCalledWith("gh", [
			"release",
			"create",
			"v1.0.0-preview0",
			"--notes-start-tag",
			"v1.0.0",
			"--generate-notes",
			"--draft",
		]);
	});
});
