// client/src/features/recording/RecordingPage.tsx

import React from 'react';
import { SpeechRecorder } from './SpeechRecorder';

export const RecordingPage: React.FC = () => {
  return (
    <div>
      <h1>NotaMed Recording</h1>
      <SpeechRecorder />
    </div>
  );
};