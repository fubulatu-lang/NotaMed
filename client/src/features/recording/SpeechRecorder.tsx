// client/src/features/recording/SpeechRecorder.tsx

import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../services/api/client';

export const SpeechRecorder: React.FC = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [soapNote, setSoapNote] = useState<{
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(
        'Your browser does not support speech recognition. Please use Google Chrome or type your note manually.'
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // Use 'any' to bypass TypeScript's incomplete definitions
    recognition.onresult = (event: any) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcriptPart;
        } else {
          interim += transcriptPart;
        }
      }
      setTranscript((prev) => (prev ? prev + ' ' + final : final) + ' ' + interim);

      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access and try again.');
      } else if (event.error === 'no-speech') {
        if (isListening) {
          recognition.stop();
          setTimeout(() => recognition.start(), 100);
        }
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, [isListening]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not available.');
      return;
    }
    try {
      recognitionRef.current.start();
      setIsListening(true);
      setError(null);
      silenceTimeoutRef.current = window.setTimeout(() => {
        stopListening();
      }, 3000);
    } catch (err) {
      console.error('Failed to start recognition:', err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setSoapNote(null);
  };

  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      const response = await apiClient.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  };

  const handleProcess = async () => {
  if (!transcript || transcript.trim() === '') {
    alert('Please speak something first.');
    return;
  }
  setIsProcessing(true);
  const payload = { transcript, template: 'SOAP' };
  console.log('Sending payload:', payload); // <-- ADD THIS
  try {
    const res = await fetch(`${API_URL}/formatting/note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    // ...
  }
};

  
    const isHealthy = await checkBackendHealth();
    if (!isHealthy) {
      setError(
        'Backend service is not reachable. Please check your network or try again later.'
      );
      setIsProcessing(false);
      return;
    }

    try {
      const data = await apiClient.post('/formatting/note', {
        transcript,
        template: 'SOAP',
      });
      setSoapNote(data.formatted_note);
    } catch (err: any) {
      console.error('Formatting failed:', err);
      const message = err.response?.data?.detail || err.message || 'Failed to format note.';
      setError(`Error: ${message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>NotaMed 🩺🎤</h2>
      <p>Speak your clinical note, then generate a SOAP note.</p>

      {error && (
        <div style={{ color: 'red', border: '1px solid red', padding: '0.5rem', margin: '0.5rem 0' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={startListening}
          disabled={isListening || !recognitionRef.current}
          style={{ background: isListening ? '#ccc' : '#4CAF50', color: 'white' }}
        >
          {isListening ? 'Listening...' : 'Start Recording'}
        </button>
        <button onClick={stopListening} disabled={!isListening}>
          Stop
        </button>
        <button onClick={clearTranscript} disabled={!transcript && !soapNote}>
          Clear
        </button>
        <button
          onClick={handleProcess}
          disabled={!transcript.trim() || isProcessing}
          style={{ background: '#2196F3', color: 'white' }}
        >
          {isProcessing ? 'Processing...' : 'Generate SOAP'}
        </button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h3>Transcript</h3>
        <div
          style={{
            border: '1px solid #ccc',
            minHeight: '100px',
            padding: '0.5rem',
            background: '#f9f9f9',
            whiteSpace: 'pre-wrap',
          }}
        >
          {transcript || 'Your speech will appear here...'}
        </div>
      </div>

      {soapNote && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>SOAP Note</h3>
          <div style={{ border: '1px solid #ccc', padding: '1rem', background: '#f0f8ff' }}>
            <p><strong>Subjective:</strong> {soapNote.subjective}</p>
            <p><strong>Objective:</strong> {soapNote.objective}</p>
            <p><strong>Assessment:</strong> {soapNote.assessment}</p>
            <p><strong>Plan:</strong> {soapNote.plan}</p>
          </div>
        </div>
      )}
    </div>
  );
};
