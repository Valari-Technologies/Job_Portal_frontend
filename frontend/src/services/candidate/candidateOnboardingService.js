/**
 * Candidate Onboarding Service
 * 
 * Manages live taxonomy fetching from Super Admin Categories API, selection persistence,
 * and onboarding progress for Candidates.
 * Strictly uses live backend data without any hardcoded/mock catalogs.
 * 
 * Payload Structure:
 * {
 *   industry: { source: "catalog" | "custom", id: number | string | null, title: string },
 *   specializations: Array<{ source: "catalog" | "custom", id: number | string | null, title: string }>,
 *   isCompleted: boolean,
 *   updatedAt: string
 * }
 * 
 * Backend API Endpoints:
 * - GET /accounts/job-categories/?parent_id=null -> Active parent industries created by Super Admin
 * - GET /accounts/job-categories/?parent_id={id} -> Active subcategories (specializations) for that industry
 * - PATCH /accounts/candidate/profile/ -> Sync onboarding choices into candidate extra_data
 */

import { getAuthenticatedUser, fetchWithAuth, getAuthItem } from '../auth/adminAuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const ONBOARDING_STORAGE_KEY = 'statejobz_candidate_onboarding';

function getOnboardingStorageKey() {
  try {
    const candidateUserStr = getAuthItem('candidate_auth_user');
    if (candidateUserStr) {
      const user = JSON.parse(candidateUserStr);
      if (user && user.email) {
        return `${ONBOARDING_STORAGE_KEY}_${user.email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      }
    }
    const user = getAuthenticatedUser();
    if (user && user.email && user.role === 'CANDIDATE') {
      return `${ONBOARDING_STORAGE_KEY}_${user.email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    }
  } catch {
    // Fallback
  }
  return ONBOARDING_STORAGE_KEY;
}

/**
 * Smart dynamic icon resolver based on Category / Subcategory title and description
 */
export function resolveCategoryIcon(name = '', description = '') {
  const text = `${name} ${description}`.toLowerCase();

  // Tech / Software / IT
  if (text.includes('code') || text.includes('software') || text.includes('developer') || text.includes('programming') || text.includes('frontend') || text.includes('backend') || text.includes('full stack')) {
    return 'Code';
  }
  if (text.includes('data') || text.includes('ai') || text.includes('machine learning') || text.includes('analytics') || text.includes('intelligence')) {
    return 'BarChart';
  }
  if (text.includes('cyber') || text.includes('security') || text.includes('protection') || text.includes('firewall')) {
    return 'Shield';
  }
  if (text.includes('cloud') || text.includes('devops') || text.includes('aws') || text.includes('azure') || text.includes('infrastructure')) {
    return 'Cloud';
  }
  if (text.includes('it') || text.includes('tech') || text.includes('computer') || text.includes('system') || text.includes('information technology')) {
    return 'Laptop';
  }
  if (text.includes('support') || text.includes('helpdesk') || text.includes('customer service') || text.includes('call center')) {
    return 'Headphones';
  }

  // Healthcare / Medical
  if (text.includes('health') || text.includes('medic') || text.includes('clinic') || text.includes('doctor') || text.includes('nurse') || text.includes('care')) {
    return 'HeartPulse';
  }
  if (text.includes('pharma') || text.includes('lab') || text.includes('drug') || text.includes('biotech') || text.includes('research')) {
    return 'FlaskConical';
  }
  if (text.includes('hospital') || text.includes('facility')) {
    return 'Building2';
  }

  // Finance / Banking / Accounts
  if (text.includes('bank') || text.includes('financ') || text.includes('wealth')) {
    return 'Landmark';
  }
  if (text.includes('account') || text.includes('tax') || text.includes('audit') || text.includes('cpa') || text.includes('gst')) {
    return 'Calculator';
  }
  if (text.includes('invest') || text.includes('trading') || text.includes('stock') || text.includes('equity') || text.includes('growth')) {
    return 'TrendingUp';
  }
  if (text.includes('risk') || text.includes('compliance') || text.includes('legal') || text.includes('law')) {
    return 'FileCheck';
  }

  // Design / Creative / Media
  if (text.includes('design') || text.includes('art') || text.includes('ui') || text.includes('ux') || text.includes('graphic') || text.includes('creative')) {
    return 'Palette';
  }
  if (text.includes('film') || text.includes('video') || text.includes('motion') || text.includes('animat') || text.includes('media')) {
    return 'Film';
  }
  if (text.includes('writing') || text.includes('content') || text.includes('journal') || text.includes('copywrit') || text.includes('editor')) {
    return 'PenTool';
  }

  // Education / Teaching
  if (text.includes('educat') || text.includes('teach') || text.includes('school') || text.includes('college') || text.includes('academic') || text.includes('professor')) {
    return 'GraduationCap';
  }
  if (text.includes('learn') || text.includes('course') || text.includes('curriculum') || text.includes('book')) {
    return 'BookOpen';
  }

  // Sales / Retail / Marketing
  if (text.includes('store') || text.includes('retail') || text.includes('merchandis') || text.includes('shop')) {
    return 'Storefront';
  }
  if (text.includes('sales') || text.includes('business development') || text.includes('marketing') || text.includes('commerce') || text.includes('b2b')) {
    return 'Briefcase';
  }

  // Manufacturing / Engineering / Construction
  if (text.includes('manufactur') || text.includes('mechanic') || text.includes('plant') || text.includes('robot') || text.includes('industry')) {
    return 'Wrench';
  }
  if (text.includes('build') || text.includes('construct') || text.includes('civil') || text.includes('architect')) {
    return 'Building2';
  }

  // Hospitality / Food / Travel
  if (text.includes('hotel') || text.includes('resort') || text.includes('hospitality') || text.includes('travel') || text.includes('tour')) {
    return 'Utensils';
  }
  if (text.includes('food') || text.includes('beverag') || text.includes('culinary') || text.includes('kitchen') || text.includes('restaurant') || text.includes('chef') || text.includes('coffee')) {
    return 'Coffee';
  }

  // Product / General
  if (text.includes('product') || text.includes('agile') || text.includes('scrum') || text.includes('strat')) {
    return 'Layers';
  }

  return 'Laptop';
}

export function loadStoredOnboarding() {
  try {
    const key = getOnboardingStorageKey();
    const raw = localStorage.getItem(key);
    if (!raw) {
      return {
        industry: null,
        specializations: [],
        specialization: null,
        isCompleted: false,
        updatedAt: null
      };
    }
    const parsed = JSON.parse(raw);
    let industry = parsed?.industry || null;
    if (industry && industry.source === 'catalog' && (isNaN(Number(industry.id)) || String(industry.id).startsWith('ind_'))) {
      industry = null;
    }

    // Backward compatibility normalization: ensure specializations is an array
    let specializations = [];
    if (Array.isArray(parsed?.specializations)) {
      specializations = parsed.specializations;
    } else if (parsed?.specialization && typeof parsed.specialization === 'object') {
      specializations = [parsed.specialization];
    }
    specializations = specializations.filter(s => s && (s.source !== 'catalog' || (!isNaN(Number(s.id)) && !String(s.id).startsWith('spec_'))));

    return {
      ...parsed,
      industry,
      specializations,
      specialization: specializations[0] || null
    };
  } catch (err) {
    console.error('Error reading Candidate onboarding storage:', err);
    return { industry: null, specializations: [], specialization: null, isCompleted: false, updatedAt: null };
  }
}

function saveOnboardingToStorage(data) {
  try {
    const key = getOnboardingStorageKey();
    const current = loadStoredOnboarding();
    const updated = { 
      ...current, 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving Candidate onboarding storage:', err);
  }
}

/**
 * Async background sync to candidate profile extra_data in Django
 */
async function syncOnboardingToBackend(onboardingData) {
  try {
    const user = getAuthenticatedUser();
    if (!user) return;
    await fetchWithAuth(`${API_BASE_URL}/accounts/candidate/profile/`, {
      method: 'PATCH',
      body: JSON.stringify({
        onboarding: onboardingData
      })
    });
  } catch (err) {
    console.warn('Could not sync onboarding selection to backend profile:', err);
  }
}

/**
 * Fetch active parent industries created by Super Admin (parent_id = null)
 * ZERO hardcoded data.
 */
export async function getActiveIndustries() {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/job-categories/?parent_id=null`);
    if (!response.ok) {
      throw new Error(`Failed to fetch industries (${response.status})`);
    }
    const data = await response.json();
    const list = Array.isArray(data) ? data : (data.results || []);

    return list.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      icon: resolveCategoryIcon(item.name, item.description),
      is_active: item.is_active,
      children_count: item.children_count || 0,
      skills_count: item.skills_count || 0,
      jobs_count: item.jobs_count || 0
    }));
  } catch (err) {
    console.error('Error fetching live industries:', err);
    throw err;
  }
}

/**
 * Fetch active subcategories (Specializations) for a selected parent industry ID
 * ZERO hardcoded data.
 */
export async function getSpecializationsByIndustry(industryId) {
  if (!industryId || isNaN(Number(industryId)) || String(industryId).startsWith('ind_')) return [];
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/job-categories/?parent_id=${industryId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch specializations (${response.status})`);
    }
    const data = await response.json();
    const list = Array.isArray(data) ? data : (data.results || []);

    return list.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || `Specialization in ${item.name}`,
      icon: resolveCategoryIcon(item.name, item.description),
      parent: item.parent,
      parent_name: item.parent_name,
      is_active: item.is_active,
      children_count: item.children_count || 0,
      skills_count: item.skills_count || 0,
      jobs_count: item.jobs_count || 0
    }));
  } catch (err) {
    console.error(`Error fetching specializations for industry ${industryId}:`, err);
    throw err;
  }
}

