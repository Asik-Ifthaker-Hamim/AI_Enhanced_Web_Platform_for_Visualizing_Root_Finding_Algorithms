# 🧮 Solution of Non-linear Equations - WEB Application

A state-of-the-art educational platform revolutionizing the study of numerical methods through interactive learning and AI assistance. This comprehensive web application seamlessly integrates advanced root-finding algorithms with modern web technologies and artificial intelligence to create an immersive learning experience.

### 🎯 Project Overview

This application stands out by combining:
- **Advanced Numerical Methods**: Implementation of six powerful root-finding algorithms with detailed convergence analysis
- **Interactive Learning**: Real-time visualization, step-by-step solutions, and dynamic method comparisons
- **AI-Powered Assistance**: Integration with Google Gemini AI for personalized learning
- **Comprehensive Education**: Rich learning resources, interactive exercises, and performance tracking
- **Modern Architecture**: Built with React 18, Material-UI, and cutting-edge web technologies

### 🌟 Key Highlights

- **Intelligent Solution Validation**: AI-powered system that provides detailed feedback and scoring
- **Study Buddy AI Chat**: Context-aware mathematical assistant for personalized learning
- **Visual Learning Tools**: Dynamic function plotting and iteration visualization
- **Performance Analytics**: Detailed convergence analysis and method comparison
- **Educational Resources**: Curated collection of textbooks, courses, and research materials

### 🔗 Core Integrations

- **Google Gemini AI**: Powers intelligent features and solution validation
- **Math.js**: Handles complex mathematical computations
- **Chart.js**: Provides sophisticated data visualization
- **Material-UI**: Delivers a polished, responsive interface
- **Vite**: Ensures optimal development and build performance

