import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

/**
 * CustomDropdown
 * A sleek, modern, accessible dropdown matching the user's reference design.
 * Features:
 * - Floating rounded card with soft ambient drop-shadow
 * - Rotating chevron icon (points up when open)
 * - Auto-flips upwards if near the bottom of the screen/modal
 * - Optional instant search filter for long option lists (states, districts, etc.)
 * - Flexible input: accepts `options` prop (array of strings or {value, label}) OR child <option> tags
 * - Seamless event compatibility with existing form handlers: calls onChange({ target: { value, name, id } }, value)
 */
export default function CustomDropdown({
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  searchable,
  icon: PrefixIcon,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  children,
  error = false,
  required = false,
  size = 'md', // 'sm' | 'md'
  rounded = 'xl', // 'xl' | 'full' | 'lg'
  onCreateOption = null
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options from either `options` prop or child `<option>` elements
  const normalizedOptions = useMemo(() => {
    if (Array.isArray(options) && options.length > 0) {
      return options.map((opt) => {
        if (typeof opt === 'object' && opt !== null) {
          return {
            value: opt.value ?? opt.id ?? '',
            label: opt.label ?? opt.name ?? String(opt.value ?? opt.id ?? ''),
            disabled: !!opt.disabled,
            icon: opt.icon
          };
        }
        return {
          value: String(opt),
          label: String(opt),
          disabled: false
        };
      });
    }

    // Extract options from JSX children if provided
    if (children) {
      const extracted = [];
      React.Children.forEach(children, (child) => {
        if (child && child.type === 'option') {
          extracted.push({
            value: child.props.value ?? '',
            label: child.props.children ?? child.props.label ?? '',
            disabled: !!child.props.disabled
          });
        }
      });
      return extracted;
    }

    return [];
  }, [options, children]);

  // Find currently selected option object
  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => String(opt.value) === String(value));
  }, [normalizedOptions, value]);

  // Auto-enable search for lists with more than 8 options (e.g. states, districts) unless explicitly disabled
  const isSearchable = searchable !== undefined ? searchable : normalizedOptions.length > 8;

  // Filtered options based on search query
  const filteredOptions = useMemo(() => {
    if (!isSearchable || !searchQuery.trim()) {
      return normalizedOptions;
    }
    const q = searchQuery.toLowerCase().trim();
    return normalizedOptions.filter((opt) => {
      if (opt.value === '') return false;
      return opt.label.toLowerCase().includes(q);
    });
  }, [normalizedOptions, searchQuery, isSearchable]);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, isSearchable]);

  const handleSelect = (opt) => {
    if (opt.disabled || disabled) return;

    if (onChange) {
      const syntheticEvent = {
        target: {
          name: name || id || '',
          id: id || '',
          value: opt.value
        },
        currentTarget: {
          name: name || id || '',
          id: id || '',
          value: opt.value
        },
        value: opt.value
      };
      onChange(syntheticEvent, opt.value);
    }

    setIsOpen(false);
    setSearchQuery('');
  };

  const handleToggle = () => {
    if (disabled) return;

    // Smart upward vs downward positioning
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // If less than 240px below and more space above, open upward
      if (spaceBelow < 240 && spaceAbove > spaceBelow) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }

    setIsOpen((prev) => !prev);
    setSearchQuery('');
  };

  // Determine display text
  const displayText = selectedOption && selectedOption.value !== ''
    ? selectedOption.label
    : (placeholder || 'Select...');

  const isPlaceholder = !selectedOption || selectedOption.value === '';

  const roundedClass = rounded === 'full' 
    ? 'rounded-full' 
    : rounded === 'lg' 
      ? 'rounded-lg' 
      : 'rounded-xl';

  const sizeClass = size === 'sm'
    ? 'min-h-[38px] px-3 py-1.5 text-xs'
    : 'min-h-[44px] px-3.5 py-2.5 text-sm';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Hidden input for standard form submission if name/id provided */}
      {(name || id) && (
        <input
          type="hidden"
          id={id ? `${id}-hidden` : undefined}
          name={name || id}
          value={value ?? ''}
          required={required}
        />
      )}

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        id={id || undefined}
        name={name || (id ? `${id}-btn` : undefined)}
        disabled={disabled}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2.5 ${roundedClass} border font-medium transition-all text-left cursor-pointer ${sizeClass} ${
          disabled
            ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
            : isOpen
              ? 'bg-white border-indigo-500 shadow-sm ring-3 ring-indigo-500/15'
              : error
                ? 'bg-white border-red-300 text-slate-800 hover:border-red-400'
                : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-2xs'
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 truncate">
          {PrefixIcon && (
            <PrefixIcon className="h-4 w-4 text-slate-400 shrink-0" />
          )}
          <span
            className={`truncate ${
              isPlaceholder ? 'text-slate-400 font-normal' : 'text-slate-800 font-medium'
            }`}
          >
            {displayText}
          </span>
        </div>

        {/* Chevron Icon - Rotates 180deg when open */}
        <ChevronDown
          className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-indigo-600' : ''
          }`}
        />
      </button>

      {/* Floating Popover Menu */}
      {isOpen && !disabled && (
        <div
          className={`absolute left-0 z-[100] min-w-full w-max max-w-[320px] bg-white rounded-xl border border-slate-200/80 shadow-2xl shadow-slate-300/60 overflow-hidden py-1 animate-in fade-in-50 zoom-in-95 duration-150 ${
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } ${menuClassName}`}
        >
          {/* Optional Search Filter Header for long option lists */}
          {isSearchable && (
            <div className="p-2 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  id={id ? `${id}-search` : undefined}
                  name={id ? `${id}-search` : 'dropdown-search'}
                  aria-label="Type to search options"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      const trimmed = searchQuery.trim();
                      if (!trimmed || isCreating) return;
                      const exactMatch = normalizedOptions.find(
                        (opt) => opt.value !== '' && opt.label.toLowerCase() === trimmed.toLowerCase()
                      );
                      if (exactMatch) {
                        handleSelect(exactMatch);
                        return;
                      }
                      if (onCreateOption) {
                        setIsCreating(true);
                        try {
                          const created = await onCreateOption(trimmed);
                          if (created) {
                            setIsOpen(false);
                            setSearchQuery('');
                          }
                        } finally {
                          setIsCreating(false);
                        }
                      }
                    }
                  }}
                  placeholder="Type to search..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-50 overscroll-contain">
            {onCreateOption &&
              searchQuery.trim() &&
              !normalizedOptions.some(
                (opt) => opt.value !== '' && opt.label.toLowerCase() === searchQuery.trim().toLowerCase()
              ) && (
                <button
                  type="button"
                  disabled={isCreating}
                  onClick={async (e) => {
                    e.stopPropagation();
                    const trimmed = searchQuery.trim();
                    if (!trimmed || isCreating) return;
                    setIsCreating(true);
                    try {
                      const created = await onCreateOption(trimmed);
                      if (created) {
                        setIsOpen(false);
                        setSearchQuery('');
                      }
                    } finally {
                      setIsCreating(false);
                    }
                  }}
                  className="w-full px-4 py-2.5 text-xs text-left flex items-center justify-between gap-2 bg-teal-50/70 text-teal-700 hover:bg-teal-100/70 font-bold transition-colors cursor-pointer"
                >
                  <span className="truncate">
                    {isCreating ? `Adding "${searchQuery.trim()}"...` : `+ Add "${searchQuery.trim()}"`}
                  </span>
                  <span className="text-[10px] font-semibold text-teal-600 shrink-0">Press Enter</span>
                </button>
              )}
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-xs text-slate-400 text-center font-medium">
                {onCreateOption
                  ? (searchQuery.trim() ? 'Press Enter above to add this location' : 'No options yet — type to add')
                  : 'No matching options'}
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = String(opt.value) === String(value);
                const isPlaceholderOption = opt.value === '';

                return (
                  <button
                    key={`${opt.value}-${idx}`}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt)}
                    className={`w-full px-4 py-2.5 text-sm text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      opt.disabled
                        ? 'opacity-40 cursor-not-allowed bg-slate-50/50 text-slate-400'
                        : isSelected
                          ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
                          : isPlaceholderOption
                            ? 'text-slate-400 font-normal hover:bg-slate-50'
                            : 'text-slate-700 font-medium hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="whitespace-nowrap">{opt.label}</span>
                    {isSelected && !isPlaceholderOption && (
                      <Check className="h-4 w-4 text-indigo-600 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
