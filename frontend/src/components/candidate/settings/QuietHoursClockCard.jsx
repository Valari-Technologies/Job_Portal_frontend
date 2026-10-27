import React, { useMemo } from 'react';
import { Moon, Sun, ChevronDown } from 'lucide-react';

/**
 * Parses time string (e.g. "22:00", "10:00 PM") into normalized values including 12h, 24h, minutes, and AM/PM
 */
function parseTime(timeStr, defaultH = 22, defaultM = 0) {
  let h = defaultH;
  let m = defaultM;

  if (timeStr && typeof timeStr === 'string') {
    const match12 = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (match12) {
      let rawH = parseInt(match12[1], 10);
      m = parseInt(match12[2], 10);
      const periodRaw = match12[3] ? match12[3].toUpperCase() : (rawH >= 12 ? 'PM' : 'AM');
      if (periodRaw === 'PM' && rawH < 12) rawH += 12;
      if (periodRaw === 'AM' && rawH === 12) rawH = 0;
      h = isNaN(rawH) ? defaultH : rawH;
      m = isNaN(m) ? defaultM : Math.min(59, Math.max(0, m));
    } else if (timeStr.includes(':')) {
      const parts = timeStr.trim().split(':');
      let rawH = parseInt(parts[0], 10);
      let rawM = parseInt(parts[1], 10);
      h = isNaN(rawH) ? defaultH : Math.min(23, Math.max(0, rawH));
      m = isNaN(rawM) ? defaultM : Math.min(59, Math.max(0, rawM));
    }
  }

  const period = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;

  const text12 = `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
  const text24 = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

  return {
    h24: h,
    h12,
    m,
    period,
    text12,
    text24
  };
}

/**
 * Converts 12-hour values (hour 1-12, minute 0-59, period AM/PM) into 24h "HH:mm" format
 */
function to24h(h12, m, period) {
  let h = parseInt(h12, 10);
  if (isNaN(h)) h = 12;
  const mins = parseInt(m, 10);
  const minValid = isNaN(mins) ? 0 : Math.min(59, Math.max(0, mins));

  if (period === 'PM' && h < 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;

  return `${h.toString().padStart(2, '0')}:${minValid.toString().padStart(2, '0')}`;
}

/**
 * Calculate rest duration
 */
function calculateRestDuration(fromObj, toObj) {
  let fromMin = fromObj.h24 * 60 + fromObj.m;
  let toMin = toObj.h24 * 60 + toObj.m;
  if (toMin <= fromMin) {
    toMin += 24 * 60;
  }
  const diffMin = toMin - fromMin;
  const hours = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
}

export default function QuietHoursClockCard({
  quietHours = {},
  onToggle,
  onChangeTime
}) {
  const isEnabled = Boolean(quietHours?.enabled);
  const fromTime = quietHours?.fromTime || '22:00';
  const toTime = quietHours?.toTime || '08:00';

  const fromObj = useMemo(() => parseTime(fromTime, 22, 0), [fromTime]);
  const toObj = useMemo(() => parseTime(toTime, 8, 0), [toTime]);
  const durationText = useMemo(() => calculateRestDuration(fromObj, toObj), [fromObj, toObj]);

  // Classic Clock Dimensions
  const size = 110;
  const cx = size / 2;
  const cy = size / 2;
  const rBezel = 50;
  const rDial = 46;

  // 12-hour angles (degrees from 12 o'clock)
  const fromAngle = ((fromObj.h24 % 12) + fromObj.m / 60) * 30;
  const toAngle = ((toObj.h24 % 12) + toObj.m / 60) * 30;

  // Helper to convert clock angle (0 = 12 o'clock) to SVG (x, y)
  const getCoords = (angleDeg, radius) => {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad)
    };
  };

  // Sector Arc for quiet hours span
  let sweepDeg = toAngle - fromAngle;
  if (sweepDeg <= 0) sweepDeg += 360;

  const startPt = getCoords(fromAngle, rDial);
  const endPt = getCoords(toAngle, rDial);
  const largeArcFlag = sweepDeg > 180 ? 1 : 0;
  const quietSectorPath = `M ${cx} ${cy} L ${startPt.x} ${startPt.y} A ${rDial} ${rDial} 0 ${largeArcFlag} 1 ${endPt.x} ${endPt.y} Z`;

  // Hand Endpoints
  const bedtimeHand = getCoords(fromAngle, 26);
  const wakeHand = getCoords(toAngle, 34);

  // Time Options
  const hoursList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  
  const getMinutesList = (currentM) => {
    const standard = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
    const formatted = currentM.toString().padStart(2, '0');
    if (!standard.includes(formatted)) {
      return [...standard, formatted].sort((a, b) => Number(a) - Number(b));
    }
    return standard;
  };

  const handleUpdate = (field, currentObj, newH12, newM, newPeriod) => {
    const h12 = newH12 !== undefined ? newH12 : currentObj.h12;
    const m = newM !== undefined ? newM : currentObj.m;
    const period = newPeriod !== undefined ? newPeriod : currentObj.period;
    const new24h = to24h(h12, m, period);
    onChangeTime(field, new24h);
  };

  return (
    <div className="lg:col-span-5 bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl space-y-4 shadow-2xs">
      {/* Header: Title & Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900">Quiet Hours</h3>
            {isEnabled && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Active
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-500">Pause non-critical notifications.</p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-label="Toggle Quiet Hours"
          className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
            isEnabled ? 'bg-[#3B00FF]' : 'bg-slate-300'
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              isEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Main Body: Classic Analog Clock + 12h Time Pickers with AM/PM */}
      <div className={`transition-opacity duration-200 ${isEnabled ? 'opacity-100' : 'opacity-50'}`}>
        <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
          {/* Classic Old Clock Face */}
          <div className="relative shrink-0 flex items-center justify-center p-1 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-28 h-28 drop-shadow-xs"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }}
            >
              {/* Bezel Outer Frame */}
              <circle
                cx={cx}
                cy={cy}
                r={rBezel}
                fill="#F8FAFC"
                stroke="#CBD5E1"
                strokeWidth="2.5"
              />

              {/* Classic Clock Dial Face (White) */}
              <circle
                cx={cx}
                cy={cy}
                r={rDial}
                fill="#FFFFFF"
                stroke="#E2E8F0"
                strokeWidth="1"
              />

              {/* Shaded Quiet Hours Sector (Soft Indigo Tint) */}
              {isEnabled && (
                <path
                  d={quietSectorPath}
                  fill="rgba(99, 102, 241, 0.16)"
                  stroke="none"
                />
              )}

              {/* 12 Hour Numbers (Classic Traditional Clock Dial) */}
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
                const angle = num * 30;
                const pt = getCoords(angle, 35);
                const isQuarter = num % 3 === 0;
                return (
                  <text
                    key={num}
                    x={pt.x}
                    y={pt.y + 3}
                    textAnchor="middle"
                    fontSize={isQuarter ? '9' : '7.5'}
                    fontWeight={isQuarter ? '900' : '700'}
                    fill={isQuarter ? '#1E293B' : '#64748B'}
                    fontFamily="inherit"
                  >
                    {num}
                  </text>
                );
              })}

              {/* 12 Minute Ticks on Perimeter */}
              {[...Array(12)].map((_, i) => {
                const angle = i * 30;
                const isMajor = i % 3 === 0;
                const p1 = getCoords(angle, rDial - 1);
                const p2 = getCoords(angle, rDial - (isMajor ? 4 : 2.5));
                return (
                  <line
                    key={i}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={isMajor ? '#475569' : '#94A3B8'}
                    strokeWidth={isMajor ? 1.5 : 1}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Bedtime Hand (Hour Hand - Dark Slate) */}
              {isEnabled && (
                <line
                  x1={cx}
                  y1={cy}
                  x2={bedtimeHand.x}
                  y2={bedtimeHand.y}
                  stroke="#1E293B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}

              {/* Wake-up Hand (Alarm / Indicator Hand - Purple) */}
              {isEnabled && (
                <line
                  x1={cx}
                  y1={cy}
                  x2={wakeHand.x}
                  y2={wakeHand.y}
                  stroke="#4F46E5"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}

              {/* Center Pin / Pivot */}
              <circle
                cx={cx}
                cy={cy}
                r="3.5"
                fill="#0F172A"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Time Controls with Hour, Minute, and AM/PM Selectors */}
          <div className="flex-1 w-full space-y-3">
            {/* From Input (Bedtime) */}
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>From</span>
                </span>
                <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                  {fromObj.text12}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Hour */}
                <div className="relative">
                  <select
                    value={fromObj.h12.toString().padStart(2, '0')}
                    onChange={(e) => handleUpdate('fromTime', fromObj, e.target.value, undefined, undefined)}
                    disabled={!isEnabled}
                    aria-label="From Hour"
                    className="appearance-none w-[66px] pl-2.5 pr-6 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-900 focus:outline-none focus:border-[#3B00FF] cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 text-center shadow-2xs"
                  >
                    {hoursList.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
                </div>

                <span className="text-xs font-black text-slate-400">:</span>

                {/* Minute */}
                <div className="relative">
                  <select
                    value={fromObj.m.toString().padStart(2, '0')}
                    onChange={(e) => handleUpdate('fromTime', fromObj, undefined, e.target.value, undefined)}
                    disabled={!isEnabled}
                    aria-label="From Minute"
                    className="appearance-none w-[66px] pl-2.5 pr-6 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-900 focus:outline-none focus:border-[#3B00FF] cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 text-center shadow-2xs"
                  >
                    {getMinutesList(fromObj.m).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
                </div>

                {/* AM / PM Toggle Pills */}
                <div className="flex items-center rounded-xl bg-slate-200/90 p-0.5 border border-slate-300/80 ml-auto shrink-0">
                  <button
                    type="button"
                    disabled={!isEnabled}
                    onClick={() => handleUpdate('fromTime', fromObj, undefined, undefined, 'AM')}
                    className={`px-2.5 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                      fromObj.period === 'AM'
                        ? 'bg-[#3B00FF] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    } disabled:cursor-not-allowed`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    disabled={!isEnabled}
                    onClick={() => handleUpdate('fromTime', fromObj, undefined, undefined, 'PM')}
                    className={`px-2.5 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                      fromObj.period === 'PM'
                        ? 'bg-[#3B00FF] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    } disabled:cursor-not-allowed`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>

            {/* To Input (Wakeup) */}
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>To</span>
                </span>
                <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                  {toObj.text12}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Hour */}
                <div className="relative">
                  <select
                    value={toObj.h12.toString().padStart(2, '0')}
                    onChange={(e) => handleUpdate('toTime', toObj, e.target.value, undefined, undefined)}
                    disabled={!isEnabled}
                    aria-label="To Hour"
                    className="appearance-none w-[66px] pl-2.5 pr-6 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-900 focus:outline-none focus:border-[#3B00FF] cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 text-center shadow-2xs"
                  >
                    {hoursList.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
                </div>

                <span className="text-xs font-black text-slate-400">:</span>

                {/* Minute */}
                <div className="relative">
                  <select
                    value={toObj.m.toString().padStart(2, '0')}
                    onChange={(e) => handleUpdate('toTime', toObj, undefined, e.target.value, undefined)}
                    disabled={!isEnabled}
                    aria-label="To Minute"
                    className="appearance-none w-[66px] pl-2.5 pr-6 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-900 focus:outline-none focus:border-[#3B00FF] cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 text-center shadow-2xs"
                  >
                    {getMinutesList(toObj.m).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
                </div>

                {/* AM / PM Toggle Pills */}
                <div className="flex items-center rounded-xl bg-slate-200/90 p-0.5 border border-slate-300/80 ml-auto shrink-0">
                  <button
                    type="button"
                    disabled={!isEnabled}
                    onClick={() => handleUpdate('toTime', toObj, undefined, undefined, 'AM')}
                    className={`px-2.5 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                      toObj.period === 'AM'
                        ? 'bg-[#3B00FF] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    } disabled:cursor-not-allowed`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    disabled={!isEnabled}
                    onClick={() => handleUpdate('toTime', toObj, undefined, undefined, 'PM')}
                    className={`px-2.5 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                      toObj.period === 'PM'
                        ? 'bg-[#3B00FF] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    } disabled:cursor-not-allowed`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean footer note */}
        <div className="pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-500 flex items-center justify-between">
          <span>
            {isEnabled
              ? `Silences alerts for ${durationText} each night.`
              : 'Quiet hours turned off. Alerts deliver anytime.'}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">
            {fromObj.text12} → {toObj.text12}
          </span>
        </div>
      </div>
    </div>
  );
}
