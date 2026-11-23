import { useMemo } from 'react';
import { INDIA_STATES, getDistrictsForState } from '../../../data/indiaLocations';
import CustomDropdown from '../../shared/CustomDropdown';

export default function EmployerFilters({ 
  selectedState, 
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  verificationStatus, 
  setVerificationStatus, 
  trustLevel, 
  setTrustLevel, 
  jobStatus, 
  setJobStatus 
}) {
  const districtOptions = useMemo(() => {
    if (!selectedState || selectedState === 'All') {
      return [{ value: 'All', label: 'All Districts' }];
    }
    const dists = getDistrictsForState(selectedState);
    return [
      { value: 'All', label: 'All Districts' },
      ...dists.map((d) => ({ value: d, label: d }))
    ];
  }, [selectedState]);

  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-3.5 sm:p-4.5 shadow-2xs font-sans">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* State */}
        <div className="space-y-2">
          <label htmlFor="state-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            State
          </label>
          <CustomDropdown
            id="state-filter"
            value={selectedState}
            searchable={true}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict('All');
            }}
            options={[
              { value: 'All', label: 'All States' },
              ...INDIA_STATES.map((st) => ({ value: st, label: st }))
            ]}
          />
        </div>

        {/* District */}
        <div className="space-y-2">
          <label htmlFor="district-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            District
          </label>
          <CustomDropdown
            id="district-filter"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            options={districtOptions}
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
