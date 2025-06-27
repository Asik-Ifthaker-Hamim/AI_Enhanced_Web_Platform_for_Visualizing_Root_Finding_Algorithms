import { GoogleGenerativeAI } from "@google/generative-ai";

// Default API key - can be overridden by user
const DEFAULT_API_KEY = "AIzaSyBs0VFXBg7WEh0RjqOnUvdBSG2j6PH6hjQ";

let genAI = null;

export const initializeGemini = (apiKey = DEFAULT_API_KEY) => {
  if (!apiKey) {
    throw new Error('API key is required');
  }
  genAI = new GoogleGenerativeAI(apiKey);
  return true;
};

// Auto-initialize with default API key
try {
  initializeGemini(DEFAULT_API_KEY);
} catch (error) {
  console.warn('Failed to initialize Gemini with default API key:', error);
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

export const validateSolutionWithGemini = async (equation, userSolution, expectedSolution) => {
  if (!genAI) {
    throw new Error('Gemini not initialized. Please provide an API key.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are Dr. Sarah Chen, a renowned professor of Numerical Analysis with 15+ years of experience teaching computational mathematics. You are reviewing a student's solution to a numerical methods problem with patience, expertise, and encouragement.

**PROBLEM CONTEXT:**
Equation to solve: ${equation}
Expected/Reference Answer: ${expectedSolution}

**STUDENT'S SUBMITTED SOLUTION:**
${userSolution}

**YOUR EVALUATION TASK:**
Analyze this solution as both a mathematician and educator. Provide comprehensive feedback that helps the student learn and improve.

**EVALUATION CRITERIA:**
1. **Numerical Accuracy** (30 points): Are the final numerical values correct within ±0.001 tolerance?
2. **Method Selection & Application** (25 points): Did they choose and correctly apply a numerical method?
3. **Mathematical Reasoning** (20 points): Are the steps logically sound and well-explained?
4. **Presentation & Communication** (15 points): Is the solution clearly written and organized?
5. **Understanding Demonstration** (10 points): Do they show understanding of convergence, iterations, etc.?

**RESPONSE FORMAT - JSON ONLY:**
{
  "isCorrect": boolean,
  "score": number (0-100),
  "feedback": "Warm, encouraging, detailed feedback (2-3 sentences explaining what they did well and what needs improvement)",
  "correctRoots": ["2", "-2"] (correct numerical values as strings),
  "extractedAnswers": ["answers you found in their solution"],
  "methodUsed": "Name of numerical method identified (Newton-Raphson, Bisection, etc.) or 'Not specified'",
  "stepByStepCorrect": boolean,
  "suggestions": [
    "Specific, actionable improvement suggestion 1",
    "Specific, actionable improvement suggestion 2",
    "Specific, actionable improvement suggestion 3"
  ],
  "strengths": ["What they did well - be specific"],
  "nextSteps": "What they should practice next to improve their numerical methods skills"
}

**PROFESSOR'S TEACHING PHILOSOPHY:**
- Celebrate correct reasoning even if minor errors exist
- Guide toward understanding, not just correct answers
- Encourage showing all work and explaining thought process
- Recognize effort and mathematical thinking
- Provide specific, actionable feedback for improvement

**SPECIAL INSTRUCTIONS:**
- If they got the right answer with good methodology: Score 85-100 with encouraging feedback
- If they got the right answer but poor explanation: Score 70-84 with feedback on communication
- If they used wrong method but good reasoning: Score 50-69 with method guidance
- If completely incorrect: Score 0-49 but still encourage and guide
- Always be constructive and educational in your feedback

**CRITICAL: Your response must be ONLY valid JSON. No markdown, no code blocks, no explanations. Start with { and end with }**

Example response format:
{
  "isCorrect": true,
  "score": 95,
  "feedback": "Excellent work! You correctly applied the Newton-Raphson method...",
  "correctRoots": ["2", "-2"],
  "extractedAnswers": ["2", "-2"],
  "methodUsed": "Newton-Raphson",
  "stepByStepCorrect": true,
  "suggestions": ["Consider showing more decimal places in intermediate steps"],
  "strengths": ["Clear methodology", "Correct final answer"],
  "nextSteps": "Try solving a more complex cubic equation next"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean and parse the JSON response
    try {
      // Remove any markdown code blocks or extra formatting
      let cleanText = text.trim();
      
      // Remove markdown code blocks if present
      cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      cleanText = cleanText.replace(/```\s*/g, '');
      
      // Find JSON object boundaries
      const startIndex = cleanText.indexOf('{');
      const lastIndex = cleanText.lastIndexOf('}');
      
      if (startIndex !== -1 && lastIndex !== -1 && lastIndex > startIndex) {
        cleanText = cleanText.substring(startIndex, lastIndex + 1);
      }
      
      const evaluation = JSON.parse(cleanText);
      
      // Validate that required fields exist
      if (typeof evaluation.isCorrect === 'undefined' || typeof evaluation.score === 'undefined') {
        throw new Error('Missing required fields in AI response');
      }
      
      return evaluation;
    } catch (error) {
      // If JSON parsing fails, create a fallback response that analyzes the raw text
      console.error('JSON parsing error:', error);
      console.log('Raw AI response:', text);
      
             // Use basic validation as fallback for JSON parsing errors
       console.log('Using fallback validation due to JSON parsing error');
       const fallbackResult = basicValidation(equation, userSolution);
       fallbackResult.error = "JSON_PARSE_ERROR";
       fallbackResult.feedback = "🔧 AI response formatting issue. Using basic analysis: " + fallbackResult.feedback;
       fallbackResult.rawResponse = text.substring(0, 200) + (text.length > 200 ? '...' : '');
       return fallbackResult;
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Handle specific error types
    if (error.message.includes('429') || error.message.includes('quota')) {
      return {
        isCorrect: false,
        score: 0,
        feedback: "⏰ API rate limit reached. Please wait a moment and try again. The free tier has daily and per-minute limits.",
        error: "QUOTA_EXCEEDED",
        suggestions: [
          "Wait a few minutes before trying again",
          "The system will work normally after the rate limit resets",
          "You can optionally use your own Gemini API key for higher limits"
        ],
        nextSteps: "Try submitting your solution again in a few minutes."
      };
    }
    
    if (error.message.includes('API key')) {
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
    
    // Generic error handling - use basic validation as fallback
    console.log('Using fallback validation due to API error');
    const fallbackResult = basicValidation(equation, userSolution);
    fallbackResult.error = "AI_UNAVAILABLE";
    fallbackResult.feedback = "🤖 AI validation is temporarily unavailable. Using basic analysis: " + fallbackResult.feedback;
    return fallbackResult;
  }
};

export const isGeminiInitialized = () => {
  return genAI !== null;
}; 