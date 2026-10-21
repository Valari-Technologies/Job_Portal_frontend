import { useState, useEffect } from 'react';
import { MapPin, X, Check, Globe } from 'lucide-react';
import { 
  INDIA_STATES, 
  getDistrictsForState, 
  formatLocationString, 
  parseLocationString,
  POPULAR_LOCATIONS 
} from '../../../data/indiaLocations';

export default function SuperAdminLocationModal({ 
  isOpen, 
  onClose, 
  currentLocation, 
  onSaveLocation 
}) {
  const initial = parseLocationString(currentLocation || 'Delhi');
  const [selectedState, setSelectedState] = useState(initial.state || 'Delhi');
  const [selectedDistrict, setSelectedDistrict] = useState(initial.district || 'New Delhi');
  const [districtsList, setDistrictsList] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const parsed = parseLocationString(currentLocation || 'Delhi');
      setSelectedState(parsed.state || 'Delhi');
      const dists = getDistrictsForState(parsed.state || 'Delhi');
      setDistrictsList(dists);
      setSelectedDistrict(parsed.district || (dists.length > 0 ? dists[0] : ''));
    }
  }, [isOpen, currentLocation]);

  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    const dists = getDistrictsForState(stateName);
    setDistrictsList(dists);
    setSelectedDistrict(dists.length > 0 ? dists[0] : '');
  };

  const handleQuickSelect = (locStr) => {
    if (locStr === 'All India') {
      setSelectedState('All India');
      setSelectedDistrict('');
      onSaveLocation('All India', 'All India', '');
      onClose();
      return;
    }
    const parsed = parseLocationString(locStr);
    setSelectedState(parsed.state);
    const dists = getDistrictsForState(parsed.state);
    setDistrictsList(dists);
    setSelectedDistrict(parsed.district || '');
    onSaveLocation(locStr, parsed.state, parsed.district);
    onClose();
  };

  const handleSave = () => {
    const formatted = formatLocationString(selectedDistrict, selectedState, true);
    onSaveLocation(formatted, selectedState, selectedDistrict);
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
              <h2 className="text-sm font-black text-slate-900">Set Your Location</h2>
              <p className="text-[11px] font-semibold text-slate-500">Official Government Directory (LGD)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Quick Hubs */}
          <div className="space-y-2">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Quick Selection
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'All India',
                'Delhi, India',
                'Chennai, Tamil Nadu, India',
                'Bengaluru, Karnataka, India',
                'Mumbai, Maharashtra, India',
                'Hyderabad, Telangana, India'
              ].map((hub) => (
                <button
                  key={hub}
                  type="button"
                  onClick={() => handleQuickSelect(hub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    currentLocation === hub 
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {hub === 'All India' ? '🇮🇳 All India' : hub.split(',')[0]}
                </button>
              ))}
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
                {INDIA_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
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
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              >
                {districtsList.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Selection Preview */}
          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between text-xs font-bold text-teal-900">
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-teal-600" />
              <span>Selected Location:</span>
            </span>
            <span className="font-black text-teal-700">
              {formatLocationString(selectedDistrict, selectedState)}
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
            <span>Save Location</span>
          </button>
        </div>

      </div>
    </div>
  );
}
