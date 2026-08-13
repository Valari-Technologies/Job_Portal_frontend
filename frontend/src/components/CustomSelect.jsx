import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Select option', 
  disabled = false,
  className = '',
  buttonClassName = '',
  accentColor = '#84A43C'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState('bottom'); // 'top' | 'bottom'
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  const isHR = accentColor === '#8CC63F';
  const focusBorderClass = isHR ? 'focus:border-[#8CC63F]' : 'focus:border-[#84A43C]';
  const activeOptionClass = isHR ? 'bg-[#8CC63F]/10 text-[#8CC63F]' : 'bg-[#84A43C]/10 text-[#84A43C]';

  // Update positioning dynamically on resize/scroll when dropdown is open
  useEffect(() => {
    const handleUpdateCoords = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const estimatedHeight = Math.min(options.length * 40 + 16, 240);
        const shouldOpenUpward = spaceBelow < estimatedHeight && rect.top > estimatedHeight;
        
        setPlacement(shouldOpenUpward ? 'top' : 'bottom');
        setCoords({
          top: shouldOpenUpward ? rect.top - 8 : rect.bottom + 8,
          left: rect.left,
          width: rect.width
        });
      }
    };
    window.addEventListener('resize', handleUpdateCoords);
    window.addEventListener('scroll', handleUpdateCoords, true);
    return () => {
      window.removeEventListener('resize', handleUpdateCoords);
      window.removeEventListener('scroll', handleUpdateCoords, true);
    };
  }, [isOpen, options.length]);

  const handleToggle = () => {
    if (disabled) return;
    if (isOpen) {
      setIsOpen(false);
    } else {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const estimatedHeight = Math.min(options.length * 40 + 16, 240);
        const shouldOpenUpward = spaceBelow < estimatedHeight && rect.top > estimatedHeight;
        
        setPlacement(shouldOpenUpward ? 'top' : 'bottom');
        setCoords({
          top: shouldOpenUpward ? rect.top - 8 : rect.bottom + 8,
          left: rect.left,
          width: rect.width
        });
      }
      setIsOpen(true);
    }
  };

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target) &&
        !e.target.closest('.custom-select-portal')
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation (Escape key to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (val) => {
    if (disabled) return;
    onChange(val);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => 
    typeof opt === 'object' ? opt.value === value : opt === value
  );
  
  const displayLabel = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
    : placeholder;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 outline-none ${focusBorderClass} text-left flex items-center justify-between font-semibold text-slate-700 cursor-pointer h-[38px] transition-all disabled:opacity-60 disabled:cursor-not-allowed ${buttonClassName}`}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && createPortal(
        <div 
          className="custom-select-portal z-[9999] bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 max-h-60 overflow-y-auto animate-in fade-in duration-100"
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: `${coords.width}px`,
            transform: placement === 'top' ? 'translateY(-100%)' : 'none',
          }}
        >
          {options.map((opt, i) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const label = typeof opt === 'object' ? opt.label : opt;
            const isSelected = value === val;

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(val)}
                className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors cursor-pointer ${
                  isSelected 
                    ? activeOptionClass 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}
