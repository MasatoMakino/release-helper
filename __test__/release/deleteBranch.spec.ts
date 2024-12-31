import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { deleteBranch } from "../../src/release/index.js";
import { getTagBranchName } from "../../src/util/getTagVersion.js";

vi.mock("execa");
vi.mock("../../src/util/getTagVersion.js");

describe("deleteBranch", () => {
	const execaMock = vi.mocked(execa);
	const getTagBranchNameMock = vi.mocked(getTagBranchName);

	beforeEach(() => {
		execaMock.mockClear();
		getTagBranchNameMock.mockClear();
	});

	it("calls git checkout on defaultBranch, deletes branch, pushes deletion, and pulls defaultBranch", async () => {
		const branchName = "main";
		const tagBranchName = "release-1.2.3";

		getTagBranchNameMock.mockResolvedValue(tagBranchName);

		await deleteBranch(branchName);

		expect(execaMock).toHaveBeenCalledTimes(4);
		expect(execaMock).toHaveBeenNthCalledWith(1, "git", [
			"checkout",
			branchName,
		]);
		expect(execaMock).toHaveBeenNthCalledWith(2, "git", [
			"branch",
			"-d",
			tagBranchName,
		]);
		expect(execaMock).toHaveBeenNthCalledWith(3, "git", [
			"push",
			"origin",
			"--delete",
			tagBranchName,
		]);
		expect(execaMock).toHaveBeenNthCalledWith(4, "git", [
			"pull",
			"origin",
			branchName,
		]);
	});
});
