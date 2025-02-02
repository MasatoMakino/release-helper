import { release } from "@/release.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
	checkMerged,
	checkTagExists,
	createDraft,
	deleteBranch,
	openDraft,
	pushTags,
} from "@/release/index.js";
vi.mock("@/release/index.js");

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
