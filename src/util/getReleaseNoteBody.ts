import { execa } from "execa";

/**
 * Get the release note body.
 *
 * @param tag - The tag of the release.
 * @returns The release note body.
 */
export async function getReleaseNoteBody(tag: string): Promise<string> {
	const viewResult = await execa("gh", [
		"release",
		"view",
		tag,
		"--json",
		"body",
	]);
	return JSON.parse(viewResult.stdout).body as string;
}
