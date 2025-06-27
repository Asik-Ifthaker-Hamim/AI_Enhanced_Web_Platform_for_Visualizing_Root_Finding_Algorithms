import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Button,
  Tab,
  Tabs,
  Link,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  LinearProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  CheckCircle as CheckIcon,
  TipsAndUpdates as TipIcon,
  Warning as WarningIcon,
  MenuBook as BookIcon,
  Code as CodeIcon,
  Assignment as AssignmentIcon,
  VideoLibrary as VideoIcon,
  Link as LinkIcon,
  Download as DownloadIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Functions as FunctionsIcon,
  Calculate as CalculateIcon,
  Timeline as TimelineIcon,
  QuestionAnswer as QAIcon,
  Close as CloseIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  CheckCircleOutline as CorrectIcon,
  Cancel as IncorrectIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`learning-tabpanel-${index}`}
      aria-labelledby={`learning-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const methodsInfo = {
  bisection: {
    name: 'Bisection Method',
    difficulty: 'Beginner',
    color: '#1976d2',
    description: 'A reliable root-finding method that repeatedly divides an interval in half',
    algorithm: [
      'Start with an interval [a, b] where f(a) and f(b) have opposite signs',
      'Calculate the midpoint c = (a + b) / 2',
      'Evaluate f(c)',
      'If f(c) = 0, then c is the root',
      'If f(a) and f(c) have opposite signs, set b = c',
      'Otherwise, set a = c',
      'Repeat until convergence'
    ],
    pros: [
      'Always converges if initial conditions are met',
      'Simple to understand and implement',
      'Robust and stable',
      'Guaranteed to find a root'
    ],
    cons: [
      'Slow convergence (linear)',
      'Requires a bracketing interval',
      'Only finds one root at a time',
      'Cannot find multiple roots or complex roots'
    ],
    useWhen: [
      'You need a guaranteed solution',
      'Function is continuous',
      'You have a bracketing interval',
      'Simplicity is preferred over speed'
    ],
    convergence: 'Linear (slow but steady)',
    example: 'Find root of x³ - x - 1 = 0 in [1, 2]'
  },
  newtonRaphson: {
    name: 'Newton-Raphson Method',
    difficulty: 'Intermediate',
    color: '#f57c00',
    description: 'Fast iterative method using function derivatives for rapid convergence',
    algorithm: [
      'Start with an initial guess x₀',
      'Calculate f(xₙ) and f\'(xₙ)',
      'Update: xₙ₊₁ = xₙ - f(xₙ) / f\'(xₙ)',
      'Check for convergence',
      'Repeat until desired accuracy'
    ],
    pros: [
      'Quadratic convergence (very fast)',
      'Efficient for most functions',
      'Can handle complex roots',
      'Widely applicable'
    ],
    cons: [
      'Requires derivative calculation',
      'May not converge if poor initial guess',
      'Fails when derivative is zero',
      'Sensitive to starting point'
    ],
    useWhen: [
      'Derivative is easily calculated',
      'Good initial guess available',
      'Speed is important',
      'Function is well-behaved near root'
    ],
    convergence: 'Quadratic (very fast)',
    example: 'Newton\'s method for x² - 2 = 0 starting from x₀ = 1'
  },
  secant: {
    name: 'Secant Method',
    difficulty: 'Intermediate',
    color: '#7b1fa2',
    description: 'Newton-like method without derivatives using secant line approximation',
    algorithm: [
      'Start with two initial points x₀ and x₁',
      'Calculate f(x₀) and f(x₁)',
      'Update: x₂ = x₁ - f(x₁) × (x₁ - x₀) / (f(x₁) - f(x₀))',
      'Shift points: x₀ = x₁, x₁ = x₂',
      'Repeat until convergence'
    ],
    pros: [
      'No derivative required',
      'Faster than bisection',
      'Super-linear convergence',
      'Simple to implement'
    ],
    cons: [
      'May not converge',
      'Needs two initial points',
      'Can be unstable',
      'Slower than Newton-Raphson'
    ],
    useWhen: [
      'Derivative is difficult to calculate',
      'Good initial estimates available',
      'Faster convergence needed than bisection',
      'Function evaluations are cheap'
    ],
    convergence: 'Super-linear (fast)',
    example: 'Secant method for cos(x) - x = 0 with x₀ = 0, x₁ = 1'
  }
};

const methodsData = [
  {
    name: 'Bisection Method',
    icon: '⚖️',
    complexity: 'O(log n)',
    convergence: 'Linear',
    reliability: 'Very High',
    description: 'A bracketing method that repeatedly bisects an interval and selects the subinterval where the root exists.',
    theory: 'Based on the Intermediate Value Theorem. If f(a) and f(b) have opposite signs, then f(x) = 0 has at least one solution in [a,b].',
    algorithm: [
      '1. Choose interval [a,b] where f(a)×f(b) < 0',
      '2. Calculate midpoint c = (a+b)/2',
      '3. If f(c) = 0, then c is the root',
      '4. If f(a)×f(c) < 0, set b = c; else set a = c',
      '5. Repeat until |b-a| < tolerance'
    ],
    advantages: ['Always converges', 'Simple to implement', 'Guaranteed to find root'],
    disadvantages: ['Slow convergence', 'Requires initial bracketing', 'Only finds one root'],
    applications: ['Engineering problems', 'Scientific computing', 'Initial approximation for other methods']
  },
  {
    name: 'Newton-Raphson Method',
    icon: '🧮',
    complexity: 'O(n)',
    convergence: 'Quadratic',
    reliability: 'High (with good initial guess)',
    description: 'Uses the derivative to find successively better approximations to the root.',
    theory: 'Based on linear approximation using tangent lines. x₁ = x₀ - f(x₀)/f\'(x₀)',
    algorithm: [
      '1. Choose initial guess x₀',
      '2. Calculate f(x₀) and f\'(x₀)',
      '3. Update: x₁ = x₀ - f(x₀)/f\'(x₀)',
      '4. Set x₀ = x₁',
      '5. Repeat until |f(x₀)| < tolerance'
    ],
    advantages: ['Fast quadratic convergence', 'Widely applicable', 'Efficient for well-behaved functions'],
    disadvantages: ['Requires derivative', 'May not converge', 'Sensitive to initial guess'],
    applications: ['Optimization problems', 'Machine learning', 'Physics simulations']
  },
  {
    name: 'Secant Method',
    icon: '📐',
    complexity: 'O(n)',
    convergence: 'Superlinear',
    reliability: 'Good',
    description: 'Approximates the derivative using secant lines instead of tangent lines.',
    theory: 'Uses finite difference approximation: f\'(x) ≈ [f(x₁)-f(x₀)]/(x₁-x₀)',
    algorithm: [
      '1. Choose two initial points x₀ and x₁',
      '2. Calculate f(x₀) and f(x₁)',
      '3. Update: x₂ = x₁ - f(x₁)×(x₁-x₀)/(f(x₁)-f(x₀))',
      '4. Set x₀ = x₁, x₁ = x₂',
      '5. Repeat until convergence'
    ],
    advantages: ['No derivative needed', 'Good convergence rate', 'Simple implementation'],
    disadvantages: ['Requires two initial points', 'May not converge', 'Division by zero possible'],
    applications: ['Engineering analysis', 'Financial modeling', 'Scientific research']
  },
  {
    name: 'False Position Method',
    icon: '📏',
    complexity: 'O(n)',
    convergence: 'Linear',
    reliability: 'High',
    description: 'Combines bisection reliability with improved convergence using linear interpolation.',
    theory: 'Uses linear interpolation between points with opposite function signs.',
    algorithm: [
      '1. Choose interval [a,b] where f(a)×f(b) < 0',
      '2. Calculate c = a - f(a)×(b-a)/(f(b)-f(a))',
      '3. If f(c) = 0, then c is the root',
      '4. If f(a)×f(c) < 0, set b = c; else set a = c',
      '5. Repeat until convergence'
    ],
    advantages: ['Always converges', 'Better than bisection', 'No derivative needed'],
    disadvantages: ['Slower than Newton-Raphson', 'May converge slowly', 'Requires bracketing'],
    applications: ['Robust numerical solutions', 'Control systems', 'Mathematical modeling']
  },
  {
    name: 'Fixed Point Method',
    icon: '🎯',
    complexity: 'O(n)',
    convergence: 'Linear',
    reliability: 'Moderate',
    description: 'Converts f(x) = 0 to x = g(x) and iterates x₁ = g(x₀).',
    theory: 'Based on fixed point theorem. If |g\'(x)| < 1 near the root, the iteration converges.',
    algorithm: [
      '1. Rewrite f(x) = 0 as x = g(x)',
      '2. Choose initial guess x₀',
      '3. Calculate x₁ = g(x₀)',
      '4. Set x₀ = x₁',
      '5. Repeat until |x₁ - x₀| < tolerance'
    ],
    advantages: ['Simple concept', 'No derivative needed', 'Self-correcting'],
    disadvantages: ['Convergence not guaranteed', 'Sensitive to g(x) form', 'May diverge'],
    applications: ['Iterative processes', 'Economics models', 'Population dynamics']
  },
  {
    name: 'Muller\'s Method',
    icon: '🌐',
    complexity: 'O(n)',
    convergence: 'Quadratic',
    reliability: 'Good',
    description: 'Uses quadratic interpolation through three points to find roots.',
    theory: 'Fits a parabola through three points and finds where it crosses the x-axis.',
    algorithm: [
      '1. Choose three initial points x₀, x₁, x₂',
      '2. Fit quadratic polynomial through points',
      '3. Solve quadratic equation for roots',
      '4. Choose root closest to x₂',
      '5. Update points and repeat'
    ],
    advantages: ['Finds complex roots', 'Good convergence', 'Handles multiple roots'],
    disadvantages: ['Complex implementation', 'Requires three points', 'Computational overhead'],
    applications: ['Polynomial roots', 'Complex analysis', 'Advanced mathematics']
  }
];

const practicalExamples = [
  {
    title: 'Engineering: Bridge Load Analysis',
    equation: 'x³ - 5x² + 6x - 2 = 0',
    context: 'Finding critical load points where structural stress equals material strength.',
    realWorld: 'Used in determining safe weight limits for bridge construction.'
  },
  {
    title: 'Physics: Orbital Mechanics',
    equation: 'x - e×sin(x) - M = 0',
    context: 'Kepler\'s equation for determining satellite positions in elliptical orbits.',
    realWorld: 'Essential for GPS satellite positioning and space mission planning.'
  },
  {
    title: 'Economics: Market Equilibrium',
    equation: 'e^x - 3x - 2 = 0',
    context: 'Finding equilibrium points where supply equals demand.',
    realWorld: 'Used in pricing strategies and market analysis.'
  },
  {
    title: 'Biology: Population Growth',
    equation: 'x×e^(-x) - 0.5 = 0',
    context: 'Logistic growth model for population dynamics with resource constraints.',
    realWorld: 'Predicting population trends and resource planning.'
  },
  {
    title: 'Chemistry: Reaction Kinetics',
    equation: 'ln(x) + x - 3 = 0',
    context: 'Determining reaction rates and equilibrium concentrations.',
    realWorld: 'Optimizing chemical processes and drug development.'
  }
];

const studyResources = [
  {
    category: 'Textbooks',
    icon: <BookIcon />,
    resources: [
      { title: 'Numerical Analysis by Burden & Faires', level: 'Undergraduate', rating: 5 },
      { title: 'Numerical Methods by Chapra & Canale', level: 'Undergraduate', rating: 5 },
      { title: 'An Introduction to Numerical Analysis by Süli & Mayers', level: 'Graduate', rating: 4 },
      { title: 'Numerical Recipes by Press et al.', level: 'All Levels', rating: 4 }
    ]
  },
  {
    category: 'Online Courses',
    icon: <VideoIcon />,
    resources: [
      { title: 'MIT 18.335: Introduction to Numerical Methods', level: 'Graduate', rating: 5 },
      { title: 'Coursera: Numerical Methods for Engineers', level: 'Professional', rating: 4 },
      { title: 'Khan Academy: Calculus & Numerical Analysis', level: 'Beginner', rating: 4 },
      { title: 'edX: Computational Methods in Engineering', level: 'Advanced', rating: 5 }
    ]
  },
  {
    category: 'Research Papers',
    icon: <AssignmentIcon />,
    resources: [
      { title: 'A Survey of Numerical Methods for Nonlinear Equations', level: 'Research', rating: 4 },
      { title: 'Convergence Analysis of Root-Finding Algorithms', level: 'Graduate', rating: 4 },
      { title: 'Modern Approaches to Nonlinear Equation Solving', level: 'Research', rating: 5 },
      { title: 'Computational Complexity of Numerical Methods', level: 'Advanced', rating: 4 }
    ]
  },
  {
    category: 'Software Tools',
    icon: <CodeIcon />,
    resources: [
      { title: 'MATLAB Optimization Toolbox', level: 'Professional', rating: 5 },
      { title: 'Python SciPy Library', level: 'All Levels', rating: 5 },
      { title: 'Mathematica Equation Solver', level: 'Professional', rating: 4 },
      { title: 'GNU Octave (Free Alternative)', level: 'All Levels', rating: 4 }
    ]
  }
];

const interactiveExercises = [
  {
    title: 'Basic Root Finding',
    difficulty: 'Beginner',
    description: 'Practice finding roots of simple polynomials',
    problems: ['x² - 4 = 0', 'x³ - x - 1 = 0', '2x - sin(x) = 0']
  },
  {
    title: 'Method Comparison',
    difficulty: 'Intermediate',
    description: 'Compare convergence rates of different methods',
    problems: ['x³ - 2x - 5 = 0', 'e^x - 3x = 0', 'x·ln(x) - 1 = 0']
  },
  {
    title: 'Advanced Applications',
    difficulty: 'Advanced',
    description: 'Solve real-world engineering problems',
    problems: ['Stress analysis equations', 'Heat transfer problems', 'Fluid dynamics models']
  }
];

const quizQuestions = {
  basic: [
    {
      question: "What is the main principle behind the Bisection Method?",
      options: [
        "Derivative approximation",
        "Intermediate Value Theorem",
        "Linear interpolation", 
        "Fixed point iteration"
      ],
      correct: 1,
      explanation: "The Bisection Method is based on the Intermediate Value Theorem, which states that if a continuous function changes sign over an interval, it must have a root in that interval."
    },
    {
      question: "Which method requires the calculation of derivatives?",
      options: [
        "Bisection Method",
        "Secant Method",
        "Newton-Raphson Method",
        "False Position Method"
      ],
      correct: 2,
      explanation: "Newton-Raphson Method requires both the function value and its derivative at each iteration point."
    },
    {
      question: "What type of convergence does the Bisection Method have?",
      options: [
        "Quadratic",
        "Super-linear",
        "Linear",
        "Exponential"
      ],
      correct: 2,
      explanation: "The Bisection Method has linear convergence, which is slower than quadratic but very reliable."
    }
  ],
  selection: [
    {
      question: "When would you choose the Newton-Raphson method over the Bisection method?",
      options: [
        "When you need guaranteed convergence",
        "When speed is more important than reliability",
        "When working with discontinuous functions",
        "When you don't know the derivative"
      ],
      correct: 1,
      explanation: "Newton-Raphson is chosen when fast convergence is needed and you can compute the derivative easily."
    },
    {
      question: "Which method is best for finding roots when derivatives are difficult to compute?",
      options: [
        "Newton-Raphson Method",
        "Secant Method",
        "Fixed Point Method",
        "Muller's Method"
      ],
      correct: 1,
      explanation: "The Secant Method approximates the derivative using finite differences, making it ideal when derivatives are hard to compute."
    }
  ],
  implementation: [
    {
      question: "In Newton-Raphson method, what happens if f'(x) = 0?",
      options: [
        "The method converges faster",
        "The method fails (division by zero)",
        "The method continues normally",
        "The method switches to bisection"
      ],
      correct: 1,
      explanation: "When f'(x) = 0, the Newton-Raphson method fails because it involves division by the derivative."
    }
  ],
  advanced: [
    {
      question: "What is the convergence order of the Secant Method?",
      options: [
        "Linear (order 1)",
        "Quadratic (order 2)",
        "Golden ratio φ ≈ 1.618",
        "Cubic (order 3)"
      ],
      correct: 2,
      explanation: "The Secant Method has super-linear convergence with order approximately equal to the golden ratio (1.618)."
    }
  ]
};

function QuizModal({ quizType, onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  const questions = quizQuestions[quizType] || [];
  const quizTitles = {
    basic: 'Basic Concepts Quiz',
    selection: 'Method Selection Quiz', 
    implementation: 'Implementation Quiz',
    advanced: 'Advanced Topics Quiz'
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    const newAnswers = [...userAnswers, { 
      question: currentQuestion, 
      selected: selectedAnswer, 
      correct: isCorrect 
    }];
    setUserAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
    setUserAnswers([]);
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{quizTitles[quizType]}</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        {!showResult ? (
          <Box>
            <LinearProgress 
              variant="determinate" 
              value={((currentQuestion + 1) / questions.length) * 100} 
              sx={{ mb: 3 }}
            />
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Question {currentQuestion + 1} of {questions.length}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              {questions[currentQuestion]?.question}
            </Typography>
            
            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={selectedAnswer} onChange={(e) => handleAnswerSelect(parseInt(e.target.value))}>
                {questions[currentQuestion]?.options.map((option, index) => (
                  <FormControlLabel 
                    key={index}
                    value={index} 
                    control={<Radio />} 
                    label={option}
                    sx={{ mb: 1 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        ) : (
          <Box textAlign="center">
            <Typography variant="h4" gutterBottom>
              Quiz Complete! 🎉
            </Typography>
            <Typography variant="h5" color={getScoreColor()} gutterBottom>
              Score: {score}/{questions.length} ({Math.round((score/questions.length)*100)}%)
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              {userAnswers.map((answer, index) => (
                <Box key={index} sx={{ mb: 2, textAlign: 'left' }}>
                  <Paper sx={{ p: 2, bgcolor: answer.correct ? 'success.50' : 'error.50' }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Q{index + 1}:</strong> {questions[index].question}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {answer.correct ? <CorrectIcon color="success" /> : <IncorrectIcon color="error" />}
                      Your answer: {questions[index].options[answer.selected]}
                    </Typography>
                    {!answer.correct && (
                      <Typography variant="body2" color="success.main">
                        Correct answer: {questions[index].options[questions[index].correct]}
                      </Typography>
                    )}
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      {questions[index].explanation}
                    </Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        {!showResult ? (
          <>
            <Button onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleNext} 
              variant="contained" 
              disabled={selectedAnswer === ''}
              endIcon={<NextIcon />}
            >
              {currentQuestion + 1 === questions.length ? 'Finish' : 'Next'}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={resetQuiz} startIcon={<PlayIcon />}>
              Retake Quiz
            </Button>
            <Button onClick={onClose} variant="contained">
              Close
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

function PracticeModal({ exercise, onClose }) {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userSolution, setUserSolution] = useState('');
  const [showHint, setShowHint] = useState(false);

  const practiceProblems = {
    'Basic Root Finding': [
      {
        equation: 'x² - 4 = 0',
        hint: 'This is a simple quadratic equation. Try factoring: (x-2)(x+2) = 0',
        solution: 'x = ±2',
        method: 'Any method works, but try Bisection with interval [-3, 3]'
      },
      {
        equation: 'x³ - x - 1 = 0',
        hint: 'This cubic has one real root. Use numerical methods with initial guess around x = 1.3',
        solution: 'x ≈ 1.3247',
        method: 'Newton-Raphson with x₀ = 1.3 converges quickly'
      }
    ],
    'Method Comparison': [
      {
        equation: 'x³ - 2x - 5 = 0',
        hint: 'Compare convergence rates. Start with interval [2, 3] for bracketing methods',
        solution: 'x ≈ 2.0946',
        method: 'Compare Bisection, Newton-Raphson, and Secant methods'
      }
    ],
    'Advanced Applications': [
      {
        equation: 'Stress Analysis: σ = E×ε - σ₀×sin(πε) = 0',
        hint: 'This represents material stress-strain relationship under cyclic loading',
        solution: 'Depends on material properties E and σ₀',
        method: 'Use Newton-Raphson for engineering precision'
      }
    ]
  };

  const problems = practiceProblems[exercise.title] || [];
  const currentProb = problems[currentProblem];

  return (
    <Dialog open={true} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {exercise.title} - {exercise.difficulty} Level
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Problem {currentProblem + 1}
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontFamily: 'monospace', textAlign: 'center' }}>
                    {currentProb?.equation || 'No problem available'}
                  </Typography>
                </Paper>
                
                <Typography variant="body2" paragraph>
                  <strong>Task:</strong> Find the root(s) of this equation using numerical methods.
                </Typography>

                <Button 
                  variant="outlined" 
                  onClick={() => setShowHint(!showHint)}
                  sx={{ mb: 2 }}
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </Button>

                {showHint && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Hint:</strong> {currentProb?.hint}
                    </Typography>
                  </Alert>
                )}

                <Typography variant="body2" color="text.secondary">
                  <strong>Recommended Method:</strong> {currentProb?.method}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="success.main">
                  Your Solution
                </Typography>
                
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  placeholder="Write your solution steps here...
                  
1. Choose method and initial conditions
2. Set up iterations
3. Show convergence steps
4. State final answer"
                  value={userSolution}
                  onChange={(e) => setUserSolution(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Alert severity="success">
                  <Typography variant="body2">
                    <strong>Expected Answer:</strong> {currentProb?.solution}
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            onClick={() => setCurrentProblem(Math.max(0, currentProblem - 1))}
            disabled={currentProblem === 0}
            startIcon={<PrevIcon />}
          >
            Previous Problem
          </Button>
          <Button 
            onClick={() => setCurrentProblem(Math.min(problems.length - 1, currentProblem + 1))}
            disabled={currentProblem === problems.length - 1}
            endIcon={<NextIcon />}
          >
            Next Problem
          </Button>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" color="success">
          Check Solution
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function LearningCenter() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedMethod, setExpandedMethod] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [practiceMode, setPracticeMode] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMethodExpand = (index) => {
    setExpandedMethod(expandedMethod === index ? null : index);
  };

  const handleStartQuiz = (quizType) => {
    setCurrentQuiz(quizType);
  };

  const handleStartPractice = (exerciseTitle, difficulty) => {
    setPracticeMode({ title: exerciseTitle, difficulty });
  };

  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
    // In a real app, this would open external links or detailed views
    window.open(getResourceUrl(resource.title), '_blank');
  };

  const getResourceUrl = (title) => {
    const resourceUrls = {
      'Numerical Analysis by Burden & Faires': 'https://www.cengage.com/c/numerical-analysis-10e-burden',
      'Numerical Methods by Chapra & Canale': 'https://www.mheducation.com/highered/product/numerical-methods-engineers-chapra-canale/M9780073397924.html',
      'MIT 18.335: Introduction to Numerical Methods': 'https://ocw.mit.edu/courses/mathematics/18-335j-introduction-to-numerical-methods-spring-2019/',
      'Coursera: Numerical Methods for Engineers': 'https://www.coursera.org/learn/numerical-methods-engineers',
      'Khan Academy: Calculus & Numerical Analysis': 'https://www.khanacademy.org/math/calculus-1',
      'MATLAB Optimization Toolbox': 'https://www.mathworks.com/products/optimization.html',
      'Python SciPy Library': 'https://scipy.org/',
      'Wolfram Alpha Equation Solver': 'https://www.wolframalpha.com/',
      'Desmos Graphing Calculator': 'https://www.desmos.com/calculator',
      'GeoGebra Numerical Methods': 'https://www.geogebra.org/',
      'MATLAB Online': 'https://matlab.mathworks.com/',
      'MIT OpenCourseWare': 'https://ocw.mit.edu/',
      'NumPy/SciPy Documentation': 'https://docs.scipy.org/',
      'MATLAB Numerical Methods Guide': 'https://www.mathworks.com/help/matlab/numerical-analysis.html'
    };
    return resourceUrls[title] || 'https://scholar.google.com/scholar?q=' + encodeURIComponent(title);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 'none' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
          📚 Learning Hub: Non-linear Equations
        </Typography>

        <Paper elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(45deg, #1565c0, #7b1fa2)',
                height: 3,
              }
            }}
          >
            <Tab icon={<FunctionsIcon />} label="Methods Overview" />
            <Tab icon={<SchoolIcon />} label="Theory & Examples" />
            <Tab icon={<BookIcon />} label="Resources" />
            <Tab icon={<QAIcon />} label="Practice" />
          </Tabs>
        </Paper>

        {/* Methods Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Explore comprehensive information about numerical methods for solving non-linear equations f(x) = 0.
            </Typography>
          </Alert>

          <Grid container spacing={3}>
            {methodsData.map((method, index) => (
              <Grid item xs={12} key={index}>
                <Card sx={{ 
                  border: '1px solid rgba(0,0,0,0.1)',
                  '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                  transition: 'all 0.3s ease'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ mr: 2 }}>{method.icon}</Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {method.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip label={`Convergence: ${method.convergence}`} size="small" color="primary" />
                          <Chip label={`Complexity: ${method.complexity}`} size="small" color="secondary" />
                          <Chip label={`Reliability: ${method.reliability}`} size="small" color="success" />
                        </Box>
                      </Box>
                      <Button 
                        variant="outlined" 
                        onClick={() => handleMethodExpand(index)}
                        endIcon={<ExpandMoreIcon />}
                      >
                        {expandedMethod === index ? 'Hide Details' : 'Learn More'}
                      </Button>
                    </Box>

                    <Typography variant="body1" paragraph>
                      {method.description}
                    </Typography>

                    {expandedMethod === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Divider sx={{ my: 2 }} />
                        
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom color="primary.main">
                              📖 Theory
                            </Typography>
                            <Typography variant="body2" paragraph>
                              {method.theory}
                            </Typography>

                            <Typography variant="h6" gutterBottom color="primary.main">
                              🔄 Algorithm Steps
                            </Typography>
                            <List dense>
                              {method.algorithm.map((step, idx) => (
                                <ListItem key={idx}>
                                  <ListItemText primary={step} />
                                </ListItem>
                              ))}
                            </List>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom color="success.main">
                              ✅ Advantages
                            </Typography>
                            <List dense>
                              {method.advantages.map((advantage, idx) => (
                                <ListItem key={idx}>
                                  <ListItemIcon><StarIcon color="success" fontSize="small" /></ListItemIcon>
                                  <ListItemText primary={advantage} />
                                </ListItem>
                              ))}
                            </List>

                            <Typography variant="h6" gutterBottom color="warning.main" sx={{ mt: 2 }}>
                              ⚠️ Disadvantages
                            </Typography>
                            <List dense>
                              {method.disadvantages.map((disadvantage, idx) => (
                                <ListItem key={idx}>
                                  <ListItemIcon><Typography color="warning.main">•</Typography></ListItemIcon>
                                  <ListItemText primary={disadvantage} />
                                </ListItem>
                              ))}
                            </List>

                            <Typography variant="h6" gutterBottom color="info.main" sx={{ mt: 2 }}>
                              🎯 Applications
                            </Typography>
                            <List dense>
                              {method.applications.map((application, idx) => (
                                <ListItem key={idx}>
                                  <ListItemIcon><TrendingUpIcon color="info" fontSize="small" /></ListItemIcon>
                                  <ListItemText primary={application} />
                                </ListItem>
                              ))}
                            </List>
                          </Grid>
                        </Grid>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Theory & Examples Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            🌍 Real-World Applications
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {practicalExamples.map((example, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: '100%', border: '1px solid rgba(0,0,0,0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary.main">
                      {example.title}
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                      <Typography variant="body1" sx={{ fontFamily: 'monospace', textAlign: 'center' }}>
                        {example.equation}
                      </Typography>
                    </Paper>
                    <Typography variant="body2" paragraph>
                      <strong>Context:</strong> {example.context}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Real-world use:</strong> {example.realWorld}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            📐 Mathematical Foundation
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary.main">
                    🎯 What are Non-linear Equations?
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Non-linear equations are mathematical expressions where the unknown variable appears with powers other than one, 
                    or in functions like sin, cos, exp, log, etc. Examples include:
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Polynomial: x³ - 2x² + x - 1 = 0" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Transcendental: e^x - 3x = 0" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Trigonometric: sin(x) - x/2 = 0" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="success.main">
                    🔧 Why Numerical Methods?
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Most non-linear equations cannot be solved analytically. Numerical methods provide:
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><CalculateIcon color="success" /></ListItemIcon>
                      <ListItemText primary="Approximate solutions with desired precision" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><TimelineIcon color="success" /></ListItemIcon>
                      <ListItemText primary="Systematic approach to complex problems" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CodeIcon color="success" /></ListItemIcon>
                      <ListItemText primary="Computer-implementable algorithms" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Resources Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            {studyResources.map((category, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {category.icon}
                      <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                        {category.category}
                      </Typography>
                    </Box>
                    
                    <List>
                      {category.resources.map((resource, idx) => (
                        <ListItem key={idx} sx={{ px: 0 }}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1">{resource.title}</Typography>
                                <Box>
                                  {[...Array(resource.rating)].map((_, i) => (
                                    <StarIcon key={i} sx={{ fontSize: '16px', color: 'gold' }} />
                                  ))}
                                </Box>
                              </Box>
                            }
                            secondary={
                              <Chip 
                                label={resource.level} 
                                size="small" 
                                variant="outlined" 
                                color="primary"
                              />
                            }
                          />
                                                     <IconButton 
                             size="small" 
                             color="primary"
                             onClick={() => handleResourceClick(resource)}
                             title="Open Resource"
                           >
                             <LinkIcon />
                           </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>
            🌐 Online Resources & Tools
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary.main">
                    📱 Interactive Tools
                  </Typography>
                                     <List dense>
                     <ListItem button onClick={() => window.open('https://www.wolframalpha.com/', '_blank')}>
                       <ListItemText primary="Wolfram Alpha Equation Solver" />
                       <LinkIcon color="primary" />
                     </ListItem>
                     <ListItem button onClick={() => window.open('https://www.desmos.com/calculator', '_blank')}>
                       <ListItemText primary="Desmos Graphing Calculator" />
                       <LinkIcon color="primary" />
                     </ListItem>
                     <ListItem button onClick={() => window.open('https://www.geogebra.org/', '_blank')}>
                       <ListItemText primary="GeoGebra Numerical Methods" />
                       <LinkIcon color="primary" />
                     </ListItem>
                     <ListItem button onClick={() => window.open('https://matlab.mathworks.com/', '_blank')}>
                       <ListItemText primary="MATLAB Online" />
                       <LinkIcon color="primary" />
                     </ListItem>
                   </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="success.main">
                    📖 Documentation
                  </Typography>
                                     <List dense>
                     <ListItem button onClick={() => window.open('https://docs.scipy.org/', '_blank')}>
                       <ListItemText primary="NumPy/SciPy Documentation" />
                       <LinkIcon color="primary" />
                     </ListItem>
                     <ListItem button onClick={() => window.open('https://www.mathworks.com/help/matlab/numerical-analysis.html', '_blank')}>
                       <ListItemText primary="MATLAB Numerical Methods Guide" />
                       <LinkIcon color="primary" />
                     </ListItem>
                     <ListItem button onClick={() => window.open('https://www.gnu.org/software/gsl/', '_blank')}>
                       <ListItemText primary="GNU Scientific Library Manual" />
                       <LinkIcon color="primary" />
                     </ListItem>
                     <ListItem button onClick={() => window.open('http://numerical.recipes/', '_blank')}>
                       <ListItemText primary="Numerical Recipes Online" />
                       <LinkIcon color="primary" />
                     </ListItem>
                   </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="warning.main">
                    🎓 Academic Resources
                  </Typography>
                                     <List dense>
                     <ListItem button onClick={() => window.open('https://ocw.mit.edu/', '_blank')}>
                       <ListItemText primary="MIT OpenCourseWare" />
                       <LinkIcon color="primary" />
                     </ListItem>
                     <ListItem button onClick={() => window.open('https://web.stanford.edu/class/cs205a/', '_blank')}>
                       <ListItemText primary="Stanford CS 205 Notes" />
                       <LinkIcon color="primary" />
                     </ListItem>
                     <ListItem button onClick={() => window.open('https://math.berkeley.edu/courses/choosing/lowerdivcourses/math128a', '_blank')}>
                       <ListItemText primary="Berkeley Math 128A" />
                       <LinkIcon color="primary" />
                     </ListItem>
                     <ListItem button onClick={() => window.open('https://arxiv.org/list/math.NA/recent', '_blank')}>
                       <ListItemText primary="ArXiv Numerical Analysis Papers" />
                       <LinkIcon color="primary" />
                     </ListItem>
                   </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Practice Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            🎯 Interactive Exercises
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {interactiveExercises.map((exercise, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ flex: 1 }}>{exercise.title}</Typography>
                      <Chip 
                        label={exercise.difficulty} 
                        color={exercise.difficulty === 'Beginner' ? 'success' : 
                               exercise.difficulty === 'Intermediate' ? 'warning' : 'error'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" paragraph>
                      {exercise.description}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>Sample Problems:</Typography>
                    <List dense>
                      {exercise.problems.map((problem, idx) => (
                        <ListItem key={idx} sx={{ px: 0 }}>
                          <ListItemText 
                            primary={
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                {problem}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                                         <Button 
                       variant="outlined" 
                       fullWidth 
                       sx={{ mt: 2 }}
                       onClick={() => handleStartPractice(exercise.title, exercise.difficulty)}
                     >
                       Start Practice
                     </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            📊 Self-Assessment Quiz
          </Typography>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Test Your Knowledge
              </Typography>
              <Typography variant="body1" paragraph>
                Take our comprehensive quiz to assess your understanding of numerical methods for non-linear equations.
              </Typography>
                             <Grid container spacing={2}>
                 <Grid item xs={12} sm={6} md={3}>
                   <Button 
                     variant="contained" 
                     fullWidth
                     onClick={() => handleStartQuiz('basic')}
                   >
                     📝 Basic Concepts (10 Questions)
                   </Button>
                 </Grid>
                 <Grid item xs={12} sm={6} md={3}>
                   <Button 
                     variant="contained" 
                     fullWidth 
                     color="warning"
                     onClick={() => handleStartQuiz('selection')}
                   >
                     🧮 Method Selection (15 Questions)
                   </Button>
                 </Grid>
                 <Grid item xs={12} sm={6} md={3}>
                   <Button 
                     variant="contained" 
                     fullWidth 
                     color="success"
                     onClick={() => handleStartQuiz('implementation')}
                   >
                     🔧 Implementation (20 Questions)
                   </Button>
                 </Grid>
                 <Grid item xs={12} sm={6} md={3}>
                   <Button 
                     variant="contained" 
                     fullWidth 
                     color="error"
                     onClick={() => handleStartQuiz('advanced')}
                   >
                     🎯 Advanced Topics (25 Questions)
                   </Button>
                 </Grid>
               </Grid>
            </CardContent>
          </Card>

          <Alert severity="info">
            <Typography variant="body2">
              💡 <strong>Study Tip:</strong> Practice with our interactive equation solver to understand how different methods 
              behave with various types of equations. Compare convergence rates and observe how initial conditions affect results.
            </Typography>
                     </Alert>
         </TabPanel>

         {/* Quiz Modal */}
         {currentQuiz && (
           <QuizModal 
             quizType={currentQuiz} 
             onClose={() => setCurrentQuiz(null)} 
           />
         )}

         {/* Practice Modal */}
         {practiceMode && (
           <PracticeModal 
             exercise={practiceMode} 
             onClose={() => setPracticeMode(null)} 
           />
         )}
       </motion.div>
     </Box>
   );
 }

export default LearningCenter; 