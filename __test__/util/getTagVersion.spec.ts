import { afterEach } from "node:test";
import { execa } from "execa";
import { describe, expect, it, vi } from "vitest";
import {
	getPreviousTagVersion,
	getTagBranchName,
	getTagVersion,
} from "../../src/util/index.js";

vi.mock("execa");
afterEach(() => {
	vi.resetModules();
});

describe("getTagVersion", () => {
	it("should throw an error if git command fails", async () => {
		vi.mocked(execa).mockRejectedValue(new Error("Git error"));
		await expect(getTagVersion()).rejects.toThrowError();
	});

	it("should return the current tag version", async () => {
		// @ts-ignore
		vi.mocked(execa).mockResolvedValue({
			stderr: "",
			stdout: "v1.0.0",
		});
		const version = await getTagVersion();
		expect(version).toBe("v1.0.0");
	});
});

describe("getPreviousTagVersion", () => {
	it("should return the previous tag version", async () => {
		// @ts-ignore
		vi.mocked(execa).mockResolvedValueOnce({ stdout: "abc123" }); // rev-list
		// @ts-ignore
		vi.mocked(execa).mockResolvedValueOnce({ stdout: "v0.9.0" }); // describe

		const previousVersion = await getPreviousTagVersion();
		expect(previousVersion).toBe("v0.9.0");
	});

	it("should return undefined if there is no previous tag", async () => {
		vi.mocked(execa).mockRejectedValueOnce(new Error("No previous tag"));
		const previousVersion = await getPreviousTagVersion();
		expect(previousVersion).toBeUndefined();
	});
});

describe("getTagBranchName", () => {
	it("should return the branch name based on current tag", async () => {
		// @ts-ignore
		vi.mocked(execa).mockResolvedValue({ stdout: "v1.0.0" });
		const branchName = await getTagBranchName();
		expect(branchName).toBe("version/v1.0.0");
	});
});
