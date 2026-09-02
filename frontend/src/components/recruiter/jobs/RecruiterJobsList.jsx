import RecruiterJobCard from './RecruiterJobCard';
import RecruiterJobsEmptyState from './RecruiterJobsEmptyState';
import RecruiterJobsPagination from './RecruiterJobsPagination';

export default function RecruiterJobsList({ jobs, pagination, onPageChange }) {
  if (!jobs || jobs.length === 0) {
    return <RecruiterJobsEmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {jobs.map((job, idx) => (
          <RecruiterJobCard key={job.id || idx} job={job} />
        ))}
      </div>
      <RecruiterJobsPagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
}
