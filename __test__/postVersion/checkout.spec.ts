import { checkout } from "@/postVersion/index.js";
import * as UtilModule from "@/util/index.js";
import { getTagBranchName } from "@/util/index.js";
import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa");

describe("checkout", () => {
	const execaMock = vi.mocked(execa);

	beforeEach(() => {
		execaMock.mockClear();
		vi.restoreAllMocks();
	});

	it("should checkout to a new branch using getTagBranchName", async () => {
		vi.spyOn(UtilModule, "getTagBranchName").mockResolvedValue(
			"release/v1.0.0",
		);
		await checkout();
		expect(getTagBranchName).toHaveBeenCalled();
		expect(execaMock).toHaveBeenCalledWith("git", [
			"checkout",
			"-b",
			"release/v1.0.0",
		]);
	});

	it("should throw if execa fails", async () => {
		execaMock.mockRejectedValue(new Error("Checkout Error"));
		await expect(checkout()).rejects.toThrow("Checkout Error");
	});
});
