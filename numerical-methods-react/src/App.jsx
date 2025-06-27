import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
 
  Box, 
  Tabs, 
  Tab,
  Paper,
  useMediaQuery
} from '@mui/material';

import CalculateIcon from '@mui/icons-material/Calculate';
import EquationSolver from './components/EquationSolver';
import MethodComparison from './components/MethodComparison';
import Utilities from './components/Utilities';
import TeamInfo from './components/TeamInfo';
import LearningCenter from './components/LearningCenter';
import StudyBuddyChat from './components/StudyBuddyChat';

// Create a modern, professional theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565c0',
      light: '#42a5f5',
      dark: '#0d47a1',
    },
    secondary: {
      main: '#7b1fa2',
      light: '#ba68c8',
      dark: '#4a148c',
    },
    success: {
      main: '#2e7d32',
      light: '#66bb6a',
      dark: '#1b5e20',
    },
    warning: {
      main: '#f57c00',
      light: '#ffb74d',
      dark: '#e65100',
    },
    error: {
      main: '#d32f2f',
      light: '#f44336',
      dark: '#c62828',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '8px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.95rem',
        },
      },
    },
  },
});

const tabData = [
  { label: '🧮 Root Finder', component: EquationSolver },
  { label: '📊 Performance Analysis', component: MethodComparison },
  { label: '🔧 Advanced Tools', component: Utilities },
  { label: '📚 Learning Hub', component: LearningCenter },
  { label: '👥 Project Info', component: TeamInfo },
];

// Mathematical symbols related to numerical methods
const mathematicalSymbols = [
  'f(x)', 'x²', '√x', '∞', 'π', '∫', '∂', 'Δx', 'lim', 'sin', 'cos', 'tan',
  'e^x', 'ln(x)', 'x₀', 'x₁', 'x₂', 'f\'(x)', 'f\'\'(x)', '±', '≈', '≤', '≥',
  'Newton', 'Bisection', 'Secant', 'Root', 'Convergence', 'Iteration',
  '0.001', '0.01', '1.414', '2.718', '3.14159', 'tolerance', 'error'
];

// Particle System Component
function ParticleSystem() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const particleCount = 25; // Moderate number for performance
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          symbol: mathematicalSymbols[Math.floor(Math.random() * mathematicalSymbols.length)],
          left: Math.random() * 100, // Percentage position
          type: Math.floor(Math.random() * 5) + 1, // 1-5 for different types
          delay: Math.random() * 20 // Random delay for staggered animation
        });
      }
      
      setParticles(newParticles);
    };

    generateParticles();
    
    // Regenerate particles periodically for variety
    const interval = setInterval(generateParticles, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="particles-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`particle type-${particle.type}`}
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`
          }}
        >
          {particle.symbol}
        </div>
      ))}
    </div>
  );
}

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>
          <Box sx={{ pt: 2 }}>
            {children}
          </Box>
        </div>
      )}
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const _isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>{`
        body {
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden;
        }
        html {
          margin: 0 !important;
          padding: 0 !important;
        }
        #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100vw;
        }
        
        /* Particle System Styles */
        .particles-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        
        .particle {
          position: absolute;
          font-size: 16px;
          font-weight: 300;
          color: rgba(21, 101, 192, 0.1);
          animation: float 15s infinite linear;
          user-select: none;
        }
        
        .particle.type-1 { color: rgba(21, 101, 192, 0.08); font-size: 18px; animation-duration: 12s; }
        .particle.type-2 { color: rgba(123, 31, 162, 0.08); font-size: 14px; animation-duration: 18s; }
        .particle.type-3 { color: rgba(211, 47, 47, 0.08); font-size: 16px; animation-duration: 16s; }
        .particle.type-4 { color: rgba(76, 175, 80, 0.08); font-size: 20px; animation-duration: 14s; }
        .particle.type-5 { color: rgba(255, 152, 0, 0.08); font-size: 12px; animation-duration: 20s; }
        
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        
        .particle:nth-child(odd) {
          animation-direction: reverse;
        }
        
        .particle:nth-child(3n) {
          animation-delay: -5s;
        }
        
        .particle:nth-child(4n) {
          animation-delay: -10s;
        }
        
        .particle:nth-child(5n) {
          animation-delay: -15s;
        }
      `}</style>
      {/* Particle Background */}
      <ParticleSystem />
      
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default', width: '100vw', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            background: 'linear-gradient(135deg, #1565c0 0%, #7b1fa2 50%, #d32f2f 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            py: 1,
            width: '100vw',
            margin: 0,
            left: 0,
            right: 0
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', width: '100%', maxWidth: 'none', px: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <CalculateIcon sx={{ mr: 2, fontSize: 32, color: 'white' }} />
              </div>
              <Box>
                <Typography variant="h4" component="div" sx={{ 
                  flexGrow: 1, 
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Solution of Non-linear Equations
                </Typography>
                <Typography variant="subtitle1" sx={{ 
                  opacity: 0.95,
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  🎓 Advanced Interactive Learning Platform for Root-Finding Algorithms
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Particle container will be added here */}
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ width: '100vw', maxWidth: 'none', m: 0, p: 0 }}>
          {/* Navigation Tabs */}
          <Paper 
            elevation={3}
            sx={{ 
              mb: 0, 
              borderRadius: 0,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: 'none',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              width: '100vw',
              margin: 0
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              scrollButtons="auto"
              sx={{
                width: '100%',
                '& .MuiTabs-indicator': {
                  height: 4,
                  borderRadius: '4px 4px 0 0',
                  background: 'linear-gradient(45deg, #1565c0, #7b1fa2, #d32f2f)',
                },
                '& .MuiTab-root': {
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(21, 101, 192, 0.05)',
                    transform: 'translateY(-1px)',
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(21, 101, 192, 0.1) 0%, rgba(123, 31, 162, 0.1) 100%)',
                    color: 'primary.main',
                    fontWeight: 700,
                  }
                }
              }}
            >
              {tabData.map((tab, index) => (
                <Tab 
                  key={index}
                  label={tab.label}
                  sx={{ 
                    minHeight: 64,
                    '&.Mui-selected': {
                      fontWeight: 600,
                    }
                  }}
                />
              ))}
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <Box sx={{ px: { xs: 2, sm: 3, md: 4, lg: 4 }, py: { xs: 2, md: 3 } }}>
            {tabData.map((tab, index) => {
              const Component = tab.component;
              return (
                <TabPanel key={index} value={activeTab} index={index}>
                  <Component />
                </TabPanel>
              );
            })}
          </Box>
        </Box>
      </Box>
      
      {/* Study Buddy Chat - Available on all tabs */}
      <StudyBuddyChat />
    </ThemeProvider>
  );
}

export default App;
