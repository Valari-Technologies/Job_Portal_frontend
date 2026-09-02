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
      duration_days: 7,
      is_free: true,
      features: [
        '7 days listing',
        'Standard search visibility'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 49,
      formatted_price: '₹ 49',
      duration_days: 30,
      recommended: true,
      features: [
        '30 days listing',
        'Featured listing tag',
        'Social network sharing'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 69,
      formatted_price: '₹ 69',
      duration_days: 60,
      features: [
        '60 days listing',
        'Top of search placement',
        'Email blast to matching candidates',
        'Dedicated account support'
      ]
    }
  ];
}
