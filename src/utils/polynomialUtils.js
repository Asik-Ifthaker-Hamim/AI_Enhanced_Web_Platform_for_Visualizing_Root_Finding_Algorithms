// Polynomial utility functions for efficient evaluation and manipulation

// Horner's Rule - efficiently evaluates polynomial using nested multiplication
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

// Horner's Rule with detailed steps shown for educational purposes
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

// Polynomial deflation - divides polynomial by (x - root) using synthetic division
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

// Creates readable string representation of polynomial from coefficient array
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

// Parses space-separated coefficient string into number array
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

// Applies polynomial deflation successively for multiple known roots
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