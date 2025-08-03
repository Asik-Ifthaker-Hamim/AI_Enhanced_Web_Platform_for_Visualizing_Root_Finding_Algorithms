// Gemini AI service integration for mathematical problem solving and chat functionality
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { DEFAULT_API_KEY, GEMINI_MODELS, DEBUG_MODE } from '../config/config.js';

let genAI = null;
let primaryModel = null;
let fallbackModel = null;
let validationModel = null;

// Converts file objects to Gemini AI format for multimodal processing
async function fileToGenerativePart(file) {
  const mimeType = file.type;
  
  // Handle different file types
  if (mimeType.startsWith('image/')) {
    // Handle images
    try {
      const base64Data = await fileToBase64(file);
      return {
        inlineData: {
          data: base64Data,
          mimeType
        }
      };
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to process image file.');
    }
  } else if (mimeType === 'application/pdf' || mimeType === 'text/plain') {
    // Handle PDF and text files
    try {
      const textContent = await fileToText(file);
      return textContent;
    } catch (error) {
      console.error('Error converting file to text:', error);
      throw error; // Re-throw to preserve the specific error message
    }
  } else {
    throw new Error('Unsupported file type. Please upload an image, PDF, or text file.');
  }
}

// Convert file to base64
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// Convert file to text using the new @opendocsg/pdf2md library
async function fileToText(file) {
  if (file.type === 'application/pdf') {
    // Handle PDF files with @opendocsg/pdf2md
    try {
      // Dynamically import the pdf2md library
      const { default: pdf2md } = await import('@opendocsg/pdf2md');
      
      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Convert PDF to markdown using pdf2md
      const markdown = await pdf2md(arrayBuffer);
      
      // Convert markdown to plain text (remove markdown formatting)
      const plainText = markdown
        .replace(/#{1,6}\s+/g, '') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/`(.*?)`/g, '$1') // Remove inline code
        .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
        .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
        .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
        .trim();
      
      if (plainText.length === 0) {
        return 'PDF file uploaded but no readable text could be extracted. This might be an image-based PDF or contain no text content.';
      } else if (plainText.length > 50000) {
        // Truncate very long text to avoid API limits
        return plainText.substring(0, 50000) + '\n\n[Text truncated due to length...]';
      } else {
        return plainText;
      }
      
    } catch (error) {
      console.error('Error parsing PDF with pdf2md:', error);
      // Instead of rejecting, return a fallback message
      return 'PDF file uploaded but could not be processed. Please ensure it contains readable text and is not encrypted.';
    }
  } else {
    // Handle text files
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          let content = reader.result;
          if (content.length > 50000) {
            content = content.substring(0, 50000) + '\n\n[Text truncated due to length...]';
          }
          resolve(content);
        } catch (error) {
          console.error('Error processing text file:', error);
          resolve('Text file uploaded but could not be processed.');
        }
      };
      reader.onerror = (error) => {
        console.error('FileReader error for text file:', error);
        resolve('Text file uploaded but could not be read.');
      };
      reader.readAsText(file);
    });
  }
}

