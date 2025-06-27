import { evaluate } from 'mathjs';

// Base class for numerical method results
export class NumericalResult {
  constructor() {
    this.root = null;
    this.iterations = 0;
    this.convergenceAchieved = false;
    this.finalError = null;
    this.executionTime = 0;
    this.functionEvaluations = 0;
    this.iterationHistory = [];
    this.errorMessage = null;
  }
}

// Iteration data structure
export class IterationData {
  constructor(iteration, xValue, fValue, error = null, additionalData = {}) {
    this.iteration = iteration;
    this.xValue = xValue;
    this.fValue = fValue;
    this.error = error;
    this.additionalData = additionalData;
  }
}

// Utility function to evaluate mathematical expressions safely
export function safeEvaluate(expression, x) {
  try {
    const scope = { x, Math, math: Math };
    return evaluate(expression, scope);
  } catch (error) {
    throw new Error(`Error evaluating expression "${expression}" at x=${x}: ${error.message}`);
  }
}

// Utility function to create a function from string expression
export function createFunction(expression) {
  return (x) => safeEvaluate(expression, x);
}

// Bisection Method
export function bisectionMethod(functionExpr, a, b, tolerance = 1e-6, maxIterations = 100) {
  const result = new NumericalResult();
  const startTime = performance.now();
  
  try {
    const f = createFunction(functionExpr);
    let fa = f(a);
    let fb = f(b);
    result.functionEvaluations += 2;
    
    // Check if the function has opposite signs at the endpoints
    if (fa * fb > 0) {
      throw new Error(`Function must have opposite signs at endpoints. f(${a}) = ${fa.toFixed(6)}, f(${b}) = ${fb.toFixed(6)}`);
    }
    
    // Check if we already have a root at the endpoints
    if (Math.abs(fa) < tolerance) {
      result.root = a;
      result.convergenceAchieved = true;
      result.finalError = Math.abs(fa);
      result.executionTime = performance.now() - startTime;
      return result;
    }
    
    if (Math.abs(fb) < tolerance) {
      result.root = b;
      result.convergenceAchieved = true;
      result.finalError = Math.abs(fb);
      result.executionTime = performance.now() - startTime;
      return result;
    }
    
    let c, fc;
    
    for (let i = 0; i < maxIterations; i++) {
      c = (a + b) / 2;
      fc = f(c);
      result.functionEvaluations++;
      
      const error = Math.abs(b - a) / 2;
      result.iterationHistory.push(new IterationData(i + 1, c, fc, error, { a, b, interval: b - a }));
      
      if (Math.abs(fc) < tolerance || error < tolerance) {
        result.root = c;
        result.convergenceAchieved = true;
        result.finalError = Math.abs(fc);
        result.iterations = i + 1;
        break;
      }
      
      if (fa * fc < 0) {
        b = c;
        fb = fc;
      } else {
        a = c;
        fa = fc;
      }
      
      result.iterations = i + 1;
    }
    
    if (!result.convergenceAchieved) {
      result.root = c;
      result.finalError = Math.abs(fc);
      result.errorMessage = `Maximum iterations (${maxIterations}) reached without convergence`;
    }
    
  } catch (error) {
    result.errorMessage = error.message;
  }
  
  result.executionTime = performance.now() - startTime;
  return result;
}

