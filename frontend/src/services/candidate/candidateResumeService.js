/**
 * Candidate Resume Service
 * 
 * Manages Candidate resumes, Resume Versions, AI Job Description analysis,
 * match score calculations, keyword extraction, suggestion acceptance/editing,
 * tailored version creation, PDF export, and job application submission.
 * 
 * Django DRF API Boundaries:
 * - GET /api/v1/candidates/resumes/ -> List candidate's base resumes & versions
 * - GET /api/v1/candidates/resumes/{id}/ -> Fetch specific resume version
 * - POST /api/v1/candidates/resumes/analyze/ -> Start AI Resume-to-Job analysis
 * - GET /api/v1/candidates/resumes/analyses/{analysisId}/ -> Fetch analysis status & suggestions
 * - POST /api/v1/candidates/resumes/suggestions/accept/ -> Accept/edit suggestion
 * - POST /api/v1/candidates/resumes/suggestions/reject/ -> Reject suggestion
 * - POST /api/v1/candidates/resumes/tailored-version/ -> Save new tailored resume version
 * - GET /api/v1/candidates/resumes/{id}/export/ -> Download/export resume document
 */

const STORAGE_RESUMES_KEY = 'statejobz_candidate_resumes';
const STORAGE_ANALYSES_KEY = 'statejobz_candidate_resume_analyses';

/**
 * Initial base Candidate Resume structure
 */
const DEFAULT_BASE_RESUME = {
  id: 'res_base_01',
  versionId: 'v1_original',
  title: 'Alexandra_Chen_Resume.pdf',
  candidateName: 'ALEXANDRA CHEN',
  contactInfo: 'San Francisco, CA • alex.chen@email.com • (555) 123-4567 • linkedin.com/in/alexc',
  isBase: true,
  updatedAt: new Date().toISOString(),
  sections: {
    experience: [
      {
        id: 'exp_01',
        roleTitle: 'Senior Product Designer',
        companyName: 'TechFlow Solutions',
        location: 'San Francisco, CA',
        period: 'Jan 2021 - Present',
        bullets: [
          'Led end-to-end design for the flagship SaaS product, increasing user retention by 24% within the first quarter of launch.',
          'Established a comprehensive design system utilizing Figma, reducing developer handoff time by 30%.',
          'Mentored 3 junior designers and facilitated cross-functional workshops with engineering and product management teams.'
        ]
      },
      {
        id: 'exp_02',
        roleTitle: 'UX Designer',
        companyName: 'Creative Horizon Agency',
        location: 'New York, NY',
        period: 'Jun 2018 - Dec 2020',
        bullets: [
          'Redesigned e-commerce checkout flow, resulting in a 15% increase in successful transactions.',
          'Conducted user research sessions with over 50 participants to validate new feature concepts.'
        ]
      }
    ],
    competencies: {
      design: 'UI/UX Design, Interaction Design, Wireframing, Prototyping, Design Systems, Information Architecture.',
      tools: 'Figma, Sketch, Adobe Creative Suite, Principle, InVision, Basic HTML/CSS/React.',
      research: 'Usability Testing, User Interviews, A/B Testing, Persona Development.'
    }
  }
};

/**
 * Initial sample AI analysis result for TechFlow Solutions Senior Product Designer
 */
const DEFAULT_ANALYSIS = {
  analysisId: 'an_techflow_01',
  sourceType: 'platform_job',
  jobId: 'job_techflow_01',
  jobTitle: 'Senior Product Designer',
  companyName: 'TechFlow Solutions',
  score: 72,
  scoreLabel: 'Good',
  scoreFeedback: 'Matches standard Senior Designer roles. Add target JD to improve.',
  missingKeywords: ['Accessibility', 'Webflow'],
  matchedKeywords: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping'],
  suggestions: [
    {
      id: 'sug_01',
      sectionId: 'exp_01',
      bulletIndex: 1,
      originalText: 'Established a comprehensive design system utilizing Figma, reducing developer handoff time by 30%.',
      proposedText: 'Architected a scalable Figma design system, reducing engineering handoff time by 30% and accelerating cross-functional sprint velocity.',
      reason: 'Enhances impact verbs (Architected, Scalable) and quantifies team velocity benefits for Senior Designer roles.',
      status: 'PENDING'
    },
    {
      id: 'sug_02',
      sectionId: 'exp_01',
      bulletIndex: 0,
      originalText: 'Led end-to-end design for the flagship SaaS product, increasing user retention by 24% within the first quarter of launch.',
      proposedText: 'Spearheaded end-to-end product design for flagship SaaS platform, driving a 24% boost in Q1 user retention through data-driven UX iterations.',
      reason: 'Aligns retention metric with data-driven design practices highlighted in the job description.',
      status: 'PENDING'
    }
  ]
};

function getStoredResumes() {
  try {
    const raw = localStorage.getItem(STORAGE_RESUMES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_RESUMES_KEY, JSON.stringify([DEFAULT_BASE_RESUME]));
      return [DEFAULT_BASE_RESUME];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_BASE_RESUME];
  } catch (err) {
    console.error('Error reading stored resumes:', err);
    return [DEFAULT_BASE_RESUME];
  }
}

