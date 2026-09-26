import { useState, useEffect } from 'react';
import { fetchLocations } from '../../../services/superAdmin/locationService';

export default function CandidateFilters({ 
  selectedState, 
  setSelectedState, 
  selectedDistrict, 
  setSelectedDistrict, 
  profileStatus, 
  setProfileStatus, 
  accountStatus, 
  setAccountStatus 
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
        {/* State Filter */}
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

        {/* District Filter */}
        <div className="space-y-2">
          <label htmlFor="district-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            District
          </label>
          <select
            id="district-filter"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base font-bold text-slate-700 shadow-2xs hover:bg-slate-50 focus:border-teal-500 focus:outline-none transition-colors"
          >
            <option value="All">All Districts</option>
          </select>
        </div>

        {/* Profile Status Filter */}
        <div className="space-y-2">
          <label htmlFor="profile-status-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Profile status
          </label>
          <select
            id="profile-status-filter"
            value={profileStatus}
            onChange={(e) => setProfileStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base font-bold text-slate-700 shadow-2xs hover:bg-slate-50 focus:border-teal-500 focus:outline-none transition-colors"
          >
            <option value="All">All</option>
            <option value="Complete">Complete</option>
            <option value="Incomplete">Incomplete</option>
            <option value="Needs review">Needs review</option>
          </select>
        </div>

        {/* Account Status Filter */}
        <div className="space-y-2">
          <label htmlFor="account-status-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Account status
          </label>
          <select
            id="account-status-filter"
            value={accountStatus}
            onChange={(e) => setAccountStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base font-bold text-slate-700 shadow-2xs hover:bg-slate-50 focus:border-teal-500 focus:outline-none transition-colors"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>
    </div>
  );
}
