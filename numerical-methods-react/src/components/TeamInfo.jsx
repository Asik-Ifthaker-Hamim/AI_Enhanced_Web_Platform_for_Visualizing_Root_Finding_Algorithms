import React from 'react';
import './animations.css';
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
  Rocket as RocketIcon
} from '@mui/icons-material';


const projectInfo = {
  title: 'Solution of Non-linear Equations',
  version: '2.0.0',
  description: 'A comprehensive interactive learning platform for numerical root-finding algorithms with modern web technologies, developed with professional AI engineering expertise.',
  developmentTeam: 'The Epsilon Chasers',
  projectType: 'Educational Software Development',
  status: 'Completed',
  lastUpdated: 'June 2025',
  technicalLead: 'A.M Asik Ifthaker Hamim (Associate AI Engineer)'
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
    description: 'Computer Science student and Associate AI Engineer specializing in numerical computing, AI systems, and modern web development',
    contributions: [
      'Project Leadership & Architecture',
      'AI-Enhanced Algorithm Development',
      'React Frontend Development',
      'Numerical Methods Implementation', 
      'Advanced UI/UX Design',
      'Mathematical Analysis & Optimization',
      'Professional Testing & Documentation'
    ],
    skills: ['AI/ML', 'React', 'JavaScript', 'Python', 'Numerical Methods', 'Material-UI', 'Mathematical Computing', 'Software Engineering']
  },
  {
    name: 'Adrishikhar Barua',
    studentId: 'C221022',
    role: 'Algorithm Developer',
    avatar: '/adri.png',
    email: 'c221022@ugrad.iiuc.ac.bd',
    description: 'Focused on mathematical algorithm implementation and optimization',
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
    description: 'Specializes in software testing and quality assurance for numerical applications',
    contributions: [
      'Quality Assurance',
      'Test Case Development',
      'Bug Testing & Reporting',
      'Documentation Review',
      'User Experience Testing'
    ],
    skills: ['Software Testing', 'Quality Assurance', 'Documentation', 'User Testing']
  }
];

const technologies = [
  { name: 'React 18', icon: <CodeIcon className="icon-spiral icon-breathe" />, description: 'Modern UI framework with hooks', version: '18.2.0' },
  { name: 'Material-UI', icon: <PaletteIcon className="icon-morph icon-shimmer" />, description: 'Beautiful component library', version: '5.15.0' },
  { name: 'Chart.js', icon: <BarChartIcon className="icon-wave icon-magnetic" />, description: 'Interactive data visualizations', version: '4.4.0' },
  { name: 'Math.js', icon: <CalculateIcon className="icon-quantum icon-ripple" />, description: 'Mathematical expression parser', version: '12.2.0' },
  { name: 'Framer Motion', icon: <AutoAwesomeIcon className="icon-orbit icon-levitate" />, description: 'Smooth animations library', version: '10.16.0' },
  { name: 'Vite', icon: <FlashOnIcon className="icon-twist icon-glitch" />, description: 'Fast build tool and dev server', version: '5.0.0' }
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
    icon: <FunctionIcon color="primary" />,
    title: 'Six Numerical Methods',
    description: 'Complete implementation of root-finding algorithms with step-by-step visualization',
    status: '100% Complete'
  },
  {
    icon: <AssessmentIcon color="success" />,
    title: 'Interactive Visualization',
    description: 'Real-time function plotting with Chart.js and iteration tracking',
    status: '100% Complete'
  },
  {
    icon: <SpeedIcon color="warning" />,
    title: 'Performance Analysis',
    description: 'Method comparison with convergence analysis and execution metrics',
    status: '100% Complete'
  },
  {
    icon: <PsychologyIcon color="info" />,
    title: 'Advanced Utilities',
    description: 'Horner\'s Rule, Polynomial Deflation, and Incremental Search tools',
    status: '100% Complete'
  },
  {
    icon: <CodeIcon color="error" />,
    title: 'Modern Architecture',
    description: 'Built with React 18, TypeScript-ready, and responsive design',
    status: '100% Complete'
  },
  {
    icon: <SchoolIcon color="secondary" />,
    title: 'Educational Focus',
    description: 'Comprehensive learning center with tutorials and algorithm explanations',
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
  { label: 'Lines of Code', value: '2,500+', icon: <ComputerIcon className="icon-matrix icon-breathe" /> },
  { label: 'Components', value: '15+', icon: <ExtensionIcon className="icon-elastic icon-magnetic" /> },
  { label: 'Test Cases', value: '50+', icon: <BugReportIcon className="icon-jiggle icon-ripple" /> },
  { label: 'Documentation', value: '100%', icon: <DescriptionIcon className="icon-pendulum icon-shimmer" /> }
];

