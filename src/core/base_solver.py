"""
Base Solver Module for Numerical Root-Finding Methods

This module provides the foundational abstract base class and result data structures
for all numerical root-finding algorithms. It implements common functionality like
function evaluation tracking, convergence checking, error calculation, and
iteration history management.

Classes:
    IterationResult: Data class for storing single iteration results
    SolverResult: Data class for storing complete solution results
    BaseSolver: Abstract base class for all numerical methods
    NumericalDerivative: Utility class for derivative approximation

The design follows the Template Method pattern, where common operations are
implemented in the base class and algorithm-specific steps are defined in
concrete subclasses.

Example:
    class CustomSolver(BaseSolver):
        def solve(self, **kwargs) -> SolverResult:
            # Implementation specific to custom method
            pass
        
        def get_method_name(self) -> str:
            return "Custom Method"

Author: The Epsilon Chasers Team
Course: Numerical Methods
"""

import numpy as np
import time
from abc import ABC, abstractmethod
from typing import Callable, Optional, Dict, List, Tuple, Any
from dataclasses import dataclass


@dataclass
class IterationResult:
    """
    Data class for storing the result of a single iteration.
    
    This class holds all relevant information for one iteration of a
    numerical method, enabling detailed analysis and debugging.
    
    Attributes:
        iteration (int): Iteration number (0-based)
        x_value (float): Current approximation of the root
        f_value (float): Function value at current approximation
        error (Optional[float]): Absolute error from previous iteration
        relative_error (Optional[float]): Relative error from previous iteration
        execution_time (float): Time taken for this iteration in seconds
        
    Example:
        result = IterationResult(
            iteration=1,
            x_value=1.5,
            f_value=0.875,
            error=0.5,
            relative_error=0.333
        )
    """
    iteration: int
    x_value: float
    f_value: float
    error: Optional[float] = None
    relative_error: Optional[float] = None
    execution_time: float = 0.0


@dataclass
class SolverResult:
    """
    Data class for storing the complete solution result.
    
    This class contains comprehensive information about the solution process,
    including convergence status, performance metrics, and detailed history.
    
    Attributes:
        root (float): Final approximation of the root
        iterations (int): Total number of iterations performed
        convergence_achieved (bool): Whether the method converged successfully
        final_error (float): Final error estimate
        execution_time (float): Total execution time in seconds
        iteration_history (List[IterationResult]): Detailed iteration history
        method_name (str): Name of the numerical method used
        function_evaluations (int): Total number of function evaluations
        
    Properties:
        convergence_rate: Estimated order of convergence
        efficiency_index: Function evaluations per iteration
        
    Example:
        result = SolverResult(
            root=1.324718,
            iterations=5,
            convergence_achieved=True,
            final_error=1e-7,
            execution_time=0.001,
            iteration_history=[...],
            method_name="Newton-Raphson",
            function_evaluations=10
        )
    """
    root: float
    iterations: int
    convergence_achieved: bool
    final_error: float
    execution_time: float
    iteration_history: List[IterationResult]
    method_name: str
    function_evaluations: int


