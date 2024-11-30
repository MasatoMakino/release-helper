import type { CommonCommandOptions } from "CommandOptions.js";
import {
	checkMerged,
	checkTagExists,
	createDraft,
	deleteBranch,
	openDraft,
	pushTags,
} from "./release/index.js";

export async function release(options: CommonCommandOptions): Promise<void> {
	if (options.dryRun) {
		console.log("Dry run enabled");
		return;
	}
	await checkMerged(options.defaultBranch);
	await checkTagExists();
	await pushTags();
	await createDraft();
	await openDraft();
	await deleteBranch(options.defaultBranch);
}
