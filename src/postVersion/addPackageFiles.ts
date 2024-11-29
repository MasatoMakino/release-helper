import { execa } from "execa";

/**
 * Add package.json and package-lock.json to git
 */
export async function addPackageFiles(): Promise<void> {
	await execa("git", ["add", "package.json", "package-lock.json"]);
}
