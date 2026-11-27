import { authenticatedFetch, getAuthenticatedUser } from '../auth/adminAuthService';
import { addRecruiterNotification } from './recruiterNotificationsService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const COMMERCE_CACHE_KEY = 'statejobz_recruiter_commerce';

function getRecruiterCommerceStorageKey() {
  try {
    const user = getAuthenticatedUser();
    const email = (user?.email || '').toLowerCase().trim();
    return email ? `${COMMERCE_CACHE_KEY}_${email}` : COMMERCE_CACHE_KEY;
  } catch {
    return COMMERCE_CACHE_KEY;
  }
}

function getDefaultCommerceSummary() {
  return {
    currency: "INR",
    wallet: {
      balance: 0,
      formatted_balance: "₹0.00"
    },
    credits: {
      available: 0,
      total_allowance: 0,
      used: 0
    },
    current_plan: null,
    usage: {
      allowance: 0,
      used: 0,
      remaining: 0,
      is_unlimited: false
    },
    last_payment_method: null,
    transactions: [],
    usage_jobs: []
  };
}

export function saveRecruiterCommerceSummary(data) {
  const key = getRecruiterCommerceStorageKey();
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('recruiter_commerce_updated'));
  } catch (e) {
    console.error("Failed to save recruiter commerce summary:", e);
  }
}

export function getRecruiterCommerceSummary() {
  const key = getRecruiterCommerceStorageKey();
  try {
    const stored = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.current_plan && parsed.credits) {
        if (!Array.isArray(parsed.usage_jobs)) parsed.usage_jobs = [];
        return parsed;
      }
    }
  } catch {}
  const defaults = getDefaultCommerceSummary();
  saveRecruiterCommerceSummary(defaults);
  return defaults;
}

export async function fetchCommerceSummaryService() {
  const key = getRecruiterCommerceStorageKey();
  try {
    const url = `${API_BASE_URL}/accounts/recruiter/commerce-summary/`;
    const response = await authenticatedFetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data && data.credits) {
        if (!Array.isArray(data.usage_jobs)) data.usage_jobs = [];
        saveRecruiterCommerceSummary(data);
        return data;
      }
    }
  } catch {
    // Fallback gracefully to offline/local storage
  }
  return getRecruiterCommerceSummary();
}

/**
 * Checks if the recruiter currently has a valid active plan and credits to post a job.
 */
export function checkRecruiterPlanStatus() {
  const commerce = getRecruiterCommerceSummary();
  const plan = commerce.current_plan || null;
  const credits = commerce.credits?.available ?? commerce.usage?.remaining ?? 0;
  const totalAllowance = commerce.credits?.total_allowance ?? commerce.usage?.allowance ?? 0;
  const usedCredits = commerce.credits?.used ?? commerce.usage?.used ?? 0;

  let isExpired = false;
  let daysRemaining = 0;

  if (plan?.valid_until) {
    const expiryTime = new Date(plan.valid_until).getTime();
    if (!isNaN(expiryTime)) {
      const diffDays = Math.ceil((expiryTime - Date.now()) / (1000 * 60 * 60 * 24));
      daysRemaining = Math.max(0, diffDays);
      if (diffDays <= 0) {
        isExpired = true;
      }
    }
  }

  const hasActivePlan = !!(plan && plan.id);
  const canPostJob = hasActivePlan && !isExpired && credits > 0;

  return {
    hasActivePlan,
    planId: plan?.id || null,
    planName: plan?.name || 'No Active Plan',
    validUntil: plan?.valid_until || 'N/A',
    isExpired,
    daysRemaining,
    availableCredits: credits,
    totalAllowance,
    usedCredits,
    canPostJob
  };
}

/**
 * Deducts 1 job credit when a job is published, logs to usage_jobs & transactions,
 * and triggers smart notifications.
 */
