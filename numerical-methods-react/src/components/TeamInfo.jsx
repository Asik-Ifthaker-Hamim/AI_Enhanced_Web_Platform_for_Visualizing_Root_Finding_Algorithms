import React from 'react';
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
  EmojiEvents as TrophyIcon
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
    avatar: '/leader-image.jpg',
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
    avatar: '🧮',
    email: 'adrishikhar@iiuc.ac.bd',
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
    avatar: '🔬',
    email: 'rajking@iiuc.ac.bd',
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
  { name: 'React 18', icon: '⚛️', description: 'Modern UI framework with hooks', version: '18.2.0' },
  { name: 'Material-UI', icon: '🎨', description: 'Beautiful component library', version: '5.15.0' },
  { name: 'Chart.js', icon: '📊', description: 'Interactive data visualizations', version: '4.4.0' },
  { name: 'Math.js', icon: '🧮', description: 'Mathematical expression parser', version: '12.2.0' },
  { name: 'Framer Motion', icon: '🌟', description: 'Smooth animations library', version: '10.16.0' },
  { name: 'Vite', icon: '⚡', description: 'Fast build tool and dev server', version: '5.0.0' }
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
  code: 'CSE / MATH',
  semester: 'Spring 2025',
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
  { label: 'Lines of Code', value: '2,500+', icon: '💻' },
  { label: 'Components', value: '15+', icon: '🧩' },
  { label: 'Test Cases', value: '50+', icon: '🧪' },
  { label: 'Documentation', value: '100%', icon: '📚' }
];

function TeamInfo() {
  return (
    <Box sx={{ width: '100%', maxWidth: 'none' }}>
      <div>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
          👥 Project Information
        </Typography>

        {/* Project Overview */}
        <Card sx={{ mb: 4 }}>
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
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  🎓 Development Team
                </Typography>
                
                <Grid container spacing={3}>
                  {teamMembers.map((member, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper sx={{ p: 3, mb: 2, border: '1px solid rgba(0, 0, 0, 0.1)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                          <Avatar sx={{ 
                            bgcolor: member.avatar.startsWith('/') ? 'transparent' : (index === 0 ? 'primary.main' : index === 1 ? 'success.main' : 'warning.main'), 
                            width: 60, 
                            height: 60, 
                            fontSize: member.avatar.startsWith('/') ? '0px' : '28px',
                            boxShadow: 2
                          }}
                          src={member.avatar.startsWith('/') ? member.avatar : undefined}
                          >
                            {!member.avatar.startsWith('/') && member.avatar}
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
                        <Typography variant="body2" color="text.secondary">
                          📧 {member.email}
                        </Typography>
                        {member.academicEmail && (
                          <Typography variant="body2" color="text.secondary">
                            🎓 {member.academicEmail}
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
          <Grid item xs={12} lg={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  📚 Academic Information
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
                      <Box sx={{ fontSize: '24px' }}>🏫</Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Institution" 
                      secondary={courseInfo.university}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Box sx={{ fontSize: '24px' }}>🏛️</Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Department" 
                      secondary={courseInfo.department}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Box sx={{ fontSize: '24px' }}>👥</Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Team" 
                      secondary={courseInfo.teamName}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Box sx={{ fontSize: '24px' }}>📅</Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Academic Year" 
                      secondary={`${courseInfo.semester} ${courseInfo.academicYear}`}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Box sx={{ fontSize: '24px' }}>👨‍🏫</Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Course Instructor" 
                      secondary={`${courseInfo.instructor}`}
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Box sx={{ fontSize: '24px' }}>🎓</Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Qualifications" 
                      secondary={courseInfo.qualifications}
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

          {/* Project Statistics */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                  📊 Project Statistics
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
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  💻 Technology Stack
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
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  🧮 Implemented Methods
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
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                  🚀 Project Features
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