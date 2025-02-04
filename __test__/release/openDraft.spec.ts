import { execa } from "execa";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { openDraft } from "@/release/index.js";
import * as UtilModule from "@/util/index.js";

vi.mock("execa");

describe("openDraft", () => {
	const mockedExeca = vi.mocked(execa);

	beforeEach(() => {
		vi.restoreAllMocks();
		mockedExeca.mockClear();
	});

	it("should open the draft release in the browser with the correct tag", async () => {
		// @ts-ignore
		mockedExeca.mockImplementation(() => Promise.resolve());
		const mockedGetTagVersion = vi
			.spyOn(UtilModule, "getTagVersion")
			.mockResolvedValue("v1.2.3");

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
