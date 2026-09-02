export default function RecruiterMobileHeroIllustration() {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 p-4 text-white overflow-hidden relative shadow-md">
      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-1 max-w-[65%]">
          <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-extrabold uppercase tracking-wider">
            Recruiter Hub
          </span>
          <h3 className="text-sm font-black text-white leading-snug">
            Streamline Hiring & Manage Pipeline
          </h3>
        </div>
        
        {/* SVG Graphic Element */}
        <div className="relative shrink-0">
          <svg className="w-24 h-16 text-white/90" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="60" height="40" rx="4" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" />
            <rect x="25" y="25" width="50" height="25" rx="2" fill="white" fillOpacity="0.4" />
            <circle cx="50" cy="35" r="5" fill="white" />
            <path d="M40 46C40 43 45 42 50 42C55 42 60 43 60 46V48H40V46Z" fill="white" />
            <circle cx="95" cy="25" r="10" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1.5" />
            <circle cx="95" cy="23" r="3" fill="white" />
            <path d="M90 31C90 29 93 28.5 95 28.5C97 28.5 100 29 100 31V32H90V31Z" fill="white" />
            <path d="M10 25C10 20 15 15 25 15C32 15 37 19 39 24" stroke="white" strokeWidth="1.5" strokeDasharray="2 2" />
            <path d="M80 20C83 15 90 12 98 15" stroke="white" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
        </div>
      </div>
    </div>
  );
}
