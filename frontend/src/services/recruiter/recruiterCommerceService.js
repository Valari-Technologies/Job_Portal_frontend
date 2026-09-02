// Future Django integration:
// PricingPlan, Payment, PaymentTransaction, Invoice and
// JobPostingEntitlement/Credit must remain separate.
//
// Wallet balance, available credits, active plan and plan usage must
// come from one backend-authoritative commerce summary.
//
// Update Payments and Dashboard only after server-side gateway
// verification, wallet-ledger posting and entitlement processing.
//
// Endpoint boundary (when confirmed): GET /api/v1/recruiter/commerce-summary/

export function getRecruiterCommerceSummary() {
  return {
    currency: "INR",
    wallet: {
      balance: 0,
      formatted_balance: "₹0.00"
    },
    credits: {
      available: 0
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

export async function fetchCommerceSummaryService() {
  // Future API fetch
  return getRecruiterCommerceSummary();
}
