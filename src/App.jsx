import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './data/store';
import Landing from './pages/Landing';
import Family from './pages/Family';
import PersonPage from './pages/PersonPage';
import Schedule from './pages/Schedule';
import Calendar from './pages/Calendar';
import PrayerRequests from './pages/PrayerRequests';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/family" element={<Family />} />
          <Route path="/family/:id" element={<PersonPage />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/prayer" element={<PrayerRequests />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
