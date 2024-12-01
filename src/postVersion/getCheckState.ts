import { execa } from "execa";
import { isExecaErrorWithErrorCode } from "../isExecaError.js";

/**
 * watch the status of the checks on a pull request
 *
 * @param prURL - The URL or number of the pull request
 */
export async function getCheckStatus(prURL: string) {
	const interval = 10_000; // 10 seconds
	const timeout = 180_000; // 180 seconds
	const startTime = Date.now();

	console.log(`Watching the status of the checks on ${prURL}...`);
	return new Promise((resolve, reject) => {
		const checkStatus = async () => {
			console.log("checking status...");
			try {
				const checkResult = await execa("gh", [
					"pr",
					"checks",
					prURL,
					"--required",
					"--json",
					"state",
				]);
				const result: [{ state: string }] = JSON.parse(checkResult.stdout);

				if (result.some((check) => check.state === "FAILURE")) {
					console.log("Some checks are failed");
					clearInterval(intervalId);
					resolve("failed");
				}

				if (result.every((check) => check.state === "SUCCESS")) {
					console.log("All required checks are successful.");
					clearInterval(intervalId);
					resolve("success");
				}

				checkTimeout(startTime, timeout, intervalId, resolve);
			} catch (e) {
				if (isExecaErrorWithErrorCode(e, "no required checks reported")) {
					console.log("No required checks reported.");
					clearInterval(intervalId);
					resolve("failed");
				}
				if (isExecaErrorWithErrorCode(e, "no checks reported")) {
					return; // continue checking
				}

				checkTimeout(startTime, timeout, intervalId, resolve);

				clearInterval(intervalId);
				reject(e);
			}
		};

		const intervalId = setInterval(checkStatus, interval);
		checkStatus();
	});
}

function checkTimeout(
	startTime: number,
	timeout: number,
	intervalId: NodeJS.Timeout,
	resolve: (reason?: string) => void,
) {
	if (Date.now() - startTime >= timeout) {
		console.log(
			`Timeout: Checks did not complete within ${timeout / 1000} seconds.`,
		);
		clearInterval(intervalId);
		resolve("timeout");
	}
}
