// client/src/App.tsx

import React from 'react';
import { RecordingPage } from './features/recording/RecordingPage'; // <-- named import

function App() {
  return (
    <div className="App">
      <RecordingPage />
    </div>
  );
}

export default App;