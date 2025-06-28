import React, { useState, useEffect } from 'react';
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Paper,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  EmojiEmotions as EmojiIcon,
  School as SchoolIcon,
  Calculate as CalculateIcon,
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
  QuestionMark as QuestionMarkIcon
} from '@mui/icons-material';

import { initializeGemini, isGeminiInitialized } from '../utils/geminiService';

// Default API key
const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Study buddy persona prompt
const STUDY_BUDDY_PROMPT = `You are Alex, a CS student who is ALSO learning numerical methods alongside the user. You're study partners, not teacher-student. Keep responses SHORT (2-3 sentences max).

CORE BEHAVIOR:
- You're learning too! Share your own questions and confusion
- Ask simple questions to test your own understanding
- When asked for solutions, suggest working through it together instead
- Don't give direct answers - explore concepts together
- Share your learning struggles and discoveries

RESPONSE STYLE:
- Maximum 2-3 short sentences with emojis 😊
- Ask questions about basics to check your understanding
- Say things like "I'm still figuring out..." or "Wait, let me think..."
- Suggest collaborative problem-solving

LEARNING TOGETHER:
- "I'm confused about convergence too! 🤔 Can you explain why Bisection always works?"
- "Hmm, derivatives in Newton-Raphson... I keep forgetting when to use them 😅 What's your approach?"
- "Instead of giving you the answer, want to work through this step by step? I need practice too!"
- "I'm still learning when to pick which method... what made you choose that one?"

WHEN ASKED FOR SOLUTIONS:
- Don't give direct answers
- Suggest working together: "Let's figure this out together! Where should we start?"
- Ask clarifying questions about their approach
- Share your own uncertainty

TONE: Curious study partner who learns by discussing, not teaching!`;

const StudyBuddyChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'alex',
      content: "Hey there! I'm Alex, your study buddy for numerical methods! Got questions about root-finding? I'm here to help!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const inputRef = React.useRef(null);

  // Initialize Gemini on component mount
  useEffect(() => {
    if (!isGeminiInitialized()) {
      try {
        initializeGemini(DEFAULT_API_KEY);
      } catch (error) {
        console.error('Failed to initialize Gemini for Study Buddy:', error);
      }
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    if (scrollContainer && messages.length > 1) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages.length]);

  // Update unread count when dialog is closed
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'alex') {
        setUnreadCount(prev => prev + 1);
      }
    } else if (isOpen) {
      setUnreadCount(0);
      // Focus input when dialog opens
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300); // Wait for dialog animation to complete
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Focus back to input after a short delay to ensure state updates are complete
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);

    try {
      // Create conversation context from recent messages
      const recentMessages = messages.slice(-6); // Last 6 messages for context
      const conversationContext = recentMessages
        .map(msg => `${msg.sender === 'alex' ? 'Alex' : 'Student'}: ${msg.content}`)
        .join('\n');

      const fullPrompt = `${STUDY_BUDDY_PROMPT}

CONVERSATION HISTORY:
${conversationContext}
Student: ${userMessage.content}

Alex:`;

      // Initialize Gemini model for streaming
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(DEFAULT_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

             // Get response from Gemini
       const result = await model.generateContent(fullPrompt);
       const responseText = result.response.text();

       // Add Alex's response message
       const alexMessage = {
         id: Date.now() + 1,
         sender: 'alex',
         content: responseText,
         timestamp: new Date()
       };

       setMessages(prev => [...prev, alexMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'alex',
        content: "Oops! I'm having trouble connecting right now. Can you try asking again? I really want to help you with those numerical methods!",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      // Focus back to input after response is received
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getSuggestedQuestions = () => [
    "How does Newton-Raphson method actually work?",
    "When should I use Bisection vs Secant method?",
    "I'm confused about convergence rates... help?",
    "Can you explain derivatives in numerical methods?",
    "What are some real-world uses of root finding?"
  ];

    const MessageBubble = React.memo(({ message }) => {
    const isAlex = message.sender === 'alex';
    
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: isAlex ? 'flex-start' : 'flex-end',
        mb: 2
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isAlex ? 'row' : 'row-reverse',
          alignItems: 'flex-end',
          maxWidth: '80%'
        }}>
          <Avatar sx={{ 
             bgcolor: isAlex ? 'primary.main' : 'secondary.main',
             width: 32,
             height: 32,
             mx: 1,
             fontSize: 18
           }} className={isAlex ? 'icon-soft-bounce' : ''}>
             {isAlex ? (
               <img 
                 src="/alex-avatar.png" 
                 alt="Alex" 
                 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
               />
             ) : <SchoolIcon className="icon-glow-soft" />}
           </Avatar>
          
          <Paper sx={{
            p: 2,
            bgcolor: isAlex ? 'grey.100' : 'primary.main',
            color: isAlex ? 'text.primary' : 'white',
            borderRadius: isAlex ? '20px 20px 20px 5px' : '20px 20px 5px 20px',
            position: 'relative'
          }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {message.content}
            </Typography>
            
            {message.isError && (
              <Chip 
                icon={<EmojiIcon />}
                label="Connection Issue"
                size="small"
                color="error"
                sx={{ mt: 1 }}
              />
            )}
          </Paper>
        </Box>
      </Box>
    );
  });

  return (
    <>
      {/* Floating Action Button */}
      <Box sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1300
      }}>
        <Tooltip title="Chat with Alex - Your Numerical Methods Study Buddy!" placement="left">
          <Fab
            color="primary"
            onClick={() => setIsOpen(true)}
            sx={{
              background: 'linear-gradient(45deg, #1565c0, #7b1fa2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #0d47a1, #6a1b9a)',
                transform: 'scale(1.05) translateY(-2px)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              boxShadow: '0 4px 20px rgba(21, 101, 192, 0.3)',
            }}
            className="pulse-button"
          >
            <img 
              src="/alex-avatar.png" 
              alt="Alex" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                borderRadius: '50%'
              }}
            />
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                color="error"
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  minWidth: 20,
                  height: 20,
                  fontSize: '0.7rem',
                  animation: 'iconPulse 2s ease-in-out infinite'
                }}
              />
            )}
          </Fab>
        </Tooltip>
      </Box>

      {/* Chat Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: '85vh',
            width: '520px',
            position: 'fixed',
            bottom: 90,
            right: 20,
            m: 0,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          }
        }}
        className="fade-in-up"
      >
        {/* Header */}
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #1565c0, #7b1fa2, #0d47a1)',
          color: 'white',
          py: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
            animation: 'loadingShimmer 3s ease-in-out infinite'
          }
        }}>
          {/* Header Mathematical Symbols */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
            <span style={{ 
              position: 'absolute', top: '15%', left: '5%', fontSize: '12px', color: 'rgba(255, 255, 255, 0.15)', 
              transform: 'rotate(25deg)', animation: 'mathFloat1 10s ease-in-out infinite' 
            }}>∂</span>
            <span style={{ 
              position: 'absolute', top: '70%', right: '8%', fontSize: '14px', color: 'rgba(255, 255, 255, 0.12)', 
              transform: 'rotate(-15deg)', animation: 'mathFloat2 12s ease-in-out infinite 2s' 
            }}>∑</span>
            <span style={{ 
              position: 'absolute', top: '25%', right: '20%', fontSize: '10px', color: 'rgba(255, 255, 255, 0.1)', 
              transform: 'rotate(45deg)', animation: 'mathFloat3 8s ease-in-out infinite 1s' 
            }}>π</span>
            <span style={{ 
              position: 'absolute', top: '60%', left: '15%', fontSize: '11px', color: 'rgba(255, 255, 255, 0.14)', 
              transform: 'rotate(-30deg)', animation: 'mathFloat4 11s ease-in-out infinite 3s' 
            }}>δ</span>
            <span style={{ 
              position: 'absolute', top: '40%', left: '85%', fontSize: '13px', color: 'rgba(255, 255, 255, 0.11)', 
              transform: 'rotate(60deg)', animation: 'mathFloat5 9s ease-in-out infinite 1.5s' 
            }}>∞</span>
            <span style={{ 
              position: 'absolute', top: '80%', left: '40%', fontSize: '9px', color: 'rgba(255, 255, 255, 0.13)', 
              transform: 'rotate(-45deg)', animation: 'mathFloat6 13s ease-in-out infinite 4s' 
            }}>≠</span>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
               <Avatar sx={{ 
                 bgcolor: 'rgba(255,255,255,0.2)', 
                 fontSize: 20,
                 border: '2px solid rgba(255,255,255,0.3)'
               }} className="icon-float-gentle">
                 <img 
                   src="/alex-avatar.png" 
                   alt="Alex" 
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                 />
               </Avatar>
               <Box>
                 <Typography variant="h6" sx={{ 
                   display: 'flex', 
                   alignItems: 'center', 
                   gap: 1,
                   fontWeight: 600
                 }}>
                   Alex <CalculateIcon className="icon-rotate-slow" sx={{ fontSize: 20 }} /> Study Buddy
                 </Typography>
                 <Typography variant="caption" sx={{ 
                   opacity: 0.9,
                   display: 'flex',
                   alignItems: 'center',
                   gap: 0.5
                 }}>
                   {isTyping ? (
                     <>
                       <PsychologyIcon className="icon-pulse-gentle" sx={{ fontSize: 14 }} />
                       Thinking...
                     </>
                   ) : (
                     <>
                       <span style={{ 
                         width: 8, 
                         height: 8, 
                         borderRadius: '50%', 
                         backgroundColor: '#4caf50',
                         display: 'inline-block',
                         animation: 'iconPulse 2s ease-in-out infinite'
                       }}></span>
                       Online • Ready to help!
                     </>
                   )}
                 </Typography>
               </Box>
            </Box>
            <IconButton 
              onClick={() => setIsOpen(false)} 
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease'
              }}
              className="icon-hover-float"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        {/* Messages Area */}
        <DialogContent sx={{ 
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: '#f8f9fa',
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(21, 101, 192, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(123, 31, 162, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(21, 101, 192, 0.02) 0%, transparent 70%),
            linear-gradient(135deg, rgba(21, 101, 192, 0.02) 0%, rgba(123, 31, 162, 0.02) 100%)
          `,

        }}>
          <Box 
             data-scroll-container
             sx={{ 
               flex: 1,
               p: 2,
               overflowY: 'auto',
               overflowAnchor: 'none',
               position: 'relative',
               '&::-webkit-scrollbar': {
                 width: '6px'
               },
               '&::-webkit-scrollbar-thumb': {
                 backgroundColor: 'rgba(0,0,0,0.2)',
                 borderRadius: '3px'
               }
             }}>
             {/* Random Mathematical Symbols Background */}
             <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
               <span style={{ 
                 position: 'absolute', top: '12%', left: '8%', fontSize: '18px', color: 'rgba(21, 101, 192, 0.1)', 
                 transform: 'rotate(15deg)', animation: 'mathFloat1 12s ease-in-out infinite' 
               }}>∑</span>
               <span style={{ 
                 position: 'absolute', top: '25%', right: '15%', fontSize: '16px', color: 'rgba(123, 31, 162, 0.12)', 
                 transform: 'rotate(-20deg)', animation: 'mathFloat2 15s ease-in-out infinite 2s' 
               }}>∫</span>
               <span style={{ 
                 position: 'absolute', top: '45%', left: '20%', fontSize: '14px', color: 'rgba(21, 101, 192, 0.08)', 
                 transform: 'rotate(45deg)', animation: 'mathFloat3 18s ease-in-out infinite 4s' 
               }}>∂</span>
               <span style={{ 
                 position: 'absolute', top: '35%', right: '25%', fontSize: '20px', color: 'rgba(123, 31, 162, 0.1)', 
                 transform: 'rotate(-10deg)', animation: 'mathFloat4 14s ease-in-out infinite 1s' 
               }}>π</span>
               <span style={{ 
                 position: 'absolute', top: '60%', left: '10%', fontSize: '15px', color: 'rgba(21, 101, 192, 0.09)', 
                 transform: 'rotate(25deg)', animation: 'mathFloat5 16s ease-in-out infinite 3s' 
               }}>ε</span>
               <span style={{ 
                 position: 'absolute', top: '70%', right: '20%', fontSize: '17px', color: 'rgba(123, 31, 162, 0.11)', 
                 transform: 'rotate(-35deg)', animation: 'mathFloat6 13s ease-in-out infinite 5s' 
               }}>δ</span>
               <span style={{ 
                 position: 'absolute', top: '15%', left: '45%', fontSize: '16px', color: 'rgba(21, 101, 192, 0.1)', 
                 transform: 'rotate(60deg)', animation: 'mathFloat7 17s ease-in-out infinite 2.5s' 
               }}>Δ</span>
               <span style={{ 
                 position: 'absolute', top: '80%', left: '30%', fontSize: '14px', color: 'rgba(123, 31, 162, 0.08)', 
                 transform: 'rotate(-15deg)', animation: 'mathFloat8 11s ease-in-out infinite 6s' 
               }}>≈</span>
               <span style={{ 
                 position: 'absolute', top: '30%', left: '60%', fontSize: '18px', color: 'rgba(21, 101, 192, 0.12)', 
                 transform: 'rotate(30deg)', animation: 'mathFloat9 19s ease-in-out infinite 1.5s' 
               }}>∞</span>
               <span style={{ 
                 position: 'absolute', top: '55%', right: '10%', fontSize: '15px', color: 'rgba(123, 31, 162, 0.09)', 
                 transform: 'rotate(-25deg)', animation: 'mathFloat10 14.5s ease-in-out infinite 3.5s' 
               }}>√</span>
               <span style={{ 
                 position: 'absolute', top: '20%', right: '35%', fontSize: '16px', color: 'rgba(21, 101, 192, 0.1)', 
                 transform: 'rotate(40deg)', animation: 'mathFloat1 16.5s ease-in-out infinite 4.5s' 
               }}>±</span>
               <span style={{ 
                 position: 'absolute', top: '75%', left: '50%', fontSize: '14px', color: 'rgba(123, 31, 162, 0.11)', 
                 transform: 'rotate(-30deg)', animation: 'mathFloat2 12.5s ease-in-out infinite 7s' 
               }}>≤</span>
               <span style={{ 
                 position: 'absolute', top: '40%', left: '5%', fontSize: '17px', color: 'rgba(21, 101, 192, 0.08)', 
                 transform: 'rotate(50deg)', animation: 'mathFloat3 15.5s ease-in-out infinite 2.8s' 
               }}>≥</span>
               <span style={{ 
                 position: 'absolute', top: '85%', right: '40%', fontSize: '15px', color: 'rgba(123, 31, 162, 0.1)', 
                 transform: 'rotate(-40deg)', animation: 'mathFloat4 13.5s ease-in-out infinite 5.5s' 
               }}>→</span>
               <span style={{ 
                 position: 'absolute', top: '50%', left: '75%', fontSize: '16px', color: 'rgba(21, 101, 192, 0.09)', 
                 transform: 'rotate(20deg)', animation: 'mathFloat5 17.5s ease-in-out infinite 1.8s' 
               }}>≠</span>
               <span style={{ 
                 position: 'absolute', top: '65%', right: '45%', fontSize: '18px', color: 'rgba(123, 31, 162, 0.12)', 
                 transform: 'rotate(-45deg)', animation: 'mathFloat6 14.8s ease-in-out infinite 4.2s' 
               }}>∇</span>
               <span style={{ 
                 position: 'absolute', top: '10%', left: '70%', fontSize: '14px', color: 'rgba(21, 101, 192, 0.1)', 
                 transform: 'rotate(35deg)', animation: 'mathFloat7 16.2s ease-in-out infinite 6.5s' 
               }}>θ</span>
               <span style={{ 
                 position: 'absolute', top: '90%', left: '15%', fontSize: '16px', color: 'rgba(123, 31, 162, 0.08)', 
                 transform: 'rotate(-20deg)', animation: 'mathFloat8 18.5s ease-in-out infinite 3.2s' 
               }}>λ</span>
               <span style={{ 
                 position: 'absolute', top: '25%', left: '35%', fontSize: '15px', color: 'rgba(21, 101, 192, 0.11)', 
                 transform: 'rotate(55deg)', animation: 'mathFloat9 11.5s ease-in-out infinite 7.5s' 
               }}>μ</span>
               <span style={{ 
                 position: 'absolute', top: '45%', right: '60%', fontSize: '17px', color: 'rgba(123, 31, 162, 0.09)', 
                 transform: 'rotate(-50deg)', animation: 'mathFloat10 13.2s ease-in-out infinite 4.8s' 
               }}>α</span>
             </Box>
             
             <Box sx={{ position: 'relative', zIndex: 1 }}>
               {messages.map((message) => (
                 <MessageBubble key={message.id} message={message} />
               ))}
               
               {/* Quick suggestions for first interaction */}
               {messages.length <= 1 && (
                 <Box sx={{ mt: 2 }}>
                   <Typography variant="caption" color="text.secondary" sx={{ 
                     mb: 1, 
                     display: 'flex',
                     alignItems: 'center',
                     gap: 0.5,
                     fontWeight: 500
                   }}>
                     <LightbulbIcon className="icon-glow-soft" sx={{ fontSize: 14 }} /> Try asking Alex about:
                   </Typography>
                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                     {getSuggestedQuestions().slice(0, 3).map((question, idx) => (
                       <Chip
                         key={idx}
                         label={question}
                         size="small"
                         variant="outlined"
                         onClick={() => setInputMessage(question)}
                         sx={{ 
                           cursor: 'pointer',
                           '&:hover': {
                             backgroundColor: 'primary.light',
                             color: 'white',
                             transform: 'translateY(-1px)',
                           },
                           transition: 'all 0.2s ease'
                         }}
                         className="chip-slide-in"
                         icon={<QuestionMarkIcon className="icon-wiggle-soft" sx={{ fontSize: 14 }} />}
                       />
                     ))}
                   </Box>
                 </Box>
               )}
             </Box>
           </Box>

          {/* Input Area */}
          <Box sx={{ 
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
          }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                placeholder="Ask me about numerical methods..."
                value={inputMessage}
                 onChange={(e) => setInputMessage(e.target.value)}
                 onKeyDown={handleKeyPress}
                 disabled={isTyping}
                 inputRef={inputRef}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: '#f8f9fa',
                    '&:hover': {
                      bgcolor: 'white'
                    },
                    '&.Mui-focused': {
                      bgcolor: 'white',
                      boxShadow: '0 0 0 2px rgba(21, 101, 192, 0.2)'
                    }
                                    }
                }}
                className="animated-field"
                />
              <IconButton
                color="primary"
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                sx={{ 
                  p: 1.5,
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: 2,
                  '&:hover': { 
                    bgcolor: 'primary.dark',
                    transform: 'scale(1.05)'
                  },
                  '&:disabled': { 
                    bgcolor: 'grey.300'
                  },
                  transition: 'all 0.2s ease'
                }}
                className="pulse-button"
              >
                {isTyping ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SendIcon className="icon-hover-float" />
                )}
              </IconButton>
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ 
              mt: 1, 
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              justifyContent: 'center'
            }}>
               <LightbulbIcon className="icon-subtle-glow" sx={{ fontSize: 12 }} />
               Alex gives quick, helpful tips about numerical methods!
             </Typography>
          </Box>
        </DialogContent>
      </Dialog>

    </>
  );
};

export default StudyBuddyChat; 