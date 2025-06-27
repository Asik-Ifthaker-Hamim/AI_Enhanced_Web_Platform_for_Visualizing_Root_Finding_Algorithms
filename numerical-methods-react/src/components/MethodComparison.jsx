import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Compare as CompareIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  Functions as FunctionIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import { compareAllMethods, predefinedFunctions } from '../utils/numericalMethods';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`comparison-tabpanel-${index}`}
      aria-labelledby={`comparison-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

function MethodComparison() {
  const [selectedFunction, setSelectedFunction] = useState('x³ - x - 1 = 0');
  const [customFunction, setCustomFunction] = useState('');
  const [customDerivative, setCustomDerivative] = useState('');
  const [customInterval, setCustomInterval] = useState({ a: '1', b: '2' });
  const [customGuess, setCustomGuess] = useState('1.5');
  const [useCustom, setUseCustom] = useState(false);
  const [tolerance, setTolerance] = useState('1e-6');
  const [maxIterations, setMaxIterations] = useState('100');
  const [results, setResults] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getCurrentFunction = () => {
    if (useCustom && customFunction.trim()) {
      return {
        expression: customFunction.trim(),
        derivative: customDerivative.trim() || null,
        interval: [parseFloat(customInterval.a), parseFloat(customInterval.b)],
        guess: parseFloat(customGuess),
        name: `Custom: ${customFunction.trim()}`
      };
    }
    
    if (predefinedFunctions[selectedFunction]) {
      const func = predefinedFunctions[selectedFunction];
      return {
        ...func,
        name: selectedFunction
      };
    }
    
    return null;
  };

  const compareAllMethodsFunction = async () => {
    const func = getCurrentFunction();
    if (!func) {
      alert('Please select a function or enter a custom function');
      return;
    }

    setIsComparing(true);
    setResults(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const comparisonResults = compareAllMethods(
        func,
        parseFloat(tolerance),
        parseInt(maxIterations)
      );

      setResults({
        ...comparisonResults,
        functionName: func.name,
        functionExpression: func.expression
      });

    } catch (error) {
      console.error('Comparison error:', error);
      alert(`Error during comparison: ${error.message}`);
    } finally {
      setIsComparing(false);
    }
  };

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (!results) return null;

    const methods = Object.keys(results).filter(key => !['functionName', 'functionExpression'].includes(key));
    const validResults = methods.filter(method => results[method] && !results[method].errorMessage);

    if (validResults.length === 0) return null;

    const iterations = validResults.map(method => results[method].iterations || 0);
    const times = validResults.map(method => results[method].executionTime || 0);
    const functionEvals = validResults.map(method => results[method].functionEvaluations || 0);
    const errors = validResults.map(method => results[method].finalError || 0);

    const colors = [
      '#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#d32f2f', '#0288d1'
    ];

    return {
      iterations: {
        labels: validResults.map(method => method.replace(/([A-Z])/g, ' $1').trim()),
        datasets: [{
          label: 'Iterations',
          data: iterations,
          backgroundColor: colors.slice(0, validResults.length),
          borderWidth: 1
        }]
      },
      times: {
        labels: validResults.map(method => method.replace(/([A-Z])/g, ' $1').trim()),
        datasets: [{
          label: 'Time (ms)',
          data: times,
          backgroundColor: colors.slice(0, validResults.length),
          borderWidth: 1
        }]
      },
      functionEvals: {
        labels: validResults.map(method => method.replace(/([A-Z])/g, ' $1').trim()),
        datasets: [{
          label: 'Function Evaluations',
          data: functionEvals,
          backgroundColor: colors.slice(0, validResults.length),
          borderWidth: 1
        }]
      },
      errors: {
        labels: validResults.map(method => method.replace(/([A-Z])/g, ' $1').trim()),
        datasets: [{
          label: 'Final Error',
          data: errors,
          backgroundColor: colors.slice(0, validResults.length),
          borderWidth: 1
        }]
      }
    };
  }, [results]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const methodDisplayNames = {
    bisection: 'Bisection',
    falsePosition: 'False Position',
    newtonRaphson: 'Newton-Raphson',
    secant: 'Secant',
    fixedPoint: 'Fixed Point',
    muller: "Muller's Method"
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 'none' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
        📊 Method Comparison Center
      </Typography>

      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        {/* Configuration Panel */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CompareIcon color="primary" />
                  Comparison Setup
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
                      value={customFunction}
                      onChange={(e) => setCustomFunction(e.target.value)}
                      sx={{ mb: 2 }}
                      helperText="e.g., x^3 - 2*x - 5"
                    />
                    <TextField
                      fullWidth
                      label="Derivative f'(x)"
                      value={customDerivative}
                      onChange={(e) => setCustomDerivative(e.target.value)}
                      sx={{ mb: 2 }}
                      helperText="Optional, for Newton-Raphson"
                    />
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Interval Start (a)"
                          value={customInterval.a}
                          onChange={(e) => setCustomInterval(prev => ({ ...prev, a: e.target.value }))}
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Interval End (b)"
                          value={customInterval.b}
                          onChange={(e) => setCustomInterval(prev => ({ ...prev, b: e.target.value }))}
                          type="number"
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      fullWidth
                      label="Initial Guess"
                      value={customGuess}
                      onChange={(e) => setCustomGuess(e.target.value)}
                      sx={{ mb: 2 }}
                      type="number"
                    />
                  </Box>
                )}

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Parameters
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Tolerance"
                      value={tolerance}
                      onChange={(e) => setTolerance(e.target.value)}
                      helperText="e.g., 1e-6"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Max Iterations"
                      value={maxIterations}
                      onChange={(e) => setMaxIterations(e.target.value)}
                      type="number"
                    />
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={compareAllMethodsFunction}
                  disabled={isComparing}
                  startIcon={<PlayIcon />}
                  sx={{ py: 1.5 }}
                >
                  {isComparing ? 'Comparing Methods...' : 'Compare All Methods'}
                </Button>

                {isComparing && <LinearProgress sx={{ mt: 2 }} />}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Results Panel */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence>
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        📋 Results Summary
                      </Typography>
                      
                      <Alert severity="info" sx={{ mb: 2 }}>
                        Function: <strong>{results.functionExpression}</strong>
                      </Alert>

                      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.main' }}>
                              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Method</TableCell>
                              <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                              <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Root</TableCell>
                              <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Iterations</TableCell>
                              <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Time (ms)</TableCell>
                              <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>Final Error</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(results)
                              .filter(([key]) => !['functionName', 'functionExpression'].includes(key))
                              .map(([method, result]) => (
                                <TableRow 
                                  key={method}
                                  sx={{ '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.02)' } }}
                                >
                                  <TableCell sx={{ fontWeight: 500 }}>
                                    {methodDisplayNames[method] || method}
                                  </TableCell>
                                  <TableCell align="center">
                                    {result.errorMessage ? (
                                      <Chip
                                        icon={<ErrorIcon />}
                                        label="Error"
                                        color="error"
                                        size="small"
                                      />
                                    ) : result.convergenceAchieved ? (
                                      <Chip
                                        icon={<CheckCircleIcon />}
                                        label="Converged"
                                        color="success"
                                        size="small"
                                      />
                                    ) : (
                                      <Chip
                                        label="Max Iterations"
                                        color="warning"
                                        size="small"
                                      />
                                    )}
                                  </TableCell>
                                  <TableCell align="center" sx={{ fontFamily: 'monospace' }}>
                                    {result.root !== null && result.root !== undefined ? result.root.toFixed(8) : 'N/A'}
                                  </TableCell>
                                  <TableCell align="center">
                                    {result.iterations || 'N/A'}
                                  </TableCell>
                                  <TableCell align="center">
                                    {result.executionTime ? result.executionTime.toFixed(2) : 'N/A'}
                                  </TableCell>
                                  <TableCell align="center" sx={{ fontFamily: 'monospace' }}>
                                    {result.finalError ? result.finalError.toExponential(3) : 'N/A'}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>

                  {/* Visualization Charts */}
                  {chartData && (
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          📈 Performance Analysis
                        </Typography>

                        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                          <Tab label="Iterations" />
                          <Tab label="Execution Time" />
                          <Tab label="Function Evaluations" />
                          <Tab label="Final Error" />
                        </Tabs>

                        <TabPanel value={activeTab} index={0}>
                          <Box sx={{ height: 300 }}>
                            <Bar data={chartData.iterations} options={{...chartOptions, scales: {...chartOptions.scales, y: {...chartOptions.scales.y, title: {display: true, text: 'Number of Iterations'}}}}} />
                          </Box>
                        </TabPanel>

                        <TabPanel value={activeTab} index={1}>
                          <Box sx={{ height: 300 }}>
                            <Bar data={chartData.times} options={{...chartOptions, scales: {...chartOptions.scales, y: {...chartOptions.scales.y, title: {display: true, text: 'Execution Time (ms)'}}}}} />
                          </Box>
                        </TabPanel>

                        <TabPanel value={activeTab} index={2}>
                          <Box sx={{ height: 300 }}>
                            <Bar data={chartData.functionEvals} options={{...chartOptions, scales: {...chartOptions.scales, y: {...chartOptions.scales.y, title: {display: true, text: 'Function Evaluations'}}}}} />
                          </Box>
                        </TabPanel>

                        <TabPanel value={activeTab} index={3}>
                          <Box sx={{ height: 300 }}>
                            <Bar data={chartData.errors} options={{...chartOptions, scales: {...chartOptions.scales, y: {...chartOptions.scales.y, type: 'logarithmic', title: {display: true, text: 'Final Error (log scale)'}}}}} />
                          </Box>
                        </TabPanel>
                      </CardContent>
                    </Card>
                  )}

                  {/* Error Details */}
                  {results && Object.values(results).some(r => r.errorMessage) && (
                    <Card sx={{ mt: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color="error">
                          ⚠️ Error Details
                        </Typography>
                        {Object.entries(results)
                          .filter(([key, result]) => result.errorMessage && !['functionName', 'functionExpression'].includes(key))
                          .map(([method, result]) => (
                            <Alert key={method} severity="error" sx={{ mb: 1 }}>
                              <strong>{methodDisplayNames[method] || method}:</strong> {result.errorMessage}
                            </Alert>
                          ))}
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {!results && !isComparing && (
              <Card>
                <CardContent>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CompareIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Ready to Compare Methods
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Select a function and click "Compare All Methods" to see detailed performance analysis
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MethodComparison; 