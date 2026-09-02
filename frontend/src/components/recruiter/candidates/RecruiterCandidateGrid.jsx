import RecruiterCandidateCard from './RecruiterCandidateCard';
import RecruiterCandidatesEmptyState from './RecruiterCandidatesEmptyState';
import RecruiterCandidatesPagination from './RecruiterCandidatesPagination';

export default function RecruiterCandidateGrid({ candidates, pagination, onPageChange }) {
  if (!candidates || candidates.length === 0) {
    return <RecruiterCandidatesEmptyState />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {candidates.map((item, idx) => (
          <RecruiterCandidateCard 
            key={item.application_id || item.candidate?.id || idx} 
            candidateItem={item} 
          />
        ))}
      </div>
      <RecruiterCandidatesPagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
}
