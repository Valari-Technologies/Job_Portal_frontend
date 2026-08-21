import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

// Custom styled tooltip declared outside of render to satisfy eslint react-hooks/static-components rule
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-xl">
        <p className="text-xs font-bold text-slate-700 mb-2">{label}</p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-semibold" style={{ color: entry.color }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-extrabold text-slate-800">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function OverviewChart({ data, range, onRangeChange }) {

  return (
    <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-2xs">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Applications & registrations</h3>
          <p className="text-sm font-bold text-slate-500 mt-1">Registration trends compared against monthly application volume</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-sm font-semibold mr-2">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="h-3 w-3 rounded-full bg-teal-600" />
              Applications
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="h-3 w-3 rounded-full bg-blue-500" />
              New candidates
            </span>
          </div>
          <select
            value={range}
            onChange={(e) => onRangeChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 shadow-2xs hover:bg-slate-50 focus:border-teal-500 focus:outline-none"
            aria-label="Select date range"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.01}/>
              </linearGradient>
              <linearGradient id="colorCandidates" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }}
              tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}K` : v}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="applications" 
              name="Applications"
              stroke="#0d9488" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorApps)" 
            />
            <Area 
              type="monotone" 
              dataKey="candidates" 
              name="New candidates"
              stroke="#3b82f6" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorCandidates)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
