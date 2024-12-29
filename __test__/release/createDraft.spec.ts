import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDraft } from "../../src/release/createDraft.js";
import { getReleaseNoteBody } from "../../src/util/getReleaseNoteBody.js";
import { getPreviousTagVersion } from "../../src/util/getTagVersion.js";
import { getTagVersion } from "../../src/util/getTagVersion.js";
import { wrapDependencies } from "../../src/util/wrapDependencies.js";

vi.mock("execa");
vi.mock("../../src/util/getTagVersion.js");
vi.mock("../../src/util/getReleaseNoteBody.js");
vi.mock("../../src/util/wrapDependencies.js");

describe("createDraft", () => {
	const execaMock = vi.mocked(execa);
	const getTagVersionMock = vi.mocked(getTagVersion);
	const getPreviousTagVersionMock = vi.mocked(getPreviousTagVersion);
	const getReleaseNoteBodyMock = vi.mocked(getReleaseNoteBody);
	const wrapDependenciesMock = vi.mocked(wrapDependencies);

	beforeEach(() => {
		execaMock.mockClear();
		getTagVersionMock.mockClear();
		getPreviousTagVersionMock.mockClear();
		getReleaseNoteBodyMock.mockClear();
		wrapDependenciesMock.mockClear();
	});

	it("creates a draft release with previous tag", async () => {
		getTagVersionMock.mockResolvedValue("v2.0.0");
		getPreviousTagVersionMock.mockResolvedValue("v1.9.0");
		getReleaseNoteBodyMock.mockResolvedValue("release body");
		wrapDependenciesMock.mockReturnValue("wrapped body");

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
		getTagVersionMock.mockResolvedValue("v2.0.0");
		getPreviousTagVersionMock.mockResolvedValue(undefined);
		getReleaseNoteBodyMock.mockResolvedValue("release body");
		wrapDependenciesMock.mockReturnValue(null);

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
