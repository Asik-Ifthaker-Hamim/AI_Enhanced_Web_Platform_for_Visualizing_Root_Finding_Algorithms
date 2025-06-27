// Polynomial utility functions

/**
 * Horner's Rule for polynomial evaluation
 * Efficiently evaluates a polynomial at a given value using Horner's method
 * @param {number[]} coefficients - Array of coefficients [an, an-1, ..., a1, a0]
 * @param {number} x - Value at which to evaluate the polynomial
 * @returns {number} - The evaluated polynomial value
 */
export function hornersRule(coefficients, x) {
  if (!coefficients || coefficients.length === 0) {
    throw new Error('Coefficients array cannot be empty');
  }

  let result = coefficients[0];
  for (let i = 1; i < coefficients.length; i++) {
    result = result * x + coefficients[i];
  }
  
  return result;
}

/**
 * Horner's Rule with detailed steps for educational purposes
 * @param {number[]} coefficients - Array of coefficients [an, an-1, ..., a1, a0]
 * @param {number} x - Value at which to evaluate the polynomial
 * @returns {object} - Object containing result and step-by-step calculation
 */
export function hornersRuleDetailed(coefficients, x) {
  if (!coefficients || coefficients.length === 0) {
    throw new Error('Coefficients array cannot be empty');
  }

  const steps = [];
  let result = coefficients[0];
  
  steps.push({
    step: 0,
    operation: `Start with b₀ = a₀ = ${coefficients[0]}`,
    value: result
  });

  for (let i = 1; i < coefficients.length; i++) {
    const prevResult = result;
    result = result * x + coefficients[i];
    
    steps.push({
      step: i,
      operation: `b₍${i}₎ = b₍${i-1}₎ × x + a₍${i}₎ = ${prevResult} × ${x} + ${coefficients[i]} = ${result}`,
      value: result
    });
  }

  return {
    result,
    steps,
    polynomial: createPolynomialString(coefficients),
    evaluation: `P(${x}) = ${result}`
  };
}

/**
 * Polynomial deflation using synthetic division
 * Divides a polynomial by (x - root) to get the quotient polynomial
 * @param {number[]} coefficients - Array of coefficients [an, an-1, ..., a1, a0]
 * @param {number} root - Known root for deflation
 * @returns {object} - Object containing quotient coefficients and remainder
 */
export function polynomialDeflation(coefficients, root) {
  if (!coefficients || coefficients.length === 0) {
    throw new Error('Coefficients array cannot be empty');
  }

  if (coefficients.length === 1) {
    return {
      quotient: [],
      remainder: coefficients[0],
      steps: [],
      isExactRoot: Math.abs(coefficients[0]) < 1e-10
    };
  }

  const quotient = [];
  const steps = [];
  let temp = coefficients[0];
  
  quotient.push(temp);
  steps.push({
    step: 0,
    coefficient: coefficients[0],
    brought_down: coefficients[0],
    multiplication: 0,
    result: temp,
    operation: `Bring down ${coefficients[0]}`
  });

  for (let i = 1; i < coefficients.length; i++) {
    const multiplication = temp * root;
    temp = coefficients[i] + multiplication;
    
    if (i < coefficients.length - 1) {
      quotient.push(temp);
    }
    
    steps.push({
      step: i,
      coefficient: coefficients[i],
      brought_down: coefficients[i],
      multiplication: multiplication,
      result: temp,
      operation: i < coefficients.length - 1 
        ? `${coefficients[i]} + (${quotient[i-1]} × ${root}) = ${coefficients[i]} + ${multiplication} = ${temp}`
        : `Remainder: ${coefficients[i]} + (${quotient[i-1]} × ${root}) = ${coefficients[i]} + ${multiplication} = ${temp}`
    });
  }

  const remainder = temp;
  const isExactRoot = Math.abs(remainder) < 1e-10;

  return {
    quotient,
    remainder,
    steps,
    isExactRoot,
    originalPolynomial: createPolynomialString(coefficients),
    quotientPolynomial: quotient.length > 0 ? createPolynomialString(quotient) : '0',
    divisor: `(x - ${root})`,
    result: `${createPolynomialString(coefficients)} = (x - ${root})(${createPolynomialString(quotient)}) + ${remainder}`
  };
}

/**
 * Create a string representation of a polynomial from coefficients
 * @param {number[]} coefficients - Array of coefficients [an, an-1, ..., a1, a0]
 * @returns {string} - String representation of the polynomial
 */
export function createPolynomialString(coefficients) {
  if (!coefficients || coefficients.length === 0) {
    return '0';
  }

  if (coefficients.length === 1) {
    return coefficients[0].toString();
  }

  const terms = [];
  const degree = coefficients.length - 1;

  for (let i = 0; i < coefficients.length; i++) {
    const coeff = coefficients[i];
    const power = degree - i;

    if (coeff === 0) continue;

    let term = '';

    // Handle sign
    if (i === 0) {
      if (coeff < 0) term += '-';
    } else {
      term += coeff < 0 ? ' - ' : ' + ';
    }

    // Handle coefficient
    const absCoeff = Math.abs(coeff);
    if (power === 0 || absCoeff !== 1) {
      term += absCoeff;
    }

    // Handle variable and power
    if (power > 0) {
      term += 'x';
      if (power > 1) {
        term += `^${power}`;
      }
    }

    terms.push(term);
  }

  return terms.length > 0 ? terms.join('') : '0';
}

/**
 * Parse coefficients from a string input
 * @param {string} input - String containing space-separated coefficients
 * @returns {number[]} - Array of parsed coefficients
 */
export function parseCoefficients(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Input must be a non-empty string');
  }

  const coefficients = input.trim().split(/\s+/).map(str => {
    const num = parseFloat(str);
    if (isNaN(num)) {
      throw new Error(`Invalid coefficient: ${str}`);
    }
    return num;
  });

  if (coefficients.length === 0) {
    throw new Error('No valid coefficients found');
  }

  return coefficients;
}

/**
 * Find all roots of a polynomial using successive deflation
 * @param {number[]} coefficients - Array of coefficients
 * @param {number[]} knownRoots - Array of known roots
 * @returns {object} - Object containing deflation steps and remaining polynomial
 */
export function successiveDeflation(coefficients, knownRoots) {
  let currentCoeffs = [...coefficients];
  const deflationSteps = [];
  const allRemainders = [];

  for (const root of knownRoots) {
    const deflationResult = polynomialDeflation(currentCoeffs, root);
    
    deflationSteps.push({
      root,
      originalDegree: currentCoeffs.length - 1,
      quotientDegree: deflationResult.quotient.length - 1,
      remainder: deflationResult.remainder,
      isExactRoot: deflationResult.isExactRoot,
      steps: deflationResult.steps
    });

    allRemainders.push(deflationResult.remainder);
    currentCoeffs = deflationResult.quotient;

    if (currentCoeffs.length === 0) break;
  }

  return {
    deflationSteps,
    finalPolynomial: currentCoeffs,
    remainders: allRemainders,
    allExactRoots: allRemainders.every(r => Math.abs(r) < 1e-10)
  };
} 