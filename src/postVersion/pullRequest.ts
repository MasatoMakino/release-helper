import { execa } from "execa";
import { addPullRequestLabel } from "../init/index.js";
import { getTagBranchName, isExecaErrorWithErrorCode } from "../util/index.js";
import { openPullRequestWithBrowser } from "./index.js";

const releaseLabel = "release";

/**
 * create pull request and merge it
 * @param defaultBranch - The default branch of the repository
 * @param useAutoMerge - Whether to enable auto merge
 */
export async function pullRequest(
	defaultBranch: string,
	useAutoMerge: boolean,
): Promise<string | undefined> {
	await initReleaseLabel();

	const branchName = await getTagBranchName();
	const prResult = await execa("gh", [
		"pr",
		"create",
		"--fill",
		"--base",
		defaultBranch,
		"--head",
		branchName,
		"--label",
		releaseLabel,
	]);

	// If the auto merge is enabled, merge the pull request automatically
	try {
		if (useAutoMerge) {
			const result = await execa("gh", [
				"pr",
				"merge",
				branchName,
				"--merge",
				"--auto",
			]);
			return prResult.stdout;
		}
	} catch (e: unknown) {
		await handleMergeError(e, prResult.stdout);
	}

	if (!useAutoMerge) {
		// If the auto merge is disabled, open the browser
		await openPullRequestWithBrowser(prResult.stdout);
	}
	return undefined;
}

/**
 * initialize release label
 */
export async function initReleaseLabel() {
	await addPullRequestLabel(
		releaseLabel,
		"Pull request for the new release version",
		"f29513",
	);
}

/**
 * handle merge error, if error is caused by auto merge, open browser.
 * @param e
 * @param prUrl
 */
export async function handleMergeError(e: unknown, prUrl: string) {
	if (isExecaErrorWithErrorCode(e, "(enablePullRequestAutoMerge)")) {
		const isOpenBrowser = await openPullRequestWithBrowser(prUrl);
		if (!isOpenBrowser) {
			throw e;
		}
	} else {
		throw e;
	}
}
