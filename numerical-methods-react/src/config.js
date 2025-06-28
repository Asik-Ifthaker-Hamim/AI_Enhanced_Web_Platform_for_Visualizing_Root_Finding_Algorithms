export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Model configurations
export const GEMINI_MODELS = {
  PRIMARY: "gemini-2.0-flash",    // Primary fast model
  FALLBACK: "gemini-1.5-flash",   // Fallback model if primary fails
  VALIDATION: "gemini-2.0-flash"  // Model for validation
};

// Debug mode for logging
export const DEBUG_MODE = true; 