function TeamInfo() {
  return (
    <Box sx={{ width: '100%', maxWidth: 'none' }}>
      <div>
        <Typography variant="h4" gutterBottom className="fade-in-up glow-text" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
          <GroupsIcon className="icon-orbit icon-comet" sx={{ fontSize: '1.2em', marginRight: '10px' }} />
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
                sx={{ mb: 1 }}
              />
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={4}>
          {/* Team Information */}
          <Grid item xs={12} lg={6}>
            <Card className="fade-in-left card-hover-lift" sx={{ height: '100%', minHeight: 500, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <SchoolIcon className="icon-sway icon-subtle-glow" color="primary" />
                  Development Team
                </Typography>
                
                <Grid container spacing={3}>
                  {teamMembers.map((member, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper sx={{ p: 3, mb: 2, border: '1px solid rgba(0, 0, 0, 0.1)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                          <Avatar 
                            className="icon-glow-soft"
                            sx={{ 
                              bgcolor: (typeof member.avatar === 'string' && member.avatar.startsWith('/')) ? 'transparent' : (index === 0 ? 'primary.main' : index === 1 ? 'success.main' : 'warning.main'), 
                              width: 100, 
                              height: 100, 
                              fontSize: (typeof member.avatar === 'string' && member.avatar.startsWith('/')) ? '0px' : '32px',
                              border: '2px solid',
                              borderColor: 'primary.main',
                              boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
                              '&:hover': {
                                animation: 'pulseAnimation 1.5s ease-in-out infinite',
                                '@keyframes pulseAnimation': {
                                  '0%': {
                                    transform: 'scale(1)',
                                    boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
                                  },
                                  '50%': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 0 20px rgba(25, 118, 210, 0.4)',
                                  },
                                  '100%': {
                                    transform: 'scale(1)',
                                    boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
                                  },
                                },
                              },
                            }}
                            src={(typeof member.avatar === 'string' && member.avatar.startsWith('/')) ? member.avatar : undefined}
                          >
                            {(typeof member.avatar === 'string' && !member.avatar.startsWith('/')) ? member.avatar : (typeof member.avatar !== 'string' ? member.avatar : null)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {member.name}
                        </Typography>
                        <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 500 }}>
                          {member.role}
                        </Typography>
                        {member.professionalTitle && (
                          <Typography variant="body2" color="success.main" sx={{ fontWeight: 500, mb: 0.5 }}>
                            {member.professionalTitle}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          Student ID: {member.studentId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon className="icon-tilt icon-fade-pulse" sx={{ fontSize: '16px' }} />
                          {member.email}
                        </Typography>
                        {member.academicEmail && (
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon className="icon-bob icon-slow-pulse" sx={{ fontSize: '16px' }} />
                            {member.academicEmail}
                          </Typography>
                        )}
                          </Box>
                        </Box>
                        
                        <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                          {member.description}
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                              Key Contributions:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {member.contributions.map((contribution, idx) => (
                                <Chip
                                  key={idx}
                                  label={contribution}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                              ))}
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                              Technical Skills:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {member.skills.map((skill, idx) => (
                                <Chip
                                  key={idx}
                                  label={skill}
                                  size="small"
                                  color="secondary"
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

          {/* Course Information */}
          <Grid item xs={12} lg={4}>
            <Card className="fade-in-right card-hover-lift" sx={{ height: '100%', minHeight: 500, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <MenuBookIcon className="icon-drift icon-glow-soft" color="secondary" />
                  Academic Information
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Course" 
                      secondary={`${courseInfo.course} (${courseInfo.code})`}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <BusinessIcon className="icon-wiggle-soft icon-pulse-gentle" color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Institution" 
                      secondary={courseInfo.university}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <AccountBalanceIcon className="icon-rock icon-subtle-glow" color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Department" 
                      secondary={courseInfo.department}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <GroupsIcon className="icon-scale-breathe icon-hover-float" color="info" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Team" 
                      secondary={courseInfo.teamName}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <EventIcon className="icon-bounce-soft icon-glow-soft" color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Academic Year" 
                      secondary={`${courseInfo.semester} ${courseInfo.academicYear}`}
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Course Objectives:
                </Typography>
                <List dense>
                  {courseInfo.objectives.map((objective, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <StarIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={objective} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Instructor Information */}
          <Grid item xs={12} lg={2}>
            <Card className="fade-in-right card-hover-lift" sx={{ height: '100%', minHeight: 500, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <PersonIcon className="icon-float-gentle icon-fade-pulse" color="success" />
                  Course Instructor
                </Typography>

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    src="/Sir.jpg"
                    className="icon-glow-soft"
                    sx={{
                      width: 120,
                      height: 120,
                      margin: '0 auto',
                      mb: 2,
                      border: '3px solid',
                      borderColor: 'primary.main',
                      boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
                      '&:hover': {
                        animation: 'pulseAnimation 1.5s ease-in-out infinite',
                        '@keyframes pulseAnimation': {
                          '0%': {
                            transform: 'scale(1)',
                            boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
                          },
                          '50%': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 0 20px rgba(25, 118, 210, 0.4)',
                          },
                          '100%': {
                            transform: 'scale(1)',
                            boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
                          },
                        },
                      },
                    }}
                  />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {courseInfo.instructor}
                  </Typography>
                  <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 500, mb: 1 }}>
                    Professor of Computer Science
                  </Typography>
                  <Typography variant="subtitle2" color="secondary.main" sx={{ fontWeight: 500, mb: 2 }}>
                    Dean, Faculty of Science & Engineering, IIUC
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', mb: 2 }}>
                    <Typography 
                      variant="body2" 
                      className="icon-slide-gentle"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: 'text.secondary'
                      }}
                    >
                      <EmailIcon fontSize="small" className="icon-spin-slow" color="primary" />
                      alam_cse@yahoo.com
                    </Typography>
                    <Typography 
                      variant="body2"
                      className="icon-slide-gentle" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: 'text.secondary'
                      }}
                    >
                      <EmailIcon fontSize="small" className="icon-spin-slow" color="secondary" />
                      msa@iiuc.ac.bd
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Qualifications:
                </Typography>
                <List dense>
                  {courseInfo.qualifications.split(',').map((qual, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <SchoolIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={qual.trim()}
                        sx={{ '& .MuiListItemText-primary': { fontSize: '0.9rem' } }}
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

          {/* Project Statistics */}
          <Grid item xs={12}>
            <Card className="scale-in card-hover-lift" sx={{ minHeight: 200, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                  <BarChartIcon className="icon-slide-gentle icon-slow-pulse" color="primary" sx={{ marginRight: '10px' }} />
                  Project Statistics
                </Typography>
                <Grid container spacing={3}>
                  {projectStats.map((stat, index) => (
                    <Grid item xs={6} md={3} key={index}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                        <Typography variant="h4" sx={{ fontSize: '2rem' }}>
                          {stat.icon}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2">
                          {stat.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Technology Stack */}
          <Grid item xs={12} md={6}>
            <Card className="fade-in-left card-hover-lift" sx={{ height: '100%', minHeight: 450, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LaptopIcon className="icon-gentle-spin icon-subtle-glow" color="info" />
                  Technology Stack
                </Typography>
                
                <Grid container spacing={2}>
                  {technologies.map((tech, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h6">{tech.icon}</Typography>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {tech.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {tech.description}
                            </Typography>
                          </Box>
                          <Chip label={tech.version} size="small" color="primary" />
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Numerical Methods */}
          <Grid item xs={12} md={6}>
            <Card className="fade-in-right card-hover-lift" sx={{ height: '100%', minHeight: 450, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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

          {/* Project Features */}
          <Grid item xs={12}>
            <Card className="slide-in-bottom card-hover-lift" sx={{ minHeight: 380, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                  <RocketIcon className="icon-hover-float icon-scale-breathe" color="warning" sx={{ marginRight: '10px' }} />
                  Project Features
                </Typography>
                
                <Grid container spacing={3}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                      <div>
                        <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                          <Box sx={{ mb: 2 }}>
                            {feature.icon}
                          </Box>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {feature.description}
                          </Typography>
                          <Chip 
                            label={feature.status} 
                            color="success" 
                            size="small"
                            icon={<StarIcon />}
                          />
                        </Paper>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

        </Grid>

        {/* Footer Note */}
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="body2">
            <strong>Note:</strong> This project demonstrates advanced numerical computing concepts 
            through an interactive web application, combining mathematical rigor with modern 
            software engineering practices. All algorithms are implemented with educational 
            clarity while maintaining computational efficiency.
          </Typography>
        </Alert>
      </div>
    </Box>
  );
}

export default TeamInfo; 