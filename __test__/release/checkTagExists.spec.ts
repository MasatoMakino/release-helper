import { checkTagExists } from "@/release/checkTagExists.js";
import * as UtilModule from "@/util/index.js";
import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa");

describe("checkTagExists", () => {
	const mockedExeca = vi.mocked(execa);

	beforeEach(() => {
		vi.restoreAllMocks();
		mockedExeca.mockClear();
	});

	it("throws an error if the tag already exists", async () => {
		const mockTag = "v1.0.0";
		vi.spyOn(UtilModule, "getTagVersion").mockResolvedValue(mockTag);
		//@ts-ignore
		mockedExeca.mockResolvedValue({ stdout: `refs/tags/${mockTag}` });

		await expect(checkTagExists()).rejects.toThrow("Tag already exists");
	});

	it("does not throw an error if the tag does not exist", async () => {
		const mockTag = "v1.0.0";
		vi.spyOn(UtilModule, "getTagVersion").mockResolvedValue(mockTag);
		//@ts-ignore
		mockedExeca.mockResolvedValue({ stdout: "refs/tags/v0.9.0" });

		await expect(checkTagExists()).resolves.toBeUndefined();
	});
});
