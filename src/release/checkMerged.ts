import { execa } from "execa";
import { getTagBranchName } from "../getTagVersion.js";

/**
 * Check if the version branch is merged to main
 * @param defaultBranch - The default branch of the repository
 */
export async function checkMerged(defaultBranch: string): Promise<void> {
	await execa("git", ["fetch", "origin"]);
	const branchName = await getTagBranchName();
	const result = await execa("git", [
		"branch",
		"--merged",
		`origin/${defaultBranch}`,
	]);
	if (!result.stdout.includes(branchName)) {
		throw new Error("Branch not merged");
	}
}
