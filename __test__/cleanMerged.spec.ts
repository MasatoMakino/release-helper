import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanMerged } from "../src/cleanMerged.js";

vi.mock("execa");

describe("cleanMerged", () => {
	const mockedExeca = vi.mocked(execa);

	const options = {
		defaultBranch: "main",
		dryRun: false,
	};

	beforeEach(() => {
		mockedExeca.mockClear();
	});

	it("should log no branches to clean if there are none", async () => {
		// @ts-ignore
		mockedExeca.mockResolvedValue({
			stdout: "  main",
		});
		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

		await cleanMerged(options);
		expect(consoleSpy).toHaveBeenCalledWith("No branches to clean up");
		consoleSpy.mockRestore();
	});

	it("should perform a dry run without deleting branches", async () => {
		const dryRunOptions = { ...options, dryRun: true };
		// @ts-ignore
		mockedExeca.mockResolvedValue({
			stdout: "  main\n  feature-1\n  feature-2\n  *feature-3",
		});
		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

		await cleanMerged(dryRunOptions);

		expect(consoleSpy).toHaveBeenCalledWith(
			"Dry run mode enabled. No branches will be deleted.",
		);
		expect(consoleSpy).toHaveBeenCalledWith("Branches to be deleted:");
		expect(consoleSpy).toHaveBeenCalledWith("feature-1\nfeature-2");
		consoleSpy.mockRestore();
	});

	it("should delete merged branches", async () => {
		mockedExeca
			// @ts-ignore
			.mockResolvedValueOnce({
				stdout: "  main\n  *feature-0\n  feature-1\n  feature-2\n",
			})
			// @ts-ignore
			.mockResolvedValue({});

		await cleanMerged(options);

		expect(mockedExeca).not.toHaveBeenCalledWith("git", [
			"branch",
			"-d",
			"feature-0",
		]);
		expect(mockedExeca).toHaveBeenCalledWith("git", [
			"branch",
			"-d",
			"feature-1",
		]);
		expect(mockedExeca).toHaveBeenCalledWith("git", [
			"branch",
			"-d",
			"feature-2",
		]);
	});
});
