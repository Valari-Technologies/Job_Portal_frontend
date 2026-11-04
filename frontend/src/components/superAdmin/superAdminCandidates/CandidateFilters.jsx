import { useState, useEffect } from 'react';
import { fetchLocations } from '../../../services/superAdmin/locationService';
import CustomDropdown from '../../shared/CustomDropdown';

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
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadStates() {
      const data = await fetchLocations({ location_type: 'STATE' });
      if (active) setStates(data);
    }
    loadStates();
    return () => { active = false; };
  }, []);

  // Districts are restricted to the selected state
  useEffect(() => {
    const state = states.find((st) => st.name === selectedState);
    if (!state) {
      return undefined;
    }
    let active = true;
    fetchLocations({ parent_id: state.id }).then((data) => {
      if (active) setDistricts(data.map((d) => ({ ...d, parentName: state.name })));
    });
    return () => { active = false; };
  }, [selectedState, states]);

  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs font-sans">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* State Filter */}
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
              ...states.map((st) => ({ value: st.name, label: st.name }))
            ]}
          />
        </div>

        {/* District Filter */}
        <div className="space-y-2">
          <label htmlFor="district-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            District
          </label>
          <CustomDropdown
            id="district-filter"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            options={[
              { value: 'All', label: 'All Districts' },
              ...districts.filter((d) => d.parentName === selectedState).map((d) => ({ value: d.name, label: d.name }))
            ]}
          />
        </div>

        {/* Profile Status Filter */}
        <div className="space-y-2">
          <label htmlFor="profile-status-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Profile status
          </label>
          <CustomDropdown
            id="profile-status-filter"
            value={profileStatus}
            onChange={(e) => setProfileStatus(e.target.value)}
            options={[
              { value: 'All', label: 'All' },
              { value: 'Complete', label: 'Complete' },
              { value: 'Incomplete', label: 'Incomplete' },
              { value: 'Needs review', label: 'Needs review' }
            ]}
          />
        </div>

        {/* Account Status Filter */}
        <div className="space-y-2">
          <label htmlFor="account-status-filter" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Account status
          </label>
          <CustomDropdown
            id="account-status-filter"
            value={accountStatus}
            onChange={(e) => setAccountStatus(e.target.value)}
            options={[
              { value: 'All', label: 'All' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'Suspended', label: 'Suspended' }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
