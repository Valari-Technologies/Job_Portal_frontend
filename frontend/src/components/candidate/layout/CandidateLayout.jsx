import CandidateSidebar from './CandidateSidebar';
import CandidateHeader from './CandidateHeader';
import CandidateMobileHeader from './CandidateMobileHeader';
import CandidateBottomNavigation from './CandidateBottomNavigation';

export default function CandidateLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-sans text-slate-800 antialiased flex flex-col lg:flex-row selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      
      {/* 1. Desktop Fixed Sidebar */}
      <CandidateSidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 lg:pb-12">
        
        {/* Desktop Header */}
        <CandidateHeader />

        {/* Mobile Header */}
        <CandidateMobileHeader />

        {/* Main View Container */}
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* 3. Mobile Fixed Bottom Navigation */}
      <CandidateBottomNavigation />

    </div>
  );
}
