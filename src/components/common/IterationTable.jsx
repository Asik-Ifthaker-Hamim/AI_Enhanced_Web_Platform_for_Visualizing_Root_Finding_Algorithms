// Interactive table component for displaying numerical method iteration data
import React, { useState } from 'react';
import '../../assets/animations.css';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TablePagination,
  Chip,
  Tooltip,
  IconButton,
  Collapse
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';


function IterationTable({ iterations = [] }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleRowExpansion = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  if (!iterations || iterations.length === 0) {
    return (
      <Box 
        sx={{ 
          p: 3, 
          textAlign: 'center', 
          bgcolor: 'grey.50', 
          borderRadius: 1,
          border: '2px dashed',
          borderColor: 'grey.300'
        }}
      >
        <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <AssignmentIcon className="icon-float-gentle icon-fade-pulse" />
          Iteration history will appear here after solving
        </Typography>
      </Box>
    );
  }

  // Paginate the data
  const paginatedIterations = iterations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" component="div">
          Iteration Details
        </Typography>
        <Chip 
          label={`${iterations.length} iterations`} 
          size="small" 
          variant="outlined" 
          color="primary"
        />
      </Box>

      <TableContainer 
        component={Paper} 
        elevation={0} 
        sx={{ 
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: 2,
          maxHeight: 600
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell 
                align="center" 
                sx={{ 
                  fontWeight: 600, 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  minWidth: 80
                }}
              >
                Iteration
              </TableCell>
              <TableCell 
                align="center" 
                sx={{ 
                  fontWeight: 600, 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  minWidth: 150
                }}
              >
                x Value
              </TableCell>
              <TableCell 
                align="center" 
                sx={{ 
                  fontWeight: 600, 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  minWidth: 150
                }}
              >
                f(x)
              </TableCell>
              <TableCell 
                align="center" 
                sx={{ 
                  fontWeight: 600, 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  minWidth: 120
                }}
              >
                Error
              </TableCell>
              <TableCell 
                align="center" 
                sx={{ 
                  fontWeight: 600, 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  width: 50
                }}
              >
                Details
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedIterations.map((iteration, index) => {
              const actualIndex = page * rowsPerPage + index;
              const isExpanded = expandedRow === actualIndex;
              
              return (
                <React.Fragment key={actualIndex}>
                  <TableRow
                    className="table-row-appear"
                    sx={{
                      '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
                      '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04)', transform: 'scale(1.01)' },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <TableCell align="center" sx={{ fontWeight: 500 }}>
                      <Chip 
                        label={iteration.iteration} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      {typeof iteration.xValue === 'number' 
                        ? iteration.xValue.toFixed(10) 
                        : 'N/A'}
                    </TableCell>
                    <TableCell align="center" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      {typeof iteration.fValue === 'number' 
                        ? iteration.fValue.toExponential(6) 
                        : 'N/A'}
                    </TableCell>
                    <TableCell align="center" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      {iteration.error !== null && typeof iteration.error === 'number'
                        ? iteration.error.toExponential(6)
                        : 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      {iteration.additionalData && Object.keys(iteration.additionalData).length > 0 && (
                        <Tooltip title="View additional details">
                          <IconButton 
                            size="small" 
                            onClick={() => toggleRowExpansion(actualIndex)}
                            sx={{ color: 'primary.main' }}
                          >
                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded Details Row */}
                  {iteration.additionalData && Object.keys(iteration.additionalData).length > 0 && (
                    <TableRow>
                      <TableCell 
                        colSpan={5} 
                        sx={{ 
                          p: 0, 
                          border: 0,
                          bgcolor: isExpanded ? 'rgba(25, 118, 210, 0.02)' : 'transparent'
                        }}
                      >
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, margin: 1 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                              Additional Details for Iteration {iteration.iteration}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {Object.entries(iteration.additionalData).map(([key, value]) => (
                                <Chip
                                  key={key}
                                  label={`${key}: ${
                                    typeof value === 'number' 
                                      ? (Math.abs(value) > 1000 || Math.abs(value) < 0.001 
                                          ? value.toExponential(3) 
                                          : value.toFixed(6))
                                      : value
                                  }`}
                                  variant="outlined"
                                  size="small"
                                  sx={{ fontFamily: 'monospace' }}
                                />
                              ))}
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {iterations.length > rowsPerPage && (
        <TablePagination
          component="div"
          count={iterations.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            bgcolor: 'grey.50'
          }}
        />
      )}

      {/* Summary Statistics */}
      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssessmentIcon className="icon-wiggle-soft icon-subtle-glow" color="primary" />
          Summary Statistics
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip 
            label={`Total Iterations: ${iterations.length}`} 
            variant="outlined" 
            size="small"
          />
          {iterations.length > 0 && (
            <>
              <Chip 
                label={`Final x: ${iterations[iterations.length - 1].xValue.toFixed(8)}`} 
                variant="outlined" 
                size="small"
                sx={{ fontFamily: 'monospace' }}
              />
              <Chip 
                label={`Final Error: ${iterations[iterations.length - 1].error?.toExponential(3) || 'N/A'}`} 
                variant="outlined" 
                size="small"
                sx={{ fontFamily: 'monospace' }}
              />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default IterationTable; 