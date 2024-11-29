import { Command, Option } from "commander";
import { initLabel } from "./initLabel.js";
import { postversion } from "./postversion.js";
import { preversion } from "./preversion.js";
import { previewRelease } from "./previewRelease.js";
import { release } from "./release.js";

const program = new Command();
const dryRunOption = new Option("--dry-run", "skip commit and tag").default(
	false,
);
const defaultBranchOption = new Option(
	"--default-branch <defaultBranch>",
	"default branch name",
).default("main");

program
	.command("preversion")
	.description(
		"checkout to default branch and pull latest changes, and run test",
	)
	.addOption(dryRunOption)
	.addOption(defaultBranchOption)
	.option("--test-command <testCommand>", "test command", "npm test")
	.action(async (options) => {
		await preversion(options);
	});

program
	.command("postversion")
	.description("create a pull request on GitHub")
	.addOption(dryRunOption)
	.addOption(defaultBranchOption)
	.option("--use-auto-merge", "enable auto merge", true)
	.action(async (options) => {
		await postversion(options);
	});

program
	.command("release")
	.description("push version tag and create a release on GitHub")
	.addOption(dryRunOption)
	.addOption(defaultBranchOption)
	.action(async (options) => {
		await release(options);
	});

program
	.command("preview")
	.description("get release note from GitHub release")
	.action(async () => {
		await previewRelease();
	});

program
	.command("init")
	.description("initialize release label")
	.action(async () => {
		await initLabel();
	});

program.parse();
