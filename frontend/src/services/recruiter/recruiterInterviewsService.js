import { authenticatedFetch, getAuthenticatedUser } from '../auth/adminAuthService';
import { getRecruiterApplicationsData, updateApplicationStatusService } from './recruiterApplicationsService';

const STORAGE_KEY = 'statejobz_recruiter_interviews';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export function parseInterviewDateTime(scheduledDate, scheduledTime) {
  if (!scheduledDate) return null;
  const d = String(scheduledDate).trim();
  const t = String(scheduledTime || '').trim();

  if (d.includes('T') && !t) {
    const res = new Date(d);
    if (!isNaN(res.getTime())) return res;
  }

  let hours = 10;
  let minutes = 0;
  if (t) {
    const m = t.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (m) {
      hours = parseInt(m[1], 10);
      minutes = parseInt(m[2], 10);
      const ampm = m[3] ? m[3].toUpperCase() : null;
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }
  }

  const parts = d.split('-');
  if (parts.length === 3) {
    const dt = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), hours, minutes);
    if (!isNaN(dt.getTime())) return dt;
  }

  const fallback = new Date(`${d} ${t}`);
  if (!isNaN(fallback.getTime())) return fallback;
  return null;
}

export function checkIsInterviewPast(scheduledDate, scheduledTime, bufferMinutes = 60) {
  if (!scheduledDate) return false;
  const parsed = parseInterviewDateTime(scheduledDate, scheduledTime);
  if (parsed) {
    return (Date.now() - parsed.getTime()) > (bufferMinutes * 60 * 1000);
  }
  try {
    const dateOnly = new Date(scheduledDate);
    if (!isNaN(dateOnly.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateOnly.setHours(0, 0, 0, 0);
      return dateOnly < today;
    }
  } catch {}
  return false;
}

export function getRecruiterInterviewsData() {
  let list = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    list = stored ? JSON.parse(stored) : [];
  } catch {
    list = [];
  }

  // Also collect scheduled interviews from recruiter applications
  const appsData = getRecruiterApplicationsData();
  const allApplications = appsData?.applications || [];

  allApplications.forEach(app => {
    const appInterviews = Array.isArray(app.interviews) && app.interviews.length > 0
      ? app.interviews
      : (app.interview ? [app.interview] : []);

    appInterviews.forEach(inv => {
      const invId = String(inv.id || `app_${app.id}_int`);
      const exists = list.some(i => String(i.id) === invId || (i.application_id && String(i.application_id) === String(app.id)));
      if (!exists) {
        list.push({
          id: invId,
          application_id: String(app.id),
          candidate: app.candidate || {},
          candidateName: app.candidate?.full_name || 'Candidate',
          job: app.job || {},
          jobTitle: app.job?.title || 'Role',
          scheduled_by: { full_name: 'You' },
          interview_type: inv.interview_type || inv.interviewType || 'ONLINE',
          scheduled_date: inv.scheduled_date || inv.scheduledDate || new Date().toISOString().split('T')[0],
          scheduled_time: inv.scheduled_time || inv.scheduledTime || '10:00 AM',
          location: inv.location || '',
          meeting_link: inv.meeting_link || inv.meetingLink || '',
          phone_number: inv.phone_number || app.candidate?.phone || '',
          notes: inv.notes || '',
          status: inv.status || 'SCHEDULED',
          result: inv.result || 'PENDING',
          created_at: inv.created_at || new Date().toISOString()
        });
      }
    });
  });

  // Ensure each interview in list has proper candidate and job objects for RecruiterInterviewCard & DetailsModal
  list = list.map(item => {
    const candName = item.candidate?.full_name || item.candidateName || 'Candidate';
    const jTitle = item.job?.title || item.jobTitle || 'Role';
    const rawStatus = String(item.status || 'SCHEDULED').toUpperCase();
    const isPast = rawStatus === 'COMPLETED' || checkIsInterviewPast(item.scheduled_date, item.scheduled_time);
    const effectiveStatus = isPast && rawStatus !== 'CANCELLED' ? 'COMPLETED' : rawStatus;

    return {
      ...item,
      candidate: item.candidate && item.candidate.full_name ? item.candidate : { full_name: candName },
      candidateName: candName,
      job: item.job && item.job.title ? item.job : { title: jTitle },
      jobTitle: jTitle,
      scheduled_by: item.scheduled_by || { full_name: 'You' },
      status: effectiveStatus,
      isPast
    };
  });

  const upcoming = list.filter(i => !i.isPast && i.status !== 'COMPLETED' && i.status !== 'CANCELLED').length;
  const completed = list.filter(i => i.isPast || i.status === 'COMPLETED').length;
  const rescheduled = list.filter(i => !i.isPast && i.status === 'RESCHEDULED').length;

  // Eligible applications: Applications that are SHORTLISTED (or in INTERVIEW stage for additional rounds)
  const eligibleApplications = allApplications.filter(app => {
    const st = String(app.status || '').toUpperCase();
    return st === 'SHORTLISTED' || st === 'INTERVIEW';
  });

  return {
    summary: {
      completed,
      upcoming,
      rescheduled
    },
    interviews: list,
    eligibleApplications,
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_items: list.length,
      page_size: 10
    }
  };
}

