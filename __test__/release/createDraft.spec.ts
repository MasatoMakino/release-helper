import { createDraft } from "@/release/createDraft.js";
import * as UtilModule from "@/util/index.js";
import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa");

describe("createDraft", () => {
	const execaMock = vi.mocked(execa);

	beforeEach(() => {
		vi.restoreAllMocks();
		execaMock.mockClear();
	});

	it("creates a draft release with previous tag", async () => {
		vi.spyOn(UtilModule, "getPreviousTagVersion").mockResolvedValue("v1.9.0");
		vi.spyOn(UtilModule, "getTagVersion").mockResolvedValue("v2.0.0");
		vi.spyOn(UtilModule, "getReleaseNoteBody").mockResolvedValue(
			"release body",
		);
		vi.spyOn(UtilModule, "wrapDependencies").mockReturnValue("wrapped body");

		await createDraft();

		expect(execaMock).toHaveBeenCalledWith("gh", [
			"release",
			"create",
			"v2.0.0",
			"--notes-start-tag",
			"v1.9.0",
			"--generate-notes",
			"--verify-tag",
			"--draft",
		]);
		expect(execaMock).toHaveBeenCalledWith("gh", [
			"release",
			"edit",
			"v2.0.0",
			"--notes",
			"wrapped body",
		]);
	});

	it("creates a draft release without previous tag", async () => {
		vi.spyOn(UtilModule, "getPreviousTagVersion").mockResolvedValue(undefined);
		vi.spyOn(UtilModule, "getTagVersion").mockResolvedValue("v2.0.0");
		vi.spyOn(UtilModule, "getReleaseNoteBody").mockResolvedValue(
			"release body",
		);
		vi.spyOn(UtilModule, "wrapDependencies").mockReturnValue(null);

		await createDraft();

		expect(execa).toHaveBeenCalledWith("gh", [
			"release",
			"create",
			"v2.0.0",
			"--generate-notes",
			"--verify-tag",
			"--draft",
		]);
		expect(execa).not.toHaveBeenCalledWith(
			"gh",
			expect.arrayContaining(["--notes"]),
		);
	});
});
