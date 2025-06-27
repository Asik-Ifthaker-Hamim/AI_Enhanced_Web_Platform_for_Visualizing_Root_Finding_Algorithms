import React, { useRef, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { createFunction } from '../utils/numericalMethods';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
);

function FunctionPlot({ functionExpression, interval = [-5, 5], root = null, iterationHistory = [] }) {
  const chartRef = useRef();

  const chartData = useMemo(() => {
    if (!functionExpression) {
      return {
        datasets: []
      };
    }

    try {
      const f = createFunction(functionExpression);
      const [a, b] = interval;
      const range = b - a;
      const extendedRange = range * 0.3;
      const xMin = a - extendedRange;
      const xMax = b + extendedRange;
      
      // Generate points for the function
      const numPoints = 200;
      const step = (xMax - xMin) / numPoints;
      const functionPoints = [];
      const labels = [];

      for (let i = 0; i <= numPoints; i++) {
        const x = xMin + i * step;
        try {
          const y = f(x);
          if (isFinite(y) && Math.abs(y) < 1e6) { // Avoid extreme values
            functionPoints.push({ x, y });
            labels.push(x.toFixed(3));
          }
        } catch (_error) { // eslint-disable-line no-unused-vars
          // Skip points where function can't be evaluated
        }
      }

      const datasets = [
        {
          label: `f(x) = ${functionExpression}`,
          data: functionPoints,
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.1
        },
        {
          label: 'x-axis',
          data: [
            { x: xMin, y: 0 },
            { x: xMax, y: 0 }
          ],
          borderColor: '#666666',
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderDash: [5, 5],
          pointRadius: 0,
          pointHoverRadius: 0
        }
      ];

      // Add root point if available
      if (root !== null && isFinite(root)) {
        try {
          const rootY = f(root);
          datasets.push({
            label: 'Root',
            data: [{ x: root, y: rootY }],
            backgroundColor: '#f44336',
            borderColor: '#f44336',
            pointRadius: 8,
            pointHoverRadius: 10,
            showLine: false,
            pointStyle: 'circle'
          });

          // Add vertical line to x-axis
          datasets.push({
            label: 'Root Line',
            data: [
              { x: root, y: 0 },
              { x: root, y: rootY }
            ],
            borderColor: '#f44336',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [3, 3],
            pointRadius: 0,
            pointHoverRadius: 0
          });
        } catch (error) {
          console.warn('Could not plot root point:', error);
        }
      }

      // Add iteration points
      if (iterationHistory && iterationHistory.length > 0) {
        const iterationPoints = [];
        iterationHistory.forEach((iteration, _index) => { // eslint-disable-line no-unused-vars
          try {
            const y = f(iteration.xValue);
            if (isFinite(y) && Math.abs(y) < 1e6) {
              iterationPoints.push({
                x: iteration.xValue,
                y: y,
                iteration: iteration.iteration
              });
            }
          } catch (_error) { // eslint-disable-line no-unused-vars
            // Skip invalid points
          }
        });

        if (iterationPoints.length > 0) {
          datasets.push({
            label: 'Iterations',
            data: iterationPoints,
            backgroundColor: '#ff9800',
            borderColor: '#ff9800',
            pointRadius: 4,
            pointHoverRadius: 6,
            showLine: false,
            pointStyle: 'circle'
          });
        }
      }

      return { datasets };

    } catch (error) {
      console.error('Error generating chart data:', error);
      return {
        datasets: []
      };
    }
  }, [functionExpression, interval, root, iterationHistory]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'nearest'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#666666',
        borderWidth: 1,
        callbacks: {
          title: (context) => {
            const point = context[0];
            return `x = ${point.parsed.x.toFixed(6)}`;
          },
          label: (context) => {
            const { datasetIndex, parsed } = context;
            const dataset = chartData.datasets[datasetIndex];
            
            if (dataset.label === 'Root') {
              return `Root: f(${parsed.x.toFixed(6)}) = ${parsed.y.toExponential(3)}`;
            } else if (dataset.label === 'Iterations') {
              const dataPoint = context.raw;
              return `Iteration ${dataPoint.iteration}: f(${parsed.x.toFixed(6)}) = ${parsed.y.toExponential(3)}`;
            } else if (dataset.label.startsWith('f(x)')) {
              return `f(x) = ${parsed.y.toExponential(3)}`;
            }
            return `${dataset.label}: (${parsed.x.toFixed(3)}, ${parsed.y.toFixed(3)})`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'x',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value) {
            return Number(value).toFixed(2);
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'f(x)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value) {
            return Number(value).toExponential(2);
          }
        }
      }
    },
    elements: {
      point: {
        hoverBorderWidth: 2
      }
    }
  };

  if (!functionExpression) {
    return (
      <Box 
        sx={{ 
          height: 400, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'grey.50',
          borderRadius: 1,
          border: '2px dashed',
          borderColor: 'grey.300'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          📊 Function plot will appear here when you select or enter a function
        </Typography>
      </Box>
    );
  }

  if (chartData.datasets.length === 0) {
    return (
      <Box 
        sx={{ 
          height: 400, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'grey.50',
          borderRadius: 1,
          border: '2px dashed',
          borderColor: 'orange.300'
        }}
      >
        <Typography variant="body1" color="error">
          ❌ Could not plot function. Please check the function expression.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 400, position: 'relative' }}>
      <Line ref={chartRef} data={chartData} options={options} />
    </Box>
  );
}

export default FunctionPlot; 