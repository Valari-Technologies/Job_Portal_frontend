import { authenticatedFetch, getAuthenticatedUser } from '../auth/adminAuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export function getAuthenticatedRecruiterInfo() {
  try {
    const user = getAuthenticatedUser();
    if (!user) return null;
    const email = (user.email || '').toLowerCase().trim();
    const company = (user.company_name || user.employer_profile?.company_name || '').trim();
    return {
      userId: user.id || user.user_id || null,
      email,
      companyName: company || (email.includes('kannan') ? 'Kannan Tech' : email.includes('msd') ? 'MSD Tech' : 'My Company'),
      fullName: user.full_name || user.name || 'Recruiter',
      logo: user.company_logo || user.profile_picture || null,
      location: user.company_address || user.location || 'Chennai, Tamil Nadu'
    };
  } catch {
    return null;
  }
}

function getRecruiterJobsStorageKey(auth) {
  if (!auth?.email) return 'tnjobz_recruiter_jobs_guest';
  return `tnjobz_recruiter_jobs_${auth.email}`;
}

function getRecruiterCompanyLogo() {
  const auth = getAuthenticatedRecruiterInfo();
  return auth?.logo || null;
}

function getDefaultJobsForRecruiter(auth) {
  if (!auth) return [];
  const email = (auth.email || '').toLowerCase().trim();
  const company = (auth.companyName || '').toLowerCase().trim();

  // ONLY seeded MSD Tech gets the historical SDE job
  if (email === 'msd@gmail.com' || company === 'msd tech') {
    return [
      {
        id: '8',
        title: 'SDE',
        company_name: 'MSD Tech',
        employer_name: 'MSD Tech',
        company_logo: auth.logo,
        employer: {
          company_name: 'MSD Tech',
          contact_name: 'MSD',
          email: 'msd@gmail.com',
          company_logo: auth.logo,
          profile_photo: auth.logo,
          verification_status: 'APPROVED',
          account_status: 'ACTIVE',
          trust_level: 'VERIFIED'
        },
        category: 'Frontend Engineer',
        workMode: 'On-site',
        location: 'Tambaram, Chennai, Tamil Nadu',
        minExperience: '3',
        maxExperience: '5',
        experience_min: '3',
        experience_max: '5',
        minSalary: '35000',
        maxSalary: '50000',
        salary_min: '35000',
        salary_max: '50000',
        salary_period: 'month',
        skills: ['React.js', 'JavaScript', 'Python'],
        description: 'Software Development Engineer at MSD Tech. Skills: React.js, JavaScript, Python.',
        responsibilities: '• Design, develop, test, and deploy resilient web applications and software services.\n• Collaborate with cross-functional teams to translate user and product requirements into technical solutions.\n• Build responsive, accessible user interfaces and integrate secure RESTful APIs.\n• Troubleshoot, debug, and optimize application performance across production environments.',
        deadline: '2026-10-15',
        application_deadline: '2026-10-15',
        status: 'PUBLISHED',
        status_label: 'Published',
        applicationsCount: 1,
        posted_date: '2026-10-07',
        createdAt: '2026-10-07',
        created_at: new Date('2026-10-07').toISOString()
      }
    ];
  }

  // All other recruiters (such as Kannan from Kannan Tech) start with 0 jobs
  return [];
}

