"""
Fixed-Point Method (Method of Successive Approximation) implementation for finding roots of non-linear equations.

The fixed-point method rewrites f(x) = 0 into the form x = g(x) and uses
the iterative formula x_{i+1} = g(x_i) to find the solution.
"""

import time
import numpy as np
from typing import Callable
from ..core.base_solver import BaseSolver, SolverResult


class FixedPointSolver(BaseSolver):
    """
    Implementation of the Fixed-Point Method for root finding.
    
    The fixed-point method rewrites the equation f(x) = 0 into the form x = g(x)
    and uses the iterative formula: x_{i+1} = g(x_i)
    
    Convergence Condition: |g'(x)| < 1 for convergence
    Convergence Rate: Linear
    Advantages: Simple implementation, no derivative of original function needed
    Disadvantages: Requires transformation to x = g(x), convergence not guaranteed
    """
    
    def __init__(
        self,
        g_function: Callable[[float], float],
        initial_guess: float = 0.0,
        tolerance: float = 1e-6,
        max_iterations: int = 100
    ):
        """
        Initialize the Fixed-Point solver.
        
        Args:
            g_function: The function g(x) where x = g(x) represents the fixed-point form
            initial_guess: Starting point for the iteration
            tolerance: Convergence tolerance
            max_iterations: Maximum number of iterations
            
        Note:
            The original equation f(x) = 0 must be transformed to x = g(x) form.
            Common transformations:
            - f(x) = 0 → x = x + f(x) (simplest but may not converge)
            - f(x) = 0 → x = x - αf(x) for some α
        """
        # For fixed-point method, we don't have an original function f(x)
        # We work directly with g(x) where x = g(x)
        super().__init__(lambda x: x - g_function(x), tolerance, max_iterations)
        self.g_function = g_function
        self.initial_guess = initial_guess
    
    def get_method_name(self) -> str:
        """Return the method name."""
        return "Fixed-Point Method (Method of Successive Approximation)"
    
    def solve(self, verbose: bool = False) -> SolverResult:
        """
        Solve using the fixed-point method.
        
        Args:
            verbose: If True, print iteration details
            
        Returns:
            SolverResult containing the solution and convergence information
        """
        start_time = time.time()
        self.reset_counters()
        
        x = self.initial_guess
        
        # For fixed-point, the "function value" is x - g(x)
        f_x = x - self.g_function(x)
        
        # Add initial guess to history
        self.add_iteration_result(0, x, f_x)
        
        if verbose:
            print(f"{'Iter':<4} {'x':<15} {'g(x)':<15} {'x - g(x)':<15} {'Error':<15}")
            print("-" * 75)
            g_x = self.g_function(x)
            print(f"{0:<4} {x:<15.8f} {g_x:<15.8f} {f_x:<15.6e} {'---':<15}")
        
        for iteration in range(1, self.max_iterations + 1):
            # Fixed-point iteration: x_{i+1} = g(x_i)
            x_new = self.g_function(x)
            self.function_evaluations += 1  # Count g(x) evaluation
            
            # Calculate the fixed-point residual: x - g(x)
            f_new = x_new - self.g_function(x_new)
            
            # Calculate errors
            error, relative_error = self.calculate_errors(x_new, x)
            
            # Add iteration result
            self.add_iteration_result(iteration, x_new, f_new, error, relative_error)
            
            if verbose:
                print(f"{iteration:<4} {x_new:<15.8f} {self.g_function(x_new):<15.8f} "
                      f"{f_new:<15.6e} {error:<15.6e}")
            
            # Check convergence based on successive approximations
            if error < self.tolerance or abs(f_new) < self.tolerance:
                end_time = time.time()
                return SolverResult(
                    root=x_new,
                    iterations=iteration,
                    convergence_achieved=True,
                    final_error=error,
                    execution_time=end_time - start_time,
                    iteration_history=self.iteration_history,
                    method_name=self.get_method_name(),
                    function_evaluations=self.function_evaluations
                )
            
            # Check for divergence
            if abs(x_new) > 1e10 or np.isnan(x_new) or np.isinf(x_new):
                if verbose:
                    print("Warning: Method appears to be diverging")
                end_time = time.time()
                return SolverResult(
                    root=x_new,
                    iterations=iteration,
                    convergence_achieved=False,
                    final_error=error,
                    execution_time=end_time - start_time,
                    iteration_history=self.iteration_history,
                    method_name=self.get_method_name(),
                    function_evaluations=self.function_evaluations
                )
            
            # Update for next iteration
            x = x_new
        
        # Maximum iterations reached
        end_time = time.time()
        
        return SolverResult(
            root=x,
            iterations=self.max_iterations,
            convergence_achieved=False,
            final_error=error if 'error' in locals() else abs(f_new),
            execution_time=end_time - start_time,
            iteration_history=self.iteration_history,
            method_name=self.get_method_name(),
            function_evaluations=self.function_evaluations
        )
    
    def get_theoretical_convergence_rate(self) -> float:
        """
        Return the theoretical convergence rate for fixed-point method.
        
        Returns:
            Convergence rate (linear, approximately 1.0)
        """
        return 1.0
    
    def analyze_convergence_condition(self, x_center: float, h: float = 1e-6) -> dict:
        """
        Analyze the convergence condition |g'(x)| < 1 near a point.
        
        Args:
            x_center: Point around which to check convergence condition
            h: Step size for numerical derivative
            
        Returns:
            Dictionary with convergence analysis
        """
        # Estimate g'(x) using numerical differentiation
        g_prime = (self.g_function(x_center + h) - self.g_function(x_center - h)) / (2 * h)
        
        analysis = {
            "point": x_center,
            "g_value": self.g_function(x_center),
            "g_derivative": g_prime,
            "convergence_condition": abs(g_prime) < 1,
            "convergence_rate_estimate": abs(g_prime)
        }
        
        if abs(g_prime) < 1:
            analysis["convergence_expected"] = True
            if abs(g_prime) < 0.5:
                analysis["convergence_speed"] = "Fast"
            else:
                analysis["convergence_speed"] = "Slow"
        else:
            analysis["convergence_expected"] = False
            analysis["recommendation"] = "Try different transformation x = g(x)"
        
        return analysis


