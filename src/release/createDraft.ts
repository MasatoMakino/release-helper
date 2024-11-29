import { execa } from "execa";
import { getPreviousTagVersion, getTagVersion } from "../getTagVersion.js";

/**
 * Create a draft release
 */
export async function createDraft(): Promise<void> {
	const tag = await getTagVersion();
	const prevTag = await getPreviousTagVersion();
	await execa("gh", [
		"release",
		"create",
		tag,
		"--notes-start-tag",
		prevTag,
		"--generate-notes",
		"--verify-tag",
		"--draft",
	]);
}
