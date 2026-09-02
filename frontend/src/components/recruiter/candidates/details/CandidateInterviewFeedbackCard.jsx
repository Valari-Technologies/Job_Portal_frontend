import { MessageSquare, ThumbsUp } from 'lucide-react';

export default function CandidateInterviewFeedbackCard({ feedback = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 space-y-4 shadow-xs">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <MessageSquare className="h-4 w-4 text-indigo-600" />
        <h3 className="text-base font-black text-slate-900">Interview Feedback</h3>
      </div>

      {feedback.length > 0 ? (
        <div className="space-y-3">
          {feedback.map((item, idx) => (
            <div key={idx} className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {item.interviewer_initials || 'I'}
                  </div>
                  <span className="text-xs font-black text-slate-900">{item.interviewer_name}</span>
                </div>
                {item.recommendation === 'recommended' && (
                  <ThumbsUp className="h-4 w-4 text-emerald-600" />
                )}
              </div>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">{item.notes}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs font-medium text-slate-450 italic py-2">No interview feedback yet.</p>
      )}
    </div>
  );
}
