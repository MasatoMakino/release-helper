import { getReleaseNoteBody } from "@/util/getReleaseNoteBody.js";
import { execa } from "execa";
import { describe, expect, it, vi } from "vitest";

vi.mock("execa");

describe("getReleaseNoteBody", () => {
	it("should generate the correct release note body", async () => {
		// @ts-ignore
		vi.mocked(execa).mockResolvedValue({
			stderr: "",
			stdout: JSON.stringify({
				body: "## What's Changed",
			}),
			exitCode: 0,
		});

		const result = await getReleaseNoteBody("v1.0.0");
		expect(result).toMatch("## What's Changed");

		vi.restoreAllMocks();
	});
});
