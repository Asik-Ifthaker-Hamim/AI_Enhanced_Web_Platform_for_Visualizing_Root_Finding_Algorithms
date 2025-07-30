import { evaluate } from 'mathjs';

/**
 * Performs incremental search to find intervals containing roots
 * @param {string} func - Mathematical function as string
 * @param {number} start - Starting point
 * @param {number} end - Ending point
 * @param {number} increment - Step size
 * @returns {object} - Object containing intervals and evaluation points
 */
export function incrementalSearch(func, start, end, increment) {
  if (!func || func.trim() === '') {
    throw new Error('Function cannot be empty');
  }

  if (start >= end) {
    throw new Error('Start value must be less than end value');
  }

  if (increment <= 0) {
    throw new Error('Increment must be positive');
  }

  const intervals = [];
  const evaluations = [];
  
  try {
    let x = start;
    let prevF = evaluate(func, { x: x });
    
    evaluations.push({ x: x, fx: prevF });
    
    x += increment;
    
    while (x <= end) {
      const currentF = evaluate(func, { x: x });
      evaluations.push({ x: x, fx: currentF });
      
      // Check for sign change (potential root)
      if (prevF * currentF < 0) {
        intervals.push({
          a: x - increment,
          b: x,
          fa: prevF,
          fb: currentF,
          signChange: `f(${(x - increment).toFixed(6)}) = ${prevF.toFixed(6)}, f(${x.toFixed(6)}) = ${currentF.toFixed(6)}`
        });
      }
      
      prevF = currentF;
      x += increment;
    }
    
    return {
      intervals,
      evaluations,
      totalPoints: evaluations.length,
      searchRange: [start, end],
      increment
    };
    
  } catch (error) {
    throw new Error(`Error evaluating function: ${error.message}`);
  }
} 