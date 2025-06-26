"""
Example functions for testing numerical methods.

This module provides a collection of well-known functions used for testing
root-finding algorithms in numerical methods courses.
"""

import numpy as np
import sympy as sp
from typing import Callable, Tuple, Dict, Optional


def get_example_functions() -> Dict[str, Tuple[Callable, Optional[Callable], str]]:
    """
    Get a dictionary of example functions for testing.
    
    Returns:
        Dictionary mapping function names to (function, derivative, description) tuples
    """
    
    examples = {
        "polynomial_cubic": (
            lambda x: x**3 - x - 1,
            lambda x: 3*x**2 - 1,
            "Cubic polynomial: x³ - x - 1 = 0 (Plastic number root ≈ 1.3247)"
        ),
        
        "polynomial_quartic": (
            lambda x: x**4 - 3*x**2 + 1,
            lambda x: 4*x**3 - 6*x,
            "Quartic polynomial: x⁴ - 3x² + 1 = 0"
        ),
        
        "polynomial_quintic": (
            lambda x: x**5 - 2*x**3 + x - 1,
            lambda x: 5*x**4 - 6*x**2 + 1,
            "Quintic polynomial: x⁵ - 2x³ + x - 1 = 0"
        ),
        
        "transcendental": (
            lambda x: np.cos(x) - x,
            lambda x: -np.sin(x) - 1,
            "Transcendental: cos(x) - x = 0 (root ≈ 0.7391)"
        ),
        
        "exponential": (
            lambda x: np.exp(x) - 3*x,
            lambda x: np.exp(x) - 3,
            "Exponential: eˣ - 3x = 0"
        ),
        
        "logarithmic": (
            lambda x: np.log(x) + x**2 - 2,
            lambda x: 1/x + 2*x,
            "Logarithmic: ln(x) + x² - 2 = 0"
        ),
        
        "trigonometric": (
            lambda x: np.sin(x) - x/2,
            lambda x: np.cos(x) - 0.5,
            "Trigonometric: sin(x) - x/2 = 0"
        ),
        
        "engineering_heat": (
            lambda x: x - 2*np.sin(x),
            lambda x: 1 - 2*np.cos(x),
            "Heat transfer: x - 2sin(x) = 0"
        ),
        
        "engineering_flow": (
            lambda x: x**3 - 2*x - 5,
            lambda x: 3*x**2 - 2,
            "Pipe flow: x³ - 2x - 5 = 0"
        ),
        
        "multiple_roots": (
            lambda x: (x - 1)**2 * (x - 3),
            lambda x: 2*(x - 1)*(x - 3) + (x - 1)**2,
            "Multiple roots: (x-1)²(x-3) = 0"
        ),
        
        "pathological": (
            lambda x: x**3 - 2*x + 2,
            lambda x: 3*x**2 - 2,
            "Pathological case: x³ - 2x + 2 = 0 (no real roots)"
        )
    }
    
    return examples


def create_custom_function(expression: str) -> Tuple[Callable, Callable, str]:
    """
    Create a function and its derivative from a string expression.
    
    Args:
        expression: Mathematical expression as string (e.g., "x**3 - x - 1")
        
    Returns:
        Tuple of (function, derivative, description)
        
    Example:
        >>> func, deriv, desc = create_custom_function("x**2 - 4")
        >>> print(func(2))  # Should be 0
        0
    """
    try:
        # Parse the expression using sympy
        x = sp.Symbol('x')
        expr = sp.sympify(expression)
        
        # Create derivative
        derivative_expr = sp.diff(expr, x)
        
        # Convert to callable functions
        func = sp.lambdify(x, expr, 'numpy')
        derivative = sp.lambdify(x, derivative_expr, 'numpy')
        
        description = f"Custom function: {expression} = 0"
        
        return func, derivative, description
        
    except Exception as e:
        raise ValueError(f"Error parsing expression '{expression}': {e}")


def get_function_properties(func: Callable, a: float, b: float, num_points: int = 1000) -> Dict:
    """
    Analyze properties of a function over an interval.
    
    Args:
        func: Function to analyze
        a: Left endpoint
        b: Right endpoint
        num_points: Number of points to sample
        
    Returns:
        Dictionary with function properties
    """
    x_vals = np.linspace(a, b, num_points)
    
    try:
        y_vals = np.array([func(x) for x in x_vals])
        
        # Find sign changes (potential roots)
        sign_changes = []
        for i in range(len(y_vals) - 1):
            if y_vals[i] * y_vals[i + 1] < 0:
                sign_changes.append((x_vals[i], x_vals[i + 1]))
        
        properties = {
            "interval": (a, b),
            "min_value": np.min(y_vals),
            "max_value": np.max(y_vals),
            "sign_changes": sign_changes,
            "num_potential_roots": len(sign_changes),
            "monotonic": np.all(np.diff(y_vals) >= 0) or np.all(np.diff(y_vals) <= 0),
            "function_range": (np.min(y_vals), np.max(y_vals))
        }
        
        return properties
        
    except Exception as e:
        return {"error": f"Error analyzing function: {e}"}


