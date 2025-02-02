import { preversion } from "@/preversion.js";
import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa");

describe("preversion", () => {
	const mockExeca = vi.mocked(execa);

	beforeEach(() => {
		mockExeca.mockClear();
	});

	const options = {
		defaultBranch: "main",
		testCommand: "npm test",
		dryRun: false,
	};

	it("should fetch, checkout, pull, install dependencies, and build", async () => {
		// @ts-ignore
		mockExeca.mockResolvedValue({ stdout: "success" });

		await preversion(options);

		expect(mockExeca).toHaveBeenCalledWith("git", [
			"fetch",
			"origin",
			options.defaultBranch,
		]);
		expect(mockExeca).toHaveBeenCalledWith("git", [
			"checkout",
			options.defaultBranch,
		]);
		expect(mockExeca).toHaveBeenCalledWith("git", [
			"pull",
			"origin",
			options.defaultBranch,
		]);
		expect(mockExeca).toHaveBeenCalledWith("npm", ["ci"]);
		expect(mockExeca).toHaveBeenCalledWith("npm", [
			"run",
			"build",
			"--if-present",
		]);
		expect(mockExeca).toHaveBeenCalledWith("npm", ["test"]);
	});

	it("should skip tests when dryRun is true", async () => {
		const dryRunOptions = { ...options, dryRun: true };
		// @ts-ignore
		mockExeca.mockResolvedValue({ stdout: "success" });

		const spyLog = vi.spyOn(console, "log").mockImplementation(() => {});

		await preversion(dryRunOptions);

		expect(mockExeca).toHaveBeenCalledWith("git", [
			"fetch",
			"origin",
			dryRunOptions.defaultBranch,
		]);
		expect(mockExeca).not.toHaveBeenCalledWith("git", [
			"checkout",
			dryRunOptions.defaultBranch,
		]);
		expect(mockExeca).not.toHaveBeenCalledWith("git", [
			"pull",
			"origin",
			dryRunOptions.defaultBranch,
		]);
		expect(mockExeca).not.toHaveBeenCalledWith("npm", ["ci"]);
		expect(mockExeca).not.toHaveBeenCalledWith("npm", [
			"run",
			"build",
			"--if-present",
		]);
		expect(mockExeca).not.toHaveBeenCalledWith("npm", ["test"]);
		expect(spyLog).toHaveBeenCalledWith(
			"Dry run enabled. Skipping checkout and tests.",
		);

		spyLog.mockRestore();
	});

	it("should handle test command failure", async () => {
		// @ts-ignore
		mockExeca.mockImplementation((cmd: string, args: string[]) => {
			if (cmd === "npm" && args[0] === "test") {
				return Promise.reject(new Error("Test failed"));
			}
			return Promise.resolve({ stdout: "success" });
		});

		await expect(preversion(options)).rejects.toThrow("Test failed");
	});
});
