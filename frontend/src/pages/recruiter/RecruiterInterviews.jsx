import { useState } from 'react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import RecruiterInterviewsHeader from '../../components/recruiter/interviews/RecruiterInterviewsHeader';
import RecruiterInterviewCalendar from '../../components/recruiter/interviews/RecruiterInterviewCalendar';
import RecruiterInterviewWeeklySummary from '../../components/recruiter/interviews/RecruiterInterviewWeeklySummary';
import RecruiterInterviewCard from '../../components/recruiter/interviews/RecruiterInterviewCard';
import RecruiterInterviewEmptyState from '../../components/recruiter/interviews/RecruiterInterviewEmptyState';
import RecruiterInterviewDetailsModal from '../../components/recruiter/interviews/RecruiterInterviewDetailsModal';
import { getRecruiterInterviewsData, updateInterviewStatusService } from '../../services/recruiter/recruiterInterviewsService';

export default function RecruiterInterviews() {
  const [data, setData] = useState(() => getRecruiterInterviewsData());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedInterview, setSelectedInterview] = useState(null);

  const summary = data?.summary || { completed: 0, upcoming: 0, rescheduled: 0 };
  const interviews = data?.interviews || [];

  const handleUpdateStatus = async (id, status, result, notes) => {
    try {
      await updateInterviewStatusService(id, status, result, notes);
      setData(prev => ({
        ...prev,
        interviews: prev.interviews.map(inv => inv.id === id ? { ...inv, status, result, notes } : inv)
      }));
      setSelectedInterview(null);
    } catch (err) {
      console.error("Failed to update interview", err);
    }
  };

  return (
    <RecruiterLayout activeTab="interviews">
      <main className="p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* 1. Header */}
        <RecruiterInterviewsHeader onToggleFilters={() => {}} />

        {/* 2. Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Main Column: Date-Grouped Interviews or Empty State */}
          <div className="lg:col-span-2 space-y-6">
            {interviews.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Upcoming Scheduled Interviews</h2>
                {interviews.map((inv) => (
                  <RecruiterInterviewCard
                    key={inv.id}
                    interview={inv}
                    onClickDetails={(i) => setSelectedInterview(i)}
                  />
                ))}
              </div>
            ) : (
              <RecruiterInterviewEmptyState />
            )}
          </div>

          {/* Right Column: Calendar & Weekly Summary */}
          <div className="space-y-6">
            <RecruiterInterviewCalendar
              selectedDate={selectedDate}
              onSelectDate={(d) => setSelectedDate(d)}
            />
            <RecruiterInterviewWeeklySummary summary={summary} />
          </div>

        </div>

        {/* 3. Interview Details Modal */}
        {selectedInterview && (
          <RecruiterInterviewDetailsModal
            interview={selectedInterview}
            onClose={() => setSelectedInterview(null)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </main>
    </RecruiterLayout>
  );
}
