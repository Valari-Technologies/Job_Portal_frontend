import { authenticatedFetch, getAuthenticatedUser } from '../auth/adminAuthService';

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
      valid_until: "Nov 30, 2026",
      is_free: true,
      features: [
        "10 Job Credits included",
        "7 days listing per job",
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
        date: "Oct 28, 2026",
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

export function getRecruiterCommerceSummary() {
  const key = getRecruiterCommerceStorageKey();
  try {
    const stored = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.current_plan) return parsed;
    }
  } catch {}
  return getDefaultCommerceSummary();
}

export async function fetchCommerceSummaryService() {
  const key = getRecruiterCommerceStorageKey();
  try {
    const url = `${API_BASE_URL}/accounts/recruiter/commerce-summary/`;
    const response = await authenticatedFetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data && data.current_plan) {
        try {
          sessionStorage.setItem(key, JSON.stringify(data));
          localStorage.setItem(key, JSON.stringify(data));
        } catch {}
        return data;
      }
    }
  } catch (err) {
    console.warn("Backend fetchCommerceSummaryService warning:", err);
  }
  return getRecruiterCommerceSummary();
}

export async function subscribePlanService({ planId, paymentMethod = 'CARD' }) {
  try {
    const url = `${API_BASE_URL}/accounts/recruiter/commerce/subscribe/`;
    const response = await authenticatedFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: planId, payment_method: paymentMethod })
    });
    if (response.ok) {
      const data = await response.json();
      const freshSummary = await fetchCommerceSummaryService();
      return { success: true, message: data.message, commerce: freshSummary };
    }
    const errData = await response.json().catch(() => ({}));
    return { success: false, message: errData.detail || 'Failed to activate plan.' };
  } catch (err) {
    console.warn("Subscription error:", err);
    return { success: false, message: 'Could not connect to payment service.' };
  }
}
