import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EmailGame from './components/email-game/EmailGame';
import BECSecurityGame from './components/bec-security/BECSecurityGame';
import InsiderThreatGame from './components/insider-threat/InsiderThreatGame';
import DataSecurityGame from './components/data-security/DataSecurityGame';
import CoverPage from './components/CoverPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/intro" element={<CoverPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/game/email" element={<EmailGame />} />
        <Route path="/game/bec-security" element={<BECSecurityGame />} />
        <Route path="/game/insider-threat" element={<InsiderThreatGame />} />
        <Route path="/game/data-security" element={<DataSecurityGame />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;