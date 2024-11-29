import { execa } from "execa";
import { addPullRequestLabel } from "../addPullRequestLabel.js";
import { getTagBranchName } from "../getTagVersion.js";
import { isExecaError } from "../isExecaError.js";

const releaseLabel = "release";

/**
 * create pull request and merge it
 * @param defaultBranch - The default branch of the repository
 * @param useAutoMerge - Whether to enable auto merge
 */
export async function pullRequest(
	defaultBranch: string,
	useAutoMerge: boolean,
): Promise<void> {
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
			await execa("gh", ["pr", "merge", branchName, "--merge", "--auto"]);
		}
	} catch (e: unknown) {
		await handleMergeError(e, prResult.stdout);
	}

	if (!useAutoMerge) {
		// If the auto merge is disabled, open the browser
		await openBrowser(prResult.stdout);
	}
}

/**
 * initialize release label
 */
async function initReleaseLabel() {
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
async function handleMergeError(e: unknown, prUrl: string) {
	if (isExecaError(e) && e.stderr.includes("(enablePullRequestAutoMerge)")) {
		const isOpenBrowser = await openBrowser(prUrl);
		if (!isOpenBrowser) {
			throw e;
		}
	} else {
		throw e;
	}
}

/**
 * open browser with pull request url
 * @param output url of pull request
 * @returns is open browser
 */
async function openBrowser(output: string) {
	const match = output.match(/\/pull\/(\d+)$/);
	if (match) {
		const prNumber = match[1];
		await execa("gh", ["browse", prNumber]);
		return true;
	}
	return false;
}
