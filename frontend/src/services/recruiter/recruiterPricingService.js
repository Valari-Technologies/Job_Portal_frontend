// Future Django integration:
// Load active PricingPlan records from the backend database.
// Endpoint boundary (when confirmed): GET /api/v1/pricing-plans/

export function getPostingPlans() {
  return [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      formatted_price: 'Free',
      duration_days: 30,
      credits: 10,
      is_free: true,
      features: [
        '10 Job Posting Credits included',
        '7 days active listing per job',
        'Standard search visibility',
        'Candidate Profile & Resume access'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 49,
      formatted_price: '₹ 49',
      duration_days: 30,
      credits: 50,
      recommended: true,
      is_free: false,
      features: [
        '50 Job Posting Credits included',
        '30 days active listing per job',
        'Featured listing tag',
        'Priority candidate search placement',
        'Social network sharing'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 69,
      formatted_price: '₹ 69',
      duration_days: 60,
      credits: 150,
      is_free: false,
      features: [
        '150 Job Posting Credits included',
        '60 days active listing per job',
        'Top of search placement',
        'Direct email blast to matching candidates',
        'Dedicated account support'
      ]
    }
  ];
}
