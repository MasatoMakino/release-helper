import { execa } from "execa";
import { getTagBranchName } from "../getTagVersion.js";

/**
 * delete the version branch
 * @param defaultBranch - The default branch of the repository
 */
export async function deleteBranch(defaultBranch: string): Promise<void> {
	await execa("git", ["checkout", defaultBranch]);
	const branchName = await getTagBranchName();
	await execa("git", ["branch", "-d", branchName]);
	await execa("git", ["push", "origin", "--delete", branchName]);
	await execa("git", ["pull", "origin", defaultBranch]);
}
