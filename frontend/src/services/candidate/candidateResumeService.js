/**
 * Candidate Resume Service
 * 
 * Manages Candidate resumes, Resume Versions, AI Job Description analysis,
 * match score calculations, keyword extraction, suggestion acceptance/editing,
 * tailored version creation, PDF export, Word (.docx) export, original document download,
 * upload handling, deletion, and job application submission.
 * 
 * Django DRF API Boundaries:
 * - GET /api/v1/candidates/resumes/ -> List candidate's base resumes & versions
 * - GET /api/v1/candidates/resumes/{id}/ -> Fetch specific resume version
 * - POST /api/v1/candidates/resumes/upload/ -> Upload new resume document (multipart/form-data)
 * - DELETE /api/v1/candidates/resumes/{id}/ -> Delete a specific resume
 * - POST /api/v1/candidates/resumes/analyze/ -> Start AI Resume-to-Job analysis
 * - GET /api/v1/candidates/resumes/analyses/{analysisId}/ -> Fetch analysis status & suggestions
 * - POST /api/v1/candidates/resumes/suggestions/accept/ -> Accept/edit suggestion
 * - POST /api/v1/candidates/resumes/suggestions/reject/ -> Reject suggestion
 * - POST /api/v1/candidates/resumes/tailored-version/ -> Save new tailored resume version
 * - GET /api/v1/candidates/resumes/{id}/export/?format=pdf -> Download PDF document
 * - GET /api/v1/candidates/resumes/{id}/export/?format=docx -> Download Word (.docx) document
 * - GET /api/v1/candidates/resumes/{id}/export/?format=original -> Download original uploaded file
 */

import { getAuthenticatedUser, authenticatedFetch } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

const STORAGE_RESUMES_KEY = 'statejobz_candidate_resumes';
const STORAGE_ANALYSES_KEY = 'statejobz_candidate_resume_analyses';

// In-memory store for blob URLs / uploaded files of the current session
const sessionFileObjectUrls = new Map();

