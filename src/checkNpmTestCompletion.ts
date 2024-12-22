import { ExecaError, execa } from "execa";
import { isExecaError } from "./isExecaError.js";

/**
 * Check if npm test has completed
 */
export async function checkNpmTestCompletion() {
	console.log("Checking npm test script...");
	try {
		const result = await execa("npm", ["test"], { timeout: 180_000 });
		console.log("Tests script completed successfully.");
	} catch (e) {
		if (isExecaError(e) && e.exitCode === 1) {
			console.log("Tests failed. Please fix the failing tests.");
		} else if (isExecaError(e) && e.timedOut) {
			console.log(
				"Tests were found but did not complete within the allotted time. Please disable the watch mode option if it is enabled.",
			);
		} else if (
			isExecaError(e) &&
			typeof e.stderr === "string" &&
			e.stderr.includes('npm error Missing script: "test"')
		) {
			console.log("Tests not exist. Please add test script to package.json.");
		} else {
			throw e;
		}
	}
}
