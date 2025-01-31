import { execa } from "execa";
import { getTagVersion } from "../util/index.js";

/**
 * Open the draft release in the browser
 */
export async function openDraft(): Promise<void> {
	const tag = await getTagVersion();
	await execa("gh", ["release", "view", tag, "--web"]);
}
