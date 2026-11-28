import { useState, useEffect, useMemo } from 'react';
import CustomDropdown from '../../shared/CustomDropdown';
import { authenticatedFetch } from '../../../services/auth/adminAuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

async function fetchCatalogLocations(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.location_type) query.append('location_type', params.location_type);
    if (params.parent_id !== undefined && params.parent_id !== null) {
      query.append('parent_id', params.parent_id);
    }
    const response = await authenticatedFetch(`${API_BASE_URL}/accounts/locations/?${query.toString()}`);
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : (data.results || []);
  } catch {
    return [];
  }
}

function mergeOptions(catalogList, customList, currentValue) {
  const seen = new Set();
  const merged = [];
  const addItem = (name) => {
    const trimmed = String(name || '').trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    merged.push({ value: trimmed, label: trimmed });
  };
  catalogList.forEach((item) => addItem(item.name));
  customList.forEach((name) => addItem(name));
  if (currentValue) addItem(currentValue);
  return merged.sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * 4-level cascading searchable location selector for Candidates (State -> District -> City/Town -> Locality).
 * Reads existing catalog locations from Super Admin, while any new value typed & added via Enter
 * stays local to the candidate's own profile without writing to Super Admin's Location catalog.
 */
export default function CandidateLocationSelector({
  state = '',
  district = '',
  city = '',
  locality = '',
  onChange,
}) {
  const [catalogStates, setCatalogStates] = useState([]);
  const [catalogDistricts, setCatalogDistricts] = useState([]);
  const [catalogCities, setCatalogCities] = useState([]);
  const [catalogLocalities, setCatalogLocalities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);

  const [customStates, setCustomStates] = useState([]);
  const [customDistricts, setCustomDistricts] = useState([]);
  const [customCities, setCustomCities] = useState([]);
  const [customLocalities, setCustomLocalities] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadStates() {
      setLoadingStates(true);
      const data = await fetchCatalogLocations({ location_type: 'STATE' });
      if (active) {
        setCatalogStates(data);
        setLoadingStates(false);
      }
    }
    loadStates();
    return () => { active = false; };
  }, []);

  const selectedStateObj = useMemo(
    () => catalogStates.find((s) => String(s.name || '').toLowerCase() === String(state || '').trim().toLowerCase()),
    [catalogStates, state]
  );

  useEffect(() => {
    let active = true;
    if (!selectedStateObj?.id) {
      setCatalogDistricts([]);
      setCatalogCities([]);
      setCatalogLocalities([]);
      return;
    }
    fetchCatalogLocations({ location_type: 'DISTRICT', parent_id: selectedStateObj.id }).then((data) => {
      if (active) setCatalogDistricts(data);
    });
    return () => { active = false; };
  }, [selectedStateObj?.id]);

  const selectedDistrictObj = useMemo(
    () => catalogDistricts.find((d) => String(d.name || '').toLowerCase() === String(district || '').trim().toLowerCase()),
    [catalogDistricts, district]
  );

  useEffect(() => {
    let active = true;
    if (!selectedDistrictObj?.id) {
      setCatalogCities([]);
      setCatalogLocalities([]);
      return;
    }
    fetchCatalogLocations({ location_type: 'CITY', parent_id: selectedDistrictObj.id }).then((data) => {
      if (active) setCatalogCities(data);
    });
    return () => { active = false; };
  }, [selectedDistrictObj?.id]);

  const selectedCityObj = useMemo(
    () => catalogCities.find((c) => String(c.name || '').toLowerCase() === String(city || '').trim().toLowerCase()),
    [catalogCities, city]
  );

  useEffect(() => {
    let active = true;
    if (!selectedCityObj?.id) {
      setCatalogLocalities([]);
      return;
    }
    fetchCatalogLocations({ location_type: 'LOCALITY', parent_id: selectedCityObj.id }).then((data) => {
      if (active) setCatalogLocalities(data);
    });
    return () => { active = false; };
  }, [selectedCityObj?.id]);

  const emitChange = (next) => {
    const parts = [];
    [next.locality, next.city, next.district, next.state].forEach((p) => {
      const t = String(p || '').trim();
      if (t && !parts.some((existing) => existing.toLowerCase() === t.toLowerCase())) {
        parts.push(t);
      }
    });
    if (onChange) {
      onChange({
        ...next,
        location: parts.join(', '),
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-extrabold text-slate-700 block mb-1">State</label>
          <CustomDropdown
            id="candidate-location-state"
            value={state || ''}
            searchable={true}
            disabled={loadingStates}
            placeholder={loadingStates ? 'Loading states...' : 'Select State'}
            options={mergeOptions(catalogStates, customStates, state)}
            onChange={(e) => emitChange({ state: e.target.value, district: '', city: '', locality: '' })}
            onCreateOption={(name) => {
              setCustomStates((prev) => [...prev, name]);
              emitChange({ state: name, district: '', city: '', locality: '' });
              return true;
            }}
          />
        </div>

        <div>
          <label className="text-xs font-extrabold text-slate-700 block mb-1">District</label>
          <CustomDropdown
            id="candidate-location-district"
            value={district || ''}
            searchable={true}
            disabled={!state}
            placeholder={state ? 'Select District' : 'Select State first'}
            options={mergeOptions(catalogDistricts, customDistricts, district)}
            onChange={(e) => emitChange({ state, district: e.target.value, city: '', locality: '' })}
            onCreateOption={(name) => {
              setCustomDistricts((prev) => [...prev, name]);
              emitChange({ state, district: name, city: '', locality: '' });
              return true;
            }}
          />
        </div>

        <div>
          <label className="text-xs font-extrabold text-slate-700 block mb-1">City / Town</label>
          <CustomDropdown
            id="candidate-location-city"
            value={city || ''}
            searchable={true}
            disabled={!district}
            placeholder={district ? 'Select City/Town' : 'Select District first'}
            options={mergeOptions(catalogCities, customCities, city)}
            onChange={(e) => emitChange({ state, district, city: e.target.value, locality: '' })}
            onCreateOption={(name) => {
              setCustomCities((prev) => [...prev, name]);
              emitChange({ state, district, city: name, locality: '' });
              return true;
            }}
          />
        </div>

        <div>
          <label className="text-xs font-extrabold text-slate-700 block mb-1">Locality</label>
          <CustomDropdown
            id="candidate-location-locality"
            value={locality || ''}
            searchable={true}
            disabled={!city}
            placeholder={city ? 'Select Locality' : 'Select City/Town first'}
            options={mergeOptions(catalogLocalities, customLocalities, locality)}
            onChange={(e) => emitChange({ state, district, city, locality: e.target.value })}
            onCreateOption={(name) => {
              setCustomLocalities((prev) => [...prev, name]);
              emitChange({ state, district, city, locality: name });
              return true;
            }}
          />
        </div>
      </div>
      <p className="text-[11px] text-slate-400 font-medium">
        Search or type your State, District, City/Town, or Locality and press Enter to use it.
      </p>
    </div>
  );
}
