import { describe, expect, it, vi } from "vitest";
import { addPullRequestLabel } from "../../src/init/addPullRequestLabel.js";
import { initLabel } from "../../src/init/index.js";

vi.mock("../../src/init/addPullRequestLabel.js");

describe("initLabel", () => {
	it('should add "release", "CICD", and "major" labels', async () => {
		vi.mocked(addPullRequestLabel).mockImplementation(async () => {
			return;
		});

		await initLabel();

		expect(addPullRequestLabel).toHaveBeenCalledTimes(3);
		expect(addPullRequestLabel).toHaveBeenCalledWith(
			"release",
			"Pull request for the new release version",
			"f29513",
		);
		expect(addPullRequestLabel).toHaveBeenCalledWith(
			"CICD",
			"Pull request for maintaining the CI/CD environment",
			"90cdf4",
		);
		expect(addPullRequestLabel).toHaveBeenCalledWith(
			"major",
			"Pull request for the new major version",
			"b60205",
		);

		vi.mocked(addPullRequestLabel).mockClear();
		vi.resetAllMocks();
	});
});
