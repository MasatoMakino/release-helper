## TypeScript

- Ensure that import paths in TypeScript ESM include the .js extension.

### import path in src directory

- When importing files from the src directory, always use relative paths and include the .js extension.
- Do not use alias paths for src directory files.
- For external npm modules, import using the module name only.
- Note: In this project, alias paths are resolved only by Vitest. The tsc command does not resolve alias paths and does not perform path rewriting; therefore, alias paths must not be used in production code.
  
```typescript
// Correct examples:
import { execa } from "execa"; // external npm module import by name
import { isExecaErrorWithErrorCode } from "../util/index.js"; // src file: relative path with .js extension

// Incorrect example:
import { isExecaErrorWithErrorCode } from "@/util/index.js"; // alias path should not be used for src files
```

## Unit tests

- Use **Vitest** as the test framework.
- Do **not** use **Jest** or any other testing frameworks.
- Place unit tests under the `__test__` directory, with the same name as the target file and a `spec.ts` extension.

### vitest.config.ts

- Please refer to the test.alias property in vitest.config.ts for alias path configuration.

### tsconfig.json in __test__ directory

- Note: The tsconfig.json in the __test__ directory is used solely for VS Code’s real-time type checking and is not referenced by the tsc command.
- Additionally, the paths option configured in this tsconfig.json enables VS Code to recognize the alias paths defined in vitest.config.ts.

### vi.mock vs vi.spyOn

- Use vi.mock for mocking external modules (e.g. execa).
- Use vi.spyOn for mocking functions located in the src directory.

#### How to use vi.spyOn

- Note: A sample code demonstrating how to use vi.spyOn has been added below.
- Recommendation: 
  - Use alias paths when importing target modules.
  - Import the target module as a namespace and name it with a *Module suffix for clarity (e.g. ReleaseModule).
  - Always invoke vi.restoreAllMocks() in an afterEach block to reset mocks.

```typescript
import * as ReleaseModule from "@/release/index.js"; // prefer alias import and namespace usage

describe("release", () => {
	afterEach(() => {
		vi.restoreAllMocks(); // restore all mocks after each test
	});

	const mockReleaseModule = () => {
		const checkMergedMock = vi
			.spyOn(ReleaseModule, "checkMerged")
			.mockResolvedValue();
    };
});
```