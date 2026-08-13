import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from '../CustomSelect';
import { 
  Search, 
  Download, 
  Check, 
  X, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';

const DEFAULT_CANDIDATES = [
  {
    id: 1,
    name: 'Riya Sharma',
    email: 'riya.sharma@email.com',
    phone: '+91 98765 43210',
    role: 'UI/UX Designer',
    exp: '3+ years',
    appliedJob: 'UI/UX Designer',
    appliedDate: 'May 24, 2025',
    status: 'Under Review',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250',
    about: 'Creative and detail-oriented UI/UX Designer with 3+ years of experience in designing user-centered digital experiences.',
    education: {
      degree: 'B.Tech in Computer Science',
      school: 'Delhi Technological University',
      year: '2017 - 2021',
      cgpa: '8.4'
    },
    experience: {
      role: 'UI/UX Designer - ABC Tech',
      duration: 'Jan 2022 - Present (1+ years)',
      highlights: [
        'Designed 20+ web and mobile applications.',
        'Improved user engagement by 30%.'
      ]
    },
    skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'HTML', 'CSS', 'JavaScript', 'Prototyping', 'User Research'],
    coverLetter: 'Dear Hiring Team,\n\nI am writing to express my strong interest in the UI/UX Designer position. With over 3 years of experience creating user-centric mobile and web designs, I am confident in my ability to contribute value to your design team.\n\nSincerely,\nRiya Sharma',
    timeline: [
      { stage: 'Applied', date: 'May 24, 2025', time: '10:00 AM', completed: true },
      { stage: 'Under Review', date: 'May 24, 2025', time: '02:30 PM', completed: true },
      { stage: 'Shortlisted', date: '', time: '', completed: false },
      { stage: 'Interview', date: '', time: '', completed: false },
      { stage: 'Selected', date: '', time: '', completed: false }
    ]
  },
  {
    id: 2,
    name: 'Arjun Singh',
    email: 'arjun.s@example.com',
    phone: '+91 98765 11111',
    role: 'Frontend Developer',
    exp: '4+ years',
    appliedJob: 'Frontend Developer',
    appliedDate: 'May 24, 2025',
    status: 'Shortlisted',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250',
    about: 'Passionate Frontend Developer focused on building accessible, high-performance web applications using modern React and CSS.',
    education: {
      degree: 'B.E. in Information Technology',
      school: 'Mumbai University',
      year: '2016 - 2020',
      cgpa: '7.9'
    },
    experience: {
      role: 'Frontend Developer - Webify',
      duration: 'Jul 2020 - Present (3+ years)',
      highlights: [
        'Built dynamic responsive pages using React.',
        'Collaborated with designers to deliver premium pixel-perfect dashboards.'
      ]
    },
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Git', 'Webpack'],
    coverLetter: 'Hello Team,\n\nI am excited to submit my application for the Frontend Developer position. I have been building clean React applications for 4 years now and look forward to joining you.\n\nBest,\nArjun Singh',
    timeline: [
      { stage: 'Applied', date: 'May 24, 2025', time: '09:00 AM', completed: true },
      { stage: 'Under Review', date: 'May 24, 2025', time: '11:00 AM', completed: true },
      { stage: 'Shortlisted', date: 'May 24, 2025', time: '04:00 PM', completed: true },
      { stage: 'Interview', date: '', time: '', completed: false },
      { stage: 'Selected', date: '', time: '', completed: false }
    ]
  }
];

