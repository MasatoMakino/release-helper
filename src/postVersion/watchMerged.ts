import { execa } from "execa";
import { getCheckStatus } from "./getCheckState.js";

/**
 * watch the pull request until it is merged.
 *
 * @param prURL - The URL of the pull request
 */
export async function watchMerged(prURL: string) {
	const checkResult = await getCheckStatus(prURL);
	if (checkResult !== "success") {
		console.log("skip watching PR state");
		return "failed";
	}

	const result = await execa("gh", [
		"pr",
		"view",
		prURL,
		"--json",
		"state",
		"-q",
		".state",
	]);

	if (result.stdout === "MERGED") {
		return "merged";
	}

	if (result.stdout === "CLOSED") {
		return "closed";
	}
}
