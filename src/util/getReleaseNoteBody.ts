import { execa } from "execa";
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