function saveStoredResumes(resumes) {
  try {
    localStorage.setItem(STORAGE_RESUMES_KEY, JSON.stringify(resumes));
  } catch (err) {
    console.error('Error saving stored resumes:', err);
  }
}

function getStoredAnalyses() {
  try {
    const raw = localStorage.getItem(STORAGE_ANALYSES_KEY);
    if (!raw) return { [DEFAULT_ANALYSIS.analysisId]: DEFAULT_ANALYSIS };
    return JSON.parse(raw);
  } catch {
    return { [DEFAULT_ANALYSIS.analysisId]: DEFAULT_ANALYSIS };
  }
}

function saveStoredAnalyses(analysesMap) {
  try {
    localStorage.setItem(STORAGE_ANALYSES_KEY, JSON.stringify(analysesMap));
  } catch (err) {
    console.error('Error saving stored analyses:', err);
  }
}

/**
 * Fetch candidate's available base resumes and tailored versions
 */
export async function getCandidateResumes() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return getStoredResumes();
}

/**
 * Fetch specific resume version by ID
 */
export async function getResumeVersion(versionId) {
  await new Promise(resolve => setTimeout(resolve, 80));
  const resumes = getStoredResumes();
  const found = resumes.find(r => r.versionId === versionId || r.id === versionId);
  return found || resumes[0];
}

/**
 * Fetch platform job details for targeting context
 */
export async function getJobForResumeTargeting(jobId) {
  await new Promise(resolve => setTimeout(resolve, 100));
  if (!jobId) return null;

  // Mock platform job lookups
  const jobsMap = {
    job_techflow_01: {
      id: 'job_techflow_01',
      title: 'Senior Product Designer',
      companyName: 'TechFlow Solutions',
      description: 'We are seeking a Senior Product Designer to architect scalable Figma design systems, conduct user research, and drive SaaS user retention.'
    },
    job_01: {
      id: 'job_01',
      title: 'Senior Frontend Engineer',
      companyName: 'Acme Corp',
      description: 'Senior Frontend Engineer needed with deep experience in React optimization, state management, and modern component design.'
    }
  };

  return jobsMap[jobId] || {
    id: jobId,
    title: 'Product Role',
    companyName: 'Tech Employer',
    description: 'Targeted position requiring UI/UX design, frontend development, and team collaboration.'
  };
}

/**
 * Start AI Resume-to-Job Analysis
 */
export async function startResumeAnalysis(payload) {
  await new Promise(resolve => setTimeout(resolve, 300));
  const { resumeVersionId, jobId, manualJobDescription } = payload;

  const resumes = getStoredResumes();
  const targetResume = resumes.find(r => r.versionId === resumeVersionId) || resumes[0];

  let jobTitle = 'Target Role';
  let companyName = 'Tech Employer';

  if (jobId) {
    const job = await getJobForResumeTargeting(jobId);
    if (job) {
      jobTitle = job.title;
      companyName = job.companyName;
    }
  } else if (manualJobDescription) {
    jobTitle = 'Custom Targeted Role';
    companyName = 'Pasted Job Description';
  }

  // Calculate dynamic score based on text length and keyword matches
  const textContent = JSON.stringify(targetResume.sections);
  const keywords = ['Figma', 'UI/UX', 'Design', 'React', 'Accessibility', 'Webflow', 'Architecture'];
  const matched = keywords.filter(k => textContent.toLowerCase().includes(k.toLowerCase()));
  const missing = keywords.filter(k => !textContent.toLowerCase().includes(k.toLowerCase()));

  const calculatedScore = Math.min(95, Math.max(60, 65 + (matched.length * 6)));
  let scoreLabel = 'Good';
  if (calculatedScore >= 85) scoreLabel = 'Excellent';
  else if (calculatedScore >= 75) scoreLabel = 'Strong';
  else if (calculatedScore < 65) scoreLabel = 'Needs Work';

  const newAnalysis = {
    analysisId: `an_${Date.now()}`,
    sourceType: jobId ? 'platform_job' : 'manual_jd',
    jobId: jobId || null,
    jobTitle,
    companyName,
    manualJobDescription: manualJobDescription || null,
    score: calculatedScore,
    scoreLabel,
    scoreFeedback: `Matches standard ${jobTitle} requirements. Review active suggestions to increase impact.`,
    missingKeywords: missing.slice(0, 3),
    matchedKeywords: matched,
    suggestions: [
      {
        id: `sug_${Date.now()}_1`,
        sectionId: 'exp_01',
        bulletIndex: 1,
        originalText: targetResume.sections?.experience?.[0]?.bullets?.[1] || 'Established a comprehensive design system utilizing Figma, reducing developer handoff time by 30%.',
        proposedText: 'Architected a scalable Figma design system, reducing engineering handoff time by 30% and accelerating cross-functional sprint velocity.',
        reason: 'Enhances impact verbs (Architected, Scalable) and quantifies team velocity benefits.',
        status: 'PENDING'
      },
      {
        id: `sug_${Date.now()}_2`,
        sectionId: 'exp_01',
        bulletIndex: 0,
        originalText: targetResume.sections?.experience?.[0]?.bullets?.[0] || 'Led end-to-end design for the flagship SaaS product.',
        proposedText: 'Spearheaded end-to-end product design for flagship SaaS platform, driving a 24% boost in Q1 user retention through data-driven UX iterations.',
        reason: 'Aligns retention metric with data-driven design practices highlighted in the job description.',
        status: 'PENDING'
      }
    ],
    createdAt: new Date().toISOString()
  };

  const analysesMap = getStoredAnalyses();
  analysesMap[newAnalysis.analysisId] = newAnalysis;
  saveStoredAnalyses(analysesMap);

  return { success: true, analysis: newAnalysis };
}

