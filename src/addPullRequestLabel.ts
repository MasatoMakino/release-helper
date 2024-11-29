import { execa } from "execa";
import { isExecaError } from "./isExecaError.js";

/**
 * initialize release label
 */
export async function addPullRequestLabel(
	label: string,
	description: string,
	color: string,
) {
	try {
		await execa("gh", [
			"label",
			"create",
			label,
			"--description",
			description,
			"--color",
			color,
		]);
	} catch (e) {
		if (
			isExecaError(e) &&
			e.stderr.includes("already exists; use `--force` to update")
		) {
			return;
		}
		throw e;
	}
}
