import { constants, copyFile } from "node:fs/promises";
import { resolve } from "node:path";

const __dirname = import.meta.dirname;

/**
 * copy template file "release.yml" to .github directory
 * @param isForce overwrite existing file
 */
export async function addReleaseNoteTemplate(isForce = false) {
	try {
		const from = resolve(__dirname, "../template/release.yml");
		const to = resolve("./.github/release.yml");

		await copyFile(from, to, isForce ? undefined : constants.COPYFILE_EXCL);

		console.log("Copied release.yml file to .github/workflows directory");
	} catch (e) {
		if ((e as NodeJS.ErrnoException).code === "EEXIST") {
			console.log(
				"File '.github/release.yml' already exists. Command skipped copying release.yml file.",
			);
			return;
		}
		throw e;
	}
}