/**
 * Accept or Edit an AI Suggestion and update current draft in real time
 */
export async function acceptResumeSuggestion(analysisId, suggestionId, customEditedText = null) {
  await new Promise(resolve => setTimeout(resolve, 120));

  const analysesMap = getStoredAnalyses();
  const analysis = analysesMap[analysisId] || DEFAULT_ANALYSIS;

  const sugIndex = analysis.suggestions.findIndex(s => s.id === suggestionId);
  if (sugIndex === -1) {
    return { success: false, message: 'Suggestion not found.' };
  }

  const suggestion = analysis.suggestions[sugIndex];
  const textToApply = customEditedText || suggestion.proposedText;

  // Mark suggestion as ACCEPTED
  analysis.suggestions[sugIndex] = {
    ...suggestion,
    status: 'ACCEPTED',
    appliedText: textToApply
  };

  // Recalculate match score bonus
  analysis.score = Math.min(98, analysis.score + 5);

  analysesMap[analysisId] = analysis;
  saveStoredAnalyses(analysesMap);

  return {
    success: true,
    appliedText: textToApply,
    updatedAnalysis: analysis
  };
}

/**
 * Reject / Dismiss an AI Suggestion
 */
export async function rejectResumeSuggestion(analysisId, suggestionId) {
  await new Promise(resolve => setTimeout(resolve, 100));

  const analysesMap = getStoredAnalyses();
  const analysis = analysesMap[analysisId] || DEFAULT_ANALYSIS;

  const sugIndex = analysis.suggestions.findIndex(s => s.id === suggestionId);
  if (sugIndex !== -1) {
    analysis.suggestions[sugIndex].status = 'REJECTED';
    analysesMap[analysisId] = analysis;
    saveStoredAnalyses(analysesMap);
  }

  return { success: true, updatedAnalysis: analysis };
}

/**
 * Undo suggestion state change
 */
export async function undoResumeSuggestion(analysisId, suggestionId) {
  await new Promise(resolve => setTimeout(resolve, 80));

  const analysesMap = getStoredAnalyses();
  const analysis = analysesMap[analysisId] || DEFAULT_ANALYSIS;

  const sugIndex = analysis.suggestions.findIndex(s => s.id === suggestionId);
  if (sugIndex !== -1) {
    analysis.suggestions[sugIndex].status = 'PENDING';
    analysesMap[analysisId] = analysis;
    saveStoredAnalyses(analysesMap);
  }

  return { success: true, updatedAnalysis: analysis };
}

/**
 * Create a new job-specific tailored Resume Version
 */
export async function createTailoredResumeVersion(payload) {
  await new Promise(resolve => setTimeout(resolve, 200));
  const { baseVersionId, jobId, jobTitle, updatedSections } = payload;

  const resumes = getStoredResumes();
  const base = resumes.find(r => r.versionId === baseVersionId) || resumes[0];

  const newVersion = {
    ...base,
    id: `res_tailored_${Date.now()}`,
    versionId: `v_tailored_${Date.now()}`,
    title: `${jobTitle || 'Tailored'} - Resume Version`,
    isBase: false,
    jobId: jobId || null,
    sections: updatedSections || base.sections,
    updatedAt: new Date().toISOString()
  };

  const updatedResumes = [newVersion, ...resumes];
  saveStoredResumes(updatedResumes);

  return {
    success: true,
    tailoredVersion: newVersion
  };
}

/**
 * Export / download resume document
 */
export async function exportResumeVersion(versionId) {
  await new Promise(resolve => setTimeout(resolve, 250));
  const resumes = getStoredResumes();
  const target = resumes.find(r => r.versionId === versionId || r.id === versionId) || resumes[0];

  // Generate plain text blob export
  const textContent = `
${target.candidateName}
${target.contactInfo}

PROFESSIONAL EXPERIENCE
${target.sections.experience.map(exp => `
${exp.roleTitle} | ${exp.companyName} (${exp.period})
${exp.bullets.map(b => `- ${b}`).join('\n')}
`).join('\n')}

CORE COMPETENCIES
Design: ${target.sections.competencies.design}
Tools: ${target.sections.competencies.tools}
Research: ${target.sections.competencies.research}
  `.trim();

  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${target.candidateName.replace(/\s+/g, '_')}_Resume.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return { success: true };
}
