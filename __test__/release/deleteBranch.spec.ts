import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { deleteBranch } from "@/release/index.js";
import * as UtilModule from "@/util/index.js";

vi.mock("execa");

describe("deleteBranch", () => {
	const execaMock = vi.mocked(execa);

	beforeEach(() => {
		vi.restoreAllMocks();
		execaMock.mockClear();
	});

	it("calls git checkout on defaultBranch, deletes branch, pushes deletion, and pulls defaultBranch", async () => {
		const branchName = "main";
		const tagBranchName = "release-1.2.3";

		vi.spyOn(UtilModule, "getTagBranchName").mockResolvedValue(tagBranchName);

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
