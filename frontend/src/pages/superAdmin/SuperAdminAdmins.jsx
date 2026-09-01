import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, UserCheck } from 'lucide-react';
import { fetchAdminsService } from '../../services/superAdmin/superAdminService';

export default function SuperAdminAdmins() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminsService()
      .then((data) => {
        setAdmins(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load admins", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header and Title section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Admins</h1>
          <p className="text-sm font-medium text-slate-450 mt-1">
            Create and manage Admin accounts responsible for Recruiter accounts.
          </p>
        </div>
        <button
          onClick={() => navigate('/super-admin/admins/create')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-100 min-h-[44px] cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Create Admin</span>
        </button>
      </div>

      {/* Toolbar controls and searches */}
      <div className="flex items-center max-w-md bg-white rounded-xl border border-slate-150 pl-3.5 pr-2 py-1.5 focus-within:border-teal-500 transition-colors">
        <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search administrators..."
          className="w-full bg-transparent border-none text-xs font-bold text-slate-800 placeholder-slate-450 focus:outline-none pl-2.5 py-1.5"
        />
      </div>

      {/* Table listing cards */}
      <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-sm font-bold text-slate-450 animate-pulse">Loading admins list...</span>
          </div>
        ) : admins.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 px-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 border border-slate-100 mb-4">
              <UserCheck className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="text-base font-black text-slate-800">No admins yet</h3>
            <p className="text-xs font-medium text-slate-450 mt-1 max-w-sm">
              Admin accounts created by the Super Admin will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.map((adm, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40">
                    <td className="px-6 py-4.5 text-xs font-bold text-slate-805">{adm.full_name}</td>
                    <td className="px-6 py-4.5 text-xs font-bold text-slate-500">{adm.email}</td>
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                        adm.account_status === 'Active'
                          ? 'border border-green-200 bg-green-50 text-green-700'
                          : 'border border-slate-200 bg-slate-50 text-slate-500'
                      }`}>
                        {adm.account_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
