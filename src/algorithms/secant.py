"""
Secant Method implementation for finding roots of non-linear equations.

The secant method approximates the derivative in Newton's method using
two points, eliminating the need to compute derivatives analytically.
"""

import time
import numpy as np
from typing import Callable
from ..core.base_solver import BaseSolver, SolverResult


class SecantSolver(BaseSolver):
    """
    Implementation of the Secant Method for root finding.
    
    The secant method uses the formula:
    x_{i+1} = x_i - f(x_i) * (x_i - x_{i-1}) / (f(x_i) - f(x_{i-1}))
    
    Convergence Rate: Super-linear (~1.618, golden ratio)
    Advantages: No derivative needed, faster than bisection
    Disadvantages: Slower than Newton's method, requires two initial guesses
    """
    
    def __init__(
        self,
        function: Callable[[float], float],
        x0: float,
        x1: float,
        tolerance: float = 1e-6,
        max_iterations: int = 100
    ):
        """
        Initialize the Secant solver.
        
        Args:
            function: The function f(x) for which we want to find f(x) = 0
            x0: First initial guess
            x1: Second initial guess
            tolerance: Convergence tolerance
            max_iterations: Maximum number of iterations
        """
        super().__init__(function, tolerance, max_iterations)
        self.x0 = x0
        self.x1 = x1
    
    def get_method_name(self) -> str:
        """Return the method name."""
        return "Secant Method"
    
    def solve(self, verbose: bool = False) -> SolverResult:
        """
        Solve the equation f(x) = 0 using the secant method.
        
        Args:
            verbose: If True, print iteration details
            
        Returns:
            SolverResult containing the solution and convergence information
        """
        start_time = time.time()
        self.reset_counters()
        
        x_prev = self.x0
        x_curr = self.x1
        
        f_prev = self.evaluate_function(x_prev)
        f_curr = self.evaluate_function(x_curr)
        
        # Add initial points to history
        self.add_iteration_result(0, x_prev, f_prev)
        self.add_iteration_result(1, x_curr, f_curr)
        
        if verbose:
            print(f"{'Iter':<4} {'x':<15} {'f(x)':<15} {'Error':<15} {'Slope':<15}")
            print("-" * 75)
            print(f"{0:<4} {x_prev:<15.8f} {f_prev:<15.6e} {'---':<15} {'---':<15}")
            print(f"{1:<4} {x_curr:<15.8f} {f_curr:<15.6e} {'---':<15} {'---':<15}")
        
        for iteration in range(2, self.max_iterations + 1):
            # Check for zero denominator
            if abs(f_curr - f_prev) < 1e-15:
                if verbose:
                    print("Warning: Function values too close, stopping iteration")
                break
            
            # Calculate secant slope
            slope = (f_curr - f_prev) / (x_curr - x_prev)
            
            # Secant formula from context: x_{i+1} = x_i - f(x_i) * (x_i - x_{i-1}) / (f(x_i) - f(x_{i-1}))
            x_new = x_curr - f_curr / slope
            f_new = self.evaluate_function(x_new)
            
            # Calculate errors
            error, relative_error = self.calculate_errors(x_new, x_curr)
            
            # Add iteration result
            self.add_iteration_result(iteration, x_new, f_new, error, relative_error)
            
            if verbose:
                print(f"{iteration:<4} {x_new:<15.8f} {f_new:<15.6e} {error:<15.6e} {slope:<15.6e}")
            
            # Check convergence
            if self.check_convergence(x_new, x_curr, f_new):
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
            
            # Update for next iteration
            x_prev = x_curr
            x_curr = x_new
            f_prev = f_curr
            f_curr = f_new
        
        # Maximum iterations reached
        end_time = time.time()
        
        return SolverResult(
            root=x_curr,
            iterations=self.max_iterations,
            convergence_achieved=False,
            final_error=error if 'error' in locals() else abs(f_curr),
            execution_time=end_time - start_time,
            iteration_history=self.iteration_history,
            method_name=self.get_method_name(),
            function_evaluations=self.function_evaluations
        )
    
    def get_theoretical_convergence_rate(self) -> float:
        """
        Return the theoretical convergence rate for secant method.
        
        Returns:
            Convergence rate (golden ratio ≈ 1.618)
        """
        return (1 + np.sqrt(5)) / 2  # Golden ratio
    
    def analyze_initial_guesses(self) -> dict:
        """
        Analyze the quality of the initial guesses.
        
        Returns:
            Dictionary with analysis of initial guesses
        """
        f0 = self.evaluate_function(self.x0)
        f1 = self.evaluate_function(self.x1)
        
        analysis = {
            "x0": self.x0,
            "x1": self.x1,
            "f0": f0,
            "f1": f1,
            "initial_slope": (f1 - f0) / (self.x1 - self.x0),
            "distance_between_guesses": abs(self.x1 - self.x0),
            "recommended": True
        }
        
        # Check if the slope is too small
        if abs(analysis["initial_slope"]) < 1e-10:
            analysis["recommended"] = False
            analysis["warning"] = "Initial slope is very small"
        
        # Check if the guesses are too close
        if analysis["distance_between_guesses"] < 1e-10:
            analysis["recommended"] = False
            analysis["warning"] = "Initial guesses are too close"
        
        # Check if function values are very large
        if abs(f0) > 1e6 or abs(f1) > 1e6:
            analysis["recommended"] = False
            analysis["warning"] = "Function values are very large at initial guesses"
        
        return analysis


# Example usage and test functions
if __name__ == "__main__":
    # Test function: x^3 - x - 1 = 0
    def test_function(x):
        return x**3 - x - 1
    
    # Test standard secant method
    print("Secant Method:")
    solver = SecantSolver(test_function, x0=1.0, x1=2.0)
    result = solver.solve(verbose=True)
    
    print(f"\nSolution: x = {result.root:.8f}")
    print(f"Function value: f(x) = {test_function(result.root):.2e}")
    print(f"Iterations: {result.iterations}")
    print(f"Convergence: {'Yes' if result.convergence_achieved else 'No'}")
    print(f"Execution time: {result.execution_time:.4f} seconds")
    
    # Analyze initial guesses
    print("\nInitial Guesses Analysis:")
    analysis = solver.analyze_initial_guesses()
    for key, value in analysis.items():
        print(f"  {key}: {value}") 