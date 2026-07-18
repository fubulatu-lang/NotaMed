import { useState, useEffect, useRef } from 'react';

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
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://notamed-api.up.railway.app/api/v1';

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
      setError(`Speech error: ${event.error}`);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setError(null);
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
    // Validate transcript
    const trimmed = transcript.trim();
    if (!trimmed) {
      setError('Please speak something before processing.');
      alert('Please speak something first.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    const payload = { transcript: trimmed, template: 'SOAP' };
    console.log('📤 Sending to backend:', payload);

    try {
      const res = await fetch(`${API_URL}/formatting/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Handle non-200 responses
      if (!res.ok) {
        let errorMsg = `Server error: ${res.status}`;
        try {
          const errData = await res.json();
          if (errData.detail) {
            errorMsg = Array.isArray(errData.detail) 
              ? errData.detail.map((d: any) => d.msg).join(', ')
              : errData.detail;
          }
        } catch (e) {
          // If response isn't JSON, use status text
          errorMsg = `Server error: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      console.log('📥 Received from backend:', data);
      setSoapNote(data.formatted_note);
    } catch (err) {
      console.error('Formatting failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      alert(`Failed to format note: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (soapNote) {
      navigator.clipboard.writeText(JSON.stringify(soapNote, null, 2));
    }
  };

  return (
    <div className="recording-container">
      <h3>Dictate your clinical note</h3>
      
      {error && (
        <div className="error-message" style={{ color: 'red', padding: '10px', background: '#ffeeee', borderRadius: '4px' }}>
          ⚠️ {error}
        </div>
      )}
      
      <div className="transcript-box" style={{ minHeight: '80px', border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
        {transcript || 'Tap the mic and start speaking...'}
      </div>
      
      <div className="controls">
        {!isListening ? (
          <button onClick={startListening} className="mic-button" style={{ padding: '10px 20px', fontSize: '16px' }}>
            🎤 Start
          </button>
        ) : (
          <button onClick={stopListening} className="stop-button" style={{ padding: '10px 20px', fontSize: '16px', background: 'red', color: 'white' }}>
            ⏹ Stop
          </button>
        )}
        
        {transcript && !isListening && (
          <button 
            onClick={handleProcess} 
            disabled={isProcessing}
            style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}
          >
            {isProcessing ? '⏳ Generating...' : '📝 Generate SOAP'}
          </button>
        )}
      </div>
      
      {soapNote && (
        <div className="soap-result" style={{ marginTop: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '4px' }}>
          <h4>SOAP Note</h4>
          <div className="soap-content">
            <p><strong>Subjective:</strong> {soapNote.subjective || 'N/A'}</p>
            <p><strong>Objective:</strong> {soapNote.objective || 'N/A'}</p>
            <p><strong>Assessment:</strong> {soapNote.assessment || 'N/A'}</p>
            <p><strong>Plan:</strong> {soapNote.plan || 'N/A'}</p>
          </div>
          <button onClick={copyToClipboard} style={{ marginTop: '10px', padding: '8px 16px' }}>
            📋 Copy SOAP
          </button>
        </div>
      )}
    </div>
  );
};

export default SpeechRecorder;
