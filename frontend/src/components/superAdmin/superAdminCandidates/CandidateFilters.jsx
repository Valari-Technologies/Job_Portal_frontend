import { useMemo } from 'react';
import { INDIA_STATES, getDistrictsForState } from '../../../data/indiaLocations';
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
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              ...INDIA_STATES.map((st) => ({ value: st, label: st }))
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
            options={districtOptions}
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
              { value: 'ACTIVE', label: 'Active' },
              { value: 'SUSPENDED', label: 'Suspended' },
              { value: 'INACTIVE', label: 'Inactive' }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
