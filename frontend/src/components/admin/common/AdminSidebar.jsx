import { useState } from 'react';

export default function AdminSidebar({ activeItem, onItemClick }) {
  // Navigation structure exactly matching Image 1
  const menuGroups = [
    {
      group: 'MANAGEMENT',
      items: [
        { id: 'candidates', label: 'Candidates', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { id: 'employers', label: 'Employers', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }
      ]
    },
    {
      group: 'MODERATION',
      items: [
        { id: 'employer-verification', label: 'Employer verification', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
        { id: 'job-review', label: 'Job review', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' }
      ]
    },
    {
      group: 'CATALOG',
      items: [
        { id: 'categories', label: 'Categories', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { id: 'locations', label: 'Locations', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z' },
        { id: 'skills', label: 'Skills', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' }
      ]
    },
    {
      group: 'COMMUNICATION',
      items: [
        { id: 'reports', label: 'Reports', icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' },
        { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' }
      ]
    },
    {
      group: 'INSIGHTS',
      items: [
        { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'audit', label: 'Audit & security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }
      ]
    }
  ];

  // Accordion Expand State: track which group name is open
  const [expandedGroup, setExpandedGroup] = useState(() => {
    if (activeItem === 'overview') return null;
    const matchingGroup = menuGroups.find(g => 
      g.items.some(item => item.id === activeItem)
    );
    return matchingGroup ? matchingGroup.group : null;
  });

  const handleGroupHeaderClick = (groupName) => {
    setExpandedGroup(expandedGroup === groupName ? null : groupName);
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-100 bg-white select-none">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-6 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-black text-slate-800 text-sm tracking-wide">STATE JOBZ</span>
          <span className="text-[10px] font-bold text-slate-400 tracking-widest -mt-1">ADMIN</span>
        </div>
      </div>

      {/* Main Accordion Navigation */}
      <nav className="flex-1 overflow-hidden px-4 py-4 space-y-2.5">
        {/* Overview link stays always visible at the top */}
        <button
          onClick={() => onItemClick('overview')}
          className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-2.5 text-base font-bold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-100 ${
            activeItem === 'overview'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Overview</span>
        </button>

        {menuGroups.map((group, idx) => {
          const isExpanded = expandedGroup === group.group;
          return (
            <div key={idx} className="space-y-1">
              {/* Accordion Group Header Clickable Button */}
              <button
                onClick={() => handleGroupHeaderClick(group.group)}
                aria-expanded={isExpanded}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-black text-slate-500 hover:bg-slate-50/50 hover:text-slate-700 tracking-wider uppercase focus:outline-none"
              >
                <span>{group.group}</span>
                <svg 
                  className={`h-4.5 w-4.5 text-slate-450 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Child Items Drawer */}
              <div 
                className={`space-y-1 overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                {group.items.map((item) => {
                  const isActive = activeItem === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onItemClick(item.id)}
                      className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-2.5 text-base font-bold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-100 ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
