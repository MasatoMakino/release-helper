import { execa } from "execa";
import { getTagBranchName } from "../util/index.js";

/**
 * Push the tags to origin
 */
export async function pushTags(): Promise<void> {
	const branchName = await getTagBranchName();
	await execa("git", ["push", "--tags", "origin", branchName]);
}