def transform_function_examples():
    """
    Examples of how to transform f(x) = 0 to x = g(x) form.
    
    Returns:
        Dictionary of common transformations
    """
    transformations = {
        "additive": {
            "description": "x = x + f(x) (simple but may diverge)",
            "example": "f(x) = x² - 2 → g(x) = x + x² - 2"
        },
        "multiplicative": {
            "description": "x = x - αf(x) for some constant α",
            "example": "f(x) = x² - 2 → g(x) = x - α(x² - 2)"
        },
        "direct_solve": {
            "description": "Solve algebraically for x",
            "example": "f(x) = x² - 2 → x = √2 (not iterative)"
        },
        "rearrangement": {
            "description": "Rearrange equation to isolate x",
            "example": "x³ - x - 1 = 0 → x = ∛(x + 1)"
        }
    }
    return transformations


# Example usage and test functions
if __name__ == "__main__":
    # Example 1: Solve x² - 2 = 0 using x = 2/x transformation
    print("Fixed-Point Method Example 1: x² - 2 = 0")
    print("Transformation: x = 2/x")
    
    def g1(x):
        return 2 / x if abs(x) > 1e-15 else 1e15
    
    solver1 = FixedPointSolver(g1, initial_guess=1.5)
    result1 = solver1.solve(verbose=True)
    
    print(f"\nSolution: x = {result1.root:.8f}")
    print(f"Expected: x = √2 ≈ {np.sqrt(2):.8f}")
    print(f"Error: {abs(result1.root - np.sqrt(2)):.2e}")
    print(f"Iterations: {result1.iterations}")
    print(f"Convergence: {'Yes' if result1.convergence_achieved else 'No'}")
    
    # Analyze convergence condition
    analysis1 = solver1.analyze_convergence_condition(result1.root)
    print("\nConvergence Analysis:")
    for key, value in analysis1.items():
        print(f"  {key}: {value}")
    
    # Example 2: Solve x³ - x - 1 = 0 using x = ∛(x + 1) transformation
    print("\n" + "="*70)
    print("Fixed-Point Method Example 2: x³ - x - 1 = 0")
    print("Transformation: x = ∛(x + 1)")
    
    def g2(x):
        return (x + 1)**(1/3)
    
    solver2 = FixedPointSolver(g2, initial_guess=1.0)
    result2 = solver2.solve(verbose=True)
    
    print(f"\nSolution: x = {result2.root:.8f}")
    print(f"Verification: x³ - x - 1 = {result2.root**3 - result2.root - 1:.2e}")
    print(f"Iterations: {result2.iterations}")
    print(f"Convergence: {'Yes' if result2.convergence_achieved else 'No'}")
    
    # Analyze convergence condition
    analysis2 = solver2.analyze_convergence_condition(result2.root)
    print("\nConvergence Analysis:")
    for key, value in analysis2.items():
        print(f"  {key}: {value}")
    
    # Show transformation examples
    print("\n" + "="*70)
    print("Common Transformation Examples:")
    transformations = transform_function_examples()
    for name, info in transformations.items():
        print(f"\n{name.title()} Method:")
        print(f"  {info['description']}")
        print(f"  Example: {info['example']}") 