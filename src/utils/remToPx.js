/**
 * Converts a value in rem to pixels.
 * @param {number} rem - The value in rem to convert.
 * @returns {number} The equivalent value in pixels.
 */
const remToPx = (rem) => {
	const htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
	return rem * htmlFontSize;
};

export default remToPx;