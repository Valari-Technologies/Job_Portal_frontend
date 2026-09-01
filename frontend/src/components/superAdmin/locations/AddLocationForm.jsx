import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLocationService } from '../../../services/superAdmin/superAdminService';

export default function AddLocationForm() {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    locationName: '',
    locationType: 'STATE',
    parentLocation: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeChange = (newType) => {
    setFormState(prev => ({
      ...prev,
      locationType: newType,
      parentLocation: '' // clear parent on type change
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formState.locationName.trim()) {
      newErrors.locationName = 'Location Name is required.';
    }

    if (!formState.locationType) {
      newErrors.locationType = 'Location Type is required.';
    }

    if (formState.locationType !== 'STATE' && !formState.parentLocation) {
      // If backend was connected, required parent based on type
    }

    if (!formState.status) {
      newErrors.status = 'Active Status is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setTimeout(() => {
        const firstErrorEl = document.querySelector('[data-error="true"] input, [data-error="true"] select');
        if (firstErrorEl) firstErrorEl.focus();
      }, 50);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formState.locationName.trim(),
        location_type: formState.locationType,
        parent_id: formState.locationType === 'STATE' ? null : (formState.parentLocation || null),
        is_active: formState.status === 'Active'
      };

      const res = await createLocationService(payload);
      if (res.success) {
        navigate('/super-admin/locations');
      }
    } catch (err) {
      console.error("Failed to create location", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Add location</h1>
        <p className="text-sm font-medium text-slate-450 mt-1">
          Add a new State, District, City / Town, or Locality to the location hierarchy.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border border-slate-150 p-6 sm:p-8">
        
        {/* Location Name */}
        <div className="space-y-1.5" data-error={!!errors.locationName}>
          <label htmlFor="locationName" className="text-[13px] font-bold text-slate-700">Location Name *</label>
          <input 
            id="locationName"
            type="text"
            value={formState.locationName}
            onChange={(e) => {
              setFormState(prev => ({ ...prev, locationName: e.target.value }));
              if (errors.locationName) setErrors(prev => ({ ...prev, locationName: null }));
            }}
            placeholder="e.g. Tamil Nadu or Chennai District"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none min-h-[44px] ${
              errors.locationName 
                ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
            }`}
          />
          {errors.locationName && <p className="text-xs text-red-500 font-semibold">{errors.locationName}</p>}
        </div>

        {/* Location Type */}
        <div className="space-y-1.5" data-error={!!errors.locationType}>
          <label htmlFor="locationType" className="text-[13px] font-bold text-slate-700">Location Type *</label>
          <select
            id="locationType"
            value={formState.locationType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-500 min-h-[44px]"
          >
            <option value="STATE">State</option>
            <option value="DISTRICT">District</option>
            <option value="CITY">City / Town</option>
            <option value="LOCALITY">Locality</option>
          </select>
          {errors.locationType && <p className="text-xs text-red-500 font-semibold">{errors.locationType}</p>}
        </div>

        {/* Conditional Parent Location */}
        <div className="space-y-1.5">
          <label htmlFor="parentLocation" className="text-[13px] font-bold text-slate-700">Parent Location</label>
          {formState.locationType === 'STATE' ? (
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-3 text-xs font-semibold text-slate-450 italic">
              No Parent Location required for State.
            </div>
          ) : (
            <>
              <select
                id="parentLocation"
                value={formState.parentLocation}
                onChange={(e) => setFormState(prev => ({ ...prev, parentLocation: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-teal-500 min-h-[44px]"
              >
                <option value="">
                  {formState.locationType === 'DISTRICT' && 'Select Parent State'}
                  {formState.locationType === 'CITY' && 'Select Parent District'}
                  {formState.locationType === 'LOCALITY' && 'Select Parent City/Town'}
                </option>
              </select>
              <p className="text-[11px] text-slate-450 italic">
                {formState.locationType === 'DISTRICT' && 'Shows active States.'}
                {formState.locationType === 'CITY' && 'Shows active Districts.'}
                {formState.locationType === 'LOCALITY' && 'Shows active Cities/Towns.'}
              </p>
            </>
          )}
        </div>

        {/* Active Status */}
        <div className="space-y-2" data-error={!!errors.status}>
          <label className="text-[13px] font-bold text-slate-700 block">Active Status *</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
              <input 
                type="radio"
                name="locationStatus"
                value="Active"
                checked={formState.status === 'Active'}
                onChange={() => {
                  setFormState(prev => ({ ...prev, status: 'Active' }));
                  if (errors.status) setErrors(prev => ({ ...prev, status: null }));
                }}
                className="h-4.5 w-4.5 accent-teal-600 focus:ring-2 focus:ring-teal-500"
              />
              <span>Active</span>
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
              <input 
                type="radio"
                name="locationStatus"
                value="Inactive"
                checked={formState.status === 'Inactive'}
                onChange={() => {
                  setFormState(prev => ({ ...prev, status: 'Inactive' }));
                  if (errors.status) setErrors(prev => ({ ...prev, status: null }));
                }}
                className="h-4.5 w-4.5 accent-teal-600 focus:ring-2 focus:ring-teal-500"
              />
              <span>Inactive</span>
            </label>
          </div>
          {errors.status && <p className="text-xs text-red-500 font-semibold">{errors.status}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            type="button"
            onClick={() => navigate('/super-admin/locations')}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[44px]"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/10 hover:bg-teal-700 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-100 min-h-[44px] cursor-pointer"
          >
            {isSubmitting ? "Creating..." : "Create location"}
          </button>
        </div>

      </form>
    </div>
  );
}
