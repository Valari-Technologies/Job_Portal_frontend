import { useState, useMemo } from 'react';

export default function LocationHierarchy({ 
  locations = [], 
  selectedLocation, 
  onSelectLocation,
  searchTerm = ''
}) {
  // Stack of selected parent location objects representing current drill-down path
  const [parentStack, setParentStack] = useState([]);

  // Helper to extract numeric parent ID from a location record
  const getParentId = (loc) => {
    if (!loc) return null;
    if (loc.parent !== undefined && loc.parent !== null) {
      return typeof loc.parent === 'object' ? loc.parent.id : loc.parent;
    }
    if (loc.parent_id !== undefined && loc.parent_id !== null) {
      return loc.parent_id;
    }
    return null;
  };

  // Map of location ID to count of direct child sub-locations
  const childCountMap = useMemo(() => {
    const map = {};
    locations.forEach(loc => {
      const pId = getParentId(loc);
      if (pId !== null && pId !== undefined) {
        map[pId] = (map[pId] || 0) + 1;
      }
    });
    return map;
  }, [locations]);

  // Current parent location at the top of the stack (if any)
  const currentParent = parentStack.length > 0 ? parentStack[parentStack.length - 1] : null;

  // Filter locations to display based on drill-down level or active search
  const displayedLocations = useMemo(() => {
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return locations.filter(loc => 
        loc.name.toLowerCase().includes(term) ||
        (loc.location_type && loc.location_type.toLowerCase().includes(term)) ||
        (loc.full_path && loc.full_path.toLowerCase().includes(term))
      );
    }

    if (!currentParent) {
      // Top level: STATE locations (or locations with parent == null)
      return locations.filter(loc => {
        const pId = getParentId(loc);
        return loc.location_type === 'STATE' || pId === null;
      });
    } else {
      // Child locations under current parent
      return locations.filter(loc => getParentId(loc) === currentParent.id);
    }
  }, [locations, parentStack, currentParent, searchTerm]);

  // Handle drill-down when clicking on a location row
  const handleRowClick = (loc) => {
    if (onSelectLocation) {
      onSelectLocation(loc);
    }

    // If not searching, and location has child items or is not locality, drill down
    const childCount = childCountMap[loc.id] || 0;
    if (searchTerm.trim() === '' && (childCount > 0 || loc.location_type !== 'LOCALITY')) {
      setParentStack(prev => [...prev, loc]);
    }
  };

  // Breadcrumb level click
  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      setParentStack([]);
    } else {
      const newStack = parentStack.slice(0, index + 1);
      setParentStack(newStack);
      if (onSelectLocation && newStack.length > 0) {
        onSelectLocation(newStack[newStack.length - 1]);
      }
    }
  };

  // Get human readable badge style for location type
  const getTypeBadge = (type) => {
    switch (type) {
      case 'STATE':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'DISTRICT':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'CITY':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'LOCALITY':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  // Next child level label name
  const getNextChildLabel = (type) => {
    switch (type) {
      case 'STATE': return 'District';
      case 'DISTRICT': return 'City / Town';
      case 'CITY': return 'Locality';
      default: return 'Sub-location';
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-2xs">
      {/* Breadcrumb Navigation Header */}
      {searchTerm.trim() === '' && (
        <div className="flex flex-wrap items-center gap-1.5 px-6 py-3.5 bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => handleBreadcrumbClick(-1)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              parentStack.length === 0
                ? 'bg-teal-600 text-white font-extrabold shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span>All States</span>
          </button>

          {parentStack.map((parentItem, index) => {
            const isLast = index === parentStack.length - 1;
            return (
              <div key={parentItem.id} className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
                <button
                  type="button"
                  onClick={() => handleBreadcrumbClick(index)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    isLast
                      ? 'bg-teal-600 text-white font-extrabold shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{parentItem.name}</span>
                  <span className={`text-[10px] font-black uppercase px-1.5 py-0.2 rounded-md ${isLast ? 'bg-teal-700/80 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {parentItem.location_type}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Location Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-black text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Sub-locations</th>
              <th className="px-6 py-4">Active jobs</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedLocations.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-14 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-extrabold text-slate-800">
                        {currentParent 
                          ? `No ${getNextChildLabel(currentParent.location_type)}s found under ${currentParent.name}`
                          : 'No locations configured yet'
                        }
                      </h3>
                      <p className="text-xs font-bold text-slate-500 max-w-sm mx-auto">
                        {currentParent
                          ? `Click "+ Add Location" to create a new ${getNextChildLabel(currentParent.location_type)} for ${currentParent.name}.`
                          : 'Set up State, District, City/Town, and Locality hierarchy to begin.'
                        }
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              displayedLocations.map((loc) => {
                const childCount = childCountMap[loc.id] || 0;
                const isSelected = selectedLocation?.id === loc.id;
                const nextLabel = getNextChildLabel(loc.location_type);

                return (
                  <tr 
                    key={loc.id} 
                    onClick={() => handleRowClick(loc)}
                    className={`cursor-pointer transition-colors hover:bg-slate-50/80 ${
                      isSelected ? 'bg-teal-50/30' : ''
                    }`}
                  >
                    {/* Location Name & Type */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-extrabold text-slate-900 text-sm">{loc.name}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-md border ${getTypeBadge(loc.location_type)}`}>
                          {loc.location_type}
                        </span>
                      </div>
                      {loc.full_path && searchTerm.trim() !== '' && (
                        <div className="text-xs font-medium text-slate-400 mt-0.5">{loc.full_path}</div>
                      )}
                    </td>

                    {/* Sub-locations count */}
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">
                      {childCount > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 font-extrabold">
                          <span>{childCount}</span>
                          <span>{nextLabel}{childCount > 1 ? 's' : ''}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">0 sub-locations</span>
                      )}
                    </td>

                    {/* Active Jobs */}
                    <td className="px-6 py-4 text-sm font-extrabold text-slate-800">0</td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold border ${
                        loc.is_active 
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700' 
                          : 'border-slate-200 bg-slate-50 text-slate-500'
                      }`}>
                        {loc.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Action Drill-down Button */}
                    <td className="px-6 py-4 text-right">
                      {loc.location_type !== 'LOCALITY' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-teal-600 hover:text-teal-700">
                          <span>View {nextLabel}s</span>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Details</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
