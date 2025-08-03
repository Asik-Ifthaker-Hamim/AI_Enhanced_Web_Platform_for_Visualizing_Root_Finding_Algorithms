// Main App component - root component managing theme, navigation, and page routing
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
import FunctionsIcon from '@mui/icons-material/Functions';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ScienceIcon from '@mui/icons-material/Science';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BuildIcon from '@mui/icons-material/Build';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';

// Fix import paths to include features subdirectory
import EquationSolver from './components/features/EquationSolver';
import MethodComparison from './components/features/MethodComparison';
import Utilities from './components/features/Utilities';
import TeamInfo from './components/features/TeamInfo';
import LearningCenter from './components/features/LearningCenter';
import StudyBuddyChat from './components/features/StudyBuddyChat';

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
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.95rem',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(21, 101, 192, 0.08)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            },
            '&.Mui-focused': {
              transform: 'scale(1.02)',
              boxShadow: '0px 4px 20px rgba(21, 101, 192, 0.15)',
            },
          },
        },
      },
    },
  },
});

const tabData = [
  { 
    label: 'Root Finder', 
    component: EquationSolver,
    icon: <ScienceIcon className="icon-quantum icon-breathe" />
  },
  { 
    label: 'Performance Analysis', 
    component: MethodComparison,
    icon: <AnalyticsIcon className="icon-matrix icon-pulse" />
  },
  { 
    label: 'Advanced Tools', 
    component: Utilities,
    icon: <BuildIcon className="icon-twist icon-magnetic" />
  },
  { 
    label: 'Learning Hub', 
    component: LearningCenter,
    icon: <SchoolIcon className="icon-levitate icon-shimmer" />
  },
  { 
    label: 'Project Info', 
    component: TeamInfo,
    icon: <GroupsIcon className="icon-orbit icon-ripple" />
  },
];

// Mathematical symbols related to numerical methods
const mathematicalSymbols = [
  'f(x)', 'x²', '√x', '∞', 'π', '∫', '∂', 'Δx', 'lim', 'sin', 'cos', 'tan',
  'e^x', 'ln(x)', 'x₀', 'x₁', 'x₂', 'f\'(x)', 'f\'\'(x)', '±', '≈', '≤', '≥',
  'Newton', 'Bisection', 'Secant', 'Root', 'Convergence', 'Iteration',
  '0.001', '0.01', '1.414', '2.718', '3.14159', 'tolerance', 'error'
];

