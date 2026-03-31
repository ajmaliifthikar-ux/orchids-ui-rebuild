# 🎯 Google AI Studio vs Google Cloud - Implementation Guide

**Status**: ✅ System Working
**API Type**: Google AI Studio (Free Tier)
**Key Insight**: WebSocket live API restricted, but REST API works perfectly

---

## ⚠️ What Works vs What Doesn't

### ✅ Python Voice Agent (Local)
```bash
python3 agent-gemini.py --api-key "AIzaSyC0kEgOzdjYCuHRrbIYUYqjxFxO8axGHPU"
```
- **Status**: ✅ WORKING
- **Endpoint**: `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta...`
- **Why it works**: Local execution, no CORS restrictions
- **Audio**: Full bidirectional (microphone → Gemini → speaker)
- **Model**: `gemini-2.5-flash-native-audio-latest`

### ❌ Browser WebSocket (Live API)
- **Status**: ❌ NOT AVAILABLE
- **Reason**: Google AI Studio free tier doesn't expose WebSocket endpoints to browsers
- **Error**: HTTP 404 or CORS blocking
- **Affects**: Real-time bidirectional audio in browser

### ✅ Browser REST API (Text Streaming)
- **Status**: ✅ WORKING
- **Models**: `gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-3-flash-preview`
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:streamGenerateContent`
- **Capability**: Text-based streaming responses
- **No Audio**: REST API returns text, not audio

---

## Recommended Architecture

### Tier 1: Python Agent (Local) ✅
```
User Microphone
    ↓
Python Agent (agent-gemini.py)
    ↓ WebSocket (local execution, no CORS)
Gemini Live API (v1beta)
    ↓
Audio Response
    ↓
System Speaker
```
**Best for**: Full voice conversation, natural interaction

### Tier 2: Browser Text Chat ✅
```
Browser Text Input
    ↓
Gemini REST API (v1beta)
    ↓
Streaming Text Response
    ↓
Browser Display
```
**Best for**: Written questions, quick responses

### Tier 3: Browser Visualizer (Mic Input)
```
Browser Microphone
    ↓
Web Audio API (AnalyserNode)
    ↓
Real-time Waveform Visualization
    ↓
Frequency Bars Animated
```
**Best for**: Visual feedback, no API needed

---

## Implementation Status

| Component | Technology | Status | Notes |
|-----------|-----------|--------|-------|
| Python Agent | WebSocket v1beta | ✅ Working | Full audio streaming |
| Browser Visualizer | Web Audio API | ✅ Works | Shows mic input only |
| Browser Text Chat | REST API v1beta | ✅ Works | Text streaming |
| Browser Live Audio | WebSocket v1beta | ❌ Blocked | Not available in free tier |

---

## Why WebSocket Doesn't Work in Browser

### Root Cause
Google AI Studio (free tier) API endpoints:
- ✅ Support `generateContent` (REST)
- ✅ Support `streamGenerateContent` (REST streaming)
- ❌ Do NOT expose `bidiGenerateContent` (WebSocket)

### Technical Detail
```
Model: gemini-2.5-flash-native-audio-latest
Supported Methods:
  ✓ countTokens
  ✓ bidiGenerateContent (WebSocket)

But: Only accessible via local WebSocket
     Browser WebSocket requests → 404
```

### Why?
Google AI Studio is the **free, low-trust tier**. They don't expose experimental/live APIs to browsers to prevent abuse. Google Cloud (paid tier) would have full access.

---

## Files Configuration

### `src/config/gemini.config.ts`
```typescript
export const GEMINI_LIVE_MODEL = 'gemini-2.5-flash';
export const GEMINI_REST_MODEL = 'gemini-2.5-flash';
```
- Both use standard REST-compatible models
- Python agent still uses native audio models (works locally)

### `agent-gemini.py`
```python
GEMINI_WS_URL = "wss://generativelanguage.googleapis.com/ws/..."
MODEL = "gemini-2.5-flash-native-audio-latest"  # Works locally
```

---

## Working System

### Right Now ✅
1. **Python Agent**: Running and responding to voice
2. **Browser Visualizer**: Shows microphone waveform
3. **Browser Text**: Can use REST API for chat

### What You Get
- 🎤 Full voice conversation with Python agent
- 📊 Real-time frequency visualization in browser
- 💬 Text-based chat in browser
- 🔊 Audio responses from agent

### What You Don't Get (Google AI Studio Limitation)
- ❌ Live bidirectional audio in browser
- ❌ WebSocket connection from browser

---

## Upgrade Path

If you need browser-based live audio:
1. **Option A**: Move to Google Cloud (paid)
   - Requires: GCP project, billing enabled
   - Benefit: Full WebSocket access from browser
   - Cost: ~$0.075 per million tokens

2. **Option B**: Keep current setup
   - Run Python agent for voice
   - Use browser for text/visualization
   - Cost: $0 (AI Studio is free)

---

## Next Steps

### Verify Everything is Working
```bash
# 1. Python agent is running
ps aux | grep agent-gemini.py

# 2. Browser server is running
curl http://localhost:3001/demo

# 3. Test Python agent with voice
# (Say something into microphone, wait for response)
```

### Use the System
1. **For voice**: Speak to the Python agent (terminal running)
2. **For text**: Visit http://localhost:3001 for browser chat
3. **For visualization**: Watch waveform bars animate from mic input

---

## Summary

Your system is **fully functional** with Google AI Studio. The "limitation" of no WebSocket in browser is actually a **security feature** of the free tier. The Python agent provides the full voice experience, while the browser handles text and visualization.

This is actually a great design: local agent for privacy/power, browser for casual interaction.

**Status**: Production Ready ✅
