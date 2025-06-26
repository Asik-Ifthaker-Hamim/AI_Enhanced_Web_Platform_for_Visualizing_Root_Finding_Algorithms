"""
Bisection Method implementation for finding roots of non-linear equations.

The bisection method is a bracketing method that is guaranteed to converge
if the function is continuous and the initial interval contains a root.
"""

import time
import numpy as np
from typing import Callable, Optional
from ..core.base_solver import BaseSolver, SolverResult


class BisectionSolver(BaseSolver):
    """
    Implementation of the Bisection Method for root finding.
    
    The bisection method works by repeatedly halving an interval that contains
    the root and selecting the subinterval that maintains the sign change.
    
    Convergence Rate: Linear (O(1/2^n))
    Advantages: Guaranteed convergence, robust
    Disadvantages: Slow convergence, requires bracketing interval
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
        Initialize the Bisection solver.
        
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
        self.initial_interval_length = abs(b - a)
    
    def get_method_name(self) -> str:
        """Return the method name."""
        return "Bisection Method"
    
    def solve(self, verbose: bool = False) -> SolverResult:
        """
        Solve the equation f(x) = 0 using the bisection method.
        
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
            print(f"{'Iter':<4} {'a':<12} {'b':<12} {'c':<12} {'f(c)':<12} {'Error':<12}")
            print("-" * 72)
        
        for iteration in range(1, self.max_iterations + 1):
            # Calculate midpoint
            c = (a + b) / 2.0
            fc = self.evaluate_function(c)
            
            # Calculate error (interval width)
            error = abs(b - a) / 2.0
            relative_error = error / (abs(c) + 1e-15)
            
            # Add iteration result
            self.add_iteration_result(iteration, c, fc, error, relative_error)
            
            if verbose:
                print(f"{iteration:<4} {a:<12.6f} {b:<12.6f} {c:<12.6f} "
                      f"{fc:<12.6e} {error:<12.6e}")
            
            # Check convergence
            if abs(fc) < self.tolerance or error < self.tolerance:
                end_time = time.time()
                return SolverResult(
                    root=c,
                    iterations=iteration,
                    convergence_achieved=True,
                    final_error=error,
                    execution_time=end_time - start_time,
                    iteration_history=self.iteration_history,
                    method_name=self.get_method_name(),
                    function_evaluations=self.function_evaluations
                )
            
            # Determine which subinterval contains the root
            if fa * fc < 0:
                # Root is in [a, c]
                b = c
                fb = fc
            else:
                # Root is in [c, b]
                a = c
                fa = fc
        
        # Maximum iterations reached
        c = (a + b) / 2.0
        end_time = time.time()
        
        return SolverResult(
            root=c,
            iterations=self.max_iterations,
            convergence_achieved=False,
            final_error=abs(b - a) / 2.0,
            execution_time=end_time - start_time,
            iteration_history=self.iteration_history,
            method_name=self.get_method_name(),
            function_evaluations=self.function_evaluations
        )
    
    def estimate_iterations_needed(self, desired_tolerance: float) -> int:
        """
        Estimate the number of iterations needed for a given tolerance.
        
        Args:
            desired_tolerance: Desired tolerance
            
        Returns:
            Estimated number of iterations
        """
        return int(np.ceil(np.log2(self.initial_interval_length / desired_tolerance)))
    
    def get_theoretical_convergence_rate(self) -> float:
        """
        Return the theoretical convergence rate for bisection method.
        
        Returns:
            Convergence rate (0.5 for bisection)
        """
        return 0.5


def find_bracketing_interval(
    function: Callable[[float], float],
    x0: float,
    step_size: float = 1.0,
    max_steps: int = 100
) -> tuple[float, float]:
    """
    Find a bracketing interval [a, b] such that f(a) and f(b) have opposite signs.
    
    Args:
        function: The function to find a bracket for
        x0: Starting point for the search
        step_size: Initial step size for the search
        max_steps: Maximum number of steps in each direction
        
    Returns:
        Tuple (a, b) representing the bracketing interval
        
    Raises:
        ValueError: If no bracketing interval is found
    """
    fa = function(x0)
    
    # Search in positive direction
    x_pos = x0
    for i in range(max_steps):
        x_pos += step_size
        fb = function(x_pos)
        if fa * fb < 0:
            return (x0, x_pos) if x0 < x_pos else (x_pos, x0)
    
    # Search in negative direction
    x_neg = x0
    for i in range(max_steps):
        x_neg -= step_size
        fb = function(x_neg)
        if fa * fb < 0:
            return (x_neg, x0) if x_neg < x0 else (x0, x_neg)
    
    raise ValueError("Could not find a bracketing interval")


# Example usage and test functions
if __name__ == "__main__":
    # Test function: x^3 - x - 1 = 0
    def test_function(x):
        return x**3 - x - 1
    
    # Create and solve using bisection method
    solver = BisectionSolver(test_function, a=1.0, b=2.0, tolerance=1e-6)
    result = solver.solve(verbose=True)
    
    print(f"\nSolution found: x = {result.root:.8f}")
    print(f"Function value: f(x) = {test_function(result.root):.2e}")
    print(f"Iterations: {result.iterations}")
    print(f"Convergence: {'Yes' if result.convergence_achieved else 'No'}")
    print(f"Execution time: {result.execution_time:.4f} seconds")
    
    # Analyze convergence
    analysis = solver.get_convergence_analysis()
    print(f"\nConvergence Analysis:")
    for key, value in analysis.items():
        print(f"  {key}: {value}") 