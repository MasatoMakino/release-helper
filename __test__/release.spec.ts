import { afterEach, describe, expect, it, vi } from "vitest";

import { release } from "@/release.js";
import * as ReleaseModule from "@/release/index.js";

describe("release", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	const mockReleaseModule = () => {
		const checkMergedMock = vi
			.spyOn(ReleaseModule, "checkMerged")
			.mockResolvedValue();
		const checkTagExistsMock = vi
			.spyOn(ReleaseModule, "checkTagExists")
			.mockResolvedValue();
		const createDraftMock = vi
			.spyOn(ReleaseModule, "createDraft")
			.mockResolvedValue();
		const deleteBranchMock = vi
			.spyOn(ReleaseModule, "deleteBranch")
			.mockResolvedValue();
		const openDraftMock = vi
			.spyOn(ReleaseModule, "openDraft")
			.mockResolvedValue();
		const pushTagsMock = vi
			.spyOn(ReleaseModule, "pushTags")
			.mockResolvedValue();
		return {
			checkMergedMock,
			checkTagExistsMock,
			createDraftMock,
			deleteBranchMock,
			openDraftMock,
			pushTagsMock,
		};
	};

	it('should log "Dry run enabled" and return when options.dryRun is true', async () => {
		const {
			checkMergedMock,
			checkTagExistsMock,
			createDraftMock,
			deleteBranchMock,
			openDraftMock,
			pushTagsMock,
		} = mockReleaseModule();
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
		const {
			checkMergedMock,
			checkTagExistsMock,
			createDraftMock,
			deleteBranchMock,
			openDraftMock,
			pushTagsMock,
		} = mockReleaseModule();
		await release(options);

		expect(checkMergedMock).toHaveBeenCalledWith(options.defaultBranch);
		expect(checkTagExistsMock).toHaveBeenCalled();
		expect(pushTagsMock).toHaveBeenCalled();
		expect(createDraftMock).toHaveBeenCalled();
		expect(openDraftMock).toHaveBeenCalled();
		expect(deleteBranchMock).toHaveBeenCalledWith(options.defaultBranch);
	});
});
