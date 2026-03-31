'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGeminiLive } from '@/hooks/use-gemini-live';
import { GEMINI_API_KEY, GEMINI_LIVE_MODEL } from '@/config/gemini.config';

interface AudioVisualizerProps {
  apiKey?: string;
  model?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  backgroundColor?: string;
}

/**
 * 🎨 Real-time Audio Waveform Visualizer
 *
 * Shows live audio input/output from Gemini with:
 * - Waveform animation
 * - Connection status
 * - Speaking indicator
 * - Frequency spectrum
 */
export function GeminiAudioVisualizer({
  apiKey = GEMINI_API_KEY,
  model = GEMINI_LIVE_MODEL,
  size = 'lg',
  color = '#3b82f6',
  backgroundColor = '#1f2937',
}: AudioVisualizerProps) {
  const { isConnected, isSpeaking, analyser, connect, disconnect } = useGeminiLive(apiKey, model);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [waveAmplitude, setWaveAmplitude] = useState(0);

  // Size mapping
  const sizeMap = {
    sm: { height: 120, bars: 32 },
    md: { height: 160, bars: 48 },
    lg: { height: 240, bars: 64 },
    xl: { height: 320, bars: 128 },
  };

  const { height: canvasHeight, bars } = sizeMap[size];
  const canvasWidth = bars * 3;

  // Draw waveform
  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    dataArrayRef.current = dataArray;

    const draw = () => {
      if (!analyser || !dataArrayRef.current) return;

      analyser.getByteFrequencyData(dataArrayRef.current);

      // Clear canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw frequency bars
      const barWidth = canvasWidth / bars;
      let maxAmplitude = 0;

      for (let i = 0; i < bars; i++) {
        const index = Math.floor((i / bars) * bufferLength);
        const value = dataArrayRef.current[index];
        maxAmplitude = Math.max(maxAmplitude, value);

        const barHeight = (value / 255) * canvasHeight;
        const x = i * barWidth;
        const y = canvasHeight - barHeight;

        // Gradient color based on amplitude
        const hue = (value / 255) * 60; // Blue to cyan gradient
        ctx.fillStyle = `hsl(${200 + hue}, 100%, 50%)`;
        ctx.fillRect(x, y, barWidth - 2, barHeight);

        // Glow effect for high amplitudes
        if (value > 200) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 10;
          ctx.fillStyle = `hsla(${200 + hue}, 100%, 60%, 0.5)`;
          ctx.fillRect(x - 2, y - 5, barWidth + 2, barHeight + 10);
          ctx.shadowBlur = 0;
        }
      }

      setWaveAmplitude(Math.round((maxAmplitude / 255) * 100));
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, canvasWidth, canvasHeight, bars, backgroundColor, color]);

  // Status indicator
  const statusColor = isConnected
    ? isSpeaking
      ? '#10b981'
      : '#3b82f6'
    : '#ef4444';

  const statusText = isConnected
    ? isSpeaking
      ? 'Speaking...'
      : 'Listening...'
    : 'Disconnected';

  return (
    <div className="w-full flex flex-col items-center gap-4 p-6 rounded-lg" style={{ backgroundColor }}>
      {/* Visualizer */}
      <div className="relative w-full flex justify-center">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="rounded border border-gray-700 transition-all duration-200"
          style={{
            boxShadow: isConnected
              ? `0 0 20px ${color}80`
              : 'none',
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 rounded border border-gray-700">
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: statusColor }}
          />
          <span className="text-sm font-medium text-gray-200">{statusText}</span>
        </div>

        {/* Amplitude Display */}
        <div className="text-xs text-gray-400">
          Level: <span className="text-blue-400 font-mono">{waveAmplitude}%</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="w-full flex gap-2">
        <button
          onClick={connect}
          disabled={isConnected}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded font-medium transition-colors text-sm"
        >
          {isConnected ? '✓ Connected' : 'Connect'}
        </button>
        <button
          onClick={disconnect}
          disabled={!isConnected}
          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded font-medium transition-colors text-sm"
        >
          Disconnect
        </button>
      </div>

      {/* Info */}
      <div className="w-full text-xs text-gray-400 text-center">
        Model: <span className="text-blue-400 font-mono">{model}</span>
      </div>
    </div>
  );
}

/**
 * 🎤 Minimal Waveform (Just the Bars)
 *
 * Lightweight version with just the frequency visualizer
 */
export function GeminiWaveformOnly({
  apiKey = GEMINI_API_KEY,
  model = GEMINI_LIVE_MODEL,
  barCount = 64,
  color = '#3b82f6',
}: {
  apiKey?: string;
  model?: string;
  barCount?: number;
  color?: string;
}) {
  const { analyser, isConnected } = useGeminiLive(apiKey, model);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / barCount;
      for (let i = 0; i < barCount; i++) {
        const index = Math.floor((i / barCount) * bufferLength);
        const barHeight = (dataArray[index] / 255) * canvas.height;

        ctx.fillStyle = isConnected ? color : '#666';
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, barCount, color, isConnected]);

  return (
    <canvas
      ref={canvasRef}
      width={barCount * 3}
      height={120}
      className="w-full rounded border border-gray-700"
    />
  );
}
