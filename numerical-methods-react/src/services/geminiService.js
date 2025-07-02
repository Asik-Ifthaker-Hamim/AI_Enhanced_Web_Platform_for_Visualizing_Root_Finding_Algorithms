import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { DEFAULT_API_KEY, GEMINI_MODELS, DEBUG_MODE } from '../config/config.js';

// Remove pdfjs-dist import and worker setup since we're replacing it
// import * as pdfjsLib from 'pdfjs-dist';
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

let genAI = null;
let primaryModel = null;
let fallbackModel = null;
let validationModel = null;

// Helper function to convert a File object to a GoogleGenerativeAI.Part object
async function fileToGenerativePart(file) {
  const mimeType = file.type;
  
  if (DEBUG_MODE) {
    console.log('Converting file to generative part:', {
      name: file.name,
      type: mimeType,
      size: file.size
    });
  }
  
  // Handle different file types
  if (mimeType.startsWith('image/')) {
    // Handle images
    try {
      const base64Data = await fileToBase64(file);
      if (DEBUG_MODE) {
        console.log('Image converted to base64, length:', base64Data.length);
      }
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
      if (DEBUG_MODE) {
        console.log('File converted to text, length:', textContent.length);
      }
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
      if (DEBUG_MODE) {
        console.log('Processing PDF with @opendocsg/pdf2md, size:', file.size);
      }
      
      // Dynamically import the pdf2md library
      const { default: pdf2md } = await import('@opendocsg/pdf2md');
      
      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Convert PDF to markdown using pdf2md
      const markdown = await pdf2md(arrayBuffer);
      
      if (DEBUG_MODE) {
        console.log('PDF successfully converted to markdown, length:', markdown.length);
      }
      
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

export const initializeGemini = async (apiKey = DEFAULT_API_KEY) => {
  if (DEBUG_MODE) {
    console.log('Initializing Gemini with key:', {
      hasKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0,
      usingDefault: apiKey === DEFAULT_API_KEY
    });
  }

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

export const getChatResponse = async (prompt, file = null) => {
  if (!isGeminiInitialized()) {
    throw new Error('Gemini is not initialized. Please check your API key.');
  }

  const studyBuddyPrompt = `You are Alex, a fellow student studying numerical methods and computational mathematics. You approach learning as a peer collaborator, not a teacher.

Peer Learning Style:
1. Collaborative Thinking:
   - Think out loud with the user: "Hmm, I think..." or "Wait, what if..."
   - Share insights as discoveries: "Oh! I just realized..."
   - Learn together rather than explain

2. Peer Communication:
   - Use casual, friendly language
   - Keep responses SHORT (2-3 sentences max for chat)
   - Ask questions that spark thinking: "Have you tried...?" or "What do you think about...?"
   - Admit when things are tricky: "This one gets me too!"

3. Knowledge Sharing:
   - Know numerical methods well but share as a peer
   - Relate to common struggles: "I used to mess this up..."
   - Celebrate discoveries together: "Nice! That's exactly what I was thinking!"

4. Response Style:
   - Be conversational and brief
   - Think collaboratively, not instructionally
   - Ask follow-up questions to engage thinking
   - Share genuine reactions and insights

Current conversation: ${prompt}`;

  try {
    let response;
    
    if (DEBUG_MODE) {
      console.log('🔍 Processing chat request:', {
        hasFile: !!file,
        fileType: file ? file.type : 'none',
        fileName: file ? file.name : 'none',
        promptLength: prompt.length
      });
    }
    
    // Try primary model first
    try {
      if (file) {
        if (DEBUG_MODE) {
          console.log('📁 Processing file for primary model...');
        }
        
        const content = await fileToGenerativePart(file);
        
        if (DEBUG_MODE) {
          console.log('✅ File processed successfully, content type:', typeof content);
        }
        
        if (typeof content === 'string') {
          // For text content (PDF/TXT files)
          if (DEBUG_MODE) {
            console.log('📝 Sending text content to primary model, length:', content.length);
          }
          response = await primaryModel.generateContent(`${studyBuddyPrompt}\n\nContent from uploaded file:\n${content}`);
        } else {
          // For images
          if (DEBUG_MODE) {
            console.log('🖼️ Sending image content to primary model');
          }
          response = await primaryModel.generateContent([studyBuddyPrompt, content]);
        }
      } else {
        if (DEBUG_MODE) {
          console.log('💬 Sending text-only message to primary model');
        }
        response = await primaryModel.generateContent(studyBuddyPrompt);
      }
      
      if (DEBUG_MODE) {
        console.log('✅ Primary model responded successfully');
      }
    } catch (primaryError) {
      console.warn('⚠️ Primary model failed, trying fallback:', primaryError.message);
      
      // Try fallback model
      if (file) {
        if (DEBUG_MODE) {
          console.log('📁 Processing file for fallback model...');
        }
        const content = await fileToGenerativePart(file);
        if (typeof content === 'string') {
          // For text content (PDF/TXT files)
          if (DEBUG_MODE) {
            console.log('📝 Sending text content to fallback model, length:', content.length);
          }
          response = await fallbackModel.generateContent(`${studyBuddyPrompt}\n\nContent from uploaded file:\n${content}`);
        } else {
          // For images
          if (DEBUG_MODE) {
            console.log('🖼️ Sending image content to fallback model');
          }
          response = await fallbackModel.generateContent([studyBuddyPrompt, content]);
        }
      } else {
        response = await fallbackModel.generateContent(studyBuddyPrompt);
      }
      
      if (DEBUG_MODE) {
        console.log('✅ Fallback model responded successfully');
      }
    }

    const result = await response.response;
    const resultText = result.text();
    
    if (DEBUG_MODE) {
      console.log('📤 Chat response received, length:', resultText.length);
    }
    
    return resultText;
  } catch (error) {
    console.error('❌ Both models failed:', error);
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

export const isGeminiInitialized = () => {
  return !!genAI && !!primaryModel && !!fallbackModel && !!validationModel;
}; 