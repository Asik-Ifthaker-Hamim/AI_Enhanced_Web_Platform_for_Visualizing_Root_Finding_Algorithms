// Get API key from environment variables or localStorage
export const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');

// Model configurations
export const GEMINI_MODELS = {
  PRIMARY: "gemini-2.0-flash",     // Primary model for chat and validation
  FALLBACK: "gemini-1.5-flash",    // Fallback model if primary fails
  VALIDATION: "gemini-2.0-flash"   // Fast model for validation
};

// Debug mode for logging
export const DEBUG_MODE = false; 