import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ResumeOptimizationCard() {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#3B00FF] to-[#2500C0] text-white p-6 sm:p-7 relative overflow-hidden shadow-lg font-sans space-y-4">
      
      {/* Background Decorative Circles */}
      <div className="absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute right-12 -top-12 h-28 w-28 rounded-full bg-white/10 pointer-events-none" />

      {/* Top Icon Badge */}
      <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-inner">
        <Sparkles className="h-6 w-6 stroke-[2.2]" />
      </div>

      {/* Main Content */}
      <div className="space-y-2 relative z-10">
        <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
          Optimize your resume
        </h3>
        <p className="text-xs font-semibold text-white/90 leading-relaxed">
          Get 10x more matches with our AI-powered resume builder.
        </p>
      </div>

      {/* Action Button */}
      <div className="pt-2 relative z-10">
        <Link
          to="/candidate/resume"
          className="inline-block px-7 py-3 rounded-full bg-white text-[#3B00FF] hover:bg-slate-50 transition-all font-black text-xs shadow-md cursor-pointer active:scale-98"
        >
          Try it now
        </Link>
      </div>

    </div>
  );
}
