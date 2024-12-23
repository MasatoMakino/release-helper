import { execa } from "execa";
import { getPreviousTagVersion, getTagVersion } from "../getTagVersion.js";
import { getReleaseNoteBody } from "../util/getReleaseNoteBody.js";
import { wrapDependencies } from "../util/wrapDependencies.js";

/**
 * Create a draft release
 */
export async function createDraft(): Promise<void> {
	const tag = await getTagVersion();
	const prevTag = await getPreviousTagVersion();
	const optionNoteStartTag = prevTag ? ["--notes-start-tag", prevTag] : [];

	await execa("gh", [
		"release",
		"create",
		tag,
		...optionNoteStartTag,
		"--generate-notes",
		"--verify-tag",
		"--draft",
	]);

	const body = await getReleaseNoteBody(tag);

	const wrappedDependenciesBody = wrapDependencies(body);
	if (wrappedDependenciesBody) {
		await execa("gh", [
			"release",
			"edit",
			tag,
			"--notes",
			wrappedDependenciesBody,
		]);
	}
}
