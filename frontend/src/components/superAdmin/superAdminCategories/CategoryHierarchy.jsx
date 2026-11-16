import { useState, useEffect, useRef, Fragment } from 'react';
import { Edit2, Power, Trash2, ChevronRight, ChevronDown, FolderTree, Layers, MoreVertical } from 'lucide-react';

function ActionMenu({ item, onEdit, onToggleStatus, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Actions menu"
      >
        <MoreVertical className="h-4.5 w-4.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-slate-150 bg-white p-1.5 shadow-lg z-30 space-y-0.5 animate-fadeIn">
          <button
            type="button"
            onClick={() => { setOpen(false); onEdit && onEdit(item); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-teal-600 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="h-3.5 w-3.5 text-slate-400" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => { setOpen(false); onToggleStatus && onToggleStatus(item); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <Power className={`h-3.5 w-3.5 ${item.is_active ? 'text-amber-500' : 'text-emerald-500'}`} />
            <span>{item.is_active ? 'Deactivate' : 'Activate'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setOpen(false); onDelete && onDelete(item); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function CategoryHierarchy({ 
  categories = [], 
  selectedCategory, 
  onSelectCategory,
  onEditCategory,
  onToggleStatus,
  onDeleteCategory,
  loading = false,
  error = null,
  onRetry = null,
  isFiltered = false
}) {
  // Track expanded parent category IDs
  const [expandedParents, setExpandedParents] = useState(new Set());

  // Auto-expand all when searching/filtering or when categories load
  useEffect(() => {
    if (isFiltered) {
      const allParentIds = new Set(
        categories
          .filter(c => !c.parent && !c.parent_id && !c.parent_name)
          .map(c => c.id)
      );
      setExpandedParents(allParentIds);
    }
  }, [isFiltered, categories]);

  const toggleExpand = (parentId, e) => {
    if (e) e.stopPropagation();
    setExpandedParents(prev => {
      const next = new Set(prev);
      if (next.has(parentId)) {
        next.delete(parentId);
      } else {
        next.add(parentId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-150 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-600 border-t-transparent mb-3"></div>
        <p className="text-sm font-bold text-slate-500">Loading job categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-2xl border border-rose-150 p-8 text-center space-y-4">
        <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-xl bg-rose-50 text-rose-500">
          <FolderTree className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-slate-800">Failed to load categories</h3>
          <p className="text-sm font-bold text-slate-500">{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  // Build tree data structures
  const rootCategories = [];
  const childrenMap = {};
  const rootIds = new Set();

  categories.forEach(c => {
    if (!c.parent && !c.parent_id && !c.parent_name) {
      rootCategories.push(c);
      rootIds.add(c.id);
    }
  });

  categories.forEach(c => {
    const parentId = c.parent || c.parent_id;
    if (parentId) {
      if (!childrenMap[parentId]) childrenMap[parentId] = [];
      childrenMap[parentId].push(c);
    }
  });

  // Orphan children (matching search filter where parent isn't in root list)
  const orphanChildren = categories.filter(
    c => (c.parent || c.parent_id || c.parent_name) && !rootIds.has(c.parent || c.parent_id)
  );

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="w-full overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-black text-slate-500 uppercase tracking-wider">
              <th className="px-4 sm:px-5 py-4 w-[35%]">Category</th>
              <th className="px-3 sm:px-4 py-4 w-[22%]">Hierarchy</th>
              <th className="px-3 sm:px-4 py-4 w-[16%] text-center whitespace-nowrap">Sort order</th>
              <th className="px-3 sm:px-4 py-4 w-[14%] text-center">Status</th>
              <th className="px-4 sm:px-5 py-4 w-[13%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400">
                      <FolderTree className="h-6 w-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-extrabold text-slate-800">
                        {isFiltered ? 'No matching categories found' : 'No job categories yet'}
                      </h3>
                      <p className="text-sm font-bold text-slate-500 max-w-md mx-auto leading-normal">
                        {isFiltered
                          ? 'Try adjusting your search query or status filter.'
                          : 'Create your first top-level or sub-category to organize job taxonomy.'}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {rootCategories.map((parent) => {
                  const subCategories = childrenMap[parent.id] || [];
                  const isExpanded = expandedParents.has(parent.id) || isFiltered;
                  const hasChildren = subCategories.length > 0;
                  const isSelected = selectedCategory?.id === parent.id;

                  return (
                    <Fragment key={`parent-fragment-${parent.id}`}>
                      {/* Parent Row */}
                      <tr 
                        onClick={() => {
                          if (onSelectCategory) onSelectCategory(parent);
                          if (hasChildren) toggleExpand(parent.id);
                        }}
                        className={`cursor-pointer transition-colors hover:bg-slate-50/80 ${
                          isSelected ? 'bg-teal-50/40' : 'bg-white'
                        }`}
                      >
                        {/* Category Name & Expand Chevron */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {hasChildren ? (
                              <button
                                type="button"
                                onClick={(e) => toggleExpand(parent.id, e)}
                                className="p-1 rounded-md text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer shrink-0"
                                title={isExpanded ? "Collapse subcategories" : "Expand subcategories"}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4.5 w-4.5 text-teal-600" />
                                ) : (
                                  <ChevronRight className="h-4.5 w-4.5 text-slate-400" />
                                )}
                              </button>
                            ) : (
                              <span className="w-6 shrink-0" />
                            )}
                            <span className="font-extrabold text-slate-900 text-sm tracking-tight truncate">
                              {parent.name}
                            </span>
                            {hasChildren && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                                <Layers className="h-3 w-3 text-slate-400" />
                                {subCategories.length}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Hierarchy Badge */}
                        <td className="px-4 py-4 text-xs font-bold">
                          <span className="inline-block rounded-lg bg-teal-50 px-2.5 py-1 text-teal-700 font-extrabold border border-teal-100">
                            Top Level
                          </span>
                        </td>

                        {/* Sort Order */}
                        <td className="px-4 py-4 text-sm font-extrabold text-slate-700 text-center">
                          {parent.sort_order !== undefined ? parent.sort_order : 0}
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                            parent.is_active 
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700' 
                              : 'border-slate-200 bg-slate-100 text-slate-600'
                          }`}>
                            {parent.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* 3-Dots Actions Menu */}
                        <td className="px-5 py-4 text-right">
                          <ActionMenu 
                            item={parent}
                            onEdit={onEditCategory}
                            onToggleStatus={onToggleStatus}
                            onDelete={onDeleteCategory}
                          />
                        </td>
                      </tr>

                      {/* Sub-categories (Expanded) */}
                      {isExpanded && subCategories.map((child) => {
                        const isChildSelected = selectedCategory?.id === child.id;
                        return (
                          <tr 
                            key={`child-${child.id}`}
                            onClick={() => onSelectCategory && onSelectCategory(child)}
                            className={`cursor-pointer transition-colors hover:bg-teal-50/20 ${
                              isChildSelected ? 'bg-teal-50/40' : 'bg-slate-50/40'
                            }`}
                          >
                            {/* Indented Child Name */}
                            <td className="px-5 py-3.5 pl-12">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-300 font-mono text-xs">└─</span>
                                <span className="font-bold text-slate-750 text-sm truncate">
                                  {child.name}
                                </span>
                              </div>
                            </td>

                            {/* Hierarchy Path */}
                            <td className="px-4 py-3.5 text-xs font-bold">
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-slate-600 font-semibold border border-slate-200/60 max-w-full truncate">
                                <span className="truncate">{parent.name}</span>
                                <span className="text-slate-400">→</span>
                                <span className="text-slate-800 font-bold truncate">{child.name}</span>
                              </span>
                            </td>

                            {/* Sort Order */}
                            <td className="px-4 py-3.5 text-sm font-bold text-slate-600 text-center">
                              {child.sort_order !== undefined ? child.sort_order : 0}
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3.5 text-center">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                                child.is_active 
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700' 
                                  : 'border-slate-200 bg-slate-100 text-slate-600'
                              }`}>
                                {child.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>

                            {/* 3-Dots Actions Menu */}
                            <td className="px-5 py-3.5 text-right">
                              <ActionMenu 
                                item={child}
                                onEdit={onEditCategory}
                                onToggleStatus={onToggleStatus}
                                onDelete={onDeleteCategory}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </Fragment>
                  );
                })}

                {/* Render any orphan children if filtered */}
                {orphanChildren.map((child) => {
                  const isSelected = selectedCategory?.id === child.id;
                  return (
                    <tr
                      key={`orphan-${child.id}`}
                      onClick={() => onSelectCategory && onSelectCategory(child)}
                      className={`cursor-pointer transition-colors hover:bg-slate-50/80 ${
                        isSelected ? 'bg-teal-50/40' : 'bg-white'
                      }`}
                    >
                      <td className="px-5 py-4 font-extrabold text-slate-855 text-sm truncate">
                        {child.name}
                      </td>
                      <td className="px-4 py-4 text-xs font-bold text-slate-500">
                        {child.parent_name ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-slate-600 font-semibold">
                            <span>{child.parent_name}</span>
                            <span className="text-slate-400">→</span>
                            <span className="text-slate-800 font-bold">{child.name}</span>
                          </span>
                        ) : (
                          <span className="rounded-lg bg-teal-50 px-2.5 py-1 text-teal-700 font-extrabold">Sub Category</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm font-extrabold text-slate-700 text-center">
                        {child.sort_order !== undefined ? child.sort_order : 0}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                          child.is_active 
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700' 
                            : 'border-slate-200 bg-slate-100 text-slate-600'
                        }`}>
                          {child.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <ActionMenu 
                          item={child}
                          onEdit={onEditCategory}
                          onToggleStatus={onToggleStatus}
                          onDelete={onDeleteCategory}
                        />
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}




