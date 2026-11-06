import { useState, useEffect } from 'react';
import { MapPin, X, Check, Globe } from 'lucide-react';
import { 
  INDIA_STATES, 
  getDistrictsForState, 
  formatLocationString, 
  parseLocationString 
} from '../../../data/indiaLocations';
import { 
  getRecentAdminLocations, 
  saveRecentAdminLocation 
} from '../../../services/superAdmin/superAdminProfileService';

export default function SuperAdminLocationModal({ 
  isOpen, 
  onClose, 
  currentLocation, 
  onSaveLocation 
}) {
  const [selectedState, setSelectedState] = useState('All India');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districtsList, setDistrictsList] = useState([]);
  const [recentScopes, setRecentScopes] = useState(() => getRecentAdminLocations());

  useEffect(() => {
    if (isOpen) {
      setRecentScopes(getRecentAdminLocations());
      const loc = currentLocation || 'All India';
      const clean = String(loc).trim();
      if (!clean || clean.toLowerCase() === 'all india' || clean.toLowerCase() === 'india') {
        setSelectedState('All India');
        setSelectedDistrict('');
        setDistrictsList([]);
      } else {
        const parsed = parseLocationString(clean);
        const state = parsed.state || 'Tamil Nadu';
        setSelectedState(state);
        const dists = getDistrictsForState(state);
        setDistrictsList(dists);
        setSelectedDistrict(parsed.district || '');
      }
    }
  }, [isOpen, currentLocation]);

  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    if (stateName === 'All India') {
      setDistrictsList([]);
      setSelectedDistrict('');
    } else {
      const dists = getDistrictsForState(stateName);
      setDistrictsList(dists);
      // Default to statewide (all districts)
      setSelectedDistrict('');
    }
  };

  const handleQuickSelect = (scope, autoSave = false) => {
    setSelectedState(scope.state);
    if (scope.state === 'All India') {
      setDistrictsList([]);
      setSelectedDistrict('');
      if (autoSave) {
        onSaveLocation('All India', 'All India', '');
        onClose();
        return;
      }
    } else {
      const dists = getDistrictsForState(scope.state);
      setDistrictsList(dists);
      setSelectedDistrict(scope.district || '');
      if (autoSave) {
        saveRecentAdminLocation(scope.state, scope.district || '');
        const formatted = scope.district 
          ? formatLocationString(scope.district, scope.state, true)
          : `${scope.state}, India`;
        onSaveLocation(formatted, scope.state, scope.district || '');
        onClose();
        return;
      }
    }
  };

  const isScopeActive = (scope) => {
    if (scope.state === 'All India') {
      return selectedState === 'All India' || (!selectedState && !selectedDistrict);
    }
    if (!scope.district) {
      return selectedState.toLowerCase() === scope.state.toLowerCase() && !selectedDistrict;
    }
    return (
      selectedState.toLowerCase() === scope.state.toLowerCase() &&
      selectedDistrict.toLowerCase() === scope.district.toLowerCase()
    );
  };

  const computeDisplayLocation = () => {
    if (selectedState === 'All India' || !selectedState) {
      return 'All India';
    }
    if (!selectedDistrict) {
      return `${selectedState}, India`;
    }
    return formatLocationString(selectedDistrict, selectedState, true);
  };

  const handleSave = () => {
    if (selectedState === 'All India' || !selectedState) {
      onSaveLocation('All India', 'All India', '');
    } else if (!selectedDistrict) {
      saveRecentAdminLocation(selectedState, '');
      const formatted = `${selectedState}, India`;
      onSaveLocation(formatted, selectedState, '');
    } else {
      saveRecentAdminLocation(selectedState, selectedDistrict);
      const formatted = formatLocationString(selectedDistrict, selectedState, true);
      onSaveLocation(formatted, selectedState, selectedDistrict);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-150 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Filter by Location</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Quick Hubs: All India + Last 5 chosen locations */}
          <div className="space-y-2">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Quick Selection
            </span>
            <div className="flex flex-wrap gap-1.5">
              {/* Permanent All India Scope */}
              <button
                type="button"
                onClick={() => handleQuickSelect({ label: 'All India', state: 'All India', district: '' })}
                onDoubleClick={() => handleQuickSelect({ label: 'All India', state: 'All India', district: '' }, true)}
                title="Click to select All India (Double-click to apply instantly)"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedState === 'All India' || (!selectedState && !selectedDistrict)
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs ring-2 ring-teal-600/20' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                All India
              </button>

              {/* Last 5 Chosen Locations by Super Admin */}
              {recentScopes.map((scope, idx) => {
                const active = isScopeActive(scope);
                return (
                  <button
                    key={`${scope.state}-${scope.district}-${idx}`}
                    type="button"
                    onClick={() => handleQuickSelect(scope)}
                    onDoubleClick={() => handleQuickSelect(scope, true)}
                    title={`Click to select ${scope.label} (Double-click to apply instantly)`}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      active 
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs ring-2 ring-teal-600/20' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {scope.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-4">
            {/* State / UT Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 block">
                State / Union Territory *
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="All India">All India (Nationwide)</option>
                <optgroup label="States & Union Territories">
                  {INDIA_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* District Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 block">
                District / Region
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={selectedState === 'All India'}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:bg-slate-100 disabled:text-slate-400"
              >
                {selectedState === 'All India' ? (
                  <option value="">All Regions / Nationwide</option>
                ) : (
                  <>
                    <option value="">All Districts ({selectedState} Statewide)</option>
                    {districtsList.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Current Selection Preview */}
          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between text-xs font-bold text-teal-900">
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-teal-600" />
              <span>Selected Location:</span>
            </span>
            <span className="font-black text-teal-700 max-w-[200px] truncate" title={computeDisplayLocation()}>
              {computeDisplayLocation()}
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Check className="h-4 w-4" />
            <span>Apply Filter</span>
          </button>
        </div>

      </div>
    </div>
  );
}
