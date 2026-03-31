#!/usr/bin/env python3
"""
🎤 Gemini Voice Agent (Morgan-Gemini Hybrid)

A simple, standalone voice agent powered by Gemini Live API.
No LiveKit required — just a Gemini API key.

Usage:
  python agent-gemini.py --api-key YOUR_GEMINI_KEY
"""

import os
import sys
import argparse
import asyncio
import json
import logging
from typing import Optional
import websockets
import base64
import pyaudio
import threading
from queue import Queue

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("gemini-agent")

# ==========================================
# 🎯 CONFIGURATION
# ==========================================
GEMINI_WS_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent"
MODEL = "gemini-2.5-flash-native-audio-latest"
VOICE = "Puck"

# Audio config (Gemini requirements)
INPUT_SAMPLE_RATE = 16000
OUTPUT_SAMPLE_RATE = 24000
CHUNK_SIZE = 4096

# ==========================================
# 🎙️ AUDIO CAPTURE (Microphone)
# ==========================================
class MicrophoneCapture:
    def __init__(self, sample_rate=INPUT_SAMPLE_RATE):
        self.sample_rate = sample_rate
        self.audio = pyaudio.PyAudio()
        self.stream = None
        self.running = False
        self.audio_queue = Queue()
        self.thread = None

    def start(self):
        """Start capturing audio from microphone"""
        self.stream = self.audio.open(
            format=pyaudio.paFloat32,
            channels=1,
            rate=self.sample_rate,
            input=True,
            frames_per_buffer=CHUNK_SIZE,
            stream_callback=self._audio_callback,
        )
        self.running = True
        self.stream.start_stream()
        logger.info("🎤 Microphone started")

    def _audio_callback(self, in_data, frame_count, time_info, status):
        """Callback for audio stream"""
        if status:
            logger.warning(f"Audio status: {status}")
        self.audio_queue.put(in_data)
        return (in_data, pyaudio.paContinue)

    def get_chunk(self):
        """Get next audio chunk (non-blocking)"""
        try:
            return self.audio_queue.get(timeout=0.1)
        except:
            return None

    def stop(self):
        """Stop microphone capture"""
        self.running = False
        if self.stream:
            self.stream.stop_stream()
            self.stream.close()
        self.audio.terminate()
        logger.info("🎤 Microphone stopped")


# ==========================================
# 🔊 AUDIO PLAYBACK (Speaker)
# ==========================================
class SpeakerPlayback:
    def __init__(self, sample_rate=OUTPUT_SAMPLE_RATE):
        self.sample_rate = sample_rate
        self.audio = pyaudio.PyAudio()
        self.stream = None

    def start(self):
        """Start playback stream"""
        self.stream = self.audio.open(
            format=pyaudio.paFloat32,
            channels=1,
            rate=self.sample_rate,
            output=True,
            frames_per_buffer=CHUNK_SIZE,
        )
        logger.info("🔊 Speaker started")

    def play(self, base64_data: str):
        """Decode base64 audio and play"""
        try:
            audio_bytes = base64.b64decode(base64_data)
            # Convert bytes to float32
            import numpy as np
            int16_array = np.frombuffer(audio_bytes, dtype=np.int16)
            float32_array = int16_array.astype(np.float32) / 32768.0
            self.stream.write(float32_array.tobytes())
        except Exception as e:
            logger.error(f"Playback error: {e}")

    def stop(self):
        """Stop playback"""
        if self.stream:
            self.stream.stop_stream()
            self.stream.close()
        self.audio.terminate()
        logger.info("🔊 Speaker stopped")


