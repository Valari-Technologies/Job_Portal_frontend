import { useState } from 'react';
import { 
  X, FileText, Download, Briefcase, Calendar, Phone, Mail, 
  MessageSquare, CheckCircle2, Clock, MapPin, Eye, Star, 
  UserCheck, XCircle, Send, ExternalLink, Sparkles 
} from 'lucide-react';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import { 
  scheduleRecruiterInterviewService, 
  sendRecruiterApplicationMessageService 
} from '../../../services/recruiter/recruiterApplicationsService';
import ClockTimePicker from '../../shared/ClockTimePicker';

export default function ApplicationDetailsDrawer({ application, onClose, onUpdateStatus }) {
  const [internalNote, setInternalNote] = useState('');
  const [notesList, setNotesList] = useState(application?.recruiter_notes || []);
  
  // Modals state
  const [isPreviewResumeOpen, setIsPreviewResumeOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isSelectConfirmOpen, setIsSelectConfirmOpen] = useState(false);

  // Schedule Interview form state
  const [interviewType, setInterviewType] = useState('ONLINE');
  const [interviewRound, setInterviewRound] = useState('Technical Interview - Round 1');
  const [interviewDate, setInterviewDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [interviewTime, setInterviewTime] = useState('11:00 AM');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/abc-jobz-portal');
  const [interviewNotes, setInterviewNotes] = useState('Please be prepared with your coding setup and project portfolio.');
  const [isScheduling, setIsScheduling] = useState(false);

  // Message modal state
  const [messageContent, setMessageContent] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageSuccessAlert, setMessageSuccessAlert] = useState(null);

  if (!application) return null;

  const candidate = application.candidate || {};
  const job = application.job || {};
  const currentStatus = application.status || 'APPLIED';

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!internalNote.trim()) return;
    const newNoteObj = { text: internalNote.trim(), date: new Date().toLocaleString() };
    setNotesList(prev => [...prev, newNoteObj]);
    if (onUpdateStatus) {
      onUpdateStatus(application.id, currentStatus, internalNote.trim());
    }
    setInternalNote('');
  };

  const handleConfirmSchedule = async (e) => {
    e.preventDefault();
    setIsScheduling(true);
    try {
      const payload = {
        application_id: application.id,
        candidate_name: candidate.full_name,
        job_title: job.title,
        interview_type: interviewType,
        round_title: interviewRound,
        scheduled_date: interviewDate,
        scheduled_time: interviewTime,
        meeting_link: interviewType === 'ONLINE' ? meetingLink : '',
        location: interviewType === 'IN_PERSON' ? (meetingLink || 'Office Campus, Chennai') : '',
        notes: interviewNotes
      };
      await scheduleRecruiterInterviewService(application.id, payload);
      onUpdateStatus(application.id, 'INTERVIEW');
      setIsScheduleModalOpen(false);
    } catch (err) {
      console.error('Failed to schedule interview:', err);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageContent.trim()) return;
    setIsSendingMessage(true);
    try {
      await sendRecruiterApplicationMessageService(application.id, messageContent.trim());
      setMessageSuccessAlert('Message sent to candidate successfully!');
      setTimeout(() => setMessageSuccessAlert(null), 3000);
      setMessageContent('');
      setIsMessageModalOpen(false);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleConfirmSelect = () => {
    onUpdateStatus(application.id, 'SELECTED');
    setIsSelectConfirmOpen(false);
  };

  const normalizedStatus = (currentStatus === 'VIEWED' || currentStatus === 'Under Review') ? 'UNDER_REVIEW' : currentStatus;

  // Evaluation tracking steps
  const steps = [
    { key: 'APPLIED', label: 'Applied' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'SHORTLISTED', label: 'Shortlisted' },
    { key: 'INTERVIEW', label: 'Interview' },
    { key: 'SELECTED', label: 'Selected' }
  ];

  const getStepStatus = (stepKey) => {
    const order = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'];
    const currentIdx = order.indexOf(normalizedStatus);
    const stepIdx = order.indexOf(stepKey);
    if (normalizedStatus === 'REJECTED') {
      return stepKey === 'APPLIED' ? 'completed' : 'inactive';
    }
    if (currentIdx === -1) return 'inactive';
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'inactive';
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto font-sans">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-[#3B00FF] tracking-wider">
                Recruiter Evaluation Hub
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold border border-slate-200">
                {application.application_type === 'SIMPLE_LOCAL' ? 'Local Hiring' : 'Professional Recruitment'}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">{candidate.full_name || 'Candidate Details'}</h2>
            <p className="text-xs font-bold text-slate-500">
              Applied for <span className="font-extrabold text-[#3B00FF]">{job.title || application.job_title || 'SDE'}</span> at <span className="text-slate-800 font-extrabold">{job.company_name || application.company_name || 'MSD Tech'}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">

          {/* Success Message Alert */}
          {messageSuccessAlert && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{messageSuccessAlert}</span>
            </div>
          )}

          {/* Applied Job & Position Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-[#3B00FF]" />
                Applied Position
              </span>
              <ApplicationStatusBadge status={currentStatus} />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div>
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  {job.title || application.job_title || 'SDE'}
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-[#3B00FF] text-xs font-bold border border-indigo-100">
                    {job.company_name || application.company_name || 'MSD Tech'}
                  </span>
                </h4>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {job.location || 'Tambaram, Chennai, Tamil Nadu'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    {job.work_mode || 'On-site'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Applied: {application.applied_time || 'Oct 9, 2026'}
                  </span>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="text-[10px] font-bold text-slate-400 block">Offered Compensation</span>
                <span className="text-xs font-black text-slate-800">{job.salary || '₹35,000 - ₹50,000/month'}</span>
              </div>
            </div>
          </div>
          
          {/* Candidate Profile Hero Card */}
          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-3xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-start gap-4">
              {candidate.profile_photo ? (
                <img 
                  src={candidate.profile_photo} 
                  alt={candidate.full_name} 
                  className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm shrink-0" 
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-[#3B00FF] text-white font-black text-xl flex items-center justify-center border-2 border-white shadow-sm shrink-0">
                  {candidate.initials || candidate.full_name?.charAt(0) || 'C'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-black text-slate-900 truncate">{candidate.full_name || 'Candidate Name'}</h3>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                    {candidate.profile_completion || 95}% Complete
                  </span>
                </div>
                <p className="text-xs font-black text-[#3B00FF] mt-0.5">{candidate.headline || 'Senior Full-Stack Developer'}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {candidate.location || 'Chennai, Tamil Nadu'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    {candidate.email || 'candidate@tnjobz.com'}
                  </span>
                  {candidate.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {candidate.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Contact Bar (PRD Section 7.2 & 25) */}
            <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
              {candidate.phone && (
                <a
                  href={`tel:${candidate.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  Call Candidate
                </a>
              )}
              {candidate.phone && (
                <a
                  href={`https://wa.me/91${candidate.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[#25D366]" />
                  WhatsApp
                </a>
              )}
              <button
                type="button"
                onClick={() => setIsMessageModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#3B00FF] hover:bg-indigo-50/50 transition-colors shadow-2xs cursor-pointer"
              >
                <Send className="h-3.5 w-3.5 text-[#3B00FF]" />
                Send Application Message
              </button>
            </div>
          </div>

          {/* PRD Application Stage Progression (Section 24) */}
          <div className="space-y-3 bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">Application Pipeline Stage</span>
              <ApplicationStatusBadge status={currentStatus} />
            </div>

            {/* Stepper Visualizer */}
            <div className="grid grid-cols-5 gap-1 pt-2">
              {steps.map((st, idx) => {
                const state = getStepStatus(st.key);
                return (
                  <div key={st.key} className="flex flex-col items-center text-center space-y-1.5">
                    <div 
                      className={`h-2.5 w-full rounded-full transition-colors ${
                        state === 'completed' ? 'bg-[#3B00FF]' : 
                        state === 'current' ? 'bg-[#3B00FF] ring-2 ring-[#3B00FF]/30' : 
                        'bg-slate-200'
                      }`} 
                    />
                    <span className={`text-[10px] font-black leading-tight ${
                      state === 'current' ? 'text-[#3B00FF]' : 
                      state === 'completed' ? 'text-slate-800' : 
                      'text-slate-400'
                    }`}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hiring Decision & Action (தேர்வு நடவடிக்கை) */}
          <div className="space-y-3 bg-slate-50 rounded-3xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#3B00FF]" />
                Hiring Decision & Action (தேர்வு நடவடிக்கை)
              </h4>
              <span className="text-[10px] font-bold text-slate-400">Update stage & notify candidate</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {/* 1. Mark as Under Review */}
              <button
                type="button"
                onClick={() => onUpdateStatus(application.id, 'UNDER_REVIEW')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  (normalizedStatus === 'UNDER_REVIEW') 
                    ? 'bg-amber-100 border-amber-300 text-amber-950 font-black shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-800 hover:border-amber-300 hover:bg-amber-50/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-black">Under Review</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500">Examine profile & resume</p>
              </button>

              {/* 2. Shortlist */}
              <button
                type="button"
                onClick={() => onUpdateStatus(application.id, 'SHORTLISTED')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  (normalizedStatus === 'SHORTLISTED') 
                    ? 'bg-indigo-100 border-indigo-300 text-[#3B00FF] font-black shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-[#3B00FF]" />
                  <span className="text-xs font-black">Shortlist</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500">Move to qualified pool</p>
              </button>

              {/* 3. Schedule Interview */}
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(true)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  (normalizedStatus === 'INTERVIEW') 
                    ? 'bg-purple-100 border-purple-300 text-[#3B00FF] font-black shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-800 hover:border-purple-300 hover:bg-purple-50/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-[#3B00FF]" />
                  <span className="text-xs font-black">Schedule Interview</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500">Set date, time & round</p>
              </button>

              {/* 4. Select / Offer */}
              <button
                type="button"
                onClick={() => setIsSelectConfirmOpen(true)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  (normalizedStatus === 'SELECTED') 
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-black shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-black">Select Candidate</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500">Extend job offer / hire</p>
              </button>

              {/* 5. Reject */}
              <button
                type="button"
                onClick={() => onUpdateStatus(application.id, 'REJECTED')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  (normalizedStatus === 'REJECTED') 
                    ? 'bg-red-100 border-red-300 text-red-950 font-black shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-800 hover:border-red-300 hover:bg-red-50/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-xs font-black">Reject</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500">Close application</p>
              </button>
            </div>
          </div>

          {/* Resume Card with Interactive Preview (PRD Section 7.1 & 23) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Candidate Resume</h4>
              {application.resume_url && (
                <span className="text-[11px] font-black text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Attachment
                </span>
              )}
            </div>

            {application.resume_url ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-4 shadow-2xs hover:border-[#3B00FF]/40 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-black text-slate-900 truncate">
                      {application.resume_filename || 'DHANAIS RESUME (1)'}
                    </h5>
                    <p className="text-[10px] font-bold text-slate-500">PDF Document • Primary Candidate Resume</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsPreviewResumeOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 text-[#3B00FF] text-xs font-black hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview Resume
                  </button>
                  <a
                    href={application.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-center">
                <p className="text-xs font-bold text-slate-500">
                  No resume attached for this application (Simple Local Phone-based hiring flow).
                </p>
              </div>
            )}
          </div>

          {/* Candidate Skills Pill Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Candidate Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {(candidate.skills || ['Python', 'JavaScript', 'React.js', 'Django REST Framework', 'PostgreSQL', 'Docker', 'Tailwind CSS', 'Git']).map((sk, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Candidate Work Experiences */}
          {candidate.experiences && candidate.experiences.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Work Experience</h4>
              <div className="space-y-2.5">
                {candidate.experiences.map((exp, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-slate-900">{exp.roleTitle}</h5>
                      <span className="text-[10px] font-bold text-slate-500">{exp.period}</span>
                    </div>
                    <p className="text-[11px] font-bold text-[#3B00FF]">{exp.companyName}</p>
                    {exp.description && (
                      <p className="text-[11px] font-semibold text-slate-600 mt-1">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Candidate Education */}
          {candidate.education && candidate.education.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Education</h4>
              <div className="space-y-2">
                {candidate.education.map((edu, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-3.5">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-slate-900">{edu.degree}</h5>
                      <span className="text-[10px] font-bold text-slate-500">{edu.year}</span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-600">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Candidate Cover Note */}
          {application.candidate_note && (
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Candidate Remarks</h4>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3.5 text-xs font-medium text-slate-700 italic">
                "{application.candidate_note}"
              </div>
            </div>
          )}

          {/* Internal Recruiter Notes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Internal Recruiter Notes</h4>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                🔒 Confidential • Only HR can see
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              Private evaluation notes for HR team use. Candidate cannot see this.
            </p>
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea 
                rows={2}
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Add confidential evaluation notes for this candidate (e.g., salary expectation, round feedback)..."
                className="w-full rounded-2xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#3B00FF]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Save Internal Note
              </button>
            </form>

            {notesList.length > 0 && (
              <div className="space-y-2 pt-2 divide-y divide-slate-100">
                {notesList.map((n, i) => (
                  <div key={i} className="pt-2 text-xs font-medium text-slate-700">
                    <p>{n.text}</p>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{n.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">
            Job ID: <span className="font-mono text-slate-800">#{job.id || '8'}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close Evaluation
          </button>
        </div>

      </div>

      {/* ================= MODAL 1: RESUME PREVIEW MODAL ================= */}
      {isPreviewResumeOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-scaleUp">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{application.resume_filename || 'Candidate Resume'}</h3>
                  <span className="text-[10px] font-bold text-slate-500">{candidate.full_name} • Candidate Verified Document</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={application.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-black flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
                <button
                  type="button"
                  onClick={() => setIsPreviewResumeOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-100 relative">
              <iframe
                src={`${application.resume_url}#toolbar=0`}
                title="Resume Preview"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: SCHEDULE INTERVIEW MODAL ================= */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-5 animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-150 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#3B00FF] tracking-wider">Interview Setup</span>
                <h3 className="text-lg font-black text-slate-900">Schedule Candidate Interview</h3>
                <p className="text-xs font-bold text-slate-500">Candidate: {candidate.full_name} • {job.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSchedule} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Interview Round Title</label>
                <input
                  type="text"
                  value={interviewRound}
                  onChange={(e) => setInterviewRound(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#3B00FF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Interview Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {['ONLINE', 'IN_PERSON', 'PHONE'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setInterviewType(m)}
                      className={`py-2 px-3 rounded-xl border text-xs font-black transition-colors cursor-pointer ${
                        interviewType === m 
                          ? 'bg-[#3B00FF] text-white border-[#3B00FF]' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {m === 'ONLINE' ? 'Online Meet' : m === 'IN_PERSON' ? 'In-Person' : 'Phone Call'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#3B00FF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Time & AM/PM</label>
                  <ClockTimePicker
                    value={interviewTime}
                    onChange={(newTime) => setInterviewTime(newTime)}
                  />
                </div>
              </div>

              {interviewType === 'ONLINE' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Google Meet / Video Link</label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#3B00FF]"
                  />
                </div>
              )}

              {interviewType === 'IN_PERSON' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Office Location Address</label>
                  <input
                    type="text"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="e.g. Office Campus, Tambaram, Chennai"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#3B00FF]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Instructions for Candidate</label>
                <textarea
                  rows={2}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="e.g. Please be prepared with your coding setup..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#3B00FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isScheduling}
                  className="px-5 py-2 rounded-xl bg-[#3B00FF] text-white text-xs font-black hover:bg-[#3000E0] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isScheduling ? 'Scheduling...' : 'Confirm & Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: APPLICATION MESSAGE MODAL (PRD Section 25) ================= */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-scaleUp">
            <div className="flex items-start justify-between border-b border-slate-150 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#3B00FF] tracking-wider">PRD Section 25</span>
                <h3 className="text-base font-black text-slate-900">Application Message</h3>
                <p className="text-xs font-bold text-slate-500">To: {candidate.full_name} ({candidate.email})</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMessageModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Message Content</label>
                <textarea
                  rows={4}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type interview instructions, additional questions, or joining details..."
                  required
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#3B00FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingMessage}
                  className="px-5 py-2 rounded-xl bg-[#3B00FF] text-white text-xs font-black hover:bg-[#3000E0] shadow-md shadow-[#3B00FF]/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSendingMessage ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: CONFIRM SELECT / HIRE ================= */}
      {isSelectConfirmOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-sm p-6 space-y-4 text-center animate-scaleUp">
            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <UserCheck className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Select & Hire Candidate?</h3>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                This will mark <span className="font-bold text-slate-900">{candidate.full_name}</span> as <span className="text-emerald-700 font-bold">Selected</span> for the role of <span className="font-bold text-slate-900">{job.title}</span>.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSelectConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSelect}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                Yes, Select Candidate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