def suggest_initial_values(func: Callable, interval: Tuple[float, float]) -> Dict:
    """
    Suggest good initial values for different numerical methods.
    
    Args:
        func: Function to analyze
        interval: Interval to search for suggestions
        
    Returns:
        Dictionary with suggested initial values for each method
    """
    a, b = interval
    properties = get_function_properties(func, a, b)
    
    suggestions = {
        "bisection": [],
        "false_position": [],
        "newton_raphson": [],
        "secant": []
    }
    
    # For bracketing methods, use sign changes
    if "sign_changes" in properties:
        for change in properties["sign_changes"]:
            suggestions["bisection"].append({"a": change[0], "b": change[1]})
            suggestions["false_position"].append({"a": change[0], "b": change[1]})
    
    # For Newton-Raphson, suggest midpoints of intervals with sign changes
    if "sign_changes" in properties:
        for change in properties["sign_changes"]:
            midpoint = (change[0] + change[1]) / 2
            suggestions["newton_raphson"].append({"x0": midpoint})
    
    # For secant method, suggest pairs of points
    if "sign_changes" in properties:
        for change in properties["sign_changes"]:
            suggestions["secant"].append({
                "x0": change[0] + 0.1 * (change[1] - change[0]),
                "x1": change[1] - 0.1 * (change[1] - change[0])
            })
    
    return suggestions


def benchmark_functions() -> Dict[str, Dict]:
    """
    Get benchmark functions with known analytical solutions for testing.
    
    Returns:
        Dictionary of benchmark problems with their known solutions
    """
    
    benchmarks = {
        "simple_quadratic": {
            "function": lambda x: x**2 - 4,
            "derivative": lambda x: 2*x,
            "roots": [2.0, -2.0],
            "description": "x² - 4 = 0",
            "difficulty": "easy"
        },
        
        "plastic_number": {
            "function": lambda x: x**3 - x - 1,
            "derivative": lambda x: 3*x**2 - 1,
            "roots": [1.3247179572447],
            "description": "x³ - x - 1 = 0 (Plastic number)",
            "difficulty": "medium"
        },
        
        "golden_ratio": {
            "function": lambda x: x**2 - x - 1,
            "derivative": lambda x: 2*x - 1,
            "roots": [1.618033988749895],  # (1 + sqrt(5))/2
            "description": "x² - x - 1 = 0 (Golden ratio)",
            "difficulty": "easy"
        },
        
        "transcendental_root": {
            "function": lambda x: np.cos(x) - x,
            "derivative": lambda x: -np.sin(x) - 1,
            "roots": [0.7390851332151607],
            "description": "cos(x) - x = 0",
            "difficulty": "medium"
        },
        
        "challenging": {
            "function": lambda x: x*np.exp(-x) - 0.1,
            "derivative": lambda x: np.exp(-x) - x*np.exp(-x),
            "roots": [0.11832559158963, 3.57715632653061],
            "description": "x⋅e^(-x) - 0.1 = 0",
            "difficulty": "hard"
        }
    }
    
    return benchmarks


# Example usage and testing
if __name__ == "__main__":
    # Test example functions
    examples = get_example_functions()
    
    print("Available Example Functions:")
    print("=" * 50)
    for name, (func, deriv, desc) in examples.items():
        print(f"{name}: {desc}")
    
    # Test a specific function
    print(f"\nTesting cubic polynomial:")
    func, deriv, desc = examples["polynomial_cubic"]
    
    # Test at known root (approximately 1.3247)
    test_x = 1.3247179572447
    print(f"f({test_x}) = {func(test_x):.10f}")
    print(f"f'({test_x}) = {deriv(test_x):.10f}")
    
    # Analyze function properties
    print(f"\nFunction analysis:")
    properties = get_function_properties(func, 0, 3)
    print(f"Sign changes found: {len(properties.get('sign_changes', []))}")
    
    # Get suggestions for initial values
    suggestions = suggest_initial_values(func, (1, 2))
    print(f"\nSuggested initial values:")
    for method, values in suggestions.items():
        if values:
            print(f"{method}: {values[0]}") 