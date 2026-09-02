import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function RecruiterInterviewCalendar({ selectedDate, onSelectDate }) {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const isToday = (d) => 
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const isSelected = (d) => {
    if (!selectedDate) return false;
    const sel = new Date(selectedDate);
    return d === sel.getDate() && month === sel.getMonth() && year === sel.getFullYear();
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-5 space-y-4 shadow-xs">
      {/* Month Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-indigo-950">
          {monthNames[month]} {year}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center text-[11px] font-black text-slate-400">
        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold">
        {calendarDays.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="h-8" />;

          const todayClass = isToday(day) ? 'bg-indigo-600 text-white font-black shadow-sm' : '';
          const selectedClass = isSelected(day) && !isToday(day) ? 'border-2 border-indigo-600 text-indigo-600' : '';
          const normalClass = !isToday(day) && !isSelected(day) ? 'text-slate-700 hover:bg-indigo-50' : '';

          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() => onSelectDate(new Date(year, month, day))}
              className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center transition-all ${todayClass} ${selectedClass} ${normalClass}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
