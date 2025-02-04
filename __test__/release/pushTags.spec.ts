import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { pushTags } from "@/release/pushTags.js";
import * as UtilModule from "@/util/index.js";

vi.mock("execa");

describe("pushTags", () => {
	const mockedExeca = vi.mocked(execa);

	beforeEach(() => {
		vi.restoreAllMocks();
		mockedExeca.mockClear();
	});

	it("should push tags to origin with the correct branch name", async () => {
		// @ts-ignore
		mockedExeca.mockImplementation(() => Promise.resolve());
		vi.spyOn(UtilModule, "getTagBranchName").mockResolvedValue("mock-branch");

		await pushTags();
		expect(execa).toHaveBeenCalledWith("git", [
			"push",
			"--tags",
			"origin",
			"mock-branch",
		]);
	});
});
