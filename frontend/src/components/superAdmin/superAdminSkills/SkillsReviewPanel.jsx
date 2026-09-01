export default function SkillsReviewPanel() {
  return (
    <div className="rounded-2xl border border-slate-155 bg-white p-6 shadow-2xs space-y-4">
      <h3 className="text-base font-extrabold text-slate-855 border-b border-slate-100 pb-3">Skills review</h3>
      <p className="text-sm font-bold text-slate-500 leading-normal">
        Skill usage and catalogue-quality insights will appear after candidates and jobs begin using skills.
      </p>

      {/* Matching alert message */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs font-semibold text-blue-800">
        Changes to skills can affect candidate matching and job recommendations.
      </div>
    </div>
  );
}