![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![Material-UI](https://img.shields.io/badge/Material--UI-5.x-blue?logo=mui)
![Vite](https://img.shields.io/badge/Vite-4.x-green?logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
![License](https://img.shields.io/badge/License-MIT-green)
![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-purple?logo=google)

## 👥 Team Information

### 👨‍💻 Development Team - The Epsilon Chasers

#### Team Leader & Lead Developer
**A.M Asik Ifthaker Hamim**
- Student ID: C221012
- Role: Team Leader & Lead Developer
- Professional: Associate AI Engineer, Liberate Labs
- Email: asikifthakerhamim75@gmail.com
- Academic Email: c221012@ugrad.iiuc.ac.bd

#### Team Members
- **Adrishikhar Barua** (C221022)
  - Role: Algorithm Developer
  - Focus: Mathematical algorithm implementation and optimization

- **Sheikh Mohammad Rajking** (C221011)
  - Role: Quality Assurance & Testing
  - Focus: Software testing and quality assurance

### 👨‍🏫 Course Information
- **Course**: Numerical Methods (CSE/MATH)
- **Instructor**: Prof. Mohammed Shamsul Alam
  - B.Sc.(Hons), M.Sc. in Electronics & Computer Science (SUST)
  - Pursuing PhD (SUST)
- **Institution**: International Islamic University Chittagong (IIUC)
- **Department**: Computer Science & Engineering
- **Semester**: Spring 2025

## 🌟 Key Features

### 🔢 Numerical Methods Implementation
- **Six Advanced Methods**:
  - Bisection Method (Linear convergence)
  - Newton-Raphson Method (Quadratic convergence)
  - Secant Method (Superlinear convergence)
  - False Position Method (Linear convergence)
  - Fixed Point Method (Linear convergence)
  - Muller's Method (Quadratic convergence)

### 📊 Interactive Features
- **Dynamic Function Plotting**: Real-time visualization
- **Custom Function Support**: User-defined mathematical expressions
- **Method Comparison Tools**: Side-by-side performance analysis
- **Convergence Analysis**: Detailed iteration tracking
- **Parameter Controls**: Adjustable tolerance and iterations

### 🤖 AI-Powered Features
- **Study Buddy AI Chat**:
  - Powered by Google Gemini AI
  - Personalized learning assistance
  - Context-aware mathematical discussions
  - File and image analysis capabilities
  - Multi-model fallback system for reliability

- **Solution Validation**:
  - AI-powered solution checking
  - Detailed feedback and scoring
  - Multiple validation criteria:
    - Numerical accuracy (30%)
    - Method selection (25%)
    - Mathematical reasoning (20%)
    - Presentation (15%)
    - Understanding (10%)
  - Fallback validation system for reliability

### 📚 Educational Components
- **Comprehensive Learning Center**
  - Detailed method explanations
  - Interactive tutorials
  - Step-by-step walkthroughs
  - Extensive study resources:
    - Recommended textbooks
    - Online courses
    - Research papers
    - Software tools
- **Practice & Assessment**
  - Interactive exercises
  - Self-assessment quizzes
  - Performance tracking
  - Detailed feedback
  - AI-validated solutions

### 🎯 Advanced Capabilities
- **Custom Function Input**: Support for user-defined functions
- **Real-time Error Analysis**: Convergence tracking
- **Performance Metrics**: Execution time and iteration count
- **Method Comparison**: Comparative analysis tools
- **Visualization Tools**: Function plotting and iteration history
- **Incremental Search**: Smart initial interval detection
- **Polynomial Utilities**: Advanced polynomial handling

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Google Gemini API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   gh repo clone Asik-Ifthaker-Hamim/Solution-of-Non-linear-Equations
   cd Solution-of-Non-linear-Equations/numerical-methods-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file
   VITE_GEMINI_API_KEY=your_api_key_here  # Optional for AI features
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   ```
   Open http://localhost:5173 in your browser
   ```

## 💻 Technology Stack

### Frontend Framework
- **React 18.x**: Modern UI development
- **Material-UI 5.x**: Polished component library
- **Vite**: Next-generation frontend tooling

### Mathematical Engine
- **Math.js**: Comprehensive math library
- **Chart.js**: Advanced data visualization
- **Framer Motion**: Smooth animations

### AI Integration
- **Google Gemini**: Advanced AI capabilities
  - Primary Model: gemini-pro
  - Vision Model: gemini-pro-vision
  - Validation Model: gemini-pro

### Development Tools
- **ES6+ JavaScript**: Modern language features
- **ESLint**: Code quality maintenance
- **Git**: Version control
- **npm**: Package management

## 📊 Project Statistics

- **Lines of Code**: 2,500+
- **Components**: 15+
- **Test Cases**: 50+
- **Documentation**: 100%
- **AI Models**: 3
- **Educational Resources**: 100+

## 📁 Project Structure

```
numerical-methods-react/
├── src/
│   ├── components/           # React components
│   │   ├── EquationSolver.jsx       # Main solver interface
│   │   ├── FunctionPlot.jsx         # Plotting functionality
│   │   ├── IterationTable.jsx       # Results display
│   │   ├── LearningCenter.jsx       # Educational content
│   │   ├── MethodComparison.jsx     # Method analysis
│   │   └── StudyBuddyChat.jsx       # AI-powered chat
│   ├── utils/               # Utility functions
│   │   ├── numericalMethods.js      # Core algorithms
│   │   ├── polynomialUtils.js       # Polynomial handling
│   │   ├── incrementalSearch.js     # Search algorithms
│   │   └── geminiService.js         # AI service integration
│   └── data/               # Static data
```

## 🛠️ Development

### Building for Production
```bash
npm run build
```

### Running Tests
```bash
npm test
```

### AI Service Configuration
```bash
# Configure Gemini API key
VITE_GEMINI_API_KEY=your_api_key_here
```

## 📚 Documentation

Detailed documentation is available in the Learning Center section of the application, including:
- Method descriptions and theory
- Implementation details
- Usage guidelines
- Best practices
- AI feature guides

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔒 Security

- Environment variables for API keys
- Client-side data validation
- Secure AI model integration
- Rate limiting on API calls
- Error handling and fallbacks

## 🌟 Future Enhancements

- Additional numerical methods
- Advanced visualization features
- Enhanced AI capabilities
- Mobile application
- Offline support
- Cloud synchronization

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React and Material-UI communities
- Chart.js and Math.js maintainers
- Google Gemini AI team
- All contributors and users
- Our academic advisors and mentors

---

<p align="center">Built with ❤️ by The Epsilon Chasers</p>
