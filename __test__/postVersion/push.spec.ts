import { push } from "@/postVersion/push.js";
import * as UtilModule from "@/util/index.js";
import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa");

describe("push", () => {
	const mockedExeca = vi.mocked(execa);

	beforeEach(() => {
		vi.restoreAllMocks();
		mockedExeca.mockClear();
	});

	it("should call execa with the correct arguments", async () => {
		vi.spyOn(UtilModule, "getTagBranchName").mockResolvedValue(
			"release-branch",
		);
		await push();
		expect(mockedExeca).toHaveBeenCalledWith("git", [
			"push",
			"--set-upstream",
			"origin",
			"release-branch",
		]);
	});

	it("should retrieve the branch name before pushing", async () => {
		const mockedGetTagBranchName = vi
			.spyOn(UtilModule, "getTagBranchName")
			.mockResolvedValue("test-branch");
		await push();
		expect(mockedGetTagBranchName).toHaveBeenCalled();
	});
});