class BaseSolver(ABC):
    """
    Abstract base class for all numerical root-finding methods.
    """
    
    def __init__(
        self,
        function: Callable[[float], float],
        tolerance: float = 1e-6,
        max_iterations: int = 100,
        derivative: Optional[Callable[[float], float]] = None
    ):
        """
        Initialize the base solver.
        
        Args:
            function: The function f(x) for which we want to find f(x) = 0
            tolerance: Convergence tolerance
            max_iterations: Maximum number of iterations
            derivative: Derivative of the function (if required by method)
        """
        self.function = function
        self.tolerance = tolerance
        self.max_iterations = max_iterations
        self.derivative = derivative
        
        # Tracking variables
        self.iteration_history: List[IterationResult] = []
        self.function_evaluations = 0
        self.derivative_evaluations = 0
        
    def evaluate_function(self, x: float) -> float:
        """Evaluate function and track the number of evaluations."""
        self.function_evaluations += 1
        return self.function(x)
    
    def evaluate_derivative(self, x: float) -> float:
        """Evaluate derivative and track the number of evaluations."""
        if self.derivative is None:
            raise ValueError("Derivative function not provided")
        self.derivative_evaluations += 1
        return self.derivative(x)
    
    def reset_counters(self):
        """Reset all tracking counters."""
        self.iteration_history.clear()
        self.function_evaluations = 0
        self.derivative_evaluations = 0
    
    def check_convergence(self, x_new: float, x_old: float, f_value: float) -> bool:
        """
        Check if convergence criteria are met.
        
        Args:
            x_new: New approximation
            x_old: Previous approximation
            f_value: Function value at x_new
            
        Returns:
            True if converged, False otherwise
        """
        # Check function value tolerance
        if abs(f_value) < self.tolerance:
            return True
        
        # Check relative change in x
        if abs(x_new - x_old) < self.tolerance * (1 + abs(x_new)):
            return True
            
        return False
    
    def calculate_errors(self, x_new: float, x_old: float) -> Tuple[float, float]:
        """
        Calculate absolute and relative errors.
        
        Args:
            x_new: New approximation
            x_old: Previous approximation
            
        Returns:
            Tuple of (absolute_error, relative_error)
        """
        absolute_error = abs(x_new - x_old)
        relative_error = absolute_error / (abs(x_new) + 1e-15) if x_new != 0 else absolute_error
        return absolute_error, relative_error
    
    def add_iteration_result(
        self,
        iteration: int,
        x_value: float,
        f_value: float,
        error: Optional[float] = None,
        relative_error: Optional[float] = None,
        execution_time: float = 0.0
    ):
        """Add an iteration result to the history."""
        result = IterationResult(
            iteration=iteration,
            x_value=x_value,
            f_value=f_value,
            error=error,
            relative_error=relative_error,
            execution_time=execution_time
        )
        self.iteration_history.append(result)
    
    @abstractmethod
    def solve(self, **kwargs) -> SolverResult:
        """
        Solve the equation f(x) = 0.
        
        Returns:
            SolverResult containing the solution and convergence information
        """
        pass
    
    @abstractmethod
    def get_method_name(self) -> str:
        """Return the name of the numerical method."""
        pass
    
    def get_convergence_analysis(self) -> Dict[str, Any]:
        """
        Analyze convergence properties from iteration history.
        
        Returns:
            Dictionary containing convergence analysis
        """
        if len(self.iteration_history) < 3:
            return {"status": "Insufficient data for analysis"}
        
        errors = [result.error for result in self.iteration_history[1:] if result.error is not None]
        
        if len(errors) < 2:
            return {"status": "No error data available"}
        
        # Calculate convergence rate
        convergence_rates = []
        for i in range(1, len(errors)):
            if errors[i-1] != 0 and errors[i] != 0:
                rate = np.log(abs(errors[i])) / np.log(abs(errors[i-1]))
                convergence_rates.append(rate)
        
        avg_convergence_rate = np.mean(convergence_rates) if convergence_rates else 0
        
        return {
            "status": "Analysis complete",
            "convergence_rate": avg_convergence_rate,
            "total_iterations": len(self.iteration_history),
            "function_evaluations": self.function_evaluations,
            "derivative_evaluations": self.derivative_evaluations,
            "final_error": errors[-1] if errors else None
        }


class NumericalDerivative:
    """Utility class for numerical derivative approximation."""
    
    @staticmethod
    def forward_difference(f: Callable[[float], float], x: float, h: float = 1e-8) -> float:
        """Calculate derivative using forward difference."""
        return (f(x + h) - f(x)) / h
    
    @staticmethod
    def central_difference(f: Callable[[float], float], x: float, h: float = 1e-8) -> float:
        """Calculate derivative using central difference."""
        return (f(x + h) - f(x - h)) / (2 * h)
    
    @staticmethod
    def backward_difference(f: Callable[[float], float], x: float, h: float = 1e-8) -> float:
        """Calculate derivative using backward difference."""
        return (f(x) - f(x - h)) / h 