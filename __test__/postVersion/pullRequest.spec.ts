import * as InitModule from "@/init/index.js";
import * as PostVersionModule from "@/postVersion/index.js";
const { pullRequest } = PostVersionModule;
import * as UtilModule from "@/util/index.js";
import { ExecaError, execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa");

describe("pullRequest", () => {
	const defaultBranch = "main";
	const branchName = "v1.0.0";
	const prUrl = "https://github.com/repo/pull/1";

	const mockedExeca = vi.mocked(execa);

	beforeEach(() => {
		vi.resetAllMocks();
		mockedExeca.mockClear();
	});

	it("should create and auto-merge pull request when useAutoMerge is false", async () => {
		vi.spyOn(UtilModule, "getTagBranchName").mockResolvedValue(branchName);
		vi.spyOn(InitModule, "addPullRequestLabel").mockResolvedValue();
		vi.spyOn(PostVersionModule, "openPullRequestWithBrowser").mockResolvedValue(
			true,
		);

		mockedExeca
			//@ts-ignore
			.mockResolvedValueOnce({ stdout: prUrl });

		const result = await pullRequest(defaultBranch, false);
		expect(result).toBe(undefined);
	});

	it("should create pull request and open browser when useAutoMerge is true", async () => {
		vi.spyOn(UtilModule, "getTagBranchName").mockResolvedValue(branchName);
		vi.spyOn(InitModule, "addPullRequestLabel").mockResolvedValue();
		vi.spyOn(PostVersionModule, "openPullRequestWithBrowser").mockResolvedValue(
			true,
		);

		mockedExeca
			//@ts-ignore
			.mockResolvedValueOnce({ stdout: prUrl })
			//@ts-ignore
			.mockResolvedValueOnce({ stdout: "merged" });

		const result = await pullRequest(defaultBranch, true);
		expect(result).toBe("https://github.com/repo/pull/1");
	});

	it("should handle merge error and throw if browser fails to open", async () => {
		vi.spyOn(UtilModule, "getTagBranchName").mockResolvedValue(branchName);
		vi.spyOn(InitModule, "addPullRequestLabel").mockResolvedValue();
		const mockedOpenPullRequestWithBrowser = vi
			.spyOn(PostVersionModule, "openPullRequestWithBrowser")
			.mockResolvedValue(true);

		const error = new ExecaError();
		error.stderr = "(enablePullRequestAutoMerge)";
		error.exitCode = 1;

		mockedExeca
			//@ts-ignore
			.mockResolvedValueOnce({ stdout: prUrl })
			//@ts-ignore
			.mockRejectedValueOnce(error);

		const result = await pullRequest(defaultBranch, true);
		expect(result).toBe(undefined);

		expect(mockedOpenPullRequestWithBrowser).toHaveBeenCalledWith(prUrl);
	});
});
