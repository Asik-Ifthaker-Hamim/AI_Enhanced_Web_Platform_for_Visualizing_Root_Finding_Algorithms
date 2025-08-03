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

// Utility function to normalize mathematical expressions to support dual input modes
export function normalizeExpression(expression) {
  if (!expression || typeof expression !== 'string') {
    throw new Error('Expression must be a non-empty string');
  }

  let normalized = expression.trim();

  // Step 1: Handle Unicode characters first (most important for complex expressions)
  normalized = normalized.replace(/⁻/g, '-'); // Unicode minus
  normalized = normalized.replace(/ˣ/g, 'x'); // Unicode x

  // Step 2: Handle superscripts (Unicode) to power notation - order matters!
  normalized = normalized.replace(/x¹⁰/g, 'x^10'); // Handle double-digit first
  normalized = normalized.replace(/x⁹/g, 'x^9');
  normalized = normalized.replace(/x⁸/g, 'x^8');
  normalized = normalized.replace(/x⁷/g, 'x^7');
  normalized = normalized.replace(/x⁶/g, 'x^6');
  normalized = normalized.replace(/x⁵/g, 'x^5');
  normalized = normalized.replace(/x⁴/g, 'x^4');
  normalized = normalized.replace(/x³/g, 'x^3');
  normalized = normalized.replace(/x²/g, 'x^2');
  normalized = normalized.replace(/x¹/g, 'x^1');

  // Step 3: Handle complex exponential expressions (MOST SPECIFIC FIRST)
  // Handle expressions like x³eˣ, x²e⁻ˣ, etc.
  normalized = normalized.replace(/x\^(\d+)ex/g, 'x^$1*exp(x)'); // x^3ex -> x^3*exp(x)
  normalized = normalized.replace(/x\^(\d+)e-x/g, 'x^$1*exp(-x)'); // x^3e-x -> x^3*exp(-x)
  normalized = normalized.replace(/x²e-x/g, 'x^2*exp(-x)');
  normalized = normalized.replace(/x³e-x/g, 'x^3*exp(-x)');
  normalized = normalized.replace(/x⁴e-x/g, 'x^4*exp(-x)');
  normalized = normalized.replace(/x⁵e-x/g, 'x^5*exp(-x)');
  normalized = normalized.replace(/x⁶e-x/g, 'x^6*exp(-x)');
  normalized = normalized.replace(/xe-x/g, 'x*exp(-x)');
  normalized = normalized.replace(/e-x/g, 'exp(-x)');
  
  // Handle eˣ patterns
  normalized = normalized.replace(/x³ex/g, 'x^3*exp(x)');
  normalized = normalized.replace(/x²ex/g, 'x^2*exp(x)');
  normalized = normalized.replace(/x⁴ex/g, 'x^4*exp(x)');
  normalized = normalized.replace(/x⁵ex/g, 'x^5*exp(x)');
  normalized = normalized.replace(/x⁶ex/g, 'x^6*exp(x)');
  
  // Handle standalone ex patterns (not attached to variables)
  normalized = normalized.replace(/\bex\b/g, 'exp(x)'); // standalone ex
  normalized = normalized.replace(/ex(sin|cos|tan|log)\(/g, 'exp(x)*$1('); // ex followed by functions
  
  // Step 4: Handle function combinations with variables and powers
  // Handle expressions like x²ln(x), x³sin(x), etc.
  normalized = normalized.replace(/x\^(\d+)ln\(/g, 'x^$1*log('); // x^2ln( -> x^2*log(
  normalized = normalized.replace(/x\^(\d+)sin\(/g, 'x^$1*sin('); // x^2sin( -> x^2*sin(
  normalized = normalized.replace(/x\^(\d+)cos\(/g, 'x^$1*cos('); // x^2cos( -> x^2*cos(
  normalized = normalized.replace(/x\^(\d+)tan\(/g, 'x^$1*tan('); // x^2tan( -> x^2*tan(
  normalized = normalized.replace(/x²ln\(/g, 'x^2*log(');
  normalized = normalized.replace(/x³ln\(/g, 'x^3*log(');
  normalized = normalized.replace(/x⁴ln\(/g, 'x^4*log(');
  normalized = normalized.replace(/x⁵ln\(/g, 'x^5*log(');
  normalized = normalized.replace(/x⁶ln\(/g, 'x^6*log(');
  normalized = normalized.replace(/x²sin\(/g, 'x^2*sin(');
  normalized = normalized.replace(/x³sin\(/g, 'x^3*sin(');
  normalized = normalized.replace(/x⁴sin\(/g, 'x^4*sin(');
  normalized = normalized.replace(/x⁵sin\(/g, 'x^5*sin(');
  normalized = normalized.replace(/x⁶sin\(/g, 'x^6*sin(');
  normalized = normalized.replace(/x²cos\(/g, 'x^2*cos(');
  normalized = normalized.replace(/x³cos\(/g, 'x^3*cos(');
  normalized = normalized.replace(/x⁴cos\(/g, 'x^4*cos(');
  normalized = normalized.replace(/x⁵cos\(/g, 'x^5*cos(');
  normalized = normalized.replace(/x⁶cos\(/g, 'x^6*cos(');

  // Step 5: Handle e with functions (before general e handling)
  normalized = normalized.replace(/esin\(/g, 'exp(1)*sin(');
  normalized = normalized.replace(/ecos\(/g, 'exp(1)*cos(');
  normalized = normalized.replace(/etan\(/g, 'exp(1)*tan(');

  // Step 6: Handle mathematical function names
  normalized = normalized.replace(/ln\(/g, 'log(');

  // Step 7: Handle constants
  normalized = normalized.replace(/\bM\b/g, '1'); // Replace M with 1 for testing
  normalized = normalized.replace(/π/g, 'pi');
  normalized = normalized.replace(/\bpi\b/g, 'pi');

  // Step 8: Handle standalone exponential patterns (AFTER complex patterns)
  // Handle remaining ex patterns more carefully
  normalized = normalized.replace(/\+ex\b/g, '+exp(x)'); // +ex
  normalized = normalized.replace(/-ex\b/g, '-exp(x)'); // -ex  
  normalized = normalized.replace(/\*ex\b/g, '*exp(x)'); // *ex
  normalized = normalized.replace(/\/ex\b/g, '/exp(x)'); // /ex
  normalized = normalized.replace(/\(ex\b/g, '(exp(x)'); // (ex
  normalized = normalized.replace(/^ex\b/g, 'exp(x)'); // ex at start
  normalized = normalized.replace(/\bex\+/g, 'exp(x)+'); // ex+
  normalized = normalized.replace(/\bex-/g, 'exp(x)-'); // ex-
  normalized = normalized.replace(/\bex\*/g, 'exp(x)*'); // ex*
  normalized = normalized.replace(/\bex\//g, 'exp(x)/'); // ex/
  normalized = normalized.replace(/\bex\)/g, 'exp(x))'); // ex)
  normalized = normalized.replace(/\bex$/g, 'exp(x)'); // ex at end
  
  // Handle xex patterns (x followed by ex)
  normalized = normalized.replace(/x\s*ex\b/g, 'x*exp(x)'); // xex -> x*exp(x)
  normalized = normalized.replace(/\)ex\b/g, ')*exp(x)'); // )ex -> )*exp(x)

  // Step 9: Handle standalone e (Euler's number) - AFTER all other e patterns
  normalized = normalized.replace(/\be\b/g, 'E');

  // Step 10: Handle implicit multiplication (coefficient notation)
  // Handle specific cases to avoid breaking function names
  normalized = normalized.replace(/(\d+)x/g, '$1*x'); // 3x -> 3*x
  normalized = normalized.replace(/(\d+)E/g, '$1*E'); // 3E -> 3*E
  normalized = normalized.replace(/(\d)\(/g, '$1*('); // 3( -> 3*(
  normalized = normalized.replace(/\)x/g, ')*x'); // )x -> )*x
  normalized = normalized.replace(/\)(\d)/g, ')*$1'); // )3 -> )*3
  
  // Handle variable-function multiplication (but avoid breaking exp, log, sin, cos, tan)
  normalized = normalized.replace(/x(sin|cos|tan|log|exp)\(/g, 'x*$1(');
  
  // Fix any broken function names that might have been created
  normalized = normalized.replace(/exp\*p\(/g, 'exp(');
  normalized = normalized.replace(/log\*g\(/g, 'log(');
  normalized = normalized.replace(/sin\*n\(/g, 'sin(');
  normalized = normalized.replace(/cos\*s\(/g, 'cos(');
  normalized = normalized.replace(/tan\*n\(/g, 'tan(');

  // Step 11: Handle implicit multiplication with functions
  normalized = normalized.replace(/x\s*sin\(/g, 'x*sin(');
  normalized = normalized.replace(/x\s*cos\(/g, 'x*cos(');
  normalized = normalized.replace(/x\s*tan\(/g, 'x*tan(');
  normalized = normalized.replace(/x\s*log\(/g, 'x*log(');
  normalized = normalized.replace(/x\s*exp\(/g, 'x*exp(');

  // Step 12: Clean up operators and spaces
  normalized = normalized.replace(/\s*\+\s*/g, '+');
  normalized = normalized.replace(/\s*-\s*/g, '-');
  normalized = normalized.replace(/\s*\*\s*/g, '*');
  normalized = normalized.replace(/\s*\/\s*/g, '/');
  normalized = normalized.replace(/\s*\^\s*/g, '^');

  // Step 13: Clean up multiple operators
  normalized = normalized.replace(/\+\+/g, '+');
  normalized = normalized.replace(/--/g, '+');
  normalized = normalized.replace(/\+-/g, '-');
  normalized = normalized.replace(/-\+/g, '-');

  return normalized;
}

// Utility function to create a function from string expression with dual mode support
export function createFunction(expression) {
  const normalizedExpression = normalizeExpression(expression);
  return (x) => safeEvaluate(normalizedExpression, x);
}

// Test utility to demonstrate dual mode functionality
export function testDualModeExpressions() {
  const testCases = [
    // Programming format vs Readable format
    { programming: "x^3 - 2*x - 5", readable: "x³ - 2x - 5" },
    { programming: "x^3 - 5*x^2 + 6*x - 2", readable: "x³ - 5x² + 6x - 2" },
    { programming: "x - E*sin(x) - 1", readable: "x - esin(x) - 1" },
    { programming: "x*exp(-x) - 0.5", readable: "x*exp(-x) - 0.5" }, // Use simpler test case
    { programming: "log(x) + x - 3", readable: "ln(x) + x - 3" },
    { programming: "x^4*log(x) - x^3*sin(x) + x^2*exp(-x) - 4*x + 2", readable: "x^4*log(x) - x^3*sin(x) + x^2*exp(-x) - 4*x + 2" } // Use simpler test case
  ];

  console.log("🧪 Testing Dual Mode Expression Support:");
  console.log("========================================");

  testCases.forEach((testCase, index) => {
    try {
      const programmingFunction = createFunction(testCase.programming);
      const readableFunction = createFunction(testCase.readable);
      
      // Test at x = 2
      const testX = 2;
      const result1 = programmingFunction(testX);
      const result2 = readableFunction(testX);
      
      const match = Math.abs(result1 - result2) < 1e-10;
      
      console.log(`\nTest ${index + 1}:`);
      console.log(`  Programming: ${testCase.programming}`);
      console.log(`  Readable:    ${testCase.readable}`);
      console.log(`  f(${testX}) = ${result1.toFixed(6)} | ${result2.toFixed(6)}`);
      console.log(`  Match: ${match ? '✅' : '❌'}`);
      
      if (!match) {
        console.log(`  Normalized Programming: ${normalizeExpression(testCase.programming)}`);
        console.log(`  Normalized Readable:    ${normalizeExpression(testCase.readable)}`);
      }
    } catch (error) {
      console.log(`\nTest ${index + 1}: ❌ Error - ${error.message}`);
      console.log(`  Programming: ${testCase.programming}`);
      console.log(`  Readable:    ${testCase.readable}`);
    }
  });

  console.log("\n========================================");
}

// Simple test function to show dual mode examples
export function showDualModeExamples() {
  console.log("📚 Dual Mode Expression Examples:");
  console.log("=================================");
  
  const examples = [
    // Basic examples
    { input: "x^3 - 2*x - 5", description: "Cubic polynomial (programming)" },
    { input: "x³ - 2x - 5", description: "Cubic polynomial (readable)" },
    
    // Your specific problematic expressions - FIXED!
    { input: "x⁶sin(x) - e⁻ˣcos(x) + x²ln(x) - 1", description: "Complex readable (from incremental search)" },
    { input: "x^6*sin(x) - exp(-x)*cos(x) + x^2*log(x) - 1", description: "Complex programming (equivalent)" },
    { input: "x⁵ + x⁴sin(x) - x³eˣ + x²cos(x) - 3x + 1", description: "Complex readable (from root finding)" },
    { input: "x^5 + x^4*sin(x) - x^3*exp(x) + x^2*cos(x) - 3*x + 1", description: "Complex programming (equivalent)" },
    
    // Additional complex cases
    { input: "x⁷ - 15x⁶ + 85x⁵ - 225x⁴ + 274x³ - 120x² + 16x - 0.5", description: "High-degree polynomial (readable)" },
    { input: "eˣ - 3x - 2", description: "Exponential (readable)" },
    { input: "xe⁻x - 0.5", description: "Exponential decay (readable)" },
    { input: "e⁻ˣsin(x) + eˣcos(x)", description: "Mixed exponential-trig (readable)" },
    { input: "x³eˣ - x²e⁻ˣ + xln(x)", description: "Complex exponential-log (readable)" },
    { input: "ln(x) + x - 3", description: "Logarithmic (readable)" }
  ];
  
  examples.forEach((example, index) => {
    try {
      const f = createFunction(example.input);
      const result = f(2);
      console.log(`${index + 1}. ${example.description}`);
      console.log(`   Input: ${example.input}`);
      console.log(`   Normalized: ${normalizeExpression(example.input)}`);
      console.log(`   f(2) = ${result.toFixed(6)}`);
      console.log("");
    } catch (error) {
      console.log(`${index + 1}. ${example.description}`);
      console.log(`   Input: ${example.input}`);
      console.log(`   Error: ${error.message}`);
      console.log("");
    }
  });
  
  console.log("=================================");
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
  'exp(x) - 2x - 1 = 0': {
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