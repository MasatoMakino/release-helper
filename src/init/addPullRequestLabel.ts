import { execa } from "execa";
import { isExecaErrorWithErrorCode } from "../util/index.js";

/**
 * Adds or updates a label in the GitHub repository for a pull request.
 *
 * This function creates a label with the specified name, description, and color.
 * If a label with the same name already exists, it updates the label based on the error message.
 *
 * @param label - The name of the label to create or update.
 * @param description - The description of the label.
 * @param color - The color of the label in hexadecimal format (e.g., "FF5733").
 * @returns A promise that resolves when the label has been successfully created or updated.
 *
 * @throws {Error} If an error occurs while creating or updating the label.
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
