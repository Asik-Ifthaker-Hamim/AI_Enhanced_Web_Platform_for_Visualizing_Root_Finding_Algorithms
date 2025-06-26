"""
Incremental Search implementation for finding all possible roots in an interval.

This module implements the incremental search technique mentioned in the context
for determining all possible roots of a non-linear equation in a given interval.
"""

import numpy as np
from typing import Callable, List, Tuple, Optional
import warnings


class IncrementalSearch:
    """
    Implementation of incremental search for finding potential root locations.
    
    From context: "To find all roots in an interval, one can use an incremental 
    search technique. This involves starting at one end of the interval and 
    searching for a root at every incremental step until the other end is reached."
    """
    
    def __init__(
        self,
        function: Callable[[float], float],
        interval: Tuple[float, float],
        increment: Optional[float] = None,
        num_subdivisions: Optional[int] = None
    ):
        """
        Initialize the incremental search.
        
        Args:
            function: The function f(x) for which to find roots
            interval: Tuple (a, b) defining the search interval
            increment: Step size for the search (if None, calculated from num_subdivisions)
            num_subdivisions: Number of subdivisions to use (if increment not provided)
            
        Note:
            Either increment or num_subdivisions must be provided.
            From context: "A major challenge is deciding the increment size; 
            a large size might miss closely spaced roots, while a small size 
            increases execution time."
        """
        self.function = function
        self.a, self.b = sorted(interval)  # Ensure a <= b
        
        if increment is not None:
            self.increment = abs(increment)
        elif num_subdivisions is not None:
            self.increment = (self.b - self.a) / num_subdivisions
        else:
            # Default to 1000 subdivisions
            self.increment = (self.b - self.a) / 1000
            warnings.warn("Neither increment nor num_subdivisions provided. "
                         "Using default 1000 subdivisions.")
        
        # Ensure increment is not too small
        if self.increment < 1e-12:
            warnings.warn("Very small increment size may lead to numerical issues.")
    
    def find_sign_changes(self, verbose: bool = False) -> List[Tuple[float, float]]:
        """
        Find all intervals where the function changes sign.
        
        A sign change indicates the presence of at least one root in that interval
        (assuming the function is continuous).
        
        Args:
            verbose: If True, print progress information
            
        Returns:
            List of tuples (x1, x2) where sign changes occur
        """
        sign_change_intervals = []
        
        x_current = self.a
        f_current = self.function(x_current)
        
        if verbose:
            print(f"Starting incremental search from {self.a} to {self.b}")
            print(f"Increment size: {self.increment}")
            print(f"Number of steps: {int((self.b - self.a) / self.increment)}")
            print("\nSearching for sign changes...")
        
        step_count = 0
        while x_current < self.b:
            x_next = min(x_current + self.increment, self.b)
            f_next = self.function(x_next)
            
            # Check for sign change
            if f_current * f_next < 0:
                sign_change_intervals.append((x_current, x_next))
                if verbose:
                    print(f"Sign change found in interval [{x_current:.6f}, {x_next:.6f}]")
                    print(f"  f({x_current:.6f}) = {f_current:.6e}")
                    print(f"  f({x_next:.6f}) = {f_next:.6e}")
            
            # Check for exact zero
            elif abs(f_next) < 1e-15:
                sign_change_intervals.append((x_next, x_next))
                if verbose:
                    print(f"Exact root found at x = {x_next:.6f}")
            
            # Move to next step
            x_current = x_next
            f_current = f_next
            step_count += 1
        
        if verbose:
            print(f"\nIncremental search completed.")
            print(f"Total steps: {step_count}")
            print(f"Sign changes found: {len(sign_change_intervals)}")
        
        return sign_change_intervals
    
    def find_potential_roots(
        self, 
        root_finder: Optional[Callable] = None,
        verbose: bool = False
    ) -> List[float]:
        """
        Find potential roots using incremental search followed by root refinement.
        
        Args:
            root_finder: Function to refine root estimates (if None, returns interval midpoints)
            verbose: If True, print detailed information
            
        Returns:
            List of potential root locations
        """
        sign_change_intervals = self.find_sign_changes(verbose)
        potential_roots = []
        
        if verbose and sign_change_intervals:
            print("\nRefining root estimates...")
        
        for i, (x1, x2) in enumerate(sign_change_intervals):
            if x1 == x2:  # Exact root found
                potential_roots.append(x1)
                if verbose:
                    print(f"Root {i+1}: x = {x1:.8f} (exact)")
            else:
                if root_finder is not None:
                    try:
                        # Use provided root finder to refine the estimate
                        refined_root = root_finder(x1, x2)
                        potential_roots.append(refined_root)
                        if verbose:
                            print(f"Root {i+1}: x = {refined_root:.8f} (refined)")
                    except Exception as e:
                        # Fall back to midpoint if root finder fails
                        midpoint = (x1 + x2) / 2
                        potential_roots.append(midpoint)
                        if verbose:
                            print(f"Root {i+1}: x = {midpoint:.8f} (midpoint, refinement failed)")
                else:
                    # Use midpoint as estimate
                    midpoint = (x1 + x2) / 2
                    potential_roots.append(midpoint)
                    if verbose:
                        print(f"Root {i+1}: x = {midpoint:.8f} (midpoint)")
        
        return potential_roots
    
    def analyze_increment_sensitivity(
        self, 
        increment_factors: List[float] = [0.1, 0.5, 1.0, 2.0, 5.0]
    ) -> dict:
        """
        Analyze how the choice of increment affects root finding.
        
        Args:
            increment_factors: Factors to multiply the base increment by
            
        Returns:
            Dictionary with analysis results
        """
        base_increment = self.increment
        results = {}
        
        for factor in increment_factors:
            test_increment = base_increment * factor
            
            # Temporarily change increment
            old_increment = self.increment
            self.increment = test_increment
            
            sign_changes = self.find_sign_changes(verbose=False)
            
            results[factor] = {
                "increment": test_increment,
                "num_subdivisions": int((self.b - self.a) / test_increment),
                "sign_changes_found": len(sign_changes),
                "intervals": sign_changes
            }
            
            # Restore original increment
            self.increment = old_increment
        
        # Add analysis
        sign_change_counts = [results[f]["sign_changes_found"] for f in increment_factors]
        results["analysis"] = {
            "min_roots_found": min(sign_change_counts),
            "max_roots_found": max(sign_change_counts),
            "recommended_factor": increment_factors[np.argmax(sign_change_counts)],
            "note": "Smaller increments may find more roots but increase computation time"
        }
        
        return results
    
    @staticmethod
    def recommend_increment(
        function: Callable[[float], float],
        interval: Tuple[float, float],
        sample_points: int = 100
    ) -> float:
        """
        Recommend an increment size based on function behavior.
        
        Args:
            function: The function to analyze
            interval: The interval to search
            sample_points: Number of points to sample for analysis
            
        Returns:
            Recommended increment size
        """
        a, b = sorted(interval)
        x_sample = np.linspace(a, b, sample_points)
        f_values = [function(x) for x in x_sample]
        
        # Estimate function variation
        f_std = np.std(f_values)
        f_range = max(f_values) - min(f_values)
        
        # Count sign changes in sample
        sign_changes = 0
        for i in range(len(f_values) - 1):
            if f_values[i] * f_values[i + 1] < 0:
                sign_changes += 1
        
        # Base increment on interval size and expected complexity
        base_increment = (b - a) / 1000  # Conservative default
        
        if sign_changes > 0:
            # If we see sign changes, use smaller increment
            density_factor = sign_changes / sample_points
            recommended_increment = base_increment * (1 / (1 + 10 * density_factor))
        else:
            # If no sign changes in sample, increment can be larger
            recommended_increment = base_increment * 2
        
        return max(recommended_increment, (b - a) / 10000)  # Don't go too small


