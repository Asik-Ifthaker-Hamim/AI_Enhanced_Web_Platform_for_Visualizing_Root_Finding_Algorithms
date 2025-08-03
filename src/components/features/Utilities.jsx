// Mathematical utilities component with incremental search and advanced tools
import React, { useState } from 'react';
import '../../assets/animations.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FunctionsIcon from '@mui/icons-material/Functions';
import CalculateIcon from '@mui/icons-material/Calculate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import BuildIcon from '@mui/icons-material/Build';
import StraightenIcon from '@mui/icons-material/Straighten';
import DivideIcon from '@mui/icons-material/CallSplit';
import LoopIcon from '@mui/icons-material/Loop';

import { incrementalSearch } from '../../utils/incrementalSearch';
import { 
  hornersRuleDetailed, 
  polynomialDeflation, 
  successiveDeflation,
  parseCoefficients,
  createPolynomialString
} from '../../utils/polynomialUtils';
import { formatPolynomial } from '../../utils/formatPolynomial';

function Utilities() {
  // Incremental Search State
  const [searchParams, setSearchParams] = useState({
    func: 'x^3 - 2*x - 5',
    start: -10,
    end: 10,
    increment: 0.5
  });
  const [searchResults, setSearchResults] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Horner's Rule State
  const [hornerParams, setHornerParams] = useState({
    coefficients: '1 -6 11 -6', // Example: x³ - 6x² + 11x - 6
    x: 2
  });
  const [hornerResults, setHornerResults] = useState(null);
  const [hornerError, setHornerError] = useState('');

  // Polynomial Deflation State
  const [deflationParams, setDeflationParams] = useState({
    coefficients: '1 -6 11 -6', // Same example polynomial
    root: 1
  });
  const [deflationResults, setDeflationResults] = useState(null);
  const [deflationError, setDeflationError] = useState('');

  // Successive Deflation State
  const [successiveParams, setSuccessiveParams] = useState({
    coefficients: '1 -6 11 -6',
    roots: '1 2 3' // Known roots
  });
  const [successiveResults, setSuccessiveResults] = useState(null);
  const [successiveError, setSuccessiveError] = useState('');

  const [activeUtility, setActiveUtility] = useState('incremental');

  // Incremental Search Handler
  const handleIncrementalSearch = () => {
    try {
      setSearchError('');
      const results = incrementalSearch(
        searchParams.func,
        parseFloat(searchParams.start),
        parseFloat(searchParams.end),
        parseFloat(searchParams.increment)
      );
      setSearchResults(results);
    } catch (error) {
      setSearchError(error.message);
      setSearchResults(null);
    }
  };

  // Horner's Rule Handler
  const handleHornersRule = () => {
    try {
      setHornerError('');
      const coeffs = parseCoefficients(hornerParams.coefficients);
      const x = parseFloat(hornerParams.x);
      
      if (isNaN(x)) {
        throw new Error('Invalid x value');
      }

      const results = hornersRuleDetailed(coeffs, x);
      setHornerResults(results);
    } catch (error) {
      setHornerError(error.message);
      setHornerResults(null);
    }
  };

  // Polynomial Deflation Handler
  const handlePolynomialDeflation = () => {
    try {
      setDeflationError('');
      const coeffs = parseCoefficients(deflationParams.coefficients);
      const root = parseFloat(deflationParams.root);
      
      if (isNaN(root)) {
        throw new Error('Invalid root value');
      }

      const results = polynomialDeflation(coeffs, root);
      setDeflationResults(results);
    } catch (error) {
      setDeflationError(error.message);
      setDeflationResults(null);
    }
  };

  // Successive Deflation Handler
  const handleSuccessiveDeflation = () => {
    try {
      setSuccessiveError('');
      const coeffs = parseCoefficients(successiveParams.coefficients);
      const roots = parseCoefficients(successiveParams.roots);
      
      const results = successiveDeflation(coeffs, roots);
      setSuccessiveResults(results);
    } catch (error) {
      setSuccessiveError(error.message);
      setSuccessiveResults(null);
    }
  };

  const utilities = [
    { 
      value: 'incremental', 
      label: 'Incremental Search', 
      icon: <SearchIcon className="icon-orbital icon-breathe" />,
      description: 'Find intervals containing roots by systematic search'
    },
    { 
      value: 'horner', 
      label: 'Horner\'s Rule', 
      icon: <StraightenIcon className="icon-twist icon-magnetic" />,
      description: 'Efficient polynomial evaluation with detailed steps'
    },
    { 
      value: 'deflation', 
      label: 'Polynomial Deflation', 
      icon: <DivideIcon className="icon-matrix icon-ripple" />,
      description: 'Reduce polynomial degree using known roots'
    },
    { 
      value: 'successive', 
      label: 'Successive Deflation', 
      icon: <LoopIcon className="icon-spiral icon-levitate" />,
      description: 'Apply multiple deflations with known roots'
    }
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 'none' }}>
              <div>
        <Typography variant="h4" gutterBottom className="fade-in-up glow-text" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
          <BuildIcon className="icon-pendulum icon-comet" sx={{ fontSize: '1.2em', marginRight: '10px' }} />
          Mathematical Utilities
        </Typography>

        {/* Utility Selection */}
        <Card className="fade-in-left card-hover-lift" sx={{ mb: 3, minHeight: 200, bgcolor: 'background.paper' }}>
          <CardContent>
            <FormControl fullWidth>
              <InputLabel>Select Utility</InputLabel>
              <Select
                value={activeUtility}
                onChange={(e) => setActiveUtility(e.target.value)}
                label="Select Utility"
              >
                {utilities.map((utility) => (
                  <MenuItem key={utility.value} value={utility.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {utility.icon}
                      <Box>
                        <Typography variant="body1">{utility.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {utility.description}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        {/* Incremental Search */}
        {activeUtility === 'incremental' && (
          <Card className="fade-in-right card-hover-lift" sx={{ minHeight: 450, bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                <SearchIcon className="icon-drift icon-pulse-gentle" sx={{ marginRight: '10px' }} />
                Incremental Search
              </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Find intervals where the function changes sign, indicating potential roots.
            </Typography>

            <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
              <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    label="Function f(x)"
                    value={searchParams.func}
                    onChange={(e) => setSearchParams({...searchParams, func: e.target.value})}
                    placeholder="e.g., x^3 - 2*x - 5 or x³ - 2x - 5"
                    helperText="You can use either x^3 or x³ notation"
                    sx={{ mb: 2 }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Start"
                        type="number"
                        value={searchParams.start}
                        onChange={(e) => setSearchParams({...searchParams, start: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="End"
                        type="number"
                        value={searchParams.end}
                        onChange={(e) => setSearchParams({...searchParams, end: e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Increment"
                        type="number"
                        step="0.1"
                        value={searchParams.increment}
                        onChange={(e) => setSearchParams({...searchParams, increment: e.target.value})}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    variant="contained"
                    onClick={handleIncrementalSearch}
                    sx={{ mt: 2 }}
                    startIcon={<PlayArrowIcon className="icon-pulse" />}
                    className="pulse-button"
                  >
                    Search for Roots
                  </Button>
              </Grid>

              <Grid item xs={12} lg={6}>
                  {searchError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {searchError}
                    </Alert>
                  )}

                  {searchResults && (
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Search Results
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Found {searchResults.intervals.length} potential root interval(s):
                      </Typography>
                      
                      {searchResults.intervals.map((interval, index) => (
                        <Chip
                          key={index}
                          label={`[${interval.a.toFixed(3)}, ${interval.b.toFixed(3)}]`}
                          sx={{ mr: 1, mb: 1 }}
                          color="primary"
                        />
                      ))}

                      {searchResults.intervals.length === 0 && (
                        <Typography color="text.secondary">
                          No sign changes found in the given interval.
                        </Typography>
                      )}
                    </Paper>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Horner's Rule */}
        {activeUtility === 'horner' && (
          <Card className="fade-in-right card-hover-lift" sx={{ minHeight: 450, bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                <StraightenIcon className="icon-tilt icon-scale-breathe" sx={{ marginRight: '10px' }} />
                Horner's Rule
              </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Efficiently evaluate polynomials using Horner's method with step-by-step calculation.
            </Typography>

            <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
              <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    label="Coefficients (space-separated)"
                    value={hornerParams.coefficients}
                    onChange={(e) => setHornerParams({...hornerParams, coefficients: e.target.value})}
                    placeholder="e.g., 1 -6 11 -6"
                    helperText="Enter coefficients from highest to lowest degree"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Evaluation point (x)"
                    type="number"
                    value={hornerParams.x}
                    onChange={(e) => setHornerParams({...hornerParams, x: e.target.value})}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleHornersRule}
                    startIcon={<CalculateIcon className="icon-pulse" />}
                    className="pulse-button"
                  >
                    Evaluate Polynomial
                  </Button>
              </Grid>

              <Grid item xs={12} lg={6}>
                  {hornerError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {hornerError}
                    </Alert>
                  )}

                  {hornerResults && (
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Evaluation Result
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, fontFamily: 'monospace' }}>
                        {formatPolynomial(hornerResults.polynomial)} = {hornerResults.result}
                      </Typography>
                      
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>Step-by-Step Calculation</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Step</TableCell>
                                  <TableCell>Operation</TableCell>
                                  <TableCell align="right">Value</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {hornerResults.steps.map((step, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{step.step}</TableCell>
                                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                      {step.operation}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                      {step.value}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </AccordionDetails>
                      </Accordion>
                    </Paper>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Polynomial Deflation */}
        {activeUtility === 'deflation' && (
          <Card className="fade-in-right card-hover-lift" sx={{ minHeight: 450, bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                ➗ Polynomial Deflation
              </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Reduce polynomial degree by dividing by (x - root) using synthetic division.
            </Typography>

            <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
              <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    label="Polynomial Coefficients"
                    value={deflationParams.coefficients}
                    onChange={(e) => setDeflationParams({...deflationParams, coefficients: e.target.value})}
                    placeholder="e.g., 1 -6 11 -6"
                    helperText="Enter coefficients from highest to lowest degree"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Known Root"
                    type="number"
                    value={deflationParams.root}
                    onChange={(e) => setDeflationParams({...deflationParams, root: e.target.value})}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handlePolynomialDeflation}
                    startIcon={<PlayArrowIcon className="icon-pulse" />}
                    className="pulse-button"
                  >
                    Perform Deflation
                  </Button>
              </Grid>

              <Grid item xs={12} lg={6}>
                  {deflationError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {deflationError}
                    </Alert>
                  )}

                  {deflationResults && (
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Deflation Result
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Original:</Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                          {formatPolynomial(deflationResults.originalPolynomial)}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Quotient:</Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                          {formatPolynomial(deflationResults.quotientPolynomial)}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Remainder:</Typography>
                        <Chip
                          label={deflationResults.remainder.toFixed(6)}
                          color={deflationResults.isExactRoot ? 'success' : 'warning'}
                          size="small"
                        />
                        {deflationResults.isExactRoot && (
                          <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>
                            Exact root!
                          </Typography>
                        )}
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>Synthetic Division Steps</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Step</TableCell>
                                  <TableCell>Coefficient</TableCell>
                                  <TableCell>Multiplication</TableCell>
                                  <TableCell>Result</TableCell>
                                  <TableCell>Operation</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {deflationResults.steps.map((step, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{step.step}</TableCell>
                                    <TableCell>{step.coefficient}</TableCell>
                                    <TableCell>{step.multiplication}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{step.result}</TableCell>
                                    <TableCell sx={{ fontSize: '0.85rem' }}>
                                      {step.operation}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </AccordionDetails>
                      </Accordion>
                    </Paper>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Successive Deflation */}
        {activeUtility === 'successive' && (
          <Card className="fade-in-right card-hover-lift" sx={{ minHeight: 450, bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                <LoopIcon className="icon-bob icon-glow-soft" sx={{ marginRight: '10px' }} />
                Successive Deflation
              </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Apply multiple deflations using several known roots to reduce polynomial degree.
            </Typography>

            <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
              <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    label="Polynomial Coefficients"
                    value={successiveParams.coefficients}
                    onChange={(e) => setSuccessiveParams({...successiveParams, coefficients: e.target.value})}
                    placeholder="e.g., 1 -6 11 -6"
                    helperText="Enter coefficients from highest to lowest degree"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Known Roots (space-separated)"
                    value={successiveParams.roots}
                    onChange={(e) => setSuccessiveParams({...successiveParams, roots: e.target.value})}
                    placeholder="e.g., 1 2 3"
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSuccessiveDeflation}
                    startIcon={<PlayArrowIcon className="icon-pulse" />}
                    className="pulse-button"
                  >
                    Apply Successive Deflation
                  </Button>
              </Grid>

              <Grid item xs={12} lg={6}>
                  {successiveError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {successiveError}
                    </Alert>
                  )}

                  {successiveResults && (
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Successive Deflation Results
                      </Typography>
                      
                      {successiveResults.deflationSteps.map((step, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Deflation {index + 1}: Root = {step.root}
                          </Typography>
                          <Typography variant="body2">
                            Degree: {step.originalDegree} → {step.quotientDegree}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={`Remainder: ${step.remainder.toFixed(6)}`}
                              color={step.isExactRoot ? 'success' : 'warning'}
                              size="small"
                            />
                            {step.isExactRoot && (
                              <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>
                                ✓ Exact root
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      ))}

                      <Divider sx={{ my: 2 }} />

                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Final Polynomial:
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                          {successiveResults.finalPolynomial.length > 0 
                            ? createPolynomialString(successiveResults.finalPolynomial)
                            : 'Completely factored'
                          }
                        </Typography>
                      </Box>

                      {successiveResults.allExactRoots && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                          All roots are exact! The polynomial has been completely factored.
                        </Alert>
                      )}
                    </Paper>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
              </div>
    </Box>
  );
}

export default Utilities; 