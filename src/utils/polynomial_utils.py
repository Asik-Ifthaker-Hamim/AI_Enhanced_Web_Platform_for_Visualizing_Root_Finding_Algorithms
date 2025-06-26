"""
Polynomial utilities for efficient evaluation and manipulation.

This module implements Horner's Rule for efficient polynomial evaluation,
synthetic division, and polynomial deflation techniques.
"""

import numpy as np
from typing import List, Tuple, Callable


class PolynomialUtils:
    """
    Utility class for polynomial operations including Horner's Rule,
    synthetic division, and deflation.
    """
    
    @staticmethod
    def horners_rule(coefficients: List[float], x: float) -> float:
        """
        Evaluate a polynomial using Horner's Rule (nested multiplication).
        
        This method is more efficient than direct evaluation, requiring only
        n additions and n multiplications for an nth-degree polynomial.
        
        From context: f(x) = ((...((a_n*x + a_{n-1})x + a_{n-2})x + ... + a_1)x + a_0)
        
        Args:
            coefficients: Polynomial coefficients [a_n, a_{n-1}, ..., a_1, a_0]
                         where the polynomial is a_n*x^n + ... + a_1*x + a_0
            x: Point at which to evaluate the polynomial
            
        Returns:
            Value of the polynomial at x
            
        Example:
            For polynomial 3x³ + 2x² - 5x + 1:
            coefficients = [3, 2, -5, 1]
            result = horners_rule(coefficients, 2.0)  # Evaluates at x = 2
        """
        if not coefficients:
            return 0.0
        
        # Algorithm from context:
        # p_n = a_n
        # p_j = p_{j+1} * x + a_j  (for j = n-1 down to 0)
        # f(x) = p_0
        
        result = coefficients[0]  # p_n = a_n
        
        # Iterate through remaining coefficients
        for coefficient in coefficients[1:]:
            result = result * x + coefficient  # p_j = p_{j+1} * x + a_j
        
        return result  # f(x) = p_0
    
    @staticmethod
    def horners_rule_with_derivative(coefficients: List[float], x: float) -> Tuple[float, float]:
        """
        Evaluate both polynomial and its derivative using modified Horner's Rule.
        
        Args:
            coefficients: Polynomial coefficients [a_n, a_{n-1}, ..., a_1, a_0]
            x: Point at which to evaluate
            
        Returns:
            Tuple of (f(x), f'(x))
        """
        if not coefficients:
            return 0.0, 0.0
        
        if len(coefficients) == 1:
            return coefficients[0], 0.0
        
        # Evaluate polynomial value
        p = coefficients[0]
        for coefficient in coefficients[1:]:
            p = p * x + coefficient
        
        # Evaluate derivative
        # Derivative coefficients are [n*a_n, (n-1)*a_{n-1}, ..., 1*a_1]
        if len(coefficients) > 1:
            p_prime = coefficients[0]
            for i, coefficient in enumerate(coefficients[1:-1], 1):
                p_prime = p_prime * x + coefficient
        else:
            p_prime = 0.0
        
        return p, p_prime
    
    @staticmethod
    def synthetic_division(coefficients: List[float], root: float) -> Tuple[List[float], float]:
        """
        Perform synthetic division of a polynomial by (x - root).
        
        This is the recursive process used to find the coefficients of the 
        quotient polynomial without performing actual division.
        
        Args:
            coefficients: Polynomial coefficients [a_n, a_{n-1}, ..., a_1, a_0]
            root: The root value (dividing by x - root)
            
        Returns:
            Tuple of (quotient_coefficients, remainder)
            
        Example:
            For polynomial x³ - 6x² + 11x - 6 divided by (x - 1):
            coefficients = [1, -6, 11, -6]
            quotient, remainder = synthetic_division(coefficients, 1)
            # quotient = [1, -5, 6], remainder = 0
        """
        if not coefficients:
            return [], 0.0
        
        if len(coefficients) == 1:
            return [], coefficients[0]
        
        quotient = [coefficients[0]]  # First coefficient stays the same
        
        # Synthetic division algorithm
        for i in range(1, len(coefficients)):
            next_coeff = coefficients[i] + quotient[-1] * root
            quotient.append(next_coeff)
        
        # Last element is the remainder
        remainder = quotient.pop()
        
        return quotient, remainder
    
    @staticmethod
    def deflate_polynomial(coefficients: List[float], root: float, tolerance: float = 1e-10) -> List[float]:
        """
        Deflate a polynomial by removing a known root.
        
        From context: "For polynomials, once a root x_r is found, the degree of the 
        polynomial can be reduced by dividing it by the factor (x - x_r). This 
        process is called deflation."
        
        Args:
            coefficients: Original polynomial coefficients
            root: Known root to remove
            tolerance: Tolerance for checking if division is exact
            
        Returns:
            Coefficients of the deflated polynomial
            
        Raises:
            ValueError: If the provided value is not actually a root
        """
        # Verify that it's actually a root
        function_value = PolynomialUtils.horners_rule(coefficients, root)
        if abs(function_value) > tolerance:
            raise ValueError(f"Value {root} is not a root of the polynomial. "
                           f"f({root}) = {function_value}")
        
        quotient, remainder = PolynomialUtils.synthetic_division(coefficients, root)
        
        # Check that remainder is close to zero
        if abs(remainder) > tolerance:
            raise ValueError(f"Synthetic division produced non-zero remainder: {remainder}")
        
        return quotient
    
    @staticmethod
    def create_polynomial_function(coefficients: List[float]) -> Callable[[float], float]:
        """
        Create a polynomial function from coefficients using Horner's Rule.
        
        Args:
            coefficients: Polynomial coefficients [a_n, a_{n-1}, ..., a_1, a_0]
            
        Returns:
            Function that evaluates the polynomial at any point
        """
        def polynomial_function(x: float) -> float:
            return PolynomialUtils.horners_rule(coefficients, x)
        
        return polynomial_function
    
    @staticmethod
    def polynomial_derivative_coefficients(coefficients: List[float]) -> List[float]:
        """
        Calculate the coefficients of the polynomial's derivative.
        
        Args:
            coefficients: Polynomial coefficients [a_n, a_{n-1}, ..., a_1, a_0]
            
        Returns:
            Derivative coefficients [n*a_n, (n-1)*a_{n-1}, ..., 1*a_1]
        """
        if len(coefficients) <= 1:
            return [0.0]
        
        derivative_coeffs = []
        degree = len(coefficients) - 1
        
        for i, coeff in enumerate(coefficients[:-1]):  # Exclude constant term
            power = degree - i
            derivative_coeffs.append(power * coeff)
        
        return derivative_coeffs
    
    @staticmethod
    def find_all_polynomial_roots_by_deflation(
        coefficients: List[float], 
        root_finder: Callable[[Callable], float],
        max_roots: int = None,
        tolerance: float = 1e-10
    ) -> List[float]:
        """
        Find all roots of a polynomial using deflation.
        
        Args:
            coefficients: Polynomial coefficients
            root_finder: Function that finds one root of a polynomial function
            max_roots: Maximum number of roots to find (defaults to degree)
            tolerance: Tolerance for deflation
            
        Returns:
            List of found roots
        """
        if max_roots is None:
            max_roots = len(coefficients) - 1  # Degree of polynomial
        
        roots = []
        current_coeffs = coefficients.copy()
        
        for _ in range(max_roots):
            if len(current_coeffs) <= 1:
                break
            
            # Create polynomial function from current coefficients
            poly_func = PolynomialUtils.create_polynomial_function(current_coeffs)
            
            try:
                # Find a root
                root = root_finder(poly_func)
                roots.append(root)
                
                # Deflate the polynomial
                current_coeffs = PolynomialUtils.deflate_polynomial(
                    current_coeffs, root, tolerance
                )
                
            except (ValueError, RuntimeError):
                # Root finder failed or deflation failed
                break
        
        return roots


