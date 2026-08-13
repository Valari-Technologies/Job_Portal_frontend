import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/login/LoginPage';
import RegisterPage from './components/register/RegisterPage';
import TermsAndConditions from './components/legal/TermsAndConditions';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import CandidateDashboard from './pages/CandidateDashboard';
import HrDashboard from './pages/HrDashboard';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect empty root path to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Render separate pages using clean route mapping */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/dashboard" element={<CandidateDashboard />} />
        <Route path="/dashboard/*" element={<CandidateDashboard />} />
        <Route path="/hr-dashboard" element={<HrDashboard />} />
        <Route path="/hr-dashboard/*" element={<HrDashboard />} />
        <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />
        <Route path="/superadmin-dashboard/*" element={<SuperAdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

