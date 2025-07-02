import React, { useState } from 'react';
import '../../assets/animations.css';
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
  StepLabel,
  CircularProgress
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
  PlayArrow as PlayIcon,
  Psychology as PsychologyIcon,
  Science as ScienceIcon,
  AutoFixHigh as AutoFixHighIcon,
  Insights as InsightsIcon,
  Quiz as QuizIcon,
  Apps as AppsIcon,
  Language as LanguageIcon,
  Description as DescriptionIcon,
  Lightbulb as LightbulbIcon,
  Balance as BalanceIcon,
  Straighten as RulerIcon,
  GpsFixed as GpsFixedIcon,
  Loop as LoopIcon,
  BlurOn as BlurOnIcon,
  Celebration as CelebrationIcon,
  EmojiEvents as TrophyIcon,
  AssignmentTurnedIn as AssignmentDoneIcon,
  LightbulbOutlined as LightIcon,
  SchoolOutlined as EducationIcon,
  FolderOpen as FolderIcon,
  Speed as SpeedIcon,
  Verified as VerifiedIcon,
  Edit as EditIcon,
  Info as InfoIcon
} from '@mui/icons-material';

import { initializeGemini, validateSolutionWithGemini, isGeminiInitialized } from '../../services/geminiService';
import { quizData } from '../../data/quizData';
import { DEFAULT_API_KEY } from '../../config/config';

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



const methodsData = [
  {
    name: 'Bisection Method',
    icon: <BalanceIcon className="icon-sway" sx={{ fontSize: '2.5rem' }} />,
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
    icon: <CalculateIcon className="icon-pulse-gentle" sx={{ fontSize: '2.5rem' }} />,
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
    icon: <TimelineIcon className="icon-float-gentle" sx={{ fontSize: '2.5rem' }} />,
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
    icon: <RulerIcon className="icon-sway" sx={{ fontSize: '2.5rem' }} />,
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
    icon: <GpsFixedIcon className="icon-pulse-gentle" sx={{ fontSize: '2.5rem' }} />,
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
    icon: <BlurOnIcon className="icon-rotate-slow" sx={{ fontSize: '2.5rem' }} />,
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



 function QuizModal({ quizType, onClose }) {
   const [currentQuestion, setCurrentQuestion] = useState(0);
   const [selectedAnswer, setSelectedAnswer] = useState('');
   const [showResult, setShowResult] = useState(false);
   const [score, setScore] = useState(0);
   const [userAnswers, setUserAnswers] = useState([]);
   const [selectedQuestions, setSelectedQuestions] = useState([]);

   // Function to shuffle array using Fisher-Yates algorithm
   const shuffleArray = (array) => {
     const shuffled = [...array];
     for (let i = shuffled.length - 1; i > 0; i--) {
       const j = Math.floor(Math.random() * (i + 1));
       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
     }
     return shuffled;
   };

   // Initialize selected questions on mount
   React.useEffect(() => {
     const allQuestions = quizData[quizType] || [];
     const randomQuestions = shuffleArray(allQuestions).slice(0, 5);
     setSelectedQuestions(randomQuestions);
   }, [quizType]);

   const questions = selectedQuestions;
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
    <Dialog open={true} onClose={onClose} maxWidth="lg" fullWidth>
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
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Quiz Complete! <CelebrationIcon className="icon-bounce-soft" />
                </Box>
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
  const [validationResult, setValidationResult] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [isValidating, setIsValidating] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

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
      },
      {
        equation: 'e^x - 3x = 0',
        hint: 'This transcendental equation requires numerical methods. Try different initial guesses to compare methods.',
        solution: 'x ≈ 1.5121',
        method: 'Compare Newton-Raphson vs Secant method convergence'
      }
    ],
    'Advanced Applications': [
      {
        equation: 'x·ln(x) - 1 = 0',
        hint: 'This equation appears in optimization problems. Use x₀ = 2 as initial guess.',
        solution: 'x ≈ 1.7632',
        method: 'Use Newton-Raphson for engineering precision'
      },
      {
        equation: 'cos(x) - x = 0',
        hint: 'This transcendental equation has a unique solution. The root is where y=cos(x) intersects y=x.',
        solution: 'x ≈ 0.7391',
        method: 'Fixed point iteration or Newton-Raphson method'
      }
    ]
  };

  const problems = practiceProblems[exercise.title] || [];
  const currentProb = problems[currentProblem];

  // Function to save API key
  const saveApiKey = () => {
    if (apiKeyInput.trim()) {
      try {
        const success = initializeGemini(apiKeyInput.trim());
        if (success) {
          localStorage.setItem('gemini_api_key', apiKeyInput.trim());
          setApiKey(apiKeyInput.trim());
        setShowApiKeyDialog(false);
          setApiKeyInput('');
          setValidationResult(null); // Clear any previous errors
        } else {
          throw new Error('Failed to initialize with provided key');
        }
      } catch (error) {
        setValidationResult({
          type: 'error',
          message: 'Invalid API key. Please check and try again.',
          details: error.message
        });
      }
    }
  };

  // Function to handle problem navigation
  const handleNextProblem = () => {
    if (currentProblem + 1 < problems.length) {
      setCurrentProblem(currentProblem + 1);
    }
  };

  const handlePrevProblem = () => {
    if (currentProblem > 0) {
      setCurrentProblem(currentProblem - 1);
    }
  };

  // Function to handle solution checking with Gemini
  const checkSolution = async () => {
    if (!userSolution.trim()) {
      setValidationResult({
        type: 'error',
        message: 'Please provide your solution before checking.'
      });
      return;
    }

    // Check if API key is available and Gemini is initialized
    if (!isGeminiInitialized()) {
      try {
        const success = initializeGemini(apiKey);
        if (!success) {
          setShowApiKeyDialog(true);
          return;
        }
      } catch (_error) { // eslint-disable-line no-unused-vars
        setShowApiKeyDialog(true);
        return;
      }
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      const evaluation = await validateSolutionWithGemini(
        currentProb.equation,
        userSolution,
        currentProb.solution
      );

      if (evaluation.error === 'QUOTA_EXCEEDED') {
        setValidationResult({
          type: 'warning',
          message: 'API quota exceeded. Please try again in a few minutes.',
          details: 'The free API tier has daily limits. Please wait a moment before trying again.'
        });
      } else if (evaluation.error === 'API_KEY_ERROR') {
        setShowApiKeyDialog(true);
      } else {
        setValidationResult(evaluation);
        setShowCorrectAnswer(!evaluation.isCorrect);
      }
    } catch (error) {
      console.error('Validation error:', error);
      if (error.message.includes('API key') || error.message.includes('not initialized')) {
        setShowApiKeyDialog(true);
      } else {
      setValidationResult({
        type: 'error',
          message: 'An error occurred while checking your solution.',
          details: error.message
      });
      }
    } finally {
      setIsValidating(false);
    }
  };

  // Initialize Gemini on component mount
  React.useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini_api_key');
    const keyToUse = storedApiKey || DEFAULT_API_KEY;
    
    if (!isGeminiInitialized()) {
      try {
        initializeGemini(keyToUse);
        setApiKey(keyToUse);
        
        // Save default API key to localStorage if not already stored
        if (!storedApiKey) {
          localStorage.setItem('gemini_api_key', DEFAULT_API_KEY);
        }
      } catch (error) {
        console.error('Failed to initialize Gemini:', error);
      }
    }
  }, []);

  // Reset validation when problem changes
  React.useEffect(() => {
    setValidationResult(null);
    setShowCorrectAnswer(false);
    setUserSolution('');
  }, [currentProblem]);

  return (
    <Dialog 
      open={true} 
      onClose={onClose} 
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: '1400px',
          height: '800px',
          maxWidth: '95vw',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: 'primary.main',
        color: 'white',
        p: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontWeight: 500
          }}>
            {exercise.title === 'Basic Root Finding' && <CalculateIcon className="icon-pulse-gentle" />}
            {exercise.title === 'Method Comparison' && <TimelineIcon className="icon-float-gentle" />}
            {exercise.title === 'Advanced Applications' && <ScienceIcon className="icon-spin-slow" />}
            {exercise.title}
          </Typography>
          <Chip 
            label={exercise.difficulty} 
            size="small"
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              fontWeight: 'bold'
            }}
          />
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row', 
          gap: 3,
          justifyContent: 'center',
          alignItems: 'stretch',
          height: 'calc(100% - 20px)'
        }}>
          <Card sx={{ 
            width: '650px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent sx={{ flex: 1, p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary.main" sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 3
              }}>
                <EditIcon className="icon-bounce-soft" />
                  Your Solution
                </Typography>
                
                <TextField
                  fullWidth
                  multiline
                rows={16}
                  placeholder="Write your solution steps here...
                  
