import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCheckStatus } from "../../src/postVersion/getCheckState.js";
import { watchMerged } from "../../src/postVersion/watchMerged.js";

vi.mock("execa");
vi.mock("../../src/postVersion/getCheckState.js");

describe("watchMerged", () => {
	const mockPrURL = "https://github.com/owner/repo/pull/123";

	const mockExeca = vi.mocked(execa);
	const mockGetCheckStatus = vi.mocked(getCheckStatus);

	beforeEach(() => {
		mockExeca.mockClear();
		mockGetCheckStatus.mockClear();
	});

	it("should return 'failed' if check status is not 'success'", async () => {
		mockGetCheckStatus.mockResolvedValue("error");
		const result = await watchMerged(mockPrURL);
		expect(result).toBe("failed");
	});

	it("should return 'merged' if execa stdout is 'MERGED'", async () => {
		mockGetCheckStatus.mockResolvedValue("success");
		//@ts-ignore
		mockExeca.mockResolvedValue({ stdout: "MERGED" });
		const result = await watchMerged(mockPrURL);
		expect(result).toBe("merged");
	});

	it("should return 'closed' if execa stdout is 'CLOSED'", async () => {
		mockGetCheckStatus.mockResolvedValue("success");
		//@ts-ignore
		mockExeca.mockResolvedValue({ stdout: "CLOSED" });
		const result = await watchMerged(mockPrURL);
		expect(result).toBe("closed");
	});

	it("should return undefined if execa stdout is neither 'MERGED' nor 'CLOSED'", async () => {
		mockGetCheckStatus.mockResolvedValue("success");
		//@ts-ignore
		mockExeca.mockResolvedValue({ stdout: "OPEN" });
		const result = await watchMerged(mockPrURL);
		expect(result).toBeUndefined();
	});
});
