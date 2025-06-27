#!/usr/bin/env python3
"""
Solution of Non-linear Equations - GUI Application

A comprehensive graphical interface for testing and comparing numerical methods
for solving non-linear equations. This application implements all six standard
root-finding algorithms with educational features and detailed analysis.

Features:
    - Interactive equation solver with 6 numerical methods
    - Method comparison and performance analysis
    - Polynomial utilities (Horner's rule, deflation)
    - Incremental search for multiple roots
    - Real-time visualization and error analysis

Team: The Epsilon Chasers
Leader: C221012 A.M Asik Ifthaker Hamim
Members: C221022 Adrishikhar Barua, C221011 Sheikh Mohammad Rajking

Course: Numerical Methods
Institution: [Your Institution Name]
Date: 2024

License: Educational Use Only
"""

# Standard library imports
import sys
import os
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import math
from typing import Callable, Dict, Any, Optional, Tuple

# Third-party imports
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg, NavigationToolbar2Tk
from matplotlib.figure import Figure

# Add src directory to Python path for module imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Import numerical methods
from src.algorithms.bisection import BisectionSolver
from src.algorithms.false_position import FalsePositionSolver
from src.algorithms.newton_raphson import NewtonRaphsonSolver
from src.algorithms.secant import SecantSolver
from src.algorithms.fixed_point import FixedPointSolver
from src.algorithms.muller import MullerSolver

# Import utilities
from src.utils.polynomial_utils import PolynomialUtils
from src.utils.incremental_search import IncrementalSearch

