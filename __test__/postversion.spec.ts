import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
	addPackageFiles,
	checkout,
	openPullRequestWithBrowser,
	pullRequest,
	push,
	watchMerged,
} from "../src/postVersion/index.js";
import { postversion } from "../src/postversion.js";
import { release } from "../src/release.js";

vi.mock("../src/postVersion/index.js");
vi.mock("../src/release.js");

describe("postversion", () => {
	const mockOptions = {
		dryRun: false,
		defaultBranch: "main",
		useAutoMerge: true,
	};

	const mockAddPackageFiles = vi.mocked(addPackageFiles);
	const mockCheckout = vi.mocked(checkout);
	const mockPush = vi.mocked(push);
	const mockPullRequest = vi.mocked(pullRequest);
	const mockWatchMerged = vi.mocked(watchMerged);
	const mockOpenPullRequestWithBrowser = vi.mocked(openPullRequestWithBrowser);
	const mockRelease = vi.mocked(release);

	beforeEach(() => {
		mockAddPackageFiles.mockClear();
		mockCheckout.mockClear();
		mockPush.mockClear();
		mockPullRequest.mockClear();
		mockWatchMerged.mockClear();
		mockOpenPullRequestWithBrowser.mockClear();
		mockRelease.mockClear();
	});

	afterAll(() => {
		vi.restoreAllMocks();
	});

	it("should log and return when dryRun is true", async () => {
		const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
		const result = { ...mockOptions, dryRun: true };
		await postversion(result);
		expect(consoleLog).toHaveBeenCalledWith("Dry run enabled");
		consoleLog.mockRestore();
	});

	it("should execute all steps when dryRun is false and useAutoMerge is true", async () => {
		mockAddPackageFiles.mockResolvedValue(undefined);
		mockCheckout.mockResolvedValue(undefined);
		mockPush.mockResolvedValue(undefined);
		mockPullRequest.mockResolvedValue("http://pr.url");
		mockWatchMerged.mockResolvedValue("merged");
		mockRelease.mockResolvedValue(undefined);
		mockOpenPullRequestWithBrowser.mockResolvedValue(true);

		await postversion(mockOptions);

		expect(mockAddPackageFiles).toHaveBeenCalled();
		expect(mockCheckout).toHaveBeenCalled();
		expect(mockPush).toHaveBeenCalled();
		expect(mockPullRequest).toHaveBeenCalledWith("main", true);
		expect(mockWatchMerged).toHaveBeenCalledWith("http://pr.url");
		expect(mockRelease).toHaveBeenCalledWith(mockOptions);
		expect(mockOpenPullRequestWithBrowser).not.toHaveBeenCalled();
	});

	it("should open pull request in browser if auto-merge fails", async () => {
		mockAddPackageFiles.mockResolvedValue(undefined);
		mockCheckout.mockResolvedValue(undefined);
		mockPush.mockResolvedValue(undefined);
		mockPullRequest.mockResolvedValue("http://pr.url");
		mockWatchMerged.mockResolvedValue("failed");
		mockOpenPullRequestWithBrowser.mockResolvedValue(true);

		const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

		await postversion(mockOptions);

		expect(openPullRequestWithBrowser).toHaveBeenCalledWith("http://pr.url");
		expect(consoleLog).not.toHaveBeenCalledWith("PR was successfully merged.");

		consoleLog.mockRestore();
	});
});
