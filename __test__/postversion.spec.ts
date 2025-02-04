import { afterAll, describe, expect, it, vi } from "vitest";

import * as PostVersionModule from "@/postVersion/index.js";
import { postversion } from "@/postversion.js";
import * as ReleaseModule from "@/release.js";

describe("postversion", () => {
	const mockOptions = {
		dryRun: false,
		defaultBranch: "main",
		useAutoMerge: true,
	};

	afterAll(() => {
		vi.restoreAllMocks();
	});

	it("should log and return when dryRun is true", async () => {
		const consoleLog = vi.spyOn(console, "log");
		const result = { ...mockOptions, dryRun: true };
		await postversion(result);
		expect(consoleLog).toHaveBeenCalledWith("Dry run enabled");
	});

	it("should execute all steps when dryRun is false and useAutoMerge is true", async () => {
		const mockAddPackageFiles = vi
			.spyOn(PostVersionModule, "addPackageFiles")
			.mockResolvedValue(undefined);
		const mockCheckout = vi
			.spyOn(PostVersionModule, "checkout")
			.mockResolvedValue(undefined);
		const mockPush = vi
			.spyOn(PostVersionModule, "push")
			.mockResolvedValue(undefined);
		const mockPullRequest = vi
			.spyOn(PostVersionModule, "pullRequest")
			.mockResolvedValue("http://pr.url");
		const mockWatchMerged = vi
			.spyOn(PostVersionModule, "watchMerged")
			.mockResolvedValue("merged");
		const mockOpenPullRequestWithBrowser = vi
			.spyOn(PostVersionModule, "openPullRequestWithBrowser")
			.mockResolvedValue(true);
		const mockRelease = vi
			.spyOn(ReleaseModule, "release")
			.mockResolvedValue(undefined);

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
		vi.spyOn(PostVersionModule, "addPackageFiles").mockResolvedValue(undefined);
		vi.spyOn(PostVersionModule, "checkout").mockResolvedValue(undefined);
		vi.spyOn(PostVersionModule, "push").mockResolvedValue(undefined);
		vi.spyOn(PostVersionModule, "pullRequest").mockResolvedValue(
			"http://pr.url",
		);
		vi.spyOn(PostVersionModule, "watchMerged").mockResolvedValue("failed");
		const mockOpenPullRequestWithBrowser = vi
			.spyOn(PostVersionModule, "openPullRequestWithBrowser")
			.mockResolvedValue(true);
		const consoleLog = vi.spyOn(console, "log");

		await postversion({ ...mockOptions, dryRun: false });

		expect(mockOpenPullRequestWithBrowser).toHaveBeenCalledWith(
			"http://pr.url",
		);
		expect(consoleLog).not.toBeCalled();
	});
});
