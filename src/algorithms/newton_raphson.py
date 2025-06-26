"""
Newton-Raphson Method implementation for finding roots of non-linear equations.

The Newton-Raphson method uses the function and its first derivative to find
successively better approximations of a root using Taylor series expansion.
"""

import time
import numpy as np
from typing import Callable, Optional
from ..core.base_solver import BaseSolver, SolverResult, NumericalDerivative


class NewtonRaphsonSolver(BaseSolver):
    """
    Implementation of the Newton-Raphson Method for root finding.
    
    The Newton-Raphson method uses the formula:
    x_{n+1} = x_n - f(x_n) / f'(x_n)
    
    This is derived from the Taylor series expansion and provides quadratic
    convergence when the initial guess is sufficiently close to the root.
    
    Convergence Rate: Quadratic (very fast)
    Advantages: Very fast convergence when it works
    Disadvantages: Requires derivative, may diverge, sensitive to initial guess
    """
    
    def __init__(
        self,
        function: Callable[[float], float],
        derivative: Optional[Callable[[float], float]] = None,
        initial_guess: float = 0.0,
        tolerance: float = 1e-6,
        max_iterations: int = 100
    ):
        """
        Initialize the Newton-Raphson solver.
        
        Args:
            function: The function f(x) for which we want to find f(x) = 0
            derivative: The derivative f'(x). If None, numerical derivative is used
            initial_guess: Starting point for the iteration
            tolerance: Convergence tolerance
            max_iterations: Maximum number of iterations
        """
        super().__init__(function, tolerance, max_iterations)
        self.derivative = derivative
        self.initial_guess = initial_guess
        
        # Create numerical derivative calculator if analytical derivative not provided
        if self.derivative is None:
            self.numerical_derivative = NumericalDerivative(self.function)
    
    def get_method_name(self) -> str:
        """Return the method name."""
        derivative_type = "analytical" if self.derivative else "numerical"
        return f"Newton-Raphson Method ({derivative_type} derivative)"
    
    def evaluate_derivative(self, x: float) -> float:
        """
        Evaluate the derivative at point x.
        
        Args:
            x: Point at which to evaluate the derivative
            
        Returns:
            Value of f'(x)
        """
        if self.derivative:
            return self.derivative(x)
        else:
            return self.numerical_derivative.central_difference(x)
    
    def solve(self, verbose: bool = False) -> SolverResult:
        """
        Solve the equation f(x) = 0 using the Newton-Raphson method.
        
        Args:
            verbose: If True, print iteration details
            
        Returns:
            SolverResult containing the solution and convergence information
        """
        start_time = time.time()
        self.reset_counters()
        
        x = self.initial_guess
        f_x = self.evaluate_function(x)
        
        # Add initial guess to history
        self.add_iteration_result(0, x, f_x)
        
        if verbose:
            print(f"{'Iter':<4} {'x':<15} {'f(x)':<15} {'f\'(x)':<15} {'Error':<15}")
            print("-" * 75)
            print(f"{0:<4} {x:<15.8f} {f_x:<15.6e} {'---':<15} {'---':<15}")
        
        for iteration in range(1, self.max_iterations + 1):
            # Evaluate derivative
            f_prime_x = self.evaluate_derivative(x)
            
            # Check for zero derivative (method fails)
            if abs(f_prime_x) < 1e-15:
                if verbose:
                    print(f"Warning: Derivative is zero at x = {x}. Method fails.")
                end_time = time.time()
                return SolverResult(
                    root=x,
                    iterations=iteration - 1,
                    convergence_achieved=False,
                    final_error=abs(f_x),
                    execution_time=end_time - start_time,
                    iteration_history=self.iteration_history,
                    method_name=self.get_method_name(),
                    function_evaluations=self.function_evaluations
                )
            
            # Newton-Raphson formula from context: x_{n+1} = x_n - f(x_n) / f'(x_n)
            x_new = x - f_x / f_prime_x
            f_new = self.evaluate_function(x_new)
            
            # Calculate errors
            error, relative_error = self.calculate_errors(x_new, x)
            
            # Add iteration result
            self.add_iteration_result(iteration, x_new, f_new, error, relative_error)
            
            if verbose:
                print(f"{iteration:<4} {x_new:<15.8f} {f_new:<15.6e} {f_prime_x:<15.6e} {error:<15.6e}")
            
            # Check convergence
            if self.check_convergence(x_new, x, f_new):
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
            f_x = f_new
        
        # Maximum iterations reached
        end_time = time.time()
        
        return SolverResult(
            root=x,
            iterations=self.max_iterations,
            convergence_achieved=False,
            final_error=abs(f_x),
            execution_time=end_time - start_time,
            iteration_history=self.iteration_history,
            method_name=self.get_method_name(),
            function_evaluations=self.function_evaluations
        )
    
    def get_theoretical_convergence_rate(self) -> float:
        """
        Return the theoretical convergence rate for Newton-Raphson method.
        
        Returns:
            Convergence rate (quadratic, 2.0)
        """
        return 2.0
    
    def analyze_initial_guess(self) -> dict:
        """
        Analyze the quality of the initial guess.
        
        Returns:
            Dictionary with analysis of the initial guess
        """
        x = self.initial_guess
        f_x = self.evaluate_function(x)
        f_prime_x = self.evaluate_derivative(x)
        
        analysis = {
            "initial_guess": x,
            "function_value": f_x,
            "derivative_value": f_prime_x,
            "newton_step": -f_x / f_prime_x if abs(f_prime_x) > 1e-15 else float('inf'),
            "recommended": True
        }
        
        # Check if derivative is too small
        if abs(f_prime_x) < 1e-6:
            analysis["recommended"] = False
            analysis["warning"] = "Derivative is very small near initial guess"
        
        # Check if function value is very large
        if abs(f_x) > 1e6:
            analysis["recommended"] = False
            analysis["warning"] = "Function value is very large at initial guess"
        
        # Check if Newton step is very large
        if abs(analysis["newton_step"]) > 1e6:
            analysis["recommended"] = False
            analysis["warning"] = "Newton step is very large"
        
        return analysis


