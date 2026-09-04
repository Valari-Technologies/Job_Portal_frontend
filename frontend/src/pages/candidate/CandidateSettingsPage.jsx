import CandidateLayout from '../../components/candidate/layout/CandidateLayout';
import { Settings } from 'lucide-react';

export default function CandidateSettingsPage() {
  return (
    <CandidateLayout>
      <div className="space-y-6 animate-fadeIn font-sans max-w-4xl">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500">
            Manage your account notifications, privacy settings, and security preferences.
          </p>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
          <Settings className="h-10 w-10 text-[#3B00FF] mx-auto opacity-80" />
          <h3 className="text-base font-black text-slate-900">Candidate Preferences</h3>
          <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
            Email alerts, job recommendations, and security settings are configured here.
          </p>
        </div>
      </div>
    </CandidateLayout>
  );
}
