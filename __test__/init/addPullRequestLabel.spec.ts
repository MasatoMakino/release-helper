import { ExecaError, execa } from "execa";
import { describe, expect, it, vi } from "vitest";
import { addPullRequestLabel } from "../../src/init/index.js";

vi.mock("execa");

describe("addPullRequestLabel", () => {
	const label = "bug";
	const description = "Something isn't working";
	const color = "FF0000";

	it("should create a new label successfully", async () => {
		// @ts-ignore
		vi.mocked(execa).mockResolvedValueOnce({});
		await expect(
			addPullRequestLabel(label, description, color),
		).resolves.toBeUndefined();
		expect(execa).toHaveBeenCalledWith("gh", [
			"label",
			"create",
			label,
			"--description",
			description,
			"--color",
			color,
		]);
	});

	it("should not throw if the label already exists", async () => {
		const execaError = new ExecaError();
		execaError.stderr = "already exists; use `--force` to update";
		vi.mocked(execa).mockRejectedValueOnce(execaError);

		await expect(
			addPullRequestLabel(label, description, color),
		).resolves.toBeUndefined();
		expect(execa).toHaveBeenCalledWith("gh", [
			"label",
			"create",
			label,
			"--description",
			description,
			"--color",
			color,
		]);
	});

	it("should throw an error if label creation fails for other reasons", async () => {
		const error = new Error("Network error");
		vi.mocked(execa).mockRejectedValueOnce(error);
		await expect(
			addPullRequestLabel(label, description, color),
		).rejects.toThrow("Network error");
		expect(execa).toHaveBeenCalledWith("gh", [
			"label",
			"create",
			label,
			"--description",
			description,
			"--color",
			color,
		]);
	});
});
