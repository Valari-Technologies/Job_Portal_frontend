import { useState } from 'react';
import JobReviewQueue from '../../../components/admin/adminJobReview/JobReviewQueue';
import JobReviewDetails from '../../../components/admin/adminJobReview/JobReviewDetails';

// TODO: Connect Django API:
// GET /api/admin/jobs?status=PENDING_REVIEW
// Data source: jobs, employers, job_categories, job_locations,
// job_skills, job_reviews and job_reports.

export default function AdminJobReview() {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header title */}
      {!selectedJob && (
        <div className="border-b border-slate-155 pb-5">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Job review</h1>
          <p className="text-base font-bold text-slate-500 mt-1.5">
            Review job submissions before publication.
          </p>
        </div>
      )}

      {/* Dynamic Display Panel details */}
      {selectedJob ? (
        <JobReviewDetails 
          job={selectedJob} 
          onBack={() => setSelectedJob(null)}
        />
      ) : (
        <JobReviewQueue 
          jobs={[]} 
        />
      )}
    </div>
  );
}
