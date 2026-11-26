import { useState, useEffect } from 'react';
import CustomDropdown from './CustomDropdown';
import { fetchLocations, createLocation } from '../../services/superAdmin/locationService';

/**
 * Cascading searchable location selector (State -> District -> City/Town -> Locality).
 * Supports inline creation when pressing Enter on a non-existing search term,
 * persisting directly into the backend Location catalog in proper hierarchy order.
 */
export default function CascadingLocationSelector({
  stateId = '',
  districtId = '',
  cityId = '',
  localityId = '',
  onChange,
  onError,
  labelClassName = 'text-xs font-semibold text-slate-500 block mb-1',
  gridClassName = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3',
}) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [createError, setCreateError] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadStates() {
      setLoadingStates(true);
      try {
        const data = await fetchLocations({ location_type: 'STATE' });
        if (active) setStates(data);
      } finally {
        if (active) setLoadingStates(false);
      }
    }
    loadStates();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    if (!stateId) {
      setDistricts([]);
      setCities([]);
      setLocalities([]);
      return;
    }
    async function loadDistricts() {
      const data = await fetchLocations({ location_type: 'DISTRICT', parent_id: stateId });
      if (active) setDistricts(data);
    }
    loadDistricts();
    return () => { active = false; };
  }, [stateId]);

  useEffect(() => {
    let active = true;
    if (!districtId) {
      setCities([]);
      setLocalities([]);
      return;
    }
    async function loadCities() {
      const data = await fetchLocations({ location_type: 'CITY', parent_id: districtId });
      if (active) setCities(data);
    }
    loadCities();
    return () => { active = false; };
  }, [districtId]);

  useEffect(() => {
    let active = true;
    if (!cityId) {
      setLocalities([]);
      return;
    }
    async function loadLocalities() {
      const data = await fetchLocations({ location_type: 'LOCALITY', parent_id: cityId });
      if (active) setLocalities(data);
    }
    loadLocalities();
    return () => { active = false; };
  }, [cityId]);

  const emitChange = (next, overrides = {}) => {
    const sList = overrides.states || states;
    const dList = overrides.districts || districts;
    const cList = overrides.cities || cities;
    const lList = overrides.localities || localities;

    const sObj = sList.find((s) => String(s.id) === String(next.stateId));
    const dObj = dList.find((d) => String(d.id) === String(next.districtId));
    const cObj = cList.find((c) => String(c.id) === String(next.cityId));
    const lObj = lList.find((l) => String(l.id) === String(next.localityId));

    const locationAddress = [lObj?.name, cObj?.name, dObj?.name, sObj?.name]
      .filter(Boolean)
      .join(', ');
    const locationId = next.localityId || next.cityId || next.districtId || next.stateId || null;

    if (onChange) {
      onChange({
        ...next,
        locationId: locationId ? Number(locationId) : null,
        locationAddress,
      });
    }
  };

  const handleCreate = async (locationType, parentId, name, currentList, setList, buildNextState) => {
    setCreateError(null);
    const res = await createLocation({
      name,
      location_type: locationType,
      parent_id: parentId || null,
      is_active: true,
    });

    if (!res.success || !res.data?.id) {
      const msg = res.message || `Failed to add ${locationType.toLowerCase()}.`;
      setCreateError(msg);
      if (onError) onError(msg);
      return false;
    }

    const created = res.data;
    const updatedList = [...currentList, created].sort((a, b) =>
      String(a.name || '').localeCompare(String(b.name || ''))
    );
    setList(updatedList);
    const { nextState, overrides } = buildNextState(created, updatedList);
    emitChange(nextState, overrides);
    return true;
  };

  return (
    <div className="space-y-2">
      <div className={gridClassName}>
        <div>
          <label className={labelClassName}>State</label>
          <CustomDropdown
            id="location-state"
            value={stateId || ''}
            searchable={true}
            disabled={loadingStates}
            placeholder={loadingStates ? 'Loading states...' : 'Select State'}
            options={states.map((s) => ({ value: s.id, label: s.name }))}
            onChange={(e) => {
              const sId = e.target.value;
              emitChange(
                { stateId: sId, districtId: '', cityId: '', localityId: '' },
                { districts: [], cities: [], localities: [] }
              );
            }}
            onCreateOption={(name) =>
              handleCreate('STATE', null, name, states, setStates, (created, updatedList) => ({
                nextState: { stateId: String(created.id), districtId: '', cityId: '', localityId: '' },
                overrides: { states: updatedList, districts: [], cities: [], localities: [] },
              }))
            }
          />
        </div>

        <div>
          <label className={labelClassName}>District</label>
          <CustomDropdown
            id="location-district"
            value={districtId || ''}
            searchable={true}
            disabled={!stateId}
            placeholder="Select District"
            options={districts.map((d) => ({ value: d.id, label: d.name }))}
            onChange={(e) => {
              const dId = e.target.value;
              emitChange(
                { stateId, districtId: dId, cityId: '', localityId: '' },
                { cities: [], localities: [] }
              );
            }}
            onCreateOption={(name) =>
              handleCreate('DISTRICT', stateId, name, districts, setDistricts, (created, updatedList) => ({
                nextState: { stateId, districtId: String(created.id), cityId: '', localityId: '' },
                overrides: { districts: updatedList, cities: [], localities: [] },
              }))
            }
          />
        </div>

        <div>
          <label className={labelClassName}>City / Town</label>
          <CustomDropdown
            id="location-city"
            value={cityId || ''}
            searchable={true}
            disabled={!districtId}
            placeholder="Select City/Town"
            options={cities.map((c) => ({ value: c.id, label: c.name }))}
            onChange={(e) => {
              const cId = e.target.value;
              emitChange(
                { stateId, districtId, cityId: cId, localityId: '' },
                { localities: [] }
              );
            }}
            onCreateOption={(name) =>
              handleCreate('CITY', districtId, name, cities, setCities, (created, updatedList) => ({
                nextState: { stateId, districtId, cityId: String(created.id), localityId: '' },
                overrides: { cities: updatedList, localities: [] },
              }))
            }
          />
        </div>

        <div>
          <label className={labelClassName}>Locality</label>
          <CustomDropdown
            id="location-locality"
            value={localityId || ''}
            searchable={true}
            disabled={!cityId}
            placeholder="Select Locality"
            options={localities.map((l) => ({ value: l.id, label: l.name }))}
            onChange={(e) => {
              const lId = e.target.value;
              emitChange({ stateId, districtId, cityId, localityId: lId });
            }}
            onCreateOption={(name) =>
              handleCreate('LOCALITY', cityId, name, localities, setLocalities, (created, updatedList) => ({
                nextState: { stateId, districtId, cityId, localityId: String(created.id) },
                overrides: { localities: updatedList },
              }))
            }
          />
        </div>
      </div>

      {createError && (
        <p className="text-xs text-red-500 font-semibold">{createError}</p>
      )}
    </div>
  );
}
