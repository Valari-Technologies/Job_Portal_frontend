const STORAGE_KEY = 'statejobz_recruiter_interviews';

export function getRecruiterInterviewsData() {
  let list = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    list = stored ? JSON.parse(stored) : [];
  } catch {
    list = [];
  }

  const upcoming = list.filter(i => i.status === 'SCHEDULED' || i.status === 'UPCOMING').length;
  const completed = list.filter(i => i.status === 'COMPLETED').length;
  const rescheduled = list.filter(i => i.status === 'RESCHEDULED').length;

  return {
    summary: {
      completed,
      upcoming,
      rescheduled
    },
    interviews: list,
    eligibleApplications: [],
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_items: list.length,
      page_size: 10
    }
  };
}

export async function scheduleInterviewService(payload) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const list = stored ? JSON.parse(stored) : [];
    const newInterview = {
      id: `int_${Date.now()}`,
      candidateName: payload.candidate_name || payload.candidateName || 'DSS',
      jobTitle: payload.job_title || payload.jobTitle || 'SDE',
      interviewType: payload.interview_type || payload.interviewType || 'ONLINE',
      scheduledDate: payload.scheduled_date || payload.scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTime: payload.scheduled_time || payload.scheduledTime || '10:00 AM',
      location: payload.location || '',
      meetingLink: payload.meeting_link || payload.meetingLink || '',
      notes: payload.notes || '',
      status: 'SCHEDULED',
      created_at: new Date().toISOString()
    };
    list.unshift(newInterview);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return { success: true, interview_id: newInterview.id };
  } catch (err) {
    console.error("Failed to store recruiter interview locally:", err);
    return { success: true, interview_id: `int_${Date.now()}` };
  }
}

export async function updateInterviewStatusService(interviewId, status, result, notes) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const list = JSON.parse(stored);
      const idx = list.findIndex(i => String(i.id) === String(interviewId));
      if (idx !== -1) {
        list[idx].status = status;
        if (result) list[idx].result = result;
        if (notes) list[idx].notes = notes;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
    }
  } catch (e) {}
  return { success: true };
}

