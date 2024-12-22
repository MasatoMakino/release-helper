import { execa } from "execa";
import { getPreviousTagVersion, getTagVersion } from "../getTagVersion.js";

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

	const viewResult = await execa("gh", [
		"release",
		"view",
		tag,
		"--json",
		"body",
	]);
	const body = JSON.parse(viewResult.stdout).body;

	const dependenciesSectionRegex =
		/(### 🔧 Dependencies\n)([\s\S]*?)(?=\n### |\n\n)/;
	const match = body.match(dependenciesSectionRegex);

	if (match) {
		const wrappedDependencies = `
${match[1].trim()}

<details>
<summary>All Updated Dependencies</summary>

${match[2].trim()}

</details>
`;

		const replacedBody = body.replace(
			dependenciesSectionRegex,
			wrappedDependencies,
		);
		await execa("gh", ["release", "edit", tag, "--notes", replacedBody]);
	}
}
