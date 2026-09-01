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
  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs">
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
            <option value="Tamil Nadu">Tamil Nadu</option>
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
            <option value="Chennai District">Chennai District</option>
            <option value="Tiruvallur">Tiruvallur</option>
            <option value="Chengalpattu">Chengalpattu</option>
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
