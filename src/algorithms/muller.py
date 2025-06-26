"""
Muller's Method implementation for finding roots of non-linear equations.

Muller's method uses quadratic interpolation with three points to approximate
the function and find its root.
"""

import time
import numpy as np
import cmath
from typing import Callable, Union
from ..core.base_solver import BaseSolver, SolverResult


class MullerSolver(BaseSolver):
    """
    Implementation of Muller's Method for root finding.
    
    Muller's method uses three points to construct a parabola (quadratic interpolation)
    and finds where this parabola crosses the x-axis. This method can find complex roots
    even when starting with real initial guesses.
    
    Convergence Rate: Super-linear (approximately 1.84)
    Advantages: Can find complex roots, faster than secant method
    Disadvantages: More complex implementation, requires three initial guesses
    """
    
    def __init__(
        self,
        function: Callable[[Union[float, complex]], Union[float, complex]],
        x0: Union[float, complex],
        x1: Union[float, complex],
        x2: Union[float, complex],
        tolerance: float = 1e-6,
        max_iterations: int = 100
    ):
        """
        Initialize the Muller solver.
        
        Args:
            function: The function f(x) for which we want to find f(x) = 0
            x0, x1, x2: Three initial guesses (can be complex)
            tolerance: Convergence tolerance
            max_iterations: Maximum number of iterations
        """
        super().__init__(function, tolerance, max_iterations)
        self.x0 = complex(x0)
        self.x1 = complex(x1)
        self.x2 = complex(x2)
    
    def get_method_name(self) -> str:
        """Return the method name."""
        return "Muller's Method"
    
    def solve(self, verbose: bool = False) -> SolverResult:
        """
        Solve the equation f(x) = 0 using Muller's method.
        
        Args:
            verbose: If True, print iteration details
            
        Returns:
            SolverResult containing the solution and convergence information
        """
        start_time = time.time()
        self.reset_counters()
        
        # Initialize three points
        x = [self.x0, self.x1, self.x2]
        f = [complex(self.evaluate_function(xi)) for xi in x]
        
        # Add initial points to history (using real parts for display)
        for i in range(3):
            self.add_iteration_result(i, x[i].real, abs(f[i]))
        
        if verbose:
            print(f"{'Iter':<4} {'x (real)':<15} {'x (imag)':<15} {'|f(x)|':<15} {'Error':<15}")
            print("-" * 75)
            for i in range(3):
                print(f"{i:<4} {x[i].real:<15.8f} {x[i].imag:<15.8f} {abs(f[i]):<15.6e} {'---':<15}")
        
        for iteration in range(3, self.max_iterations + 1):
            # Calculate divided differences
            h0 = x[1] - x[0]
            h1 = x[2] - x[1]
            
            # Check for identical points
            if abs(h0) < 1e-15 or abs(h1) < 1e-15:
                if verbose:
                    print("Warning: Points are too close together")
                break
            
            delta0 = (f[1] - f[0]) / h0
            delta1 = (f[2] - f[1]) / h1
            
            # Quadratic interpolation coefficients
            a = (delta1 - delta0) / (h1 + h0)
            b = a * h1 + delta1
            c = f[2]
            
            # Calculate discriminant
            discriminant = b**2 - 4*a*c
            
            # Choose the root that gives the smaller change
            # (avoids cancellation error in the numerator)
            if abs(b + cmath.sqrt(discriminant)) > abs(b - cmath.sqrt(discriminant)):
                denominator = b + cmath.sqrt(discriminant)
            else:
                denominator = b - cmath.sqrt(discriminant)
            
            # Check for zero denominator
            if abs(denominator) < 1e-15:
                if verbose:
                    print("Warning: Near-zero denominator in Muller's formula")
                break
            
            # Muller's formula: x_new = x2 - 2c / (b ± sqrt(b² - 4ac))
            dx = -2 * c / denominator
            x_new = x[2] + dx
            f_new = complex(self.evaluate_function(x_new))
            
            # Calculate error (magnitude of change)
            error = abs(dx)
            relative_error = error / (abs(x_new) + 1e-15)
            
            # Add iteration result (using real part for x, magnitude for f)
            self.add_iteration_result(iteration, x_new.real, abs(f_new), error, relative_error)
            
            if verbose:
                print(f"{iteration:<4} {x_new.real:<15.8f} {x_new.imag:<15.8f} "
                      f"{abs(f_new):<15.6e} {error:<15.6e}")
            
            # Check convergence
            if error < self.tolerance or abs(f_new) < self.tolerance:
                end_time = time.time()
                return SolverResult(
                    root=x_new.real if abs(x_new.imag) < 1e-10 else x_new,
                    iterations=iteration,
                    convergence_achieved=True,
                    final_error=error,
                    execution_time=end_time - start_time,
                    iteration_history=self.iteration_history,
                    method_name=self.get_method_name(),
                    function_evaluations=self.function_evaluations
                )
            
            # Check for divergence
            if abs(x_new) > 1e10:
                if verbose:
                    print("Warning: Method appears to be diverging")
                end_time = time.time()
                return SolverResult(
                    root=x_new.real if abs(x_new.imag) < 1e-10 else x_new,
                    iterations=iteration,
                    convergence_achieved=False,
                    final_error=error,
                    execution_time=end_time - start_time,
                    iteration_history=self.iteration_history,
                    method_name=self.get_method_name(),
                    function_evaluations=self.function_evaluations
                )
            
            # Update points for next iteration (shift and add new point)
            x = [x[1], x[2], x_new]
            f = [f[1], f[2], f_new]
        
        # Maximum iterations reached
        end_time = time.time()
        final_x = x[2] if len(x) > 2 else x[-1]
        
        return SolverResult(
            root=final_x.real if abs(final_x.imag) < 1e-10 else final_x,
            iterations=self.max_iterations,
            convergence_achieved=False,
            final_error=error if 'error' in locals() else abs(f[2]),
            execution_time=end_time - start_time,
            iteration_history=self.iteration_history,
            method_name=self.get_method_name(),
            function_evaluations=self.function_evaluations
        )
    
    def get_theoretical_convergence_rate(self) -> float:
        """
        Return the theoretical convergence rate for Muller's method.
        
        Returns:
            Convergence rate (approximately 1.84)
        """
        return 1.84
    
    def analyze_initial_guesses(self) -> dict:
        """
        Analyze the quality of the initial guesses.
        
        Returns:
            Dictionary with analysis of initial guesses
        """
        x = [self.x0, self.x1, self.x2]
        f = [complex(self.evaluate_function(xi)) for xi in x]
        
        analysis = {
            "x0": x[0],
            "x1": x[1], 
            "x2": x[2],
            "f0": f[0],
            "f1": f[1],
            "f2": f[2],
            "spacing_01": abs(x[1] - x[0]),
            "spacing_12": abs(x[2] - x[1]),
            "spacing_02": abs(x[2] - x[0]),
            "recommended": True
        }
        
        # Check if points are too close
        min_spacing = min(analysis["spacing_01"], analysis["spacing_12"], analysis["spacing_02"])
        if min_spacing < 1e-10:
            analysis["recommended"] = False
            analysis["warning"] = "Initial points are too close together"
        
        # Check if function values are very large
        max_f = max(abs(f[0]), abs(f[1]), abs(f[2]))
        if max_f > 1e6:
            analysis["recommended"] = False
            analysis["warning"] = "Function values are very large at initial points"
        
        # Check if points are collinear (for real points)
        if all(xi.imag == 0 for xi in x):
            # For real points, check if they're equally spaced (may reduce effectiveness)
            if (abs((x[1] - x[0]) - (x[2] - x[1])) < 1e-10 and 
                abs(x[1] - x[0]) > 1e-10):
                analysis["note"] = "Points are equally spaced - consider unequal spacing"
        
        return analysis


