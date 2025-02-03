import { checkMerged } from "@/release/checkMerged.js";
import * as UtilModule from "@/util/index.js";
import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa");

describe("checkMerged", () => {
	const defaultBranch = "main";
	const branchName = "feature-branch";

	const mockedExeca = vi.mocked(execa);

	beforeEach(() => {
		vi.restoreAllMocks();
		mockedExeca.mockClear();
	});

	it("should resolve if branch is merged into default branch", async () => {
		// @ts-ignore
		mockedExeca.mockResolvedValue({
			stdout: `${defaultBranch}/${branchName}`,
		});
		vi.spyOn(UtilModule, "getTagBranchName").mockResolvedValue(branchName);

		await expect(checkMerged(defaultBranch)).resolves.toBeUndefined();
		expect(mockedExeca).toHaveBeenCalledWith("git", ["fetch", "origin"]);
		expect(mockedExeca).toHaveBeenCalledWith("git", [
			"branch",
			"--merged",
			`origin/${defaultBranch}`,
		]);
	});

	it("should throw an error if branch is not merged into default branch", async () => {
		// @ts-ignore
		mockedExeca.mockResolvedValue({
			stdout: `${defaultBranch}/${branchName}`,
		});
		vi.spyOn(UtilModule, "getTagBranchName").mockResolvedValue("other-branch");

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
