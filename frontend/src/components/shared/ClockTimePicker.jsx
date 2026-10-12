import React, { useState, useEffect, useRef } from 'react';
import { Clock, Check, ChevronDown, Sparkles } from 'lucide-react';

/**
 * ClockTimePicker Component
 * Interactive Analog & Digital Clock Picker with AM/PM selector
 * 
 * @param {string} value - Current time string e.g. "11:00 AM"
 * @param {function} onChange - Callback receiving formatted time string
 * @param {string} className - Optional wrapper class
 * @param {boolean} disabled - Disable picker
 */
export default function ClockTimePicker({
  value = '11:00 AM',
  onChange,
  className = '',
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('hour'); // 'hour' | 'minute'
  const containerRef = useRef(null);

  // Parse incoming value or fallback
  const parseTime = (val) => {
    if (!val || typeof val !== 'string') {
      return { hour: 11, minute: 0, period: 'AM' };
    }
    const match = val.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (match) {
      let h = parseInt(match[1], 10);
      let m = parseInt(match[2], 10);
      let p = (match[3] || 'AM').toUpperCase();
      if (h < 1 || h > 12) h = 11;
      if (m < 0 || m > 59) m = 0;
      return { hour: h, minute: m, period: p };
    }
    return { hour: 11, minute: 0, period: 'AM' };
  };

  const parsed = parseTime(value);
  const [selectedHour, setSelectedHour] = useState(parsed.hour);
  const [selectedMinute, setSelectedMinute] = useState(parsed.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(parsed.period);

  // Sync internal state when external value changes
  useEffect(() => {
    const p = parseTime(value);
    setSelectedHour(p.hour);
    setSelectedMinute(p.minute);
    setSelectedPeriod(p.period);
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const emitChange = (h, m, p) => {
    const formattedHour = String(h).padStart(2, '0');
    const formattedMinute = String(m).padStart(2, '0');
    const result = `${formattedHour}:${formattedMinute} ${p}`;
    if (onChange) {
      onChange(result);
    }
  };

  const handleHourSelect = (h) => {
    setSelectedHour(h);
    emitChange(h, selectedMinute, selectedPeriod);
    // Smooth auto-transition to minute selection
    setTimeout(() => {
      setMode('minute');
    }, 180);
  };

  const handleMinuteSelect = (m) => {
    setSelectedMinute(m);
    emitChange(selectedHour, m, selectedPeriod);
  };

  const handlePeriodToggle = (p) => {
    setSelectedPeriod(p);
    emitChange(selectedHour, selectedMinute, p);
  };

  // Dial Geometry constants
  const DIAL_SIZE = 220; // px
  const CENTER = DIAL_SIZE / 2; // 110 px
  const RADIUS = 78; // px for markers

  // Hours: 1 through 12
  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  // Minutes: 12 tick steps (0, 5, 10, ... 55)
  const minuteSteps = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  // Calculate coordinates on the circle
  const getCoordinates = (valueNum, totalSteps = 12) => {
    // 0 is at top (-90 degrees)
    const angleDeg = (valueNum * (360 / totalSteps)) - 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: CENTER + RADIUS * Math.cos(angleRad),
      y: CENTER + RADIUS * Math.sin(angleRad),
      angleDeg
    };
  };

  // Active hand target
  const currentHandCoords = mode === 'hour'
    ? getCoordinates(selectedHour % 12, 12)
    : getCoordinates(selectedMinute / 5, 12);

  // Quick preset slots
  const quickPresets = ['09:30 AM', '11:00 AM', '12:20 PM', '02:00 PM', '04:30 PM'];

  const formattedDisplay = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')} ${selectedPeriod}`;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button with Clock Icon */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
            setMode('hour');
          }
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all text-xs font-bold cursor-pointer ${
          isOpen
            ? 'border-[#3B00FF] ring-2 ring-[#3B00FF]/15 bg-white text-[#3B00FF]'
            : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2">
          <Clock className={`h-4 w-4 shrink-0 ${isOpen ? 'text-[#3B00FF]' : 'text-slate-400'}`} />
          <span className="font-extrabold tracking-wide">{value || '11:00 AM'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
            {selectedPeriod}
          </span>
          <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Popover Clock Picker */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-70 w-[290px] rounded-3xl bg-white border border-slate-200 shadow-2xl p-4 space-y-4 animate-scaleUp">
          
          {/* Header Display: Digital Time + AM / PM Toggle */}
          <div className="flex items-center justify-between bg-slate-50/80 p-2 rounded-2xl border border-slate-150">
            {/* Digital Hour : Minute switch */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMode('hour')}
                className={`px-2.5 py-1.5 rounded-xl text-base font-black transition-all cursor-pointer ${
                  mode === 'hour'
                    ? 'bg-[#3B00FF] text-white shadow-sm shadow-[#3B00FF]/30'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                {String(selectedHour).padStart(2, '0')}
              </button>

              <span className="text-base font-black text-slate-400">:</span>

              <button
                type="button"
                onClick={() => setMode('minute')}
                className={`px-2.5 py-1.5 rounded-xl text-base font-black transition-all cursor-pointer ${
                  mode === 'minute'
                    ? 'bg-[#3B00FF] text-white shadow-sm shadow-[#3B00FF]/30'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                {String(selectedMinute).padStart(2, '0')}
              </button>
            </div>

            {/* AM / PM Toggle Pill Switch */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl border border-slate-300/60">
              <button
                type="button"
                onClick={() => handlePeriodToggle('AM')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedPeriod === 'AM'
                    ? 'bg-white text-[#3B00FF] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => handlePeriodToggle('PM')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedPeriod === 'PM'
                    ? 'bg-white text-[#3B00FF] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                PM
              </button>
            </div>
          </div>

          {/* Mode Switcher subtitle */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              {mode === 'hour' ? 'Select Hour (1 - 12)' : 'Select Minute'}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#3B00FF]">
              <Sparkles className="h-3 w-3" />
              <span>{mode === 'hour' ? 'Tap Hour' : 'Tap Minute'}</span>
            </div>
          </div>

          {/* Circular Clock Dial */}
          <div
            className="relative mx-auto rounded-full bg-slate-50/90 border border-slate-200 shadow-inner select-none"
            style={{ width: DIAL_SIZE, height: DIAL_SIZE }}
          >
            {/* Center Pivot Pin */}
            <div
              className="absolute rounded-full bg-[#3B00FF] shadow-xs z-20 pointer-events-none"
              style={{
                width: 10,
                height: 10,
                left: CENTER - 5,
                top: CENTER - 5
              }}
            />

            {/* SVG Clock Hand Needle & Circle */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}
            >
              <line
                x1={CENTER}
                y1={CENTER}
                x2={currentHandCoords.x}
                y2={currentHandCoords.y}
                stroke="#3B00FF"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle
                cx={currentHandCoords.x}
                cy={currentHandCoords.y}
                r="16"
                fill="#3B00FF"
                className="opacity-95"
              />
            </svg>

            {/* Render Dial Markers */}
            {mode === 'hour' ? (
              // 12 Hours
              hours.map((h) => {
                const isSelected = selectedHour === h;
                const pos = getCoordinates(h % 12, 12);
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleHourSelect(h)}
                    style={{
                      left: pos.x - 14,
                      top: pos.y - 14,
                      width: 28,
                      height: 28
                    }}
                    className={`absolute rounded-full flex items-center justify-center text-xs font-black transition-all cursor-pointer z-15 ${
                      isSelected
                        ? 'text-white scale-110 shadow-sm'
                        : 'text-slate-700 hover:bg-indigo-50 hover:text-[#3B00FF]'
                    }`}
                  >
                    {h}
                  </button>
                );
              })
            ) : (
              // 12 Minute Steps (00, 05, 10, ... 55)
              minuteSteps.map((m) => {
                const isSelected = selectedMinute === m;
                const pos = getCoordinates(m / 5, 12);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleMinuteSelect(m)}
                    style={{
                      left: pos.x - 14,
                      top: pos.y - 14,
                      width: 28,
                      height: 28
                    }}
                    className={`absolute rounded-full flex items-center justify-center text-[11px] font-black transition-all cursor-pointer z-15 ${
                      isSelected
                        ? 'text-white scale-110 shadow-sm'
                        : 'text-slate-700 hover:bg-indigo-50 hover:text-[#3B00FF]'
                    }`}
                  >
                    {String(m).padStart(2, '0')}
                  </button>
                );
              })
            )}
          </div>

          {/* Quick Minute Chips (Under Dial for fast adjustment) */}
          <div className="flex items-center justify-between gap-1 pt-1">
            {[0, 15, 20, 30, 45].map((min) => (
              <button
                key={min}
                type="button"
                onClick={() => {
                  handleMinuteSelect(min);
                  setMode('minute');
                }}
                className={`flex-1 py-1 rounded-lg text-[10px] font-black border transition-colors cursor-pointer ${
                  selectedMinute === min
                    ? 'bg-[#3B00FF] text-white border-[#3B00FF]'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                :{String(min).padStart(2, '0')}
              </button>
            ))}
          </div>

          {/* Quick Presets row */}
          <div className="space-y-1.5 pt-1 border-t border-slate-150">
            <span className="text-[10px] font-bold text-slate-400 block">Quick Popular Slots:</span>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    const p = parseTime(slot);
                    setSelectedHour(p.hour);
                    setSelectedMinute(p.minute);
                    setSelectedPeriod(p.period);
                    emitChange(p.hour, p.minute, p.period);
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                    value === slot
                      ? 'bg-indigo-50 text-[#3B00FF] border-indigo-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Confirmation Row */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-150">
            <div className="text-xs font-black text-slate-800">
              Set: <span className="text-[#3B00FF]">{formattedDisplay}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-[#3B00FF] hover:bg-[#3000E0] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm shadow-[#3B00FF]/20 cursor-pointer"
            >
              <Check className="h-3.5 w-3.5 stroke-[3]" />
              <span>Done</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
