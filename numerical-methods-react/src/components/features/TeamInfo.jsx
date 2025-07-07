import React from 'react';
import '../../assets/animations.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  School as SchoolIcon,
  Code as CodeIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  Functions as FunctionIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  Groups as GroupsIcon,
  Calculate as CalculateIcon,
  Science as ScienceIcon,
  Computer as ComputerIcon,
  Extension as ExtensionIcon,
  BugReport as BugReportIcon,
  Description as DescriptionIcon,
  Palette as PaletteIcon,
  BarChart as BarChartIcon,
  FlashOn as FlashOnIcon,
  AutoAwesome as AutoAwesomeIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  Event as EventIcon,
  Person as PersonIcon,
  MenuBook as MenuBookIcon,
  Laptop as LaptopIcon,
  Rocket as RocketIcon,
  LinkedIn as LinkedInIcon,
  Facebook as FacebookIcon,
  Work as WorkIcon
} from '@mui/icons-material';


const projectInfo = {
  title: 'Solution of Non-linear Equations',
  version: '2.0.0',
  description: 'A comprehensive AI-enhanced interactive learning platform for numerical root-finding algorithms with modern web technologies, featuring intelligent study assistance and advanced document processing capabilities.',
  developmentTeam: 'The Epsilon Chasers',
  projectType: 'AI-Powered Educational Software',
  status: 'Completed with AI Integration',
  lastUpdated: 'June 2025',
  technicalLead: 'A.M Asik Ifthaker Hamim (Associate AI Engineer)',
  aiFeatures: 'Google Gemini AI Study Assistant'
};

const teamMembers = [
  {
    name: 'A.M Asik Ifthaker Hamim',
    studentId: 'C221012',
    role: 'Team Leader & Lead Developer',
    professionalTitle: 'Associate AI Engineer, Liberate Labs',
    avatar: '/leader-image.png',
    email: 'asikifthakerhamim75@gmail.com',
    academicEmail: 'c221012@ugrad.iiuc.ac.bd',
    linkedIn: 'www.linkedin.com/in/a-m-asik-ifthaker-hamim-154434328',
    facebook: 'www.facebook.com/asikifthaker.hamim',
    description: 'Computer Science student and AI Engineer specializing',
    contributions: [
      'Project Leadership & Architecture',
      'AI Study Assistant Development',
      'Google Gemini AI Integration',
      'Smart PDF Processing Implementation',
      'React Frontend Development',
      'Numerical Methods Implementation', 
      'Advanced UI/UX Design',
      'Mathematical Analysis & Optimization'
    ],
    skills: ['AI/ML', 'React', 'JavaScript', 'Python', 'Numerical Methods', 'Material-UI', 'Mathematical Computing', 'Software Engineering']
  },
  {
    name: 'Adrishikhar Barua',
    studentId: 'C221022',
    role: 'Algorithm Developer',
    avatar: '/adri.png',
    email: 'c221022@ugrad.iiuc.ac.bd',
    description: 'Focused on mathematical algorithm implementation.',
    contributions: [
      'Algorithm Research',
      'Mathematical Validation',
      'Performance Optimization',
      'Code Review',
      'Testing Support'
    ],
    skills: ['Mathematics', 'Algorithm Design', 'Python', 'Numerical Analysis']
  },
  {
    name: 'Sheikh Mohammad Rajking',
    studentId: 'C221011',
    role: 'Quality Assurance & Testing',
    avatar: '/rajking.png',
    email: 'c221011@ugrad.iiuc.ac.bd',
    description: 'Specializes in software testing and quality.',
    contributions: [
      'Testing & Validation',
      'Bug Resolution',
      'Analytical Validation',
      'Performance Evaluation',
      'UX & Feature Integration',
      'Documentation Support'
    ],
    skills: ['Python', 'Software Testing','Quality Assurance', 'Documentation', 'Performance Assessment', 'Numerical Methods']
  },
  {
    name: 'Tousif Ahmed Farayzi',
    studentId: 'C223128',
    role: 'Development Team Member',
    avatar: '/Tousif.jpg',
    email: 'c223128@ugrad.iiuc.ac.bd',
    description: 'Contributing to development and testing processes',
    contributions: [
      'Code Development',
      'Testing Support',
      'Documentation',
      'Bug Fixing',
      'Feature Implementation'
    ],
    skills: ['Programming', 'Testing', 'Documentation', 'Problem Solving']
  }
];

