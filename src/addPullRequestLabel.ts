import { execa } from "execa";
import { isExecaErrorWithErrorCode } from "./util/index.js";

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
			isExecaErrorWithErrorCode(e, "already exists; use `--force` to update")
		) {
			return;
		}
		throw e;
	}
}
