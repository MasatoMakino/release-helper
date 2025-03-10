import { execa } from "execa";
import { getTagBranchName } from "../util/index.js";

/**
 * Push the branch to origin
 */
export async function push(): Promise<void> {
	const resultBranchName = await getTagBranchName();
	await execa("git", ["push", "--set-upstream", "origin", resultBranchName]);
}
