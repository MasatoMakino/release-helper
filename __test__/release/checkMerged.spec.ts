import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkMerged } from "../../src/release/checkMerged.js";
import { getTagBranchName } from "../../src/util/getTagVersion.js";

vi.mock("execa");
vi.mock("../../src/util/getTagVersion.js");

const mockedExeca = vi.mocked(execa);
const mockedGetTagBranchName = vi.mocked(getTagBranchName);

describe("checkMerged", () => {
	const defaultBranch = "main";
	const branchName = "feature-branch";

	beforeEach(() => {
		mockedExeca.mockClear();
		mockedGetTagBranchName.mockClear();
	});

	it("should resolve if branch is merged into default branch", async () => {
		// @ts-ignore
		mockedExeca.mockResolvedValue({
			stdout: `${defaultBranch}/${branchName}`,
		});
		mockedGetTagBranchName.mockResolvedValue(branchName);

		await expect(checkMerged(defaultBranch)).resolves.toBeUndefined();
		expect(mockedExeca).toHaveBeenCalledWith("git", ["fetch", "origin"]);
		expect(mockedExeca).toHaveBeenCalledWith("git", [
			"branch",
			"--merged",
			`origin/${defaultBranch}`,
		]);

		mockedExeca.mockClear();
		mockedGetTagBranchName.mockClear();
	});

	it("should throw an error if branch is not merged into default branch", async () => {
		// @ts-ignore
		mockedExeca.mockResolvedValue({
			stdout: `${defaultBranch}/${branchName}`,
		});
		mockedGetTagBranchName.mockResolvedValue("other-branch");

		await expect(checkMerged(defaultBranch)).rejects.toThrow(
			"Branch not merged",
		);
		expect(mockedExeca).toHaveBeenCalledWith("git", ["fetch", "origin"]);
		expect(mockedExeca).toHaveBeenCalledWith("git", [
			"branch",
			"--merged",
			`origin/${defaultBranch}`,
		]);
	});

	it("should throw an error if fetching fails", async () => {
		mockedExeca.mockRejectedValue(new Error("Fetch failed"));
		await expect(checkMerged(defaultBranch)).rejects.toThrow("Fetch failed");
		expect(mockedExeca).toHaveBeenCalledWith("git", ["fetch", "origin"]);
	});
});
