import { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isRecording: boolean;
  isPaused: boolean;
  audioLevel?: number;
}

export default function WaveformVisualizer({
  isRecording,
  isPaused,
  audioLevel = 0.5,
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const barsRef = useRef<number[]>(Array.from({ length: 30 }, () => 20));

  useEffect(() => {
    if (!isRecording || isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / barsRef.current.length;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update bar heights
      barsRef.current = barsRef.current.map((bar, i) => {
        const target = audioLevel * height * (0.3 + Math.random() * 0.7);
        return bar + (target - bar) * 0.2;
      });

      // Draw bars
      ctx.fillStyle = '#006A4E';
      barsRef.current.forEach((barHeight, i) => {
        const x = i * barWidth + 2;
        const y = (height - barHeight) / 2;
        const radius = 4;

        // Rounded rectangle
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - 4 - radius, y);
        ctx.quadraticCurveTo(x + barWidth - 4, y, x + barWidth - 4, y + radius);
        ctx.lineTo(x + barWidth - 4, y + barHeight - radius);
        ctx.quadraticCurveTo(
          x + barWidth - 4,
          y + barHeight,
          x + barWidth - 4 - radius,
          y + barHeight
        );
        ctx.lineTo(x + radius, y + barHeight);
        ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, isPaused, audioLevel]);

  if (!isRecording || isPaused) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={80}
      className="w-full max-w-[300px] h-20 mx-auto"
    />
  );
}
