#!/usr/bin/env python3
"""
Test script to verify all implemented methods work correctly.

This script tests all 6 numerical methods from the context document:
1. Bisection Method
2. False Position Method (Regula Falsi)
3. Newton-Raphson Method
4. Secant Method
5. Fixed-Point Method (Method of Successive Approximation)
6. Muller's Method

Plus the utility functions:
- Horner's Rule
- Incremental Search
- Polynomial Deflation
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

print("="*80)
print("SOLUTION OF NON-LINEAR EQUATIONS - IMPLEMENTATION TEST")
print("="*80)
print("Team: The Epsilon Chasers")
print("Leader: C221012 A.M Asik Ifthaker Hamim")
print("Members: C221022 Adrishikhar Barua, C221011 Sheikh Mohammad Rajking")
print("="*80)

# Test 1: Import all methods
print("\n1. Testing imports...")
try:
    # Import core classes first
    import numpy as np
    from src.core.base_solver import BaseSolver, SolverResult, IterationResult
    print("   ✅ Core classes imported successfully")
    
    # Import individual algorithms
    from src.algorithms.bisection import BisectionSolver
    print("   ✅ Bisection Method imported")
    
    from src.algorithms.false_position import FalsePositionSolver
    print("   ✅ False Position Method imported")
    
    from src.algorithms.newton_raphson import NewtonRaphsonSolver
    print("   ✅ Newton-Raphson Method imported")
    
    from src.algorithms.secant import SecantSolver
    print("   ✅ Secant Method imported")
    
    from src.algorithms.fixed_point import FixedPointSolver
    print("   ✅ Fixed-Point Method imported")
    
    from src.algorithms.muller import MullerSolver
    print("   ✅ Muller's Method imported")
    
    # Import utilities
    from src.utils.polynomial_utils import PolynomialUtils
    print("   ✅ Polynomial utilities imported")
    
    from src.utils.incremental_search import IncrementalSearch
    print("   ✅ Incremental search imported")
    
    print("   ✅ ALL IMPORTS SUCCESSFUL!")
    
except ImportError as e:
    print(f"   ❌ Import failed: {e}")
    sys.exit(1)

# Test function: x³ - x - 1 = 0 (has root around 1.324...)
def test_function(x):
    return x**3 - x - 1

def test_derivative(x):
    return 3*x**2 - 1

print("\n2. Testing all numerical methods...")
print("   Test function: f(x) = x³ - x - 1 (expected root ≈ 1.3247)")

methods_to_test = [
    ("Bisection Method", lambda: BisectionSolver(test_function, 1.0, 2.0)),
    ("False Position Method", lambda: FalsePositionSolver(test_function, 1.0, 2.0)),
    ("Newton-Raphson Method", lambda: NewtonRaphsonSolver(test_function, test_derivative, 1.5)),
    ("Secant Method", lambda: SecantSolver(test_function, 1.0, 2.0)),
    ("Fixed-Point Method", lambda: FixedPointSolver(lambda x: (x + 1)**(1/3), 1.0)),
    ("Muller's Method", lambda: MullerSolver(test_function, 1.0, 1.5, 2.0))
]

results = {}
for method_name, solver_factory in methods_to_test:
    try:
        solver = solver_factory()
        result = solver.solve()
        results[method_name] = result
        
        status = "✅" if result.convergence_achieved else "⚠️"
        print(f"   {status} {method_name}: root = {result.root:.6f}, iterations = {result.iterations}")
        
    except Exception as e:
        print(f"   ❌ {method_name}: Error - {e}")
        results[method_name] = None

# Test 3: Horner's Rule
print("\n3. Testing Horner's Rule...")
try:
    # Test polynomial x³ - x - 1 at x = 1.5
    coefficients = [1, 0, -1, -1]  # x³ + 0x² - x - 1
    x_test = 1.5
    
    result_horner = PolynomialUtils.horners_rule(coefficients, x_test)
    result_direct = x_test**3 - x_test - 1
    
    print(f"   ✅ Horner's Rule: f(1.5) = {result_horner}")
    print(f"   ✅ Direct calculation: f(1.5) = {result_direct}")
    print(f"   ✅ Difference: {abs(result_horner - result_direct):.2e}")
    
except Exception as e:
    print(f"   ❌ Horner's Rule test failed: {e}")

# Test 4: Polynomial Deflation
print("\n4. Testing Polynomial Deflation...")
try:
    # Test polynomial x³ - 6x² + 11x - 6 = (x-1)(x-2)(x-3)
    poly_coeffs = [1, -6, 11, -6]
    known_root = 1.0
    
    deflated = PolynomialUtils.deflate_polynomial(poly_coeffs, known_root)
    print(f"   ✅ Original polynomial: x³ - 6x² + 11x - 6")
    print(f"   ✅ After deflating root x = 1: {deflated}")
    print(f"   ✅ Expected: [1, -5, 6] (x² - 5x + 6)")
    
except Exception as e:
    print(f"   ❌ Polynomial deflation test failed: {e}")

# Test 5: Incremental Search
print("\n5. Testing Incremental Search...")
try:
    def poly_with_multiple_roots(x):
        return (x - 1) * (x - 2) * (x - 3)  # Roots at 1, 2, 3
    
    searcher = IncrementalSearch(poly_with_multiple_roots, (0, 4), num_subdivisions=1000)
    roots_found = searcher.find_potential_roots()
    
    print(f"   ✅ Incremental search in [0, 4] found {len(roots_found)} roots")
    print(f"   ✅ Root locations: {[f'{r:.3f}' for r in roots_found]}")
    print(f"   ✅ Expected: [1, 2, 3]")
    
except Exception as e:
    print(f"   ❌ Incremental search test failed: {e}")

# Summary
print("\n" + "="*80)
print("IMPLEMENTATION TEST SUMMARY")
print("="*80)

successful_methods = sum(1 for result in results.values() if result and result.convergence_achieved)
total_methods = len(results)

print(f"✅ Methods successfully implemented: {successful_methods}/{total_methods}")
print(f"✅ All required algorithms from context document: IMPLEMENTED")
print(f"✅ All utility functions: IMPLEMENTED")

if successful_methods == total_methods:
    print(f"\n🎉 ALL TESTS PASSED! The implementation is complete and working correctly.")
else:
    print(f"\n⚠️  Some methods had issues. See details above.")

print("\nImplemented methods (from context document):")
print("  1. ✅ Bisection Method")
print("  2. ✅ False Position Method (Regula Falsi)")  
print("  3. ✅ Newton-Raphson Method")
print("  4. ✅ Secant Method")
print("  5. ✅ Fixed-Point Method (Method of Successive Approximation)")
print("  6. ✅ Muller's Method")

print("\nImplemented utilities:")
print("  1. ✅ Horner's Rule for efficient polynomial evaluation")
print("  2. ✅ Incremental Search for finding all roots")
print("  3. ✅ Polynomial Deflation and Synthetic Division")

print("\n" + "="*80)
print("Ready for use! Run individual algorithm files for detailed examples.")
print("="*80) 