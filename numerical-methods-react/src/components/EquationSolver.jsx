import React, { useState, useEffect } from 'react';
import './animations.css';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Chip,
  LinearProgress,
  IconButton
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Clear as ClearIcon,
  Functions as FunctionIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Science as ScienceIcon,
  CompareArrows as CompareArrowsIcon,
  GpsFixed as GpsFixedIcon,
  Timeline as TimelineIcon,
  Loop as LoopIcon,
  BlurOn as BlurOnIcon,
  Insights as InsightsIcon,
  ShowChart as ShowChartIcon,
  ListAlt as ListAltIcon
} from '@mui/icons-material';

import {
  bisectionMethod,
  falsePositionMethod,
  newtonRaphsonMethod,
  secantMethod,
  fixedPointMethod,
  mullerMethod,
  predefinedFunctions
} from '../utils/numericalMethods';
import FunctionPlot from './FunctionPlot';
import IterationTable from './IterationTable';

const methodInfo = {
  bisection: {
    name: 'Bisection Method',
    description: 'Reliable bracketing method that always converges',
    color: '#1976d2',
    icon: <CompareArrowsIcon className="icon-pendulum icon-magnetic" />,
    requirements: 'Function must change sign over interval [a,b]'
  },
  falsePosition: {
    name: 'False Position Method',
    description: 'Improved bracketing method with faster convergence',
    color: '#388e3c',
    icon: <GpsFixedIcon className="icon-orbit icon-ripple" />,
    requirements: 'Function must change sign over interval [a,b]'
  },
  newtonRaphson: {
    name: 'Newton-Raphson Method',
    description: 'Fast quadratic convergence using derivatives',
    color: '#f57c00',
    icon: <ScienceIcon className="icon-quantum icon-levitate" />,
    requirements: 'Derivative must be available and non-zero'
  },
  secant: {
    name: 'Secant Method',
    description: 'Newton-like method without derivative requirement',
    color: '#7b1fa2',
    icon: <TimelineIcon className="icon-wave icon-glitch" />,
    requirements: 'Two initial points that yield different function values'
  },
  fixedPoint: {
    name: 'Fixed Point Method',
    description: 'Iterative method for equations in form x = g(x)',
    color: '#d32f2f',
    icon: <LoopIcon className="icon-spiral icon-comet" />,
    requirements: 'Equation must be reformulated as x = g(x)'
  },
  muller: {
    name: "Muller's Method",
    description: 'Quadratic interpolation method for complex roots',
    color: '#0288d1',
    icon: <BlurOnIcon className="icon-morph icon-twist" />,
    requirements: 'Three initial points'
  }
};

