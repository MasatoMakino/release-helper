import * as InitModule from "@/init/index.js";
const { initLabel } = InitModule;
import { describe, expect, it, vi } from "vitest";

describe("initLabel", () => {
	it('should add "release", "CICD", and "major" labels', async () => {
		const mockedAddPullRequestLabel = vi
			.spyOn(InitModule, "addPullRequestLabel")
			.mockResolvedValue();

		await initLabel();

		expect(mockedAddPullRequestLabel).toHaveBeenCalledTimes(4);
		expect(mockedAddPullRequestLabel).toHaveBeenCalledWith(
			"release",
			"Pull request for the new release version",
			"f29513",
		);
		expect(mockedAddPullRequestLabel).toHaveBeenCalledWith(
			"CICD",
			"Pull request for maintaining the CI/CD environment",
			"90cdf4",
		);
		expect(mockedAddPullRequestLabel).toHaveBeenCalledWith(
			"major",
			"Pull request for the new major version",
			"b60205",
		);

		vi.resetAllMocks();
	});
});