export async function fetchRecruiterInterviewsFromApi() {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/accounts/recruiter/interviews/`);
    if (response.ok) {
      const apiInterviews = await response.json();
      if (Array.isArray(apiInterviews) && apiInterviews.length > 0) {
        const stored = localStorage.getItem(STORAGE_KEY);
        const localList = stored ? JSON.parse(stored) : [];
        const mergedMap = new Map();
        localList.forEach(i => mergedMap.set(String(i.id), i));
        apiInterviews.forEach(i => mergedMap.set(String(i.id), i));
        const merged = Array.from(mergedMap.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }
    }
  } catch (err) {
    console.warn("Backend recruiter interviews fetch warning:", err);
  }
  return getRecruiterInterviewsData();
}

export async function scheduleInterviewService(payload) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const list = stored ? JSON.parse(stored) : [];

    const appsData = getRecruiterApplicationsData();
    const allApplications = appsData?.applications || [];
    const targetApp = allApplications.find(a => String(a.id) === String(payload.application_id));

    const candName = payload.candidate_name || payload.candidateName || targetApp?.candidate?.full_name || 'Candidate';
    const jTitle = payload.job_title || payload.jobTitle || targetApp?.job?.title || 'Position';

    const newInterview = {
      id: `int_${Date.now()}`,
      application_id: String(payload.application_id || ''),
      candidate: targetApp?.candidate || { full_name: candName },
      candidateName: candName,
      job: targetApp?.job || { title: jTitle },
      jobTitle: jTitle,
      scheduled_by: { full_name: 'You' },
      interview_type: payload.interview_type || payload.interviewType || 'ONLINE',
      scheduled_date: payload.scheduled_date || payload.scheduledDate || new Date().toISOString().split('T')[0],
      scheduled_time: payload.scheduled_time || payload.scheduledTime || '10:00 AM',
      location: payload.location || '',
      meeting_link: payload.meeting_link || payload.meetingLink || '',
      phone_number: payload.phone_number || targetApp?.candidate?.phone || '',
      notes: payload.notes || '',
      status: 'SCHEDULED',
      result: 'PENDING',
      created_at: new Date().toISOString()
    };

    list.unshift(newInterview);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    // Update application stage in pipeline to INTERVIEW
    if (payload.application_id) {
      await updateApplicationStatusService(payload.application_id, 'INTERVIEW', payload.notes);

      // Sync into recruiter application object
      const storageKey = (function() {
        try {
          const user = getAuthenticatedUser();
          const email = (user?.email || '').toLowerCase().trim();
          return `tnjobz_recruiter_applications_${email || 'default'}`;
        } catch { return 'tnjobz_recruiter_applications'; }
      })();

      try {
        const rStored = localStorage.getItem(storageKey);
        if (rStored) {
          const rApps = JSON.parse(rStored);
          const rIdx = rApps.findIndex(a => String(a.id) === String(payload.application_id));
          if (rIdx !== -1) {
            rApps[rIdx].status = 'INTERVIEW';
            rApps[rIdx].interviews = rApps[rIdx].interviews || [];
            rApps[rIdx].interviews.unshift(newInterview);
            localStorage.setItem(storageKey, JSON.stringify(rApps));
          }
        }
      } catch (err) {
        console.warn("Error updating recruiter apps storage:", err);
      }

      // Sync to candidate storage so candidate portal reflects the interview
      try {
        const candAppsStr = localStorage.getItem('tnjobz_candidate_applications');
        if (candAppsStr) {
          let candApps = JSON.parse(candAppsStr);
          candApps = candApps.map(a => {
            if (String(a.id) === String(payload.application_id) || (a.job_id && String(a.job_id) === String(targetApp?.job_id))) {
              return {
                ...a,
                status: 'INTERVIEW',
                interview: {
                  status: 'SCHEDULED',
                  round_title: 'Technical Interview - Round 1',
                  scheduled_at: `${newInterview.scheduled_date} at ${newInterview.scheduled_time}`,
                  scheduled_date: newInterview.scheduled_date,
                  scheduled_time: newInterview.scheduled_time,
                  meeting_link: newInterview.meeting_link,
                  location: newInterview.location
                }
              };
            }
            return a;
          });
          localStorage.setItem('tnjobz_candidate_applications', JSON.stringify(candApps));
        }

        const candIntsStr = localStorage.getItem('tnjobz_candidate_interviews');
        let candInts = candIntsStr ? JSON.parse(candIntsStr) : [];
        const intRecord = {
          id: newInterview.id,
          application: payload.application_id,
          job_title: jTitle,
          company_name: targetApp?.job?.company_name || 'Employer',
          scheduled_date: newInterview.scheduled_date,
          scheduled_time: newInterview.scheduled_time,
          interview_type: newInterview.interview_type,
          meeting_link: newInterview.meeting_link,
          location: newInterview.location,
          notes: newInterview.notes,
          status: 'SCHEDULED'
        };
        candInts = [intRecord, ...candInts.filter(i => String(i.id) !== String(newInterview.id) && String(i.application) !== String(payload.application_id))];
        localStorage.setItem('tnjobz_candidate_interviews', JSON.stringify(candInts));
      } catch (candErr) {
        console.warn("Candidate interview sync warning:", candErr);
      }

      // Also call backend API
      try {
        const url = `${API_BASE_URL}/accounts/recruiter/applications/${payload.application_id}/interview/`;
        await authenticatedFetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interview_type: newInterview.interview_type,
            scheduled_date: newInterview.scheduled_date,
            scheduled_time: newInterview.scheduled_time,
            meeting_link: newInterview.meeting_link,
            location: newInterview.location,
            notes: newInterview.notes
          })
        });
      } catch (beErr) {
        console.warn("Backend interview post warning:", beErr);
      }
    }

    return { success: true, interview_id: newInterview.id };
  } catch (err) {
    console.error("Failed to store recruiter interview locally:", err);
    return { success: true, interview_id: `int_${Date.now()}` };
  }
}

export async function updateInterviewStatusService(interviewId, status, result, notes) {
  try {
    let targetAppId = null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const list = JSON.parse(stored);
      const idx = list.findIndex(i => String(i.id) === String(interviewId));
      if (idx !== -1) {
        list[idx].status = status;
        if (result) list[idx].result = result;
        if (notes) list[idx].notes = notes;
        targetAppId = list[idx].application_id;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
    }

    // Sync status with recruiter application if decision was made
    if (targetAppId && result && (result === 'SELECTED' || result === 'REJECTED')) {
      try {
        await updateApplicationStatusService(targetAppId, result);
      } catch (appErr) {
        console.warn("Could not update app stage for interview result:", appErr);
      }
    }
  } catch (e) {}
  return { success: true };
}
