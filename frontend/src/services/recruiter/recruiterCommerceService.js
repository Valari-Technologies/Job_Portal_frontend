import { authenticatedFetch, getAuthenticatedUser } from '../auth/adminAuthService';
import { addRecruiterNotification } from './recruiterNotificationsService';

const API_BASE_URL = 'http://127.0.0.1:8000';
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
  // Set validity to a future date matching realistic subscription window
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 65); // ~2 months out
  const validUntilStr = futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return {
    currency: "INR",
    wallet: {
      balance: 0,
      formatted_balance: "₹0.00"
    },
    credits: {
      available: 10,
      total_allowance: 10,
      used: 0
    },
    current_plan: {
      id: "basic",
      name: "Free Starter Plan",
      price: 0,
      formatted_price: "Free",
      duration_days: 30,
      valid_until: validUntilStr,
      is_free: true,
      features: [
        "10 Job Credits included",
        "7 days active listing per job",
        "Standard search visibility",
        "Candidate Profile & Resume access"
      ]
    },
    usage: {
      allowance: 10,
      used: 0,
      remaining: 10,
      is_unlimited: false
    },
    last_payment_method: null,
    transactions: [
      {
        id: "TXN_1001",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        description: "Free Starter Plan - 10 Credits Activation",
        amount: 0,
        formatted_amount: "₹0.00",
        status: "SUCCESS",
        invoice_url: null
      }
    ],
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
      if (data && data.current_plan) {
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
  const plan = commerce.current_plan || {};
  const credits = commerce.credits?.available ?? commerce.usage?.remaining ?? 0;
  const totalAllowance = commerce.credits?.total_allowance ?? commerce.usage?.allowance ?? 10;
  const usedCredits = commerce.credits?.used ?? commerce.usage?.used ?? 0;

  let isExpired = false;
  let daysRemaining = 30;

  if (plan.valid_until) {
    const expiryTime = new Date(plan.valid_until).getTime();
    if (!isNaN(expiryTime)) {
      const diffDays = Math.ceil((expiryTime - Date.now()) / (1000 * 60 * 60 * 24));
      daysRemaining = Math.max(0, diffDays);
      if (diffDays <= 0) {
        isExpired = true;
      }
    }
  }

  const canPostJob = !isExpired && credits > 0;

  return {
    hasActivePlan: !!plan.id,
    planId: plan.id || 'basic',
    planName: plan.name || 'Free Starter Plan',
    validUntil: plan.valid_until || 'No expiry',
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
  // Plan catalog definition
  const planCatalog = {
    basic: {
      id: "basic",
      name: "Free Starter Plan",
      price: 0,
      formatted_price: "Free",
      duration_days: 30,
      credits: 10,
      features: [
        "10 Job Credits included",
        "7 days active listing per job",
        "Standard search visibility",
        "Candidate Profile & Resume access"
      ]
    },
    professional: {
      id: "professional",
      name: "Professional Plan",
      price: 49,
      formatted_price: "₹49",
      duration_days: 30,
      credits: 50,
      features: [
        "50 Job Posting Credits included",
        "30 days active listing per job",
        "Featured listing tag",
        "Priority candidate search placement",
        "Social network sharing"
      ]
    },
    premium: {
      id: "premium",
      name: "Premium Plan",
      price: 69,
      formatted_price: "₹69",
      duration_days: 60,
      credits: 150,
      features: [
        "150 Job Posting Credits included",
        "60 days active listing per job",
        "Top of search placement",
        "Direct email blast to matching candidates",
        "Dedicated account support"
      ]
    }
  };

  const selected = planCatalog[planId] || planCatalog.basic;
  const commerce = getRecruiterCommerceSummary();

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + selected.duration_days);
  const validUntilStr = futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Update plan and add new credits
  commerce.current_plan = {
    id: selected.id,
    name: selected.name,
    price: selected.price,
    formatted_price: selected.formatted_price,
    duration_days: selected.duration_days,
    valid_until: validUntilStr,
    is_free: selected.price === 0,
    features: selected.features
  };

  // Stack/renew credits
  commerce.credits.total_allowance = selected.credits;
  commerce.credits.available = selected.credits;
  commerce.credits.used = 0;

  if (commerce.usage) {
    commerce.usage.allowance = selected.credits;
    commerce.usage.remaining = selected.credits;
    commerce.usage.used = 0;
  }

  commerce.last_payment_method = paymentMethod;

  // Add transaction record
  const txn = {
    id: `TXN_${Date.now()}`,
    date: todayStr,
    description: `${selected.name} Activation (${selected.credits} Credits)`,
    amount: selected.price,
    formatted_amount: selected.formatted_price,
    status: "SUCCESS",
    invoice_url: null
  };

  commerce.transactions = [txn, ...(commerce.transactions || [])];

  // Save changes locally
  saveRecruiterCommerceSummary(commerce);

  // Send in-app notification
  try {
    await addRecruiterNotification({
      title: 'Plan Activated Successfully',
      message: `${selected.name} is now active with ${selected.credits} job credits, valid until ${validUntilStr}.`,
      notification_type: 'BILLING',
      reference_type: 'payment',
      reference_id: null
    });
  } catch {}

  // Sync to backend if available
  try {
    const url = `${API_BASE_URL}/accounts/recruiter/commerce/subscribe/`;
    await authenticatedFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: planId, payment_method: paymentMethod })
    });
  } catch {}

  return { success: true, message: `${selected.name} activated successfully!`, commerce };
}
