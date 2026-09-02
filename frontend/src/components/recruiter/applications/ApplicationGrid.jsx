import ApplicationCard from './ApplicationCard';
import ApplicationsEmptyState from './ApplicationsEmptyState';
import ApplicationsPagination from './ApplicationsPagination';

export default function ApplicationGrid({ applications, pagination, onPageChange, onViewDetails, onUpdateStatus }) {
  if (!applications || applications.length === 0) {
    return <ApplicationsEmptyState />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {applications.map((app, idx) => (
          <ApplicationCard 
            key={app.id || idx} 
            application={app} 
            onViewDetails={onViewDetails}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>
      <ApplicationsPagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
}
