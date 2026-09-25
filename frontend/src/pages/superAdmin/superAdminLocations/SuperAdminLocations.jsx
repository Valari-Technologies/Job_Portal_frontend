import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationHierarchy from '../../../components/superAdmin/superAdminLocations/LocationHierarchy';
import LocationDetailsPanel from '../../../components/superAdmin/superAdminLocations/LocationDetailsPanel';
import LocationInsights from '../../../components/superAdmin/superAdminLocations/LocationInsights';
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
    <div className="space-y-8 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-slate-150 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-805 tracking-tight">Location management</h1>
          <p className="text-base font-bold text-slate-500 mt-1.5">
            Manage location hierarchy, data quality, and coverage across the platform.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4.5 w-4.5 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            onClick={() => navigate('/super-admin/locations/create')}
            aria-label="Add location"
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4.5 py-2.5 text-sm font-extrabold text-white hover:bg-teal-700 shadow-md shadow-teal-600/10 transition-colors cursor-pointer"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add location</span>
          </button>
        </div>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side Hierarchy Table */}
        <div className="lg:col-span-2 space-y-6">
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
              locations={filteredLocations}
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedLocation}
            />
          )}
          <div className="text-sm font-bold text-slate-500">
            Showing {filteredLocations.length} of {locations.length} locations
          </div>
        </div>

        {/* Right Side Details */}
        <div className="space-y-6">
          <LocationDetailsPanel 
            selectedLocation={selectedLocation}
          />
        </div>
      </div>

      {/* Bottom Insights row */}
      <LocationInsights />
    </div>
  );
}
