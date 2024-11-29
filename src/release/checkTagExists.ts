import { execa } from "execa";
import { getTagVersion } from "../getTagVersion.js";

/**
 * Check if the tag already exists
 */
export async function checkTagExists(): Promise<void> {
	const tag = await getTagVersion();
	await execa("git", ["fetch", "--tags"]);
	const result = await execa("git", ["ls-remote", "--tags", "origin"]);
	if (result.stdout.includes(tag)) {
		throw new Error("Tag already exists");
	}
}
