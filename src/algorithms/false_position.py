"""
False Position Method (Regula Falsi) implementation for finding roots of non-linear equations.

The false position method uses linear interpolation to find a better approximation
of the root than the bisection method while maintaining the bracketing property.
"""

import time
import numpy as np
from typing import Callable
from ..core.base_solver import BaseSolver, SolverResult


class FalsePositionSolver(BaseSolver):
    """
    Implementation of the False Position Method (Regula Falsi) for root finding.
    
    The false position method uses linear interpolation between two points that
    bracket the root to find successively better approximations.
    
    Convergence Rate: Linear (faster than bisection)
    Advantages: Better than bisection, guaranteed convergence, maintains bracketing
    Disadvantages: Can be slow due to one-sided convergence
    """
    
    def __init__(
        self,
        function: Callable[[float], float],
        a: float,
        b: float,
        tolerance: float = 1e-6,
        max_iterations: int = 100
    ):
        """
        Initialize the False Position solver.
        
        Args:
            function: The function f(x) for which we want to find f(x) = 0
            a: Left endpoint of the initial interval
            b: Right endpoint of the initial interval
            tolerance: Convergence tolerance
            max_iterations: Maximum number of iterations
            
        Raises:
            ValueError: If f(a) and f(b) have the same sign
        """
        super().__init__(function, tolerance, max_iterations)
        
        # Validate initial interval
        fa = self.evaluate_function(a)
        fb = self.evaluate_function(b)
        
        if fa * fb > 0:
            raise ValueError(
                f"Function values at endpoints must have opposite signs. "
                f"f({a}) = {fa}, f({b}) = {fb}"
            )
        
        # Ensure a < b
        if a > b:
            a, b = b, a
            
        self.a = a
        self.b = b
    
    def get_method_name(self) -> str:
        """Return the method name."""
        return "False Position Method (Regula Falsi)"
    
    def solve(self, verbose: bool = False) -> SolverResult:
        """
        Solve the equation f(x) = 0 using the false position method.
        
        Args:
            verbose: If True, print iteration details
            
        Returns:
            SolverResult containing the solution and convergence information
        """
        start_time = time.time()
        self.reset_counters()
        
        a, b = self.a, self.b
        fa = self.evaluate_function(a)
        fb = self.evaluate_function(b)
        
        # Add initial points to history
        self.add_iteration_result(0, a, fa, error=abs(b - a))
        
        if verbose:
            print(f"{'Iter':<4} {'a':<12} {'b':<12} {'x_new':<12} {'f(x_new)':<12} {'Error':<12}")
            print("-" * 74)
        
        for iteration in range(1, self.max_iterations + 1):
            # Calculate the false position point using linear interpolation
            # Formula from context: x0 = x1 - (f(x1) * (x2 - x1)) / (f(x2) - f(x1))
            x_new = a - (fa * (b - a)) / (fb - fa)
            f_new = self.evaluate_function(x_new)
            
            # Calculate error (can use interval width or change in x)
            error = min(abs(x_new - a), abs(x_new - b))
            relative_error = error / (abs(x_new) + 1e-15)
            
            # Add iteration result
            self.add_iteration_result(iteration, x_new, f_new, error, relative_error)
            
            if verbose:
                print(f"{iteration:<4} {a:<12.6f} {b:<12.6f} {x_new:<12.6f} "
                      f"{f_new:<12.6e} {error:<12.6e}")
            
            # Check convergence
            if abs(f_new) < self.tolerance or error < self.tolerance:
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
            
            # Determine which side of the interval to replace
            if fa * f_new < 0:
                # Root is between a and x_new
                b = x_new
                fb = f_new
            else:
                # Root is between x_new and b
                a = x_new
                fa = f_new
        
        # Maximum iterations reached
        x_new = a - (fa * (b - a)) / (fb - fa)
        end_time = time.time()
        
        return SolverResult(
            root=x_new,
            iterations=self.max_iterations,
            convergence_achieved=False,
            final_error=min(abs(x_new - a), abs(x_new - b)),
            execution_time=end_time - start_time,
            iteration_history=self.iteration_history,
            method_name=self.get_method_name(),
            function_evaluations=self.function_evaluations
        )
    
    def get_theoretical_convergence_rate(self) -> float:
        """
        Return the theoretical convergence rate for false position method.
        
        Returns:
            Convergence rate (linear, approximately 1.3)
        """
        return 1.3  # Approximate super-linear rate


# Example usage and test functions
if __name__ == "__main__":
    # Test function: x^3 - x - 1 = 0
    def test_function(x):
        return x**3 - x - 1
    
    # Test false position method
    print("False Position Method:")
    solver = FalsePositionSolver(test_function, a=1.0, b=2.0)
    result = solver.solve(verbose=True)
    
    print(f"\nSolution: x = {result.root:.8f}")
    print(f"Function value: f(x) = {test_function(result.root):.2e}")
    print(f"Iterations: {result.iterations}")
    print(f"Convergence: {'Yes' if result.convergence_achieved else 'No'}")
    print(f"Execution time: {result.execution_time:.4f} seconds")
    
    # Analyze convergence
    analysis = solver.get_convergence_analysis()
    print(f"\nConvergence Analysis:")
    for key, value in analysis.items():
        print(f"  {key}: {value}") 