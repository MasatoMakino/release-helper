import * as GetCheckStatusModule from "@/postVersion/getCheckState.js";
import { watchMerged } from "@/postVersion/watchMerged.js";
import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa");

describe("watchMerged", () => {
	const mockPrURL = "https://github.com/owner/repo/pull/123";
	const mockExeca = vi.mocked(execa);

	beforeEach(() => {
		mockExeca.mockClear();
		vi.restoreAllMocks();
	});

	it("should return 'failed' if check status is not 'success'", async () => {
		vi.spyOn(GetCheckStatusModule, "getCheckStatus").mockResolvedValue("error");
		const result = await watchMerged(mockPrURL);
		expect(result).toBe("failed");
	});

	it("should return 'merged' if execa stdout is 'MERGED'", async () => {
		vi.spyOn(GetCheckStatusModule, "getCheckStatus").mockResolvedValue(
			"success",
		);
		//@ts-ignore
		mockExeca.mockResolvedValue({ stdout: "MERGED" });
		const result = await watchMerged(mockPrURL);
		expect(result).toBe("merged");
	});

	it("should return 'closed' if execa stdout is 'CLOSED'", async () => {
		vi.spyOn(GetCheckStatusModule, "getCheckStatus").mockResolvedValue(
			"success",
		);
		//@ts-ignore
		mockExeca.mockResolvedValue({ stdout: "CLOSED" });
		const result = await watchMerged(mockPrURL);
		expect(result).toBe("closed");
	});

	it("should return undefined if execa stdout is neither 'MERGED' nor 'CLOSED'", async () => {
		vi.spyOn(GetCheckStatusModule, "getCheckStatus").mockResolvedValue(
			"success",
		);
		//@ts-ignore
		mockExeca.mockResolvedValue({ stdout: "OPEN" });
		const result = await watchMerged(mockPrURL);
		expect(result).toBeUndefined();
	});
});