// Initializes Gemini AI service with API key and sets up models
export const initializeGemini = async (apiKey = DEFAULT_API_KEY) => {
  if (!apiKey) {
    console.warn('Gemini API key is missing. Please provide it in .env as VITE_GEMINI_API_KEY or via the UI.');
    return false;
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey);
    
    // Initialize models using config
    primaryModel = genAI.getGenerativeModel({ 
      model: GEMINI_MODELS.PRIMARY,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    fallbackModel = genAI.getGenerativeModel({ 
      model: GEMINI_MODELS.FALLBACK,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    validationModel = genAI.getGenerativeModel({ 
      model: GEMINI_MODELS.VALIDATION,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });
    
    if (DEBUG_MODE) {
      console.log("✅ Gemini initialized successfully with models:", {
        primaryModel: !!primaryModel,
        fallbackModel: !!fallbackModel,
        validationModel: !!validationModel,
        primaryModelName: GEMINI_MODELS.PRIMARY,
        fallbackModelName: GEMINI_MODELS.FALLBACK,
        validationModelName: GEMINI_MODELS.VALIDATION
      });
    }
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize Gemini:", error);
    genAI = null;
    primaryModel = null;
    fallbackModel = null;
    validationModel = null;
    return false;
  }
};

// Auto-initialize with default API key
(async () => {
  try {
    await initializeGemini();
  } catch (error) {
    console.warn('Failed to auto-initialize Gemini with default API key:', error);
  }
})();

// Basic fallback validation when AI fails
const basicValidation = (equation, userSolution) => {
  const solution = userSolution.toLowerCase();
  const hasMethodology = /newton|bisection|secant|false.position|fixed.point|muller/i.test(solution);
  const hasNumbers = /\d+/.test(solution);
  const hasSteps = /step|iteration|x[0-9]|f\(|converge/i.test(solution);
  
  // Extract potential answers
  const numberMatches = solution.match(/[-+]?\d*\.?\d+/g) || [];
  const numbers = numberMatches.map(n => parseFloat(n)).filter(n => !isNaN(n) && Math.abs(n) < 1000);
  
  const score = (hasMethodology ? 30 : 0) + (hasNumbers ? 20 : 0) + (hasSteps ? 25 : 0) + (numbers.length > 0 ? 25 : 0);
  
  return {
    isCorrect: score >= 70,
    score: Math.min(score, 85), // Cap at 85 for basic validation
    feedback: score >= 70 ? 
      "Good work! Your solution shows understanding of numerical methods. The AI validator is temporarily unavailable, but your approach looks solid." :
      "Your solution could benefit from more detail about the numerical method used and step-by-step calculations.",
    methodUsed: hasMethodology ? "Numerical method detected" : "Method not clearly specified",
    suggestions: [
      hasMethodology ? "Good method identification" : "Specify which numerical method you used",
      hasSteps ? "Nice step-by-step approach" : "Show more calculation steps",
      "Include convergence criteria and final answer clearly"
    ],
    strengths: [
      ...(hasMethodology ? ["Shows knowledge of numerical methods"] : []),
      ...(hasSteps ? ["Structured approach"] : []),
      ...(hasNumbers ? ["Includes numerical values"] : [])
    ],
    nextSteps: "Practice showing more detailed iteration steps and convergence analysis.",
    fallbackUsed: true
  };
};

// Gets complete chat response from Gemini AI (supports text and file inputs)
export const getChatResponse = async (prompt, file = null) => {
  if (!isGeminiInitialized()) {
    throw new Error('Gemini is not initialized. Please check your API key.');
  }

  try {
    let response;
    
    // Try primary model first
    try {
      if (file) {
        const content = await fileToGenerativePart(file);
        
        if (typeof content === 'string') {
          // For text content (PDF/TXT files)
          response = await primaryModel.generateContent(`${prompt}\n\nContent from uploaded file:\n${content}`);
        } else {
          // For images
          response = await primaryModel.generateContent([prompt, content]);
        }
      } else {
        response = await primaryModel.generateContent(prompt);
      }
    } catch (primaryError) {
      console.warn('Primary model failed, trying fallback:', primaryError.message);
      
      // Try fallback model
      if (file) {
        const content = await fileToGenerativePart(file);
        if (typeof content === 'string') {
          // For text content (PDF/TXT files)
          response = await fallbackModel.generateContent(`${prompt}\n\nContent from uploaded file:\n${content}`);
        } else {
          // For images
          response = await fallbackModel.generateContent([prompt, content]);
        }
      } else {
        response = await fallbackModel.generateContent(prompt);
      }
    }

    const result = await response.response;
    const resultText = result.text();
    
    return resultText;
  } catch (error) {
    console.error('Both models failed:', error);
    if (error.message.includes('quota')) {
      return { error: 'QUOTA_EXCEEDED' };
    }
    if (error.message.includes('API key')) {
      return { error: 'API_KEY_ERROR' };
    }
    if (error.message.includes('Unsupported file type') || error.message.includes('Failed to parse')) {
      return { error: 'UNSUPPORTED_FILE_TYPE', message: error.message };
    }
    throw error;
  }
};

// Streaming version of getChatResponse
// Gets streaming chat response from Gemini AI with real-time chunks
export const getChatResponseStream = async (prompt, file = null, onChunk = null) => {
  if (!isGeminiInitialized()) {
    throw new Error('Gemini is not initialized. Please check your API key.');
  }

  try {
    let response;
    
    // Try primary model first
    try {
      if (file) {
        const content = await fileToGenerativePart(file);
        
        if (typeof content === 'string') {
          // For text content (PDF/TXT files)
          response = await primaryModel.generateContentStream(`${prompt}\n\nContent from uploaded file:\n${content}`);
        } else {
          // For images
          response = await primaryModel.generateContentStream([prompt, content]);
        }
      } else {
        response = await primaryModel.generateContentStream(prompt);
      }
    } catch (primaryError) {
      console.warn('Primary model failed, trying fallback:', primaryError.message);
      
      // Try fallback model
      if (file) {
        const content = await fileToGenerativePart(file);
        if (typeof content === 'string') {
          // For text content (PDF/TXT files)
          response = await fallbackModel.generateContentStream(`${prompt}\n\nContent from uploaded file:\n${content}`);
        } else {
          // For images
          response = await fallbackModel.generateContentStream([prompt, content]);
        }
      } else {
        response = await fallbackModel.generateContentStream(prompt);
      }
    }

    let fullText = '';
    
    for await (const chunk of response.stream) {
      const chunkText = chunk.text();
      
      // Stream character by character with a natural delay
      for (let i = 0; i < chunkText.length; i++) {
        const char = chunkText[i];
        fullText += char;
        
        // Call the onChunk callback with the new character and full text so far
        if (onChunk) {
          onChunk(char, fullText);
        }
        
        // Add a small delay for natural typing effect (20-50ms per character)
        await new Promise(resolve => setTimeout(resolve, Math.random() * 30 + 20));
      }
    }
    
    return fullText;
  } catch (error) {
    console.error('Both models failed:', error);
    if (error.message.includes('quota')) {
      return { error: 'QUOTA_EXCEEDED' };
    }
    if (error.message.includes('API key')) {
      return { error: 'API_KEY_ERROR' };
    }
    if (error.message.includes('Unsupported file type') || error.message.includes('Failed to parse')) {
      return { error: 'UNSUPPORTED_FILE_TYPE', message: error.message };
    }
    throw error;
  }
};

// Validates mathematical solutions using Gemini AI for accuracy checking
export const validateSolutionWithGemini = async (equation, userSolution, expectedSolution) => {
  if (!isGeminiInitialized()) {
    throw new Error('Gemini is not initialized. Please check your API key.');
  }

  try {
    const prompt = `You are Dr. Sarah Chen, a renowned professor of Numerical Analysis with 15+ years of experience teaching computational mathematics. You are reviewing a student's solution to a numerical methods problem with patience, expertise, and encouragement.

PROBLEM CONTEXT:
Equation to solve: ${equation}
Expected solution: ${expectedSolution}
Student's solution: ${userSolution}

TASK:
1. Evaluate if the student's solution is correct
2. Provide a score out of 100
3. Give constructive feedback
4. Suggest improvements if needed

FORMAT YOUR RESPONSE AS A JSON OBJECT:
{
  "isCorrect": boolean,
  "score": number,
  "message": "Main feedback message",
  "details": "Detailed explanation",
  "suggestions": ["array", "of", "suggestions"],
  "strengths": ["array", "of", "strengths"]
}`;

    const response = await validationModel.generateContent(prompt);
    const result = await response.response;
    return JSON.parse(result.text());
  } catch (error) {
    console.warn('AI validation failed, using basic validation:', error);
    // Use basic validation as fallback
    return basicValidation(equation, userSolution);
  }
};

// Checks if Gemini AI service is properly initialized
export const isGeminiInitialized = () => {
  return !!genAI && !!primaryModel && !!fallbackModel && !!validationModel;
};

// Test network connectivity to Google's servers
// Tests network connectivity to Gemini AI services
export const testNetworkConnectivity = async () => {
  console.log('🌐 Testing network connectivity...');
  
  // Test basic internet connectivity
  try {
    await fetch('https://www.google.com', { 
      method: 'HEAD',
      mode: 'no-cors'
    });
    console.log('✅ Basic internet connectivity: OK');
  } catch (error) {
    console.error('❌ Basic internet connectivity: FAILED', error);
    return false;
  }
  
  // Test DNS resolution for Google's AI API
  try {
    await fetch('https://generativelanguage.googleapis.com', {
      method: 'HEAD',
      mode: 'no-cors'
    });
    console.log('✅ DNS resolution for Google AI API: OK');
    return true;
  } catch (error) {
    console.error('❌ DNS resolution for Google AI API: FAILED', error);
    console.log('🔧 Possible solutions:');
    console.log('1. Check your internet connection');
    console.log('2. Try a different DNS server (8.8.8.8, 1.1.1.1)');
    console.log('3. Disable VPN/proxy if using one');
    console.log('4. Check firewall settings');
    console.log('5. Try from a different network');
    return false;
  }
};

// Debug function to test API key and connection
// Debug utility to test Gemini AI service functionality
export const debugGemini = async (testApiKey = null) => {
  console.log('🔧 Gemini Debug Information:');
  console.log('Environment:', {
    storedKey: localStorage.getItem('gemini_api_key'),
    defaultKey: DEFAULT_API_KEY,
    isInitialized: isGeminiInitialized()
  });
  
  // Test network connectivity first
  const networkOk = await testNetworkConnectivity();
  if (!networkOk) {
    console.log('❌ Network connectivity issues detected. Please fix network issues before testing API key.');
    return;
  }
  
  if (testApiKey) {
    console.log('🧪 Testing provided API key...');
    try {
      const success = await initializeGemini(testApiKey);
      console.log('Test result:', success);
      if (success) {
        const testResponse = await getChatResponse("Hello, just testing!");
        console.log('Test response:', testResponse);
      }
    } catch (error) {
      console.error('Test failed:', error);
    }
  }
};

// Make debug functions available globally for console testing
if (typeof window !== 'undefined') {
  window.debugGemini = debugGemini;
  window.testNetworkConnectivity = testNetworkConnectivity;
} 