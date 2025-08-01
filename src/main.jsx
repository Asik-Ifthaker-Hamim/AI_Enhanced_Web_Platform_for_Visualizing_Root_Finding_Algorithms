import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Initialize API key from environment variable in development
if (__IS_DEV__ && __GEMINI_API_KEY__) {
  const existingKey = localStorage.getItem('gemini_api_key');
  if (!existingKey) {
    localStorage.setItem('gemini_api_key', __GEMINI_API_KEY__);
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
