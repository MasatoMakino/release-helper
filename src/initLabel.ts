import { addPullRequestLabel } from "./addPullRequestLabel.js";

export async function initLabel() {
	await addPullRequestLabel(
		"release",
		"Pull request for the new release version",
		"f29513",
	);

	await addPullRequestLabel(
		"major",
		"Pull request for the new major version",
		"b60205",
	);
}