1. Choose method and initial conditions
2. Set up iterations
3. Show convergence steps
4. State final answer"
                  value={userSolution}
                  onChange={(e) => setUserSolution(e.target.value)}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'grey.50'
                  }
                }}
                />

                {!showCorrectAnswer && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <LightbulbIcon className="icon-glow-soft" />
                    <strong>Tip:</strong> Write your complete solution including the method used and final answer.
                    </Typography>
                  </Alert>
                )}

                {showCorrectAnswer && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    <strong>Expected Answer:</strong>
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {currentProb?.solution}
                    </Typography>
                  </Alert>
                )}
            </CardContent>
          </Card>

          <Card sx={{ 
            width: '650px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent sx={{ 
              flex: 1, 
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden' // Prevent double scrollbars
            }}>
              <Typography variant="h6" gutterBottom color="primary.main" sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 3,
                flexShrink: 0 // Prevent title from shrinking
              }}>
                <AssignmentIcon className="icon-bounce-soft" />
                Problem Details
                    </Typography>

              <Box sx={{ 
                flex: 1,
                overflow: 'auto', // Make content scrollable
                pr: 1 // Add space for scrollbar
              }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom color="text.secondary">
                    Equation:
                      </Typography>
                  <Paper sx={{ 
                    p: 2, 
                    bgcolor: 'grey.50',
                    borderLeft: '3px solid',
                    borderColor: 'primary.main'
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontFamily: 'monospace',
                      color: 'primary.dark'
                    }}>
                      {currentProb?.equation}
                      </Typography>
                  </Paper>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom color="text.secondary">
                    Hint:
                    </Typography>
                  <Alert severity="info">
                    <Typography variant="body1">
                      {currentProb?.hint}
                        </Typography>
                  </Alert>
                      </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom color="text.secondary">
                    Suggested Method:
                        </Typography>
                  <Alert severity="success">
                    <Typography variant="body1">
                      {currentProb?.method}
                        </Typography>
                  </Alert>
                      </Box>

                {validationResult && (
                  <Box sx={{ mb: 3 }}>
                  <Alert 
                      severity={validationResult.type}
                      sx={{ 
                        '& .MuiAlert-message': {
                          width: '100%'
                        }
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ 
                        mb: 1, 
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        {validationResult.type === 'success' && <CelebrationIcon className="icon-bounce-soft" />}
                        {validationResult.type === 'error' && <WarningIcon className="icon-shake" />}
                        {validationResult.type === 'info' && <InfoIcon className="icon-pulse" />}
                      {validationResult.message}
                    </Typography>
                      
                    {validationResult.score !== undefined && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: 1,
                          mb: 2,
                          bgcolor: 'background.paper',
                          p: 1,
                          borderRadius: 1
                        }}>
                          <Typography variant="body2" sx={{ minWidth: 80 }}>
                            Score:
                      </Typography>
              <LinearProgress 
                variant="determinate" 
                            value={validationResult.score}
                            sx={{ 
                              flex: 1,
                              height: 8,
                              borderRadius: 4
                            }}
                          />
                          <Typography variant="body2" sx={{ 
                            minWidth: 60,
                            fontWeight: 500,
                            color: validationResult.score >= 80 ? 'success.main' : 
                                   validationResult.score >= 60 ? 'warning.main' : 'error.main'
                          }}>
                            {validationResult.score}/100
                      </Typography>
            </Box>
                    )}

                      <Typography variant="body1" sx={{ mb: 2 }}>
                      {validationResult.details}
                    </Typography>

                      {validationResult.suggestions?.length > 0 && (
                        <Box sx={{ 
                          mt: 2,
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          p: 1
                        }}>
                          <Typography variant="subtitle2" gutterBottom sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: 'primary.main'
                          }}>
                            <LightbulbIcon className="icon-glow-soft" />
                            Suggestions for Improvement:
                        </Typography>
                          <List dense sx={{
                            '& .MuiListItem-root': {
                              borderLeft: '2px solid',
                              borderColor: 'primary.light',
                              mb: 1,
                              bgcolor: 'grey.50',
                              borderRadius: '0 4px 4px 0',
                              '&:last-child': { mb: 0 }
                            }
                          }}>
                            {validationResult.suggestions.map((suggestion, idx) => (
                              <ListItem key={idx}>
                                <ListItemIcon>
                                  <CheckIcon fontSize="small" color="success" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={suggestion}
                                  primaryTypographyProps={{
                                    sx: { fontWeight: 500 }
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                      </Box>
                    )}
                    </Alert>
                      </Box>
                        )}
                      </Box>
              </CardContent>
            </Card>
            </Box>
      </DialogContent>
            
      <DialogActions sx={{ p: 3, bgcolor: 'grey.50', display: 'flex', justifyContent: 'space-between' }}>
        <Box>
              <Button 
            onClick={handlePrevProblem}
                disabled={currentProblem === 0}
                startIcon={<PrevIcon />}
              >
                Previous
              </Button>
              <Button 
            onClick={handleNextProblem}
                disabled={currentProblem === problems.length - 1}
                endIcon={<NextIcon />}
            sx={{ ml: 1 }}
              >
                Next
              </Button>
            </Box>
        <Box>
          <Button 
            onClick={onClose}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
        <Button 
          variant="contained" 
          onClick={checkSolution}
          disabled={isValidating || !userSolution.trim()}
            className={!isValidating && userSolution.trim() ? "button-breathe" : ""}
            startIcon={isValidating ? <CircularProgress size={20} /> : <CheckIcon />}
            sx={{ ml: 1 }}
        >
            {isValidating ? 'Checking...' : 'Check Solution'}
        </Button>
        </Box>
      </DialogActions>

      {/* API Key Dialog */}
      <Dialog open={showApiKeyDialog} onClose={() => setShowApiKeyDialog(false)}>
        <DialogTitle>Enter Gemini API Key</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            The Gemini API key is missing or invalid. Please enter your key to continue.
            You can get a key from Google AI Studio.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Gemini API Key"
            type="password"
            fullWidth
            variant="outlined"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && saveApiKey()}
          />
        </DialogContent>
                  <DialogActions>
          <Button onClick={() => setShowApiKeyDialog(false)}>Cancel</Button>
          <Button onClick={saveApiKey} variant="contained">Submit</Button>
          </DialogActions>
      </Dialog>
    </Dialog>
  );
}

