import { addPackageFiles } from "@/postVersion/index.js";
import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa");

describe("addPackageFiles", () => {
	const execaMock = vi.mocked(execa);
	beforeEach(() => {
		execaMock.mockClear();
	});

	it("should call execa with git add commands for package files", async () => {
		await addPackageFiles();
		expect(execaMock).toHaveBeenCalledWith("git", [
			"add",
			"package.json",
			"package-lock.json",
		]);
	});

	it("should throw if execa fails", async () => {
		(execa as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Test Error"),
		);
		await expect(addPackageFiles()).rejects.toThrow("Test Error");
	});
});
