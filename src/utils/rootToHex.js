/**
 * Converts a root-relative URL to a hex color code.
 * @param {string} root - The root-relative URL or CSS variable.
 * @param {HTMLElement || null} element - The HTML element to get the computed style from (default is document.documentElement). 
 * @returns {string} The hex color code.
 */
const rootToHex = (root, element) => {
	if (root.startsWith('#'))
		return root;

	if (root.startsWith('var(--')) {
		const rootVar = root.slice(4, -1);
		const rootElement = element || document.documentElement;
		if (!rootElement) return root;

		const computedStyle = getComputedStyle(rootElement);
		const colorValue = computedStyle.getPropertyValue(rootVar).trim();

		if (colorValue.startsWith('#'))
			return colorValue;
		else if (colorValue.startsWith('rgb')) {
			const rgbValues = colorValue.match(/\d+/g);
			if (rgbValues && rgbValues.length === 3)
				return `#${rgbValues.map(v => parseInt(v).toString(16).padStart(2, '0')).join('')}`;
		};
	};

	return root;
};

export default rootToHex;