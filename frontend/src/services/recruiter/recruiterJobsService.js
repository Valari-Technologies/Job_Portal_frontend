const STORAGE_RECRUITER_JOBS_KEY = 'tnjobz_recruiter_jobs';

function getRecruiterCompanyLogo() {
  try {
    const userStr = localStorage.getItem('auth_user');
    const user = userStr ? JSON.parse(userStr) : null;
    return user?.company_logo || user?.profile_photo || user?.profilePhotoUrl || user?.logo || null;
  } catch {
    return null;
  }
}

export function getRecruiterJobsData() {
  try {
    const stored = localStorage.getItem(STORAGE_RECRUITER_JOBS_KEY);
    const logoUrl = getRecruiterCompanyLogo();
    let jobs = stored ? JSON.parse(stored) : [
      {
        id: 'job_rec_01',
        title: 'Senior Full-Stack Developer',
        company_name: 'MSD Tech',
        employer_name: 'MSD Tech',
        company_logo: logoUrl,
        employer: {
          company_name: 'MSD Tech',
          contact_name: 'MSD',
          email: 'msd@gmail.com',
          company_logo: logoUrl,
          profile_photo: logoUrl,
          verification_status: 'APPROVED',
          account_status: 'ACTIVE',
          trust_level: 'VERIFIED'
        },
        category: 'Engineering',
        workMode: 'On-site',
        location: 'Tambaram, Chennai, Tamil Nadu',
        minExperience: '2',
        maxExperience: '5',
        experience_min: '2',
        experience_max: '5',
        minSalary: '40000',
        maxSalary: '75000',
        salary_min: '40000',
        salary_max: '75000',
        salary_period: 'month',
        skills: ['React', 'Node.js', 'Python', 'PostgreSQL'],
        description: 'Lead full-stack development of enterprise web applications using React, Node.js, and PostgreSQL.',
        responsibilities: '• Design scalable backend REST APIs.\n• Build responsive React frontend components.\n• Conduct code reviews and lead technical architecture.',
        deadline: new Date(Date.now() + 30*86400000).toISOString().split('T')[0],
        application_deadline: new Date(Date.now() + 30*86400000).toISOString().split('T')[0],
        status: 'PENDING_REVIEW',
        status_label: 'Pending Review',
        applicationsCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      }
    ];

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

    return {
      metrics: {
        active_jobs: jobs.filter(j => j.status === 'PUBLISHED' || j.status === 'Published').length,
        total_applications: 0,
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

export async function createJobDraftService(jobPayload) {
  try {
    const existingData = getRecruiterJobsData();
    const existingJobs = existingData.jobs || [];
    const locationStr = [jobPayload?.locality, jobPayload?.city, jobPayload?.district, jobPayload?.state].filter(Boolean).join(', ') || jobPayload?.location || 'Tambaram, Chennai, Tamil Nadu';
    const logoUrl = getRecruiterCompanyLogo();
    
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

    const newJob = {
      id: `job_${Date.now()}`,
      title: jobPayload?.title?.trim() || 'Software Development Engineer',
      company_name: jobPayload?.companyName || 'MSD Tech',
      employer_name: 'MSD Tech',
      company_logo: logoUrl || jobPayload?.company_logo || null,
      employer: {
        company_name: jobPayload?.companyName || 'MSD Tech',
        contact_name: 'MSD',
        email: 'msd@gmail.com',
        company_logo: logoUrl || jobPayload?.company_logo || null,
        profile_photo: logoUrl || jobPayload?.company_logo || null,
        verification_status: 'APPROVED',
        account_status: 'ACTIVE',
        trust_level: 'VERIFIED'
      },
      category: jobPayload?.category || jobPayload?.department || 'Engineering',
      industry: jobPayload?.industry || 'Information Technology',
      workMode: jobPayload?.workMode || 'On-site',
      location: locationStr,
      employmentType: jobPayload?.employmentType || 'Full-time',
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
      description: jobPayload?.description || 'Software Development Engineer responsible for designing, developing, testing, and maintaining scalable applications.',
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

    // Remove any incomplete "Untitled Job Position" drafts to keep recruiter dashboard clean
    const cleanedJobs = existingJobs.filter(j => j.title !== 'Untitled Job Position').map(j => {
      // Backfill missing company_logo or responsibilities on existing jobs
      const updated = { ...j };
      if (!updated.company_logo && logoUrl) {
        updated.company_logo = logoUrl;
      }
      if (!updated.employer?.company_logo && logoUrl) {
        updated.employer = { ...(updated.employer || {}), company_logo: logoUrl, profile_photo: logoUrl };
      }
      if (!updated.responsibilities || updated.responsibilities.trim() === '') {
        updated.responsibilities = responsibilitiesText;
      }
      return updated;
    });

    const updatedJobs = [newJob, ...cleanedJobs];
    localStorage.setItem(STORAGE_RECRUITER_JOBS_KEY, JSON.stringify(updatedJobs));
    return { success: true, job: newJob };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
