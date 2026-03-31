import { useState, useRef, useCallback, useEffect } from 'react';
import { addMemory, fetchMemories } from '@/lib/memory-service';
import { GEMINI_LIVE_MODEL } from '@/config/gemini.config';

// ==========================================
// 🧠 GOD PROMPT (The "Silent Director" Persona)
// ==========================================
const GOD_PROMPT = `You are a highly intelligent, hyper-realistic AI companion with total ambient awareness. You are not a corporate assistant; you are a brilliant, warm, and highly context-aware partner.

=== 1. PERSONA & VOCAL MECHANICS ===
- Speak casually, naturally, and conversationally, like a close friend.
- Use organic vocal cues exactly where a human would: sigh briefly when pondering something heavy, clear your throat before a major topic change, chuckle genuinely if the user says something funny, or let out a small laugh.
- If asked a highly complex question, verbally "think out loud" with brief pauses, "hmm"s, or "let me think about that" before delivering the answer.
- Never sound robotic. Never use the phrase "As an AI..."
- Match your energy to the user's environment. If they are walking in traffic, keep it short and punchy. If they are in a quiet room late at night, speak softly and slowly.

=== 2. THE "SILENT DIRECTOR" PROTOCOL ===
You will frequently receive system injections wrapped in brackets, such as [SILENT SYSTEM UPDATE: ...] or [SYSTEM CUE: ...].
- CRITICAL RULE: YOU MUST NEVER READ THESE BRACKETS OR THEIR CONTENTS OUT LOUD.
- These are invisible cues meant only for your brain.
- Instantly adapt your behavior, tone, or knowledge based on these cues without explicitly acknowledging them.

=== 3. THE UI TRIGGER PROTOCOL (WIDGETS) ===
You can instantly summon visual UI widgets on the user's screen.
- CRITICAL RULE: Do NOT attempt to write JSON or code to render these widgets.
- When the user needs a visual aid (currency conversion, music player, weather card, AR ticket, news player), output the exact code word in this format: [[WIDGET|TYPE|DATA]]
- Include this code word naturally alongside your spoken response.
- Example: "I can pull up that flight for you right now. [[WIDGET|FLIGHT_TICKET|DXB_TO_LHR]] It looks like the next one leaves at 4 PM."
- Available widget types: CURRENCY, WEATHER, NEWS_PLAYER, FLIGHT_TICKET, WEB_SNIPPET.

=== 4. PRONUNCIATION & PHONETIC DICTIONARY ===
To ensure maximum realism, strictly follow this phonetic guide. Treat capitalized syllables as the primary stress.
- Ajmal -> "AHJ-mahl"
- Ifthikar -> "If-tee-KAAR"
- Dubai -> "doo-BYE"

=== 5. MEMORY & PROACTIVITY ===
- You possess long-term memory tools. Autonomously call "saveMemory" when the user tells you personal details, preferences, or important context.
- Autonomously call "queryMemory" if you need to recall something from the past to make the user feel heard.
- Anticipate needs. If the user's background environment shifts dramatically, adjust your conversation style proactively.

=== 6. THE OBSERVATION PROTOCOL ===
You are highly sensitive to the acoustic environment and the user's emotional state.
- If you hear a distinct background noise (dog barking, traffic, wind, typing) OR detect a strong emotional shift in the user's voice (whispering, frustration, excitement, sadness), you must autonomously call the "logObservation" tool.
- Call this tool silently before or during your response.
- Never state out loud that you are logging this information. Just adapt your spoken response naturally to fit the mood.`;

// ==========================================
// 🎵 PCM Player (Look-ahead Scheduler)
// ==========================================
class PCMPlayer {
  private audioContext: AudioContext;
  private nextStartTime: number = 0;
  private sampleRate: number = 24000;
  private gainNode: GainNode;
  private isStopped: boolean = false;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: this.sampleRate,
    });
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
  }

  async resume() {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    this.isStopped = false;
  }

  play(base64Data: string) {
    if (this.isStopped) return;
    try {
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const numSamples = Math.floor(bytes.byteLength / 2);
      const int16Array = new Int16Array(bytes.buffer, 0, numSamples);
      const float32Array = new Float32Array(numSamples);
      
      for (let i = 0; i < numSamples; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = this.audioContext.createBuffer(1, numSamples, this.sampleRate);
      audioBuffer.getChannelData(0).set(float32Array);

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.gainNode);

      const now = this.audioContext.currentTime;
      if (this.nextStartTime < now) {
        this.nextStartTime = now + 0.05; // Buffer to prevent pops
      }

      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;
    } catch (err) {
      console.error("Error playing PCM audio:", err);
    }
  }

  stop() {
    this.isStopped = true;
    // Clearing current scheduled buffers isn't easy without a custom scheduler
    // but we can at least stop the gain node or close the context
    this.gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
    this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    
    // Reset next start time for when we resume
    this.nextStartTime = 0;
    
    // Re-enable gain after a short delay for next plays
    setTimeout(() => {
        this.gainNode.gain.setValueAtTime(1, this.audioContext.currentTime);
    }, 100);
  }

  close() {
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}