// False Position Method (Regula Falsi)
export function falsePositionMethod(functionExpr, a, b, tolerance = 1e-6, maxIterations = 100) {
  const result = new NumericalResult();
  const startTime = performance.now();
  
  try {
    const f = createFunction(functionExpr);
    let fa = f(a);
    let fb = f(b);
    result.functionEvaluations += 2;
    
    if (fa * fb > 0) {
      throw new Error(`Function must have opposite signs at endpoints. f(${a}) = ${fa.toFixed(6)}, f(${b}) = ${fb.toFixed(6)}`);
    }
    
    let c, fc;
    
    for (let i = 0; i < maxIterations; i++) {
      c = b - (fb * (b - a)) / (fb - fa);
      fc = f(c);
      result.functionEvaluations++;
      
      const error = Math.abs(fc);
      result.iterationHistory.push(new IterationData(i + 1, c, fc, error, { a, b }));
      
      if (Math.abs(fc) < tolerance) {
        result.root = c;
        result.convergenceAchieved = true;
        result.finalError = Math.abs(fc);
        result.iterations = i + 1;
        break;
      }
      
      if (fa * fc < 0) {
        b = c;
        fb = fc;
      } else {
        a = c;
        fa = fc;
      }
      
      result.iterations = i + 1;
    }
    
    if (!result.convergenceAchieved) {
      result.root = c;
      result.finalError = Math.abs(fc);
      result.errorMessage = `Maximum iterations (${maxIterations}) reached without convergence`;
    }
    
  } catch (error) {
    result.errorMessage = error.message;
  }
  
  result.executionTime = performance.now() - startTime;
  return result;
}

// Newton-Raphson Method
export function newtonRaphsonMethod(functionExpr, derivativeExpr, x0, tolerance = 1e-6, maxIterations = 100) {
  const result = new NumericalResult();
  const startTime = performance.now();
  
  try {
    const f = createFunction(functionExpr);
    const df = derivativeExpr ? createFunction(derivativeExpr) : null;
    
    if (!df) {
      throw new Error('Derivative function is required for Newton-Raphson method');
    }
    
    let x = x0;
    let fx = f(x);
    result.functionEvaluations++;
    
    for (let i = 0; i < maxIterations; i++) {
      const dfx = df(x);
      result.functionEvaluations++;
      
      if (Math.abs(dfx) < 1e-14) {
        throw new Error(`Derivative is zero at x = ${x}. Cannot continue with Newton-Raphson method.`);
      }
      
      const xNew = x - fx / dfx;
      const fxNew = f(xNew);
      result.functionEvaluations++;
      
      const error = Math.abs(xNew - x);
      result.iterationHistory.push(new IterationData(i + 1, xNew, fxNew, error, { previousX: x, derivative: dfx }));
      
      if (Math.abs(fxNew) < tolerance || error < tolerance) {
        result.root = xNew;
        result.convergenceAchieved = true;
        result.finalError = Math.abs(fxNew);
        result.iterations = i + 1;
        break;
      }
      
      x = xNew;
      fx = fxNew;
      result.iterations = i + 1;
    }
    
    if (!result.convergenceAchieved) {
      result.root = x;
      result.finalError = Math.abs(fx);
      result.errorMessage = `Maximum iterations (${maxIterations}) reached without convergence`;
    }
    
  } catch (error) {
    result.errorMessage = error.message;
  }
  
  result.executionTime = performance.now() - startTime;
  return result;
}

// Secant Method
export function secantMethod(functionExpr, x0, x1, tolerance = 1e-6, maxIterations = 100) {
  const result = new NumericalResult();
  const startTime = performance.now();
  
  try {
    const f = createFunction(functionExpr);
    let fx0 = f(x0);
    let fx1 = f(x1);
    result.functionEvaluations += 2;
    
    for (let i = 0; i < maxIterations; i++) {
      if (Math.abs(fx1 - fx0) < 1e-14) {
        throw new Error(`Function values are too close. Cannot continue with secant method.`);
      }
      
      const x2 = x1 - fx1 * (x1 - x0) / (fx1 - fx0);
      const fx2 = f(x2);
      result.functionEvaluations++;
      
      const error = Math.abs(x2 - x1);
      result.iterationHistory.push(new IterationData(i + 1, x2, fx2, error, { x0, x1, slope: (fx1 - fx0)/(x1 - x0) }));
      
      if (Math.abs(fx2) < tolerance || error < tolerance) {
        result.root = x2;
        result.convergenceAchieved = true;
        result.finalError = Math.abs(fx2);
        result.iterations = i + 1;
        break;
      }
      
      x0 = x1;
      fx0 = fx1;
      x1 = x2;
      fx1 = fx2;
      result.iterations = i + 1;
    }
    
    if (!result.convergenceAchieved) {
      result.root = x1;
      result.finalError = Math.abs(fx1);
      result.errorMessage = `Maximum iterations (${maxIterations}) reached without convergence`;
    }
    
  } catch (error) {
    result.errorMessage = error.message;
  }
  
  result.executionTime = performance.now() - startTime;
  return result;
}

