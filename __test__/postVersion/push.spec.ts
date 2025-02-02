import { push } from "@/postVersion/push.js";
import { getTagBranchName } from "@/util/getTagVersion.js";
import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa");
vi.mock("@/util/getTagVersion.js");

describe("push", () => {
	const mockedExeca = vi.mocked(execa);
	const mockedGetTagBranchName = vi.mocked(getTagBranchName);

	beforeEach(() => {
		mockedExeca.mockClear();
		mockedGetTagBranchName.mockClear();
	});

	it("should call execa with the correct arguments", async () => {
		mockedGetTagBranchName.mockResolvedValue("release-branch");
		await push();
		expect(mockedExeca).toHaveBeenCalledWith("git", [
			"push",
			"--set-upstream",
			"origin",
			"release-branch",
		]);
	});

	it("should retrieve the branch name before pushing", async () => {
		mockedGetTagBranchName.mockResolvedValue("test-branch");
		await push();
		expect(mockedGetTagBranchName).toHaveBeenCalled();
	});
});