export function getRecruiterJobsData() {
  try {
    const auth = getAuthenticatedRecruiterInfo();
    const storageKey = getRecruiterJobsStorageKey(auth);
    const stored = localStorage.getItem(storageKey);
    const logoUrl = getRecruiterCompanyLogo();

    let jobs;
    if (stored !== null) {
      jobs = JSON.parse(stored);
    } else {
      jobs = getDefaultJobsForRecruiter(auth);
      localStorage.setItem(storageKey, JSON.stringify(jobs));
    }

    // Strict multi-tenant isolation: enforce that jobs strictly match the current recruiter's company
    if (auth?.companyName) {
      const myCompany = auth.companyName.toLowerCase().trim();
      jobs = jobs.filter(j => {
        const jComp = (j.company_name || j.employer_name || j.employer?.company_name || '').toLowerCase().trim();
        return jComp === myCompany;
      });
    }

    if (logoUrl) {
      jobs = jobs.map(j => ({
        ...j,
        company_logo: j.company_logo || logoUrl,
        employer: {
          ...(j.employer || {}),
          company_logo: j.employer?.company_logo || logoUrl,
          profile_photo: j.employer?.profile_photo || logoUrl
        }
      }));
    }

    const activeJobs = jobs.filter(j => j.status === 'PUBLISHED' || j.status === 'Published').length;

    return {
      metrics: {
        active_jobs: activeJobs,
        total_applications: jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0),
        interviews_scheduled: 0
      },
      jobs,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_items: jobs.length,
        page_size: 10
      }
    };
  } catch {
    return {
      metrics: { active_jobs: 0, total_applications: 0, interviews_scheduled: 0 },
      jobs: [],
      pagination: { current_page: 1, total_pages: 1, total_items: 0, page_size: 10 }
    };
  }
}

export async function fetchRecruiterJobsFromApi() {
  try {
    const res = await authenticatedFetch(`${API_BASE_URL}/accounts/recruiter/jobs/`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const auth = getAuthenticatedRecruiterInfo();
        const storageKey = getRecruiterJobsStorageKey(auth);
        const localData = getRecruiterJobsData();
        const localDrafts = (localData.jobs || []).filter(j => String(j.id).startsWith('job_'));
        const merged = [...data, ...localDrafts];
        localStorage.setItem(storageKey, JSON.stringify(merged));
        return getRecruiterJobsData();
      }
    }
  } catch (err) {
    console.warn("fetchRecruiterJobsFromApi error:", err);
  }
  return getRecruiterJobsData();
}

