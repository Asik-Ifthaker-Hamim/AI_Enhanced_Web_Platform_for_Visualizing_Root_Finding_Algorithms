import React, { useState, useEffect, useRef } from 'react';
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
  Tooltip,
  Button,
  Badge
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  EmojiEmotions as EmojiIcon,
  School as SchoolIcon,
  Calculate as CalculateIcon,
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
  QuestionMark as QuestionMarkIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  Cancel as CancelIcon,
  VpnKey as VpnKeyIcon
} from '@mui/icons-material';

import { initializeGemini, isGeminiInitialized, getChatResponse } from '../utils/geminiService';
import { GEMINI_API_KEY, DEBUG_MODE } from '../config';

// Study buddy persona prompt
const STUDY_BUDDY_PROMPT = `You are Alex, a CS student who is ALSO learning numerical methods alongside the user. You're study partners, not teacher-student. Keep responses SHORT (2-3 sentences max).

IMPORTANT FORMATTING RULES:
- DO NOT use any markdown formatting (no asterisks, underscores, backticks, etc.)
- DO NOT try to bold, italicize, or format text in any way
- Just use plain text with emojis
- Use parentheses () for emphasis instead of bold or italics

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
  const [file, setFile] = useState(null);
  const [geminiInitialized, setGeminiInitialized] = useState(() => {
    const initialized = isGeminiInitialized();
    if (DEBUG_MODE) {
      console.log('Initial Gemini state:', initialized);
    }
    return initialized;
  });
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [initializationError, setInitializationError] = useState(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize Gemini on component mount
  useEffect(() => {
    if (!geminiInitialized) {
      if (DEBUG_MODE) {
        console.log('Attempting to initialize Gemini...');
      }
      const initialized = initializeGemini();
      if (DEBUG_MODE) {
        console.log('Initialization attempt result:', initialized);
      }
      setGeminiInitialized(initialized);
      if (!initialized) {
        setInitializationError('Failed to initialize with environment API key');
        if (DEBUG_MODE) {
          console.warn('Failed to initialize with environment API key');
        }
      }
    }
  }, [geminiInitialized]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

  const handleApiKeySubmit = () => {
    if (DEBUG_MODE) {
      console.log('Attempting to initialize with user-provided key...');
    }
    const initialized = initializeGemini(apiKeyInput);
    if (DEBUG_MODE) {
      console.log('User key initialization result:', initialized);
    }
    setGeminiInitialized(initialized);
    if (initialized) {
      setShowApiKeyDialog(false);
      setApiKeyInput('');
      setInitializationError(null);
    } else {
      setInitializationError('Failed to initialize with provided API key');
      console.error("User-provided API key failed to initialize");
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() && !file) return;
    if (isTyping) return;

    if (!geminiInitialized) {
      setShowApiKeyDialog(true);
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      file: file ? { name: file.name, type: file.type, url: URL.createObjectURL(file) } : null,
    };

    setMessages(prev => [...prev, userMessage]);
    
    const messageToSend = inputMessage.trim();
    const fileToSend = file;

    setInputMessage('');
    setFile(null); // Clear file after sending
    setIsTyping(true);

    try {
      // Create conversation context from recent messages
      const recentMessages = messages.slice(-6); // Last 6 messages for context
      const conversationContext = recentMessages
        .map(msg => `${msg.sender === 'alex' ? 'Alex' : 'Student'}: ${msg.content}`)
        .join('\n');

      const fullPrompt = `${STUDY_BUDDY_PROMPT}

CONVERSATION HISTORY:
${conversationContext}
Student: ${messageToSend}

