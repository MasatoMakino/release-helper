import type { CommonCommandOptions } from "CommandOptions.js";
import { execa } from "execa";

export async function cleanMerged(
	options: CommonCommandOptions,
): Promise<void> {
	const allBranchList = await execa("git", [
		"branch",
		"--merged",
		options.defaultBranch,
	]);

	const allBranchNames = allBranchList.stdout.split("\n").map((branch) => {
		return branch.trim();
	});

	//exclude current branch
	const branchList = allBranchNames.filter((branch) => {
		if (branch === options.defaultBranch) return false;
		return !branch.trim().startsWith("*");
	});

	if (branchList.length === 0) {
		console.log("No branches to clean up");
		return;
	}

	if (options.dryRun) {
		console.log("Dry run mode enabled. No branches will be deleted.");
		console.log("Branches to be deleted:");
		console.log(branchList.join("\n"));
		return;
	}

	(async () => {
		for (const branch of branchList) {
			await execa("git", ["branch", "-d", branch]);
		}
	})();
}
