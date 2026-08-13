import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Link, Send } from 'lucide-react';
import { getCandidates, saveCandidates } from '../../components/superadmin/candidates/candidatesData';

export default function CandidateDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [allCandidates, setAllCandidates] = useState([]);
  const [activeTab, setActiveTab] = useState('Timeline');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const list = getCandidates();
    setAllCandidates(list);
    const found = list.find(c => c.id === id);
    if (found) {
      setCandidate(found);
    }
  }, [id]);

  if (!candidate) {
    return (
      <div className="py-16 text-center text-slate-500">
        <p className="text-base font-bold">Candidate not found</p>
        <button 
          onClick={() => navigate('/superadmin-dashboard/candidates')}
          className="mt-4 text-sm font-black text-[#8CC63F] flex items-center gap-1.5 justify-center mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Candidates</span>
        </button>
      </div>
    );
  }

  // Handle adding notes
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const noteObj = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      text: newNote.trim(),
      author: 'Super Admin'
    };

    const updatedNotes = [...(candidate.timelineNotes || []), noteObj];
    const updatedCandidate = { ...candidate, timelineNotes: updatedNotes };
    const updatedList = allCandidates.map(c => c.id === candidate.id ? updatedCandidate : c);
    
    setCandidate(updatedCandidate);
    setAllCandidates(updatedList);
    saveCandidates(updatedList);
    setNewNote('');
  };

  const tabsList = ['Timeline', 'Application Info', 'Documents', 'Notes', 'Activity'];

  return (
    <div className="flex flex-col gap-5 w-full text-left">
      
      {/* Back Link */}
      <div>
        <button
          onClick={() => navigate('/superadmin-dashboard/candidates')}
          className="flex items-center gap-2 text-sm font-bold text-[#8CC63F] hover:text-[#7ab533] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </button>
      </div>

      {/* Main Layout Grid - Summary Left, Overview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        
        {/* Left Column: Candidate Profile Card & Documents */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Candidate Profile Details Card - Solid White */}
          <div className="bg-white rounded-[32px] border border-slate-100/80 shadow-xs p-6 flex flex-col gap-5 text-center items-center">
            
            {/* Avatar circle with online status dot */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" 
                alt="Candidate Profile"
                className="w-20 h-20 rounded-full object-cover border border-slate-100 shadow-2xs"
              />
              <span className="absolute bottom-0 right-1 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white"></span>
            </div>
            
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{candidate.name}</h3>
              <p className="text-sm font-semibold text-slate-400 mt-1">{candidate.email}</p>
              <p className="text-sm font-semibold text-slate-400 mt-0.5">{candidate.phone}</p>
              <p className="text-sm font-semibold text-slate-400 mt-0.5">{candidate.location || 'Coimbatore, India'}</p>
            </div>
            
            <button
              onClick={() => alert('Opening full resume profile view...')}
              className="w-full bg-[#8CC63F] hover:bg-[#7ab533] text-white text-sm font-black py-3 rounded-2xl shadow-xs transition-all cursor-pointer"
            >
              View Profile
            </button>
          </div>

          {/* Documents Section Card */}
          <div className="flex flex-col gap-3 text-left">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">Documents</h4>
              <button 
                onClick={() => alert('Opening documents repository...')}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="flex flex-col gap-3 font-semibold text-sm text-slate-600">
              <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>Resume.pdf</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>Cover_Letter.pdf</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Link className="w-4 h-4" />
                  </div>
                  <span>Portfolio_Link</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Candidate Overview & Tab details - Solid White Card */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100/80 shadow-xs p-6 flex flex-col gap-6">
          
          {/* Header block with Job Details Assignment */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-800 tracking-tight leading-snug">{candidate.appliedJob}</h4>
                <p className="text-sm font-bold text-slate-400 mt-0.5">{candidate.organization} &bull; {candidate.department}</p>
              </div>
            </div>
            
            {/* HR Assigned Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-full">
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80" 
                  alt="HR Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-slate-600">{candidate.assignedHR} (HR)</span>
            </div>
          </div>

          {/* Quick Metrics Sub-Card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-[#F8FAFC] border border-slate-100 rounded-2xl">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Applied Date</span>
              <span className="text-sm font-black text-slate-800 block mt-1.5">{candidate.appliedDate}</span>
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Current Stage</span>
              <span className="text-sm font-black text-slate-800 block mt-1.5">{candidate.currentStage}</span>
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Status</span>
              <span className="text-sm font-black text-slate-800 block mt-1.5">{candidate.status}</span>
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Assigned To</span>
              <span className="text-sm font-black text-slate-800 block mt-1.5">{candidate.assignedHR}</span>
            </div>
          </div>

          {/* Tab Navigation Menu */}
          <div className="flex items-center gap-6 border-b border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none pb-0 mt-2">
            {tabsList.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-sm font-black transition-all border-b-2 cursor-pointer -mb-[2px] ${
                  activeTab === tab 
                    ? 'border-[#8CC63F] text-[#8CC63F]' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Dynamic Workspace Rendering */}
          {activeTab === 'Timeline' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              
              {/* Timeline Header Bar matching Figma */}
              <div className="relative pt-2">
                <div className="absolute top-7 left-8 right-8 h-[2px] bg-slate-100 z-0"></div>
                <div className="absolute top-7 left-8 w-[25%] h-[2px] bg-[#8CC63F] z-0"></div>
                
                <div className="flex items-center justify-between gap-2 overflow-x-auto relative z-10">
                  {[
                    { stage: 'Applied', step: '✓', active: true, checked: true, labelColor: 'text-[#8CC63F]' },
                    { stage: 'Under Review', step: '2', active: true, checked: false, labelColor: 'text-[#8CC63F]', date: 'May 29, 2025' },
                    { stage: 'Shortlist', step: '', active: false },
                    { stage: 'Assessment', step: '', active: false },
                    { stage: 'Interview', step: '', active: false },
                    { stage: 'Offer', step: '', active: false },
                    { stage: 'Hired', step: '', active: false }
                  ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center min-w-[85px] text-center">
                      {/* Step Stage Title label on top */}
                      <span className={`text-[10px] font-black uppercase mb-1 ${step.active ? 'text-[#8CC63F]' : 'text-slate-400'}`}>
                        {step.stage}
                      </span>

                      {/* Circle Step Button */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black mb-1 transition-all ${
                        step.checked 
                          ? 'bg-[#8CC63F] text-white shadow-xs' 
                          : step.active && step.step === '2'
                          ? 'bg-[#8CC63F] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {step.checked ? '✓' : step.step === '2' ? '2' : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        )}
                      </div>

                      {/* Stage Label/Date Below */}
                      <span className="text-[10px] font-black text-slate-400">
                        {step.stage === 'Applied' ? 'Applied' : step.date || ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Notes Card */}
              {candidate.timelineNotes && candidate.timelineNotes.length > 0 && (
                <div className="bg-[#F4F6FF]/70 border border-slate-100 rounded-2xl p-6 text-left flex flex-col gap-2">
                  {candidate.timelineNotes.map((note, j) => (
                    <div key={j} className="flex flex-col gap-1 text-sm font-semibold text-slate-600">
                      <h4 className="text-sm font-black text-slate-800">Latest Note ({note.date})</h4>
                      <p className="text-slate-600 mt-1 leading-relaxed">{note.text}</p>
                      <span className="text-xs text-slate-400 mt-1 block">- {note.author}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Application Info' && (
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-left flex flex-col gap-4 animate-fadeIn">
              <h4 className="text-base font-black text-[#8CC63F] uppercase tracking-wider mb-2">Application Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold text-slate-600">
                <div>
                  <span className="text-xs text-slate-400 block">Applied Job</span>
                  <span className="text-slate-800 block mt-0.5">{candidate.appliedJob}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Organization</span>
                  <span className="text-slate-800 block mt-0.5">{candidate.organization}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Department</span>
                  <span className="text-slate-800 block mt-0.5">{candidate.department}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Current Stage</span>
                  <span className="text-slate-800 block mt-0.5">{candidate.currentStage}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Documents' && (
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-left flex flex-col gap-4 animate-fadeIn">
              <h4 className="text-base font-black text-[#8CC63F] uppercase tracking-wider mb-2">Document Repository</h4>
              <p className="text-sm text-slate-500 font-bold">All attachments, resume pdfs, and cover letter documents are cataloged here.</p>
            </div>
          )}

          {activeTab === 'Notes' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Type a new candidate note..."
                  className="flex-grow px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:outline-hidden focus:border-[#8CC63F] text-slate-800"
                />
                <button type="submit" className="p-2.5 bg-[#8CC63F] hover:bg-[#7ab533] text-white rounded-xl cursor-pointer">
                  <Send className="w-5 h-5" />
                </button>
              </form>

              <div className="flex flex-col gap-3">
                {candidate.timelineNotes && candidate.timelineNotes.map((note, i) => (
                  <div key={i} className="p-4 border border-slate-100 rounded-2xl text-left bg-slate-50/30">
                    <p className="text-sm font-bold text-slate-700">{note.text}</p>
                    <span className="text-xs text-slate-400 mt-1 block">{note.author} &bull; {note.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Activity' && (
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-left flex flex-col gap-4 animate-fadeIn">
              <h4 className="text-base font-black text-[#8CC63F] uppercase tracking-wider mb-2">Activity History Log</h4>
              <p className="text-sm text-slate-500 font-bold">No candidate login history logs found in the past 30 days.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
