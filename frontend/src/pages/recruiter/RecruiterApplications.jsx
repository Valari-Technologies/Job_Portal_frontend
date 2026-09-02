import { useState } from 'react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import RecruiterApplicationsHeader from '../../components/recruiter/applications/RecruiterApplicationsHeader';
import ApplicationMetrics from '../../components/recruiter/applications/ApplicationMetrics';
import ApplicationFilters from '../../components/recruiter/applications/ApplicationFilters';
import ApplicationGrid from '../../components/recruiter/applications/ApplicationGrid';
import ApplicationDetailsDrawer from '../../components/recruiter/applications/ApplicationDetailsDrawer';
import { getRecruiterApplicationsData, updateApplicationStatusService } from '../../services/recruiter/recruiterApplicationsService';

export default function RecruiterApplications() {
  const [data, setData] = useState(() => getRecruiterApplicationsData());
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedJobId, setSelectedJobId] = useState('ALL');
  const [selectedApplication, setSelectedApplication] = useState(null);

  const metrics = data?.metrics || { total_active: 0, conversion_rate: null, average_time_to_hire_days: null };
  const statuses = data?.filters?.statuses || [];
  const jobs = data?.filters?.jobs || [];
  const applications = data?.applications || [];
  const pagination = data?.pagination || { current_page: 1, total_pages: 1, total_items: 0, page_size: 12 };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await updateApplicationStatusService(appId, newStatus);
      setData(prev => ({
        ...prev,
        applications: prev.applications.map(app => 
          app.id === appId ? { ...app, status: newStatus } : app
        )
      }));
      if (selectedApplication && selectedApplication.id === appId) {
        setSelectedApplication(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handlePageChange = (page) => {
    setData(prev => ({
      ...prev,
      pagination: { ...prev.pagination, current_page: page }
    }));
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <RecruiterLayout activeTab="applications">
      <main className="p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* 1. Header */}
        <RecruiterApplicationsHeader selectedJobTitle={selectedJob?.title} />

        {/* 2. Metrics Row */}
        <ApplicationMetrics metrics={metrics} />

        {/* 3. Filters & Controls */}
        <ApplicationFilters 
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedJobId={selectedJobId}
          setSelectedJobId={setSelectedJobId}
          statuses={statuses}
          jobs={jobs}
        />

        {/* 4. Applications Grid / Empty State */}
        <ApplicationGrid 
          applications={applications}
          pagination={pagination}
          onPageChange={handlePageChange}
          onViewDetails={(app) => setSelectedApplication(app)}
          onUpdateStatus={handleUpdateStatus}
        />

        {/* 5. Details Drawer */}
        {selectedApplication && (
          <ApplicationDetailsDrawer 
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </main>
    </RecruiterLayout>
  );
}