Alex:`;

      const responseText = await getChatResponse(fullPrompt, fileToSend);

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
        content: error.message || "Oops! An unknown error occurred. Please try again.",
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUploadClick = (accept) => {
    fileInputRef.current.setAttribute('accept', accept);
    fileInputRef.current.click();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
            {message.isError ? (
              <Alert severity="error" sx={{ borderRadius: '20px', Flipper: true }}>
                {message.content}
              </Alert>
            ) : (
              <>
                <Typography variant="body2" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Typography>
                {message.file && (
                  <Paper elevation={2} sx={{ mt: 1, p: 1, display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <ImageIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="caption">{message.file.name}</Typography>
                  </Paper>
                )}
              </>
            )}
          </Paper>
        </Box>
      </Box>
    );
  });

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          background: 'linear-gradient(45deg, #1565c0, #7b1fa2)',
          '&:hover': {
            background: 'linear-gradient(45deg, #0d47a1, #6a1b9a)',
            transform: 'scale(1.05) translateY(-2px)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 20px rgba(21, 101, 192, 0.3)'
        }}
        className="pulse-button"
      >
        {initializationError ? (
          <Tooltip title={initializationError}>
            <VpnKeyIcon />
          </Tooltip>
        ) : (
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
        )}
        {unreadCount > 0 && (
          <Badge badgeContent={unreadCount} color="error" />
        )}
      </Fab>

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

        {/* Chat Content */}
        <DialogContent 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            height: 'calc(85vh - 140px)' // Account for header and input area
          }}
        >
          {/* Messages Container */}
          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'scroll', // Changed from 'auto' to 'scroll'
            position: 'relative',
            zIndex: 1,
            height: '100%',
            pr: 2, // Add padding to prevent content shift
            mr: -2, // Offset padding to maintain alignment
            '&::-webkit-scrollbar': {
              width: '8px',
              display: 'block',
              background: 'transparent'
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.03)',
              borderRadius: '4px',
              margin: '4px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0,0,0,0.12)',
              borderRadius: '4px',
              border: '2px solid transparent',
              backgroundClip: 'padding-box',
              '&:hover': {
                background: 'rgba(0,0,0,0.2)',
                border: '2px solid transparent',
                backgroundClip: 'padding-box'
              }
            },
            // Add Firefox scrollbar styling
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0,0,0,0.12) rgba(0,0,0,0.03)'
          }}>
            {/* Background Mathematical Symbols */}
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 8, // Adjust to account for scrollbar
              bottom: 0, 
              pointerEvents: 'none', 
              zIndex: 0,
              opacity: 0.06
            }}>
              {[
                { symbol: '∫', top: '5%', left: '10%', size: '16px', animation: 'mathFloat1 15s ease-in-out infinite' },
                { symbol: 'λ', top: '25%', right: '15%', size: '18px', animation: 'mathFloat2 18s ease-in-out infinite 1s' },
                { symbol: 'θ', top: '45%', left: '20%', size: '14px', animation: 'mathFloat3 12s ease-in-out infinite 2s' },
                { symbol: 'β', top: '65%', right: '25%', size: '17px', animation: 'mathFloat4 20s ease-in-out infinite 3s' },
                { symbol: 'Ω', top: '85%', left: '30%', size: '19px', animation: 'mathFloat5 16s ease-in-out infinite 4s' },
                { symbol: 'μ', top: '15%', right: '35%', size: '15px', animation: 'mathFloat6 14s ease-in-out infinite 5s' },
                { symbol: 'α', top: '35%', left: '40%', size: '18px', animation: 'mathFloat7 17s ease-in-out infinite 6s' },
                { symbol: 'φ', top: '55%', right: '45%', size: '16px', animation: 'mathFloat8 19s ease-in-out infinite 7s' },
                { symbol: 'ε', top: '75%', left: '50%', size: '17px', animation: 'mathFloat9 13s ease-in-out infinite 8s' },
                { symbol: 'γ', top: '95%', right: '55%', size: '15px', animation: 'mathFloat10 21s ease-in-out infinite 9s' },
                { symbol: '∇', top: '10%', left: '60%', size: '16px', animation: 'mathFloat3 16s ease-in-out infinite 2.5s' },
                { symbol: 'σ', top: '30%', right: '65%', size: '14px', animation: 'mathFloat5 19s ease-in-out infinite 3.5s' },
                { symbol: 'ψ', top: '50%', left: '70%', size: '18px', animation: 'mathFloat7 14s ease-in-out infinite 4.5s' },
                { symbol: 'ξ', top: '70%', right: '75%', size: '15px', animation: 'mathFloat9 17s ease-in-out infinite 5.5s' },
                { symbol: '∂', top: '90%', left: '80%', size: '19px', animation: 'mathFloat1 20s ease-in-out infinite 6.5s' },
                { symbol: '∏', top: '20%', right: '85%', size: '16px', animation: 'mathFloat4 15s ease-in-out infinite 7.5s' },
                { symbol: '∑', top: '40%', left: '90%', size: '17px', animation: 'mathFloat6 18s ease-in-out infinite 8.5s' },
                { symbol: 'η', top: '60%', right: '5%', size: '14px', animation: 'mathFloat8 13s ease-in-out infinite 9.5s' },
                { symbol: 'ρ', top: '80%', left: '15%', size: '18px', animation: 'mathFloat10 16s ease-in-out infinite 10.5s' },
                { symbol: '∞', top: '8%', right: '20%', size: '16px', animation: 'mathFloat2 19s ease-in-out infinite 11.5s' },
                { symbol: '∈', top: '28%', left: '25%', size: '15px', animation: 'mathFloat4 17s ease-in-out infinite 12.5s' },
                { symbol: '∩', top: '48%', right: '30%', size: '17px', animation: 'mathFloat6 14s ease-in-out infinite 13.5s' },
                { symbol: '∪', top: '68%', left: '35%', size: '14px', animation: 'mathFloat8 20s ease-in-out infinite 14.5s' },
                { symbol: '∀', top: '88%', right: '40%', size: '19px', animation: 'mathFloat10 15s ease-in-out infinite 15.5s' },
                { symbol: '∃', top: '18%', left: '45%', size: '16px', animation: 'mathFloat1 18s ease-in-out infinite 16.5s' }
              ].map((item, index) => (
                <span
                  key={index}
                  style={{
                    position: 'absolute',
                    top: item.top,
                    left: item.left,
                    right: item.right,
                    fontSize: item.size,
                    animation: item.animation
                  }}
                >
                  {item.symbol}
                </span>
              ))}
            </Box>

            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            component="footer"
            sx={{
              p: 2,
              bgcolor: 'white',
              borderTop: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                inputRef={inputRef}
                fullWidth
                variant="outlined"
                placeholder="Let's solve this together..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={4}
                sx={{ mr: 1 }}
              />
              <Tooltip title="Attach Image">
                <IconButton onClick={() => handleUploadClick('image/*')} color="primary">
                  <ImageIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Attach File">
                <IconButton onClick={() => handleUploadClick('*/*')} color="primary">
                  <AttachFileIcon />
                </IconButton>
              </Tooltip>
              <IconButton onClick={sendMessage} color="primary" disabled={isTyping || (!inputMessage.trim() && !file)}>
                {isTyping ? <CircularProgress size={24} /> : <SendIcon />}
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
        />
      </Dialog>
      <Dialog open={showApiKeyDialog} onClose={() => setShowApiKeyDialog(false)}>
        <DialogTitle>Enter Gemini API Key</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            The Gemini API key is missing. Please enter your key to continue.
            You can get a key from Google AI Studio.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Gemini API Key"
            type="password"
            fullWidth
            variant="outlined"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleApiKeySubmit()}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowApiKeyDialog(false)}>Cancel</Button>
            <Button onClick={handleApiKeySubmit} variant="contained" sx={{ ml: 1 }}>Submit</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudyBuddyChat; 