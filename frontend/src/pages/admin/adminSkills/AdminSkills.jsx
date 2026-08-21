import { useState } from 'react';
import SkillsTable from '../../../components/admin/adminSkills/SkillsTable';
import SkillDetailsPanel from '../../../components/admin/adminSkills/SkillDetailsPanel';
import SkillsReviewPanel from '../../../components/admin/adminSkills/SkillsReviewPanel';

// TODO: Connect Django API:
// GET /api/admin/skills/
// Future data source: skills, job_categories, candidate_skills and job_skills.

export default function AdminSkills() {
  const [selectedSkill, setSelectedSkill] = useState(null);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-slate-150 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-805 tracking-tight">Skills management</h1>
          <p className="text-base font-bold text-slate-500 mt-1.5">
            Keep skills searchable, clear and relevant.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4.5 w-4.5 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search skills..."
              className="rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none"
              disabled
            />
          </div>

          <button
            disabled
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-400 cursor-not-allowed"
          >
            <span>All status</span>
          </button>

          <button
            disabled
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-400 cursor-not-allowed"
          >
            <span>All categories</span>
          </button>

          <button
            disabled
            title="Connect the Skills Management API to add and manage skills."
            className="flex items-center gap-2 rounded-xl bg-teal-600/50 px-4.5 py-2.5 text-sm font-extrabold text-white cursor-not-allowed"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Add skill</span>
          </button>
        </div>
      </div>

      {/* Grid container layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side Table */}
        <div className="lg:col-span-2 space-y-6">
          <SkillsTable 
            skills={[]}
            selectedSkill={selectedSkill}
            onSelectSkill={setSelectedSkill}
          />
          <div className="text-sm font-bold text-slate-500">
            Showing 0 of 0 skills
          </div>
        </div>

        {/* Right Side details and reviews */}
        <div className="space-y-6">
          <SkillDetailsPanel 
            selectedSkill={selectedSkill}
          />
          
          <SkillsReviewPanel />
        </div>
      </div>
    </div>
  );
}
