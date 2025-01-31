import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkTagExists } from "../../src/release/checkTagExists.js";
import { getTagVersion } from "../../src/util/getTagVersion.js";

vi.mock("execa");
vi.mock("../../src/util/getTagVersion.js");

describe("checkTagExists", () => {
	const mockedExeca = vi.mocked(execa);
	const mockedGetTagVersion = vi.mocked(getTagVersion);

	beforeEach(() => {
		mockedExeca.mockClear();
		mockedGetTagVersion.mockClear();
	});

	it("throws an error if the tag already exists", async () => {
		const mockTag = "v1.0.0";
		mockedGetTagVersion.mockResolvedValue(mockTag);
		//@ts-ignore
		mockedExeca.mockResolvedValue({ stdout: `refs/tags/${mockTag}` });

		await expect(checkTagExists()).rejects.toThrow("Tag already exists");
	});

	it("does not throw an error if the tag does not exist", async () => {
		const mockTag = "v1.0.0";
		mockedGetTagVersion.mockResolvedValue(mockTag);
		//@ts-ignore
		mockedExeca.mockResolvedValue({ stdout: "refs/tags/v0.9.0" });

		await expect(checkTagExists()).resolves.toBeUndefined();
	});
});