export async function createJobDraftService(jobPayload) {
  try {
    const auth = getAuthenticatedRecruiterInfo();
    const existingData = getRecruiterJobsData();
    const existingJobs = existingData.jobs || [];
    const locationStr = [jobPayload?.locality, jobPayload?.city, jobPayload?.district, jobPayload?.state].filter(Boolean).join(', ') || jobPayload?.location || (auth?.location || 'Chennai, Tamil Nadu');
    const logoUrl = getRecruiterCompanyLogo() || jobPayload?.company_logo;
    const companyName = auth?.companyName || jobPayload?.companyName || 'My Company';

    const minExp = jobPayload?.minExperience || '0';
    const maxExp = jobPayload?.maxExperience || '3';
    const minSal = jobPayload?.minSalary || '35000';
    const maxSal = jobPayload?.maxSalary || '50000';
    const deadLineStr = jobPayload?.deadline || new Date(Date.now() + 30*86400000).toISOString().split('T')[0];
    
    let responsibilitiesArr = [];
    if (Array.isArray(jobPayload?.responsibilities)) {
      responsibilitiesArr = jobPayload.responsibilities.map(r => String(r || '').trim()).filter(Boolean);
    } else if (typeof jobPayload?.responsibilities === 'string' && jobPayload.responsibilities.trim()) {
      responsibilitiesArr = jobPayload.responsibilities.split('\n').map(r => r.replace(/^[•\-\*\s]+/, '').trim()).filter(Boolean);
    }

    if (responsibilitiesArr.length === 0) {
      responsibilitiesArr = [
        'Design, develop, test, and maintain high-quality software applications and web-based solutions.',
        'Collaborate with cross-functional teams to translate business requirements into technical solutions.',
        'Develop reliable backend services, RESTful APIs, and responsive user interfaces.',
        'Troubleshoot, debug, and optimize application workflows and performance.'
      ];
    }
    const responsibilitiesText = responsibilitiesArr.map(r => `• ${r}`).join('\n');

    const rawAppType = String(jobPayload?.applicationType || '').toUpperCase();
    const appTypeToSend = (rawAppType.includes('SIMPLE') || rawAppType.includes('LOCAL')) ? 'SIMPLE_LOCAL' : 'PROFILE_RESUME';

    const newJob = {
      id: `job_${Date.now()}`,
      title: jobPayload?.title?.trim() || 'Software Development Engineer',
      company_name: companyName,
      employer_name: companyName,
      company_logo: logoUrl || null,
      employer: {
        company_name: companyName,
        contact_name: auth?.fullName || 'HR Manager',
        email: auth?.email || 'hr@company.com',
        company_logo: logoUrl || null,
        profile_photo: logoUrl || null,
        verification_status: 'APPROVED',
        account_status: 'ACTIVE',
        trust_level: 'VERIFIED'
      },
      category: jobPayload?.category || jobPayload?.department || 'Engineering',
      industry: jobPayload?.industry || 'Information Technology',
      workMode: jobPayload?.workMode || 'On-site',
      location: locationStr,
      employmentType: jobPayload?.employmentType || 'Full-time',
      applicationType: appTypeToSend,
      application_type: appTypeToSend,
      minExperience: minExp,
      maxExperience: maxExp,
      experience_min: minExp,
      experience_max: maxExp,
      experience_required: minExp,
      minSalary: minSal,
      maxSalary: maxSal,
      salary_min: minSal,
      salary_max: maxSal,
      salary_period: jobPayload?.salaryType === 'PER_YEAR' ? 'year' : 'month',
      description: jobPayload?.description || `${jobPayload?.title || 'Software Engineer'} role at ${companyName}.`,
      responsibilities: responsibilitiesText,
      responsibilitiesList: responsibilitiesArr,
      skills: Array.isArray(jobPayload?.skills) && jobPayload.skills.length > 0 ? jobPayload.skills : ['React', 'Node.js', 'REST APIs', 'SQL'],
      status: 'PENDING_REVIEW',
      status_label: 'Pending Review',
      applicationsCount: 0,
      posted_date: new Date().toISOString().split('T')[0],
      deadline: deadLineStr,
      application_deadline: deadLineStr,
      createdAt: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };

    // Sync to backend API asynchronously
    try {
      const res = await authenticatedFetch(`${API_BASE_URL}/accounts/recruiter/jobs/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newJob.title,
          description: newJob.description,
          industry: jobPayload?.industry || 'Information Technology',
          department: jobPayload?.department || '',
          category: newJob.category,
          workMode: newJob.workMode,
          employmentType: newJob.employmentType,
          state: jobPayload?.state || '',
          district: jobPayload?.district || '',
          city: jobPayload?.city || '',
          locality: jobPayload?.locality || '',
          location: locationStr,
          minExperience: newJob.minExperience,
          maxExperience: newJob.maxExperience,
          numberOfOpenings: jobPayload?.numberOfOpenings || '1',
          applicationType: appTypeToSend,
          application_type: appTypeToSend,
          minSalary: newJob.minSalary,
          maxSalary: newJob.maxSalary,
          salary_period: newJob.salary_period,
          currency: jobPayload?.currency || 'INR',
          hideSalary: !!jobPayload?.hideSalary,
          education: jobPayload?.education || '',
          degree: jobPayload?.degree || '',
          benefits: jobPayload?.benefits || [],
          deadline: newJob.deadline,
          responsibilities: responsibilitiesArr,
          skills: newJob.skills
        })
      });
      if (res && res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data && data.id) {
          newJob.id = String(data.id);
        }
      }
    } catch (e) {
      console.warn("Backend job sync notice:", e);
    }

    const storageKey = getRecruiterJobsStorageKey(auth);
    const updatedJobs = [newJob, ...existingJobs.filter(j => String(j.id) !== String(newJob.id))];
    localStorage.setItem(storageKey, JSON.stringify(updatedJobs));

    // Also sync to global tnjobz_recruiter_jobs so Super Admin moderation review queue immediately detects it
    try {
      const globalStr = localStorage.getItem('tnjobz_recruiter_jobs');
      const globalJobs = globalStr ? JSON.parse(globalStr) : [];
      const updatedGlobal = [newJob, ...globalJobs.filter(j => String(j.id) !== String(newJob.id))];
      localStorage.setItem('tnjobz_recruiter_jobs', JSON.stringify(updatedGlobal));
    } catch {}

    return { success: true, job: newJob };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
