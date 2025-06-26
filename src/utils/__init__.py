"""
Utility modules for the numerical methods project.
"""

from .examples import get_example_functions, create_custom_function
from .polynomial_utils import PolynomialUtils
from .incremental_search import IncrementalSearch

__all__ = [
    'get_example_functions',
    'create_custom_function',
    'PolynomialUtils',
    'IncrementalSearch'
] 