# Example usage and test functions
if __name__ == "__main__":
    # Test function: x^3 - x - 1 = 0
    def test_function(x):
        return x**3 - x - 1
    
    def test_derivative(x):
        return 3*x**2 - 1
    
    # Test with analytical derivative
    print("Newton-Raphson Method (Analytical Derivative):")
    solver1 = NewtonRaphsonSolver(test_function, test_derivative, initial_guess=1.5)
    result1 = solver1.solve(verbose=True)
    
    print(f"\nSolution: x = {result1.root:.8f}")
    print(f"Function value: f(x) = {test_function(result1.root):.2e}")
    print(f"Iterations: {result1.iterations}")
    print(f"Convergence: {'Yes' if result1.convergence_achieved else 'No'}")
    print(f"Execution time: {result1.execution_time:.4f} seconds")
    
    # Test with numerical derivative
    print("\n" + "="*60)
    print("Newton-Raphson Method (Numerical Derivative):")
    solver2 = NewtonRaphsonSolver(test_function, None, initial_guess=1.5)
    result2 = solver2.solve(verbose=True)
    
    print(f"\nSolution: x = {result2.root:.8f}")
    print(f"Function value: f(x) = {test_function(result2.root):.2e}")
    print(f"Iterations: {result2.iterations}")
    print(f"Convergence: {'Yes' if result2.convergence_achieved else 'No'}")
    print(f"Execution time: {result2.execution_time:.4f} seconds")
    
    # Analyze initial guess
    print("\nInitial Guess Analysis:")
    analysis = solver1.analyze_initial_guess()
    for key, value in analysis.items():
        print(f"  {key}: {value}") 