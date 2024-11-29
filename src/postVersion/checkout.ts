import { execa } from "execa";
import { getTagBranchName } from "../getTagVersion.js";

/**
 * Checkout to a new branch with version/tag name
 */
export async function checkout(): Promise<void> {
	const resultBranchName = await getTagBranchName();
	await execa("git", ["checkout", "-b", resultBranchName]);
}
