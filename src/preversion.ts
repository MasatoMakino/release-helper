import type { CommonCommandOptions } from "CommandOptions.js";
import { execa } from "execa";

interface PreversionOptions extends CommonCommandOptions {
	testCommand: string;
}

export async function preversion(options: PreversionOptions): Promise<void> {
	await execa("git", ["fetch", "origin", options.defaultBranch]);

	if (options.dryRun) {
		console.log("Dry run enabled. Skipping checkout and tests.");
		return;
	}

	await execa("git", ["checkout", options.defaultBranch]);
	await execa("git", ["pull", "origin", options.defaultBranch]);
	await execa("npm", ["ci"]);
	await execa("npm", ["run", "build", "--if-present"]);

	const testCommand = options.testCommand.split(" ");
	const [command, ...args] = testCommand;
	const resultTest = await execa(command, args);
	console.log(resultTest.stdout);
}
