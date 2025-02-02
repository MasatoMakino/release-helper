import { getCheckStatus } from "@/postVersion/getCheckState.js";
import { ExecaError, execa } from "execa";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("execa");

describe("getCheckStatus", () => {
	const prURL = "https://github.com/repo/pull/1";
	const mockedExeca = vi.mocked(execa);

	afterEach(() => {
		mockedExeca.mockClear();
		vi.resetAllMocks();
	});

	it('should resolve with "success" when all checks pass', async () => {
		//@ts-ignore
		mockedExeca.mockResolvedValue({
			stdout: JSON.stringify([{ state: "SUCCESS" }, { state: "SUCCESS" }]),
		});

		const result = await getCheckStatus(prURL);
		expect(result).toBe("success");
	});

	it('should resolve with "failed" when some checks fail', async () => {
		//@ts-ignore
		mockedExeca.mockResolvedValue({
			stdout: JSON.stringify([{ state: "SUCCESS" }, { state: "FAILURE" }]),
		});

		const result = await getCheckStatus(prURL);
		expect(result).toBe("failed");
	});

	it('should resolve with "timeout" when checks do not complete in time', async () => {
		const mockedConsole = vi.spyOn(console, "log").mockImplementation(() => {});
		vi.useFakeTimers();
		const promise = getCheckStatus(prURL);
		vi.advanceTimersByTime(180_000);
		const result = await promise;
		expect(result).toBe("timeout");
		vi.useRealTimers();
		mockedConsole.mockRestore();
	});

	it('should resolve with "failed" when no required checks are reported', async () => {
		const execaError = new ExecaError();
		execaError.stderr = "no required checks reported";
		//@ts-ignore
		mockedExeca.mockRejectedValue(execaError);

		const result = await getCheckStatus(prURL);
		expect(result).toBe("failed");
	});

	it("should continue checking when no checks are reported", async () => {
		const execaError = new ExecaError();
		execaError.stderr = "no checks reported";
		//@ts-ignore
		mockedExeca.mockRejectedValueOnce(execaError);
		//@ts-ignore
		mockedExeca.mockResolvedValue({
			stdout: JSON.stringify([{ state: "SUCCESS" }]),
		});

		const result = await getCheckStatus(prURL, 10);
		expect(result).toBe("success");
	});
});
