import * as path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
		coverage: {
			reporter: ["text", "lcov", "json-summary", "json"],
			reportOnFailure: true,
			include: ["src/**/*.ts"],
		},
	},
});
