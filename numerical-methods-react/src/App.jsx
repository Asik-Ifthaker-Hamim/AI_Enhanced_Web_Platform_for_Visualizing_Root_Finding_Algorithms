import React, { useState } from 'react';
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
import { motion } from 'framer-motion';
import CalculateIcon from '@mui/icons-material/Calculate';
import EquationSolver from './components/EquationSolver';
import MethodComparison from './components/MethodComparison';
import Utilities from './components/Utilities';
import TeamInfo from './components/TeamInfo';
import LearningCenter from './components/LearningCenter';

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ pt: 2 }}>
            {children}
          </Box>
        </motion.div>
      )}
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      `}</style>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: 'background.default', width: '100vw', overflow: 'hidden' }}>
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
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <CalculateIcon sx={{ mr: 2, fontSize: 32, color: 'white' }} />
              </motion.div>
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
              <Typography variant="body2" sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 500
              }}>
                v2.0.0
              </Typography>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Typography variant="h6" sx={{ color: '#4caf50' }}>
                  ✅ Live Demo
                </Typography>
              </motion.div>
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
    </ThemeProvider>
  );
}

export default App;
