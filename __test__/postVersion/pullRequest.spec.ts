import { addPullRequestLabel } from "@/init/addPullRequestLabel.js";
import { openPullRequestWithBrowser } from "@/postVersion/openPullRequestWithBrowser.js";
import { pullRequest } from "@/postVersion/pullRequest.js";
import { getTagBranchName } from "@/util/getTagVersion.js";
import { ExecaError, execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa");
vi.mock("@/util/getTagVersion.js");
vi.mock("@/init/addPullRequestLabel.js");
vi.mock("@/postVersion/openPullRequestWithBrowser.js");

describe("pullRequest", () => {
	const defaultBranch = "main";
	const branchName = "v1.0.0";
	const prUrl = "https://github.com/repo/pull/1";

	const mockedExeca = vi.mocked(execa);
	const mockedGetTagBranchName = vi.mocked(getTagBranchName);
	const mockedAddPullRequestLabel = vi.mocked(addPullRequestLabel);
	const mockedOpenPullRequestWithBrowser = vi.mocked(
		openPullRequestWithBrowser,
	);

	beforeEach(() => {
		vi.resetAllMocks();
		mockedExeca.mockClear();
		mockedGetTagBranchName.mockClear();
		mockedAddPullRequestLabel.mockClear();
		mockedOpenPullRequestWithBrowser.mockClear();
	});

	it("should create and auto-merge pull request when useAutoMerge is false", async () => {
		mockedGetTagBranchName.mockResolvedValue(branchName);
		mockedAddPullRequestLabel.mockResolvedValue();
		mockedOpenPullRequestWithBrowser.mockResolvedValue(true);

		mockedExeca
			//@ts-ignore
			.mockResolvedValueOnce({ stdout: prUrl });

		const result = await pullRequest(defaultBranch, false);
		expect(result).toBe(undefined);
	});

	it("should create pull request and open browser when useAutoMerge is true", async () => {
		mockedGetTagBranchName.mockResolvedValue(branchName);
		mockedAddPullRequestLabel.mockResolvedValue();
		mockedOpenPullRequestWithBrowser.mockResolvedValue(true);

		mockedExeca
			//@ts-ignore
			.mockResolvedValueOnce({ stdout: prUrl })
			//@ts-ignore
			.mockResolvedValueOnce({ stdout: "merged" });

		const result = await pullRequest(defaultBranch, true);
		expect(result).toBe("https://github.com/repo/pull/1");
	});

	it("should handle merge error and throw if browser fails to open", async () => {
		mockedGetTagBranchName.mockResolvedValue(branchName);
		mockedAddPullRequestLabel.mockResolvedValue();
		mockedOpenPullRequestWithBrowser.mockResolvedValue(true);

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
