import { execa } from "execa";

/**
 * get current version with git describe
 * @returns {Promise<string>} The tag version
 */
export async function getTagVersion(): Promise<string> {
	const result = await execa("git", ["describe", "--tags", "--abbrev=0"]);
	return result.stdout;
}

export async function getPreviousTagVersion(): Promise<string> {
	const prevHashResult = await execa("git", [
		"rev-list",
		"--tags",
		"--skip=1",
		"--max-count=1",
	]);
	const versionResult = await execa("git", [
		"describe",
		"--tags",
		"--abbrev=0",
		prevHashResult.stdout,
	]);
	return versionResult.stdout;
}

/**
 * create a branch name based on current tag
 * @returns {Promise<string>} The branch name to be created
 */
export async function getTagBranchName(): Promise<string> {
	const result = await getTagVersion();
	return `version/${result}`;
}