# Example usage and test functions
if __name__ == "__main__":
    # Test Horner's Rule
    print("Testing Horner's Rule")
    print("Polynomial: 3x³ + 2x² - 5x + 1")
    coefficients = [3, 2, -5, 1]
    x_test = 2.0
    
    # Direct evaluation: 3(8) + 2(4) - 5(2) + 1 = 24 + 8 - 10 + 1 = 23
    result_horner = PolynomialUtils.horners_rule(coefficients, x_test)
    result_direct = 3*(x_test**3) + 2*(x_test**2) - 5*x_test + 1
    
    print(f"Horner's Rule result: {result_horner}")
    print(f"Direct evaluation: {result_direct}")
    print(f"Difference: {abs(result_horner - result_direct):.2e}\n")
    
    # Test synthetic division
    print("Testing Synthetic Division")
    print("Polynomial: x³ - 6x² + 11x - 6")
    print("Dividing by (x - 1)")
    
    poly_coeffs = [1, -6, 11, -6]
    quotient, remainder = PolynomialUtils.synthetic_division(poly_coeffs, 1)
    
    print(f"Quotient coefficients: {quotient}")
    print(f"Remainder: {remainder}")
    print("Expected: quotient = [1, -5, 6], remainder = 0\n")
    
    # Test deflation
    print("Testing Polynomial Deflation")
    print("Original polynomial: x³ - 6x² + 11x - 6")
    print("Known root: x = 1")
    
    try:
        deflated = PolynomialUtils.deflate_polynomial(poly_coeffs, 1)
        print(f"Deflated polynomial coefficients: {deflated}")
        print("Expected: [1, -5, 6] (representing x² - 5x + 6)")
        
        # Verify the deflated polynomial
        print("\nVerifying deflated polynomial at x = 2:")
        deflated_value = PolynomialUtils.horners_rule(deflated, 2)
        expected_value = 2**2 - 5*2 + 6  # Should be 0 since x=2 is also a root
        print(f"Deflated polynomial at x=2: {deflated_value}")
        print(f"Expected (x² - 5x + 6 at x=2): {expected_value}")
        
    except ValueError as e:
        print(f"Error: {e}")
    
    # Test polynomial function creation
    print("\nTesting Polynomial Function Creation")
    poly_func = PolynomialUtils.create_polynomial_function([1, -2, 1])  # x² - 2x + 1
    print("Created function for x² - 2x + 1")
    print(f"f(0) = {poly_func(0)}")  # Should be 1
    print(f"f(1) = {poly_func(1)}")  # Should be 0
    print(f"f(2) = {poly_func(2)}")  # Should be 1 