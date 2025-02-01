import { beforeEach, describe, expect, it, vi } from "vitest";

import { release } from "@/release.js";
import { checkMerged } from "../src/release/checkMerged.js";
import { checkTagExists } from "../src/release/checkTagExists.js";
import { createDraft } from "../src/release/createDraft.js";
import { deleteBranch } from "../src/release/deleteBranch.js";
import { openDraft } from "../src/release/openDraft.js";
import { pushTags } from "../src/release/pushTags.js";

vi.mock("../src/release/checkMerged.js");
vi.mock("../src/release/checkTagExists.js");
vi.mock("../src/release/createDraft.js");
vi.mock("../src/release/deleteBranch.js");
vi.mock("../src/release/openDraft.js");
vi.mock("../src/release/pushTags.js");

describe("release", () => {
	const checkMergedMock = vi.mocked(checkMerged);
	const checkTagExistsMock = vi.mocked(checkTagExists);
	const createDraftMock = vi.mocked(createDraft);
	const deleteBranchMock = vi.mocked(deleteBranch);
	const openDraftMock = vi.mocked(openDraft);
	const pushTagsMock = vi.mocked(pushTags);

	beforeEach(() => {
		checkMergedMock.mockRestore();
		checkTagExistsMock.mockRestore();
		pushTagsMock.mockRestore();
		createDraftMock.mockRestore();
		openDraftMock.mockRestore();
		deleteBranchMock.mockRestore();

		checkMergedMock.mockResolvedValue();
		checkTagExistsMock.mockResolvedValue();
		pushTagsMock.mockResolvedValue();
		createDraftMock.mockResolvedValue();
		openDraftMock.mockResolvedValue();
		deleteBranchMock.mockResolvedValue();
	});

	it('should log "Dry run enabled" and return when options.dryRun is true', async () => {
		const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

		const options = { dryRun: true, defaultBranch: "main" };

		await release(options);

		expect(consoleLogSpy).toHaveBeenCalledWith("Dry run enabled");
		expect(checkMergedMock).not.toHaveBeenCalled();
		expect(checkTagExistsMock).not.toHaveBeenCalled();
		expect(pushTagsMock).not.toHaveBeenCalled();
		expect(createDraftMock).not.toHaveBeenCalled();
		expect(openDraftMock).not.toHaveBeenCalled();
		expect(deleteBranchMock).not.toHaveBeenCalled();

		consoleLogSpy.mockRestore();
	});

	it("should perform all release steps when options.dryRun is false", async () => {
		const options = { dryRun: false, defaultBranch: "main" };

		await release(options);

		expect(checkMergedMock).toHaveBeenCalledWith(options.defaultBranch);
		expect(checkTagExistsMock).toHaveBeenCalled();
		expect(pushTagsMock).toHaveBeenCalled();
		expect(createDraftMock).toHaveBeenCalled();
		expect(openDraftMock).toHaveBeenCalled();
		expect(deleteBranchMock).toHaveBeenCalledWith(options.defaultBranch);
	});
});
