import { useState, useEffect } from 'react';
import { fetchLocations } from '../../../services/superAdmin/locationService';
import CustomDropdown from '../../shared/CustomDropdown';

export default function EmployerFilters({ 
  selectedState, 
  setSelectedState, 
  verificationStatus, 
  setVerificationStatus, 
  trustLevel, 
  setTrustLevel, 
  jobStatus, 
  setJobStatus 
}) {
  const [states, setStates] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadStates() {
      const data = await fetchLocations({ location_type: 'STATE' });
      if (active) setStates(data);
    }
    loadStates();
    return () => { active = false; };
  }, []);

  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs font-sans">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* State */}
        <div className="space-y-2">
          <label htmlFor="state-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            State
          </label>
          <CustomDropdown
            id="state-filter"
            value={selectedState}
            searchable={true}
            onChange={(e) => setSelectedState(e.target.value)}
            options={[
              { value: 'All', label: 'All States' },
              ...states.map((st) => ({ value: st.name, label: st.name }))
            ]}
          />
        </div>

        {/* Verification Status */}
        <div className="space-y-2">
          <label htmlFor="verification-status-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Verification status
          </label>
          <CustomDropdown
            id="verification-status-filter"
            value={verificationStatus}
            onChange={(e) => setVerificationStatus(e.target.value)}
            options={[
              { value: 'All', label: 'All' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'REJECTED', label: 'Rejected' },
              { value: 'SUSPENDED', label: 'Suspended' }
            ]}
          />
        </div>

        {/* Trust Level */}
        <div className="space-y-2">
          <label htmlFor="trust-level-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Trust level
          </label>
          <CustomDropdown
            id="trust-level-filter"
            value={trustLevel}
            onChange={(e) => setTrustLevel(e.target.value)}
            options={[
              { value: 'All', label: 'All' },
              { value: 'New', label: 'New' },
              { value: 'Building trust', label: 'Building trust' },
              { value: 'Trusted employer', label: 'Trusted employer' }
            ]}
          />
        </div>

        {/* Job Status */}
        <div className="space-y-2">
          <label htmlFor="job-status-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Job status
          </label>
          <CustomDropdown
            id="job-status-filter"
            value={jobStatus}
            onChange={(e) => setJobStatus(e.target.value)}
            options={[
              { value: 'All', label: 'All' },
              { value: 'ACTIVE', label: 'Active jobs' },
              { value: 'PENDING_REVIEW', label: 'Pending review' },
              { value: 'CLOSED', label: 'Closed jobs' }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
