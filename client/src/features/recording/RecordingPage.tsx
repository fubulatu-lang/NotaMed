import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiMicrophone, HiStop, HiPlay, HiPause } from 'react-icons/hi';
import SpeechRecorder from './SpeechRecorder';

export default function RecordingPage() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number>();

  const startTimer = useCallback(() => {
    timerRef.current = window.setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  }, []);

  const RecordingPage = () => {
  return (
    <div className="recording-page">
      <h1>Clinical Dictation</h1>
      <SpeechRecorder />
    </div>
  );
};

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        chunksRef.current = [];
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setDuration(0);
      startTimer();
    } catch (error) {
      toast.error('Microphone access denied. Please enable microphone permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopTimer();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <h2 className="text-headline-sm text-center">Record Dictation</h2>

      {/* Timer Display */}
      <div className="text-center">
        <div className="text-display-md font-mono text-primary">
          {formatTime(duration)}
        </div>
        {isRecording && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-3 h-3 bg-error rounded-full recording-pulse" />
            <span className="text-label-lg text-error">
              {isPaused ? 'Paused' : 'Recording'}
            </span>
          </div>
        )}
      </div>

      {/* Recording Controls */}
      <div className="flex items-center justify-center gap-6">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="w-20 h-20 bg-error rounded-full flex items-center justify-center 
                       shadow-elevation-3 hover:shadow-elevation-4 transition-shadow
                       active:scale-95 transform"
          >
            <HiMicrophone className="w-10 h-10 text-white" />
          </button>
        ) : (
          <>
            {isPaused ? (
              <button
                onClick={resumeRecording}
                className="w-16 h-16 bg-primary rounded-full flex items-center justify-center 
                           shadow-elevation-2 hover:shadow-elevation-3 transition-all"
              >
                <HiPlay className="w-8 h-8 text-white" />
              </button>
            ) : (
              <button
                onClick={pauseRecording}
                className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center 
                           shadow-elevation-2 hover:shadow-elevation-3 transition-all"
              >
                <HiPause className="w-8 h-8 text-white" />
              </button>
            )}

            <button
              onClick={stopRecording}
              className="w-20 h-20 bg-error rounded-full flex items-center justify-center 
                         shadow-elevation-3 hover:shadow-elevation-4 transition-shadow
                         active:scale-95 transform"
            >
              <HiStop className="w-10 h-10 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Audio Preview */}
      {audioUrl && !isRecording && (
        <div className="card space-y-4">
          <h3 className="text-title-md">Recording Preview</h3>
          <audio src={audioUrl} controls className="w-full" />
          
          <button
            onClick={() => {
              toast.success('Processing dictation...');
              navigate('/');
            }}
            className="btn-primary w-full"
          >
            Process Dictation
          </button>
        </div>
      )}

      {/* Instructions */}
      {!isRecording && !audioUrl && (
        <div className="card">
          <h3 className="text-title-md mb-3">Tips for Best Results</h3>
          <ul className="space-y-2 text-body-md text-on-surface-variant">
            <li>• Speak clearly at a moderate pace</li>
            <li>• Minimize background noise</li>
            <li>• State section headers clearly</li>
            <li>• Include all relevant clinical details</li>
            <li>• Use standard medical terminology</li>
          </ul>
        </div>
      )}
    </div>
  );
}