# ==========================================
# 🧠 GEMINI AGENT
# ==========================================
class GeminiAgent:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.ws = None
        self.mic = MicrophoneCapture()
        self.speaker = SpeakerPlayback()
        self.running = False

    async def connect(self):
        """Connect to Gemini Live API"""
        url = f"{GEMINI_WS_URL}?key={self.api_key}"
        logger.info("📡 Connecting to Gemini Live API...")

        try:
            self.ws = await websockets.connect(url)
            logger.info("✅ Connected to Gemini")

            # Send setup message
            setup_msg = {
                "setup": {
                    "model": f"models/{MODEL}",
                    "generation_config": {
                        "response_modalities": ["AUDIO"],
                        "speech_config": {
                            "voice_config": {
                                "prebuilt_voice_config": {
                                    "voice_name": VOICE
                                }
                            }
                        }
                    },
                    "system_instruction": {
                        "parts": [{
                            "text": """You are a friendly, helpful voice assistant powered by Gemini.

- Speak naturally and conversationally
- Keep responses concise (1-3 sentences usually)
- Be helpful, accurate, and respectful
- Never reveal that you're an AI unless asked
- Use natural pauses and vocal expressions"""
                        }]
                    }
                }
            }

            await self.ws.send(json.dumps(setup_msg))
            logger.info("📤 Setup message sent")

        except Exception as e:
            logger.error(f"Connection failed: {e}")
            return False

        return True

    async def send_audio_chunk(self):
        """Capture and send audio chunks"""
        if not self.ws or not self.running:
            return

        chunk = self.mic.get_chunk()
        if not chunk:
            return

        try:
            # Convert to base64
            base64_chunk = base64.b64encode(chunk).decode()

            # New API schema with 'audio' field (media_chunks is deprecated)
            msg = {
                "realtime_input": {
                    "audio": {
                        "mime_type": f"audio/pcm;rate={INPUT_SAMPLE_RATE}",
                        "data": base64_chunk
                    }
                }
            }

            await self.ws.send(json.dumps(msg))
        except Exception as e:
            logger.error(f"Send error: {e}")

    async def receive_messages(self):
        """Listen for Gemini responses"""
        if not self.ws:
            return

        try:
            async for message in self.ws:
                data = json.loads(message)

                # Setup complete
                if data.get("setupComplete") or data.get("setup_complete"):
                    logger.info("🎉 Setup complete - agent ready!")
                    continue

                # Server content (audio response)
                server_content = data.get("serverContent") or data.get("server_content")
                if server_content:
                    model_turn = server_content.get("modelTurn") or server_content.get("model_turn")
                    if model_turn:
                        for part in model_turn.get("parts", []):
                            if part.get("inlineData"):
                                audio_data = part["inlineData"].get("data")
                                if audio_data:
                                    self.speaker.play(audio_data)
                            elif part.get("inline_data"):
                                audio_data = part["inline_data"].get("data")
                                if audio_data:
                                    self.speaker.play(audio_data)
                            elif part.get("text"):
                                logger.info(f"🤖 AI: {part['text']}")

        except websockets.exceptions.ConnectionClosed:
            logger.info("📴 Connection closed")
        except Exception as e:
            logger.error(f"Receive error: {e}")

    async def run(self):
        """Main agent loop"""
        if not await self.connect():
            return

        self.running = True
        self.mic.start()
        self.speaker.start()

        logger.info("\n🎤 Agent running. Speak to the AI. Press Ctrl+C to stop.\n")

        try:
            # Create tasks for concurrent audio I/O
            await asyncio.gather(
                self.receive_messages(),
                self._audio_send_loop()
            )
        except KeyboardInterrupt:
            logger.info("\n⏹️  Shutting down...")
        except Exception as e:
            logger.error(f"Error: {e}")
        finally:
            self.running = False
            self.mic.stop()
            self.speaker.stop()
            if self.ws:
                await self.ws.close()

    async def _audio_send_loop(self):
        """Continuously send audio chunks"""
        while self.running:
            await self.send_audio_chunk()
            await asyncio.sleep(0.05)  # ~50ms per chunk


# ==========================================
# 🚀 MAIN
# ==========================================
async def main():
    parser = argparse.ArgumentParser(description="Gemini Voice Agent")
    parser.add_argument(
        "--api-key",
        default=os.getenv("GEMINI_API_KEY"),
        help="Gemini API key (or set GEMINI_API_KEY env var)"
    )
    args = parser.parse_args()

    if not args.api_key:
        logger.error("❌ No API key provided. Set GEMINI_API_KEY or use --api-key")
        sys.exit(1)

    agent = GeminiAgent(args.api_key)
    await agent.run()


if __name__ == "__main__":
    asyncio.run(main())
