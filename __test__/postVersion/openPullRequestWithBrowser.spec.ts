import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { openPullRequestWithBrowser } from "../../src/postVersion/openPullRequestWithBrowser.js";

vi.mock("execa");

describe("openBrowser", () => {
	const mockedExeca = vi.mocked(execa);

	beforeEach(() => {
		mockedExeca.mockClear();
	});

	it("should open browser with PR number when URL matches", async () => {
		const output = "https://github.com/user/repo/pull/1";
		// @ts-ignore
		mockedExeca.mockResolvedValue({});

		const result = await openPullRequestWithBrowser(output);

		expect(mockedExeca).toHaveBeenCalledWith("gh", ["browse", "1"]);
		expect(result).toBe(true);
	});

	it("should return false when URL does not match", async () => {
		const output = "invalid-url";
		// @ts-ignore
		mockedExeca.mockResolvedValue({});

		const result = await openPullRequestWithBrowser(output);
		expect(mockedExeca).not.toHaveBeenCalled();
		expect(result).toBe(false);
	});
});
