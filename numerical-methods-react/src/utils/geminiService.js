import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { GEMINI_API_KEY, GEMINI_MODELS, DEBUG_MODE } from '../config.js';

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Debug logging for API key
console.log('Environment variables loaded:', {
  hasApiKey: !!API_KEY,
  keyLength: API_KEY ? API_KEY.length : 0
});

let genAI = null;
let primaryModel = null;
let fallbackModel = null;
let validationModel = null;

// Helper function to convert a File object to a GoogleGenerativeAI.Part object
async function fileToGenerativePart(file) {
  // Check if file is an image
  if (file.type.startsWith('image/')) {
    return {
      inlineData: {
        data: await fileToBase64(file),
        mimeType: file.type
      }
    };
  }
  
  // For PDFs and other text documents, extract text content
  if (file.type === 'application/pdf' || file.type.includes('text')) {
    const text = await extractTextFromFile(file);
    return text;
  }

  throw new Error(`Unsupported file type: ${file.type}`);
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

// Extract text from file
async function extractTextFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => reject(error);
    
    if (file.type === 'application/pdf') {
      // For PDFs, we'll just get the raw text for now
      reader.readAsText(file);
    } else {
      // For text files
      reader.readAsText(file);
    }
  });
}

export const initializeGemini = (apiKey = GEMINI_API_KEY) => {
  if (DEBUG_MODE) {
    console.log('Initializing Gemini with key:', {
      hasKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0,
      usingDefault: apiKey === GEMINI_API_KEY
    });
  }

  if (!apiKey) {
    console.warn('Gemini API key is missing. Please provide it in .env as VITE_GEMINI_API_KEY.');
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
try {
  const initialized = initializeGemini();
  if (DEBUG_MODE) {
    console.log('Auto-initialization result:', initialized);
  }
} catch (error) {
  console.warn('Failed to auto-initialize Gemini with default API key:', error);
}

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

export const getChatResponse = async (prompt, file) => {
  if (DEBUG_MODE) {
    console.log('Getting chat response:', {
      hasPrompt: !!prompt,
      promptLength: prompt?.length,
      hasFile: !!file,
      fileType: file?.type,
      isInitialized: isGeminiInitialized(),
      primaryModelName: GEMINI_MODELS.PRIMARY
    });
  }

  if (!isGeminiInitialized()) {
    throw new Error('Gemini is not initialized. Please check your API key.');
  }
  
  try {
    let parts = [];

    // Add the system prompt first
    if (file) {
      // If there's a file, modify the prompt to handle it appropriately
      const fileType = file.type;
      if (fileType.startsWith('image/')) {
        parts.push("I'm looking at an image. Let me analyze it and answer your question about it: " + prompt);
      } else if (fileType === 'application/pdf') {
        parts.push("I'm reading a PDF document. Let me analyze its content and answer your question: " + prompt);
      } else if (fileType.includes('text')) {
        parts.push("I'm reading a text file. Let me analyze its content and answer your question: " + prompt);
      }
    } else {
      parts.push(prompt);
    }

    // Add the file content if present
    if (file) {
      try {
        const filePart = await fileToGenerativePart(file);
        parts.push(filePart);
      } catch (error) {
        console.error('Error processing file:', error);
        throw new Error(`Unable to process ${file.type} file: ${error.message}`);
      }
    }

    try {
      // Try with primary model first
      if (DEBUG_MODE) console.log("Attempting with primary model:", GEMINI_MODELS.PRIMARY);
      const primaryChat = primaryModel.startChat({
        history: [],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });
      const primaryResult = await primaryChat.sendMessage(parts);
      return primaryResult.response.text();
    } catch (primaryError) {
      // If primary model fails, try fallback model
      if (DEBUG_MODE) {
        console.warn("Primary model failed, attempting fallback:", primaryError);
        console.log("Switching to fallback model:", GEMINI_MODELS.FALLBACK);
      }

      const fallbackChat = fallbackModel.startChat({
        history: [],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });
      const fallbackResult = await fallbackChat.sendMessage(parts);
      return fallbackResult.response.text();
    }
  } catch (error) {
    console.error('Error getting chat response from both models:', error);
    
    if (error.toString().includes('API key not valid')) {
      throw new Error("Your API key is not valid. Please check it or enter a new one.");
    }
    if (error.toString().includes('quota')) {
      throw new Error("You've exceeded your API quota. Please try again in a few minutes.");
    }
    if (error.toString().includes('Unable to process')) {
      throw error; // Rethrow file processing errors
    }
    
    throw new Error("The Study Buddy is having trouble connecting. Both models failed to respond.");
  }
};

export const validateSolutionWithGemini = async (equation, userSolution, expectedSolution) => {
  if (!genAI || !validationModel) {
    throw new Error('Gemini not initialized. Please provide an API key.');
  }

  try {
    const prompt = `You are Dr. Sarah Chen, a renowned professor of Numerical Analysis with 15+ years of experience teaching computational mathematics. You are reviewing a student's solution to a numerical methods problem with patience, expertise, and encouragement.

IMPORTANT FORMATTING RULES:
- DO NOT use any markdown formatting (no asterisks, underscores, backticks, etc.)
- DO NOT try to bold, italicize, or format text in any way
- Just use plain text
- Use parentheses () for emphasis instead of formatting

PROBLEM CONTEXT:
Equation to solve: ${equation}
Expected/Reference Answer: ${expectedSolution}

STUDENT'S SUBMITTED SOLUTION:
${userSolution}

EVALUATION CRITERIA:
1. Numerical Accuracy (30 points): Are the final numerical values correct within ±0.001 tolerance?
2. Method Selection & Application (25 points): Did they choose and correctly apply a numerical method?
3. Mathematical Reasoning (20 points): Are the steps logically sound and well-explained?
4. Presentation & Communication (15 points): Is the solution clearly written and organized?
5. Understanding Demonstration (10 points): Do they show understanding of convergence, iterations, etc.?

RESPONSE FORMAT - JSON ONLY:
{
  "isCorrect": boolean,
  "score": number (0-100),
  "feedback": "Warm, encouraging, detailed feedback",
  "methodUsed": "Name of numerical method identified",
  "suggestions": ["Improvement suggestions"],
  "strengths": ["What they did well"],
  "nextSteps": "What to practice next"
}`;

    const result = await validationModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      let cleanText = text.trim()
        .replace(/```json\s*/g, '')
        .replace(/```\s*$/g, '')
        .replace(/```\s*/g, '');
      
      const startIndex = cleanText.indexOf('{');
      const lastIndex = cleanText.lastIndexOf('}');
      
      if (startIndex !== -1 && lastIndex !== -1 && lastIndex > startIndex) {
        cleanText = cleanText.substring(startIndex, lastIndex + 1);
      }
      
      const evaluation = JSON.parse(cleanText);
      
      if (typeof evaluation.isCorrect === 'undefined' || typeof evaluation.score === 'undefined') {
        throw new Error('Missing required fields in AI response');
      }
      
      return evaluation;
    } catch (error) {
      console.error('JSON parsing error:', error);
      if (DEBUG_MODE) {
        console.log('Raw AI response:', text);
      }
      
      const fallbackResult = basicValidation(equation, userSolution);
      fallbackResult.error = "JSON_PARSE_ERROR";
      fallbackResult.feedback = "🔧 AI response formatting issue. Using basic analysis: " + fallbackResult.feedback;
      fallbackResult.rawResponse = text.substring(0, 200) + (text.length > 200 ? '...' : '');
      return fallbackResult;
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    if (error.toString().includes('429') || error.toString().includes('quota')) {
      return {
        isCorrect: false,
        score: 0,
        feedback: "⏰ API rate limit reached. Please wait a few minutes and try again.",
        error: "QUOTA_EXCEEDED",
        suggestions: [
          "Wait a few minutes before trying again",
          "The system will work normally after the rate limit resets"
        ],
        nextSteps: "Try submitting your solution again in a few minutes."
      };
    }
    
    if (error.toString().includes('API key')) {
      return {
        isCorrect: false,
        score: 0,
        feedback: "🔑 API key issue detected. Please check the API key configuration.",
        error: "API_KEY_ERROR",
        suggestions: [
          "Check if the API key is valid",
          "Try refreshing the page",
          "Contact support if the issue persists"
        ]
      };
    }
    
    const fallbackResult = basicValidation(equation, userSolution);
    fallbackResult.error = "AI_UNAVAILABLE";
    fallbackResult.feedback = "🤖 AI validation is temporarily unavailable. Using basic analysis: " + fallbackResult.feedback;
    return fallbackResult;
  }
};

export const isGeminiInitialized = () => {
  return genAI !== null && primaryModel !== null && fallbackModel !== null && validationModel !== null;
}; 