import { useState } from 'react';
import EmployerLayout from '../../../components/employer/common/EmployerLayout';
import ScheduleWarning from '../../../components/employer/employerInterviews/ScheduleWarning';
import InterviewsFilters from '../../../components/employer/employerInterviews/InterviewsFilters';
import InterviewsList from '../../../components/employer/employerInterviews/InterviewsList';

// Future Django API:
// GET /api/employer/interviews/
// Data will replace the empty state after authenticated Employer data is available.

export default function EmployerInterviews() {
  const [interviewsList] = useState([]); // Initial empty state
  const [activeSubTab, setActiveSubTab] = useState('week'); // 'today', 'week', 'upcoming'
  const [scheduleWarning, setScheduleWarning] = useState(false);

  const handleScheduleClick = () => {
    setScheduleWarning(true);
  };

  return (
    <EmployerLayout activeTab="interviews" breadcrumbTitle="Interviews">
      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
        
        {/* Page Heading & Main Schedule Action Button */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Interviews</h1>
            <p className="text-sm md:text-base font-bold text-slate-500 mt-1">Schedule and manage candidate interviews.</p>
          </div>
          <button 
            onClick={handleScheduleClick}
            className="w-full md:w-auto rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-3 text-sm transition-colors shadow-xs"
          >
            + Schedule interview
          </button>
        </div>

        {/* Warning notification modal overlay when there are no shortlisted candidates */}
        <ScheduleWarning 
          scheduleWarning={scheduleWarning}
          setScheduleWarning={setScheduleWarning}
        />

        {/* Filters and Sub-Tabs section */}
        <InterviewsFilters 
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
        />

        {/* Scheduled interviews table slot list */}
        <InterviewsList interviewsList={interviewsList} />

      </main>
    </EmployerLayout>
  );
}