# Example usage and test functions
if __name__ == "__main__":
    # Example 1: Real polynomial with real root
    print("Muller's Method Example 1: x³ - x - 1 = 0")
    
    def test_function1(x):
        return x**3 - x - 1
    
    solver1 = MullerSolver(test_function1, x0=1.0, x1=1.5, x2=2.0)
    result1 = solver1.solve(verbose=True)
    
    print(f"\nSolution: x = {result1.root}")
    if isinstance(result1.root, complex):
        print(f"Real part: {result1.root.real:.8f}")
        print(f"Imaginary part: {result1.root.imag:.8f}")
        print(f"Function value: f(x) = {test_function1(result1.root)}")
    else:
        print(f"Function value: f(x) = {test_function1(result1.root):.2e}")
    print(f"Iterations: {result1.iterations}")
    print(f"Convergence: {'Yes' if result1.convergence_achieved else 'No'}")
    
    # Example 2: Polynomial with complex roots
    print("\n" + "="*70)
    print("Muller's Method Example 2: x² + x + 1 = 0 (complex roots)")
    
    def test_function2(x):
        return x**2 + x + 1
    
    solver2 = MullerSolver(test_function2, x0=0.0, x1=1.0, x2=-1.0)
    result2 = solver2.solve(verbose=True)
    
    print(f"\nSolution: x = {result2.root}")
    if isinstance(result2.root, complex):
        print(f"Real part: {result2.root.real:.8f}")
        print(f"Imaginary part: {result2.root.imag:.8f}")
        print(f"Expected roots: -0.5 ± 0.866i")
        print(f"Function value: f(x) = {test_function2(result2.root)}")
    else:
        print(f"Function value: f(x) = {test_function2(result2.root):.2e}")
    print(f"Iterations: {result2.iterations}")
    print(f"Convergence: {'Yes' if result2.convergence_achieved else 'No'}")
    
    # Analyze initial guesses
    print("\nInitial Guesses Analysis:")
    analysis = solver1.analyze_initial_guesses()
    for key, value in analysis.items():
        if key.startswith('x') or key.startswith('f'):
            print(f"  {key}: {value}")
        else:
            print(f"  {key}: {value}") 