/**
 * Wraps the dependencies section in a collapsible details element.
 * @param body
 * @returns
 */
export function wrapDependencies(body: string): string | null {
	const dependenciesSectionRegex =
		/(### 🔧 Dependencies\n)([\s\S]*?)(?=\n### |\n\n)/;
	const match = body.match(dependenciesSectionRegex);

	if (!match) {
		return null;
	}

	const wrappedDependencies = `
${match[1].trim()}

<details>
<summary>All Updated Dependencies</summary>

${match[2].trim()}

</details>
`;
	return body.replace(dependenciesSectionRegex, wrappedDependencies);
}