# Example usage and test functions
if __name__ == "__main__":
    # Example 1: Polynomial with multiple roots
    print("Incremental Search Example 1: (x-1)(x-2)(x-3) = x³ - 6x² + 11x - 6")
    
    def poly_function(x):
        return x**3 - 6*x**2 + 11*x - 6  # Roots at x = 1, 2, 3
    
    searcher1 = IncrementalSearch(poly_function, (0, 4), num_subdivisions=1000)
    roots1 = searcher1.find_potential_roots(verbose=True)
    
    print(f"\nFound roots: {roots1}")
    print("Expected roots: [1, 2, 3]")
    
    # Example 2: Trigonometric function with many roots
    print("\n" + "="*70)
    print("Incremental Search Example 2: sin(x) in [0, 4π]")
    
    def sin_function(x):
        return np.sin(x)
    
    searcher2 = IncrementalSearch(sin_function, (0, 4*np.pi), num_subdivisions=2000)
    roots2 = searcher2.find_potential_roots(verbose=True)
    
    print(f"\nFound roots: {[f'{r:.4f}' for r in roots2]}")
    expected_roots = [i * np.pi for i in range(5)]  # 0, π, 2π, 3π, 4π
    print(f"Expected roots: {[f'{r:.4f}' for r in expected_roots]}")
    
    # Example 3: Increment sensitivity analysis
    print("\n" + "="*70)
    print("Increment Sensitivity Analysis for sin(x)")
    
    sensitivity = searcher2.analyze_increment_sensitivity()
    
    print(f"{'Factor':<8} {'Increment':<12} {'Subdivisions':<12} {'Roots Found':<12}")
    print("-" * 50)
    
    for factor in sorted(sensitivity.keys()):
        if isinstance(factor, (int, float)):  # Skip 'analysis' key
            data = sensitivity[factor]
            print(f"{factor:<8} {data['increment']:<12.6f} "
                  f"{data['num_subdivisions']:<12} {data['sign_changes_found']:<12}")
    
    print(f"\nRecommended factor: {sensitivity['analysis']['recommended_factor']}")
    print(f"Analysis: {sensitivity['analysis']['note']}")
    
    # Example 4: Increment recommendation
    print("\n" + "="*70)
    print("Increment Recommendation")
    
    recommended = IncrementalSearch.recommend_increment(sin_function, (0, 4*np.pi))
    print(f"Recommended increment for sin(x) in [0, 4π]: {recommended:.6f}")
    print(f"This corresponds to ~{int(4*np.pi / recommended)} subdivisions") 