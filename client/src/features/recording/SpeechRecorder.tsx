import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { formatNote, saveNote } from '../../api/notes';

const SpeechRecorder = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [soapNote, setSoapNote] = useState<any>(null);
  const { user } = useAuth();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please use Chrome.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
      const final = Array.from(event.results)
        .filter(result => result.isFinal)
        .map(result => result[0].transcript)
        .join('');
      const interim = Array.from(event.results)
        .filter(result => !result.isFinal)
        .map(result => result[0].transcript)
        .join('');
      setTranscript(final || interim);
    };

    rec.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
      // Auto‑process when speech ends (optional)
    };

    recognitionRef.current = rec;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleProcess = async () => {
    if (!transcript.trim() || !user) return;
    setIsProcessing(true);
    try {
      const result = await formatNote(transcript, 'SOAP');
      setSoapNote(result.formatted_note);
      // Optionally auto‑save
      // await saveNote({ transcript, soap_note: result.formatted_note, template: 'SOAP' });
    } catch (err) {
      console.error('Formatting failed:', err);
      alert('Failed to format note. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!soapNote || !transcript) return;
    try {
      await saveNote({ transcript, soap_note: soapNote, template: 'SOAP' });
      alert('Note saved!');
    } catch (err) {
      alert('Failed to save note.');
    }
  };

  return (
    <div className="recording-container">
      <h3>Dictate your clinical note</h3>
      <div className="transcript-box">
        {transcript || 'Tap the mic and start speaking...'}
      </div>
      <div className="controls">
        {!isListening ? (
          <button onClick={startListening} className="mic-button">
            🎤 Start
          </button>
        ) : (
          <button onClick={stopListening} className="stop-button">
            ⏹ Stop
          </button>
        )}
        {transcript && !isListening && (
          <button onClick={handleProcess} disabled={isProcessing}>
            {isProcessing ? 'Generating...' : 'Generate SOAP'}
          </button>
        )}
      </div>
      {soapNote && (
        <div className="soap-result">
          <h4>SOAP Note</h4>
          <div className="soap-content">
            <p><strong>Subjective:</strong> {soapNote.subjective}</p>
            <p><strong>Objective:</strong> {soapNote.objective}</p>
            <p><strong>Assessment:</strong> {soapNote.assessment}</p>
            <p><strong>Plan:</strong> {soapNote.plan}</p>
          </div>
          <button onClick={handleSave}>Save Note</button>
        </div>
      )}
    </div>
  );
};

export default SpeechRecorder;
