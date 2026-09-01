import { useState } from 'react';
import EmployerVerificationQueue from '../../../components/superAdmin/superAdminEmployerVerification/EmployerVerificationQueue';
import EmployerVerificationReview from '../../../components/superAdmin/superAdminEmployerVerification/EmployerVerificationReview';

// TODO: Connect Django API:
// GET /api/admin/employer-verifications/
// Future data source: employers, employer_verifications, users and locations.
// Verification document schema and document rules are pending product finalization.

export default function SuperAdminEmployerVerification() {
  const [selectedRequest, setSelectedRequest] = useState(null);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title Header */}
      {!selectedRequest && (
        <div className="border-b border-slate-150 pb-5">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Employer verification</h1>
          <p className="text-base font-bold text-slate-500 mt-1.5">
            Review employer documents and verification requests.
          </p>
        </div>
      )}

      {/* Dynamic Display Panel */}
      {selectedRequest ? (
        <EmployerVerificationReview 
          request={selectedRequest}
          onBack={() => setSelectedRequest(null)}
        />
      ) : (
        <EmployerVerificationQueue 
          requests={[]} 
        />
      )}
    </div>
  );
}
