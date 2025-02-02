import { openDraft } from "@/release/index.js";
import { getTagVersion } from "@/util/index.js";
import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("execa");
vi.mock("@/util/index.js");

describe("openDraft", () => {
	const mockedExeca = vi.mocked(execa);
	const mockedGetTagVersion = vi.mocked(getTagVersion);

	beforeEach(() => {
		mockedExeca.mockClear();
		mockedGetTagVersion.mockClear();
	});

	it("should open the draft release in the browser with the correct tag", async () => {
		// @ts-ignore
		mockedExeca.mockImplementation(() => Promise.resolve());
		mockedGetTagVersion.mockResolvedValue("v1.2.3");

		await openDraft();
		expect(mockedGetTagVersion).toHaveBeenCalledTimes(1);
		expect(mockedExeca).toHaveBeenCalledWith("gh", [
			"release",
			"view",
			"v1.2.3",
			"--web",
		]);
	});
});
