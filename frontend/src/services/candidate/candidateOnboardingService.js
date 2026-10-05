/**
 * Candidate Onboarding Service
 * 
 * Manages taxonomy fetching, selection persistence, and onboarding progress for Candidates.
 * Supports structured catalog and custom selections without polluting global taxonomy.
 * 
 * Payload Structure:
 * {
 *   industry: { source: "catalog" | "custom", id: string | null, title: string },
 *   specialization: { source: "catalog" | "custom", id: string | null, title: string }
 * }
 * 
 * Django Backend Integration Boundary:
 * - GET /api/v1/industries/ -> List active industries with icons and IDs
 * - GET /api/v1/departments/?industry_id={id} -> List active specializations for selected industry
 * - GET /api/v1/candidates/onboarding/status/ -> Fetch candidate onboarding completion state
 * - POST /api/v1/candidates/onboarding/select/ -> Save candidate industry & specialization payload
 */

import { getAuthenticatedUser } from '../auth/adminAuthService';

const ONBOARDING_STORAGE_KEY = 'statejobz_candidate_onboarding';

function getOnboardingStorageKey() {
  try {
    const user = getAuthenticatedUser();
    if (user && user.email) {
      return `${ONBOARDING_STORAGE_KEY}_${user.email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    }
  } catch {
    // Fallback
  }
  return ONBOARDING_STORAGE_KEY;
}

// Exact Industry Catalog matching Figma reference design (Step 1)
const DEV_INDUSTRIES_CATALOG = [
  { id: 'ind_it', name: 'Information Technology', shortName: 'IT', icon: 'Laptop', is_active: true },
  { id: 'ind_healthcare', name: 'Healthcare', shortName: 'Healthcare', icon: 'ShieldCross', is_active: true },
  { id: 'ind_finance', name: 'Finance', shortName: 'Finance', icon: 'Bank', is_active: true },
  { id: 'ind_creative', name: 'Creative & Design', shortName: 'Creative & Design', icon: 'Palette', is_active: true },
  { id: 'ind_education', name: 'Education', shortName: 'Education', icon: 'GraduationCap', is_active: true },
  { id: 'ind_sales', name: 'Sales & Retail', shortName: 'Sales & Retail', icon: 'Storefront', is_active: true },
  { id: 'ind_manufacturing', name: 'Manufacturing', shortName: 'Manufacturing', icon: 'RoboticArm', is_active: true },
  { id: 'ind_hospitality', name: 'Hospitality', shortName: 'Hospitality', icon: 'Utensils', is_active: true }
];

// Exact Specialization Catalog matching Figma reference design (Step 2)
const DEV_SPECIALIZATIONS_CATALOG = {
  ind_it: [
    { id: 'spec_dev', name: 'Software Development', icon: 'Code', description: 'Building applications, systems, and tools. Includes Backend, Frontend, and Full-Stack roles.' },
    { id: 'spec_data', name: 'Data Science & AI', icon: 'BarChart', description: 'Extracting insights from data, machine learning, and AI engineering.' },
    { id: 'spec_cyber', name: 'Cybersecurity', icon: 'Shield', description: 'Protecting systems, networks, and data from digital attacks. Ethical hacking and analysis.' },
    { id: 'spec_cloud', name: 'Cloud Computing', icon: 'Cloud', description: 'Designing and managing cloud infrastructure. AWS, Azure, GCP architecture and DevOps.' },
    { id: 'spec_product', name: 'Product Management', icon: 'Layers', description: 'Agile product strategy, user experience roadmaps, and feature prioritization.' },
    { id: 'spec_support', name: 'IT Support & Systems', icon: 'Headphones', description: 'System administration, network infrastructure, and helpdesk technical support.' }
  ],
  ind_healthcare: [
    { id: 'spec_clinical', name: 'Clinical & Nursing', icon: 'HeartPulse', description: 'Patient care, registered nursing, and specialized clinical medical practice.' },
    { id: 'spec_pharma', name: 'Pharmacy & Research', icon: 'FlaskConical', description: 'Pharmaceutical formulation, drug safety, and clinical trial research.' },
    { id: 'spec_hosp_admin', name: 'Hospital Administration', icon: 'Building2', description: 'Medical facility operations, healthcare records, and patient administration.' },
    { id: 'spec_med_tech', name: 'Medical Technology', icon: 'Activity', description: 'Laboratory technology, radiology imaging, and diagnostic equipment operations.' }
  ],
  ind_finance: [
    { id: 'spec_banking', name: 'Banking & Financial Services', icon: 'Landmark', description: 'Retail banking, commercial lending, credit analysis, and branch operations.' },
    { id: 'spec_accounting', name: 'Accounting & Taxation', icon: 'Calculator', description: 'Corporate auditing, tax compliance, GST filing, and financial reporting.' },
    { id: 'spec_investment', name: 'Investment & Wealth Management', icon: 'TrendingUp', description: 'Portfolio management, equity research, mutual funds, and trading.' },
    { id: 'spec_risk', name: 'Risk & Compliance', icon: 'FileCheck', description: 'Financial risk modeling, fraud prevention, and regulatory compliance.' }
  ],
  ind_creative: [
    { id: 'spec_design', name: 'Graphic & UI/UX Design', icon: 'Palette', description: 'Digital product design, visual identity, user research, and wireframing.' },
    { id: 'spec_multimedia', name: 'Animation & Motion Graphics', icon: 'Film', description: '3D animation, video production, visual effects, and motion design.' },
    { id: 'spec_writing', name: 'Content Writing & Journalism', icon: 'PenTool', description: 'Copywriting, technical documentation, editorial writing, and SEO content.' }
  ],
  ind_education: [
    { id: 'spec_teaching', name: 'Academic Instruction & Teaching', icon: 'GraduationCap', description: 'Primary, secondary, and higher education academic instruction.' },
    { id: 'spec_elearning', name: 'E-Learning & Curriculum Design', icon: 'BookOpen', description: 'Instructional design, online course creation, and educational technology.' }
  ],
  ind_sales: [
    { id: 'spec_retail_ops', name: 'Retail Operations & Store Mgmt', icon: 'Storefront', description: 'Store management, visual merchandising, and inventory control.' },
    { id: 'spec_b2b_sales', name: 'B2B & Enterprise Sales', icon: 'Briefcase', description: 'Business development, client acquisition, and key account management.' }
  ],
  ind_manufacturing: [
    { id: 'spec_mech_eng', name: 'Mechanical & Production Eng', icon: 'Wrench', description: 'CAD/CAM design, assembly line management, and plant operations.' },
    { id: 'spec_qa_qc', name: 'Quality Assurance & Control', icon: 'CheckCircle2', description: 'Six Sigma quality control, ISO standards, and manufacturing testing.' }
  ],
  ind_hospitality: [
    { id: 'spec_hotel', name: 'Hotel & Resort Management', icon: 'Utensils', description: 'Front desk management, housekeeping, and guest hospitality services.' },
    { id: 'spec_food_bev', name: 'Food & Beverage Operations', icon: 'Coffee', description: 'Culinary management, fine dining, kitchen operations, and catering.' }
  ]
};

function loadStoredOnboarding() {
  try {
    const key = getOnboardingStorageKey();
    const raw = localStorage.getItem(key);
    if (!raw) {
      return {
        industry: null,
        specialization: null,
        isCompleted: false,
        updatedAt: null
      };
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading Candidate onboarding storage:', err);
    return { industry: null, specialization: null, isCompleted: false, updatedAt: null };
  }
}

function saveOnboardingToStorage(data) {
  try {
    const key = getOnboardingStorageKey();
    const current = loadStoredOnboarding();
    const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving Candidate onboarding storage:', err);
  }
}

/**
 * Fetch active catalogue industries
 */
export async function getActiveIndustries() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return DEV_INDUSTRIES_CATALOG.filter(ind => ind.is_active);
}

/**
 * Fetch specializations for an industry ID
 */
export async function getSpecializationsByIndustry(industryId) {
  await new Promise(resolve => setTimeout(resolve, 100));
  if (!industryId) return [];
  return DEV_SPECIALIZATIONS_CATALOG[industryId] || [];
}

/**
 * Get Candidate onboarding completion status
 */
export async function getCandidateOnboardingStatus() {
  await new Promise(resolve => setTimeout(resolve, 100));
  const data = loadStoredOnboarding();
  return {
    isCompleted: Boolean(data.isCompleted && data.industry && data.specialization),
    industry: data.industry,
    specialization: data.specialization
  };
}

/**
 * Get current saved candidate onboarding payload
 */
export async function getCandidateOnboardingSelection() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return loadStoredOnboarding();
}

/**
 * Save Candidate Industry selection payload (Step 1)
 */
export async function saveCandidateIndustry(industryPayload) {
  await new Promise(resolve => setTimeout(resolve, 150));
  const current = loadStoredOnboarding();
  
  // Clear specialization if industry title/id changed
  const isSameIndustry = current.industry && (
    (industryPayload.source === 'catalog' && current.industry.id === industryPayload.id) ||
    (industryPayload.source === 'custom' && current.industry.title === industryPayload.title)
  );

  const specialization = isSameIndustry ? current.specialization : null;

  const updated = saveOnboardingToStorage({
    industry: industryPayload,
    specialization,
    isCompleted: false
  });
  return updated;
}

/**
 * Save Candidate Specialization payload (Step 2)
 */
export async function saveCandidateSpecialization(specializationPayload) {
  await new Promise(resolve => setTimeout(resolve, 200));
  const updated = saveOnboardingToStorage({
    specialization: specializationPayload,
    isCompleted: true
  });
  return updated;
}
