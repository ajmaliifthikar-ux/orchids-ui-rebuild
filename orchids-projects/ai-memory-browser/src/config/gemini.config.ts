/**
 * 🌍 Global Gemini Configuration
 *
 * Single source of truth for model and API key.
 * Change values here and ALL components update automatically.
 *
 * ⚡ No need to modify individual files — everything imports from here.
 */

// ==========================================
// 🔐 API KEY
// ==========================================
export const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// ==========================================
// 🤖 MODEL SELECTION
// ==========================================
/**
 * ⚠️ IMPORTANT: Google AI Studio Compatibility
 *
 * Free tier (AI Studio) limitations:
 * - ❌ NO bidiGenerateContent (WebSocket streaming)
 * - ✅ YES generateContent REST API
 *
 * Available models:
 * - "gemini-2.5-flash" ⚡ RECOMMENDED (REST API, works with AI Studio)
 * - "gemini-2.0-flash" (REST API, stable)
 * - "gemini-3-flash-preview" (REST API, newer)
 *
 * Browser-only (REST API compatible):
 * - "gemini-2.5-flash" ✅ Works
 */
export const GEMINI_LIVE_MODEL = 'gemini-2.5-flash';  // Fallback for browser
export const GEMINI_REST_MODEL = 'gemini-2.5-flash';  // Primary for all text/streaming

// ==========================================
// 🎙️ AUDIO SETTINGS
// ==========================================
export const AUDIO_CONFIG = {
  inputSampleRate: 16000,      // Gemini expects 16kHz input
  outputSampleRate: 24000,     // Gemini outputs 24kHz
  voiceName: 'Puck',           // Available: Puck (female), Charon (male)
  responseModality: 'AUDIO',   // 'AUDIO' or 'TEXT'
} as const;

// ==========================================
// 💭 EXTENDED THINKING (Text Mode)
// ==========================================
export const THINKING_CONFIG = {
  enabled: false,              // Enable extended thinking for REST API
  level: 'MEDIUM',            // 'LOW', 'MEDIUM', or 'HIGH'
} as const;

// ==========================================
// 🎯 GENERATION CONFIG
// ==========================================
export const GENERATION_CONFIG = {
  temperature: 0.7,            // Creativity (0.0 = deterministic, 1.0 = random)
  topP: 0.95,                  // Diversity
  maxOutputTokens: 2048,       // Max response length
} as const;

// ==========================================
// 🔄 MODE DEFAULTS
// ==========================================
export const MODE_CONFIG = {
  defaultMode: 'TEXT' as const,  // Start in TEXT, AUDIO, or HYBRID
  allowModeSwitch: true,         // Allow user to switch modes
} as const;

// ==========================================
// 🎓 QUICK REFERENCE
// ==========================================
/**
 * To use in any component:
 *
 * import { GEMINI_API_KEY, GEMINI_LIVE_MODEL, AUDIO_CONFIG } from '@/config/gemini.config';
 *
 * const { isConnected } = useGeminiLive(GEMINI_API_KEY, GEMINI_LIVE_MODEL);
 *
 * To change everything globally:
 * 1. Edit GEMINI_LIVE_MODEL here
 * 2. All components automatically use the new model
 * 3. No other files need changes
 */