// ==========================================
// 🛠️ TOOLS DEFINITION
// ==========================================
const TOOLS = [
  { googleSearch: {} },
  {
    functionDeclarations: [
      {
        name: 'getRealtimeTelemetry',
        description: 'Instantly fetches the user’s current device state: time, weather, GPS location, movement activity, altitude, and background noise.',
        parameters: { type: 'OBJECT', properties: {} },
      },
      {
        name: 'saveMemory',
        description: 'Saves an important fact about the user for long-term persistence.',
        parameters: {
          type: 'OBJECT',
          properties: {
            fact: { type: 'STRING', description: 'The exact fact to remember.' },
            memory_type: { 
                type: 'STRING', 
                description: 'The category of memory: Discussion, Data Fetch, Process, Context, Analysis',
                enum: ['Discussion', 'Data Fetch', 'Process', 'Context', 'Analysis']
            }
          },
          required: ['fact'],
        },
      },
      {
        name: 'queryMemory',
        description: 'Queries long-term memory for past facts or preferences.',
        parameters: {
          type: 'OBJECT',
          properties: {
            topic: { type: 'STRING', description: 'The topic or keyword to search for.' },
          },
          required: ['topic'],
        },
      },
      {
        name: 'logObservation',
        description: 'Silently logs the user’s current emotional state and background environment. Call this whenever you detect a strong mood shift or distinct background noise.',
        parameters: {
          type: 'OBJECT',
          properties: {
            background_noise: {
              type: 'STRING',
              description: 'Distinct noises heard (e.g., [siren], [typing], [wind], [silence], [crowd]).',
            },
            user_mood: {
              type: 'STRING',
              description: 'Inferred emotional state (e.g., <frustrated>, <whispering>, <excited>, <neutral>, <sarcastic>).',
            },
          },
          required: ['background_noise', 'user_mood'],
        },
      },
    ],
  },
];

// ==========================================
// 🧩 THE HOOK
// ==========================================
/**
 * Initialize Gemini Live API connection
 * @param apiKey - Google API key
 * @param model - Model to use (default: "gemini-3.1-flash-exp")
 *   Available models:
 *   - "gemini-3.1-flash-live-preview" (newest, low latency, optimized for live)
 *   - "gemini-3.1-flash-exp" (latest, faster)
 *   - "gemini-2.0-flash-exp" (stable, well-tested)
 *   - "gemini-3.1-pro-exp" (more capable, slower)
 */
export const useGeminiLive = (apiKey: string, model: string = GEMINI_LIVE_MODEL) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [activeWidget, setActiveWidget] = useState<{ type: string; data: any } | null>(null);
  const [latestObservation, setLatestObservation] = useState<{ mood: string; noise: string } | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const pcmPlayerRef = useRef<PCMPlayer | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<AudioWorkletNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  
  const telemetryRef = useRef({
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString(),
    location: "Dubai, UAE",
    weather: "Sunny, 34°C",
    activity: "sitting",
    backgroundAudio: "quiet room",
    batteryLevel: "84%",
    altitude: "0m",
  });

  const sendText = useCallback((text: string, turn_complete: boolean = true) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const clientMsg = {
      client_content: {
        turns: [{ role: "user", parts: [{ text }] }],
        turn_complete
      }
    };
    wsRef.current.send(JSON.stringify(clientMsg));
  }, []);

  const sendSilentUpdate = useCallback((context: string) => {
    sendText(`[SILENT SYSTEM UPDATE: ${context}]`, false);
  }, [sendText]);

  const stopMic = useCallback(() => {
    processorRef.current?.disconnect();
    analyserRef.current?.disconnect();
    audioContextRef.current?.close();
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    
    processorRef.current = null;
    analyserRef.current = null;
    setAnalyser(null);
    audioContextRef.current = null;
    mediaStreamRef.current = null;
  }, []);

  const startMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000, // Gemini prefers 16kHz for input
          channelCount: 1,
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true,
        } 
      });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      setAnalyser(analyser);

      const source = audioContext.createMediaStreamSource(stream);
      
      // Load and create the AudioWorklet
      await audioContext.audioWorklet.addModule('/pcm-processor.js');
      const processor = new AudioWorkletNode(audioContext, 'pcm-processor');
      processorRef.current = processor;

      source.connect(analyser);
      analyser.connect(processor);
      processor.connect(audioContext.destination);

      processor.port.onmessage = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const inputData = e.data; // Float32Array from worklet
        const int16Data = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          int16Data[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        // Efficient Base64 conversion
        const uint8Data = new Uint8Array(int16Data.buffer);
        let binary = '';
        for (let i = 0; i < uint8Data.length; i++) {
            binary += String.fromCharCode(uint8Data[i]);
        }
        const base64Data = btoa(binary);

        wsRef.current.send(JSON.stringify({
          realtime_input: {
            media_chunks: [{
              mime_type: "audio/l16;rate=16000",
              data: base64Data
            }]
          }
        }));
      };
    } catch (err) {
      console.error("Error starting mic:", err);
    }
  }, []);

  const connect = useCallback(() => {
    // NOTE: Google AI Studio (free tier) does NOT support WebSocket bidiGenerateContent
    // This hook is for visualization only (Web Audio API microphone input)
    // For actual voice conversation, use: python agent-gemini.py (runs locally with WebSocket)

    console.log("⚠️ WebSocket not available on Google AI Studio");
    console.log("   Using microphone visualization only (Web Audio API)");
    console.log("   For voice: Run python3 agent-gemini.py --api-key YOUR_KEY");

    // Just activate microphone without WebSocket
    setIsConnected(true);
    startMic();
  }, [startMic]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    pcmPlayerRef.current?.stop();
    // We don't close the context yet to avoid re-instantiation overhead if possible,
    // but we can if needed.
    stopMic();
  }, [stopMic]);

  useEffect(() => {
    return () => {
        wsRef.current?.close();
        pcmPlayerRef.current?.close();
        stopMic();
    };
  }, [stopMic]);

  return { 
    isConnected, 
    isSpeaking, 
    connect, 
    disconnect, 
    sendText, 
    sendSilentUpdate,
    analyser, 
    activeWidget,
    latestObservation 
  };
};