// Fixed Point Method
export function fixedPointMethod(gFunctionExpr, x0, tolerance = 1e-6, maxIterations = 100) {
  const result = new NumericalResult();
  const startTime = performance.now();
  
  try {
    const g = createFunction(gFunctionExpr);
    let x = x0;
    
    for (let i = 0; i < maxIterations; i++) {
      const xNew = g(x);
      result.functionEvaluations++;
      
      const error = Math.abs(xNew - x);
      result.iterationHistory.push(new IterationData(i + 1, xNew, 0, error, { previousX: x, gValue: xNew }));
      
      if (error < tolerance) {
        result.root = xNew;
        result.convergenceAchieved = true;
        result.finalError = error;
        result.iterations = i + 1;
        break;
      }
      
      // Check for divergence
      if (Math.abs(xNew) > 1e10) {
        throw new Error('Method appears to be diverging. Try a different initial guess or g(x) function.');
      }
      
      x = xNew;
      result.iterations = i + 1;
    }
    
    if (!result.convergenceAchieved) {
      result.root = x;
      result.finalError = Math.abs(g(x) - x);
      result.errorMessage = `Maximum iterations (${maxIterations}) reached without convergence`;
    }
    
  } catch (error) {
    result.errorMessage = error.message;
  }
  
  result.executionTime = performance.now() - startTime;
  return result;
}

// Muller's Method
export function mullerMethod(functionExpr, x0, x1, x2, tolerance = 1e-6, maxIterations = 100) {
  const result = new NumericalResult();
  const startTime = performance.now();
  
  try {
    const f = createFunction(functionExpr);
    let y0 = f(x0);
    let y1 = f(x1);
    let y2 = f(x2);
    result.functionEvaluations += 3;
    
    for (let i = 0; i < maxIterations; i++) {
      // Calculate divided differences
      const h0 = x1 - x0;
      const h1 = x2 - x1;
      const d0 = (y1 - y0) / h0;
      const d1 = (y2 - y1) / h1;
      const a = (d1 - d0) / (h1 + h0);
      const b = a * h1 + d1;
      const c = y2;
      
      // Calculate discriminant
      const discriminant = b * b - 4 * a * c;
      
      if (discriminant < 0) {
        // Complex roots - for now, we'll handle the real part
        const realPart = -b / (2 * a);
        const x3 = x2 + realPart;
        const y3 = f(x3);
        result.functionEvaluations++;
        
        const error = Math.abs(x3 - x2);
        result.iterationHistory.push(new IterationData(i + 1, x3, y3, error, { discriminant, isComplex: true }));
        
        if (Math.abs(y3) < tolerance || error < tolerance) {
          result.root = x3;
          result.convergenceAchieved = true;
          result.finalError = Math.abs(y3);
          result.iterations = i + 1;
          break;
        }
        
        x0 = x1; y0 = y1;
        x1 = x2; y1 = y2;
        x2 = x3; y2 = y3;
      } else {
        // Real roots
        const sqrtDiscriminant = Math.sqrt(discriminant);
        const denom1 = b + sqrtDiscriminant;
        const denom2 = b - sqrtDiscriminant;
        
        // Choose the denominator with larger absolute value for better numerical stability
        const denom = Math.abs(denom1) > Math.abs(denom2) ? denom1 : denom2;
        
        const x3 = x2 - 2 * c / denom;
        const y3 = f(x3);
        result.functionEvaluations++;
        
        const error = Math.abs(x3 - x2);
        result.iterationHistory.push(new IterationData(i + 1, x3, y3, error, { discriminant, a, b, c }));
        
        if (Math.abs(y3) < tolerance || error < tolerance) {
          result.root = x3;
          result.convergenceAchieved = true;
          result.finalError = Math.abs(y3);
          result.iterations = i + 1;
          break;
        }
        
        x0 = x1; y0 = y1;
        x1 = x2; y1 = y2;
        x2 = x3; y2 = y3;
      }
      
      result.iterations = i + 1;
    }
    
    if (!result.convergenceAchieved) {
      result.root = x2;
      result.finalError = Math.abs(y2);
      result.errorMessage = `Maximum iterations (${maxIterations}) reached without convergence`;
    }
    
  } catch (error) {
    result.errorMessage = error.message;
  }
  
  result.executionTime = performance.now() - startTime;
  return result;
}