function EquationSolver() {
  const [selectedFunction, setSelectedFunction] = useState('x³ - x - 1 = 0');
  const [customFunction, setCustomFunction] = useState('');
  const [customDerivative, setCustomDerivative] = useState('');
  const [method, setMethod] = useState('bisection');
  const [parameters, setParameters] = useState({
    a: '1',
    b: '2',
    guess: '1.5',
    tolerance: '1e-6',
    maxIterations: '100'
  });
  const [result, setResult] = useState(null);
  const [isComputing, setIsComputing] = useState(false);
  const [useCustom, setUseCustom] = useState(false);

  // Update parameters when function changes
  useEffect(() => {
    if (selectedFunction && predefinedFunctions[selectedFunction]) {
      const func = predefinedFunctions[selectedFunction];
      setParameters(prev => ({
        ...prev,
        a: func.interval[0].toString(),
        b: func.interval[1].toString(),
        guess: func.guess.toString()
      }));
    }
  }, [selectedFunction]);

  const handleParameterChange = (param) => (event) => {
    setParameters(prev => ({
      ...prev,
      [param]: event.target.value
    }));
  };

  const getCurrentFunction = () => {
    if (useCustom && customFunction.trim()) {
      return {
        expression: customFunction.trim(),
        derivative: customDerivative.trim() || null,
        name: `Custom: ${customFunction.trim()}`
      };
    }
    
    if (predefinedFunctions[selectedFunction]) {
      return {
        expression: predefinedFunctions[selectedFunction].expression,
        derivative: predefinedFunctions[selectedFunction].derivative,
        name: selectedFunction
      };
    }
    
    return null;
  };

  const solveEquation = async () => {
    const func = getCurrentFunction();
    if (!func) {
      alert('Please select a function or enter a custom function');
      return;
    }

    setIsComputing(true);
    setResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const tolerance = parseFloat(parameters.tolerance);
      const maxIterations = parseInt(parameters.maxIterations);
      let methodResult;

      switch (method) {
        case 'bisection':
          methodResult = bisectionMethod(func.expression, parseFloat(parameters.a), parseFloat(parameters.b), tolerance, maxIterations);
          break;
        case 'falsePosition':
          methodResult = falsePositionMethod(func.expression, parseFloat(parameters.a), parseFloat(parameters.b), tolerance, maxIterations);
          break;
        case 'newtonRaphson':
          if (!func.derivative) {
            throw new Error('Newton-Raphson method requires a derivative function');
          }
          methodResult = newtonRaphsonMethod(func.expression, func.derivative, parseFloat(parameters.guess), tolerance, maxIterations);
          break;
        case 'secant':
          methodResult = secantMethod(func.expression, parseFloat(parameters.a), parseFloat(parameters.b), tolerance, maxIterations);
          break;
        case 'fixedPoint': {
          const gExpression = `x - (${func.expression})/10`;
          methodResult = fixedPointMethod(gExpression, parseFloat(parameters.guess), tolerance, maxIterations);
          break;
        }
        case 'muller': {
          const mid = (parseFloat(parameters.a) + parseFloat(parameters.b)) / 2;
          methodResult = mullerMethod(func.expression, parseFloat(parameters.a), mid, parseFloat(parameters.b), tolerance, maxIterations);
          break;
        }
        default:
          throw new Error('Unknown method');
      }

      setResult({
        ...methodResult,
        functionName: func.name,
        functionExpression: func.expression,
        methodName: methodInfo[method].name
      });

    } catch (error) {
      setResult({
        errorMessage: error.message,
        functionName: func.name,
        methodName: methodInfo[method].name
      });
    } finally {
      setIsComputing(false);
    }
  };

  const clearResults = () => {
    setResult(null);
  };

  const currentMethodInfo = methodInfo[method];

  return (
    <Box sx={{ width: '100%', maxWidth: 'none' }}>
      <Typography variant="h4" gutterBottom className="fade-in-up glow-text" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
        <ScienceIcon className="icon-matrix icon-breathe" sx={{ fontSize: '1.2em', marginRight: '10px' }} />
        Interactive Equation Solver
      </Typography>

      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        {/* Left Panel - Configuration */}
        <Grid item xs={12} lg={4}>
                  <Card className="fade-in-left card-hover-lift" sx={{ mb: 3, bgcolor: 'background.paper' }}>
          <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FunctionIcon className="icon-jiggle icon-shimmer" color="primary" />
                Function Selection
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Button
                  variant={!useCustom ? 'contained' : 'outlined'}
                  onClick={() => setUseCustom(false)}
                  sx={{ mr: 1, mb: 1 }}
                >
                  Predefined
                </Button>
                <Button
                  variant={useCustom ? 'contained' : 'outlined'}
                  onClick={() => setUseCustom(true)}
                  sx={{ mb: 1 }}
                >
                  Custom
                </Button>
              </Box>

              {!useCustom ? (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select Function</InputLabel>
                  <Select
                    value={selectedFunction}
                    onChange={(e) => setSelectedFunction(e.target.value)}
                    label="Select Function"
                  >
                    {Object.entries(predefinedFunctions).map(([key, func]) => (
                      <MenuItem key={key} value={key}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{key}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {func.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Box>
                  <TextField
                    fullWidth
                    label="Function f(x)"
                    placeholder="e.g., x^3 - 2*x - 5"
                    value={customFunction}
                    onChange={(e) => setCustomFunction(e.target.value)}
                    sx={{ mb: 2 }}
                    helperText="Enter mathematical expression using x as variable"
                  />
                  <TextField
                    fullWidth
                    label="Derivative f'(x) (optional)"
                    placeholder="e.g., 3*x^2 - 2"
                    value={customDerivative}
                    onChange={(e) => setCustomDerivative(e.target.value)}
                    sx={{ mb: 2 }}
                    helperText="Required for Newton-Raphson method"
                  />
                </Box>
              )}

              <Typography variant="h6" gutterBottom sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon className="icon-elastic icon-vibrate" color="primary" />
                Method Selection
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Numerical Method</InputLabel>
                <Select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  label="Numerical Method"
                >
                  {Object.entries(methodInfo).map(([key, info]) => (
                    <MenuItem key={key} value={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{info.icon}</span>
                        {info.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Method Information */}
                        <Card variant="outlined" className="method-card scale-in" sx={{ mb: 2, minHeight: 320, bgcolor: 'grey.50' }}>
            <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: currentMethodInfo.color }}>
                    {currentMethodInfo.icon} {currentMethodInfo.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {currentMethodInfo.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {currentMethodInfo.requirements}
                  </Typography>
                </CardContent>
              </Card>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Parameters
              </Typography>

              <Grid container spacing={2}>
                {(method === 'bisection' || method === 'falsePosition' || method === 'secant') && (
                  <>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Interval Start (a)"
                        value={parameters.a}
                        onChange={handleParameterChange('a')}
                        type="number"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Interval End (b)"
                        value={parameters.b}
                        onChange={handleParameterChange('b')}
                        type="number"
                        size="small"
                      />
                    </Grid>
                  </>
                )}

                {(method === 'newtonRaphson' || method === 'fixedPoint') && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Initial Guess"
                      value={parameters.guess}
                      onChange={handleParameterChange('guess')}
                      type="number"
                      size="small"
                    />
                  </Grid>
                )}

                {method === 'muller' && (
                  <>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Point 1"
                        value={parameters.a}
                        onChange={handleParameterChange('a')}
                        type="number"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Point 2"
                        value={parameters.guess}
                        onChange={handleParameterChange('guess')}
                        type="number"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Point 3"
                        value={parameters.b}
                        onChange={handleParameterChange('b')}
                        type="number"
                        size="small"
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Tolerance"
                    value={parameters.tolerance}
                    onChange={handleParameterChange('tolerance')}
                    size="small"
                    helperText="e.g., 1e-6"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Max Iterations"
                    value={parameters.maxIterations}
                    onChange={handleParameterChange('maxIterations')}
                    type="number"
                    size="small"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={solveEquation}
                  disabled={isComputing}
                  startIcon={<PlayIcon className={isComputing ? 'icon-spiral icon-matrix' : 'icon-quantum icon-breathe'} />}
                  className={!isComputing ? 'pulse-button' : ''}
                  sx={{ flex: 1 }}
                >
                  {isComputing ? 'Computing...' : 'Solve'}
                </Button>
                <IconButton 
                  onClick={clearResults} 
                  disabled={!result}
                  className="nav-item-hover"
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.2) rotate(180deg)',
                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                    }
                  }}
                >
                  <ClearIcon className="icon-twist icon-vibrate" />
                </IconButton>
              </Box>

              {isComputing && <LinearProgress className="progress-glow" sx={{ mt: 2 }} />}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Results and Visualization */}
        <Grid item xs={12} lg={8}>
          {/* Results Summary */}
          {result && (
                      <Card className="results-appear card-hover-lift" sx={{ mb: 3, minHeight: 380, bgcolor: 'background.paper' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InsightsIcon className="icon-roll icon-ripple" color="primary" />
                  Solution Results
                </Typography>

                {result.errorMessage ? (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="body2">{result.errorMessage}</Typography>
                  </Alert>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip
                        className={`chip-slide-in ${result.convergenceAchieved ? 'success-animation' : 'error-animation'}`}
                        icon={result.convergenceAchieved ? 
                          <CheckCircleIcon className="icon-orbit icon-levitate" /> : 
                          <ErrorIcon className="icon-glitch icon-jiggle" />
                        }
                        label={result.convergenceAchieved ? 'Converged' : 'Did not converge'}
                        color={result.convergenceAchieved ? 'success' : 'error'}
                      />
                      <Chip className="chip-slide-in" label={`${result.iterations} iterations`} variant="outlined" />
                      <Chip className="chip-slide-in" label={`${result.functionEvaluations} function evaluations`} variant="outlined" />
                      <Chip className="chip-slide-in" label={`${result.executionTime.toFixed(2)}ms`} variant="outlined" />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Root</Typography>
                        <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                          {result.root?.toFixed(10)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Final Error</Typography>
                        <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                          {result.finalError?.toExponential(3)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Function Plot */}
                      <Card className="fade-in-right card-hover-lift" sx={{ mb: 3, minHeight: 450, bgcolor: 'background.paper' }}>
              <CardContent>
              <Typography variant="h6" gutterBottom>
                <ShowChartIcon className="icon-comet icon-magnetic" sx={{ fontSize: '1.2em', marginRight: '8px' }} />
                Function Visualization
              </Typography>
              <div className="chart-container">
                <FunctionPlot
                  functionExpression={getCurrentFunction()?.expression}
                  interval={[parseFloat(parameters.a), parseFloat(parameters.b)]}
                  root={result?.root}
                  iterationHistory={result?.iterationHistory}
                />
              </div>
            </CardContent>
          </Card>

          {/* Iteration History */}
          {result?.iterationHistory && result.iterationHistory.length > 0 && (
            <Card className="slide-in-bottom card-hover-lift">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ListAltIcon className="icon-glitch icon-levitate" color="primary" />
                  Iteration History
                </Typography>
                <IterationTable iterations={result.iterationHistory} />
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default EquationSolver; 