export default function HrApplications() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState('All Jobs');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedExp, setSelectedExp] = useState('All Experience');
  const [selectedSkill, setSelectedSkill] = useState('All Skills');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const stored = localStorage.getItem('hr_candidates');
    if (stored) {
      setCandidates(JSON.parse(stored));
    } else {
      localStorage.setItem('hr_candidates', JSON.stringify(DEFAULT_CANDIDATES));
      setCandidates(DEFAULT_CANDIDATES);
    }
  }, []);

  const getCount = (statusName) => {
    return candidates.filter(c => c.status.toLowerCase() === statusName.toLowerCase()).length;
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.email.toLowerCase().includes(search.toLowerCase()) ||
                          c.id.toString().includes(search);
    const matchesStatus = selectedStatus === 'All Status' || c.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesJob = selectedJob === 'All Jobs' || c.role.toLowerCase() === selectedJob.toLowerCase();
    return matchesSearch && matchesStatus && matchesJob;
  });

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredCandidates.length, totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredCandidates.length);
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div>
        <h1 className="text-5xl font-black text-slate-800 tracking-tight">Applications</h1>
      </div>

      {/* Six Statistics Cards Grid */}
      <div className="grid grid-cols-1 min-[375px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Received Applications', val: (candidates.length + 154).toString(), color: 'text-blue-600' },
          { label: 'New', val: (getCount('Pending') + 27).toString(), color: 'text-orange-500' },
          { label: 'Under Review', val: (getCount('Under Review') + 41).toString(), color: 'text-purple-600' },
          { label: 'Shortlisted', val: (getCount('Shortlisted') + 22).toString(), color: 'text-orange-500' },
          { label: 'Interview', val: (getCount('Interviewing') + 17).toString(), color: 'text-violet-600' },
          { label: 'Selected', val: (getCount('Selected') + 7).toString(), color: 'text-emerald-600' }
        ].map((c, i) => (
          <div key={i} className="relative bg-white rounded-[24px] p-5 border border-slate-100 shadow-xs flex flex-col justify-between min-h-[120px] transition-all hover:-translate-y-0.5 duration-300 overflow-visible">
            <span className="text-sm font-black text-slate-400 leading-tight pr-6">{c.label}</span>
            <span className={`text-4xl font-black ${c.color} mt-2`}>{c.val}</span>
            {/* Top Right Northeast Arrow button matching custom notch style */}
            <div className="absolute -top-3 -right-3 w-11 h-11 bg-[#F8FAFC] rounded-full flex items-center justify-center border border-slate-100/30">
              <button className="w-8 h-8 rounded-full bg-[#EBF5DF] hover:bg-[#DEECCB] flex items-center justify-center text-slate-700 transition-colors shadow-2xs border border-[#8CC63F]/20 cursor-pointer">
                <ArrowUpRight className="w-4 h-4 text-slate-700 font-extrabold" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters Controls Row */}
      <div className="flex flex-wrap items-center gap-3 w-full">
        {/* Search */}
        <div className="relative flex-grow max-w-md min-w-[280px] w-full">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate name, email or ID"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 text-base font-bold text-slate-700 bg-white border border-[#8CC63F]/40 rounded-xl focus:outline-none focus:border-[#8CC63F] focus:ring-1 focus:ring-[#8CC63F]/20 transition-all shadow-2xs"
          />
        </div>

        {/* Filters Selectors */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <CustomSelect 
            value={selectedJob} 
            onChange={(val) => { setSelectedJob(val); setCurrentPage(1); }}
            options={['All Jobs', 'UI/UX Designer', 'Frontend Developer']}
            placeholder="All Jobs"
            className="w-full md:w-auto flex-grow md:flex-grow-0"
          />

          <CustomSelect 
            value={selectedStatus} 
            onChange={(val) => { setSelectedStatus(val); setCurrentPage(1); }}
            options={['All Status', 'Under Review', 'Shortlisted', 'Interviewing', 'Selected', 'Rejected']}
            placeholder="All Status"
            className="w-full md:w-auto flex-grow md:flex-grow-0"
          />

          <CustomSelect 
            value={selectedExp} 
            onChange={(val) => setSelectedExp(val)}
            options={['All Experience', '3+ years', '4+ years']}
            placeholder="All Experience"
            className="w-full md:w-auto flex-grow md:flex-grow-0"
          />



          {/* <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            placeholder="mm/dd/yyyy"
            className="px-4 py-2 text-base font-bold text-slate-400 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#8CC63F] cursor-pointer flex-grow md:flex-grow-0"
          /> */}
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xs overflow-hidden">
        
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#8CC63F]/30 bg-[#8CC63F]/5">
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">CANDIDATE</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">JOB</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">APPLIED DATE</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">EXPERIENCE</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCandidates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-sm font-bold text-slate-400">
                    No applications found.
                  </td>
                </tr>
              ) : (
                paginatedCandidates.map((c) => (
                  <tr 
                    key={c.id} 
                    onClick={() => navigate(`/hr-dashboard/applications/${c.id}`)}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src={c.img} alt={c.name} className="w-9 h-9 rounded-full object-cover border border-slate-100" />
                        <span className="text-base font-black text-slate-700">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-base font-black text-[#2563EB] hover:underline cursor-pointer">
                        {c.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-base font-bold text-slate-400 whitespace-nowrap">
                      {c.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-base font-black text-[#F97316]">
                        {c.exp}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-black uppercase ${
                        c.status === 'Shortlisted' ? 'bg-amber-50 text-amber-600' :
                        c.status === 'Interviewing' ? 'bg-violet-50 text-violet-600' :
                        c.status === 'Selected' ? 'bg-emerald-50 text-emerald-600' :
                        c.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); alert(`Options for ${c.name}`); }}
                        className="text-slate-400 hover:text-slate-600 font-extrabold text-base px-2 cursor-pointer"
                      >
                        ...
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden flex flex-col divide-y divide-slate-100">
          {paginatedCandidates.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm font-bold text-slate-400">
              No applications found.
            </div>
          ) : (
            paginatedCandidates.map((c) => (
              <div 
                key={c.id} 
                onClick={() => navigate(`/hr-dashboard/applications/${c.id}`)}
                className="p-5 flex flex-col gap-3 hover:bg-slate-50/50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={c.img} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                    <div className="leading-tight">
                      <span className="text-base font-black text-slate-700 block">{c.name}</span>
                      <span className="text-xs font-bold text-slate-400">Exp: {c.exp}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                    c.status === 'Shortlisted' ? 'bg-amber-50 text-amber-600' :
                    c.status === 'Interviewing' ? 'bg-violet-50 text-violet-600' :
                    c.status === 'Selected' ? 'bg-emerald-50 text-emerald-600' :
                    c.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-sm font-bold text-slate-500">
                  <div>
                    <span className="text-slate-400 block text-[11px] uppercase font-black">Applied Role</span>
                    <span className="text-[#2563EB] hover:underline cursor-pointer block">{c.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px] uppercase font-black">Applied Date</span>
                    <span className="text-slate-400 block">{c.date}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Pagination Row - Centered Buttons Only (Outside Card) */}
      <div className="flex items-center justify-center text-xs font-bold text-slate-400 mt-6 select-none">
        <div className="flex items-center gap-1.5 select-none">
          <button 
            type="button"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-xl border border-slate-200/60 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-white"
          >
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>

          {(() => {
            const pages = [];
            if (totalPages <= 6) {
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
              } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
              } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
              }
            }
            return pages.map((pageNum, idx) => {
              if (pageNum === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-400 font-bold">
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors cursor-pointer text-sm ${
                    currentPage === pageNum 
                      ? 'bg-[#84A43C] text-white font-extrabold' 
                      : 'border border-slate-200/60 hover:bg-slate-50 text-slate-600 bg-white font-bold'
                  }`}
                >
                  {pageNum}
                </button>
              );
            });
          })()}

          <button 
            type="button"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-xl border border-slate-200/60 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-white"
          >
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