// Predefined test functions
export const predefinedFunctions = {
  'x³ - x - 1 = 0': {
    expression: 'x^3 - x - 1',
    derivative: '3*x^2 - 1',
    interval: [1, 2],
    guess: 1.5,
    description: 'Cubic polynomial with one real root'
  },
  'x² - 4 = 0': {
    expression: 'x^2 - 4',
    derivative: '2*x',
    interval: [1, 3],
    guess: 2,
    description: 'Simple quadratic equation'
  },
  'e^x - 2x - 1 = 0': {
    expression: 'exp(x) - 2*x - 1',
    derivative: 'exp(x) - 2',
    interval: [1, 2],
    guess: 1.5,
    description: 'Exponential equation'
  },
  'cos(x) - x = 0': {
    expression: 'cos(x) - x',
    derivative: '-sin(x) - 1',
    interval: [0, 1],
    guess: 0.5,
    description: 'Transcendental equation'
  },
  'x·sin(x) - 1 = 0': {
    expression: 'x * sin(x) - 1',
    derivative: 'sin(x) + x * cos(x)',
    interval: [1, 2],
    guess: 1.5,
    description: 'Product of trigonometric and polynomial'
  },
  'x³ - 6x² + 11x - 6 = 0': {
    expression: 'x^3 - 6*x^2 + 11*x - 6',
    derivative: '3*x^2 - 12*x + 11',
    interval: [0, 2],
    guess: 1,
    description: 'Cubic with multiple real roots'
  }
};

// Utility function to compare all methods
export function compareAllMethods(functionData, tolerance = 1e-6, maxIterations = 100) {
  const results = {};
  
  const { expression, derivative: derivativeExpr, interval, guess } = functionData;
  const [a, b] = interval;
  
  // Bisection Method
  try {
    results.bisection = bisectionMethod(expression, a, b, tolerance, maxIterations);
  } catch (error) {
    results.bisection = { errorMessage: error.message };
  }
  
  // False Position Method
  try {
    results.falsePosition = falsePositionMethod(expression, a, b, tolerance, maxIterations);
  } catch (error) {
    results.falsePosition = { errorMessage: error.message };
  }
  
  // Newton-Raphson Method (if derivative is available)
  if (derivativeExpr) {
    try {
      results.newtonRaphson = newtonRaphsonMethod(expression, derivativeExpr, guess, tolerance, maxIterations);
    } catch (error) {
      results.newtonRaphson = { errorMessage: error.message };
    }
  }
  
  // Secant Method
  try {
    results.secant = secantMethod(expression, a, b, tolerance, maxIterations);
  } catch (error) {
    results.secant = { errorMessage: error.message };
  }
  
  // Fixed Point Method (g(x) = x - f(x)/10 as a simple transformation)
  try {
    const gExpression = `x - (${expression})/10`;
    results.fixedPoint = fixedPointMethod(gExpression, guess, tolerance, maxIterations);
  } catch (error) {
    results.fixedPoint = { errorMessage: error.message };
  }
  
  // Muller's Method
  try {
    const mid = (a + b) / 2;
    results.muller = mullerMethod(expression, a, mid, b, tolerance, maxIterations);
  } catch (error) {
    results.muller = { errorMessage: error.message };
  }
  
  return results;
} 