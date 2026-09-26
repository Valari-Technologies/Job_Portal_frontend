import { useState, useEffect } from 'react';
import { fetchLocations } from '../../../services/superAdmin/locationService';

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
          <select
            id="state-filter"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base font-bold text-slate-700 shadow-2xs hover:bg-slate-50 focus:border-teal-500 focus:outline-none transition-colors"
          >
            <option value="All">All States</option>
            {states.map((st) => (
              <option key={st.id || st.name} value={st.name}>
                {st.name}
              </option>
            ))}
          </select>
        </div>

        {/* Verification Status */}
        <div className="space-y-2">
          <label htmlFor="verification-status-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Verification status
          </label>
          <select
            id="verification-status-filter"
            value={verificationStatus}
            onChange={(e) => setVerificationStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base font-bold text-slate-700 shadow-2xs hover:bg-slate-50 focus:border-teal-500 focus:outline-none transition-colors"
          >
            <option value="All">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        {/* Trust Level */}
        <div className="space-y-2">
          <label htmlFor="trust-level-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Trust level
          </label>
          <select
            id="trust-level-filter"
            value={trustLevel}
            onChange={(e) => setTrustLevel(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base font-bold text-slate-700 shadow-2xs hover:bg-slate-50 focus:border-teal-500 focus:outline-none transition-colors"
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Building trust">Building trust</option>
            <option value="Trusted employer">Trusted employer</option>
          </select>
        </div>

        {/* Job Status */}
        <div className="space-y-2">
          <label htmlFor="job-status-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Job status
          </label>
          <select
            id="job-status-filter"
            value={jobStatus}
            onChange={(e) => setJobStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base font-bold text-slate-700 shadow-2xs hover:bg-slate-50 focus:border-teal-500 focus:outline-none transition-colors"
          >
            <option value="All">All</option>
            <option value="ACTIVE">Active jobs</option>
            <option value="PENDING_REVIEW">Pending review</option>
            <option value="CLOSED">Closed jobs</option>
          </select>
        </div>
      </div>
    </div>
  );
}
