"""
Algorithms package for solving non-linear equations.

This package contains implementations of all the numerical methods mentioned 
in the context document for finding roots of non-linear equations.
"""

from .bisection import BisectionSolver
from .false_position import FalsePositionSolver
from .newton_raphson import NewtonRaphsonSolver
from .secant import SecantSolver
from .fixed_point import FixedPointSolver
from .muller import MullerSolver

__all__ = [
    'BisectionSolver',
    'FalsePositionSolver', 
    'NewtonRaphsonSolver',
    'SecantSolver',
    'FixedPointSolver',
    'MullerSolver'
] 