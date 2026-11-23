import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CandidateLayout from '../../components/candidate/layout/CandidateLayout';
import { useCandidateUser } from '../../context/CandidateUserContext';
import {
  getCandidateResumes,
  getJobForResumeTargeting,
  startResumeAnalysis,
  acceptResumeSuggestion,
  rejectResumeSuggestion,
  undoResumeSuggestion,
  createTailoredResumeVersion,
  exportResumeVersion,
  exportResumeAsDocx,
  downloadOriginalResume,
  uploadCandidateResume,
  deleteCandidateResume,
  updateResumeVersion,
  saveTailoredResumeToBackend,
  generateResumePdfBlob
} from '../../services/candidate/candidateResumeService';
import { getCandidateOnboardingStatus } from '../../services/candidate/candidateOnboardingService';
import {
  ArrowLeft,
  Sparkles,
  Download,
  Edit3,
  RotateCcw,
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  Check,
  Upload,
  UploadCloud,
  AlertTriangle,
  ChevronDown,
  Plus,
  Trash2,
  FileType,
  FileCode,
  Target
} from 'lucide-react';

export default function CandidateResumePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobIdParam = searchParams.get('jobId');

  const { profile } = useCandidateUser();

  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mobile navigation tab ('preview' | 'ai')
  const [activeMobileTab, setActiveMobileTab] = useState('preview');

  // Resume Workspace State
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);

  // Custom Dropdown Popover State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Delete Resume Confirmation Modal State
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [isDeletingResume, setIsDeletingResume] = useState(false);

  // Export Menu State
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isExportingFormat, setIsExportingFormat] = useState(null); // 'pdf' | 'docx' | 'original'
  const exportMenuRef = useRef(null);

  // Job Targeting State
  const [targetJob, setTargetJob] = useState(null);
  const [pastedJd, setPastedJd] = useState('');

  // AI Analysis State
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);

  // Edit Suggestion State
  const [isEditingSuggestion, setIsEditingSuggestion] = useState(false);
  const [editedText, setEditedText] = useState('');

  // Upload Resume Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState(null);
  const [uploadDisplayName, setUploadDisplayName] = useState('');
  const [setAsDefaultUpload, setSetAsDefaultUpload] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // Edit Structured Resume Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setIsExportMenuOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsExportMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Open upload modal if redirected with action=upload
  useEffect(() => {
    if (searchParams.get('action') === 'upload') {
      setIsUploadModalOpen(true);
    }
  }, [searchParams]);

  // 1. Check Onboarding Guard (Allow direct access)
  useEffect(() => {
    let isMounted = true;
    async function checkGuard() {
      try {
        await getCandidateOnboardingStatus();
        if (isMounted) setIsCheckingOnboarding(false);
      } catch (err) {
        console.error('Failed to verify candidate onboarding status:', err);
        if (isMounted) setIsCheckingOnboarding(false);
      }
    }
    checkGuard();
    return () => { isMounted = false; };
  }, []);

  // 2. Fetch Initial Workspace Data
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [resumesList, jobData] = await Promise.all([
        getCandidateResumes(),
        jobIdParam ? getJobForResumeTargeting(jobIdParam) : Promise.resolve(null)
      ]);

      setResumes(resumesList || []);
      const defaultOrFirst = resumesList?.find(r => r.isDefault) || resumesList?.[0] || null;
      setCurrentResume(defaultOrFirst);

      if (jobData) {
        setTargetJob(jobData);
        setPastedJd(jobData.title || '');
      }

      if (defaultOrFirst && jobData?.id) {
        setIsAnalyzing(true);
        const initialAnalysisRes = await startResumeAnalysis({
          resumeVersionId: defaultOrFirst.versionId || defaultOrFirst.id,
          resumeData: defaultOrFirst,
          targetRole: jobData.title,
          jobId: jobData.id,
          manualJobDescription: jobData.description || null
        });

        if (initialAnalysisRes.success) {
          setAnalysis(initialAnalysisRes.analysis);
        }
        setIsAnalyzing(false);
      } else {
        setAnalysis(null);
        setIsAnalyzing(false);
      }
    } catch (err) {
      console.error('Failed to load candidate resume workspace:', err);
      setError("We couldn't load your resume data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [jobIdParam]);

  useEffect(() => {
    let isMounted = true;
    if (isCheckingOnboarding) return;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [resumesList, jobData] = await Promise.all([
          getCandidateResumes(),
          jobIdParam ? getJobForResumeTargeting(jobIdParam) : Promise.resolve(null)
        ]);

        if (!isMounted) return;
        setResumes(resumesList || []);
        const defaultOrFirst = resumesList?.find(r => r.isDefault) || resumesList?.[0] || null;
        setCurrentResume(defaultOrFirst);

        if (jobData) {
          setTargetJob(jobData);
          setPastedJd(jobData.title || '');
        }

        if (defaultOrFirst && jobData?.id) {
          setIsAnalyzing(true);
          const initialAnalysisRes = await startResumeAnalysis({
            resumeVersionId: defaultOrFirst.versionId || defaultOrFirst.id,
            resumeData: defaultOrFirst,
            targetRole: jobData.title,
            jobId: jobData.id,
            manualJobDescription: jobData.description || null
          });

          if (isMounted && initialAnalysisRes.success) {
            setAnalysis(initialAnalysisRes.analysis);
          }
          if (isMounted) setIsAnalyzing(false);
        } else {
          if (isMounted) {
            setAnalysis(null);
            setIsAnalyzing(false);
          }
        }
      } catch (err) {
        console.error('Failed to load candidate resume workspace:', err);
        if (isMounted) setError("We couldn't load your resume data. Please try again.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [isCheckingOnboarding, jobIdParam]);

  // Action: Select Resume Version (Clears old AI state & refetches specifically for selected resume)
  const handleSelectVersion = async (targetResume) => {
    if (!targetResume) return;
    setIsDropdownOpen(false);
    setCurrentResume(targetResume);

    // If no target job and no role specified, clear analysis and wait for user role input
    if (!targetJob?.id && !pastedJd.trim()) {
      setAnalysis(null);
      setIsAnalyzing(false);
      return;
    }

    // Immediately clear previous AI analysis state
    setAnalysis(null);
    setIsAnalyzing(true);

    try {
      const res = await startResumeAnalysis({
        resumeVersionId: targetResume.versionId || targetResume.id,
        resumeData: targetResume,
        targetRole: pastedJd.trim() || targetJob?.title || 'Software Developer',
        jobId: targetJob?.id || null,
        manualJobDescription: pastedJd.trim() || null
      });

      if (res.success) {
        setAnalysis(res.analysis);
        setCurrentBatch(0);
        setActiveSuggestionIndex(0);
      }
    } catch (err) {
      console.error('Error re-analyzing selected resume:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Action: Confirm Delete Resume
  const handleConfirmDeleteResume = async () => {
    if (!resumeToDelete) return;
    setIsDeletingResume(true);
    try {
      const res = await deleteCandidateResume(resumeToDelete.id || resumeToDelete.versionId);
      if (res.success) {
        const remaining = res.remainingResumes || [];
        setResumes(remaining);

        // If deleted resume was currently selected, select another remaining or empty state
        if (currentResume?.id === resumeToDelete.id || currentResume?.versionId === resumeToDelete.versionId) {
          setAnalysis(null);
          const nextSelected = remaining[0] || null;
          setCurrentResume(nextSelected);

          if (nextSelected) {
            handleSelectVersion(nextSelected);
          }
        }

        triggerToast(`Resume "${resumeToDelete.title || resumeToDelete.fileName}" deleted.`);
        setResumeToDelete(null);
      }
    } catch (err) {
      console.error('Failed to delete resume:', err);
      triggerToast(err.message || 'Failed to delete resume. Please retry.');
    } finally {
      setIsDeletingResume(false);
    }
  };

  // Action: Trigger new AI analysis
  const handleRunAnalysis = async (roleOverride) => {
    if (!currentResume) return;

    const roleToTarget = (typeof roleOverride === 'string' && roleOverride.trim())
      ? roleOverride.trim()
      : (pastedJd.trim() || targetJob?.title || '');

    if (!roleToTarget) {
      triggerToast('Please select or enter a target role to generate AI suggestions.');
      return;
    }

    if (typeof roleOverride === 'string' && roleOverride.trim()) {
      setPastedJd(roleOverride.trim());
    }

    setIsAnalyzing(true);
    try {
      const res = await startResumeAnalysis({
        resumeVersionId: currentResume.versionId || currentResume.id,
        resumeData: currentResume,
        targetRole: roleToTarget,
        jobId: targetJob?.id || null,
        manualJobDescription: (pastedJd.trim().length > 50) ? pastedJd.trim() : (targetJob?.description || null)
      });

      if (res.success) {
        setAnalysis(res.analysis);
        setCurrentBatch(0);
        setActiveSuggestionIndex(0);
        triggerToast(`AI Suggestions tailored for ${roleToTarget}!`);
      }
    } catch (err) {
      console.error('Error running AI analysis:', err);
      triggerToast('Failed to run AI analysis. Please retry.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Action: Apply Suggestion
  const handleApplySuggestion = async (suggestion) => {
    if (!analysis || !currentResume) return;
    const textToApply = isEditingSuggestion ? editedText : suggestion.proposedText;

    try {
      const res = await acceptResumeSuggestion(analysis.analysisId, suggestion.id, textToApply, analysis);
      if (res.success) {
        const updatedAnalysis = res.updatedAnalysis || analysis;
        setAnalysis(updatedAnalysis);

        const targetExpIdx = suggestion.experienceIndex ?? 0;
        const targetBulletIdx = suggestion.bulletIndex ?? 0;
        const isProject = String(suggestion.sectionId).startsWith('proj');

        let updatedSections = { ...(currentResume.sections || {}) };
        let replaced = false;

        // 0. Handle Professional Summary
        if (suggestion.sectionType === 'summary' || suggestion.sectionId === 'summary') {
          updatedSections.summary = textToApply;
          replaced = true;
        }

        // 1. Precise match by original bullet text
        if (!replaced && suggestion.originalText) {
          const origTrim = suggestion.originalText.trim().toLowerCase();
          if (Array.isArray(updatedSections.experience)) {
            updatedSections.experience = updatedSections.experience.map(exp => {
              if (!replaced && Array.isArray(exp.bullets)) {
                const bIdx = exp.bullets.findIndex(b => typeof b === 'string' && b.trim().toLowerCase() === origTrim);
                if (bIdx !== -1) {
                  const newBullets = [...exp.bullets];
                  newBullets[bIdx] = textToApply;
                  replaced = true;
                  return { ...exp, bullets: newBullets };
                }
              }
              return exp;
            });
          }

          if (!replaced && Array.isArray(updatedSections.projects)) {
            updatedSections.projects = updatedSections.projects.map(proj => {
              if (!replaced && Array.isArray(proj.bullets)) {
                const bIdx = proj.bullets.findIndex(b => typeof b === 'string' && b.trim().toLowerCase() === origTrim);
                if (bIdx !== -1) {
                  const newBullets = [...proj.bullets];
                  newBullets[bIdx] = textToApply;
                  replaced = true;
                  return { ...proj, bullets: newBullets };
                }
              }
              return proj;
            });
          }
        }

        // 2. Index-based fallback if text didn't match exactly
        if (!replaced) {
          if (isProject && Array.isArray(updatedSections.projects)) {
            updatedSections.projects = updatedSections.projects.map((proj, idx) => {
              if (proj.id === suggestion.sectionId || idx === (targetExpIdx - (updatedSections.experience?.length || 0))) {
                const newBullets = [...(proj.bullets || [])];
                newBullets[targetBulletIdx] = textToApply;
                return { ...proj, bullets: newBullets };
              }
              return proj;
            });
          } else if (Array.isArray(updatedSections.experience)) {
            updatedSections.experience = updatedSections.experience.map((exp, idx) => {
              if (exp.id === suggestion.sectionId || idx === targetExpIdx) {
                const newBullets = [...(exp.bullets || [])];
                newBullets[targetBulletIdx] = textToApply;
                return { ...exp, bullets: newBullets };
              }
              return exp;
            });
          }
        }

        const updatedResume = {
          ...currentResume,
          sections: updatedSections
        };

        setCurrentResume(updatedResume);
        setResumes(prev => prev.map(r =>
          (r.versionId === updatedResume.versionId || r.id === updatedResume.id) ? updatedResume : r
        ));

        try {
          await updateResumeVersion(currentResume.versionId || currentResume.id, { sections: updatedResume.sections });
        } catch (updateErr) {
          console.warn('Non-critical storage update notice:', updateErr);
        }

        setIsEditingSuggestion(false);

        // Auto-advance to next pending suggestion in current batch
        const batchSlice = (updatedAnalysis.suggestions || []).slice(currentBatch * 5, (currentBatch + 1) * 5);
        const nextPending = batchSlice.findIndex((s, idx) => idx > activeSuggestionIndex && s.status !== 'ACCEPTED');
        if (nextPending !== -1) {
          setActiveSuggestionIndex(nextPending);
          triggerToast(`Change applied! Showing next suggestion (${nextPending + 1} of ${batchSlice.length}).`);
        } else {
          triggerToast('Suggestion applied to Current Draft!');
        }
      } else {
        triggerToast(res.message || 'Failed to apply suggestion.');
      }
    } catch (err) {
      console.error('Error applying suggestion:', err);
      triggerToast('Failed to apply suggestion.');
    }
  };

  // Action: Apply All Pending AI Suggestions in Active Batch
  const handleApplyAllSuggestions = async () => {
    if (!analysis || !currentResume || !analysis.suggestions?.length) return;
    const batchSlice = (analysis.suggestions || []).slice(currentBatch * 5, (currentBatch + 1) * 5);
    const pending = batchSlice.filter(s => s.status !== 'ACCEPTED');
    if (pending.length === 0) {
      triggerToast('All AI suggestions in this batch have already been applied!');
      return;
    }

    let updatedResume = { ...currentResume };
    let latestAnalysis = { ...analysis };

    for (const sug of pending) {
      const res = await acceptResumeSuggestion(latestAnalysis.analysisId, sug.id, sug.proposedText, latestAnalysis);
      if (res.success) {
        latestAnalysis = res.updatedAnalysis;
        const targetExpIdx = sug.experienceIndex ?? 0;
        const targetBulletIdx = sug.bulletIndex ?? 0;
        const isProject = String(sug.sectionId).startsWith('proj');

        let updatedSections = { ...(updatedResume.sections || {}) };
        let replaced = false;

        // 0. Handle Professional Summary
        if (sug.sectionType === 'summary' || sug.sectionId === 'summary') {
          updatedSections.summary = sug.proposedText;
          replaced = true;
        }

        if (!replaced && sug.originalText) {
          const origTrim = sug.originalText.trim().toLowerCase();
          if (Array.isArray(updatedSections.experience)) {
            updatedSections.experience = updatedSections.experience.map(exp => {
              if (!replaced && Array.isArray(exp.bullets)) {
                const bIdx = exp.bullets.findIndex(b => typeof b === 'string' && b.trim().toLowerCase() === origTrim);
                if (bIdx !== -1) {
                  const newBullets = [...exp.bullets];
                  newBullets[bIdx] = sug.proposedText;
                  replaced = true;
                  return { ...exp, bullets: newBullets };
                }
              }
              return exp;
            });
          }

          if (!replaced && Array.isArray(updatedSections.projects)) {
            updatedSections.projects = updatedSections.projects.map(proj => {
              if (!replaced && Array.isArray(proj.bullets)) {
                const bIdx = proj.bullets.findIndex(b => typeof b === 'string' && b.trim().toLowerCase() === origTrim);
                if (bIdx !== -1) {
                  const newBullets = [...proj.bullets];
                  newBullets[bIdx] = sug.proposedText;
                  replaced = true;
                  return { ...proj, bullets: newBullets };
                }
              }
              return proj;
            });
          }
        }

        if (!replaced) {
          if (isProject && Array.isArray(updatedSections.projects)) {
            updatedSections.projects = updatedSections.projects.map((proj, idx) => {
              if (proj.id === sug.sectionId || idx === (targetExpIdx - (updatedSections.experience?.length || 0))) {
                const newBullets = [...(proj.bullets || [])];
                newBullets[targetBulletIdx] = sug.proposedText;
                return { ...proj, bullets: newBullets };
              }
              return proj;
            });
          } else if (Array.isArray(updatedSections.experience)) {
            updatedSections.experience = updatedSections.experience.map((exp, idx) => {
              if (exp.id === sug.sectionId || idx === targetExpIdx) {
                const newBullets = [...(exp.bullets || [])];
                newBullets[targetBulletIdx] = sug.proposedText;
                return { ...exp, bullets: newBullets };
              }
              return exp;
            });
          }
        }

        updatedResume = {
          ...updatedResume,
          sections: updatedSections
        };
      }
    }

    setAnalysis(latestAnalysis);
    setCurrentResume(updatedResume);
    setResumes(prev => prev.map(r =>
      (r.versionId === updatedResume.versionId || r.id === updatedResume.id) ? updatedResume : r
    ));
    await updateResumeVersion(updatedResume.versionId || updatedResume.id, { sections: updatedResume.sections });
    triggerToast('All AI suggestions applied to Current Draft!');
  };

  // Action: Reject Suggestion
  const handleRejectSuggestion = async (suggestionId) => {
    if (!analysis) return;
    try {
      const res = await rejectResumeSuggestion(analysis.analysisId, suggestionId, analysis);
      if (res.success) {
        setAnalysis(res.updatedAnalysis);
        triggerToast('Suggestion dismissed.');
      }
    } catch (err) {
      console.error('Error rejecting suggestion:', err);
    }
  };

  // Action: Undo Suggestion
  const handleUndoSuggestion = async (suggestionId) => {
    if (!analysis) return;
    try {
      const res = await undoResumeSuggestion(analysis.analysisId, suggestionId, analysis);
      if (res.success) {
        setAnalysis(res.updatedAnalysis);
        triggerToast('Suggestion reset.');
      }
    } catch (err) {
      console.error('Error undoing suggestion:', err);
    }
  };

  // Action: Export Handlers (PDF, DOCX, Original)
  const handleExportFormat = async (format) => {
    if (!currentResume) return;
    setIsExportingFormat(format);
    setIsExportMenuOpen(false);

    try {
      let res;
      if (format === 'original') {
        res = await downloadOriginalResume(currentResume.versionId || currentResume.id);
      } else if (format === 'docx') {
        res = await exportResumeAsDocx(currentResume.versionId || currentResume.id);
      } else {
        res = await exportResumeVersion(currentResume.versionId || currentResume.id);
      }

      if (res.success) {
        triggerToast(`Downloaded ${res.filename}`);
      }
    } catch (err) {
      console.error(`Error exporting resume as ${format}:`, err);
      triggerToast('Export failed. Please retry.');
    } finally {
      setIsExportingFormat(null);
    }
  };

  // Action: Open Edit Resume Modal
  const handleOpenEditModal = () => {
    if (!currentResume) return;
    setEditFormData(JSON.parse(JSON.stringify(currentResume)));
    setIsEditModalOpen(true);
  };

  // Action: Save Manual Resume Edits
  const handleSaveResumeEdits = async () => {
    if (!editFormData) return;
    setIsSavingEdit(true);
    try {
      const res = await updateResumeVersion(editFormData.versionId || editFormData.id, editFormData);
      if (res.success) {
        setCurrentResume(res.updatedVersion);
        setResumes(prev => prev.map(r => ((r.versionId === res.updatedVersion.versionId || r.id === res.updatedVersion.id) ? res.updatedVersion : r)));
        setIsEditModalOpen(false);
        triggerToast('Resume updated successfully!');
      }
    } catch (err) {
      console.error('Failed to save resume edits:', err);
      triggerToast('Failed to save changes.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Action: File Upload Selection / Drag Drop
  const handleFileChange = (file) => {
    if (!file) return;
    setUploadError(null);
    setSelectedUploadFile(file);
    if (!uploadDisplayName) {
      const defaultName = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      setUploadDisplayName(defaultName);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Action: Submit Upload New Resume
  const handlePerformUpload = async () => {
    if (!selectedUploadFile) {
      setUploadError('Please select a resume file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);
    setUploadError(null);

    // Immediately clear previous preview & AI analysis during upload
    setAnalysis(null);

    try {
      const progressTimer = setInterval(() => {
        setUploadProgress(prev => (prev < 85 ? prev + 25 : prev));
      }, 80);

      const candidateDisplayName = profile?.firstName
        ? `${profile.firstName} ${profile.lastName || ''}`.trim()
        : selectedUploadFile.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ').toUpperCase();

      const res = await uploadCandidateResume(selectedUploadFile, {
        displayName: uploadDisplayName,
        setAsDefault: setAsDefaultUpload,
        candidateName: candidateDisplayName,
        contactInfo: profile?.email ? `${profile.email}${profile?.phone ? ` • ${profile.phone}` : ''} • Tamil Nadu, India` : undefined
      });

      clearInterval(progressTimer);
      setUploadProgress(100);

      if (res.success) {
        // Refresh list
        const updatedList = await getCandidateResumes();
        setResumes(updatedList);
        setCurrentResume(res.resume);

        triggerToast(jobIdParam ? 'Resume uploaded! Redirecting to job application...' : 'Resume uploaded and parsed successfully!');
        setIsUploadModalOpen(false);
        setSelectedUploadFile(null);
        setUploadDisplayName('');
        setUploadProgress(0);

        if (jobIdParam) {
          setTimeout(() => {
            navigate(`/candidate/jobs/${jobIdParam}`);
          }, 1200);
        }

        // Re-analyze newly uploaded resume specifically if role or job is present
        if (targetJob?.id || pastedJd.trim()) {
          setIsAnalyzing(true);
          startResumeAnalysis({
            resumeVersionId: res.resume.versionId || res.resume.id,
            resumeData: res.resume,
            targetRole: pastedJd.trim() || targetJob?.title || 'Software Developer',
            jobId: targetJob?.id || null
          }).then(analysisRes => {
            if (analysisRes.success) setAnalysis(analysisRes.analysis);
            setIsAnalyzing(false);
          });
        } else {
          setAnalysis(null);
          setIsAnalyzing(false);
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Upload failed. Please check file format and retry.');
    } finally {
      setIsUploading(false);
    }
  };

  // Action: Explicit Apply using tailored resume version
  const handleApplyWithTailoredResume = async () => {
    if (!currentResume) return;

    try {
      let resumeIdToUse = currentResume.id || currentResume.versionId;

      triggerToast('Generating tailored resume for your application...');
      try {
        const acceptedSuggestions = (analysis?.suggestions || []).filter(s => s.status === 'ACCEPTED');
        const replacements = acceptedSuggestions.map(s => ({
          original_text: s.originalText || '',
          new_text: s.proposedText || ''
        }));

        const rawRole = (pastedJd.trim() || analysis?.targetRole || analysis?.jobTitle || targetJob?.title || '').trim();
        const cleanRole = rawRole.slice(0, 30).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        const cleanBase = (currentResume.fileName || currentResume.title || 'Resume.pdf').replace(/^(Tailored_|Job_)+/gi, '');
        const fileName = cleanRole ? `${cleanRole}_${cleanBase}` : `Tailored_${cleanBase}`;

        const savedRes = await saveTailoredResumeToBackend(
          null,
          fileName,
          targetJob?.id || jobIdParam,
          replacements,
          currentResume.id || currentResume.versionId,
          rawRole
        );

        if (savedRes && savedRes.resume) {
          resumeIdToUse = savedRes.resume.id;
          triggerToast('Tailored resume created & saved with your improvements!');

          const rawPath = savedRes.resume.file_path || '';
          const fullUrl = rawPath ? (
            rawPath.startsWith('http') || rawPath.startsWith('data:')
              ? rawPath
              : `${API_BASE_URL}${rawPath.startsWith('/') ? '' : '/'}${rawPath}`
          ) : null;

          const tailoredRecord = {
            id: String(savedRes.resume.id),
            versionId: String(savedRes.resume.id),
            title: savedRes.resume.file_name,
            fileName: savedRes.resume.file_name,
            isBase: false,
            isDefault: true,
            updatedAt: savedRes.resume.created_at || new Date().toISOString(),
            fileDataUrl: fullUrl,
            fileUrl: fullUrl,
            sections: currentResume.sections
          };

          setResumes(prev => [tailoredRecord, ...prev.filter(r => r.id !== tailoredRecord.id).map(r => ({ ...r, isDefault: false }))]);
          setCurrentResume(tailoredRecord);
          sessionStorage.setItem('active_apply_resume_id', String(savedRes.resume.id));
        }
      } catch (saveTailoredErr) {
        console.warn('Could not auto-save tailored PDF to backend, continuing with active resume:', saveTailoredErr);
      }

      sessionStorage.setItem('active_apply_resume_id', String(resumeIdToUse));

      if (jobIdParam) {
        triggerToast('Active tailored resume selected! Opening application...');
        navigate(`/candidate/jobs/${jobIdParam}/apply?resumeId=${resumeIdToUse}`);
      } else if (targetJob?.id) {
        triggerToast('Active tailored resume selected! Opening application...');
        navigate(`/candidate/jobs/${targetJob.id}/apply?resumeId=${resumeIdToUse}`);
      } else {
        triggerToast('Tailored resume ready! Choose a job to apply.');
        navigate(`/candidate/jobs?resumeId=${resumeIdToUse}`);
      }
    } catch (err) {
      console.error('Error applying with resume:', err);
      triggerToast('Failed to select resume for application.');
    }
  };

  if (isCheckingOnboarding) {
    return (
      <CandidateLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 font-sans">
          <div className="h-12 w-12 rounded-full border-4 border-[#3B00FF] border-t-transparent animate-spin" />
          <span className="text-xs font-black text-slate-500">Loading your resume workspace...</span>
        </div>
      </CandidateLayout>
    );
  }

  const firstName = profile?.firstName || 'Candidate';
  const userAvatar = profile?.avatarUrl;

  const BATCH_SIZE = 5;
  const allSuggestions = analysis?.suggestions || [];
  const totalBatches = Math.max(1, Math.ceil(allSuggestions.length / BATCH_SIZE));
  const safeBatch = Math.min(currentBatch, totalBatches - 1);
  const currentBatchSuggestions = allSuggestions.slice(safeBatch * BATCH_SIZE, (safeBatch + 1) * BATCH_SIZE);
  const currentSuggestion = currentBatchSuggestions[activeSuggestionIndex] || currentBatchSuggestions[0] || null;

  const handleCycleNextBatch = () => {
    if (!allSuggestions || allSuggestions.length <= BATCH_SIZE) {
      handleRunAnalysis();
      return;
    }
    const nextBatch = (safeBatch + 1) % totalBatches;
    setCurrentBatch(nextBatch);
    setActiveSuggestionIndex(0);
    setIsEditingSuggestion(false);
    const startNum = nextBatch * BATCH_SIZE + 1;
    const endNum = Math.min((nextBatch + 1) * BATCH_SIZE, allSuggestions.length);
    triggerToast(`Loaded next 5 suggestions (Batch ${nextBatch + 1} of ${totalBatches}: Bullets ${startNum}–${endNum})`);
  };

  return (
    <CandidateLayout>
      <div className="space-y-6 sm:space-y-8 animate-fadeIn font-sans pb-12">

        {/* --- TOAST ALERT --- */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 animate-slideDown">
            <div className="bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* --- MOBILE COMPACT HEADER (sm:hidden) --- */}
        <div className="sm:hidden flex items-center justify-between py-2 border-b border-slate-150">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/candidate/dashboard')}
              aria-label="Go back to dashboard"
              className="p-1.5 text-slate-700 hover:text-[#3B00FF] rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5 stroke-[2.5]" />
            </button>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Resume & Portfolio
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate('/candidate/profile')}
            className="h-9 w-9 rounded-full bg-white border border-black overflow-hidden flex items-center justify-center shrink-0 cursor-pointer"
          >
            {userAvatar ? (
              <img src={userAvatar} alt={firstName} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-black text-slate-900">{firstName.charAt(0)}</span>
            )}
          </button>
        </div>

        {/* --- DESKTOP TITLE HEADER (hidden sm:block) --- */}
        <div className="hidden sm:block space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Resume & Portfolio
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500">
            Upload and optimize your resume to get matched with premium job listings.
          </p>
        </div>

        {/* --- MOBILE SEGMENTED CONTROL TABS (sm:hidden) --- */}
        <div className="sm:hidden flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveMobileTab('preview')}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
              activeMobileTab === 'preview'
                ? 'bg-white text-[#3B00FF] shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Current Draft
          </button>

          <button
            type="button"
            onClick={() => setActiveMobileTab('ai')}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMobileTab === 'ai'
                ? 'bg-[#3B00FF] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Co-pilot</span>
          </button>
        </div>

        {/* --- MAIN WORKSPACE GRID --- */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 h-96 bg-slate-200 animate-pulse rounded-2xl" />
            <div className="lg:col-span-5 h-96 bg-slate-200 animate-pulse rounded-2xl" />
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-white border border-red-200 shadow-sm text-center space-y-4 max-w-md mx-auto my-8">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-900">We couldn't load your resume workspace</h3>
            <p className="text-xs font-semibold text-slate-500">{error}</p>
            <button
              type="button"
              onClick={loadInitialData}
              className="px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-[#3000E0] mx-auto cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* ================= LEFT COLUMN: CURRENT DRAFT PREVIEW & TOOLBAR ================= */}
            <div className={`lg:col-span-7 space-y-4 ${activeMobileTab === 'preview' ? 'block' : 'hidden sm:block'}`}>
              
              {/* CURRENT DRAFT TOOLBAR (Selector, Upload, Export Menu, Edit) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#3B00FF]" />
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Current Draft
                  </h2>
                </div>

                {/* Toolbar Buttons Container */}
                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* 1. CUSTOM ACCESSIBLE RESUME DROPDOWN POPOVER WITH DELETE BUTTONS */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      disabled={resumes.length === 0}
                      className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 hover:border-slate-300 focus:outline-none focus:border-[#3B00FF] transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-2xs max-w-[220px] truncate"
                      aria-label="Select Resume Version"
                    >
                      <span className="truncate">{currentResume?.title || currentResume?.fileName || 'Select Resume'}</span>
                      <ChevronDown className={`h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Popover Menu */}
                    {isDropdownOpen && (
                      <div className="absolute left-0 mt-1.5 w-72 max-h-64 overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-xl z-40 p-1.5 space-y-1 animate-scaleUp">
                        {resumes.map((r) => {
                          const isSelected = currentResume?.id === r.id || currentResume?.versionId === r.versionId;
                          return (
                            <div
                              key={r.id || r.versionId}
                              onClick={() => handleSelectVersion(r)}
                              className={`flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-colors group ${
                                isSelected ? 'bg-indigo-50 text-[#3B00FF] font-black' : 'hover:bg-slate-50 text-slate-700 font-bold'
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <p className="truncate text-xs">{r.title || r.fileName}</p>
                                <p className="text-[10px] text-slate-400 font-normal truncate">
                                  {r.isDefault ? 'Default Resume' : 'Uploaded Version'}
                                </p>
                              </div>

                              {/* Delete Resume Action Icon */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsDropdownOpen(false);
                                  setResumeToDelete(r);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                                title={`Delete ${r.title}`}
                                aria-label={`Delete resume ${r.title}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 2. Upload New Resume Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setUploadError(null);
                      setSelectedUploadFile(null);
                      setIsUploadModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Upload a new resume document"
                  >
                    <Upload className="h-3.5 w-3.5 text-slate-700" />
                    <span>Upload New Resume</span>
                  </button>

                  {/* 3. EXPORT DROPDOWN MENU (Download Original, PDF, DOCX) */}
                  <div className="relative" ref={exportMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                      disabled={!currentResume || !!isExportingFormat}
                      className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#3B00FF] text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Export resume file options"
                    >
                      {isExportingFormat ? (
                        <div className="h-3.5 w-3.5 border-2 border-[#3B00FF] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download className="h-3.5 w-3.5" />
                      )}
                      <span>{isExportingFormat ? 'Preparing...' : 'Export'}</span>
                      <ChevronDown className={`h-3 w-3 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Export Format Popover Options */}
                    {isExportMenuOpen && (
                      <div className="absolute right-0 mt-1.5 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl z-40 p-1.5 space-y-1 animate-scaleUp">
                        <button
                          type="button"
                          onClick={() => handleExportFormat('original')}
                          className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <FileCode className="h-4 w-4 text-slate-500" />
                          <span>Download Original</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleExportFormat('pdf')}
                          className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-indigo-50 hover:text-[#3B00FF] transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <Download className="h-4 w-4 text-[#3B00FF]" />
                          <span>Download as PDF (.pdf)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleExportFormat('docx')}
                          className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <FileType className="h-4 w-4 text-blue-600" />
                          <span>Download as Word (.docx)</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 4. Edit Resume Icon Button */}
                  <button
                    type="button"
                    onClick={handleOpenEditModal}
                    disabled={!currentResume}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                    title="Edit structured resume details"
                    aria-label="Edit Resume"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* DOCUMENT PREVIEW SHEET (CLEAN PDF VIEWER) */}
              {!currentResume ? (
                <div className="bg-white shadow-md border border-slate-200/80 p-12 rounded-2xl text-center space-y-4 max-w-2xl mx-auto">
                  <FileText className="h-12 w-12 text-slate-300 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900">No resume uploaded yet.</h3>
                    <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
                      Upload your resume to begin optimizing it for jobs and applying with tailored versions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-black hover:bg-[#3000D6] inline-flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Resume</span>
                  </button>
                </div>
              ) : (
                <div className="bg-white shadow-md border border-slate-200/80 rounded-2xl overflow-hidden max-w-2xl mx-auto space-y-0">
                  {/* Document Header Bar */}
                  <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-800">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <FileText className="h-4 w-4 text-[#3B00FF] shrink-0" />
                      <span className="truncate">{currentResume.title || currentResume.fileName}</span>
                      {currentResume.isDefault && (
                        <span className="bg-indigo-100 text-[#3B00FF] text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                          Original Uploaded Resume
                        </span>
                      )}
                    </div>
                    {Boolean(currentResume.fileUrl || currentResume.fileDataUrl) && (
                      <a
                        href={currentResume.fileUrl || currentResume.fileDataUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3B00FF] hover:underline font-black text-xs shrink-0 flex items-center gap-1"
                      >
                        <span>Open Original PDF</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>

                  {/* Embedded PDF/Image Document Viewer */}
                  {((currentResume.fileUrl || currentResume.fileDataUrl || '').match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i) || (currentResume.fileName || '').match(/\.(jpeg|jpg|gif|png|webp)$/i)) ? (
                    <div className="w-full bg-white relative overflow-hidden flex justify-center">
                      <img 
                        src={currentResume.fileUrl || currentResume.fileDataUrl} 
                        alt={currentResume.title || currentResume.fileName || 'Resume'}
                        className="w-full h-auto object-contain block"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[1/1.414] sm:aspect-auto sm:h-[820px] bg-white relative overflow-hidden">
                      <object
                        data={`${currentResume.fileUrl || currentResume.fileDataUrl || ''}#toolbar=0&navpanes=0&view=FitH`}
                        type="application/pdf"
                        className="w-full h-full border-0 block"
                      >
                        <iframe
                          src={`${currentResume.fileUrl || currentResume.fileDataUrl || ''}#toolbar=0&navpanes=0&view=FitH`}
                          title={currentResume.title || currentResume.fileName}
                          className="w-full h-full border-0 block"
                        >
                          <div className="p-8 text-center space-y-3">
                            <p className="text-xs text-slate-600 font-semibold">Your browser cannot render the PDF preview directly.</p>
                            <a
                              href={currentResume.fileUrl || currentResume.fileDataUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-5 py-2.5 rounded-xl bg-[#3B00FF] text-white text-xs font-black"
                            >
                              Open PDF Document
                            </a>
                          </div>
                        </iframe>
                      </object>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* ================= RIGHT COLUMN: AI RESUME CO-PILOT ================= */}
            <div className={`lg:col-span-5 space-y-5 ${activeMobileTab === 'ai' ? 'block' : 'hidden sm:block'}`}>
              
              {/* TOP PURPLE BANNER: AI Resume (make it Easy) */}
              <div 
                onClick={() => {
                  if (!analysis && !pastedJd.trim() && !targetJob?.title) {
                    triggerToast('Please select or specify a target role below.');
                  } else {
                    handleRunAnalysis();
                  }
                }}
                className="bg-gradient-to-r from-[#3B00FF] to-[#2E00C7] text-white p-4 sm:p-4.5 rounded-2xl flex items-center justify-between shadow-md cursor-pointer hover:shadow-lg transition-all group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-white" />
                    <h3 className="font-black text-sm sm:text-base tracking-tight">
                      AI Resume (make it Easy)
                    </h3>
                  </div>
                  <p className="text-xs text-white/80 font-medium">
                    Optimize entire document for impact
                  </p>
                </div>

                <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* AI CO-PILOT CARD */}
              <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl space-y-5 shadow-2xs">
                
                {/* Card Header: AI Co-pilot + Context Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-[#3B00FF]" />
                    <h3 className="text-base font-black text-slate-900">
                      AI Co-pilot
                    </h3>
                  </div>

                  {analysis ? (
                    <div className="flex items-center gap-1.5">
                      <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-3 py-1 rounded-full border border-indigo-100 truncate max-w-[180px]">
                        Target: {analysis.jobTitle || targetJob?.title || 'Target Role'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAnalysis(null)}
                        className="text-[10px] font-extrabold text-[#3B00FF] hover:underline px-1 py-0.5 cursor-pointer"
                        title="Change target role"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold px-3 py-1 rounded-full border border-slate-200">
                      Specify Role First
                    </span>
                  )}
                </div>

                {/* MATCH SCORE BOX */}
                {isAnalyzing ? (
                  <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-2xl flex items-center justify-center gap-3 text-xs font-extrabold text-[#3B00FF]">
                    <div className="h-5 w-5 border-2 border-[#3B00FF] border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing target resume against job description...</span>
                  </div>
                ) : !currentResume ? (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-4">
                    <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
                      <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-200"
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-slate-400"
                          strokeDasharray="0, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-sm font-black text-slate-400">
                        --
                      </span>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          MATCH SCORE
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black">
                          No Resume
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500 leading-snug">
                        Upload a resume to begin AI match score analysis against target job roles.
                      </p>
                    </div>
                  </div>
                ) : !analysis ? (
                  /* SPECIFY TARGET ROLE PANEL (When no role has been specified yet) */
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 border border-indigo-150 space-y-4 shadow-2xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-indigo-900">
                        <div className="p-1.5 rounded-lg bg-[#3B00FF]/10 text-[#3B00FF]">
                          <Target className="h-4.5 w-4.5" />
                        </div>
                        <h4 className="text-sm font-black text-slate-900">Specify Target Role to Generate AI Suggestions</h4>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed pl-8">
                        AI tailors your resume bullets specifically for your desired job title and ATS screening. Select a common role or type your custom role below to begin:
                      </p>
                    </div>

                    {/* Quick Popular Roles */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                        Quick Select Target Role:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Software Developer',
                          'Frontend Developer',
                          'Full Stack Developer',
                          'Python Developer',
                          'React Developer',
                          'Java Developer',
                          'Backend Developer'
                        ].map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => {
                              setPastedJd(role);
                              handleRunAnalysis(role);
                            }}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 hover:border-[#3B00FF] transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                          >
                            + {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Role / Job Description Input */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                        Or Type Target Role / Paste Job Description:
                      </span>
                      <div className="relative">
                        <textarea
                          rows={2}
                          placeholder="e.g. Software Developer, Frontend Developer, or paste Job Description..."
                          value={pastedJd}
                          onChange={(e) => setPastedJd(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && pastedJd.trim()) {
                              e.preventDefault();
                              handleRunAnalysis(pastedJd.trim());
                            }
                          }}
                          className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#3B00FF] focus:ring-1 focus:ring-[#3B00FF] resize-none bg-white placeholder:text-slate-400"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRunAnalysis(pastedJd.trim())}
                        disabled={!pastedJd.trim() || isAnalyzing}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#3B00FF] hover:bg-[#3000D6] text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md active:scale-98"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Generate AI Suggestions</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-4">
                    {/* Score SVG Circle Indicator */}
                    <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
                      <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-indigo-200"
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#3B00FF]"
                          strokeDasharray={`${analysis?.score || 0}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-base font-black text-slate-900">
                        {analysis?.score || 0}
                      </span>
                    </div>

                    {/* Score Label & Text */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          MATCH SCORE
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                          {analysis?.scoreLabel || 'Strong'}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500 leading-snug">
                        {analysis?.scoreFeedback || `Suggestions tailored to ${analysis.jobTitle || 'target role'}.`}
                      </p>
                    </div>
                  </div>
                )}

                {/* ACTIVE SUGGESTIONS & TARGET ROLE (Shown when analysis is active) */}
                {analysis && (
                  <>
                    <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-indigo-900/70 uppercase tracking-wider block">
                        SUGGESTION {currentBatchSuggestions.length ? activeSuggestionIndex + 1 : 0} OF {currentBatchSuggestions.length}
                      </span>
                      {totalBatches > 1 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-indigo-100/90 text-[#3B00FF] text-[9px] font-black uppercase tracking-wider">
                          Batch {safeBatch + 1}/{totalBatches}
                        </span>
                      )}
                    </div>

                    {currentBatchSuggestions.length > 1 && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSuggestionIndex(prev => Math.max(0, prev - 1));
                            setIsEditingSuggestion(false);
                          }}
                          disabled={activeSuggestionIndex === 0}
                          className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-[11px] font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                          title="Previous suggestion in this batch"
                        >
                          ← Prev
                        </button>
                        <span className="text-[10px] font-bold text-slate-400">
                          {activeSuggestionIndex + 1}/{currentBatchSuggestions.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSuggestionIndex(prev => Math.min(currentBatchSuggestions.length - 1, prev + 1));
                            setIsEditingSuggestion(false);
                          }}
                          disabled={activeSuggestionIndex >= currentBatchSuggestions.length - 1}
                          className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-[11px] font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                          title="Next suggestion in this batch"
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </div>

                  {!currentResume ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs font-bold text-slate-500">
                      Upload your resume to view AI optimization suggestions.
                    </div>
                  ) : currentSuggestion ? (
                    <div className="border border-indigo-200 bg-indigo-50/30 p-4 rounded-2xl space-y-3 font-sans shadow-xs">
                      
                      {/* Section Badge & Metric Chip */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-indigo-150/70">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            currentSuggestion.sectionType === 'summary'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : currentSuggestion.sectionType === 'project'
                              ? 'bg-teal-100 text-teal-800 border-teal-200'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
                            {currentSuggestion.sectionTitle || (currentSuggestion.sectionType === 'summary' ? 'Professional Summary' : 'Experience')}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            #{safeBatch * BATCH_SIZE + activeSuggestionIndex + 1} of {allSuggestions.length}
                          </span>
                        </div>

                        {currentSuggestion.metric && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black">
                            📈 {currentSuggestion.metric}
                          </span>
                        )}
                      </div>

                      {/* Original Text */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-500 block">
                          Original text from your resume:
                        </span>
                        <p className="text-xs font-medium text-slate-700 italic bg-white/90 p-2.5 rounded-xl border border-slate-200/80 leading-relaxed">
                          "{currentSuggestion.originalText}"
                        </p>
                      </div>

                      {/* Suggested Improvement */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[#3B00FF]">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span className="text-xs font-black">AI Tailored Improvement:</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {currentSuggestion.metric ? (
                              <>
                                <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-150">
                                  ✓ Quantified Metrics
                                </span>
                                <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Add only if true
                                </span>
                              </>
                            ) : (
                              <span className="text-[10px] text-indigo-700 font-extrabold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-150">
                                ✓ Full-Length ATS Rewrite
                              </span>
                            )}
                          </div>
                        </div>

                        {isEditingSuggestion ? (
                          <textarea
                            rows={3}
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-[#3B00FF] text-xs font-bold text-slate-900 focus:outline-none bg-white shadow-inner"
                          />
                        ) : (
                          <div className="bg-indigo-50/90 p-3 rounded-xl border border-indigo-200 text-xs font-bold text-slate-800 leading-snug">
                            "{currentSuggestion.proposedText}"
                          </div>
                        )}

                        {currentSuggestion.reason && (
                          <p className="text-[10px] font-medium text-slate-500 italic pt-0.5">
                            💡 {currentSuggestion.reason}
                          </p>
                        )}
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center gap-2 pt-2">
                        {currentSuggestion.status === 'ACCEPTED' ? (
                          <div className="flex items-center justify-between w-full bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                              <Check className="h-4 w-4" /> Applied to Live Canvas
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleUndoSuggestion(currentSuggestion.id)}
                                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                              >
                                Undo
                              </button>
                              {currentBatchSuggestions.length > 1 && activeSuggestionIndex < currentBatchSuggestions.length - 1 ? (
                                <button
                                  type="button"
                                  onClick={() => setActiveSuggestionIndex(prev => prev + 1)}
                                  className="px-3 py-1 rounded-lg bg-[#3B00FF] text-white text-xs font-bold hover:bg-[#3000D6] cursor-pointer shadow-xs"
                                >
                                  Next Suggestion →
                                </button>
                              ) : totalBatches > 1 ? (
                                <button
                                  type="button"
                                  onClick={handleCycleNextBatch}
                                  className="px-3 py-1 rounded-lg bg-[#3B00FF] text-white text-xs font-bold hover:bg-[#3000D6] cursor-pointer shadow-xs"
                                >
                                  Next 5 Suggestions →
                                </button>
                              ) : null}
                            </div>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApplySuggestion(currentSuggestion)}
                              className="flex-1 py-2.5 rounded-xl bg-[#3B00FF] hover:bg-[#3000D6] text-white text-xs font-black transition-colors shadow-sm cursor-pointer text-center"
                            >
                              {isEditingSuggestion ? 'Save & Apply' : 'Apply Change'}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingSuggestion(!isEditingSuggestion);
                                setEditedText(currentSuggestion.proposedText);
                              }}
                              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                              title="Edit proposal before applying"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={handleCycleNextBatch}
                              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer group relative"
                              title={totalBatches > 1 ? `Load next 5 suggestions (Batch ${((safeBatch + 1) % totalBatches) + 1} of ${totalBatches})` : "Next suggestion / cycle"}
                            >
                              <RotateCcw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-300" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRejectSuggestion(currentSuggestion.id)}
                              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                              title="Dismiss suggestion"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Quick Apply All Button */}
                      {currentBatchSuggestions && currentBatchSuggestions.some(s => s.status !== 'ACCEPTED') && (
                        <div className="pt-1 border-t border-indigo-100/60">
                          <button
                            type="button"
                            onClick={handleApplyAllSuggestions}
                            className="w-full py-1.5 text-center text-[11px] font-bold text-[#3B00FF] hover:text-[#2E00C7] hover:underline cursor-pointer"
                          >
                            ⚡ Apply all {currentBatchSuggestions.filter(s => s.status !== 'ACCEPTED').length} pending suggestions in this batch
                          </button>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs font-bold text-slate-500">
                      No active suggestions right now.
                    </div>
                  )}

                </div>

                    {/* TARGET ROLE / JOB DESCRIPTION TARGETING */}
                    <div className="space-y-2 pt-2 border-t border-slate-150">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          TARGET ROLE / JOB DESCRIPTION
                        </span>
                        {analysis?.jobTitle && (
                          <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                            Active: {analysis.jobTitle}
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <textarea
                          rows={2}
                          disabled={!currentResume}
                          placeholder="Enter new role or paste Job Description to re-target..."
                          value={pastedJd}
                          onChange={(e) => setPastedJd(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && pastedJd.trim()) {
                              e.preventDefault();
                              handleRunAnalysis(pastedJd.trim());
                            }
                          }}
                          className="w-full p-3 pr-10 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#3B00FF] resize-none bg-slate-50/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />

                        <button
                          type="button"
                          onClick={() => handleRunAnalysis(pastedJd.trim())}
                          disabled={isAnalyzing || !currentResume || !pastedJd.trim()}
                          className="absolute right-2.5 bottom-3.5 p-1.5 rounded-lg bg-[#3B00FF] text-white hover:bg-[#3000D6] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Analyze Job Description"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Missing Keywords Chips */}
                      {analysis?.missingKeywords && analysis.missingKeywords.length > 0 && (
                        <div className="flex items-center gap-2 pt-1 text-xs">
                          <span className="text-slate-400 font-extrabold text-[11px]">Missing:</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {analysis.missingKeywords.map((kw, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[10px] font-extrabold border border-rose-150"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* FINAL ACTION BUTTON */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => currentResume ? handleApplyWithTailoredResume() : setIsUploadModalOpen(true)}
                    className="w-full py-3 rounded-xl bg-[#3B00FF] hover:bg-[#3000D6] text-white text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    <span>{currentResume ? 'Use This Resume to Apply' : 'Upload Resume to Apply'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================= MODAL 1: DELETE RESUME CONFIRMATION ================= */}
        {resumeToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-150 animate-scaleUp">
              
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-3 bg-rose-50 rounded-2xl">
                  <Trash2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Delete resume?</h3>
                  <p className="text-xs font-semibold text-slate-500">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-xs font-medium text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-150">
                <strong className="font-extrabold text-slate-900">"{resumeToDelete.title || resumeToDelete.fileName}"</strong> and its editable versions will be removed from your resume library. Applications already submitted with this resume will retain their submitted copy.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResumeToDelete(null)}
                  disabled={isDeletingResume}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDeleteResume}
                  disabled={isDeletingResume}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isDeletingResume && <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{isDeletingResume ? 'Deleting...' : 'Delete Resume'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================= MODAL 2: UPLOAD NEW RESUME ================= */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-150 animate-scaleUp">
              
              <div className="flex items-center justify-between border-b border-slate-150 pb-4">
                <div className="flex items-center gap-2">
                  <UploadCloud className="h-6 w-6 text-[#3B00FF]" />
                  <h3 className="text-lg font-black text-slate-900">Upload New Resume</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-[#3B00FF] bg-indigo-50/50 scale-[1.01]'
                    : selectedUploadFile
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  accept=".pdf,.docx,.doc"
                  className="hidden"
                />

                {selectedUploadFile ? (
                  <div className="space-y-2">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                    <p className="text-sm font-black text-slate-900">{selectedUploadFile.name}</p>
                    <p className="text-xs font-semibold text-slate-500">
                      {(selectedUploadFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for parsing
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUploadFile(null);
                      }}
                      className="text-xs text-[#3B00FF] font-extrabold hover:underline"
                    >
                      Choose a different file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <UploadCloud className="h-10 w-10 text-indigo-500 mx-auto" />
                    <div>
                      <p className="text-sm font-black text-slate-900">Drag & drop your resume file here</p>
                      <p className="text-xs font-semibold text-slate-500">or click to browse local files</p>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">Supported formats: PDF, DOCX (Max 5MB)</p>
                  </div>
                )}
              </div>

              {/* Optional Display Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 block">
                  Resume Title / Version Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Designer Base Resume 2026"
                  value={uploadDisplayName}
                  onChange={(e) => setUploadDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF] bg-white"
                />
              </div>

              {/* Set as Default Checkbox */}
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="setAsDefault"
                  checked={setAsDefaultUpload}
                  onChange={(e) => setSetAsDefaultUpload(e.target.checked)}
                  className="h-4 w-4 rounded-md border-slate-300 text-[#3B00FF] focus:ring-[#3B00FF] cursor-pointer"
                />
                <label htmlFor="setAsDefault" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Set as current default active resume
                </label>
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Parsing resume content...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-[#3B00FF] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {uploadError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-150 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={isUploading}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handlePerformUpload}
                  disabled={!selectedUploadFile || isUploading}
                  className="px-5 py-2.5 rounded-xl bg-[#3B00FF] hover:bg-[#3000D6] text-white text-xs font-black cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading && <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{isUploading ? 'Uploading...' : 'Upload Resume'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================= MODAL 3: STRUCTURED RESUME EDITOR ================= */}
        {isEditModalOpen && editFormData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-150 my-8">
              
              <div className="flex items-center justify-between border-b border-slate-150 pb-4">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-6 w-6 text-[#3B00FF]" />
                  <h3 className="text-lg font-black text-slate-900">Edit Resume Content</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                
                {/* Candidate Name & Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">Full Name</label>
                    <input
                      type="text"
                      value={editFormData.candidateName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, candidateName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700 block">Version Label</label>
                    <input
                      type="text"
                      value={editFormData.title || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 block">Contact Info Header</label>
                  <input
                    type="text"
                    value={editFormData.contactInfo || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, contactInfo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                  />
                </div>

                {/* Experience Bullets */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black text-[#3B00FF] uppercase">Experience Bullets</h4>

                  {editFormData.sections?.experience?.map((exp, expIdx) => (
                    <div key={exp.id || expIdx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>{exp.roleTitle} at {exp.companyName}</span>
                        <span className="text-slate-500">{exp.period}</span>
                      </div>

                      {exp.bullets?.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={b}
                            onChange={(e) => {
                              const updatedExp = [...editFormData.sections.experience];
                              updatedExp[expIdx].bullets[bIdx] = e.target.value;
                              setEditFormData({
                                ...editFormData,
                                sections: { ...editFormData.sections, experience: updatedExp }
                              });
                            }}
                            className="flex-1 p-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#3B00FF] bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedExp = [...editFormData.sections.experience];
                              updatedExp[expIdx].bullets.splice(bIdx, 1);
                              setEditFormData({
                                ...editFormData,
                                sections: { ...editFormData.sections, experience: updatedExp }
                              });
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer mt-1"
                            title="Remove bullet"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          const updatedExp = [...editFormData.sections.experience];
                          updatedExp[expIdx].bullets.push('New accomplishment metric or key initiative.');
                          setEditFormData({
                            ...editFormData,
                            sections: { ...editFormData.sections, experience: updatedExp }
                          });
                        }}
                        className="text-xs font-bold text-[#3B00FF] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Bullet Point
                      </button>
                    </div>
                  ))}
                </div>

                {/* Core Competencies */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black text-[#3B00FF] uppercase">Core Competencies</h4>

                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Design</label>
                      <input
                        type="text"
                        value={editFormData.sections?.competencies?.design || ''}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          sections: {
                            ...editFormData.sections,
                            competencies: { ...editFormData.sections.competencies, design: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Tools</label>
                      <input
                        type="text"
                        value={editFormData.sections?.competencies?.tools || ''}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          sections: {
                            ...editFormData.sections,
                            competencies: { ...editFormData.sections.competencies, tools: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">Research</label>
                      <input
                        type="text"
                        value={editFormData.sections?.competencies?.research || ''}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          sections: {
                            ...editFormData.sections,
                            competencies: { ...editFormData.sections.competencies, research: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#3B00FF]"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-150 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveResumeEdits}
                  disabled={isSavingEdit}
                  className="px-5 py-2.5 rounded-xl bg-[#3B00FF] hover:bg-[#3000D6] text-white text-xs font-black cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isSavingEdit && <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{isSavingEdit ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </CandidateLayout>
  );
}
