export default function LocationHierarchy({ 
  locations = [], 
  selectedLocation, 
  onSelectLocation 
}) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-black text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Active jobs</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {locations.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-extrabold text-slate-800">No locations configured yet</h3>
                      <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
                        Set up the State, District, City/Town and Locality hierarchy before candidate registration and job posting begin.
                      </p>
                      <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto">
                        Location is required for job discovery, candidate preferences and local hiring.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              locations.map((loc) => (
                <tr 
                  key={loc.id} 
                  onClick={() => onSelectLocation && onSelectLocation(loc)}
                  className={`cursor-pointer hover:bg-slate-50/50 ${selectedLocation?.id === loc.id ? 'bg-teal-50/20' : ''}`}
                >
                  <td className="px-6 py-4 font-bold text-slate-850">{loc.name}</td>
                  <td className="px-6 py-4 text-sm font-extrabold text-slate-800">0</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full px-2 py-0.5 text-xs font-bold border border-slate-200 bg-slate-50 text-slate-600">
                      {loc.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
