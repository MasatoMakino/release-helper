import { execa } from "execa";
import { getReleaseNoteBody } from "util/getReleaseNoteBody.js";
import { getTagVersion } from "./getTagVersion.js";

/**
 * Create a release draft on GitHub.
 * The created draft will be deleted when the command finishes.
 */
export async function previewRelease(): Promise<void> {
	const tag = await getTagVersion();
	const nextTag = `${tag}-preview0`;

	await execa("gh", [
		"release",
		"create",
		nextTag,
		"--notes-start-tag",
		tag,
		"--generate-notes",
		"--draft",
	]);

	console.log(await getReleaseNoteBody(nextTag));
	await execa("gh", ["release", "delete", nextTag]);
}
