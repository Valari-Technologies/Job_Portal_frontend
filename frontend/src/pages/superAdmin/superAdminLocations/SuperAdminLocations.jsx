import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationHierarchy from '../../../components/superAdmin/superAdminLocations/LocationHierarchy';
import LocationDetailsPanel from '../../../components/superAdmin/superAdminLocations/LocationDetailsPanel';
import { fetchLocations } from '../../../services/superAdmin/locationService';

export default function SuperAdminLocations() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLocations();
      setLocations(data);
    } catch (err) {
      console.error('Failed to load locations:', err);
      setError('Failed to load locations from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (loc.location_type && loc.location_type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Location management</h1>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-60 min-w-[180px]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9.5 pr-4 text-xs font-bold text-slate-800 placeholder-slate-400 shadow-2xs focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={() => navigate('/super-admin/locations/create')}
            aria-label="Add location"
            className="w-full sm:w-auto justify-center flex items-center gap-2 rounded-xl bg-teal-600 px-4.5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add location</span>
          </button>
        </div>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left Side Hierarchy Table */}
        <div className="xl:col-span-2 space-y-6 min-w-0">
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-150 p-12 text-center text-slate-500 font-semibold">
              Loading location hierarchy...
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl border border-red-200 p-8 text-center text-red-600 font-semibold flex flex-col items-center gap-3">
              <span>{error}</span>
              <button
                onClick={loadLocations}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <LocationHierarchy 
              locations={locations}
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedLocation}
              searchTerm={searchTerm}
            />
          )}
        </div>

        {/* Right Side Details */}
        <div className="space-y-6">
          <LocationDetailsPanel 
            selectedLocation={selectedLocation}
            allLocations={locations}
          />
        </div>
      </div>
    </div>
  );
}
