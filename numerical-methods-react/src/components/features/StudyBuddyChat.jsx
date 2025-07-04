import React, { useState, useEffect, useRef } from 'react';
import '../../assets/animations.css';
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
  Badge,
  DialogActions
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
  VpnKey as VpnKeyIcon,
  PictureAsPdf as PictureAsPdfIcon,
  TextSnippet as TextSnippetIcon
} from '@mui/icons-material';

import { initializeGemini, isGeminiInitialized, getChatResponse } from '../../services/geminiService';
import { DEFAULT_API_KEY, DEBUG_MODE } from '../../config/config';

// Study buddy persona prompt - Peer Learning Approach
const STUDY_BUDDY_PROMPT = `You are Alex, a friendly classmate studying numerical methods for solving non-linear equations. You're knowledgeable but approach learning as a peer, not a teacher. You believe in helping friends discover answers through hints and guided discussion.

Your peer learning philosophy:
1. **Hint-Based Helper**: You know the answers but won't give them directly. Instead, you drop hints like "Have you thought about what happens when the function changes sign?" or "Remember what we learned about convergence rates?"

2. **Friendly Discusser**: When someone struggles, you engage in friendly discussion like "Hmm, I was stuck on this too... what helped me was thinking about..." or "Wait, let's break this down together step by step."

3. **Encouraging Classmate**: You're supportive like a good friend: "You're on the right track!" or "That's a great start, but what about..." or "I made that same mistake before!"

4. **Patient Guide**: If they can't get the satisfactory answer after hints, you gradually become more helpful through friendly conversation, never lecturing but discussing like equals.

Chat Guidelines:
- Keep responses SHORT (2-3 sentences max)
- Use hints first, direct help only if really needed
- Ask guiding questions: "What do you think happens when...?" 
- Share relatable struggles: "I remember being confused about this too..."
- Use casual, friendly language like talking to a classmate
- Celebrate small wins: "Yes! That's exactly it!" or "Now you're getting it!"

Remember: You're a helpful classmate who guides through hints and friendly discussion, not a teacher who lectures!`;

const StudyBuddyChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'alex',
      content: "Hey! I'm Alex, also studying numerical methods. Want to figure out some root-finding problems together? I love tackling these! 🤓",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [file, setFile] = useState(null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [initializationError, setInitializationError] = useState(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize Gemini on component mount
  useEffect(() => {
    const initializeChat = async () => {
      // Always try to use the environment variable first
      const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const storedKey = localStorage.getItem('gemini_api_key');
      const currentKey = envApiKey || storedKey || DEFAULT_API_KEY;
      
      if (!isGeminiInitialized()) {
        try {
          const success = await initializeGemini(currentKey);
          if (success) {
            setInitializationError(null);
            
            // Only save to localStorage if using env key and no stored key exists
            if (envApiKey && !storedKey) {
              localStorage.setItem('gemini_api_key', envApiKey);
            }
          } else {
            throw new Error('Failed to initialize with API key');
          }
        } catch (error) {
          console.error('Failed to initialize Gemini:', error);
          setInitializationError({
            type: 'error',
            message: 'Failed to initialize chat',
            details: error.message
          });
          setShowApiKeyDialog(true);
        }
      }
    };

    initializeChat();
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending messages
  const sendMessage = async () => {
    if (!inputMessage.trim() && !file) return;

    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: inputMessage,
      file: file, // Add the file to the message
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and file immediately
    const currentMessage = inputMessage;
    const currentFile = file;
    setInputMessage('');
    setFile(null);
    setIsTyping(true);

    try {
      // Prepare context from previous messages
      const context = messages
        .slice(-4) // Get last 4 messages for context
        .map(msg => `${msg.sender === 'alex' ? 'Assistant' : 'User'}: ${msg.content}`)
        .join('\n');

      // Combine study buddy prompt with context and current message
      let fullPrompt = `${STUDY_BUDDY_PROMPT}\n\nPrevious conversation:\n${context}\n\nUser: ${currentMessage}`;
      
      // Add file context if file exists
      if (currentFile) {
        fullPrompt += `\n\n[User has attached a file: ${currentFile.name} (${currentFile.type})]`;
      }

      // Get response from Gemini
      const response = await getChatResponse(fullPrompt, currentFile);
      
      if (response && response.error) {
        if (response.error === 'UNSUPPORTED_FILE_TYPE') {
          throw new Error(response.message || 'Unsupported file type');
        } else if (response.error === 'QUOTA_EXCEEDED') {
          throw new Error('API quota exceeded. Please try again later.');
        } else if (response.error === 'API_KEY_ERROR') {
          throw new Error('API key error. Please check your configuration.');
        } else {
          throw new Error(response.error);
        }
      }

      if (!response || typeof response !== 'string') {
        throw new Error('Invalid response received from AI service');
      }

      // Add assistant's response to chat
      const assistantMessage = {
        id: messages.length + 2,
        sender: 'alex',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error getting chat response:', error);
      
      let errorContent = "I'm having trouble connecting right now. Let me try again in a moment! 🔄";
      
      // Handle specific error cases
      if (error.message.includes('API key') || error.message.includes('not initialized')) {
        setShowApiKeyDialog(true);
        return; // Don't show error message, show API key dialog instead
      } else if (error.message.includes('Unsupported file type')) {
        errorContent = `Sorry, I can't process that file type. Please upload an image, PDF, or text file. 📄`;
      } else if (error.message.includes('quota exceeded')) {
        errorContent = `I've reached my API limit for now. Please try again in a few minutes! ⏰`;
      } else if (error.message.includes('API key error')) {
        errorContent = `There's an issue with the API configuration. Please check your settings. 🔧`;
        setShowApiKeyDialog(true);
        return;
      } else if (currentFile) {
        // If there was a file involved, provide file-specific guidance
        errorContent = `I had trouble processing your file "${currentFile.name}". Try uploading a different file or just send a message without attachments. 📎`;
      } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_NAME_NOT_RESOLVED')) {
        errorContent = `I can't reach the servers right now. This might be a network issue. Try checking your internet connection or run 'testNetworkConnectivity()' in the console for diagnostics. 🌐`;
      } else {
        // Show more specific error information in development
        const isDev = import.meta.env.DEV;
        if (isDev) {
          errorContent = `Debug info: ${error.message}. Check the console for more details. 🔧`;
        }
      }
      
      // Add error message to chat
      const errorMessage = {
        id: messages.length + 2,
        sender: 'alex',
        content: errorContent,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle API key submission
  const handleApiKeySubmit = async () => {
    if (!apiKeyInput.trim()) return;
    
    try {
      const success = await initializeGemini(apiKeyInput.trim());
      if (success) {
        localStorage.setItem('gemini_api_key', apiKeyInput.trim());
        setShowApiKeyDialog(false);
        setApiKeyInput('');
        setInitializationError(null);
        
        // Add success message to chat
        const successMessage = {
          id: messages.length + 1,
          sender: 'alex',
          content: "Great! I'm back online and ready to help! 😊",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
      } else {
        throw new Error('Failed to initialize with provided key');
      }
    } catch (error) {
      console.error('API key submission error:', error);
      setInitializationError({
        type: 'error',
        message: 'Invalid API key. Please check and try again.',
        details: error.message
      });
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const isImage = selectedFile.type.startsWith('image/');
      const isPdf = selectedFile.type === 'application/pdf';
      const isText = selectedFile.type === 'text/plain';
      
      if (isImage || isPdf || isText) {
        setFile(selectedFile);
      } else {
        alert('Please upload an image, PDF, or text file.');
      }
    }
  };

  const handleUploadClick = (accept) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
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
                  <Paper elevation={2} sx={{ 
                    mt: 1, 
                    p: 1.5, 
                    display: 'flex', 
                    alignItems: 'center', 
                    backgroundColor: isAlex ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    border: isAlex ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.2)'
                  }}>
                    {message.file.type.startsWith('image/') ? (
                      <ImageIcon sx={{ mr: 1, fontSize: '1.2rem', color: isAlex ? 'primary.main' : 'inherit' }} />
                    ) : message.file.type === 'application/pdf' ? (
                      <PictureAsPdfIcon sx={{ mr: 1, fontSize: '1.2rem', color: isAlex ? 'error.main' : 'inherit' }} />
                    ) : (
                      <TextSnippetIcon sx={{ mr: 1, fontSize: '1.2rem', color: isAlex ? 'success.main' : 'inherit' }} />
                    )}
                    <Box>
                      <Typography variant="caption" sx={{ 
                        fontWeight: 500,
                        color: isAlex ? 'text.primary' : 'inherit'
                      }}>
                        {message.file.name}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        display: 'block',
                        opacity: 0.7,
                        fontSize: '0.7rem'
                      }}>
                        {message.file.type.startsWith('image/') ? 'Image' : 
                         message.file.type === 'application/pdf' ? 'PDF Document' : 'Text File'}
                      </Typography>
                    </Box>
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
          <Tooltip title={initializationError.message}>
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
            {/* File Preview */}
            {file && (
              <Paper
                sx={{
                  p: 1,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  borderRadius: 1
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {file.type.startsWith('image/') ? (
                    <ImageIcon color="primary" fontSize="small" />
                  ) : file.type === 'application/pdf' ? (
                    <PictureAsPdfIcon color="primary" fontSize="small" />
                  ) : (
                    <TextSnippetIcon color="primary" fontSize="small" />
                  )}
                  <Typography variant="body2" sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.name}
                  </Typography>
                </Box>
                <IconButton 
                  size="small" 
                  onClick={() => setFile(null)}
                  sx={{ 
                    '&:hover': { 
                      color: 'error.main',
                      backgroundColor: 'error.light' 
                    }
                  }}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Paper>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                inputRef={inputRef}
                fullWidth
                variant="outlined"
                placeholder={file ? "Add a message with your file..." : "Let's solve this together..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={4}
                sx={{ mr: 1 }}
              />
              <Tooltip title="Attach Image">
                <IconButton 
                  onClick={() => handleUploadClick('image/*')} 
                  color="primary"
                  disabled={!!file}
                >
                  <ImageIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Attach Document">
                <IconButton 
                  onClick={() => handleUploadClick('.pdf,.txt')} 
                  color="primary"
                  disabled={!!file}
                >
                  <AttachFileIcon />
                </IconButton>
              </Tooltip>
              <IconButton 
                onClick={sendMessage} 
                color="primary" 
                disabled={isTyping || (!inputMessage.trim() && !file)}
              >
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
            The Gemini API key is missing or invalid. Please enter your key to continue.
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
            error={!!initializationError}
            helperText={initializationError?.details}
          />
          {initializationError && (
            <Alert severity={initializationError.type} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {initializationError.message}
              </Typography>
              <Typography variant="body2">
                {initializationError.details}
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowApiKeyDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleApiKeySubmit} 
            variant="contained"
            disabled={!apiKeyInput.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StudyBuddyChat; 