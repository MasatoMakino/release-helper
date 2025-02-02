import { checkout } from "@/postVersion/index.js";
import { getTagBranchName } from "@/util/getTagVersion.js";
import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa");
vi.mock("@/util/getTagVersion.js");

describe("checkout", () => {
	const execaMock = vi.mocked(execa);
	const getTagBranchNameMock = vi.mocked(getTagBranchName);

	beforeEach(() => {
		execaMock.mockClear();
		getTagBranchNameMock.mockClear();
	});

	it("should checkout to a new branch using getTagBranchName", async () => {
		getTagBranchNameMock.mockResolvedValue("release/v1.0.0");
		await checkout();
		expect(getTagBranchNameMock).toHaveBeenCalled();
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
