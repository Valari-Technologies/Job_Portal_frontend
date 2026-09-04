export default function CandidateJobsMobileTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'for-you', label: 'For you' },
    { id: 'nearby', label: 'Nearby' },
    { id: 'recent', label: 'Recent' },
    { id: 'saved', label: 'Saved' }
  ];

  return (
    <div className="border-b border-slate-200 w-full font-sans">
      <nav aria-label="Job discovery tabs" className="flex items-center space-x-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className={`pb-3 text-xs sm:text-sm font-black transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-[#3B00FF] text-[#3B00FF]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