/**
 * Synchronous check if candidate onboarding is completed
 */
export function isCandidateOnboardingCompleted() {
  const data = loadStoredOnboarding();
  const hasSpecialization = (Array.isArray(data.specializations) && data.specializations.length > 0) || Boolean(data.specialization);
  return Boolean(data.isCompleted && data.industry && hasSpecialization);
}

/**
 * Get Candidate onboarding completion status
 */
export async function getCandidateOnboardingStatus() {
  const data = loadStoredOnboarding();
  const hasSpecialization = (Array.isArray(data.specializations) && data.specializations.length > 0) || Boolean(data.specialization);
  return {
    isCompleted: Boolean(data.isCompleted && data.industry && hasSpecialization),
    industry: data.industry,
    specializations: data.specializations || (data.specialization ? [data.specialization] : []),
    specialization: data.specialization || (data.specializations ? data.specializations[0] : null)
  };
}

/**
 * Get current saved candidate onboarding payload
 */
export async function getCandidateOnboardingSelection() {
  return loadStoredOnboarding();
}

/**
 * Save Candidate Industry selection payload (Step 1)
 * Single selection of industry. If changed, clears specializations.
 */
export async function saveCandidateIndustry(industryPayload) {
  const current = loadStoredOnboarding();
  
  // Clear specialization if industry title/id changed
  const isSameIndustry = current.industry && (
    (industryPayload.source === 'catalog' && current.industry.id === industryPayload.id) ||
    (industryPayload.source === 'custom' && current.industry.title === industryPayload.title)
  );

  const specializations = isSameIndustry ? (current.specializations || []) : [];
  const specialization = specializations[0] || null;

  const updated = saveOnboardingToStorage({
    industry: industryPayload,
    specializations,
    specialization,
    isCompleted: false
  });

  // Sync to backend profile
  syncOnboardingToBackend({
    industry: industryPayload,
    specializations,
    isCompleted: false
  });

  return updated;
}

/**
 * Save Candidate Specializations payload (Step 2 - Multiple Selections)
 */
export async function saveCandidateSpecializations(specializationsList) {
  const list = Array.isArray(specializationsList) ? specializationsList : (specializationsList ? [specializationsList] : []);
  const updated = saveOnboardingToStorage({
    specializations: list,
    specialization: list[0] || null,
    isCompleted: list.length > 0
  });

  // Sync to backend profile
  syncOnboardingToBackend({
    specializations: list,
    specialization: list[0] || null,
    isCompleted: list.length > 0
  });

  return updated;
}

/**
 * Backward compatible single-specialization saver
 */
export async function saveCandidateSpecialization(specializationPayload) {
  const list = specializationPayload ? [specializationPayload] : [];
  return saveCandidateSpecializations(list);
}
