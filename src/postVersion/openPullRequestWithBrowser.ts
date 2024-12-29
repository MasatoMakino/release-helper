import { execa } from "execa";

/**
 * open browser with pull request url
 * @param output url of pull request
 * @returns is open browser
 */
export async function openPullRequestWithBrowser(output: string) {
	const match = output.match(/\/pull\/(\d+)$/);
	console.log(match);
	if (match) {
		const prNumber = match[1];
		await execa("gh", ["browse", prNumber]);
		return true;
	}
	return false;
}