export async function deductJobCreditService({ jobId, jobTitle, listingDays = 30 }) {
  const commerce = getRecruiterCommerceSummary();
  const status = checkRecruiterPlanStatus();

  if (status.isExpired) {
    return {
      success: false,
      reason: 'PLAN_EXPIRED',
      message: `Your ${status.planName} expired on ${status.validUntil}. Please renew your plan to post jobs.`
    };
  }

  if (status.availableCredits <= 0) {
    return {
      success: false,
      reason: 'NO_CREDITS',
      message: `You have exhausted all ${status.totalAllowance} job posting credits. Please select a plan to replenish credits.`
    };
  }

  // Deduct 1 credit
  const newAvailable = Math.max(0, commerce.credits.available - 1);
  const newUsed = (commerce.credits.used || 0) + 1;

  commerce.credits.available = newAvailable;
  commerce.credits.used = newUsed;

  if (commerce.usage) {
    commerce.usage.remaining = newAvailable;
    commerce.usage.used = newUsed;
  }

  const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Add to Job Usage History
  const usageRecord = {
    id: jobId || `job_${Date.now()}`,
    title: jobTitle || 'Untitled Job Position',
    date: todayStr,
    credits_deducted: 1,
    duration_days: listingDays || commerce.current_plan?.duration_days || 30,
    remaining_balance: newAvailable,
    status: 'ACTIVE'
  };

  commerce.usage_jobs = [usageRecord, ...(commerce.usage_jobs || []).filter(j => j.id !== usageRecord.id)];

  // Add to Transactions log
  const txnRecord = {
    id: `TXN_${Date.now()}`,
    date: todayStr,
    description: `Job Posting: ${jobTitle || 'Job Position'} (-1 Credit)`,
    amount: 0,
    formatted_amount: "-1 Credit",
    status: "SUCCESS",
    invoice_url: null
  };

  commerce.transactions = [txnRecord, ...(commerce.transactions || [])];

  // Save changes
  saveRecruiterCommerceSummary(commerce);

  // Dispatch In-App Notification
  try {
    await addRecruiterNotification({
      title: 'Job Published Successfully',
      message: `1 credit used for "${jobTitle || 'Job Position'}". Remaining balance: ${newAvailable} credit(s).`,
      notification_type: 'JOB',
      reference_type: 'job',
      reference_id: jobId || null
    });

    // Low credit warning if balance is 2 or 1
    if (newAvailable <= 2 && newAvailable > 0) {
      await addRecruiterNotification({
        title: 'Low Job Credits Alert',
        message: `You only have ${newAvailable} job credit(s) left. Upgrade or buy credits to avoid hiring disruptions.`,
        notification_type: 'BILLING',
        reference_type: 'payment',
        reference_id: null
      });
    } else if (newAvailable === 0) {
      await addRecruiterNotification({
        title: 'Job Credits Exhausted',
        message: `You have used all job posting credits on your plan. Top up now to publish future jobs.`,
        notification_type: 'BILLING',
        reference_type: 'payment',
        reference_id: null
      });
    }
  } catch (err) {
    console.warn("Notification dispatch notice:", err);
  }

  return {
    success: true,
    remainingCredits: newAvailable,
    commerce
  };
}

export async function subscribePlanService({ planId, paymentMethod = 'CARD' }) {
  const status = checkRecruiterPlanStatus();
  if (status.hasActivePlan && !status.isExpired && status.availableCredits > 0) {
    return {
      success: false,
      message: `Your ${status.planName} is still active with ${status.availableCredits} credit(s) remaining (valid until ${status.validUntil}). You can purchase a new plan only after finishing your current plan.`
    };
  }

  const url = `${API_BASE_URL}/accounts/recruiter/commerce/subscribe/`;
  try {
    const response = await authenticatedFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: planId, payment_method: paymentMethod })
    });

    const resData = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        message: resData?.detail || 'Failed to activate plan.'
      };
    }

    const updatedCommerce = await fetchCommerceSummaryService();
    try {
      await addRecruiterNotification({
        title: 'Plan Activated Successfully',
        message: resData?.message || 'Your posting plan is now active.',
        notification_type: 'BILLING',
        reference_type: 'payment',
        reference_id: null
      });
    } catch {}

    return {
      success: true,
      message: resData?.message || 'Plan activated successfully!',
      commerce: updatedCommerce
    };
  } catch {
    return {
      success: false,
      message: 'Network error while activating plan. Please try again.'
    };
  }
}
