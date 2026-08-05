import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  audioBuffer: AudioBuffer | null;
  analyserNode: AnalyserNode | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  audioBuffer,
  analyserNode,
  currentTime,
  duration,
  isPlaying,
  onSeek,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Render static waveform peaks onto canvas
  const drawWaveform = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    if (!audioBuffer) return;

    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const centerY = height / 2;

    // Draw background grid lines
    ctx.strokeStyle = '#27272A';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw static waveform bars
    const progressRatio = duration > 0 ? currentTime / duration : 0;
    const progressX = width * progressRatio;

    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }

      const isPlayed = i <= progressX;
      ctx.fillStyle = isPlayed ? '#06B6D4' : '#7C3AED';
      ctx.globalAlpha = isPlayed ? 1.0 : 0.65;

      const barHeight = Math.max(3, (max - min) * centerY * 0.88);
      ctx.fillRect(i, centerY - barHeight / 2, 2, barHeight);
    }
    ctx.globalAlpha = 1.0;

    // Draw Playhead line with neon glow
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#06B6D4';
    ctx.shadowBlur = 10;
    ctx.fillRect(progressX - 1, 0, 3, height);
    ctx.shadowBlur = 0;
  };

  // Render real-time oscilloscope or frequency spectrum when playing
  const drawRealtimeSpectrum = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    drawWaveform(ctx, width, height);

    if (analyserNode && isPlaying) {
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserNode.getByteFrequencyData(dataArray);

      // Draw subtle glowing frequency spectrum overlay at bottom
      ctx.fillStyle = 'rgba(124, 58, 237, 0.25)';
      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * (height * 0.45);
        ctx.lineTo(x, height - barHeight);
        x += barWidth + 1;
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
    }

    if (isPlaying) {
      animationFrameId.current = requestAnimationFrame(drawRealtimeSpectrum);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = 150; // taller height
      const ctx = canvas.getContext('2d');
      if (ctx) drawWaveform(ctx, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [audioBuffer, currentTime, duration]);

  useEffect(() => {
    if (isPlaying) {
      animationFrameId.current = requestAnimationFrame(drawRealtimeSpectrum);
    } else {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) drawWaveform(ctx, canvas.width, canvas.height);
      }
    }

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isPlaying, currentTime, analyserNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || duration <= 0) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full bg-[#141417] border border-[#2A2A2E] rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between text-xs font-mono mb-2">
        <span className="text-cyan-400 font-bold text-sm">{formatTime(currentTime)}</span>
        <span className="text-xs uppercase tracking-wider text-gray-400 font-sans">Waveform Visualizer</span>
        <span className="text-violet-400 font-bold text-sm">{formatTime(duration)}</span>
      </div>

      {/* Canvas Waveform Display */}
      <div ref={containerRef} className="relative w-full cursor-pointer group rounded-xl overflow-hidden bg-[#0A0A0B] border border-[#2A2A2E] shadow-inner shadow-purple-950/20">
        <canvas
          id="waveform-canvas"
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-[150px] block"
        />

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity flex items-center justify-center">
          <span className="text-xs text-cyan-300 font-mono bg-black/80 border border-cyan-500/30 px-3 py-1 rounded-full shadow-lg">
            Click to seek &bull; {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};
