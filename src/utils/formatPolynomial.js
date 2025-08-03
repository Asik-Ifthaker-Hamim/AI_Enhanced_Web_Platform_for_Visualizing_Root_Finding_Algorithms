// Converts polynomial from caret notation (x^3) to superscript notation (x³)
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
