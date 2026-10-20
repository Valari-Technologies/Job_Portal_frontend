import { useState, useEffect } from 'react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import RecruiterInterviewsHeader from '../../components/recruiter/interviews/RecruiterInterviewsHeader';
import RecruiterInterviewCalendar from '../../components/recruiter/interviews/RecruiterInterviewCalendar';
import RecruiterInterviewWeeklySummary from '../../components/recruiter/interviews/RecruiterInterviewWeeklySummary';
import RecruiterInterviewCard from '../../components/recruiter/interviews/RecruiterInterviewCard';
import RecruiterInterviewEmptyState from '../../components/recruiter/interviews/RecruiterInterviewEmptyState';
import RecruiterInterviewDetailsModal from '../../components/recruiter/interviews/RecruiterInterviewDetailsModal';
import { getRecruiterInterviewsData, updateInterviewStatusService, fetchRecruiterInterviewsFromApi } from '../../services/recruiter/recruiterInterviewsService';

export default function RecruiterInterviews() {
  const [data, setData] = useState(() => getRecruiterInterviewsData());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    fetchRecruiterInterviewsFromApi().then(freshData => {
      if (freshData) setData(freshData);
    });
  }, []);

  const summary = data?.summary || { completed: 0, upcoming: 0, rescheduled: 0 };
  const interviews = data?.interviews || [];

  const upcomingInterviews = interviews.filter(i => !i.isPast && i.status !== 'COMPLETED' && i.status !== 'CANCELLED');
  const pastInterviews = interviews.filter(i => i.isPast || i.status === 'COMPLETED');

  const handleUpdateStatus = async (id, status, result, notes) => {
    try {
      await updateInterviewStatusService(id, status, result, notes);
      setData(getRecruiterInterviewsData());
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
            {/* Upcoming Sessions Section */}
            {upcomingInterviews.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span>Upcoming Scheduled Interviews</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black">
                      {upcomingInterviews.length}
                    </span>
                  </h2>
                </div>
                <div className="space-y-3">
                  {upcomingInterviews.map((inv) => (
                    <RecruiterInterviewCard
                      key={inv.id}
                      interview={inv}
                      isPastSession={false}
                      onClickDetails={(i) => setSelectedInterview(i)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <RecruiterInterviewEmptyState />
            )}

            {/* Past Sessions Section */}
            {pastInterviews.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-150">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <span>Past Sessions</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold">
                      {pastInterviews.length} Completed
                    </span>
                  </h2>
                  <span className="text-xs font-semibold text-slate-400">
                    Awaiting evaluation or concluded
                  </span>
                </div>
                <div className="space-y-3">
                  {pastInterviews.map((inv) => (
                    <RecruiterInterviewCard
                      key={inv.id}
                      interview={inv}
                      isPastSession={true}
                      onClickDetails={(i) => setSelectedInterview(i)}
                    />
                  ))}
                </div>
              </div>
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
