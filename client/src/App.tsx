import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './features/dashboard/DashboardPage';
import RecordingPage from './features/recording/RecordingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="record" element={<RecordingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;