// Enhanced Particle System Component
function ParticleSystem() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const particleCount = 35; // Increased for more visual appeal
      
      for (let i = 0; i < particleCount; i++) {
        const isEnhanced = Math.random() > 0.7; // 30% chance for enhanced particles
        newParticles.push({
          id: i,
          symbol: mathematicalSymbols[Math.floor(Math.random() * mathematicalSymbols.length)],
          left: Math.random() * 100, // Percentage position
          type: Math.floor(Math.random() * 5) + 1, // 1-5 for different types
          delay: Math.random() * 25, // Random delay for staggered animation
          enhanced: isEnhanced
        });
      }
      
      setParticles(newParticles);
    };

    generateParticles();
    
    // Regenerate particles more frequently for dynamic effect
    const interval = setInterval(generateParticles, 20000); // Every 20 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="particles-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`particle type-${particle.type} ${particle.enhanced ? 'enhanced' : ''}`}
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
        <div className="tab-content-enter">
          <Box sx={{ 
            pt: 2,
            transition: 'all 0.3s ease-in-out'
          }}>
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
        
        /* Header Icon Animations */
        .calculate-icon {
          animation: bounce-spin 3s ease-in-out infinite;
        }
        
        .floating-icon {
          animation: float-gentle 3s ease-in-out infinite;
        }
        
        /* Attractive 3D Bounce-Spin Animation with Gradient Colors */
        @keyframes bounce-spin {
          0% {
            transform: scale(1) rotateY(0deg) translateY(0px);
            filter: drop-shadow(0 0 8px rgba(21, 101, 192, 0.4)) brightness(1);
          }
          25% {
            transform: scale(1.15) rotateY(90deg) translateY(-8px);
            filter: drop-shadow(0 0 15px rgba(123, 31, 162, 0.6)) brightness(1.1);
          }
          50% {
            transform: scale(1) rotateY(180deg) translateY(0px);
            filter: drop-shadow(0 0 20px rgba(211, 47, 47, 0.8)) brightness(1.2);
          }
          75% {
            transform: scale(1.15) rotateY(270deg) translateY(-8px);
            filter: drop-shadow(0 0 15px rgba(123, 31, 162, 0.6)) brightness(1.1);
          }
          100% {
            transform: scale(1) rotateY(360deg) translateY(0px);
            filter: drop-shadow(0 0 8px rgba(21, 101, 192, 0.4)) brightness(1);
          }
        }
        
        /* Alternative: Matrix-style 3D flip with Gradient Colors */
        @keyframes matrix-flip {
          0% {
            transform: perspective(400px) rotateX(0deg) rotateY(0deg) scale(1);
            filter: drop-shadow(0 0 10px rgba(21, 101, 192, 0.6)) brightness(1);
          }
          33% {
            transform: perspective(400px) rotateX(180deg) rotateY(120deg) scale(1.2);
            filter: drop-shadow(0 0 20px rgba(123, 31, 162, 0.8)) brightness(1.3);
          }
          66% {
            transform: perspective(400px) rotateX(360deg) rotateY(240deg) scale(0.9);
            filter: drop-shadow(0 0 15px rgba(211, 47, 47, 0.7)) brightness(1.1);
          }
          100% {
            transform: perspective(400px) rotateX(360deg) rotateY(360deg) scale(1);
            filter: drop-shadow(0 0 10px rgba(21, 101, 192, 0.6)) brightness(1);
          }
        }
        
        /* Alternative: Pulse-glow with rotation and Gradient Colors */
        @keyframes pulse-glow-spin {
          0% {
            transform: scale(1) rotate(0deg);
            filter: drop-shadow(0 0 8px rgba(21, 101, 192, 0.5)) brightness(1);
          }
          50% {
            transform: scale(1.3) rotate(180deg);
            filter: drop-shadow(0 0 25px rgba(211, 47, 47, 1)) brightness(1.5);
          }
          100% {
            transform: scale(1) rotate(360deg);
            filter: drop-shadow(0 0 8px rgba(21, 101, 192, 0.5)) brightness(1);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
        
        .spinning-icon {
          animation: spin 8s linear infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        /* Tab Animation Effects */
        .tab-content-enter {
          animation: slideInUp 0.6s ease-out;
        }
        
        .tab-content-exit {
          animation: slideOutDown 0.3s ease-in;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideOutDown {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-20px) scale(1.02);
          }
        }
        
        /* Header Animation */
        .header-slide-down {
          animation: headerSlideDown 0.8s ease-out;
        }
        
        @keyframes headerSlideDown {
          from {
            opacity: 0;
            transform: translateY(-100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Tab Bar Animation */
        .tab-bar-slide-up {
          animation: tabBarSlideUp 0.6s ease-out 0.2s both;
        }
        
        @keyframes tabBarSlideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Enhanced Particle Effects */
        .particle.enhanced {
          animation: enhancedFloat 20s infinite linear;
        }
        
        @keyframes enhancedFloat {
          0% {
            transform: translateY(100vh) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) rotate(180deg) scale(1.2);
            opacity: 0.8;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg) scale(0.6);
            opacity: 0;
          }
        }
        
        /* Title Animation */
        .title-glow {
          animation: titleGlow 4s ease-in-out infinite;
        }
        
        @keyframes titleGlow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(21, 101, 192, 0.3);
          }
        }
        
        /* Subtitle Typing Effect */
        .subtitle-typing {
          animation: typing 4s steps(60, end) 1s 1 forwards;
          white-space: nowrap;
          overflow: hidden;
          border-right: 2px solid rgba(255, 255, 255, 0.8);
          display: inline-block;
          vertical-align: middle;
        }
        
        @keyframes typing {
          from {
            width: 0;
            border-right-color: rgba(255, 255, 255, 0.8);
          }
          to {
            width: 100%;
            border-right-color: transparent;
          }
        }
        
        @keyframes blink {
          50% {
            border-color: transparent;
          }
        }
      `}</style>
      {/* Particle Background */}
      <ParticleSystem />
      
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default', width: '100vw', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <AppBar 
          position="static" 
          elevation={0}
          className="header-slide-down"
          sx={{ 
            background: 'linear-gradient(135deg, #1565c0 0%, #7b1fa2 50%, #d32f2f 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            py: 1,
            width: '100vw',
            margin: 0,
            left: 0,
            right: 0,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Header Mathematical Symbols - Right-Weighted Constellation with Gradient Opacity */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
            {/* Center Section - Minimal (Subtle) */}
            <span style={{ 
              position: 'absolute', top: '55%', left: '45%', fontSize: '16px', color: 'rgba(255, 255, 255, 0.18)', 
              transform: 'rotate(20deg)', animation: 'mathFloat3 12s ease-in-out infinite 2s' 
            }}>√</span>
            <span style={{ 
              position: 'absolute', top: '25%', left: '52%', fontSize: '17px', color: 'rgba(255, 255, 255, 0.20)', 
              transform: 'rotate(-25deg)', animation: 'mathFloat6 17s ease-in-out infinite 3.5s' 
            }}>∞</span>
            
            {/* Right-Center Section - More Symbols (Slightly Brighter) */}
            <span style={{ 
              position: 'absolute', top: '15%', left: '58%', fontSize: '15px', color: 'rgba(255, 255, 255, 0.25)', 
              transform: 'rotate(-35deg)', animation: 'mathFloat10 16.5s ease-in-out infinite 5s' 
            }}>≥</span>
            <span style={{ 
              position: 'absolute', top: '75%', left: '62%', fontSize: '18px', color: 'rgba(255, 255, 255, 0.28)', 
              transform: 'rotate(40deg)', animation: 'mathFloat1 14s ease-in-out infinite 4.5s' 
            }}>∫</span>
            <span style={{ 
              position: 'absolute', top: '45%', left: '66%', fontSize: '14px', color: 'rgba(255, 255, 255, 0.22)', 
              transform: 'rotate(-10deg)', animation: 'mathFloat4 15s ease-in-out infinite 2.8s' 
            }}>θ</span>
            <span style={{ 
              position: 'absolute', top: '85%', left: '70%', fontSize: '16px', color: 'rgba(255, 255, 255, 0.26)', 
              transform: 'rotate(25deg)', animation: 'mathFloat7 11s ease-in-out infinite 1s' 
            }}>δ</span>
            <span style={{ 
              position: 'absolute', top: '10%', left: '74%', fontSize: '13px', color: 'rgba(255, 255, 255, 0.23)', 
              transform: 'rotate(-45deg)', animation: 'mathFloat2 16s ease-in-out infinite 6s' 
            }}>≈</span>
            
            {/* Right Section - Dense Population (Brighter) */}
            <span style={{ 
              position: 'absolute', top: '35%', left: '78%', fontSize: '17px', color: 'rgba(255, 255, 255, 0.32)', 
              transform: 'rotate(30deg)', animation: 'mathFloat5 13s ease-in-out infinite 3s' 
            }}>λ</span>
            <span style={{ 
              position: 'absolute', top: '60%', left: '82%', fontSize: '15px', color: 'rgba(255, 255, 255, 0.30)', 
              transform: 'rotate(-30deg)', animation: 'mathFloat8 18s ease-in-out infinite 4s' 
            }}>π</span>
            <span style={{ 
              position: 'absolute', top: '20%', left: '86%', fontSize: '14px', color: 'rgba(255, 255, 255, 0.28)', 
              transform: 'rotate(45deg)', animation: 'mathFloat9 14.5s ease-in-out infinite 1.5s' 
            }}>α</span>
            <span style={{ 
              position: 'absolute', top: '80%', left: '90%', fontSize: '18px', color: 'rgba(255, 255, 255, 0.35)', 
              transform: 'rotate(-20deg)', animation: 'mathFloat3 12s ease-in-out infinite 7s' 
            }}>Δ</span>
            <span style={{ 
              position: 'absolute', top: '50%', left: '94%', fontSize: '16px', color: 'rgba(255, 255, 255, 0.33)', 
              transform: 'rotate(35deg)', animation: 'mathFloat6 17s ease-in-out infinite 2.5s' 
            }}>≠</span>
            
            {/* Far Right - Maximum Density (Brightest) */}
            <span style={{ 
              position: 'absolute', top: '30%', left: '97%', fontSize: '15px', color: 'rgba(255, 255, 255, 0.45)', 
              transform: 'rotate(-15deg)', animation: 'mathFloat1 14s ease-in-out infinite 5.5s' 
            }}>μ</span>
            <span style={{ 
              position: 'absolute', top: '65%', left: '96%', fontSize: '13px', color: 'rgba(255, 255, 255, 0.40)', 
              transform: 'rotate(50deg)', animation: 'mathFloat4 15s ease-in-out infinite 8s' 
            }}>ε</span>
            <span style={{ 
              position: 'absolute', top: '10%', left: '95%', fontSize: '14px', color: 'rgba(255, 255, 255, 0.48)', 
              transform: 'rotate(-40deg)', animation: 'mathFloat7 11s ease-in-out infinite 0.8s' 
            }}>∂</span>
            <span style={{ 
              position: 'absolute', top: '85%', left: '93%', fontSize: '17px', color: 'rgba(255, 255, 255, 0.50)', 
              transform: 'rotate(20deg)', animation: 'mathFloat10 16.5s ease-in-out infinite 6.2s' 
            }}>∑</span>
            <span style={{ 
              position: 'absolute', top: '42%', left: '98%', fontSize: '12px', color: 'rgba(255, 255, 255, 0.42)', 
              transform: 'rotate(-50deg)', animation: 'mathFloat2 16s ease-in-out infinite 9s' 
            }}>ω</span>
            <span style={{ 
              position: 'absolute', top: '75%', left: '99%', fontSize: '15px', color: 'rgba(255, 255, 255, 0.46)', 
              transform: 'rotate(60deg)', animation: 'mathFloat5 13s ease-in-out infinite 4.8s' 
            }}>≤</span>
          </Box>

          <Toolbar sx={{ justifyContent: 'space-between', width: '100%', maxWidth: 'none', px: 3, position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <CalculateIcon 
                  className="calculate-icon icon-pendulum icon-levitate" 
                  sx={{ 
                    mr: 2, 
                    fontSize: 32, 
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.5) rotate(720deg)',
                      filter: 'drop-shadow(0 0 25px rgba(255, 255, 255, 1))',
                    }
                  }} 
                />
              </div>
              <Box>
                <Typography variant="h4" component="div" className="title-glow" sx={{ 
                  flexGrow: 1, 
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  AI-Enhanced Web Platform for Visualizing Root-Finding Algorithms
                </Typography>
                <Typography variant="subtitle1" className="subtitle-typing" sx={{ 
                  opacity: 0.95,
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.9)',
                  display: 'inline-block',
                  maxWidth: '600px'
                }}>
                  <SchoolIcon className="icon-comet icon-glow-pulse" sx={{ fontSize: '1.2em', marginRight: '8px' }} />
                  Advanced Interactive Learning Platform for Root-Finding Algorithms
                </Typography>
              </Box>
            </Box>

          </Toolbar>
        </AppBar>

        <Box sx={{ width: '100vw', maxWidth: 'none', m: 0, p: 0 }}>
          {/* Navigation Tabs */}
          <Paper 
            elevation={3}
            className="tab-bar-slide-up"
            sx={{ 
              mb: 0, 
              borderRadius: 0,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: 'none',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              width: '100vw',
              margin: 0,
              transition: 'all 0.3s ease'
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              scrollButtons="auto"
              className="nav-bar-slide"
              sx={{
                width: '100%',
                '& .MuiTabs-indicator': {
                  height: 4,
                  borderRadius: '4px 4px 0 0',
                  background: 'linear-gradient(45deg, #1565c0, #7b1fa2, #d32f2f)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 8px rgba(21, 101, 192, 0.3)',
                },
                '& .MuiTab-root': {
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(21, 101, 192, 0.1), transparent)',
                    transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  },
                  '&:hover': {
                    background: 'rgba(21, 101, 192, 0.08)',
                    transform: 'translateY(-2px) scale(1.02)',
                    boxShadow: '0 6px 20px rgba(21, 101, 192, 0.15)',
                  },
                  '&:hover::before': {
                    left: '100%',
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(21, 101, 192, 0.12) 0%, rgba(123, 31, 162, 0.12) 100%)',
                    color: 'primary.main',
                    fontWeight: 700,
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 15px rgba(21, 101, 192, 0.2)',
                    border: '1px solid rgba(21, 101, 192, 0.2)',
                    borderRadius: '8px 8px 0 0',
                  },
                  '&:active': {
                    transform: 'translateY(0) scale(0.98)',
                  }
                }
              }}
            >
              {tabData.map((tab, index) => (
                <Tab 
                  key={index}
                  icon={tab.icon}
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