class SimpleNumericalMethodsGUI:
    """
    Main GUI application class for the numerical methods solver.
    
    This class provides a comprehensive graphical interface for testing
    and comparing numerical root-finding methods. It includes tabs for
    equation solving, method comparison, and utility functions.
    
    Attributes:
        root (tk.Tk): The main tkinter window
        predefined_functions (Dict): Dictionary of built-in test functions
        notebook (ttk.Notebook): Main tab container
        results_text (scrolledtext.ScrolledText): Results display area
        comparison_tree (ttk.Treeview): Method comparison table
        status_var (tk.StringVar): Status bar text variable
        
    Example:
        root = tk.Tk()
        app = SimpleNumericalMethodsGUI(root)
        root.mainloop()
    """
    
    def __init__(self, root: tk.Tk) -> None:
        """
        Initialize the GUI application.
        
        Args:
            root: The main tkinter window instance
        """
        self.root = root
        self.root.title("Solution of Non-linear Equations - The Epsilon Chasers")
        
        # Configure window for better flexibility and responsiveness
        self.configure_window()
        
        # Initialize core data
        self.predefined_functions = self.setup_predefined_functions()
        
        # Build the user interface
        self.setup_styles()
        self.create_header()
        self.create_main_interface()
        self.create_status_bar()
        
    def configure_window(self):
        """Configure the main window with enhanced responsive settings."""
        # Set initial size with better scaling and minimum size for usability
        screen_width = self.root.winfo_screenwidth()
        screen_height = self.root.winfo_screenheight()
        
        # Calculate window size as percentage of screen (80% width, 85% height)
        window_width = int(screen_width * 0.8)
        window_height = int(screen_height * 0.85)
        
        # Ensure minimum viable size
        window_width = max(window_width, 1200)
        window_height = max(window_height, 800)
        
        self.root.geometry(f"{window_width}x{window_height}")
        self.root.minsize(1000, 700)  # Minimum for proper layout
        
        # Enable window state controls for better user experience
        self.root.state('normal')  # Allow maximize/minimize
        
        # Center the window on screen
        self.center_window()
        
        # Configure main window grid for responsive behavior
        self.root.grid_rowconfigure(0, weight=1)
        self.root.grid_columnconfigure(0, weight=1)
        
        # Bind resize events for dynamic layout updates
        self.root.bind('<Configure>', self.on_window_configure)
        
        # Allow window to be resizable
        self.root.resizable(True, True)
        
    def center_window(self):
        """Center the window on the screen with updated geometry."""
        self.root.update_idletasks()
        width = self.root.winfo_width()
        height = self.root.winfo_height()
        pos_x = (self.root.winfo_screenwidth() // 2) - (width // 2)
        pos_y = (self.root.winfo_screenheight() // 2) - (height // 2)
        
        # Ensure window doesn't go off-screen
        pos_x = max(0, pos_x)
        pos_y = max(0, pos_y)
        
        self.root.geometry(f'{width}x{height}+{pos_x}+{pos_y}')
        
    def on_window_configure(self, event):
        """Handle window resize events to maintain responsive layout."""
        if event.widget == self.root:
            # Update layouts for responsive design based on window size
            current_width = self.root.winfo_width()
            current_height = self.root.winfo_height()
            
            # Adjust font sizes based on window size for better scaling
            if hasattr(self, 'notebook'):
                self.update_responsive_elements(current_width, current_height)
                
    def update_responsive_elements(self, width, height):
        """Update UI elements based on current window size."""
        # Adjust hero section heights based on window height
        if height < 800:
            hero_height = 60
            title_font_size = 16
            is_compact = True
        elif height < 1000:
            hero_height = 80  
            title_font_size = 20
            is_compact = False
        else:
            hero_height = 100
            title_font_size = 24
            is_compact = False
            
        # Adjust wraplength for text elements based on window width
        if width < 1200:
            wrap_length = 200
        elif width < 1600:
            wrap_length = 250
        else:
            wrap_length = 300
            
        # Store responsive settings for use in tabs
        self.responsive_settings = {
            'hero_height': hero_height,
            'title_font_size': title_font_size,
            'is_compact': is_compact,
            'wrap_length': wrap_length,
            'window_width': width,
            'window_height': height
        }
        
        # Update existing text elements with new wraplength if they exist
        self.update_text_wrapping(wrap_length)
        
    def update_text_wrapping(self, wrap_length):
        """Update text wrapping for existing elements."""
        try:
            # Update any existing help text or description labels
            if hasattr(self, 'method_help'):
                self.method_help.config(wraplength=wrap_length)
            
            # Update any long text descriptions in team tab
            for widget in self.root.winfo_children():
                self.update_widget_wrapping(widget, wrap_length)
        except Exception:
            # Fail silently if widgets don't exist yet
            pass
            
    def update_widget_wrapping(self, widget, wrap_length):
        """Recursively update wraplength for all text widgets."""
        try:
            if hasattr(widget, 'config') and hasattr(widget, 'cget'):
                try:
                    current_wrap = widget.cget('wraplength')
                    if current_wrap and current_wrap > 0:
                        widget.config(wraplength=wrap_length)
                except Exception:
                    pass
            
            # Recursively check children
            for child in widget.winfo_children():
                self.update_widget_wrapping(child, wrap_length)
        except Exception:
            pass
    
    def setup_styles(self) -> None:
        """
        Configure custom styles for ttk widgets with dynamic professional design.
        
        Sets up consistent styling throughout the application using
        ttk.Style() to define custom fonts, colors, and layouts.
        """
        self.style = ttk.Style()
        self.style.theme_use('clam')
        
        # Enhanced Dynamic Professional Color Palette
        self.colors = {
            # Primary Theme Colors
            'primary': '#2c3e50',        # Dark blue-gray (primary)
            'secondary': '#3498db',       # Professional blue
            'success': '#27ae60',         # Professional green
            'warning': '#f39c12',         # Professional orange
            'danger': '#e74c3c',          # Professional red
            'info': '#8e44ad',           # Professional purple
            
            # Background Colors
            'hero_bg': '#2c3e50',        # Hero section background
            'light': '#ecf0f1',          # Light gray background
            'white': '#ffffff',           # Pure white
            'background': '#f8f9fa',      # Main background
            'section_bg': '#fdfdfd',      # Section background
            
            # Text Colors
            'text_primary': '#2c3e50',    # Dark text
            'text_secondary': '#5d6d7e',  # Medium gray text
            'text_muted': '#85929e',      # Light gray text
            'text_white': '#ffffff',      # White text
            'text_light': '#bdc3c7',      # Light text for dark backgrounds
            
            # UI Element Colors
            'border': '#bdc3c7',          # Border color
            'border_light': '#e1e8ed',    # Light border
            'hover': '#34495e',           # Hover state
            'active': '#1abc9c',          # Active state
            
            # Dynamic Accent Colors
            'accent_blue': '#3498db',     # Blue accent
            'accent_green': '#27ae60',    # Green accent
            'accent_orange': '#f39c12',   # Orange accent
            'accent_purple': '#9b59b6',   # Purple accent
            'accent_red': '#e74c3c',      # Red accent
            'accent_teal': '#1abc9c',     # Teal accent
            
            # Card and Section Colors
            'card_bg': '#ffffff',         # Card background
            'card_header_blue': '#3498db',     # Blue card headers
            'card_header_green': '#27ae60',    # Green card headers
            'card_header_orange': '#f39c12',   # Orange card headers
            'card_header_purple': '#9b59b6',   # Purple card headers
            'card_header_red': '#e74c3c',      # Red card headers
            'card_header_teal': '#1abc9c',     # Teal card headers
            
            # Specialized Colors
            'solver_accent': '#3498db',   # Solver tab accent
            'comparison_accent': '#27ae60', # Comparison tab accent
            'utilities_accent': '#f39c12',  # Utilities tab accent
            'team_accent': '#9b59b6'      # Team tab accent
        }
        
        # Professional Font System - Enhanced with more variations
        self.fonts = {
            'hero_title': ('Segoe UI', 28, 'bold'),     # Hero titles
            'title': ('Segoe UI', 18, 'bold'),          # Main titles
            'heading': ('Segoe UI', 14, 'bold'),        # Section headings
            'subheading': ('Segoe UI', 12, 'bold'),     # Subsection headings
            'body': ('Segoe UI', 10, 'normal'),         # Regular body text
            'caption': ('Segoe UI', 9, 'normal'),       # Small text, captions
            'code': ('Consolas', 9, 'normal'),          # Code/monospace text
            'button': ('Segoe UI', 10, 'bold'),         # Button text
            'button_large': ('Segoe UI', 12, 'bold'),   # Large button text
            'card_title': ('Segoe UI', 16, 'bold'),     # Card titles
            'tab_title': ('Segoe UI', 14, 'bold')       # Tab titles
        }
        
        # Configure custom widget styles with professional colors and fonts
        
        # Label styles
        self.style.configure('Header.TLabel', 
                           font=self.fonts['heading'], 
                           background=self.colors['background'],
                           foreground=self.colors['text_primary'])
        
        self.style.configure('Title.TLabel', 
                           font=self.fonts['subheading'], 
                           background=self.colors['background'],
                           foreground=self.colors['text_primary'])
        
        self.style.configure('Body.TLabel', 
                           font=self.fonts['body'], 
                           background=self.colors['background'],
                           foreground=self.colors['text_secondary'])
        
        self.style.configure('Caption.TLabel', 
                           font=self.fonts['caption'], 
                           background=self.colors['background'],
                           foreground=self.colors['text_muted'])
        
        # Entry and Combobox styles with modern look
        self.style.configure('TEntry',
                           font=self.fonts['body'],
                           fieldbackground=self.colors['white'],
                           borderwidth=1,
                           relief='solid')
        
        self.style.configure('TCombobox',
                           font=self.fonts['body'],
                           fieldbackground=self.colors['white'],
                           borderwidth=1,
                           relief='solid')
        
        # Notebook styles with modern tabs
        self.style.configure('TNotebook',
                           background=self.colors['background'],
                           borderwidth=0)
        
        self.style.configure('TNotebook.Tab',
                           font=self.fonts['tab_title'],
                           foreground=self.colors['text_primary'],
                           background=self.colors['light'],
                           padding=[20, 10])
        
        # Frame styles
        self.style.configure('TLabelFrame',
                           font=self.fonts['subheading'],
                           foreground=self.colors['text_primary'],
                           background=self.colors['section_bg'],
                           borderwidth=1,
                           relief='solid')
        
        self.style.configure('TLabelFrame.Label',
                           font=self.fonts['subheading'],
                           foreground=self.colors['text_primary'],
                           background=self.colors['section_bg'])
        
        # Treeview styles with modern appearance
        self.style.configure('Treeview',
                           font=self.fonts['body'],
                           background=self.colors['white'],
                           foreground=self.colors['text_primary'],
                           rowheight=25,
                           borderwidth=1,
                           relief='solid')
        
        self.style.configure('Treeview.Heading',
                           font=self.fonts['subheading'],
                           background=self.colors['light'],
                           foreground=self.colors['text_primary'],
                           borderwidth=1,
                           relief='solid')
        
    def setup_predefined_functions(self) -> Dict[str, Dict[str, Any]]:
        """
        Define the predefined test functions for the application.
        
        Creates a dictionary of common mathematical functions used for
        testing numerical methods, including their derivatives, suggested
        intervals, and initial guesses.
        
        Returns:
            Dict[str, Dict[str, Any]]: Dictionary mapping function names to
                their properties including expression, derivative, interval,
                initial guess, and description.
        """
        return {
            'x³ - x - 1 = 0': {
                'expression': 'x**3 - x - 1',
                'derivative': '3*x**2 - 1',
                'interval': (1.0, 2.0),
                'guess': 1.5,
                'description': 'Cubic polynomial (plastic number root ≈ 1.3247)'
            },
            'x² - 4 = 0': {
                'expression': 'x**2 - 4',
                'derivative': '2*x',
                'interval': (1.0, 3.0),
                'guess': 2.5,
                'description': 'Simple quadratic (roots at ±2)'
            },
            'e^x - 2x - 1 = 0': {
                'expression': 'math.exp(x) - 2*x - 1',
                'derivative': 'math.exp(x) - 2',
                'interval': (0.0, 2.0),
                'guess': 1.0,
                'description': 'Exponential equation'
            },
            'sin(x) - x/2 = 0': {
                'expression': 'math.sin(x) - x/2',
                'derivative': 'math.cos(x) - 0.5',
                'interval': (0.0, 2.0),
                'guess': 1.0,
                'description': 'Trigonometric equation'
            },
            'ln(x) - 1/x = 0': {
                'expression': 'math.log(x) - 1/x if x > 0 else float("inf")',
                'derivative': '1/x + 1/(x**2) if x > 0 else float("inf")',
                'interval': (1.0, 3.0),
                'guess': 2.0,
                'description': 'Logarithmic equation (x > 0)'
            },
            'x³ - 6x² + 11x - 6 = 0': {
                'expression': 'x**3 - 6*x**2 + 11*x - 6',
                'derivative': '3*x**2 - 12*x + 11',
                'interval': (0.5, 1.5),
                'guess': 1.0,
                'description': 'Cubic with multiple roots (1, 2, 3)'
            }
        }
    
    def create_header(self):
        """Create the application header with professional design."""
        # Main header frame with gradient-like effect
        header_frame = tk.Frame(self.root, bg='#2c3e50', height=100)
        header_frame.pack(fill='x', padx=0, pady=0)
        header_frame.pack_propagate(False)
        
        # Header content container
        header_content = tk.Frame(header_frame, bg='#2c3e50')
        header_content.pack(expand=True, fill='both')
        
        # Main title with enhanced styling
        title_label = tk.Label(header_content, text="Solution of Non-linear Equations",
                              font=('Segoe UI', 22, 'bold'), fg='#ffffff', bg='#2c3e50')
        title_label.pack(pady=(15, 5))
        
        # Subtitle with professional appearance
        subtitle_label = tk.Label(header_content, text="Advanced Numerical Methods Implementation",
                                 font=('Segoe UI', 12), fg='#bdc3c7', bg='#2c3e50')
        subtitle_label.pack(pady=(0, 5))
        
        # Team badge with accent color
        team_label = tk.Label(header_content, text="Team: The Epsilon Chasers",
                             font=('Segoe UI', 11, 'bold'), fg='#3498db', bg='#2c3e50')
        team_label.pack(pady=(0, 5))
        
        # Current function indicator with better styling
        self.current_func_label = tk.Label(header_content, text="Current: No function selected",
                                          font=('Segoe UI', 10), fg='#95a5a6', bg='#2c3e50')
        self.current_func_label.pack(pady=(0, 10))
        
    def create_main_interface(self):
        """Create the main interface with responsive design."""
        self.root.configure(bg=self.colors['background'])
        
        # Main frame with responsive configuration
        main_frame = tk.Frame(self.root, bg=self.colors['background'])
        main_frame.pack(fill='both', expand=True, padx=5, pady=5)
        
        # Configure responsive grid weights
        main_frame.grid_rowconfigure(0, weight=1)
        main_frame.grid_columnconfigure(0, weight=1)
        
        # Create notebook for tabs with responsive styling
        self.notebook = ttk.Notebook(main_frame)
        self.notebook.pack(fill='both', expand=True)
        
        # Enable tab navigation with keyboard
        self.notebook.bind('<Button-1>', self.on_tab_changed)
        
        # Create tabs
        self.create_solver_tab()
        self.create_comparison_tab()
        self.create_utilities_tab()
        self.create_team_info_tab()
        
    def on_tab_changed(self, event=None):
        """Handle tab change events for responsive updates."""
        # Update responsive elements when switching tabs
        if hasattr(self, 'update_responsive_elements'):
            current_width = self.root.winfo_width()
            current_height = self.root.winfo_height()
            self.update_responsive_elements(current_width, current_height)
    
    def create_solver_tab(self):
        """Create the equation solver tab with professional design."""
        solver_frame = ttk.Frame(self.notebook)
        self.notebook.add(solver_frame, text="🔍 Equation Solver")
        
        # Create hero section with responsive height
        hero_height = getattr(self, 'responsive_settings', {}).get('hero_height', 80)
        hero_section = tk.Frame(solver_frame, bg='#3498db', height=hero_height)
        hero_section.pack(fill='x', pady=0)
        hero_section.pack_propagate(False)
        
        # Responsive title font size
        title_size = getattr(self, 'responsive_settings', {}).get('title_font_size', 20)
        hero_title = tk.Label(hero_section, text="🔍 Numerical Methods Equation Solver",
                             font=('Segoe UI', title_size, 'bold'), fg='#ffffff', bg='#3498db')
        hero_title.pack(pady=(hero_height//4, hero_height//4))
        
        # Main content with professional styling
        main_content = tk.Frame(solver_frame, bg='#f8f9fa')
        main_content.pack(fill='both', expand=True)
        
        # Create paned window with modern styling
        paned = ttk.PanedWindow(main_content, orient='horizontal')
        paned.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Left panel for inputs with card design
        left_panel = tk.Frame(paned, bg='#ffffff', relief='raised', bd=2)
        paned.add(left_panel, weight=1)
        
        # Left panel header
        left_header = tk.Frame(left_panel, bg='#3498db', height=40)
        left_header.pack(fill='x')
        left_header.pack_propagate(False)
        
        left_title = tk.Label(left_header, text="⚙️ Configuration Panel",
                             font=('Segoe UI', 14, 'bold'), fg='#ffffff', bg='#3498db')
        left_title.pack(pady=10)
        
        # Scrollable content for left panel with proper scaling
        canvas = tk.Canvas(left_panel, bg='#ffffff', highlightthickness=0)
        scrollbar = ttk.Scrollbar(left_panel, orient="vertical", command=canvas.yview)
        scrollable_frame = tk.Frame(canvas, bg='#ffffff')
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        # Add mouse wheel scrolling support
        def _on_mousewheel(event):
            canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")
        
        canvas.bind("<MouseWheel>", _on_mousewheel)
        
        canvas.pack(side="left", fill="both", expand=True, padx=15, pady=15)
        scrollbar.pack(side="right", fill="y")
        
        # Use scrollable_frame as the content container
        left_content = scrollable_frame
        
        # Function selection card
        func_card = self.create_solver_card(left_content, "📝 Function Selection", '#27ae60')
        
        help_label = tk.Label(func_card, text="💡 Choose a predefined function or enter a custom one below", 
                             font=('Segoe UI', 9), fg='#85929e', bg='#ffffff')
        help_label.pack(anchor='w', pady=(0,10))
        
        self.func_var = tk.StringVar()
        self.func_combo = ttk.Combobox(func_card, textvariable=self.func_var, 
                                      values=list(self.predefined_functions.keys()),
                                      state='readonly', width=40, font=('Segoe UI', 10, 'bold'))
        self.func_combo.pack(pady=5, fill='x')
        self.func_combo.bind('<<ComboboxSelected>>', self.on_function_selected)
        
        # Custom function inputs
        custom_label = tk.Label(func_card, text="Or enter custom f(x):", 
                               font=('Segoe UI', 10, 'bold'), fg='#2c3e50', bg='#ffffff')
        custom_label.pack(anchor='w', pady=(15,5))
        
        self.custom_func_var = tk.StringVar()
        self.custom_func_entry = tk.Entry(func_card, textvariable=self.custom_func_var, 
                                         font=('Segoe UI', 10, 'bold'), relief='solid', bd=2,
                                         bg='#ffffff', fg='#2c3e50', insertbackground='#2c3e50')
        self.custom_func_entry.pack(fill='x', pady=2)
        
        deriv_label = tk.Label(func_card, text="Derivative f'(x) (for Newton-Raphson):", 
                              font=('Segoe UI', 10, 'bold'), fg='#2c3e50', bg='#ffffff')
        deriv_label.pack(anchor='w', pady=(10,5))
        
        self.custom_deriv_var = tk.StringVar()
        self.custom_deriv_entry = tk.Entry(func_card, textvariable=self.custom_deriv_var, 
                                          font=('Segoe UI', 10, 'bold'), relief='solid', bd=2,
                                          bg='#ffffff', fg='#2c3e50', insertbackground='#2c3e50')
        self.custom_deriv_entry.pack(fill='x', pady=2)
        
        clear_custom_btn = tk.Button(func_card, text="🗑️ Clear Custom Input", 
                                    command=self.clear_custom_input,
                                    bg='#f39c12', fg='#ffffff', font=('Segoe UI', 10, 'bold'),
                                    relief='flat', cursor='hand2')
        clear_custom_btn.pack(pady=(10,0))
        
        # Method selection card
        method_card = self.create_solver_card(left_content, "⚙️ Numerical Method", '#9b59b6')
        
        method_help = tk.Label(method_card, 
                              text="💡 Bracketing methods (Bisection, False Position) require interval with sign change", 
                              font=('Segoe UI', 9, 'bold'), fg='#5d6d7e', bg='#ffffff', wraplength=320)
        method_help.pack(anchor='w', pady=(0,15))
        
        self.method_var = tk.StringVar(value="Bisection")
        methods = ["Bisection", "False Position", "Newton-Raphson", "Secant", "Fixed Point", "Muller"]
        
        # Create styled radio buttons in two columns for better visibility
        methods_container = tk.Frame(method_card, bg='#ffffff')
        methods_container.pack(fill='x', pady=5)
        
        # Create left and right columns
        left_col = tk.Frame(methods_container, bg='#ffffff')
        left_col.pack(side='left', fill='both', expand=True)
        
        right_col = tk.Frame(methods_container, bg='#ffffff')
        right_col.pack(side='left', fill='both', expand=True)
        
        # Add methods to columns
        for i, method in enumerate(methods):
            if i % 2 == 0:
                parent = left_col
            else:
                parent = right_col
                
            radio_btn = tk.Radiobutton(parent, text=method, variable=self.method_var, value=method,
                                      font=('Segoe UI', 11, 'bold'), bg='#ffffff', fg='#2c3e50',
                                      selectcolor='#3498db', activebackground='#ecf0f1',
                                      activeforeground='#2c3e50', anchor='w')
            radio_btn.pack(anchor='w', pady=2, padx=5)
        
        # Parameters card
        params_card = self.create_solver_card(left_content, "🔧 Parameters", '#e74c3c')
        
        # Create parameter inputs with modern styling
        params_grid = tk.Frame(params_card, bg='#ffffff')
        params_grid.pack(fill='x', pady=5)
        
        # Interval
        interval_label = tk.Label(params_grid, text="Interval [a, b]:", 
                                 font=('Segoe UI', 10, 'bold'), fg='#2c3e50', bg='#ffffff')
        interval_label.grid(row=0, column=0, sticky='w', pady=5, padx=(0,10))
        
        interval_frame = tk.Frame(params_grid, bg='#ffffff')
        interval_frame.grid(row=0, column=1, sticky='w', pady=5)
        
        self.a_var = tk.StringVar(value="1.0")
        self.b_var = tk.StringVar(value="2.0")
        
        a_entry = tk.Entry(interval_frame, textvariable=self.a_var, width=8,
                          font=('Segoe UI', 10, 'bold'), relief='solid', bd=2,
                          bg='#ffffff', fg='#2c3e50', insertbackground='#2c3e50')
        a_entry.pack(side='left', padx=2)
        
        to_label = tk.Label(interval_frame, text="to", 
                           font=('Segoe UI', 10), fg='#5d6d7e', bg='#ffffff')
        to_label.pack(side='left', padx=5)
        
        b_entry = tk.Entry(interval_frame, textvariable=self.b_var, width=8,
                          font=('Segoe UI', 10, 'bold'), relief='solid', bd=2,
                          bg='#ffffff', fg='#2c3e50', insertbackground='#2c3e50')
        b_entry.pack(side='left', padx=2)
        
        # Initial guess
        guess_label = tk.Label(params_grid, text="Initial guess:", 
                              font=('Segoe UI', 10, 'bold'), fg='#2c3e50', bg='#ffffff')
        guess_label.grid(row=1, column=0, sticky='w', pady=5, padx=(0,10))
        
        self.guess_var = tk.StringVar(value="1.5")
        guess_entry = tk.Entry(params_grid, textvariable=self.guess_var, width=12,
                              font=('Segoe UI', 10, 'bold'), relief='solid', bd=2,
                              bg='#ffffff', fg='#2c3e50', insertbackground='#2c3e50')
        guess_entry.grid(row=1, column=1, sticky='w', pady=5)
        
        # Tolerance
        tol_label = tk.Label(params_grid, text="Tolerance:", 
                            font=('Segoe UI', 10, 'bold'), fg='#2c3e50', bg='#ffffff')
        tol_label.grid(row=2, column=0, sticky='w', pady=5, padx=(0,10))
        
        self.tol_var = tk.StringVar(value="1e-6")
        tol_entry = tk.Entry(params_grid, textvariable=self.tol_var, width=12,
                            font=('Segoe UI', 10, 'bold'), relief='solid', bd=2,
                            bg='#ffffff', fg='#2c3e50', insertbackground='#2c3e50')
        tol_entry.grid(row=2, column=1, sticky='w', pady=5)
        
        # Max iterations
        iter_label = tk.Label(params_grid, text="Max iterations:", 
                             font=('Segoe UI', 10, 'bold'), fg='#2c3e50', bg='#ffffff')
        iter_label.grid(row=3, column=0, sticky='w', pady=5, padx=(0,10))
        
        self.max_iter_var = tk.StringVar(value="100")
        iter_entry = tk.Entry(params_grid, textvariable=self.max_iter_var, width=12,
                             font=('Segoe UI', 10, 'bold'), relief='solid', bd=2,
                             bg='#ffffff', fg='#2c3e50', insertbackground='#2c3e50')
        iter_entry.grid(row=3, column=1, sticky='w', pady=5)
        
        # Control buttons with modern styling
        button_card = self.create_solver_card(left_content, "🚀 Actions", '#1abc9c')
        
        solve_btn = tk.Button(button_card, text="🚀 SOLVE EQUATION", command=self.solve_equation, 
                             bg='#27ae60', fg='#ffffff', font=('Segoe UI', 12, 'bold'), 
                             relief='flat', cursor='hand2', height=2)
        solve_btn.pack(fill='x', pady=5)
        
        plot_btn = tk.Button(button_card, text="📈 Plot Function", command=self.plot_function_only,
                            bg='#3498db', fg='#ffffff', font=('Segoe UI', 10, 'bold'),
                            relief='flat', cursor='hand2')
        plot_btn.pack(fill='x', pady=2)
        
        clear_btn = tk.Button(button_card, text="🗑️ Clear Results", command=self.clear_results,
                             bg='#e74c3c', fg='#ffffff', font=('Segoe UI', 10, 'bold'),
                             relief='flat', cursor='hand2')
        clear_btn.pack(fill='x', pady=2)
        
        # Right panel for results and plots with card design
        right_panel = tk.Frame(paned, bg='#ffffff', relief='raised', bd=2)
        paned.add(right_panel, weight=2)
        
        # Right panel header - Increased size for better visibility
        right_header = tk.Frame(right_panel, bg='#27ae60', height=45)
        right_header.pack(fill='x')
        right_header.pack_propagate(False)
        
        right_title = tk.Label(right_header, text="📊 Results & Visualization",
                              font=('Segoe UI', 14, 'bold'), fg='#ffffff', bg='#27ae60')
        right_title.pack(pady=12)
        
        # Create modern notebook for results
        right_notebook = ttk.Notebook(right_panel)
        right_notebook.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Results tab with professional styling
        results_frame = tk.Frame(right_notebook, bg='#ffffff')
        right_notebook.add(results_frame, text="📊 Results")
        
        self.results_text = scrolledtext.ScrolledText(results_frame, width=60, height=35, 
                                                     font=('Consolas', 10),
                                                     bg='#ffffff',
                                                     fg='#2c3e50',
                                                     insertbackground='#2c3e50',
                                                     selectbackground='#3498db',
                                                     selectforeground='#ffffff',
                                                     relief='solid',
                                                     bd=1)
        self.results_text.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Function Plot tab
        plot_frame = tk.Frame(right_notebook, bg='#ffffff')
        right_notebook.add(plot_frame, text="📈 Function Plot")
        
        self.plot_fig = Figure(figsize=(10, 7), dpi=100, facecolor='white')
        self.plot_canvas = FigureCanvasTkAgg(self.plot_fig, plot_frame)
        self.plot_canvas.get_tk_widget().pack(fill='both', expand=True, padx=5, pady=5)
        
        plot_toolbar = NavigationToolbar2Tk(self.plot_canvas, plot_frame)
        plot_toolbar.update()
        
        # Convergence Plot tab
        conv_frame = tk.Frame(right_notebook, bg='#ffffff')
        right_notebook.add(conv_frame, text="📉 Convergence")
        
        self.conv_fig = Figure(figsize=(10, 7), dpi=100, facecolor='white')
        self.conv_canvas = FigureCanvasTkAgg(self.conv_fig, conv_frame)
        self.conv_canvas.get_tk_widget().pack(fill='both', expand=True, padx=5, pady=5)
        
        conv_toolbar = NavigationToolbar2Tk(self.conv_canvas, conv_frame)
        conv_toolbar.update()
    
    def create_solver_card(self, parent, title, color):
        """Create a professional card for solver components."""
        card_frame = tk.Frame(parent, bg='#ffffff', relief='raised', bd=1)
        card_frame.pack(fill='x', pady=(0, 15))
        
        # Card header
        header = tk.Frame(card_frame, bg=color, height=35)
        header.pack(fill='x')
        header.pack_propagate(False)
        
        title_label = tk.Label(header, text=title, font=('Segoe UI', 12, 'bold'),
                             fg='#ffffff', bg=color)
        title_label.pack(pady=8)
        
        # Card content
        content = tk.Frame(card_frame, bg='#ffffff')
        content.pack(fill='both', expand=True, padx=15, pady=15)
        
        return content
    
    def create_comparison_tab(self):
        """Create the method comparison tab with professional design."""
        comp_frame = ttk.Frame(self.notebook)
        self.notebook.add(comp_frame, text="📊 Method Comparison")
        
        # Create hero section
        hero_section = tk.Frame(comp_frame, bg='#27ae60', height=80)
        hero_section.pack(fill='x', pady=0)
        hero_section.pack_propagate(False)
        
        hero_title = tk.Label(hero_section, text="📊 Advanced Method Comparison & Analysis",
                             font=('Segoe UI', 20, 'bold'), fg='#ffffff', bg='#27ae60')
        hero_title.pack(pady=25)
        
        # Main content with professional styling
        main_content = tk.Frame(comp_frame, bg='#f8f9fa')
        main_content.pack(fill='both', expand=True)
        
        # Top controls
        control_frame = ttk.LabelFrame(comp_frame, text="🔍 Compare All Methods", padding=10)
        control_frame.pack(fill='x', padx=10, pady=10)
        
        # Create tabbed interface for predefined vs custom functions
        input_notebook = ttk.Notebook(control_frame)
        input_notebook.pack(fill='x', pady=5)
        
        # Predefined Functions Tab
        predefined_frame = ttk.Frame(input_notebook)
        input_notebook.add(predefined_frame, text="📋 Predefined Functions")
        
        comp_select_label = ttk.Label(predefined_frame, text="Select function to compare:", style='Body.TLabel')
        comp_select_label.pack(anchor='w', pady=(5, 2))
        self.comp_func_var = tk.StringVar()
        self.comp_func_combo = ttk.Combobox(predefined_frame, textvariable=self.comp_func_var,
                                           values=list(self.predefined_functions.keys()),
                                           state='readonly', width=50)
        self.comp_func_combo.pack(pady=5, anchor='w')
        
        # Custom Function Tab
        custom_frame = ttk.Frame(input_notebook)
        input_notebook.add(custom_frame, text="✏️ Custom Function")
        
        # Custom function input
        comp_func_label = ttk.Label(custom_frame, text="Function f(x) =", style='Body.TLabel')
        comp_func_label.pack(anchor='w', pady=(5, 2))
        self.comp_custom_func_var = tk.StringVar(value="x**3 - x - 1")
        comp_func_entry = ttk.Entry(custom_frame, textvariable=self.comp_custom_func_var, width=50)
        comp_func_entry.pack(pady=2, anchor='w')
        
        # Custom derivative input
        comp_deriv_label = ttk.Label(custom_frame, text="Derivative f'(x) =", style='Body.TLabel')
        comp_deriv_label.pack(anchor='w', pady=(5, 2))
        self.comp_custom_deriv_var = tk.StringVar(value="3*x**2 - 1")
        comp_deriv_entry = ttk.Entry(custom_frame, textvariable=self.comp_custom_deriv_var, width=50)
        comp_deriv_entry.pack(pady=2, anchor='w')
        
        # Parameters for custom function
        params_frame = tk.Frame(custom_frame)
        params_frame.pack(fill='x', pady=5)
        
        interval_label = ttk.Label(params_frame, text="Interval [a, b]:", style='Body.TLabel')
        interval_label.pack(side='left', padx=(0, 5))
        self.comp_a_var = tk.StringVar(value="1.0")
        comp_a_entry = ttk.Entry(params_frame, textvariable=self.comp_a_var, width=8)
        comp_a_entry.pack(side='left', padx=2)
        to_label = ttk.Label(params_frame, text="to", style='Body.TLabel')
        to_label.pack(side='left', padx=2)
        self.comp_b_var = tk.StringVar(value="2.0")
        comp_b_entry = ttk.Entry(params_frame, textvariable=self.comp_b_var, width=8)
        comp_b_entry.pack(side='left', padx=2)
        
        guess_label = ttk.Label(params_frame, text="Initial Guess:", style='Body.TLabel')
        guess_label.pack(side='left', padx=(15, 5))
        self.comp_guess_var = tk.StringVar(value="1.5")
        comp_guess_entry = ttk.Entry(params_frame, textvariable=self.comp_guess_var, width=8)
        comp_guess_entry.pack(side='left', padx=2)
        
        # Compare button (outside the notebook)
        compare_btn = tk.Button(control_frame, text="🔍 COMPARE ALL METHODS", 
                 command=self.compare_all_methods, bg='#27ae60', fg='#ffffff',
                 font=('Segoe UI', 10, 'bold'), relief='flat', cursor='hand2',
                 padx=15, pady=6)
        compare_btn.pack(pady=(10, 5), anchor='w')
        
        # Results table
        table_frame = ttk.LabelFrame(comp_frame, text="📈 Comparison Results", padding=10)
        table_frame.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Create paned window for table and chart
        table_paned = ttk.PanedWindow(table_frame, orient='horizontal')
        table_paned.pack(fill='both', expand=True)
        
        # Left: Results table
        tree_frame = ttk.Frame(table_paned)
        table_paned.add(tree_frame, weight=3)  # Give more space to table
        
        # Create treeview
        columns = ('Method', 'Root', 'Iterations', 'Time (s)', 'Function Evals', 'Status')
        self.comparison_tree = ttk.Treeview(tree_frame, columns=columns, show='headings', height=15)
        
        for col in columns:
            self.comparison_tree.heading(col, text=col)
            self.comparison_tree.column(col, width=120, anchor='center')
        
        # Scrollbars
        v_scrollbar = ttk.Scrollbar(tree_frame, orient='vertical', command=self.comparison_tree.yview)
        self.comparison_tree.configure(yscrollcommand=v_scrollbar.set)
        
        self.comparison_tree.pack(side='left', fill='both', expand=True)
        v_scrollbar.pack(side='right', fill='y')
        
        # Right: Comparison chart
        chart_frame = ttk.Frame(table_paned)
        table_paned.add(chart_frame, weight=2)  # Give less space to chart
        
        self.comparison_fig = Figure(figsize=(10, 7), dpi=100)
        self.comparison_canvas = FigureCanvasTkAgg(self.comparison_fig, chart_frame)
        self.comparison_canvas.get_tk_widget().pack(fill='both', expand=True, padx=5, pady=5)
        
        # Add toolbar for comparison chart
        comp_toolbar = NavigationToolbar2Tk(self.comparison_canvas, chart_frame)
        comp_toolbar.update()
        
    def create_utilities_tab(self):
        """Create the utilities tab."""
        util_frame = ttk.Frame(self.notebook)
        self.notebook.add(util_frame, text="🔧 Utilities")
        
        # Horner's Rule
        horner_frame = ttk.LabelFrame(util_frame, text="📊 Horner's Rule (Polynomial Evaluation)", padding=10)
        horner_frame.pack(fill='x', padx=10, pady=5)
        
        coeffs_label = ttk.Label(horner_frame, text="Coefficients [a_n, a_{n-1}, ..., a_1, a_0]:", style='Body.TLabel')
        coeffs_label.pack(anchor='w')
        self.horner_coeffs_var = tk.StringVar(value="1 0 -1 -1")
        horner_coeffs_entry = ttk.Entry(horner_frame, textvariable=self.horner_coeffs_var, width=40)
        horner_coeffs_entry.pack(pady=2, anchor='w')
        
        eval_frame = tk.Frame(horner_frame, bg=self.colors['background'])
        eval_frame.pack(fill='x', pady=5)
        eval_label = ttk.Label(eval_frame, text="Evaluate at x =", style='Body.TLabel')
        eval_label.pack(side='left')
        self.horner_x_var = tk.StringVar(value="1.5")
        horner_entry = ttk.Entry(eval_frame, textvariable=self.horner_x_var, width=10)
        horner_entry.pack(side='left', padx=5)
        horner_calc_btn = tk.Button(eval_frame, text="📊 Calculate", command=self.calculate_horner,
                 bg='#f39c12', fg='#ffffff', font=('Segoe UI', 10, 'bold'),
                 relief='flat', cursor='hand2', padx=15, pady=5)
        horner_calc_btn.pack(side='left', padx=5)
        
        self.horner_result_var = tk.StringVar()
        horner_result_label = ttk.Label(horner_frame, textvariable=self.horner_result_var, 
                 font=self.fonts['code'], foreground=self.colors['text_primary'])
        horner_result_label.pack(anchor='w', pady=5)
        
        # Polynomial Deflation
        deflation_frame = ttk.LabelFrame(util_frame, text="🔄 Polynomial Deflation", padding=10)
        deflation_frame.pack(fill='x', padx=10, pady=5)
        
        deflation_coeffs_label = ttk.Label(deflation_frame, text="Polynomial coefficients:", style='Body.TLabel')
        deflation_coeffs_label.pack(anchor='w')
        self.deflation_coeffs_var = tk.StringVar(value="1 -6 11 -6")
        deflation_coeffs_entry = ttk.Entry(deflation_frame, textvariable=self.deflation_coeffs_var, width=40)
        deflation_coeffs_entry.pack(pady=2, anchor='w')
        
        def_frame = tk.Frame(deflation_frame, bg=self.colors['background'])
        def_frame.pack(fill='x', pady=5)
        root_label = ttk.Label(def_frame, text="Known root:", style='Body.TLabel')
        root_label.pack(side='left')
        self.deflation_root_var = tk.StringVar(value="1")
        deflation_entry = ttk.Entry(def_frame, textvariable=self.deflation_root_var, width=10)
        deflation_entry.pack(side='left', padx=5)
        deflate_btn = tk.Button(def_frame, text="🔄 Deflate", command=self.calculate_deflation,
                 bg='#9b59b6', fg='#ffffff', font=('Segoe UI', 10, 'bold'),
                 relief='flat', cursor='hand2', padx=15, pady=5)
        deflate_btn.pack(side='left', padx=5)
        
        self.deflation_result_var = tk.StringVar()
        deflation_result_label = ttk.Label(deflation_frame, textvariable=self.deflation_result_var, 
                 font=self.fonts['code'], foreground=self.colors['text_primary'])
        deflation_result_label.pack(anchor='w', pady=5)
        
        # Incremental Search
        search_frame = ttk.LabelFrame(util_frame, text="🔍 Incremental Search", padding=10)
        search_frame.pack(fill='x', padx=10, pady=5)
        
        search_func_label = ttk.Label(search_frame, text="Function:", style='Body.TLabel')
        search_func_label.pack(anchor='w')
        self.search_func_var = tk.StringVar()
        search_func_combo = ttk.Combobox(search_frame, textvariable=self.search_func_var,
                    values=list(self.predefined_functions.keys()),
                    state='readonly', width=40)
        search_func_combo.pack(pady=2, anchor='w')
        
        search_params_frame = tk.Frame(search_frame, bg=self.colors['background'])
        search_params_frame.pack(fill='x', pady=5)
        
        interval_search_label = ttk.Label(search_params_frame, text="Interval:", style='Body.TLabel')
        interval_search_label.pack(side='left')
        self.search_a_var = tk.StringVar(value="0")
        self.search_b_var = tk.StringVar(value="4")
        search_a_entry = ttk.Entry(search_params_frame, textvariable=self.search_a_var, width=8)
        search_a_entry.pack(side='left', padx=2)
        to_search_label = ttk.Label(search_params_frame, text="to", style='Body.TLabel')
        to_search_label.pack(side='left', padx=2)
        search_b_entry = ttk.Entry(search_params_frame, textvariable=self.search_b_var, width=8)
        search_b_entry.pack(side='left', padx=2)
        
        subdivisions_label = ttk.Label(search_params_frame, text="Subdivisions:", style='Body.TLabel')
        subdivisions_label.pack(side='left', padx=(10,0))
        self.search_subdivisions_var = tk.StringVar(value="1000")
        subdivisions_entry = ttk.Entry(search_params_frame, textvariable=self.search_subdivisions_var, width=8)
        subdivisions_entry.pack(side='left', padx=2)
        
        find_roots_btn = tk.Button(search_params_frame, text="🔍 Find Roots", command=self.perform_incremental_search,
                 bg='#e74c3c', fg='#ffffff', font=('Segoe UI', 10, 'bold'),
                 relief='flat', cursor='hand2', padx=15, pady=5)
        find_roots_btn.pack(side='left', padx=10)
        
        self.search_result_var = tk.StringVar()
        search_result_label = ttk.Label(search_frame, textvariable=self.search_result_var, 
                 font=self.fonts['code'], foreground=self.colors['text_primary'])
        search_result_label.pack(anchor='w', pady=5)
    
    def create_team_info_tab(self):
        """Create the team information tab with professional 3-column design."""
        team_frame = ttk.Frame(self.notebook)
        self.notebook.add(team_frame, text="👥 Team Info")
        
        # Professional color scheme
        team_colors = {
            'hero_bg': '#2c3e50',
            'hero_accent': '#3498db', 
            'card_bg': '#ffffff',
            'accent_blue': '#3498db',
            'accent_green': '#27ae60',
            'accent_orange': '#f39c12',
            'accent_purple': '#9b59b6',
            'accent_red': '#e74c3c',
            'text_dark': '#2c3e50',
            'text_medium': '#5d6d7e',
            'text_light': '#85929e'
        }
        

        
        # Main content container - With scrolling for responsiveness
        canvas_main = tk.Canvas(team_frame, bg='#f8f9fa', highlightthickness=0)
        scrollbar_main = ttk.Scrollbar(team_frame, orient="vertical", command=canvas_main.yview)
        scrollable_main = tk.Frame(canvas_main, bg='#f8f9fa')
        
        scrollable_main.bind(
            "<Configure>",
            lambda e: canvas_main.configure(scrollregion=canvas_main.bbox("all"))
        )
        
        canvas_main.create_window((0, 0), window=scrollable_main, anchor="nw")
        canvas_main.configure(yscrollcommand=scrollbar_main.set)
        
        # Add mouse wheel scrolling support
        def _on_mousewheel_main(event):
            canvas_main.yview_scroll(int(-1 * (event.delta / 120)), "units")
        
        canvas_main.bind("<MouseWheel>", _on_mousewheel_main)
        
        canvas_main.pack(side="left", fill="both", expand=True, padx=20, pady=20)
        scrollbar_main.pack(side="right", fill="y")
        
        # Main container for grid layout
        main_container = scrollable_main

        # Configure main_container grid weights for optimized column distribution
        main_container.grid_columnconfigure(0, weight=2)  # Team Info - larger
        main_container.grid_columnconfigure(1, weight=2)  # Course Info - larger
        main_container.grid_columnconfigure(2, weight=1)  # Project Features - smaller
        main_container.grid_columnconfigure(3, weight=1)  # Technology Stack - smaller
        main_container.grid_rowconfigure(0, weight=1)
        main_container.grid_rowconfigure(1, weight=0)  # Methods row - auto height
        
        # LEFT COLUMN - Team Information (larger width)
        left_column = tk.Frame(main_container, bg='#f8f9fa')
        left_column.grid(row=0, column=0, sticky='nsew', padx=(0, 5), pady=10)
        
        # Team Information Card
        team_card = self.create_professional_card(left_column, "🎓 Team Information", team_colors['accent_blue'])
        
        # Team Leader
        leader_section = tk.Frame(team_card, bg='#e8f4fd', relief='flat', bd=1)
        leader_section.pack(fill='x', pady=(0, 10))
        
        leader_header = tk.Label(leader_section, text="👑 Team Leader",
                               font=('Segoe UI', 12, 'bold'), fg=team_colors['text_dark'], bg='#e8f4fd')
        leader_header.pack(anchor='w', padx=15, pady=(10, 3))
        
        leader_name = tk.Label(leader_section, text="C221012 A.M Asik Ifthaker Hamim",
                             font=('Segoe UI', 11), fg=team_colors['text_medium'], bg='#e8f4fd')
        leader_name.pack(anchor='w', padx=15, pady=(0, 10))
        
        # Team Members
        members_header = tk.Label(team_card, text="👥 Team Members",
                                font=('Segoe UI', 12, 'bold'), fg=team_colors['text_dark'], bg='#ffffff')
        members_header.pack(anchor='w', pady=(5, 8))
        
        members = ["C221022 Adrishikhar Barua", "C221011 Sheikh Mohammad Rajking"]
        for i, member in enumerate(members):
            member_bg = '#f8f9fa' if i % 2 == 0 else '#ffffff'
            member_frame = tk.Frame(team_card, bg=member_bg, relief='flat', bd=1)
            member_frame.pack(fill='x', pady=1)
            
            member_label = tk.Label(member_frame, text=f"• {member}",
                                  font=('Segoe UI', 11), fg=team_colors['text_medium'], bg=member_bg)
            member_label.pack(anchor='w', padx=15, pady=6)
        
        # MIDDLE COLUMN - Course Information (larger width)
        middle_column = tk.Frame(main_container, bg='#f8f9fa')
        middle_column.grid(row=0, column=1, sticky='nsew', padx=5, pady=10)
        
        # Course Information Card
        course_card = self.create_professional_card(middle_column, "📚 Course Information", team_colors['accent_green'])
        
        course_details = [
            ("Course:", "Numerical Methods"),
            ("Institution:", "International Islamic University Chittagong"),
            ("Academic Year:", "2025"),
            ("Project Type:", "Educational Implementation")
        ]
        
        for i, (label, value) in enumerate(course_details):
            detail_bg = '#f8f9fa' if i % 2 == 0 else '#ffffff'
            detail_frame = tk.Frame(course_card, bg=detail_bg)
            detail_frame.pack(fill='x', pady=1)
            
            label_widget = tk.Label(detail_frame, text=label, font=('Segoe UI', 11, 'bold'),
                                  fg=team_colors['text_dark'], bg=detail_bg, width=12, anchor='w')
            label_widget.pack(side='left', padx=(10, 5), pady=6)
            
            value_widget = tk.Label(detail_frame, text=value, font=('Segoe UI', 11),
                                  fg=team_colors['text_medium'], bg=detail_bg, anchor='w')
            value_widget.pack(side='left', padx=(0, 10), pady=6)
        
        # Teacher Information
        teacher_section = tk.Frame(course_card, bg='#e8f5e8', relief='flat', bd=1)
        teacher_section.pack(fill='x', pady=(10, 0))
        
        teacher_header = tk.Label(teacher_section, text="👨‍🏫 Course Teacher",
                                font=('Segoe UI', 12, 'bold'), fg=team_colors['text_dark'], bg='#e8f5e8')
        teacher_header.pack(anchor='w', padx=15, pady=(10, 3))
        
        teacher_name = tk.Label(teacher_section, text="Prof. Mohammed Shamsul Alam",
                              font=('Segoe UI', 11, 'bold'), fg=team_colors['text_dark'], bg='#e8f5e8')
        teacher_name.pack(anchor='w', padx=15, pady=(0, 3))
        
        teacher_quals = tk.Label(teacher_section,
                               text="B.Sc.(Hons), M.Sc. in Electronics & Computer Science (SUST)\nPursuing PhD (SUST), Professor",
                               font=('Segoe UI', 10), fg=team_colors['text_medium'], bg='#e8f5e8', justify='left')
        teacher_quals.pack(anchor='w', padx=15, pady=(0, 10))
        
        # THIRD COLUMN - Project Features (compact)
        third_column = tk.Frame(main_container, bg='#f8f9fa')
        third_column.grid(row=0, column=2, sticky='nsew', padx=3, pady=10)
        
        # Project Features Card
        features_card = self.create_professional_card(third_column, "🚀 Project Features", team_colors['accent_orange'])
        
        features = [
            "🔍 Six Advanced Numerical Methods",
            "📊 Interactive Method Comparison", 
            "📈 Real-time Function Plotting",
            "🔧 Polynomial Utilities",
            "🎯 Custom Function Input Support",
            "📉 Convergence Analysis"
        ]
        
        for i, feature in enumerate(features):
            feature_bg = '#fff7e6' if i % 2 == 0 else '#ffffff'
            feature_frame = tk.Frame(features_card, bg=feature_bg)
            feature_frame.pack(fill='x', pady=1)
            
            feature_label = tk.Label(feature_frame, text=feature, font=('Segoe UI', 11),
                                   fg=team_colors['text_medium'], bg=feature_bg, anchor='w')
            feature_label.pack(anchor='w', padx=10, pady=5)
            
        # FOURTH COLUMN - Technology Stack (compact)
        fourth_column = tk.Frame(main_container, bg='#f8f9fa')
        fourth_column.grid(row=0, column=3, sticky='nsew', padx=(3, 0), pady=10)
        
        # Technology Stack Card
        tech_card = self.create_professional_card(fourth_column, "💻 Technology Stack", team_colors['accent_red'])
        
        technologies = [
            "🐍 Python 3.x",
            "🖼️ Tkinter GUI",
            "📊 Matplotlib",
            "🔢 NumPy",
            "📐 SciPy",
            "🎨 Professional Design"
        ]
        
        for i, tech in enumerate(technologies):
            tech_bg = '#fdf2f2' if i % 2 == 0 else '#ffffff'
            tech_frame = tk.Frame(tech_card, bg=tech_bg)
            tech_frame.pack(fill='x', pady=1)
            
            tech_label = tk.Label(tech_frame, text=tech, font=('Segoe UI', 11),
                                fg=team_colors['text_medium'], bg=tech_bg, anchor='w')
            tech_label.pack(anchor='w', padx=10, pady=5)
        
        # BOTTOM ROW - Methods (spans all 4 columns)
        methods_container = tk.Frame(main_container, bg='#f8f9fa')
        methods_container.grid(row=1, column=0, columnspan=4, sticky='ew', padx=0, pady=(10, 0))
        
        # Methods Card - Full Width
        methods_card = self.create_professional_card(methods_container, "⚙️ Implemented Methods", team_colors['accent_purple'])
        
        # Create 2-column layout for methods
        methods_grid = tk.Frame(methods_card, bg='#ffffff')
        methods_grid.pack(fill='x', pady=5)
        methods_grid.grid_columnconfigure(0, weight=1)
        methods_grid.grid_columnconfigure(1, weight=1)
        
        methods = [
            ("Bisection Method", "Reliable bracketing method with guaranteed convergence"),
            ("False Position Method", "Improved bracketing with faster convergence"),
            ("Newton-Raphson Method", "Quadratic convergence using derivatives"),
            ("Secant Method", "Newton-like method without derivative requirement"),
            ("Fixed Point Method", "Iterative method for specially formatted equations"),
            ("Muller's Method", "Quadratic interpolation for complex roots")
        ]
        
        for i, (method_name, description) in enumerate(methods):
            col = i % 2
            row = i // 2
            
            method_bg = '#f5f3ff' if i % 2 == 0 else '#ffffff'
            method_frame = tk.Frame(methods_grid, bg=method_bg, relief='flat', bd=1)
            method_frame.grid(row=row, column=col, sticky='ew', padx=5, pady=2)
            
            name_label = tk.Label(method_frame, text=f"• {method_name}",
                                font=('Segoe UI', 10, 'bold'), fg=team_colors['text_dark'], bg=method_bg)
            name_label.pack(anchor='w', padx=10, pady=(5, 2))
            
            desc_label = tk.Label(method_frame, text=description, font=('Segoe UI', 9),
                                fg=team_colors['text_medium'], bg=method_bg, wraplength=250, justify='left')
            desc_label.pack(anchor='w', padx=20, pady=(0, 5))
        
        # Footer with professional styling
        footer_section = tk.Frame(team_frame, bg=team_colors['hero_bg'], height=50)
        footer_section.pack(fill='x', side='bottom')
        footer_section.pack_propagate(False)
        
        footer_text = tk.Label(footer_section,
                             text="© 2025 The Epsilon Chasers - International Islamic University Chittagong",
                             font=('Segoe UI', 10), fg='#bdc3c7', bg=team_colors['hero_bg'])
        footer_text.pack(expand=True, pady=15)
    
    def create_professional_card(self, parent, title, header_color):
        """Create a professional card with larger, more prominent header."""
        card = tk.Frame(parent, bg='#ffffff', relief='raised', bd=1)
        card.pack(fill='both', expand=True, pady=(0, 8))
        
        # Card header - increased height and font size for better prominence
        header = tk.Frame(card, bg=header_color, height=35)
        header.pack(fill='x')
        header.pack_propagate(False)
        
        title_label = tk.Label(header, text=title, font=('Segoe UI', 12, 'bold'),
                             fg='#ffffff', bg=header_color)
        title_label.pack(pady=8)
        
        # Card content area
        content = tk.Frame(card, bg='#ffffff')
        content.pack(fill='both', expand=True, padx=10, pady=10)
        
        return content
    
    def create_status_bar(self):
        """Create status bar with professional styling."""
        # Create main status container
        status_container = tk.Frame(self.root, bg='#34495e', height=35)
        status_container.pack(side='bottom', fill='x')
        status_container.pack_propagate(False)
        
        # Status text with enhanced styling
        self.status_var = tk.StringVar(value="🚀 Ready - Select a function and method to solve")
        status_bar = tk.Label(status_container, textvariable=self.status_var, 
                             font=('Segoe UI', 10, 'bold'), fg='#ffffff', bg='#34495e',
                             anchor='w', padx=20)
        status_bar.pack(fill='both', expand=True, pady=7)
        
        # Add a subtle separator line
        separator = tk.Frame(self.root, bg='#bdc3c7', height=1)
        separator.pack(side='bottom', fill='x')
    
    def on_function_selected(self, event=None):
        """Handle function selection."""
        func_name = self.func_var.get()
        if func_name in self.predefined_functions:
            func_info = self.predefined_functions[func_name]
            
            # Update parameters
            self.a_var.set(str(func_info['interval'][0]))
            self.b_var.set(str(func_info['interval'][1]))
            self.guess_var.set(str(func_info['guess']))
            
            # Update header indicator
            self.current_func_label.config(text=f"Current: {func_name}")
            
            self.status_var.set(f"Selected: {func_info['description']}")
    
    def clear_custom_input(self):
        """Clear custom function and derivative input fields."""
        self.custom_func_var.set("")
        self.custom_deriv_var.set("")
        self.func_combo.set("")  # Also clear the predefined selection
        self.current_func_label.config(text="Current: No function selected")
        self.status_var.set("Custom input cleared - ready for new input")
            
    def create_function_from_expression(self, expression: str) -> Optional[Callable[[float], float]]:
        """
        Create a callable function from a string expression.
        
        Safely evaluates a mathematical expression string to create a callable
        function. The expression can use standard math functions and numpy.
        
        Args:
            expression: String representation of the mathematical function
                       (e.g., "x**2 - 4", "math.sin(x) - x/2")
        
        Returns:
            Callable function that takes a float and returns a float,
            or None if the expression is invalid.
            
        Example:
            func = self.create_function_from_expression("x**2 - 4")
            result = func(2.0)  # Returns 0.0
        """
        try:
            # Create lambda function with safe evaluation context
            return lambda x: eval(expression, {"x": x, "math": math, "np": np})
        except (SyntaxError, NameError, TypeError) as e:
            # Return None for invalid expressions
            return None
            
    def get_current_function(self) -> Tuple[Optional[Callable], Optional[Callable], Optional[str]]:
        """
        Get the currently selected or custom function and its derivative.
        
        Retrieves the function that the user has selected either from the
        predefined list or from custom input fields. Also attempts to get
        the corresponding derivative function.
        
        Returns:
            Tuple containing:
                - function: Callable function f(x) or None if invalid
                - derivative: Callable derivative f'(x) or None if not available
                - name: String description of the function or None if no function
                
        Priority:
            1. Custom function entered by user (takes precedence)
            2. Predefined function selected from dropdown
            3. None if no valid function available
        """
        # Check custom function input first (higher priority)
        custom_expr = self.custom_func_var.get().strip()
        if custom_expr:
            func = self.create_function_from_expression(custom_expr)
            if func is None:
                # Invalid custom function syntax
                return None, None, f"Invalid custom function: {custom_expr}"
            
            # Handle custom derivative
            deriv_expr = self.custom_deriv_var.get().strip()
            deriv = None
            if deriv_expr:
                deriv = self.create_function_from_expression(deriv_expr)
                if deriv is None:
                    # Invalid derivative syntax - continue with function but no derivative
                    print(f"Warning: Invalid derivative syntax: {deriv_expr}")
            
            return func, deriv, f"Custom: {custom_expr}"
        
        # Use predefined function if no custom function
        func_name = self.func_var.get()
        if func_name in self.predefined_functions:
            func_info = self.predefined_functions[func_name]
            func = self.create_function_from_expression(func_info['expression'])
            deriv = self.create_function_from_expression(func_info['derivative'])
            return func, deriv, func_name
        
        # No valid function available
        return None, None, None
        
    def plot_function(self, func, func_name, interval=None, root=None, iterations=None):
        """
        Plot the function and highlight the root finding process.
        
        Args:
            func: The function to plot
            func_name: Name of the function for the title
            interval: Interval [a, b] for plotting
            root: Found root to highlight
            iterations: List of iteration points to show convergence
        """
        try:
            self.plot_fig.clear()
            ax = self.plot_fig.add_subplot(111)
            
            # Determine plotting interval
            if interval is None:
                a, b = float(self.a_var.get()), float(self.b_var.get())
                # Extend interval for better visualization
                range_ext = (b - a) * 0.3
                x_min, x_max = a - range_ext, b + range_ext
            else:
                x_min, x_max = interval
            
            # Generate x values for plotting
            x = np.linspace(x_min, x_max, 1000)
            y = []
            
            # Evaluate function safely
            for xi in x:
                try:
                    yi = func(xi)
                    if np.isfinite(yi):
                        y.append(yi)
                    else:
                        y.append(np.nan)
                except:
                    y.append(np.nan)
            
            y = np.array(y)
            
            # Plot function
            ax.plot(x, y, 'b-', linewidth=2, label=f'f(x) = {func_name}')
            ax.axhline(y=0, color='k', linestyle='--', alpha=0.5, label='y = 0')
            ax.grid(True, alpha=0.3)
            
            # Highlight root if found
            if root is not None:
                try:
                    y_root = func(root)
                    ax.plot(root, y_root, 'ro', markersize=10, label=f'Root ≈ {root:.6f}')
                    ax.axvline(x=root, color='r', linestyle=':', alpha=0.7)
                except:
                    pass
            
            # Show iteration points for certain methods
            if iterations is not None and len(iterations) > 0:
                iter_x = [point for point in iterations if x_min <= point <= x_max]
                if len(iter_x) > 0:
                    iter_y = []
                    for xi in iter_x:
                        try:
                            iter_y.append(func(xi))
                        except:
                            iter_y.append(0)
                    ax.plot(iter_x, iter_y, 'go', markersize=4, alpha=0.7, label='Iterations')
            
            ax.set_xlabel('x', fontsize=12)
            ax.set_ylabel('f(x)', fontsize=12)
            ax.set_title(f'Function Plot: {func_name}', fontsize=14, fontweight='bold')
            ax.legend()
            
            # Adjust layout
            self.plot_fig.tight_layout()
            self.plot_canvas.draw()
            
        except Exception as e:
            print(f"Error plotting function: {e}")
    
    def plot_convergence(self, result, method_name):
        """
        Plot convergence analysis showing error reduction over iterations.
        
        Args:
            result: Solver result object containing iteration history
            method_name: Name of the numerical method used
        """
        try:
            self.conv_fig.clear()
            
            if not hasattr(result, 'iteration_history') or len(result.iteration_history) == 0:
                ax = self.conv_fig.add_subplot(111)
                ax.text(0.5, 0.5, 'No convergence data available', 
                       ha='center', va='center', transform=ax.transAxes, fontsize=14)
                self.conv_canvas.draw()
                return
            
            # Extract iteration data from iteration_history
            iteration_history = result.iteration_history
            iter_nums = list(range(1, len(iteration_history) + 1))
            
            # Extract values
            x_values = [iter_data.x_value for iter_data in iteration_history]
            errors = [abs(iter_data.error) for iter_data in iteration_history if iter_data.error is not None]
            func_values = [abs(iter_data.f_value) for iter_data in iteration_history]
            
            # Create subplots
            if len(errors) > 0:
                ax1 = self.conv_fig.add_subplot(211)
                ax2 = self.conv_fig.add_subplot(212)
            else:
                ax1 = self.conv_fig.add_subplot(111)
                ax2 = None
            
            # Plot function values
            ax1.semilogy(iter_nums, func_values, 'b-o', markersize=4, linewidth=2, label='|f(x)|')
            ax1.set_xlabel('Iteration')
            ax1.set_ylabel('|f(x)|')
            ax1.set_title(f'{method_name} - Function Value Convergence')
            ax1.grid(True, alpha=0.3)
            ax1.legend()
            
            # Plot errors if available
            if ax2 is not None and len(errors) > 0:
                error_iters = list(range(2, len(errors) + 2))  # Errors start from 2nd iteration
                ax2.semilogy(error_iters, errors, 'r-s', markersize=4, linewidth=2, label='|Error|')
                ax2.set_xlabel('Iteration')
                ax2.set_ylabel('|Error|')
                ax2.set_title('Error Reduction')
                ax2.grid(True, alpha=0.3)
                ax2.legend()
            
            self.conv_fig.tight_layout()
            self.conv_canvas.draw()
            
        except Exception as e:
            print(f"Error plotting convergence: {e}")

    def plot_function_only(self):
        """Plot the function without solving."""
        try:
            function, derivative, func_name = self.get_current_function()
            if function is None:
                messagebox.showerror("Error", "Please select or enter a valid function!")
                return
            
            # Get plotting interval
            interval = (float(self.a_var.get()), float(self.b_var.get()))
            self.plot_function(function, func_name, interval)
            
            # Clear convergence plot
            self.conv_fig.clear()
            ax = self.conv_fig.add_subplot(111)
            ax.text(0.5, 0.5, 'Solve equation to see convergence analysis', 
                   ha='center', va='center', transform=ax.transAxes, fontsize=12)
            self.conv_canvas.draw()
            
            self.status_var.set("📈 Function plotted successfully")
            
        except Exception as e:
            messagebox.showerror("Error", f"Error plotting function:\n{str(e)}")
            self.status_var.set("❌ Error plotting function")

    def plot_method_comparison(self, comparison_results):
        """
        Create a visual comparison chart of all methods.
        
        Args:
            comparison_results: List of tuples (method_name, result)
        """
        try:
            self.comparison_fig.clear()
            
            if not comparison_results:
                return
            
            # Extract data for plotting
            methods = []
            iterations = []
            times = []
            convergences = []
            
            for method_name, result in comparison_results:
                methods.append(method_name)
                iterations.append(result.iterations if hasattr(result, 'iterations') else 0)
                times.append(result.execution_time if hasattr(result, 'execution_time') else 0)
                convergences.append(1 if result.convergence_achieved else 0)
            
            # Create subplots
            ax1 = self.comparison_fig.add_subplot(221)
            ax2 = self.comparison_fig.add_subplot(222)
            ax3 = self.comparison_fig.add_subplot(223)
            ax4 = self.comparison_fig.add_subplot(224)
            
            # Colors for bars
            colors = ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6', '#34495e']
            
            # Plot 1: Iterations
            bars1 = ax1.bar(methods, iterations, color=colors[:len(methods)])
            ax1.set_title('Iterations to Converge', fontweight='bold', fontsize=10)
            ax1.set_ylabel('Iterations', fontsize=9)
            ax1.tick_params(axis='x', rotation=45, labelsize=8)
            ax1.tick_params(axis='y', labelsize=8)
            
            # Add value labels on bars
            for bar, value in zip(bars1, iterations):
                if value > 0:
                    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5, 
                            str(value), ha='center', va='bottom', fontsize=7)
            
            # Plot 2: Execution Time
            bars2 = ax2.bar(methods, times, color=colors[:len(methods)])
            ax2.set_title('Execution Time', fontweight='bold', fontsize=10)
            ax2.set_ylabel('Time (seconds)', fontsize=9)
            ax2.tick_params(axis='x', rotation=45, labelsize=8)
            ax2.tick_params(axis='y', labelsize=8)
            
            # Add value labels on bars
            for bar, value in zip(bars2, times):
                if value > 0:
                    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + value*0.01, 
                            f'{value:.4f}', ha='center', va='bottom', fontsize=7)
            
            # Plot 3: Convergence Success Rate
            bars3 = ax3.bar(methods, convergences, color=colors[:len(methods)])
            ax3.set_title('Convergence Success', fontweight='bold', fontsize=10)
            ax3.set_ylabel('Success (1=Yes, 0=No)', fontsize=9)
            ax3.set_ylim(0, 1.2)
            ax3.tick_params(axis='x', rotation=45, labelsize=8)
            ax3.tick_params(axis='y', labelsize=8)
            
            # Add value labels on bars
            for bar, value in zip(bars3, convergences):
                label = 'Success' if value == 1 else 'Failed'
                ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05, 
                        label, ha='center', va='bottom', fontsize=7)
            
            # Plot 4: Method Performance Score (lower is better)
            scores = []
            for i, (method_name, result) in enumerate(comparison_results):
                if result.convergence_achieved:
                    # Score based on iterations and time (normalized)
                    iter_score = iterations[i] / max(iterations) if max(iterations) > 0 else 0
                    time_score = times[i] / max(times) if max(times) > 0 else 0
                    score = (iter_score + time_score) / 2
                else:
                    score = 1.0  # Worst score for non-convergent methods
                scores.append(score)
            
            bars4 = ax4.bar(methods, scores, color=colors[:len(methods)])
            ax4.set_title('Performance Score (Lower = Better)', fontweight='bold', fontsize=10)
            ax4.set_ylabel('Score', fontsize=9)
            ax4.set_ylim(0, 1.2)
            ax4.tick_params(axis='x', rotation=45, labelsize=8)
            ax4.tick_params(axis='y', labelsize=8)
            
            # Add value labels on bars
            for bar, value in zip(bars4, scores):
                ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05, 
                        f'{value:.3f}', ha='center', va='bottom', fontsize=8)
            
            self.comparison_fig.suptitle('Method Comparison Analysis', fontsize=12, fontweight='bold')
            self.comparison_fig.tight_layout(rect=[0, 0.03, 1, 0.92])  # Adjust layout with title spacing
            self.comparison_canvas.draw()
            
        except Exception as e:
            print(f"Error creating comparison chart: {e}")

    def solve_equation(self):
        """Solve the equation with selected method."""
        try:
            # Get function
            function, derivative, func_name = self.get_current_function()
            if function is None:
                messagebox.showerror("Error", "Please select or enter a valid function!")
                return
            
            # Get parameters
            method = self.method_var.get()
            tolerance = float(self.tol_var.get())
            max_iterations = int(self.max_iter_var.get())
            
            self.status_var.set(f"Solving with {method} method...")
            self.root.update()
            
            # Create solver
            if method == "Bisection":
                a, b = float(self.a_var.get()), float(self.b_var.get())
                if function(a) * function(b) > 0:
                    messagebox.showerror("Error", f"Function values at endpoints must have opposite signs!\nf({a}) = {function(a):.4f}, f({b}) = {function(b):.4f}")
                    return
                solver = BisectionSolver(function, a, b, tolerance, max_iterations)
                
            elif method == "False Position":
                a, b = float(self.a_var.get()), float(self.b_var.get())
                if function(a) * function(b) > 0:
                    messagebox.showerror("Error", f"Function values at endpoints must have opposite signs!\nf({a}) = {function(a):.4f}, f({b}) = {function(b):.4f}")
                    return
                solver = FalsePositionSolver(function, a, b, tolerance, max_iterations)
                
            elif method == "Newton-Raphson":
                if derivative is None:
                    messagebox.showerror("Error", "Newton-Raphson method requires derivative!\nPlease enter the derivative or use a predefined function.")
                    return
                x0 = float(self.guess_var.get())
                solver = NewtonRaphsonSolver(function, derivative, x0, tolerance, max_iterations)
                
            elif method == "Secant":
                x0, x1 = float(self.a_var.get()), float(self.b_var.get())
                solver = SecantSolver(function, x0, x1, tolerance, max_iterations)
                
            elif method == "Fixed Point":
                x0 = float(self.guess_var.get())
                g_function = lambda x: x - 0.1 * function(x)
                solver = FixedPointSolver(g_function, x0, tolerance, max_iterations)
                
            elif method == "Muller":
                a, b = float(self.a_var.get()), float(self.b_var.get())
                mid = (a + b) / 2
                solver = MullerSolver(function, a, mid, b, tolerance, max_iterations)
            
            # Solve
            result = solver.solve()
            self.display_result(result, function, func_name, method)
            self.status_var.set(f"✅ Solution found using {method} method")
            
        except Exception as e:
            messagebox.showerror("Error", f"Error solving equation:\n{str(e)}")
            self.status_var.set("❌ Error occurred")
            
    def display_result(self, result, function, func_name, method):
        """Display the solution result with improved formatting and colors."""
        self.results_text.delete(1.0, tk.END)
        
        # Configure text tags for colored output
        self.results_text.tag_configure("header", foreground=self.colors['primary'], font=self.fonts['subheading'])
        self.results_text.tag_configure("success", foreground=self.colors['success'], font=self.fonts['body'])
        self.results_text.tag_configure("error", foreground=self.colors['danger'], font=self.fonts['body'])
        self.results_text.tag_configure("info", foreground=self.colors['secondary'], font=self.fonts['body'])
        self.results_text.tag_configure("normal", foreground=self.colors['text_primary'], font=self.fonts['code'])
        self.results_text.tag_configure("emphasis", foreground=self.colors['text_primary'], font=self.fonts['subheading'])
        
        # Header
        self.results_text.insert(tk.END, "═" * 70 + "\n", "header")
        self.results_text.insert(tk.END, "  SOLUTION RESULTS\n", "header")
        self.results_text.insert(tk.END, "═" * 70 + "\n\n", "header")
        
        # Function and method info
        self.results_text.insert(tk.END, "📝 Function: ", "emphasis")
        self.results_text.insert(tk.END, f"{func_name}\n", "info")
        self.results_text.insert(tk.END, "⚙️  Method: ", "emphasis")
        self.results_text.insert(tk.END, f"{method}\n", "info")
        self.results_text.insert(tk.END, "═" * 70 + "\n\n", "header")
        
        # Display root
        self.results_text.insert(tk.END, "🎯 Root: ", "emphasis")
        if hasattr(result.root, 'real'):
            if abs(result.root.imag) < 1e-10:
                self.results_text.insert(tk.END, f"{result.root.real:.10f}\n", "success")
                verification = function(result.root.real)
            else:
                self.results_text.insert(tk.END, f"{result.root.real:.10f} + {result.root.imag:.10f}i\n", "success")
                verification = "Complex root"
        else:
            self.results_text.insert(tk.END, f"{result.root:.10f}\n", "success")
            verification = function(result.root)
        
        # Display metrics
        self.results_text.insert(tk.END, "🔄 Iterations: ", "emphasis")
        self.results_text.insert(tk.END, f"{result.iterations}\n", "normal")
        
        self.results_text.insert(tk.END, "✅ Convergence: ", "emphasis")
        convergence_text = "Yes" if result.convergence_achieved else "No"
        convergence_tag = "success" if result.convergence_achieved else "error"
        self.results_text.insert(tk.END, f"{convergence_text}\n", convergence_tag)
        
        self.results_text.insert(tk.END, "📏 Final Error: ", "emphasis")
        self.results_text.insert(tk.END, f"{result.final_error:.2e}\n", "normal")
        
        self.results_text.insert(tk.END, "⏱️  Execution Time: ", "emphasis")
        self.results_text.insert(tk.END, f"{result.execution_time:.6f} seconds\n", "normal")
        
        self.results_text.insert(tk.END, "🔢 Function Evaluations: ", "emphasis")
        self.results_text.insert(tk.END, f"{result.function_evaluations}\n", "normal")
        
        if isinstance(verification, (int, float)):
            self.results_text.insert(tk.END, "✓ Verification f(root): ", "emphasis")
            verification_tag = "success" if abs(verification) < 1e-6 else "error"
            self.results_text.insert(tk.END, f"{verification:.2e}\n", verification_tag)
        
        # Show complete iteration history in a visual table
        if hasattr(result, 'iteration_history') and result.iteration_history:
            self.results_text.insert(tk.END, "\n" + "═" * 70 + "\n", "header")
            self.results_text.insert(tk.END, "  ITERATION HISTORY (Complete)\n", "header")
            self.results_text.insert(tk.END, "═" * 70 + "\n", "header")
            
            # Create a frame to hold the iteration table
            table_frame = tk.Frame(self.results_text.master, bg='#ffffff', relief='solid', bd=1)
            self.results_text.window_create(tk.END, window=table_frame)
            
            # Create Treeview for iteration history
            columns = ('Iteration', 'x Value', 'f(x)', 'Error')
            iteration_tree = ttk.Treeview(table_frame, columns=columns, show='headings', height=min(15, len(result.iteration_history)))
            
            # Configure column headings and widths
            iteration_tree.heading('Iteration', text='Iteration')
            iteration_tree.heading('x Value', text='x Value')
            iteration_tree.heading('f(x)', text='f(x)')
            iteration_tree.heading('Error', text='Error')
            
            iteration_tree.column('Iteration', width=80, anchor='center')
            iteration_tree.column('x Value', width=150, anchor='center')
            iteration_tree.column('f(x)', width=150, anchor='center')
            iteration_tree.column('Error', width=120, anchor='center')
            
            # Add scrollbar for iteration table
            iter_scrollbar = ttk.Scrollbar(table_frame, orient='vertical', command=iteration_tree.yview)
            iteration_tree.configure(yscrollcommand=iter_scrollbar.set)
            
            # Pack the table and scrollbar
            iteration_tree.pack(side='left', fill='both', expand=True, padx=5, pady=5)
            iter_scrollbar.pack(side='right', fill='y', pady=5)
            
            # Add all iteration data
            for i, iter_result in enumerate(result.iteration_history):
                error_str = f"{iter_result.error:.6e}" if iter_result.error is not None else "N/A"
                x_str = f"{iter_result.x_value:.10f}"
                f_str = f"{iter_result.f_value:.6e}"
                
                # Alternate row colors for better readability
                tag = 'oddrow' if i % 2 == 1 else 'evenrow'
                iteration_tree.insert('', 'end', values=(i+1, x_str, f_str, error_str), tags=(tag,))
            
            # Configure row colors
            iteration_tree.tag_configure('oddrow', background='#f8f9fa')
            iteration_tree.tag_configure('evenrow', background='#ffffff')
            
            # Add summary after the table
            self.results_text.insert(tk.END, f"\n\n📊 Total Iterations: {len(result.iteration_history)}\n", "info")
        
        # Generate plots
        try:
            # Plot function with root highlighted
            interval = (float(self.a_var.get()), float(self.b_var.get()))
            iterations_x = None
            
            # Extract iteration points for visualization
            if hasattr(result, 'iteration_history') and result.iteration_history:
                iterations_x = [iter_result.x_value for iter_result in result.iteration_history]
            
            self.plot_function(function, func_name, interval, result.root, iterations_x)
            
            # Plot convergence
            self.plot_convergence(result, method)
            
        except Exception as e:
            print(f"Error generating plots: {e}")
        
    def compare_all_methods(self):
        """Compare all methods on selected or custom function."""
        # Clear previous results
        for item in self.comparison_tree.get_children():
            self.comparison_tree.delete(item)
        
        self.status_var.set("🔍 Comparing all methods...")
        self.root.update()
        
        # Determine if using predefined or custom function
        current_tab = self.comp_func_combo.winfo_parent()  # Get the parent to determine active tab
        
        # Check if custom function tab is active by checking if custom variables have values
        custom_func_expr = self.comp_custom_func_var.get().strip()
        predefined_func = self.comp_func_var.get()
        
        if custom_func_expr and len(custom_func_expr) > 0:
            # Use custom function
            try:
                function = self.create_function_from_expression(custom_func_expr)
                if function is None:
                    messagebox.showerror("Error", f"Invalid custom function syntax: {custom_func_expr}")
                    return
                
                derivative_expr = self.comp_custom_deriv_var.get().strip()
                derivative = None
                if derivative_expr:
                    derivative = self.create_function_from_expression(derivative_expr)
                    if derivative is None:
                        messagebox.showwarning("Warning", f"Invalid derivative syntax: {derivative_expr}\nNewton-Raphson method will be skipped.")
                
                # Get custom parameters
                try:
                    a = float(self.comp_a_var.get())
                    b = float(self.comp_b_var.get())
                    x0 = float(self.comp_guess_var.get())
                except ValueError as e:
                    messagebox.showerror("Error", f"Invalid parameter values: {str(e)}")
                    return
                
                func_name = f"Custom: {custom_func_expr}"
                
            except Exception as e:
                messagebox.showerror("Error", f"Error processing custom function: {str(e)}")
                return
                
        elif predefined_func and predefined_func in self.predefined_functions:
            # Use predefined function
            func_info = self.predefined_functions[predefined_func]
            function = self.create_function_from_expression(func_info['expression'])
            derivative = self.create_function_from_expression(func_info['derivative'])
            a, b = func_info['interval']
            x0 = func_info['guess']
            func_name = predefined_func
            
        else:
            messagebox.showerror("Error", "Please select a predefined function or enter a custom function!")
            return
        
        # Define methods - handle case where derivative might be None
        methods = [
            ("Bisection", lambda: BisectionSolver(function, a, b, tolerance=1e-6)),
            ("False Position", lambda: FalsePositionSolver(function, a, b, tolerance=1e-6)),
            ("Secant", lambda: SecantSolver(function, a, b, tolerance=1e-6)),
            ("Fixed Point", lambda: FixedPointSolver(lambda x: x - 0.1 * function(x), x0, tolerance=1e-6)),
            ("Muller", lambda: MullerSolver(function, a, (a+b)/2, b, tolerance=1e-6))
        ]
        
        # Add Newton-Raphson only if derivative is available
        if derivative is not None:
            methods.insert(2, ("Newton-Raphson", lambda: NewtonRaphsonSolver(function, derivative, x0, tolerance=1e-6)))
        
        # Collect results for plotting
        comparison_results = []
        
        for method_name, solver_factory in methods:
            try:
                solver = solver_factory()
                result = solver.solve()
                
                status = "✅ Converged" if result.convergence_achieved else "❌ Failed"
                root_str = f"{result.root:.8f}" if not hasattr(result.root, 'real') else f"{result.root.real:.8f}"
                
                self.comparison_tree.insert('', 'end', values=(
                    method_name, root_str, result.iterations, 
                    f"{result.execution_time:.4f}", result.function_evaluations, status
                ))
                
                # Store result for plotting
                comparison_results.append((method_name, result))
                
            except Exception as e:
                self.comparison_tree.insert('', 'end', values=(
                    method_name, "Error", "", "", "", f"❌ {str(e)[:20]}"
                ))
        
        # Generate comparison chart
        self.plot_method_comparison(comparison_results)
        
        self.status_var.set("✅ Comparison completed")
        
    def calculate_horner(self):
        """Calculate using Horner's Rule."""
        try:
            coeffs = [float(x) for x in self.horner_coeffs_var.get().split()]
            x = float(self.horner_x_var.get())
            
            result = PolynomialUtils.horners_rule(coeffs, x)
            poly_value, deriv_value = PolynomialUtils.horners_rule_with_derivative(coeffs, x)
            
            self.horner_result_var.set(f"✅ f({x}) = {result:.8f}, f'({x}) = {deriv_value:.8f}")
            
        except Exception as e:
            self.horner_result_var.set(f"❌ Error: {str(e)}")
            
    def calculate_deflation(self):
        """Calculate polynomial deflation."""
        try:
            coeffs = [float(x) for x in self.deflation_coeffs_var.get().split()]
            root = float(self.deflation_root_var.get())
            
            deflated = PolynomialUtils.deflate_polynomial(coeffs, root)
            
            self.deflation_result_var.set(f"✅ Original: {coeffs}\n   Deflated: {deflated}")
            
        except Exception as e:
            self.deflation_result_var.set(f"❌ Error: {str(e)}")
            
    def perform_incremental_search(self):
        """Perform incremental search."""
        try:
            func_name = self.search_func_var.get()
            if func_name not in self.predefined_functions:
                messagebox.showerror("Error", "Please select a valid function!")
                return
            
            func_info = self.predefined_functions[func_name]
            function = self.create_function_from_expression(func_info['expression'])
            
            a = float(self.search_a_var.get())
            b = float(self.search_b_var.get())
            subdivisions = int(self.search_subdivisions_var.get())
            
            searcher = IncrementalSearch(function, (a, b), num_subdivisions=subdivisions)
            roots_found = searcher.find_potential_roots()
            
            result_text = f"✅ Search: [{a}, {b}], Subdivisions: {subdivisions}\n"
            result_text += f"   Roots found: {len(roots_found)}\n"
            
            if roots_found:
                result_text += f"   Locations: {[f'{r:.6f}' for r in roots_found]}"
            
            self.search_result_var.set(result_text)
            
        except Exception as e:
            self.search_result_var.set(f"❌ Error: {str(e)}")
            
    def clear_results(self):
        """Clear the results display."""
        self.results_text.delete(1.0, tk.END)
        
        # Clear plots
        try:
            self.plot_fig.clear()
            self.plot_canvas.draw()
            
            self.conv_fig.clear()
            self.conv_canvas.draw()
            
            if hasattr(self, 'comparison_fig'):
                self.comparison_fig.clear()
                self.comparison_canvas.draw()
        except:
            pass
            
        self.status_var.set("🗑️ Results cleared")

def main():
    """Main entry point."""
    root = tk.Tk()
    app = SimpleNumericalMethodsGUI(root)
    
    # Set default function
    app.func_var.set("x³ - x - 1 = 0")
    app.on_function_selected()
    
    root.mainloop()

if __name__ == "__main__":
    main() 