const technologies = [
  { 
    name: 'React 18', 
    description: 'Modern UI framework with hooks', 
    version: '18.2.0',
    icon: <CodeIcon className="icon-spiral icon-breathe" />
  },
  { 
    name: 'Material-UI', 
    description: 'Beautiful component library', 
    version: '5.15.0',
    icon: <PaletteIcon className="icon-morph icon-shimmer" />
  },
  { 
    name: 'Google Gemini AI', 
    description: 'Advanced AI-powered study assistant', 
    version: '1.5 Pro',
    icon: <PsychologyIcon className="icon-quantum icon-glow" />
  },
  { 
    name: 'Chart.js', 
    description: 'Interactive data visualizations', 
    version: '4.4.0',
    icon: <BarChartIcon className="icon-wave icon-magnetic" />
  },
  { 
    name: 'Math.js', 
    description: 'Mathematical expression parser', 
    version: '12.2.0',
    icon: <CalculateIcon className="icon-quantum icon-ripple" />
  },
  { 
    name: 'PDF Processing AI', 
    description: 'AI-enhanced document analysis', 
    version: '2.1.0',
    icon: <AutoAwesomeIcon className="icon-orbit icon-magnetic" />
  },
  { 
    name: 'Framer Motion', 
    description: 'Smooth animations library', 
    version: '10.16.0',
    icon: <AutoAwesomeIcon className="icon-orbit icon-levitate" />
  },
  { 
    name: 'Vite', 
    description: 'Fast build tool and dev server', 
    version: '5.0.0',
    icon: <FlashOnIcon className="icon-twist icon-glitch" />
  }
];

const numericalMethods = [
  { name: 'Bisection Method', complexity: 'O(log n)', convergence: 'Linear', reliability: 95 },
  { name: 'Newton-Raphson', complexity: 'O(n)', convergence: 'Quadratic', reliability: 85 },
  { name: 'Secant Method', complexity: 'O(n)', convergence: 'Superlinear', reliability: 80 },
  { name: 'False Position', complexity: 'O(n)', convergence: 'Linear', reliability: 90 },
  { name: 'Fixed Point', complexity: 'O(n)', convergence: 'Linear', reliability: 75 },
  { name: 'Muller\'s Method', complexity: 'O(n)', convergence: 'Quadratic', reliability: 85 }
];

const features = [
  {
    icon: <FunctionIcon className="icon-orbit icon-glow" sx={{ color: 'white' }} />,
    title: 'Six Numerical Methods',
    description: 'Complete implementation of root-finding algorithms with step-by-step visualization',
    status: '100% Complete'
  },
  {
    icon: <AssessmentIcon className="icon-float icon-pulse" sx={{ color: 'white' }} />,
    title: 'Interactive Visualization',
    description: 'Real-time function plotting with Chart.js and iteration tracking',
    status: '100% Complete'
  },
  {
    icon: <PsychologyIcon className="icon-quantum icon-magnetic" sx={{ color: 'white' }} />,
    title: 'AI Study Assistant',
    description: 'Google Gemini-powered peer learning chatbot with PDF analysis capabilities',
    status: '100% Complete'
  },
  {
    icon: <SpeedIcon className="icon-spin icon-shimmer" sx={{ color: 'white' }} />,
    title: 'Performance Analysis',
    description: 'Method comparison with convergence analysis and execution metrics',
    status: '100% Complete'
  },
  {
    icon: <AutoAwesomeIcon className="icon-bounce icon-magnetic" sx={{ color: 'white' }} />,
    title: 'Smart PDF Processing',
    description: 'AI-enhanced document extraction and intelligent content analysis',
    status: '100% Complete'
  },
  {
    icon: <CodeIcon className="icon-wave icon-breathe" sx={{ color: 'white' }} />,
    title: 'Modern Architecture',
    description: 'Built with React 18, AI integration, and responsive design',
    status: '100% Complete'
  },
  {
    icon: <SchoolIcon className="icon-elastic icon-ripple" sx={{ color: 'white' }} />,
    title: 'Educational Focus',
    description: 'AI-powered learning center with personalized tutorials and explanations',
    status: '100% Complete'
  }
];

