import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SuperAdminNavbar from '../../components/superadmin/SuperAdminNavbar';
import SuperAdminSidebar from '../../components/superadmin/SuperAdminSidebar';
import DashboardStats from '../../components/superadmin/DashboardStats';
import DashboardCharts from '../../components/superadmin/DashboardCharts';
import DashboardTable from '../../components/superadmin/DashboardTable';
import DashboardActions from '../../components/superadmin/DashboardActions';
import superAdminBg from '../../assets/super-admin/super-admin-bg.png';
import OrganizationPage from './OrganizationPage';
import OrganizationDetailsPage from './OrganizationDetailsPage';
import HRManagementPage from './HRManagementPage';
import JobsPage from './JobsPage';
import CandidatesPage from './CandidatesPage';
import CandidateDetailsPage from './CandidateDetailsPage';
import ApplicationsPage from './ApplicationsPage';
import ActivityLogsPage from './ActivityLogsPage';
import ReportsPage from './ReportsPage';
import SuperAdminProfilePage from './SuperAdminProfilePage';
import SettingsPage from './SettingsPage';

// Reusable coming soon placeholder page for future module tabs
function ComingSoonPlaceholder({ title }) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[32px] border border-slate-100 p-8 shadow-xs min-h-[300px] flex flex-col items-center justify-center text-center">
      <h2 className="text-3xl font-black text-slate-800 tracking-tight">{title} Module</h2>
      <p className="text-sm font-bold text-slate-400 mt-2">Implementation of the {title} module will follow in the next stage.</p>
    </div>
  );
}

// Inner view containing dashboard metrics, charts, and activities
function DashboardHomeView() {
  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Overview</h1>
      </div>
      
      {/* 5 Stats Cards row */}
      <DashboardStats />

      {/* 3 Charts row */}
      <DashboardCharts />

      {/* Activity Table & Quick Actions row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-stretch">
        <div className="lg:col-span-2">
          <DashboardTable />
        </div>
        <div>
          <DashboardActions />
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminDashboard() {
  return (
    <div className="relative min-h-screen w-full bg-[#FAFAF7] font-sans flex overflow-hidden">
      
      {/* Full-screen Background Illustration */}
      <img
        src={superAdminBg}
        alt="Super Admin Background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 select-none pointer-events-none opacity-90"
      />

      {/* Main Page Layout Wrapper */}
      <div className="relative z-10 w-full min-h-screen flex p-2 sm:p-4 md:p-6 lg:p-8 gap-4 lg:gap-6 overflow-x-hidden pb-20 md:pb-6">
        
        {/* Super Admin Left Sidebar */}
        <SuperAdminSidebar />

        {/* Main Workspace Content container */}
        <div className="flex-grow flex flex-col gap-6 overflow-x-hidden">
          
          {/* Super Admin Top Navbar */}
          <SuperAdminNavbar />

          {/* Sub-routing workspace rendering */}
          <div className="flex-grow flex flex-col justify-between overflow-x-hidden">
            <Routes>
              <Route path="/" element={<DashboardHomeView />} />
              <Route path="/organizations" element={<OrganizationPage />} />
              <Route path="/organizations/:id" element={<OrganizationDetailsPage />} />
              <Route path="/hr-management" element={<HRManagementPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/candidates" element={<CandidatesPage />} />
              <Route path="/candidates/:id" element={<CandidateDetailsPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/activity-logs" element={<ActivityLogsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/profile" element={<SuperAdminProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/*" element={<DashboardHomeView />} />
            </Routes>
          </div>

          {/* Spacer footer */}
          <div className="h-4 w-full"></div>
        </div>

      </div>

    </div>
  );
}
