import { wrapDependencies } from "@/util/wrapDependencies.js";
import { describe, expect, it } from "vitest";

const testBody = `<!-- Release notes generated using configuration in .github/release.yml at main -->

## What's Changed
### 🪛 Changes
* Improve error message for missing required status checks by @MasatoMakino in https://github.com/MasatoMakino/release-helper/pull/31
### 🔧 Dependencies
* build(deps-dev): bump lefthook from 1.10.0 to 1.10.1 by @dependabot in https://github.com/MasatoMakino/release-helper/pull/32


**Full Changelog**: https://github.com/MasatoMakino/release-helper/compare/v0.1.6...v0.1.6-preview0`;

const expected = `<!-- Release notes generated using configuration in .github/release.yml at main -->

## What's Changed
### 🪛 Changes
* Improve error message for missing required status checks by @MasatoMakino in https://github.com/MasatoMakino/release-helper/pull/31

### 🔧 Dependencies

<details>
<summary>All Updated Dependencies</summary>

* build(deps-dev): bump lefthook from 1.10.0 to 1.10.1 by @dependabot in https://github.com/MasatoMakino/release-helper/pull/32

</details>



**Full Changelog**: https://github.com/MasatoMakino/release-helper/compare/v0.1.6...v0.1.6-preview0`;

describe("wrapDependencies", () => {
	it("should wrap dependencies section in a collapsible details element", () => {
		expect(wrapDependencies(testBody)).toBe(expected);
	});

	it("should return null if there is no dependencies section", () => {
		const body = `
### Other Section
- other1
- other2
`;
		expect(wrapDependencies(body)).toBeNull();
	});

	it("should not handle dependencies section at the end of the body", () => {
		const body = `
### Other Section
- other1
- other2

### 🔧 Dependencies
- dependency1
- dependency2
`;
		expect(wrapDependencies(body)).toBeNull();
	});

	it("should handle empty dependencies section", () => {
		const body = `### 🔧 Dependencies

### Other Section
- other1
- other2
`;
		const expected = `
### 🔧 Dependencies

<details>
<summary>All Updated Dependencies</summary>



</details>

### Other Section
- other1
- other2
`;
		expect(wrapDependencies(body)).toBe(expected);
	});
});
