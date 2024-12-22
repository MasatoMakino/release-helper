#!/usr/bin/env node

import { Command, Option } from "commander";
import { addReleaseNoteTemplate } from "./addReleaseNoteTemplate.js";
import { checkNpmTestCompletion } from "./checkNpmTestCompletion.js";
import { cleanMerged } from "./cleanMerged.js";
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
	.description("initialize release label and release note template")
	.action(async () => {
		await initLabel();
		await addReleaseNoteTemplate();
		await checkNpmTestCompletion();
	});

program
	.command("generate-release-template")
	.description("generate release note template to .github directory")
	.option("--force", "overwrite existing file", false)
	.action(async (options) => {
		await addReleaseNoteTemplate(options.force);
	});

program
	.command("clean-merged")
	.description("clean up merged local branches")
	.addOption(defaultBranchOption)
	.addOption(dryRunOption)
	.action(async (options) => {
		await cleanMerged(options);
	});

program.parse();
