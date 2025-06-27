# 🧮 Solution of Non-linear Equations

A comprehensive, interactive web application for solving non-linear equations using advanced numerical methods. Built with React, Material-UI, and modern web technologies to provide an enhanced educational platform for understanding root-finding algorithms.

![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![Material-UI](https://img.shields.io/badge/Material--UI-5.x-blue?logo=mui)
![Vite](https://img.shields.io/badge/Vite-4.x-green?logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)

## 🌟 Features

### 📱 Interactive Equation Solver
- **Six Numerical Methods**: Bisection, Newton-Raphson, Secant, False Position, Fixed Point, and Muller's methods
- **Real-time Visualization**: Dynamic function plotting with iteration tracking
- **Custom Functions**: Support for both predefined and user-defined mathematical functions
- **Detailed Results**: Complete iteration history with expandable details
- **Parameter Control**: Adjustable tolerance, maximum iterations, and method-specific parameters

### 📊 Method Comparison Center
- **Side-by-Side Analysis**: Compare all methods simultaneously
- **Performance Metrics**: Execution time, iterations, function evaluations, and convergence analysis
- **Interactive Charts**: Bar charts for iterations, timing, and error analysis
- **Custom Function Support**: Compare methods on your own mathematical expressions

### 🔧 Numerical Utilities
- **Incremental Search**: Find intervals containing roots with sign change detection
- **Function Calculator**: Evaluate functions at specific points (coming soon)
- **Derivative Tools**: Automatic derivative calculation helpers (coming soon)

### 📚 Learning Center
- **Comprehensive Tutorials**: Detailed explanations of each numerical method
- **Algorithm Walkthroughs**: Step-by-step algorithm descriptions
- **Pros & Cons Analysis**: When to use each method
- **Interactive Examples**: Practical examples with explanations
- **Quick Reference Guide**: Method selection recommendations

### 👥 Project Information
- **Team Details**: Development team information
- **Course Integration**: Academic course information
- **Technology Stack**: Modern web technologies used
- **Project Statistics**: Development metrics and features

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd numerical-methods-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🧮 Supported Numerical Methods

### 1. Bisection Method
- **Type**: Bracketing method
- **Convergence**: Linear (slow but guaranteed)
- **Requirements**: Function must change sign over interval [a,b]
- **Best for**: Reliable root finding when speed isn't critical

### 2. Newton-Raphson Method
- **Type**: Open method
- **Convergence**: Quadratic (very fast)
- **Requirements**: Function derivative must be available
- **Best for**: Fast convergence when derivative is easily computed

### 3. Secant Method
- **Type**: Open method
- **Convergence**: Super-linear
- **Requirements**: Two initial points
- **Best for**: Fast convergence without derivative computation

### 4. False Position Method (Regula Falsi)
- **Type**: Bracketing method
- **Convergence**: Super-linear
- **Requirements**: Function must change sign over interval [a,b]
- **Best for**: Faster than bisection while maintaining reliability

### 5. Fixed Point Method
- **Type**: Iterative method
- **Convergence**: Linear
- **Requirements**: Equation must be reformulated as x = g(x)
- **Best for**: Special cases where reformulation is natural

### 6. Muller's Method
- **Type**: Interpolation method
- **Convergence**: Super-linear
- **Requirements**: Three initial points
- **Best for**: Finding complex roots and general purpose solving

## 💻 Technology Stack

- **Frontend Framework**: React 18.x with hooks and functional components
- **UI Library**: Material-UI (MUI) 5.x for modern, responsive design
- **Build Tool**: Vite for fast development and optimized builds
- **Mathematical Engine**: Math.js for expression evaluation and computation
- **Charting**: Chart.js with react-chartjs-2 for interactive visualizations
- **Animations**: Framer Motion for smooth, professional animations
- **Language**: Modern JavaScript (ES6+) with modular architecture

## 📁 Project Structure

```
numerical-methods-react/
├── src/
│   ├── components/           # React components
│   │   ├── EquationSolver.jsx       # Main solver interface
│   │   ├── MethodComparison.jsx     # Method comparison tool
│   │   ├── FunctionPlot.jsx         # Interactive function plotting
│   │   ├── IterationTable.jsx       # Iteration history display
│   │   ├── LearningCenter.jsx       # Educational content
│   │   ├── Utilities.jsx            # Numerical utilities
│   │   └── TeamInfo.jsx             # Project information
│   ├── utils/                # Utility functions
│   │   └── numericalMethods.js      # Numerical algorithms
│   ├── App.jsx               # Main application component
│   └── main.jsx              # Application entry point
├── public/                   # Static assets
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```

## 🎓 Educational Features

### Student-Friendly Design
- **Clear Visual Feedback**: Color-coded results and status indicators
- **Progressive Disclosure**: Expandable sections for detailed information
- **Interactive Learning**: Hands-on experimentation with parameters
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Learning Aids
- **Method Comparison**: Side-by-side performance analysis
- **Visual Convergence**: See how iterations approach the root
- **Error Tracking**: Monitor convergence behavior over iterations
- **Algorithm Explanations**: Understand the mathematics behind each method

## 🔧 Customization

### Adding New Functions
Edit `src/utils/numericalMethods.js` to add new predefined functions:

```javascript
export const predefinedFunctions = {
  'Your Function': {
    expression: 'x^2 - 4',
    derivative: '2*x',
    interval: [-3, 3],
    guess: 2,
    description: 'Your description here'
  }
};
```

### Modifying Algorithms
Each numerical method is implemented as a separate function in `src/utils/numericalMethods.js`. You can modify convergence criteria, add new stopping conditions, or implement additional methods.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Math.js**: For robust mathematical expression evaluation
- **Material-UI**: For beautiful, accessible UI components
- **Chart.js**: For interactive and responsive charts
- **React Community**: For excellent documentation and ecosystem
- **Academic Community**: For numerical methods research and education

## 📞 Support

If you encounter any issues or have questions:

1. Check the **Learning Center** tab for method explanations
2. Review this README for setup instructions
3. Open an issue on the repository
4. Contact the development team

---

**Built with ❤️ for students learning numerical methods**

*This project demonstrates modern web development practices while making numerical analysis more accessible and interactive for students.*
