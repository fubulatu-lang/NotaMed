import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../services/api/client';


declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SpeechRecorder = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [soapNote, setSoapNote] = useState<any>(null);
  const recognitionRef = useRef<any>(null);

  // Remove the API_URL constant and use apiClient instead
const handleProcess = async () => {
  if (!transcript.trim()) return;
  setIsProcessing(true);
  try {
    // Use apiClient instead of fetch
    const data = await apiClient.post('/formatting/note', {
      transcript,
      template: 'SOAP'
    });
    setSoapNote(data.formatted_note);
  } catch (err) {
    console.error('Formatting failed:', err);
    alert('Failed to format note. Please try again.');
  } finally {
    setIsProcessing(false);
  }
};
  

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support speech recognition. Please use Chrome.');
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (event: any) => {
      let final = '';
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript(final || interim);
    };

    rec.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
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
    if (!transcript.trim()) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/formatting/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, template: 'SOAP' }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Formatting failed');
      }
      const data = await res.json();
      setSoapNote(data.formatted_note);
    } catch (err) {
      console.error('Formatting failed:', err);
      alert('Failed to format note. Please try again.');
    } finally {
      setIsProcessing(false);
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
          <button onClick={() => navigator.clipboard.writeText(JSON.stringify(soapNote, null, 2))}>
            Copy SOAP
          </button>
        </div>
      )}
    </div>
  );
};

export default SpeechRecorder;
