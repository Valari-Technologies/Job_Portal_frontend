import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Send, Bot, User, CheckCircle2, 
  Building2, MapPin, Briefcase, ChevronRight, 
  RotateCcw, ArrowRight, AlertCircle, Loader2,
  ArrowLeft
} from 'lucide-react';
import { sendAICopilotMessage } from '../../../services/candidate/candidateAiCopilotService';

const INITIAL_WELCOME_MESSAGES = [
  {
    id: 'initial_welcome',
    sender: 'ai',
    text: "👋 Hi! I'm **Nexiv**, your AI Career Copilot. I can find jobs that match your skills, submit applications for you on command, and track your applications.",
    quickActions: [
      "Recommend jobs matching my skills",
      "Track my applications",
      "Jobs in Tamil Nadu"
    ]
  }
];

export default function CandidateAICopilot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState(null);
  
  // Pending confirmation state for safety
  const [pendingConfirmJob, setPendingConfirmJob] = useState(null);

  // In-memory messages state (starts fresh on login / visit / leave)
  const [messages, setMessages] = useState(INITIAL_WELCOME_MESSAGES);

  const messagesEndRef = useRef(null);

  // Clear any legacy persisted chat from previous sessions
  useEffect(() => {
    try {
      sessionStorage.removeItem('candidate_ai_copilot_messages');
      localStorage.removeItem('candidate_ai_copilot_messages');
    } catch (_) {}
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Lock body scroll on mobile when full screen copilot is open
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleSendMessage = async (customText = null, action = null, targetJobId = null) => {
    const textToSend = customText || inputMessage.trim();
    if (!textToSend && !action) return;

    if (!customText && !action) {
      setInputMessage('');
    }

    // Add user message if typed
    if (textToSend && !action) {
      const userMsg = {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: textToSend
      };
      setMessages(prev => [...prev, userMsg]);
    }

    setIsTyping(true);
    setPendingConfirmJob(null);

    try {
      const response = await sendAICopilotMessage(textToSend, action, targetJobId);
      
      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        recommendedJobs: response.recommended_jobs || null,
        applications: response.applications || null,
        actionResult: response.action_result || null,
        quickActions: response.suggested_actions || []
      };

      if (response.confirmation_required && response.target_job) {
        setPendingConfirmJob(response.target_job);
      }

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: `⚠️ ${err.message || 'Sorry, I ran into an error connecting to the server. Please try again.'}`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setApplyingJobId(null);
    }
  };

  const handleApplyClick = (job) => {
    setPendingConfirmJob(job);
  };

  const handleConfirmApply = async (job) => {
    setApplyingJobId(job.id);
    setPendingConfirmJob(null);

    // Add candidate action in chat
    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: `Apply to ${job.title} at ${job.company}`
    };
    setMessages(prev => [...prev, userMsg]);

    await handleSendMessage(
      `Apply to ${job.title} at ${job.company}`, 
      'APPLY_JOB', 
      job.id
    );
  };

  const handleClearChat = () => {
    setMessages(INITIAL_WELCOME_MESSAGES);
    setPendingConfirmJob(null);
  };

  return (
    <>
      {/* --- FLOATING TRIGGER BUTTON (FAB) --- */}
      {!isOpen && (
        <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 sm:z-50 font-sans pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3B00FF] to-indigo-700 px-4 py-3 sm:px-5 sm:py-3.5 text-white shadow-xl shadow-indigo-500/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Open Nexiv"
          >
            <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500"></span>
            </span>
            <span className="font-black text-xs sm:text-sm tracking-wide">Nexiv</span>
          </button>
        </div>
      )}

      {/* --- CHAT MODAL / FULL-SCREEN WINDOW --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 sm:inset-auto sm:bottom-6 sm:right-6 flex flex-col h-[100dvh] sm:h-[590px] w-full sm:w-[420px] bg-white sm:rounded-3xl sm:shadow-3xl sm:border sm:border-slate-200 overflow-hidden font-sans animate-scaleUp">
          
          {/* HEADER */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#3B00FF] to-indigo-800 px-4 py-3.5 sm:px-5 sm:py-4 text-white shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Mobile Back Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="sm:hidden p-1.5 -ml-1 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Back to portal"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div>
                <h3 className="text-sm font-black tracking-tight leading-tight flex items-center gap-2">
                  Nexiv
                  <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-400/30">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] font-medium text-indigo-200">
                  Automated job application & matching
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Reset conversation"
                className="rounded-lg p-1.5 text-indigo-200 hover:bg-white/10 hover:text-white transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close Copilot"
                className="rounded-lg p-1.5 text-indigo-200 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* MESSAGES BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[90%] ${isAi ? '' : 'flex-row-reverse'}`}>
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      isAi ? 'bg-[#3B00FF] text-white' : 'bg-slate-700 text-white'
                    }`}>
                      {isAi ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>

                    <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isAi 
                        ? 'bg-white text-slate-800 border border-slate-200/80 shadow-xs' 
                        : 'bg-[#3B00FF] text-white shadow-xs'
                    }`}>
                      <div className="whitespace-pre-line font-medium">
                        {msg.text.split('**').map((chunk, i) => 
                          i % 2 === 1 ? <strong key={i} className="font-black">{chunk}</strong> : chunk
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RECOMMENDED JOBS LIST CARDS */}
                  {msg.recommendedJobs && msg.recommendedJobs.length > 0 && (
                    <div className="mt-3 w-full space-y-2.5 pl-9">
                      {msg.recommendedJobs.map((job) => (
                        <div
                          key={job.id}
                          className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2 hover:border-[#3B00FF]/40 transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-xs font-black text-slate-900 leading-snug">
                                {job.title}
                              </h4>
                              <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                                <Building2 className="h-3 w-3 text-slate-400" />
                                {job.company}
                              </p>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                              {job.salary}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold flex-wrap">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3 text-slate-400" />
                              {job.work_mode}
                            </span>
                            {job.resume_required === false ? (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                ⚡ Resume Not Required
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded">
                                📄 Resume Required
                              </span>
                            )}
                          </div>

                          {/* Skill Tags */}
                          {job.skills && job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {job.skills.map((s, idx) => (
                                <span
                                  key={idx}
                                  className="rounded px-1.5 py-0.5 text-[9px] font-bold bg-indigo-50 text-[#3B00FF] border border-indigo-100"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Action Button */}
                          <div className="pt-1.5 flex items-center justify-between border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => navigate(`/candidate/jobs/${job.id}`)}
                              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
                            >
                              View details
                            </button>

                            {job.already_applied ? (
                              <span className="flex items-center gap-1 text-[11px] font-black text-emerald-600">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Applied
                              </span>
                            ) : (
                              <button
                                type="button"
                                disabled={applyingJobId === job.id}
                                onClick={() => handleApplyClick(job)}
                                className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#3B00FF] to-indigo-600 px-3 py-1.5 text-[11px] font-black text-white hover:opacity-90 transition-opacity cursor-pointer shadow-xs disabled:opacity-50"
                              >
                                {applyingJobId === job.id ? 'Applying...' : 'Apply with Nexiv'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* APPLICATION TRACKING CARDS */}
                  {msg.applications && msg.applications.length > 0 && (
                    <div className="mt-3 w-full space-y-2 pl-9">
                      {msg.applications.map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-2xs hover:border-[#3B00FF]/40 transition-all"
                        >
                          <div>
                            <h4 className="text-xs font-black text-slate-900">{app.title}</h4>
                            <p className="text-[10px] text-slate-500 font-medium">{app.company} • {app.applied_at}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[9px] font-bold text-[#3B00FF]">
                              {app.status}
                            </span>
                            {app.applied_via === 'AI_COPILOT' && (
                              <span title="Submitted by Nexiv" className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                                ✨ AI
                              </span>
                            )}
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/candidate/applications');
                        }}
                        className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#3B00FF] py-2 hover:underline"
                      >
                        <span>View full Applications Tracker</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  {/* QUICK SUGGESTIONS CHIPS */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 pl-9">
                      {msg.quickActions.map((actionText, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (actionText.toLowerCase().includes('upload resume')) {
                              navigate('/candidate/resume');
                            } else if (actionText.toLowerCase().includes('profile')) {
                              navigate('/candidate/profile');
                            } else {
                              handleSendMessage(actionText);
                            }
                          }}
                          className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-[11px] font-bold text-[#3B00FF] hover:bg-indigo-50 transition-colors cursor-pointer shadow-2xs"
                        >
                          {actionText}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div className="flex items-center gap-2 pl-2 text-slate-400">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3B00FF] text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-white border border-slate-200 px-3 py-2 text-xs">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#3B00FF]" />
                  <span className="font-bold text-slate-500">Nexiv is thinking...</span>
                </div>
              </div>
            )}

            {/* CONFIRMATION PROMPT DIALOG */}
            {pendingConfirmJob && (
              <div className="mt-2 rounded-2xl border-2 border-[#3B00FF]/30 bg-indigo-50/70 p-4 space-y-3 pl-9 animate-fadeIn">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-[#3B00FF] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black text-slate-900">
                      Confirm Job Application
                    </h5>
                    <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                      Apply to <strong className="font-bold text-slate-900">{pendingConfirmJob.title}</strong> at <strong className="font-bold text-slate-900">{pendingConfirmJob.company}</strong> using your uploaded profile resume?
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setPendingConfirmJob(null)}
                    className="flex-1 rounded-xl border border-slate-300 bg-white py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={applyingJobId === pendingConfirmJob.id}
                    onClick={() => handleConfirmApply(pendingConfirmJob)}
                    className="flex-1 rounded-xl bg-[#3B00FF] py-1.5 text-xs font-black text-white hover:bg-indigo-700 shadow-xs"
                  >
                    {applyingJobId === pendingConfirmJob.id ? 'Submitting...' : 'Yes, Submit Application'}
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT BAR */}
          <div className="border-t border-slate-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-3 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask Nexiv to find or apply for jobs..."
                value={inputMessage}
                disabled={isTyping}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#3B00FF] focus:bg-white focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                aria-label="Send message"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3B00FF] text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>
      )}

    </>
  );
}

