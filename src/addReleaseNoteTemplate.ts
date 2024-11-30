import { constants, copyFile } from "node:fs/promises";
import { resolve } from "node:path";

const __dirname = import.meta.dirname;

/**
 * copy template file "release.yml" to .github folder
 * @param isForce overwrite existing file
 */
export async function addReleaseNoteTemplate(isForce = false) {
	try {
		const from = resolve(__dirname, "../template/release.yml");
		const to = resolve("./.github/release.yml");
		console.log(from);
		console.log(to);

		await copyFile(from, to, isForce ? undefined : constants.COPYFILE_EXCL);
	} catch (e) {
		if ((e as NodeJS.ErrnoException).code === "EEXIST") {
			console.log("Skip copying release.yml file to .github/workflows folder");
			return;
		}
		throw e;
	}
}
