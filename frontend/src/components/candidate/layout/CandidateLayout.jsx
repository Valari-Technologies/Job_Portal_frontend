import CandidateSidebar from './CandidateSidebar';
import CandidateHeader from './CandidateHeader';
import CandidateMobileHeader from './CandidateMobileHeader';
import CandidateBottomNavigation from './CandidateBottomNavigation';

export default function CandidateLayout({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] font-sans text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. Desktop Fixed Sidebar (Immovable like Super Admin) */}
      <CandidateSidebar />

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        
        {/* Desktop Header (Pinned Top) */}
        <CandidateHeader />

        {/* Mobile Header */}
        <CandidateMobileHeader />

        {/* Scrollable View Area (Only content scrolls) */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 pb-24 lg:pb-12">
          <div className="max-w-7xl mx-auto w-full min-w-0">
            {children}
          </div>
        </main>
      </div>

      {/* 3. Mobile Fixed Bottom Navigation */}
      <CandidateBottomNavigation />

    </div>
  );
}
