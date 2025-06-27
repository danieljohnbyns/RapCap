/**
 * Converts a root-relative URL to a px value.
 * @param {string} root - The root-relative URL or CSS variable.
 * @returns {string} The px value or the original string if it cannot be converted.
 */
const rootToPx = (root) => {
	if (root.startsWith('#'))
		return root;

	if (root.startsWith('var(--')) {
		const rootVar = root.slice(4, -1);
		const rootElement = document.documentElement;
		const computedStyle = getComputedStyle(rootElement);
		const value = computedStyle.getPropertyValue(rootVar).trim();

		if (value.endsWith('px')) {
			return value;
		} else if (value.endsWith('rem')) {
			const remValue = parseFloat(value) * parseFloat(getComputedStyle(document.documentElement).fontSize);
			return `${remValue}px`;
		} else if (value.endsWith('em')) {
			const emValue = parseFloat(value) * parseFloat(getComputedStyle(document.body).fontSize);
			return `${emValue}px`;
		};
	};
};

export default rootToPx;