const courseInfo = {
  course: 'Numerical Methods',
  code: 'CSE',
  semester: 'Spring',
  academicYear: '2025',
  instructor: 'Prof. Mohammed Shamsul Alam',
  qualifications: 'B.Sc.(Hons), M.Sc. in Electronics & Computer Science (SUST), Pursuing PhD (SUST)',
  university: 'International Islamic University Chittagong (IIUC)',
  department: 'Department of Computer Science & Engineering',
  teamName: 'The Epsilon Chasers',
  description: 'Advanced computational methods for solving non-linear equations using iterative root-finding algorithms',
  objectives: [
    'Master numerical root-finding algorithms',
    'Implement efficient computational methods',
    'Analyze convergence behavior and error analysis',
    'Develop interactive educational software',
    'Compare algorithmic performance and reliability'
  ]
};

const projectStats = [
  { 
    label: 'Lines of Code', 
    value: '2,500+', 
    icon: <ComputerIcon className="icon-matrix icon-breathe" sx={{ color: 'white' }} />,
    description: 'Total lines of production code excluding comments and blank lines'
  },
  { 
    label: 'Components', 
    value: '15+', 
    icon: <ExtensionIcon className="icon-elastic icon-magnetic" sx={{ color: 'white' }} />,
    description: 'Reusable React components with Material-UI integration'
  },
  { 
    label: 'Test Cases', 
    value: '50+', 
    icon: <BugReportIcon className="icon-jiggle icon-ripple" sx={{ color: 'white' }} />,
    description: 'Comprehensive unit and integration tests for reliability'
  },
  { 
    label: 'Documentation', 
    value: '100%', 
    icon: <DescriptionIcon className="icon-pendulum icon-shimmer" sx={{ color: 'white' }} />,
    description: 'Complete code documentation and user guides'
  },
  { 
    label: 'Performance Score', 
    value: '95%', 
    icon: <SpeedIcon className="icon-spin-slow icon-glow" sx={{ color: 'white' }} />,
    description: 'Lighthouse performance and optimization metrics'
  },
  { 
    label: 'Code Coverage', 
    value: '90%', 
    icon: <AssessmentIcon className="icon-bounce icon-pulse" sx={{ color: 'white' }} />,
    description: 'Test coverage across all critical components'
  }
];

const formatDescriptionText = (text) => {
  const words = text.split(' ');
  const lines = [];
  for (let i = 0; i < words.length; i += 8) {
    lines.push(words.slice(i, i + 8).join(' '));
  }
  return lines;
};

