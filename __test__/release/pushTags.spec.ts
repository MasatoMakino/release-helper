import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { pushTags } from "../../src/release/pushTags.js";
import { getTagBranchName } from "../../src/util/getTagVersion.js";

vi.mock("execa");
vi.mock("../../src/util/getTagVersion.js");

describe("pushTags", () => {
	const mockedExeca = vi.mocked(execa);
	const mockedGetTagBranchName = vi.mocked(getTagBranchName);

	beforeEach(() => {
		mockedExeca.mockClear();
		mockedGetTagBranchName.mockClear();
	});

	it("should push tags to origin with the correct branch name", async () => {
		// @ts-ignore
		mockedExeca.mockImplementation(() => Promise.resolve());
		mockedGetTagBranchName.mockResolvedValue("mock-branch");

		await pushTags();
		expect(execa).toHaveBeenCalledWith("git", [
			"push",
			"--tags",
			"origin",
			"mock-branch",
		]);
	});
});
