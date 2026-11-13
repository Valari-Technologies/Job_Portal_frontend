import { authenticatedFetch } from '../auth/adminAuthService';

const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Sends a message or command action to the Candidate AI Career Copilot.
 * 
 * @param {string} message - Natural language user message (e.g., "Find jobs matching my skills")
 * @param {string|null} action - Optional direct action ('APPLY_JOB' | 'RECOMMEND_JOBS' | 'TRACK_APPLICATIONS')
 * @param {number|null} jobId - Target job id for direct apply actions
 */
export async function sendAICopilotMessage(message, action = null, jobId = null) {
  try {
    const payload = { message };
    if (action) payload.action = action;
    if (jobId) payload.job_id = jobId;

    const response = await authenticatedFetch(`${API_BASE_URL}/accounts/candidate/ai-copilot/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || errData.error || 'Failed to communicate with AI Copilot');
    }

    return await response.json();
  } catch (error) {
    console.error('AICopilotService error:', error);
    throw error;
  }
}