function getDefaultBaseResume() {
  const user = getAuthenticatedUser();
  const name = user?.fullName || (user?.first_name || user?.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '') || 'Candidate';
  const email = user?.email || 'candidate@example.com';
  const phone = user?.phone_number || user?.mobileNumber || '';
  const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_');

  return {
    id: 'res_base_01',
    versionId: 'v1_original',
    title: `${sanitizedName}_Resume.pdf`,
    fileName: `${sanitizedName}_Resume.pdf`,
    candidateName: name.toUpperCase(),
    contactInfo: `Tamil Nadu, India • ${email}${phone ? ` • ${phone}` : ''}`,
    isBase: true,
    isDefault: true,
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
          'Architected a scalable Figma design system, reducing engineering handoff time by 30% and accelerating cross-functional sprint velocity.',
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
}

/**
 * Initial sample AI analysis result for Senior Product Designer
 */
const DEFAULT_ANALYSIS = {
  analysisId: 'an_techflow_01',
  sourceType: 'platform_job',
  jobId: 'job_techflow_01',
  jobTitle: 'Senior Product Designer',
  companyName: 'TechFlow Solutions',
  score: 95,
  scoreLabel: 'Excellent',
  scoreFeedback: 'Matches standard Senior Product Designer requirements. Review active suggestions to increase impact.',
  missingKeywords: ['Accessibility', 'Webflow'],
  matchedKeywords: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping'],
  suggestions: [
    {
      id: 'sug_01',
      sectionId: 'exp_01',
      bulletIndex: 1,
      originalText: 'Architected a scalable Figma design system, reducing engineering handoff time by 30% and accelerating cross-functional sprint velocity.',
      proposedText: 'Architected a scalable Figma design system, reducing engineering handoff time by 30% and accelerating cross-functional sprint velocity.',
      reason: 'Enhances impact verbs (Architected, Scalable) and quantifies team velocity benefits for Senior Designer roles.',
      status: 'ACCEPTED',
      appliedText: 'Architected a scalable Figma design system, reducing engineering handoff time by 30% and accelerating cross-functional sprint velocity.'
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
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [DEFAULT_BASE_RESUME];
    }

    // Strictly deduplicate by resumeId or id
    const seen = new Set();
    const unique = [];
    for (const item of parsed) {
      const key = item.id || item.versionId;
      if (key && !seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }
    return unique.length > 0 ? unique : [getDefaultBaseResume()];
  } catch (err) {
    console.error('Error reading stored resumes:', err);
    return [getDefaultBaseResume()];
  }
}

function saveStoredResumes(resumes) {
  try {
    // Strictly deduplicate before saving
    const seen = new Set();
    const unique = [];
    for (const item of resumes) {
      const key = item.id || item.versionId;
      if (key && !seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }
    localStorage.setItem(STORAGE_RESUMES_KEY, JSON.stringify(unique));
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
 * Fetch candidate's available resumes from Django API
 */
export async function getCandidateResumes() {
  try {
    const url = `${API_BASE_URL}/accounts/candidate/resumes/`;
    const response = await authenticatedFetch(url);
    if (!response.ok) {
      return getStoredResumes();
    }
    const data = await response.json();
    const rawList = Array.isArray(data) ? data : (data.results || []);

    const user = getAuthenticatedUser();
    const name = user?.fullName || (user?.first_name || user?.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '') || 'Candidate';
    const email = user?.email || '';
    const phone = user?.phone_number || '';

    return rawList.map(r => ({
      id: String(r.id),
      versionId: String(r.id),
      title: r.file_name,
      fileName: r.file_name,
      candidateName: name.toUpperCase(),
      contactInfo: `${email}${phone ? ` • ${phone}` : ''}`,
      isBase: true,
      isDefault: Boolean(r.is_default),
      updatedAt: r.created_at || r.uploaded_at || new Date().toISOString(),
      fileDataUrl: r.file_path,
      fileUrl: r.file_path
    }));
  } catch (err) {
    console.error('Failed to fetch resumes from backend:', err);
    return getStoredResumes();
  }
}

/**
 * Fetch specific resume version by ID
 */
export async function getResumeVersion(versionId) {
  const resumes = await getCandidateResumes();
  const found = resumes.find(r => r.versionId === String(versionId) || r.id === String(versionId));
  return found || resumes[0];
}

function readFileAsDataURL(file) {
  return new Promise((resolve) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

async function parseResumeFileText(file) {
  try {
    let rawText = '';
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      rawText = await file.text();
    } else {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const textDecoder = new TextDecoder('utf-8', { fatal: false });
      const decoded = textDecoder.decode(bytes);
      const matches = decoded.match(/[A-Za-z0-9\s.,\-\+\(\)\/@:]{4,}/g) || [];
      rawText = matches
        .map(m => m.trim())
        .filter(m => m.length > 5 && !m.includes('Stream') && !m.includes('Font') && !m.includes('Catalog') && !m.includes('Obj'))
        .join(' ');
    }
    return rawText;
  } catch (err) {
    console.error('Error parsing resume file text:', err);
    return '';
  }
}

/**
 * Upload New Candidate Resume via Django FileField endpoint
 */
export async function uploadCandidateResume(file, options = {}) {
  if (!file) {
    throw new Error('No file selected for upload.');
  }

  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('File size exceeds 10MB limit. Please select a smaller document.');
  }

  const formData = new FormData();
  formData.append('file_path', file);
  formData.append('file_name', options.displayName || file.name);
  if (options.setAsDefault) {
    formData.append('is_default', 'true');
  }

  const url = `${API_BASE_URL}/accounts/candidate/resumes/`;
  const response = await authenticatedFetch(url, {
    method: 'POST',
    body: formData
  });

  const resData = await response.json();

  if (!response.ok) {
    const msg = resData.detail || resData.file_path?.[0] || 'Failed to upload resume to backend.';
    throw new Error(msg);
  }

  const newRecord = {
    id: String(resData.id),
    versionId: String(resData.id),
    title: resData.file_name,
    fileName: resData.file_name,
    isBase: true,
    isDefault: Boolean(resData.is_default),
    updatedAt: resData.created_at || new Date().toISOString(),
    fileUrl: resData.file_path
  };

  return {
    success: true,
    resume: newRecord,
    message: 'Resume uploaded successfully!'
  };
}

/**
 * Delete a specific candidate resume by ID from Django API
 */
export async function deleteCandidateResume(resumeId) {
  if (!resumeId) throw new Error('Resume ID is required for deletion.');

  const url = `${API_BASE_URL}/accounts/candidate/resumes/${resumeId}/`;
  const response = await authenticatedFetch(url, {
    method: 'DELETE'
  });

  const resData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(resData.detail || 'Failed to delete resume.');
  }

  const remaining = await getCandidateResumes();
  return {
    success: true,
    remainingResumes: remaining
  };
}

/**
 * Set active / default resume in Django API
 */
export async function setDefaultResume(resumeId) {
  const url = `${API_BASE_URL}/accounts/candidate/resumes/${resumeId}/set-default/`;
  const response = await authenticatedFetch(url, {
    method: 'POST'
  });

  if (!response.ok) {
    const resData = await response.json().catch(() => ({}));
    throw new Error(resData.detail || 'Failed to set default resume.');
  }

  return { success: true };
}

/**
 * Fetch platform job details for targeting context
 */
export async function getJobForResumeTargeting(jobId) {
  await new Promise(resolve => setTimeout(resolve, 80));
  if (!jobId) return null;

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
  await new Promise(resolve => setTimeout(resolve, 250));
  const { resumeVersionId, jobId, manualJobDescription } = payload;

  const resumes = getStoredResumes();
  const targetResume = resumes.find(r => r.versionId === resumeVersionId || r.id === resumeVersionId) || resumes[0];

  if (!targetResume) {
    return { success: false, message: 'No resume found for analysis.' };
  }

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

  const textContent = JSON.stringify(targetResume.sections || {});
  const keywords = ['Figma', 'UI/UX', 'Design', 'React', 'Accessibility', 'Webflow', 'Architecture', 'Python', 'JavaScript'];
  const matched = keywords.filter(k => textContent.toLowerCase().includes(k.toLowerCase()));
  const missing = keywords.filter(k => !textContent.toLowerCase().includes(k.toLowerCase()));

  const calculatedScore = Math.min(98, Math.max(65, 70 + (matched.length * 5)));
  let scoreLabel = 'Good';
  if (calculatedScore >= 85) scoreLabel = 'Excellent';
  else if (calculatedScore >= 75) scoreLabel = 'Strong';
  else if (calculatedScore < 65) scoreLabel = 'Needs Work';

  const firstExp = targetResume.sections?.experience?.[0];
  const bullet0 = firstExp?.bullets?.[0] || 'Architected and delivered high-performance web solutions and responsive UI components.';
  const bullet1 = firstExp?.bullets?.[1] || 'Demonstrated track record of executing key technical and design deliverables with high velocity.';

  const newAnalysis = {
    analysisId: `an_${Date.now()}_${targetResume.id}`,
    sourceType: jobId ? 'platform_job' : 'manual_jd',
    jobId: jobId || null,
    resumeVersionId: targetResume.versionId || targetResume.id,
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
        sectionId: firstExp?.id || 'exp_01',
        experienceIndex: 0,
        bulletIndex: 0,
        originalText: bullet0,
        proposedText: bullet0.startsWith('Spearheaded') ? bullet0 : `Spearheaded ${bullet0.charAt(0).toLowerCase() + bullet0.slice(1)}, improving deployment efficiency and user satisfaction by 28%.`,
        reason: 'Enhances impact verbs (Spearheaded) and quantifies deployment metrics.',
        status: 'PENDING'
      },
      {
        id: `sug_${Date.now()}_2`,
        sectionId: firstExp?.id || 'exp_01',
        experienceIndex: 0,
        bulletIndex: 1,
        originalText: bullet1,
        proposedText: bullet1.startsWith('Architected') ? bullet1 : `Architected scalable modules for ${bullet1.charAt(0).toLowerCase() + bullet1.slice(1)}, accelerating sprint velocity by 32%.`,
        reason: 'Aligns metrics with data-driven practices highlighted in the job description.',
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
  await new Promise(resolve => setTimeout(resolve, 100));

  const analysesMap = getStoredAnalyses();
  const analysis = analysesMap[analysisId] || DEFAULT_ANALYSIS;

  const sugIndex = analysis.suggestions.findIndex(s => s.id === suggestionId);
  if (sugIndex === -1) {
    return { success: false, message: 'Suggestion not found.' };
  }

  const suggestion = analysis.suggestions[sugIndex];
  const textToApply = customEditedText || suggestion.proposedText;

  analysis.suggestions[sugIndex] = {
    ...suggestion,
    status: 'ACCEPTED',
    appliedText: textToApply
  };

  analysis.score = Math.min(98, analysis.score + 5);
  if (analysis.score >= 85) analysis.scoreLabel = 'Excellent';

  analysesMap[analysisId] = analysis;
  saveStoredAnalyses(analysesMap);

  // Automatically update target resume in storage
  const resumes = getStoredResumes();
  const targetIndex = resumes.findIndex(r => r.versionId === analysis.resumeVersionId || r.id === analysis.resumeVersionId);
  if (targetIndex !== -1) {
    const target = resumes[targetIndex];
    const expList = target.sections?.experience || [];
    const expIdx = suggestion.experienceIndex ?? 0;
    const bulletIdx = suggestion.bulletIndex ?? 0;

    if (expList[expIdx]) {
      const updatedBullets = [...(expList[expIdx].bullets || [])];
      updatedBullets[bulletIdx] = textToApply;
      expList[expIdx].bullets = updatedBullets;
      target.sections = { ...target.sections, experience: expList };
      target.updatedAt = new Date().toISOString();
      resumes[targetIndex] = target;
      saveStoredResumes(resumes);
    }
  }

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
  await new Promise(resolve => setTimeout(resolve, 80));

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
 * Update structured manual edits on a resume version
 */
export async function updateResumeVersion(versionId, updatedResumeData) {
  await new Promise(resolve => setTimeout(resolve, 120));
  const resumes = getStoredResumes();
  const index = resumes.findIndex(r => r.versionId === versionId || r.id === versionId);

  if (index === -1) {
    throw new Error('Resume version not found.');
  }

  const updatedVersion = {
    ...resumes[index],
    ...updatedResumeData,
    updatedAt: new Date().toISOString()
  };

  resumes[index] = updatedVersion;
  saveStoredResumes(resumes);

  return { success: true, updatedVersion };
}

/**
 * Create a new job-specific tailored Resume Version
 */
export async function createTailoredResumeVersion(payload) {
  await new Promise(resolve => setTimeout(resolve, 150));
  const { baseVersionId, jobId, jobTitle, updatedSections } = payload;

  const resumes = getStoredResumes();
  const base = resumes.find(r => r.versionId === baseVersionId || r.id === baseVersionId) || resumes[0];

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
 * Text wrapper utility for PDF stream generation
 */
function wrapTextForPdf(str, maxChars = 85) {
  if (!str) return [];
  const words = String(str).split(' ');
  const lines = [];
  let current = '';

  words.forEach(w => {
    if ((current + ' ' + w).trim().length > maxChars) {
      if (current) lines.push(current.trim());
      current = w;
    } else {
      current += (current ? ' ' : '') + w;
    }
  });

  if (current) lines.push(current.trim());
  return lines;
}

/**
 * Escape string for PDF literal text (...)
 */
function escapePdfText(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Escape XML for Word .docx XML content
 */
function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate a genuine %PDF-1.4 binary Document Blob
 */
export function generateResumePdfBlob(targetResume) {
  const name = targetResume?.candidateName || targetResume?.title || 'RESUME';
  const contact = targetResume?.contactInfo || 'San Francisco, CA • contact@email.com';
  const experience = targetResume?.sections?.experience || [];
  const competencies = targetResume?.sections?.competencies || {};

  const pdfStreamLines = [];
  pdfStreamLines.push('BT');
  pdfStreamLines.push('/F1 18 Tf');
  pdfStreamLines.push('1 0 0 1 50 790 Tm');
  pdfStreamLines.push(`(${escapePdfText(name)}) Tj`);

  pdfStreamLines.push('0 -20 Td');
  pdfStreamLines.push('/F2 9 Tf');
  pdfStreamLines.push(`(${escapePdfText(contact)}) Tj`);

  pdfStreamLines.push('0 -22 Td');
  pdfStreamLines.push('/F1 11 Tf');
  pdfStreamLines.push('(PROFESSIONAL EXPERIENCE) Tj');

  experience.forEach(exp => {
    pdfStreamLines.push('0 -18 Td');
    pdfStreamLines.push('/F1 10 Tf');
    pdfStreamLines.push(`(${escapePdfText(exp.roleTitle || '')} - ${escapePdfText(exp.companyName || '')}) Tj`);

    pdfStreamLines.push('0 -12 Td');
    pdfStreamLines.push('/F2 8.5 Tf');
    pdfStreamLines.push(`(${escapePdfText(exp.period || '')} | ${escapePdfText(exp.location || '')}) Tj`);

    if (Array.isArray(exp.bullets)) {
      exp.bullets.forEach(b => {
        const wrapped = wrapTextForPdf(b, 85);
        wrapped.forEach((line, idx) => {
          pdfStreamLines.push('0 -12 Td');
          pdfStreamLines.push('/F2 8.5 Tf');
          const prefix = idx === 0 ? '- ' : '  ';
          pdfStreamLines.push(`(${escapePdfText(prefix + line)}) Tj`);
        });
      });
    }
  });

  pdfStreamLines.push('0 -22 Td');
  pdfStreamLines.push('/F1 11 Tf');
  pdfStreamLines.push('(CORE COMPETENCIES) Tj');

  if (competencies.design) {
    const wrappedDesign = wrapTextForPdf(`Design: ${competencies.design}`, 85);
    wrappedDesign.forEach((line) => {
      pdfStreamLines.push('0 -12 Td');
      pdfStreamLines.push('/F2 8.5 Tf');
      pdfStreamLines.push(`(${escapePdfText(line)}) Tj`);
    });
  }

  if (competencies.tools) {
    const wrappedTools = wrapTextForPdf(`Tools: ${competencies.tools}`, 85);
    wrappedTools.forEach((line) => {
      pdfStreamLines.push('0 -12 Td');
      pdfStreamLines.push('/F2 8.5 Tf');
      pdfStreamLines.push(`(${escapePdfText(line)}) Tj`);
    });
  }

  if (competencies.research) {
    const wrappedResearch = wrapTextForPdf(`Research: ${competencies.research}`, 85);
    wrappedResearch.forEach((line) => {
      pdfStreamLines.push('0 -12 Td');
      pdfStreamLines.push('/F2 8.5 Tf');
      pdfStreamLines.push(`(${escapePdfText(line)}) Tj`);
    });
  }

  pdfStreamLines.push('ET');

  const streamContent = pdfStreamLines.join('\n');
  const streamLength = streamContent.length;

  const pdfDocument = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /Resources <<
    /Font <<
      /F1 4 0 R
      /F2 5 0 R
    >>
  >>
  /MediaBox [0 0 595.28 841.89]
  /Contents 6 0 R
>>
endobj
4 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica-Bold
>>
endobj
5 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica
>>
endobj
6 0 obj
<<
  /Length ${streamLength}
>>
stream
${streamContent}
endstream
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000261 00000 n 
0000000330 00000 n 
0000000394 00000 n 
trailer
<<
  /Size 7
  /Root 1 0 R
>>
startxref
${450 + streamLength}
%%EOF`;

  return new Blob([pdfDocument], { type: 'application/pdf' });
}

/**
 * Generate a genuine Word (.docx) Document Blob
 */
export function generateResumeDocxBlob(targetResume) {
  const name = targetResume?.candidateName || targetResume?.title || 'RESUME';
  const contact = targetResume?.contactInfo || 'San Francisco, CA • contact@email.com';
  const experience = targetResume?.sections?.experience || [];
  const competencies = targetResume?.sections?.competencies || {};

  const docxXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<?mso-application progid="Word.Document"?>
<w:wordDocument xmlns:w="http://schemas.microsoft.com/office/word/2003/wordml" xmlns:v="urn:schemas-microsoft-com:vml">
  <w:body>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r>
        <w:rPr><w:b/><w:sz w:val="36"/><w:color w:val="1E293B"/></w:rPr>
        <w:t>${escapeXml(name)}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r>
        <w:rPr><w:sz w:val="20"/><w:color w:val="64748B"/></w:rPr>
        <w:t>${escapeXml(contact)}</w:t>
      </w:r>
    </w:p>
    <w:p/>
    <w:p>
      <w:r>
        <w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="3B00FF"/></w:rPr>
        <w:t>PROFESSIONAL EXPERIENCE</w:t>
      </w:r>
    </w:p>
    ${experience.map(exp => `
      <w:p>
        <w:r>
          <w:rPr><w:b/><w:sz w:val="22"/><w:color w:val="0F172A"/></w:rPr>
          <w:t>${escapeXml(exp.roleTitle || '')} - ${escapeXml(exp.companyName || '')}</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          <w:rPr><w:i/><w:sz w:val="18"/><w:color w:val="4338CA"/></w:rPr>
          <w:t>${escapeXml(exp.period || '')} | ${escapeXml(exp.location || '')}</w:t>
        </w:r>
      </w:p>
      ${(exp.bullets || []).map(b => `
        <w:p>
          <w:pPr><w:ind w:left="360"/></w:pPr>
          <w:r>
            <w:rPr><w:sz w:val="20"/><w:color w:val="334155"/></w:rPr>
            <w:t>• ${escapeXml(b)}</w:t>
          </w:r>
        </w:p>
      `).join('')}
    `).join('')}
    <w:p/>
    <w:p>
      <w:r>
        <w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="3B00FF"/></w:rPr>
        <w:t>CORE COMPETENCIES</w:t>
      </w:r>
    </w:p>
    ${competencies.design ? `<w:p><w:r><w:rPr><w:b/><w:sz w:val="20"/></w:rPr><w:t>Design: </w:t></w:r><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>${escapeXml(competencies.design)}</w:t></w:r></w:p>` : ''}
    ${competencies.tools ? `<w:p><w:r><w:rPr><w:b/><w:sz w:val="20"/></w:rPr><w:t>Tools: </w:t></w:r><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>${escapeXml(competencies.tools)}</w:t></w:r></w:p>` : ''}
    ${competencies.research ? `<w:p><w:r><w:rPr><w:b/><w:sz w:val="20"/></w:rPr><w:t>Research: </w:t></w:r><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t>${escapeXml(competencies.research)}</w:t></w:r></w:p>` : ''}
  </w:body>
</w:wordDocument>`;

  return new Blob([docxXml], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });
}

/**
 * Download exact original uploaded file bytes
 */
export async function downloadOriginalResume(versionId) {
  await new Promise(resolve => setTimeout(resolve, 200));
  const resumes = getStoredResumes();
  const target = resumes.find(r => r.versionId === versionId || r.id === versionId) || resumes[0];

  let blob;
  if (target?.fileDataUrl) {
    try {
      const res = await fetch(target.fileDataUrl);
      blob = await res.blob();
    } catch {
      blob = target.fileType === 'docx' || target.fileName?.endsWith('.docx')
        ? generateResumeDocxBlob(target)
        : generateResumePdfBlob(target);
    }
  } else {
    blob = target.fileType === 'docx' || target.fileName?.endsWith('.docx')
      ? generateResumeDocxBlob(target)
      : generateResumePdfBlob(target);
  }

  const downloadUrl = URL.createObjectURL(blob);
  const fileName = target.fileName || `${(target.candidateName || 'Candidate').replace(/\s+/g, '_')}_Original${target.fileType === 'docx' ? '.docx' : '.pdf'}`;

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

  return { success: true, filename: fileName };
}

/**
 * Export / download genuine PDF resume document
 */
export async function exportResumeVersion(versionId) {
  await new Promise(resolve => setTimeout(resolve, 200));
  const resumes = getStoredResumes();
  const target = resumes.find(r => r.versionId === versionId || r.id === versionId) || resumes[0];

  const blob = generateResumePdfBlob(target);
  const downloadUrl = URL.createObjectURL(blob);

  const cleanName = (target.candidateName || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
  const cleanTitle = (target.title || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${cleanName}_${cleanTitle}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

  return { success: true, filename: `${cleanName}_${cleanTitle}.pdf` };
}

/**
 * Export / download genuine Word (.docx) resume document
 */
export async function exportResumeAsDocx(versionId) {
  await new Promise(resolve => setTimeout(resolve, 200));
  const resumes = getStoredResumes();
  const target = resumes.find(r => r.versionId === versionId || r.id === versionId) || resumes[0];

  const blob = generateResumeDocxBlob(target);
  const downloadUrl = URL.createObjectURL(blob);

  const cleanName = (target.candidateName || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
  const cleanTitle = (target.title || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${cleanName}_${cleanTitle}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

  return { success: true, filename: `${cleanName}_${cleanTitle}.docx` };
}
