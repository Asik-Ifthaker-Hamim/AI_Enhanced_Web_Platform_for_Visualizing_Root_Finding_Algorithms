/**
 * Convert a polynomial string from caret notation to superscript notation
 * @param {string} polynomial - Polynomial in caret notation (e.g., "x^3 - 6x^2 + 11x - 6")
 * @returns {string} - Polynomial in superscript notation (e.g., "x³ - 6x² + 11x - 6")
 */
export function formatPolynomial(polynomial) {
  const superscripts = {
    '^2': '²',
    '^3': '³',
    '^4': '⁴',
    '^5': '⁵',
    '^6': '⁶',
    '^7': '⁷',
    '^8': '⁸',
    '^9': '⁹'
  };

  return polynomial.replace(/\^[2-9]/g, match => superscripts[match] || match);
}
