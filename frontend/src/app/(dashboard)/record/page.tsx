"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { apiClient } from "@/lib/api-client";
import { Mic, Square, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RecordPage() {
  const router = useRouter();
  const { isRecording, audioBlob, startRecording, stopRecording, resetRecording } = useAudioRecorder();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!audioBlob) return;
    setUploading(true);
    try {
      const taskId = await apiClient.uploadAudio(audioBlob);
      toast.success("Processing started! Redirecting to dashboard...");
      router.push(`/dashboard?poll=${taskId}`);
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
      resetRecording();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 p-4">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold text-gradient">Dictation Studio</h1>
        <p className="text-white/60 text-lg">Record your clinical notes with crystal clarity</p>
      </div>

      <GlassCard className="w-full max-w-md flex flex-col items-center gap-6 p-8">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full bg-purple-500/20 blur-2xl transition-all ${isRecording ? 'animate-ping' : ''}`} />
          <div className="relative z-10 w-24 h-24 rounded-full glass flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
            {!isRecording && !audioBlob && (
              <button onClick={startRecording} className="text-white/80 hover:text-white">
                <Mic size={40} />
              </button>
            )}
            {isRecording && (
              <button onClick={stopRecording} className="text-red-400 hover:text-red-300 animate-pulse">
                <Square size={40} />
              </button>
            )}
            {!isRecording && audioBlob && (
              <div className="text-green-400 font-bold text-xl">✓</div>
            )}
          </div>
        </div>

        {audioBlob && (
          <div className="w-full flex gap-4">
            <Button variant="secondary" className="flex-1" onClick={resetRecording} disabled={uploading}>
              Re‑record
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleUpload} disabled={uploading}>
              {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
              {uploading ? "Uploading..." : "Upload Note"}
            </Button>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