function LearningCenter() {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedMethod, setExpandedMethod] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [practiceMode, setPracticeMode] = useState(null);

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
      <div>
        <Typography variant="h4" gutterBottom className="fade-in-up glow-text" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
          <SchoolIcon className="icon-pendulum icon-comet" sx={{ fontSize: '1.2em', marginRight: '10px' }} />
          Learning Hub: Non-linear Equations
        </Typography>

        <Paper elevation={3} className="fade-in-left" sx={{ mb: 4, borderRadius: 2 }}>
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
            <Tab icon={<FunctionsIcon className="icon-spiral icon-breathe" />} label="Methods Overview" />
            <Tab icon={<SchoolIcon className="icon-morph icon-levitate" />} label="Theory & Examples" />
            <Tab icon={<BookIcon className="icon-quantum icon-ripple" />} label="Resources" />
            <Tab icon={<QAIcon className="icon-orbit icon-shimmer" />} label="Practice" />
          </Tabs>
        </Paper>

        {/* Methods Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            mb: 3
          }}>
            <Alert severity="info" sx={{ 
              maxWidth: '800px',
              width: '100%',
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}>
              <Typography variant="body1" sx={{ 
                fontWeight: 500,
                textAlign: 'center'
              }}>
              Explore comprehensive information about numerical methods for solving non-linear equations f(x) = 0.
            </Typography>
          </Alert>
          </Box>

          <Grid container spacing={3} sx={{ 
            display: 'flex',
            justifyContent: 'center',
            '& .MuiGrid-item': {
              display: 'flex',
              justifyContent: 'center'
            }
          }}>
            {methodsData.map((method, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ 
                  height: '400px',
                  width: '500px',
                  margin: '0 auto',
                  bgcolor: 'background.paper',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardContent sx={{ height: '100%', overflow: 'auto' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '2px solid',
                      borderColor: 'primary.light',
                      pb: 1,
                      mb: 2
                    }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                      }}>
                        <Box sx={{ color: 'primary.main' }}>
                        {method.icon}
                      </Box>
                        <Typography variant="h6" color="primary.main">
                          {method.name}
                        </Typography>
                      </Box>
                      <Button 
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<SchoolIcon className="icon-bounce-soft" />}
                        onClick={() => handleMethodExpand(index)}
                        sx={{
                          borderRadius: 2,
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 4px 15px rgba(21, 101, 192, 0.2)',
                          }
                        }}
                      >
                        {expandedMethod === index ? 'Close' : 'Learn'}
                      </Button>
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      flexWrap: 'wrap',
                      mb: 2
                    }}>
                      <Chip 
                        icon={<TimelineIcon className="icon-pulse-gentle" />}
                        label={`Convergence: ${method.convergence}`} 
                        size="small" 
                        color="primary"
                        sx={{ fontWeight: 500 }}
                      />
                      <Chip 
                        icon={<SpeedIcon className="icon-spin-slow" />}
                        label={`Complexity: ${method.complexity}`} 
                        size="small" 
                        color="secondary"
                        sx={{ fontWeight: 500 }}
                      />
                      <Chip 
                        icon={<VerifiedIcon className="icon-bounce-soft" />}
                        label={`Reliability: ${method.reliability}`} 
                        size="small" 
                        color="success"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>

                    <Typography variant="body1" paragraph sx={{ flex: 1 }}>
                      {method.description}
                    </Typography>

                    {expandedMethod === index && (
                      <Box sx={{ 
                        mt: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
                      }}>
                        <Divider />
                        
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h6" gutterBottom color="primary.main" sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}>
                                <BookIcon className="icon-wave icon-magnetic" />
                              Theory
                            </Typography>
                              <Paper sx={{ 
                                p: 2, 
                                bgcolor: 'grey.50',
                                borderLeft: '3px solid',
                                borderColor: 'primary.main'
                              }}>
                                <Typography variant="body2">
                              {method.theory}
                            </Typography>
                              </Paper>
                            </Box>

                            <Typography variant="h6" gutterBottom color="primary.main" sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <AutoFixHighIcon className="icon-elastic icon-glitch" />
                              Algorithm Steps
                            </Typography>
                            <List dense sx={{
                              bgcolor: 'grey.50',
                              borderRadius: 1,
                              '& .MuiListItem-root': {
                                borderLeft: '3px solid',
                                borderColor: 'primary.light',
                                mb: 1,
                                bgcolor: 'background.paper',
                                borderRadius: '0 4px 4px 0'
                              }
                            }}>
                              {method.algorithm.map((step, idx) => (
                                <ListItem key={idx}>
                                  <ListItemText 
                                    primary={step}
                                    sx={{ 
                                      '& .MuiTypography-root': { 
                                        fontFamily: 'monospace',
                                        fontWeight: 500
                                      }
                                    }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h6" gutterBottom color="success.main" sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}>
                                <CheckIcon className="icon-pendulum icon-ripple" />
                              Advantages
                            </Typography>
                              <List dense sx={{
                                bgcolor: 'success.50',
                                borderRadius: 1,
                                '& .MuiListItem-root': {
                                  borderLeft: '3px solid',
                                  borderColor: 'success.light',
                                  mb: 1,
                                  bgcolor: 'background.paper',
                                  borderRadius: '0 4px 4px 0'
                                }
                              }}>
                              {method.advantages.map((advantage, idx) => (
                                <ListItem key={idx}>
                                    <ListItemIcon>
                                      <StarIcon className="icon-twist icon-glow-pulse" color="success" fontSize="small" />
                                    </ListItemIcon>
                                  <ListItemText primary={advantage} />
                                </ListItem>
                              ))}
                            </List>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                              <Typography variant="h6" gutterBottom color="warning.main" sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}>
                                <WarningIcon className="icon-jiggle icon-vibrate" />
                                Limitations
                            </Typography>
                              <List dense sx={{
                                bgcolor: 'warning.50',
                                borderRadius: 1,
                                '& .MuiListItem-root': {
                                  borderLeft: '3px solid',
                                  borderColor: 'warning.light',
                                  mb: 1,
                                  bgcolor: 'background.paper',
                                  borderRadius: '0 4px 4px 0'
                                }
                              }}>
                              {method.disadvantages.map((disadvantage, idx) => (
                                <ListItem key={idx}>
                                    <ListItemIcon>
                                      <Typography color="warning.main">•</Typography>
                                    </ListItemIcon>
                                  <ListItemText primary={disadvantage} />
                                </ListItem>
                              ))}
                            </List>
                            </Box>

                            <Typography variant="h6" gutterBottom color="info.main" sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <AppsIcon className="icon-orbit icon-comet" />
                              Applications
                            </Typography>
                            <List dense sx={{
                              bgcolor: 'info.50',
                              borderRadius: 1,
                              '& .MuiListItem-root': {
                                borderLeft: '3px solid',
                                borderColor: 'info.light',
                                mb: 1,
                                bgcolor: 'background.paper',
                                borderRadius: '0 4px 4px 0'
                              }
                            }}>
                              {method.applications.map((application, idx) => (
                                <ListItem key={idx}>
                                  <ListItemIcon>
                                    <TrendingUpIcon className="icon-quantum icon-magnetic" color="info" fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText primary={application} />
                                </ListItem>
                              ))}
                            </List>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Theory & Examples Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            mb: 3
          }}>
            <Typography variant="h5" sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <LanguageIcon className="icon-twist icon-levitate" />
            Real-World Applications
          </Typography>
          </Box>
          
          <Grid container spacing={3} sx={{ 
            mb: 4,
            display: 'flex',
            justifyContent: 'center'
          }}>
            {practicalExamples.map((example, index) => (
              <Grid item xs={12} md={6} key={index} sx={{ 
                display: 'flex', 
                justifyContent: 'center'
              }}>
                <Card sx={{ 
                  height: '100%',
                  minHeight: 300,
                  width: '100%',
                  maxWidth: '500px',
                  bgcolor: 'background.paper',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  }
                }}>
                  <CardContent sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    gap: 2
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      borderBottom: '2px solid',
                      borderColor: 'primary.light',
                      pb: 1
                    }}>
                      <Typography variant="h6" color="primary.main" sx={{ 
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flex: 1
                      }}>
                        {index === 0 && <BalanceIcon className="icon-sway" />}
                        {index === 1 && <TimelineIcon className="icon-pulse-gentle" />}
                        {index === 2 && <TrendingUpIcon className="icon-float-gentle" />}
                        {index === 3 && <FunctionsIcon className="icon-bounce-soft" />}
                        {index === 4 && <ScienceIcon className="icon-spin-slow" />}
                      {example.title}
                    </Typography>
                    </Box>
                    <Paper sx={{ 
                      p: 3,
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                      border: '1px dashed rgba(0,0,0,0.1)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontFamily: 'monospace', 
                          textAlign: 'center',
                          color: 'primary.dark',
                          fontWeight: 500
                        }}
                      >
                        {example.equation}
                      </Typography>
                    </Paper>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          <strong>Context:</strong>
                    </Typography>
                        <Typography variant="body1" sx={{ 
                          pl: 2, 
                          borderLeft: '3px solid', 
                          borderColor: 'primary.light',
                          minHeight: '80px',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {example.context}
                    </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          <strong>Real-world Application:</strong>
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          pl: 2, 
                          borderLeft: '3px solid', 
                          borderColor: 'success.light',
                          minHeight: '80px',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {example.realWorld}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            mb: 3
          }}>
            <Typography variant="h5" sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <ScienceIcon className="icon-matrix icon-breathe" />
            Mathematical Foundation
          </Typography>
          </Box>
          
          <Grid container spacing={3} sx={{ 
            display: 'flex',
            justifyContent: 'center',
            mb: 4
          }}>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ 
                height: '100%',
                minHeight: 300,
                width: '100%',
                maxWidth: '500px',
                bgcolor: 'background.paper',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                }
              }}>
                <CardContent sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  gap: 2
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    borderBottom: '2px solid',
                    borderColor: 'primary.light',
                    pb: 1
                  }}>
                    <Typography variant="h6" color="primary.main" sx={{ 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      flex: 1
                    }}>
                      <PsychologyIcon className="icon-quantum icon-shimmer" />
                    What are Non-linear Equations?
                  </Typography>
                  </Box>
                  <Typography variant="body1" paragraph>
                    Non-linear equations are mathematical expressions where the unknown variable appears with powers other than one, 
                    or in functions like sin, cos, exp, log, etc. Examples include:
                  </Typography>
                  <List sx={{
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    p: 2,
                    flex: 1,
                    '& .MuiListItem-root': {
                      borderLeft: '3px solid',
                      borderColor: 'primary.light',
                      mb: 1,
                      bgcolor: 'background.paper',
                      borderRadius: '0 8px 8px 0',
                      minHeight: '60px'
                    }
                  }}>
                    <ListItem>
                      <ListItemText 
                        primary={
                          <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                            Polynomial: x³ - 2x² + x - 1 = 0
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary={
                          <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                            Transcendental: e^x - 3x = 0
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary={
                          <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                            Trigonometric: sin(x) - x/2 = 0
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ 
                height: '100%',
                minHeight: 300,
                width: '100%',
                maxWidth: '500px',
                bgcolor: 'background.paper',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                }
              }}>
                <CardContent sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  gap: 2
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    borderBottom: '2px solid',
                    borderColor: 'success.light',
                    pb: 1
                  }}>
                    <Typography variant="h6" color="success.main" sx={{ 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      flex: 1
                    }}>
                      <AutoFixHighIcon className="icon-bounce-soft" />
                      Why Numerical Methods?
                  </Typography>
                  </Box>
                  <Typography variant="body1" paragraph>
                    Most non-linear equations cannot be solved analytically. Numerical methods provide:
                  </Typography>
                  <List sx={{
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    p: 2,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around'
                  }}>
                    <ListItem sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      minHeight: '60px'
                    }}>
                      <ListItemIcon>
                        <CalculateIcon color="success" className="icon-pulse-gentle" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Approximate solutions with desired precision"
                        sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                      />
                    </ListItem>
                    <ListItem sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      minHeight: '60px'
                    }}>
                      <ListItemIcon>
                        <TimelineIcon color="success" className="icon-float-gentle" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Systematic approach to complex problems"
                        sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                      />
                    </ListItem>
                    <ListItem sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      minHeight: '60px'
                    }}>
                      <ListItemIcon>
                        <CodeIcon color="success" className="icon-wave" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Computer-implementable algorithms"
                        sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Resources Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            {studyResources.map((category, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card sx={{ 
                  height: '100%',
                  minHeight: 300,
                  width: '100%',
                  maxWidth: '450px',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ mr: 1, color: 'primary.main' }}>
                      {category.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {category.category}
                      </Typography>
                    </Box>
                    
                    <List sx={{ flexGrow: 1 }}>
                      {category.resources.map((resource, idx) => (
                        <ListItem key={idx} sx={{ 
                          px: 0,
                          alignItems: 'flex-start',
                          gap: 1
                        }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: 1,
                              mb: 0.5
                            }}>
                                <Typography variant="body1">{resource.title}</Typography>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                minWidth: 'fit-content',
                                flexShrink: 0
                              }}>
                                <Box sx={{ display: 'flex' }}>
                                  {[...Array(resource.rating)].map((_, i) => (
                                    <StarIcon key={i} sx={{ fontSize: '16px', color: 'gold' }} />
                                  ))}
                                </Box>
                                                     <IconButton 
                             size="small" 
                             color="primary"
                             onClick={() => handleResourceClick(resource)}
                             title="Open Resource"
                             className="nav-item-hover"
                             sx={{
                               transition: 'all 0.3s ease',
                               '&:hover': {
                                      transform: 'rotate(360deg)',
                                 backgroundColor: 'rgba(21, 101, 192, 0.1)',
                               }
                             }}
                           >
                                  <LinkIcon />
                           </IconButton>
                              </Box>
                            </Box>
                            <Chip 
                              label={resource.level} 
                              size="small" 
                              variant="outlined" 
                              color="primary"
                            />
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ 
            mt: 4, 
            mb: 3, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LanguageIcon className="icon-roll icon-magnetic" sx={{ marginRight: '10px' }} />
            Online Resources & Tools
          </Typography>
          
          <Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ 
                height: '100%',
                minHeight: 300,
                width: '100%',
                maxWidth: '800px',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary.main">
                    <CodeIcon className="icon-wave icon-ripple" sx={{ marginRight: '8px' }} />
                    Interactive Tools
                  </Typography>
                                     <List dense>
                    <ListItem button onClick={() => window.open('https://www.wolframalpha.com/', '_blank')} 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2
                      }}
                    >
                      <ListItemText 
                        primary="Wolfram Alpha Equation Solver"
                        sx={{ flex: '1 1 auto' }}
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 3,
                        flexShrink: 0
                      }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'rotate(360deg)',
                              backgroundColor: 'rgba(21, 101, 192, 0.1)',
                            }
                          }}
                        >
                          <LinkIcon />
                        </IconButton>
                      </Box>
                     </ListItem>
                    <ListItem 
                      button 
                      onClick={() => window.open('https://www.desmos.com/calculator', '_blank')}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        pr: 2
                      }}
                    >
                      <ListItemText 
                        primary="Desmos Graphing Calculator"
                        sx={{ flex: '1 1 auto', mr: 4 }}
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 3,
                        flexShrink: 0
                      }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'rotate(360deg)',
                              backgroundColor: 'rgba(21, 101, 192, 0.1)',
                            }
                          }}
                        >
                          <LinkIcon />
                        </IconButton>
                      </Box>
                     </ListItem>
                    <ListItem 
                      button 
                      onClick={() => window.open('https://www.geogebra.org/', '_blank')}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        pr: 2
                      }}
                    >
                      <ListItemText 
                        primary="GeoGebra Numerical Methods"
                        sx={{ flex: '1 1 auto', mr: 4 }}
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 3,
                        flexShrink: 0
                      }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'rotate(360deg)',
                              backgroundColor: 'rgba(21, 101, 192, 0.1)',
                            }
                          }}
                        >
                          <LinkIcon />
                        </IconButton>
                      </Box>
                     </ListItem>
                    <ListItem 
                      button 
                      onClick={() => window.open('https://matlab.mathworks.com/', '_blank')}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        pr: 2
                      }}
                    >
                      <ListItemText 
                        primary="MATLAB Online"
                        sx={{ flex: '1 1 auto', mr: 4 }}
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 3,
                        flexShrink: 0
                      }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'rotate(360deg)',
                              backgroundColor: 'rgba(21, 101, 192, 0.1)',
                            }
                          }}
                        >
                          <LinkIcon />
                        </IconButton>
                      </Box>
                     </ListItem>
                   </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ 
                height: '100%',
                minHeight: 300,
                width: '100%',
                maxWidth: '800px',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="success.main">
                    <DescriptionIcon className="icon-morph icon-levitate" sx={{ marginRight: '8px' }} />
                    Documentation
                  </Typography>
                                     <List dense>
                    <ListItem 
                      button 
                      onClick={() => window.open('https://docs.scipy.org/', '_blank')}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        pr: 2
                      }}
                    >
                      <ListItemText 
                        primary="NumPy/SciPy Documentation"
                        sx={{ flex: '1 1 auto', mr: 4 }}
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 3,
                        flexShrink: 0
                      }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'rotate(360deg)',
                              backgroundColor: 'rgba(21, 101, 192, 0.1)',
                            }
                          }}
                        >
                          <LinkIcon />
                        </IconButton>
                      </Box>
                     </ListItem>
                    <ListItem 
                      button 
                      onClick={() => window.open('https://www.mathworks.com/help/matlab/numerical-analysis.html', '_blank')}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        pr: 2
                      }}
                    >
                      <ListItemText 
                        primary="MATLAB Numerical Methods Guide"
                        sx={{ flex: '1 1 auto', mr: 4 }}
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 3,
                        flexShrink: 0
                      }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'rotate(360deg)',
                              backgroundColor: 'rgba(21, 101, 192, 0.1)',
                            }
                          }}
                        >
                          <LinkIcon />
                        </IconButton>
                      </Box>
                     </ListItem>
                    <ListItem 
                      button 
                      onClick={() => window.open('https://www.gnu.org/software/gsl/', '_blank')}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        pr: 2
                      }}
                    >
                      <ListItemText 
                        primary="GNU Scientific Library Manual"
                        sx={{ flex: '1 1 auto', mr: 4 }}
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 3,
                        flexShrink: 0
                      }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'rotate(360deg)',
                              backgroundColor: 'rgba(21, 101, 192, 0.1)',
                            }
                          }}
                        >
                          <LinkIcon />
                        </IconButton>
                      </Box>
                     </ListItem>
                    <ListItem 
                      button 
                      onClick={() => window.open('http://numerical.recipes/', '_blank')}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        pr: 2
                      }}
                    >
                      <ListItemText 
                        primary="Numerical Recipes Online"
                        sx={{ flex: '1 1 auto', mr: 4 }}
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 3,
                        flexShrink: 0
                      }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'rotate(360deg)',
                              backgroundColor: 'rgba(21, 101, 192, 0.1)',
                            }
                          }}
                        >
                          <LinkIcon />
                        </IconButton>
                      </Box>
                     </ListItem>
                   </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ 
                height: '100%',
                minHeight: 300,
                width: '100%',
                maxWidth: '800px',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="warning.main">
                    <SchoolIcon className="icon-spiral icon-comet" sx={{ marginRight: '8px' }} />
                    Academic Resources
                  </Typography>
                                     <List dense>
                    <ListItem 
                      button 
                      onClick={() => window.open('https://ocw.mit.edu/', '_blank')}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        pr: 2
                      }}
                    >
                      <ListItemText 
                        primary="MIT OpenCourseWare"
                        sx={{ flex: '1 1 auto', mr: 4 }}
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 3,
                        flexShrink: 0
                      }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'rotate(360deg)',
                              backgroundColor: 'rgba(21, 101, 192, 0.1)',
                            }
                          }}
                        >
                          <LinkIcon />
                        </IconButton>
                      </Box>
                     </ListItem>
                    <ListItem 
                      button 
                      onClick={() => window.open('https://web.stanford.edu/class/cs205a/', '_blank')}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        pr: 2
                      }}
                    >
                      <ListItemText 
                        primary="Stanford CS 205 Notes"
                        sx={{ flex: '1 1 auto', mr: 4 }}
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 3,
                        flexShrink: 0
                      }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'rotate(360deg)',
                              backgroundColor: 'rgba(21, 101, 192, 0.1)',
                            }
                          }}
                        >
                          <LinkIcon />
                        </IconButton>
                      </Box>
                     </ListItem>
                    <ListItem 
                      button 
                      onClick={() => window.open('https://math.berkeley.edu/courses/choosing/lowerdivcourses/math128a', '_blank')}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        pr: 2
                      }}
                    >
                      <ListItemText 
                        primary="Berkeley Math 128A"
                        sx={{ flex: '1 1 auto', mr: 4 }}
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 3,
                        flexShrink: 0
                      }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'rotate(360deg)',
                              backgroundColor: 'rgba(21, 101, 192, 0.1)',
                            }
                          }}
                        >
                          <LinkIcon />
                        </IconButton>
                      </Box>
                     </ListItem>
                    <ListItem 
                      button 
                      onClick={() => window.open('https://arxiv.org/list/math.NA/recent', '_blank')}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        pr: 2
                      }}
                    >
                      <ListItemText 
                        primary="ArXiv Numerical Analysis Papers"
                        sx={{ flex: '1 1 auto', mr: 4 }}
                      />
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 3,
                        flexShrink: 0
                      }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'rotate(360deg)',
                              backgroundColor: 'rgba(21, 101, 192, 0.1)',
                            }
                          }}
                        >
                          <LinkIcon />
                        </IconButton>
                      </Box>
                     </ListItem>
                   </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Practice Tab */}
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            {interactiveExercises.map((exercise, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ 
                  minHeight: '450px',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  }
                }}>
                  <CardContent sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 2,
                      borderBottom: '2px solid',
                      borderColor: 'primary.light',
                      pb: 2,
                      mb: 3
                    }}>
                      <Box sx={{ color: 'primary.main', mt: 1 }}>
                        {index === 0 && <CalculateIcon className="icon-pulse-gentle" sx={{ fontSize: '2.5rem' }} />}
                        {index === 1 && <TimelineIcon className="icon-float-gentle" sx={{ fontSize: '2.5rem' }} />}
                        {index === 2 && <ScienceIcon className="icon-spin-slow" sx={{ fontSize: '2.5rem' }} />}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" color="primary.main" gutterBottom>
                          {exercise.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={exercise.difficulty} 
                        size="small"
                            color={
                              exercise.difficulty === 'Beginner' ? 'success' : 
                              exercise.difficulty === 'Intermediate' ? 'warning' : 
                              'error'
                            }
                          />
                          <Chip 
                            icon={<AssignmentIcon />}
                            label={`${exercise.problems.length} Problems`} 
                            size="small"
                            color="primary"
                      />
                    </Box>
                      </Box>
                    </Box>

                    <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                      {exercise.description}
                    </Typography>

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2
                      }}>
                        <FunctionsIcon />
                        Sample Problems:
                      </Typography>
                      <List sx={{
                        bgcolor: 'grey.50',
                        borderRadius: 2,
                        p: 2,
                        '& .MuiListItem-root': {
                          borderLeft: '3px solid',
                          borderColor: 'primary.light',
                          mb: 1,
                          p: 2,
                          bgcolor: 'background.paper',
                          borderRadius: '0 8px 8px 0',
                          '&:last-child': {
                            mb: 0
                          }
                        }
                      }}>
                      {exercise.problems.map((problem, idx) => (
                          <ListItem key={idx}>
                          <ListItemText 
                            primary={
                                <Typography variant="body1" sx={{ 
                                  fontFamily: 'monospace', 
                                  fontWeight: 500,
                                  color: 'primary.dark'
                                }}>
                                {problem}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                    </Box>

                                         <Button 
                      variant="contained"
                       fullWidth 
                       onClick={() => handleStartPractice(exercise.title, exercise.difficulty)}
                      className="button-breathe"
                      sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: 2,
                        transition: 'all 0.3s ease'
                      }}
                      startIcon={<PlayIcon className="icon-bounce-soft" />}
                     >
                       Start Practice
                     </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3
                }}>
                  <QuizIcon className="icon-elastic icon-breathe" />
                  Self-Assessment Quizzes
          </Typography>
          
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                      height: '100%',
                      bgcolor: 'primary.50',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 20px rgba(21, 101, 192, 0.15)',
                      }
                    }}>
            <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <AssignmentIcon className="icon-jiggle icon-shimmer" color="primary" sx={{ fontSize: '2.5rem' }} />
                        </Box>
                        <Typography variant="h6" gutterBottom align="center">
                          Basic Concepts
              </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" paragraph>
                          Test your understanding of fundamental principles
              </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                          <Chip 
                            label={`5 questions per quiz (from pool of 35)`}
                            size="small"
                            color="primary"
                            sx={{ mb: 1 }}
                          />
                   <Button 
                     variant="contained" 
                     fullWidth
                     onClick={() => handleStartQuiz('basic')}
                            className="button-breathe-primary"
                            color="primary"
                   >
                            Start Quiz
                   </Button>
                        </Box>
                      </CardContent>
                    </Card>
                 </Grid>

                 <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                      height: '100%',
                      bgcolor: 'warning.50',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 20px rgba(255, 152, 0, 0.15)',
                      }
                    }}>
                      <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <CalculateIcon className="icon-twist icon-vibrate" color="warning" sx={{ fontSize: '2.5rem' }} />
                        </Box>
                        <Typography variant="h6" gutterBottom align="center">
                          Method Selection
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" paragraph>
                          Learn when to use each method
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                          <Chip 
                            label={`5 questions per quiz (from pool of 35)`}
                            size="small"
                            color="warning"
                            sx={{ mb: 1 }}
                          />
                   <Button 
                     variant="contained" 
                     fullWidth 
                     onClick={() => handleStartQuiz('selection')}
                            className="button-breathe-warning"
                            color="warning"
                   >
                            Start Quiz
                   </Button>
                        </Box>
                      </CardContent>
                    </Card>
                 </Grid>

                 <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                      height: '100%',
                      bgcolor: 'success.50',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 20px rgba(76, 175, 80, 0.15)',
                      }
                    }}>
                      <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <CodeIcon className="icon-wave icon-magnetic" color="success" sx={{ fontSize: '2.5rem' }} />
                        </Box>
                        <Typography variant="h6" gutterBottom align="center">
                          Implementation
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" paragraph>
                          Practice coding the methods
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                          <Chip 
                            label={`5 questions per quiz (from pool of 30)`}
                            size="small"
                            color="success"
                            sx={{ mb: 1 }}
                          />
                   <Button 
                     variant="contained" 
                     fullWidth 
                     onClick={() => handleStartQuiz('implementation')}
                            className="button-breathe-success"
                            color="success"
                   >
                            Start Quiz
                   </Button>
                        </Box>
                      </CardContent>
                    </Card>
                 </Grid>

                 <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                      height: '100%',
                      bgcolor: 'error.50',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 20px rgba(211, 47, 47, 0.15)',
                      }
                    }}>
                      <CardContent>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <InsightsIcon className="icon-matrix icon-levitate" color="error" sx={{ fontSize: '2.5rem' }} />
                        </Box>
                        <Typography variant="h6" gutterBottom align="center">
                          Advanced Topics
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" paragraph>
                          Challenge yourself with complex problems
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                          <Chip 
                            label={`5 questions per quiz (from pool of 25)`}
                            size="small"
                            color="error"
                            sx={{ mb: 1 }}
                          />
                   <Button 
                     variant="contained" 
                     fullWidth 
                     onClick={() => handleStartQuiz('advanced')}
                            className="button-breathe-error"
                            color="error"
                   >
                            Start Quiz
                   </Button>
                        </Box>
                      </CardContent>
                    </Card>
                 </Grid>
               </Grid>
            </CardContent>
          </Card>
          </Box>

          <Box sx={{ mt: 4 }}>
          <Alert severity="info">
              <Typography variant="body1" sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <LightbulbIcon className="icon-glow-soft" />
                <strong>Study Tip:</strong> Practice regularly with different types of equations to build intuition for method selection and implementation.
            </Typography>
                     </Alert>
          </Box>
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
       </div>
     </Box>
   );
 }

export default LearningCenter; 