function TeamInfo() {
  return (
    <Box sx={{ width: '100%', maxWidth: 'none' }}>
      <div>
        <Typography variant="h4" gutterBottom className="fade-in-up glow-text" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
          <GroupsIcon className="icon-rotate-left-right icon-comet" sx={{ fontSize: '1.2em', marginRight: '10px' }} />
          Project Information
        </Typography>

        {/* Project Overview */}
        <Card className="fade-in-left card-hover-lift" sx={{ mb: 4, minHeight: 200, bgcolor: 'background.paper' }}>
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                {projectInfo.title}
              </Typography>
              <Typography variant="body1" paragraph sx={{ maxWidth: 'none', mx: 'auto' }}>
                {projectInfo.description}
              </Typography>
              <Chip 
                label={`Last Updated: ${projectInfo.lastUpdated}`} 
                color="success" 
                icon={<StarIcon />}
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip 
                label={projectInfo.projectType} 
                color="primary" 
                icon={<TrophyIcon />}
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip 
                label={`Technical Lead: ${projectInfo.technicalLead}`} 
                color="secondary" 
                icon={<CodeIcon />}
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip 
                label={`AI Features: ${projectInfo.aiFeatures}`} 
                color="info" 
                icon={<PsychologyIcon />}
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip 
                label={projectInfo.status} 
                color="warning" 
                icon={<AutoAwesomeIcon />}
                sx={{ mb: 1 }}
              />
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Team Information */}
          <Grid item xs={12}>
            <Card className="fade-in-left card-hover-lift" sx={{ 
              height: '100%', 
              minHeight: 500, 
              bgcolor: 'background.paper',
              width: '102%',  // 2% wider
              position: 'relative',
              left: '0%',  // No left shift, reducing left side width
              zIndex: 1
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <SchoolIcon className="icon-sway icon-subtle-glow" color="primary" />
                  Development Team
                </Typography>
                
                <Grid container spacing={4.2}>
                  {teamMembers.map((member, index) => (
                    <Grid item xs={12} md={3} key={index} className="fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                      <Paper className="card-hover-lift icon-float-gentle" sx={{ 
                        p: 3, 
                        mb: 2, 
                        border: '1px solid rgba(0, 0, 0, 0.1)', 
                        height: '100%',
                        borderRadius: 3,
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                          transition: 'left 0.5s ease-in-out',
                        },
                        '&:hover': {
                          transform: 'translateY(-12px) scale(1.02)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                          borderColor: 'primary.main',
                          '&::before': {
                            left: '100%',
                          },
                        },
                        ...(member.name === 'Sheikh Mohammad Rajking' && {
                          width: '104%',  // 4% increase
                          position: 'relative',
                          left: '-2%',  // Center the wider card
                          zIndex: 1  // Ensure it overlaps properly
                        })
                      }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, position: 'relative', zIndex: 1 }}>
                          <Avatar 
                            className="icon-orbit icon-magnetic"
                            sx={{ 
                              bgcolor: 'transparent',
                              width: 100, 
                              height: 100, 
                              border: '3px solid',
                              borderColor: index === 0 ? 'primary.main' : index === 1 ? 'success.main' : index === 2 ? 'warning.main' : 'secondary.main',
                              boxShadow: `0 0 25px rgba(${index === 0 ? '25, 118, 210' : index === 1 ? '76, 175, 80' : index === 2 ? '255, 152, 0' : '156, 39, 176'}, 0.3)`,
                              marginBottom: 2, // Increased margin bottom from -1.5 to 2
                              position: 'relative',
                              '& img': {
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                transition: 'all 0.3s ease',
                              },
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: -3,
                                left: -3,
                                right: -3,
                                bottom: -3,
                                borderRadius: '50%',
                                background: `conic-gradient(from 0deg, ${index === 0 ? '#1976d2' : index === 1 ? '#4caf50' : index === 2 ? '#ff9800' : '#9c27b0'}, transparent 90deg, ${index === 0 ? '#1976d2' : index === 1 ? '#4caf50' : index === 2 ? '#ff9800' : '#9c27b0'})`,
                                animation: 'rotateRing 3s linear infinite',
                                zIndex: -1,
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                              },
                              '&:hover': {
                                transform: 'scale(1.1) rotate(5deg)',
                                '&::after': {
                                  opacity: 1,
                                },
                                '& img': {
                                  transform: 'scale(1.05)',
                                },
                              },
                            }}
                            src={member.avatar}
                          />
                          <Box sx={{ width: '100%', textAlign: 'center', mt: 1 }}>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700, 
                              mb: 0.5, // Reduced margin bottom from 2 to 0.5
                              color: '#000000',
                              textAlign: 'center',
                              width: '100%',
                              fontSize: '1.1rem', // Slightly reduced font size
                              letterSpacing: '0.5px' // Added letter spacing for better readability
                            }}>
                              {member.name}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ 
                              fontWeight: 500, 
                              mb: 2,
                              color: '#000000',
                              fontSize: '0.95rem', // Slightly reduced font size
                              opacity: 0.9 // Added slight transparency
                            }}>
                              {member.role}
                            </Typography>
                            {member.professionalTitle && (
                              <Typography 
                                variant="body2" 
                                className="icon-breathe" 
                                sx={{ 
                                  fontWeight: 600, 
                                  mb: 1,
                                  padding: '6px 12px',
                                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                  color: '#2e7d32',
                                  borderRadius: '12px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  border: '1px solid rgba(76, 175, 80, 0.2)',
                                  boxShadow: '0 2px 8px rgba(76, 175, 80, 0.1)',
                                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                  animation: 'glow 2s ease-in-out infinite',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: '-100%',
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                    animation: 'shimmer 2s infinite',
                                  },
                                  '&:hover': {
                                    backgroundColor: 'rgba(76, 175, 80, 0.15)',
                                    transform: 'translateY(-2px) scale(1.02)',
                                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                                    border: '1px solid rgba(76, 175, 80, 0.3)',
                                  },
                                  '@keyframes shimmer': {
                                    '0%': {
                                      left: '-100%',
                                    },
                                    '100%': {
                                      left: '100%',
                                    },
                                  },
                                  '@keyframes glow': {
                                    '0%, 100%': {
                                      boxShadow: '0 2px 8px rgba(76, 175, 80, 0.1)',
                                    },
                                    '50%': {
                                      boxShadow: '0 2px 12px rgba(76, 175, 80, 0.2)',
                                    },
                                  }
                                }}
                              >
                                <WorkIcon className="icon-spin-slow" sx={{ fontSize: '16px', color: '#2e7d32' }} />
                                {member.professionalTitle}
                              </Typography>
                            )}
                            <Typography variant="body2" className="icon-slide-gentle" color="text.secondary" sx={{ 
                              mb: 1,
                              transition: 'color 0.3s ease',
                              '&:hover': { color: 'text.primary' }
                            }}>
                              Student ID: {member.studentId}
                            </Typography>
                            <Typography variant="body2" className="icon-float" color="text.secondary" sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              gap: 1, 
                              mb: 0.5,
                              transition: 'all 0.3s ease',
                              '&:hover': { 
                                color: 'primary.main',
                                transform: 'scale(1.02)',
                              }
                            }}>
                              <EmailIcon className="icon-spin-slow icon-magnetic" sx={{ fontSize: '16px' }} />
                              {member.email}
                            </Typography>
                            {member.academicEmail && (
                              <Typography variant="body2" className="icon-drift" color="text.secondary" sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: 1,
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                  color: 'secondary.main',
                                  transform: 'scale(1.02)',
                                }
                              }}>
                                <SchoolIcon className="icon-wiggle icon-glow-soft" sx={{ fontSize: '16px' }} />
                                {member.academicEmail}
                              </Typography>
                            )}
                            {member.facebook && (
                              <Typography variant="body2" className="icon-drift" color="text.secondary" sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: 1,
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                  color: '#1877F2',  // Facebook brand color
                                  transform: 'scale(1.02)',
                                }
                              }}>
                                <FacebookIcon className="icon-wiggle icon-glow-soft" sx={{ fontSize: '16px' }} />
                                <a 
                                  href={`https://${member.facebook}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'color 0.3s ease',
                                  }}
                                  onMouseOver={(e) => e.target.style.color = '#1877F2'}
                                  onMouseOut={(e) => e.target.style.color = 'inherit'}
                                >
                                  Connect on Facebook
                                </a>
                              </Typography>
                            )}
                            {member.linkedIn && (
                              <Typography variant="body2" className="icon-drift" color="text.secondary" sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: 1,
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                  color: '#0077B5',  // LinkedIn brand color
                                  transform: 'scale(1.02)',
                                }
                              }}>
                                <LinkedInIcon className="icon-wiggle icon-glow-soft" sx={{ fontSize: '16px' }} />
                                <a 
                                  href={`https://${member.linkedIn}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'color 0.3s ease',
                                  }}
                                  onMouseOver={(e) => e.target.style.color = '#0077B5'}
                                  onMouseOut={(e) => e.target.style.color = 'inherit'}
                                >
                                  Connect on LinkedIn
                                </a>
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          {formatDescriptionText(member.description).map((line, idx) => (
                            <Typography 
                              key={idx}
                              variant="body1" 
                              sx={{ 
                                lineHeight: '1.6',
                                display: 'block'
                              }}
                            >
                              {line}
                            </Typography>
                          ))}
                        </Box>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                              Key Contributions:
                            </Typography>
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              gap: 0.5 
                            }}>
                              {member.contributions.map((contribution, idx) => (
                                <Chip
                                  key={idx}
                                  label={contribution}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  className="icon-gentle-pulse"
                                  sx={{ 
                                    justifyContent: 'flex-start', 
                                    maxWidth: '100%',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                      transform: 'translateX(8px) scale(1.05)',
                                      backgroundColor: 'primary.main',
                                      color: 'white',
                                      borderColor: 'primary.main',
                                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                      '& .MuiChip-label': {
                                        fontWeight: 600,
                                      }
                                    }
                                  }}
                                />
                              ))}
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 1 }}>
                              Technical Skills:
                            </Typography>
                            <Box sx={{ 
                              display: 'grid', 
                              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                              gap: 0.5 
                            }}>
                              {member.skills.map((skill, idx) => (
                                <Chip
                                  key={idx}
                                  label={skill}
                                  size="small"
                                  color="secondary"
                                  className="icon-gentle-pulse"
                                  sx={{ 
                                    justifyContent: 'center',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                      transform: 'translateX(8px) scale(1.05)',
                                      backgroundColor: 'secondary.main',
                                      color: 'white',
                                      borderColor: 'secondary.main',
                                      boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                                      '& .MuiChip-label': {
                                        fontWeight: 600,
                                      }
                                    }
                                  }}
                                />
                              ))}
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Academic Information */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card className="fade-in-right card-hover-lift" sx={{ 
              height: '100%', 
              minHeight: 500, 
              bgcolor: 'background.paper',
              width: '431px'
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <MenuBookIcon className="icon-drift icon-glow-soft" color="secondary" />
                  Academic Information
                </Typography>
                
                <List sx={{ textAlign: 'left' }}>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: '40px' }}>
                      <SchoolIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Course" 
                      secondary={`${courseInfo.course} (${courseInfo.code})`}
                      sx={{ 
                        '& .MuiListItemText-primary': { 
                          fontSize: '0.9rem',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: 'text.primary'
                        },
                        '& .MuiListItemText-secondary': {
                          textAlign: 'left',
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: '40px' }}>
                      <BusinessIcon className="icon-wiggle-soft icon-pulse-gentle" color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Institution" 
                      secondary={courseInfo.university}
                      sx={{ 
                        '& .MuiListItemText-primary': { 
                          fontSize: '0.9rem',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: 'text.primary'
                        },
                        '& .MuiListItemText-secondary': {
                          textAlign: 'left',
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: '40px' }}>
                      <AccountBalanceIcon className="icon-rock icon-subtle-glow" color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Department" 
                      secondary={courseInfo.department}
                      sx={{ 
                        '& .MuiListItemText-primary': { 
                          fontSize: '0.9rem',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: 'text.primary'
                        },
                        '& .MuiListItemText-secondary': {
                          textAlign: 'left',
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: '40px' }}>
                      <GroupsIcon className="icon-scale-breathe icon-hover-float" color="info" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Team" 
                      secondary={courseInfo.teamName}
                      sx={{ 
                        '& .MuiListItemText-primary': { 
                          fontSize: '0.9rem',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: 'text.primary'
                        },
                        '& .MuiListItemText-secondary': {
                          textAlign: 'left',
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                  </ListItem>
                  
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: '40px' }}>
                      <EventIcon className="icon-bounce-soft icon-glow-soft" color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Academic Year" 
                      secondary={`${courseInfo.semester} ${courseInfo.academicYear}`}
                      sx={{ 
                        '& .MuiListItemText-primary': { 
                          fontSize: '0.9rem',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: 'text.primary'
                        },
                        '& .MuiListItemText-secondary': {
                          textAlign: 'left',
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, textAlign: 'left' }}>
                  Course Objectives:
                </Typography>
                <List dense sx={{ textAlign: 'left' }}>
                  {courseInfo.objectives.map((objective, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: '32px' }}>
                        <StarIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={objective}
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '0.9rem',
                            textAlign: 'left'
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Course Instructor */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card className="fade-in-right card-hover-lift" sx={{ 
              height: '100%', 
              minHeight: 500, 
              bgcolor: 'background.paper',
              width: '448px'
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <PersonIcon className="icon-float-gentle icon-fade-pulse" color="success" />
                  Course Instructor
                </Typography>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    src="/Sir.jpg"
                    alt={courseInfo.instructor}
                    className="icon-orbit icon-magnetic"
                    sx={{
                      bgcolor: 'transparent',
                      width: 120,
                      height: 120,
                      margin: '0 auto',
                      border: '3px solid',
                      borderColor: 'success.main',
                      boxShadow: '0 0 25px rgba(76, 175, 80, 0.3)',
                      marginBottom: -1.5,
                      position: 'relative',
                      '& img': {
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        transition: 'all 0.3s ease',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: -3,
                        left: -3,
                        right: -3,
                        bottom: -3,
                        borderRadius: '50%',
                        background: 'conic-gradient(from 0deg, #4caf50, transparent 90deg, #4caf50)',
                        animation: 'rotateRing 3s linear infinite',
                        zIndex: -1,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover': {
                        transform: 'scale(1.1) rotate(5deg)',
                        '&::after': {
                          opacity: 1,
                        },
                        '& img': {
                          transform: 'scale(1.05)',
                        },
                      },
                      '@keyframes rotateRing': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}>
                      {courseInfo.instructor.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box sx={{ width: '100%', textAlign: 'center', mt: 3 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        mb: 2,
                        color: '#000000',
                        textAlign: 'center',
                        width: '100%'
                      }}>
                        {courseInfo.instructor}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 500, 
                        mb: 2,
                        color: '#000000'
                      }}>
                        Professor of Computer Science
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', mb: 2 }}>
                      <Typography 
                        variant="body2" 
                        className="icon-float"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: 1, 
                          mb: 0.5,
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            color: 'primary.main',
                            transform: 'scale(1.02)',
                          }
                        }}
                      >
                        <EmailIcon className="icon-spin-slow icon-magnetic" fontSize="small" />
                        alam_cse@yahoo.com
                      </Typography>
                      <Typography 
                        variant="body2"
                        className="icon-drift" 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: 1,
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            color: 'secondary.main',
                            transform: 'scale(1.02)',
                          }
                        }}
                      >
                        <EmailIcon className="icon-spin-slow icon-magnetic" fontSize="small" color="secondary" />
                        msa@iiuc.ac.bd
                      </Typography>
                    </Box>
                  </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Qualifications:
                </Typography>
                <List dense sx={{ textAlign: 'left' }}>
                  {courseInfo.qualifications.split(',').map((qual, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: '32px' }}>
                        <SchoolIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={qual.trim()}
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '0.9rem',
                            textAlign: 'left'
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                  {courseInfo.university}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Implemented Methods */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card className="fade-in-right card-hover-lift" sx={{ 
              height: '100%', 
              minHeight: 500, 
              bgcolor: 'background.paper',
              width: '431px'
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <CalculateIcon className="icon-rotate-slow icon-glow-soft" color="secondary" />
                  Implemented Methods
                </Typography>
                
                {numericalMethods.map((method, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {method.name}
                      </Typography>
                      <Chip label={`${method.reliability}%`} size="small" color="success" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Complexity: {method.complexity} | Convergence: {method.convergence}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={method.reliability} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Technology Stack */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card className="fade-in-left card-hover-lift" sx={{ 
              height: '100%', 
              minHeight: 500, 
              bgcolor: 'background.paper',
              width: '414px'
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <LaptopIcon className="icon-gentle-spin icon-subtle-glow" color="info" />
                  Technology Stack
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {technologies.map((tech, index) => (
                    <Paper 
                      key={index}
                      variant="outlined" 
                      sx={{ 
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'background.default',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'background.paper',
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      <Box sx={{ 
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: index % 2 === 0 ? 'primary.light' : 'secondary.light',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        flexShrink: 0
                      }}>
                        {tech.icon}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {tech.name}
                          </Typography>
                          <Chip 
                            label={tech.version} 
                            size="small" 
                            color={index % 2 === 0 ? "primary" : "secondary"}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {tech.description}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Project Stats and Features Row */}
          <Grid item xs={12}>
            <Grid container spacing={4} sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              '& .content-card': {
                width: '500px',  // Fixed width for all cards based on longest content
                maxWidth: '100%'
              }
            }}>
              {/* Project Statistics */}
              <Grid item xs={12} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card className="scale-in card-hover-lift" sx={{ 
                  height: '100%', 
                  bgcolor: 'background.paper',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: 2,
                  width: '100%',
                  maxWidth: '500px'  // Match content card width
                }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <BarChartIcon className="icon-slide-gentle icon-slow-pulse" color="primary" />
                      Project Statistics
                    </Typography>
                    <Grid container spacing={2}>
                      {projectStats.map((stat, index) => (
                        <Grid item xs={12} key={index}>
                          <Paper className="content-card" sx={{ 
                            p: 2, 
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            minHeight: '90px',
                            mx: 'auto',  // Center the card
                            '&:hover': {
                              borderColor: 'primary.main',
                              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            }
                          }}>
                            <Box sx={{ 
                              borderRadius: 1,
                              bgcolor: 'primary.main',
                              color: 'white',
                              width: '48px',
                              height: '48px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {stat.icon}
                            </Box>
                            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                mb: 1,
                                gap: 1,
                                flexWrap: 'wrap'
                              }}>
                                <Typography 
                                  variant="subtitle1" 
                                  sx={{ 
                                    fontWeight: 600,
                                    flex: '1 1 auto',
                                    minWidth: 0
                                  }}
                                >
                                  {stat.label}
                                </Typography>
                                <Chip 
                                  label={stat.value}
                                  color="primary"
                                  size="small"
                                  sx={{ 
                                    fontWeight: 600,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    flexShrink: 0
                                  }}
                                />
                              </Box>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  lineHeight: 1.4
                                }}
                              >
                                {stat.description}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Project Features */}
              <Grid item xs={12} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card className="slide-in-bottom card-hover-lift" sx={{ 
                  height: '100%', 
                  bgcolor: 'background.paper',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: 2,
                  width: '100%',
                  maxWidth: '500px'  // Match content card width
                }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <RocketIcon className="icon-hover-float icon-scale-breathe" color="warning" />
                      Project Features
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {features.map((feature, index) => (
                        <Grid item xs={12} key={index}>
                          <Paper className="content-card" sx={{ 
                            p: 2, 
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            minHeight: '90px',
                            mx: 'auto',  // Center the card
                            '&:hover': {
                              borderColor: 'primary.main',
                              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            }
                          }}>
                            <Box sx={{ 
                              borderRadius: 1,
                              bgcolor: 'primary.main',
                              color: 'white',
                              width: '48px',
                              height: '48px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {feature.icon}
                            </Box>
                            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                mb: 1,
                                gap: 1,
                                flexWrap: 'wrap'
                              }}>
                                <Typography 
                                  variant="subtitle1" 
                                  sx={{ 
                                    fontWeight: 600,
                                    flex: '1 1 auto',
                                    minWidth: 0
                                  }}
                                >
                                  {feature.title}
                                </Typography>
                                <Chip 
                                  label={feature.status}
                                  color="success"
                                  size="small"
                                  icon={<StarIcon />}
                                  sx={{ 
                                    flexShrink: 0,
                                    '& .MuiChip-icon': { fontSize: '1rem' }
                                  }}
                                />
                              </Box>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  lineHeight: 1.4
                                }}
                              >
                                {feature.description}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Footer Note */}
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> This project demonstrates advanced numerical computing concepts 
                through an interactive web application, combining mathematical rigor with modern 
                software engineering practices. All algorithms are implemented with educational 
                clarity while maintaining computational efficiency.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </div>
    </Box>
  );
}

export default TeamInfo; 