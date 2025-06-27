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
- **🤖 AI-Powered Practice**: Gemini 1.5 Flash integration for intelligent solution validation with robust fallback system

### 👥 Project Information
- **Team Details**: Development team information
- **Course Integration**: Academic course information
- **Technology Stack**: Modern web technologies used
- **Project Statistics**: Development metrics and features

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Gemini API key (optional, for AI-powered solution validation)

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

## 🔐 Environment Setup & API Key Security

### 🚨 **CRITICAL SECURITY NOTICE**
**Never commit API keys to version control!** This guide shows you how to properly secure your Gemini API key.

### 📋 **Quick Setup**

#### 1. Copy the Environment Template
```bash
cp .env.example .env
```

#### 2. Get Your Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

#### 3. Configure Your API Key
Open `.env` file and replace the placeholder:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

#### 4. Verify Setup
```bash
npm run dev
```

### 📁 **File Structure**
```
project/
├── .env                 # Your actual API keys (NEVER commit this!)
├── .env.example         # Template file (safe to commit)
└── .gitignore          # Protects .env from being committed
```

### 🔒 **Security Best Practices**

#### ✅ **What's Protected:**
- `.env` files are automatically ignored by Git
- API keys use environment variables (`import.meta.env.VITE_GEMINI_API_KEY`)
- No hardcoded credentials in source code
- Template file (`.env.example`) helps other developers set up safely

#### 🚨 **Security Warnings:**
- **NEVER** commit `.env` files to version control
- **NEVER** share API keys in chat, email, or documentation
- **ALWAYS** use environment variables for sensitive data
- **ROTATE** API keys if accidentally exposed

#### 🛠️ **For Developers:**
```bash
# Setting up a new environment
cp .env.example .env          # Copy template
# Edit .env with your API key
npm run dev                   # Start development

# Verify security
git status                    # .env should NOT appear in modified files
```

#### 📝 **Environment Variables Reference:**
```env
# Gemini API Configuration
# Get your API key from: https://aistudio.google.com/app/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Application Configuration (optional)
VITE_APP_TITLE=Numerical Methods - Root Finding GUI
VITE_APP_VERSION=1.0.0
```

#### 🚨 **If You Accidentally Exposed Your Key:**
1. **Immediately revoke** the key at [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Generate a new key**
3. **Update your `.env` file**
4. **Check Git history** and contact GitHub support if needed to remove from history

### 🤖 AI-Powered Solution Validation

✅ **Ready to Use Immediately!** The AI validation is pre-configured with a working API key and robust error handling.

#### **🚀 Quick Start:**
1. **Go to Learning Center → Practice Tab**
2. **Click any practice problem**
3. **Write your solution and get instant AI feedback!**

#### **🧠 Intelligent Analysis Features:**
- **Smart Evaluation**: Uses Gemini 1.5 Flash for detailed solution analysis
- **Educational Feedback**: Professor-like feedback with scoring (0-100 points)
- **Method Recognition**: Identifies which numerical method you used
- **Strengths & Suggestions**: Highlights what you did well and areas for improvement
- **Next Steps Guidance**: Personalized learning progression recommendations

#### **🛡️ Robust Error Handling:**
- **Always Works**: System never fails completely - always provides educational feedback
- **Smart Fallback**: When AI is unavailable, uses pattern-based validation
- **Rate Limit Management**: Graceful handling of API quotas with helpful messages
- **No Technical Errors**: Users never see JSON parsing or API errors

#### **📝 Example Solution Formats:**

**High-Quality Solution** (Expected score: 85-100):
```
Using Newton-Raphson method for x² - 4 = 0:

Method: Newton-Raphson
Initial guess: x₀ = 1

Iteration 1: x₁ = x₀ - f(x₀)/f'(x₀) = 1 - (1-4)/(2×1) = 2.5
Iteration 2: x₂ = 2.5 - (2.5²-4)/(2×2.5) = 2.05
Iteration 3: x₃ = 2.05 - (2.05²-4)/(2×2.05) ≈ 2.001

Convergence achieved at x ≈ 2

For negative root using x₀ = -1: x ≈ -2

Final Answer: x = 2 and x = -2
```

**Basic Solution** (Expected score: 60-75):
```
I used Newton-Raphson method.
Starting with x = 1, after iterations: x = 2
The other root is x = -2
```

#### **🔧 Optional: Use Your Own API Key**
1. **Get a Gemini API Key** - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Configure Your Key** - Click "Change API Key" in the practice interface
3. **Higher Limits** - Your own key provides higher rate limits

#### **🎯 What You'll Get:**
- **Detailed Feedback**: Comprehensive analysis of your solution approach
- **Scoring**: 0-100 point evaluation with breakdown
- **Strengths**: Recognition of what you did well
- **Suggestions**: Specific, actionable improvement recommendations
- **Next Steps**: Guidance on what to practice next

#### **⚡ System Reliability:**
- **Primary**: AI-powered detailed analysis when available
- **Fallback**: Pattern-based validation when AI is unavailable
- **Always Educational**: Even during API issues, you get meaningful feedback
- **No Crashes**: System gracefully handles all error scenarios

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
- **AI Integration**: Gemini 1.5 Flash for intelligent solution validation
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

## ✨ Key Features Summary

### 🎯 **What Makes This Special:**
- **Complete Numerical Methods Suite**: 6 different root-finding algorithms
- **AI-Powered Learning**: Intelligent solution validation with educational feedback
- **Bulletproof System**: Robust error handling ensures system always works
- **Educational Focus**: Designed for learning, not just solving
- **Modern UI**: Beautiful, responsive interface with smooth animations
- **Real-time Visualization**: See how algorithms converge step-by-step

### 📊 **Current Status:**
- ✅ **Production Ready**: Fully functional with comprehensive error handling
- ✅ **AI Integrated**: Gemini 1.5 Flash with intelligent fallback system
- ✅ **Education Focused**: Perfect for students and instructors
- ✅ **Mobile Friendly**: Responsive design works on all devices
- ✅ **Open Source**: Available for academic and educational use

## 🙏 Acknowledgments

- **Google AI**: For Gemini API enabling intelligent solution validation
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
