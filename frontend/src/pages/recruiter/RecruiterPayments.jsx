import { useState } from 'react';
import RecruiterLayout from '../../components/recruiter/common/RecruiterLayout';
import RecruiterPaymentsHeader from '../../components/recruiter/payments/RecruiterPaymentsHeader';
import CommerceSummaryCards from '../../components/recruiter/payments/CommerceSummaryCards';
import PaymentMethodCard from '../../components/recruiter/payments/PaymentMethodCard';
import BillingInfoCard from '../../components/recruiter/payments/BillingInfoCard';
import TransactionHistoryTable from '../../components/recruiter/payments/TransactionHistoryTable';
import { getRecruiterCommerceSummary } from '../../services/recruiter/recruiterCommerceService';

export default function RecruiterPayments() {
  const [commerceSummary] = useState(() => getRecruiterCommerceSummary());

  return (
    <RecruiterLayout activeTab="payments">
      <main className="p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* 1. Header */}
        <RecruiterPaymentsHeader />

        {/* 2. Top Summary Cards (Wallet, Job Credits, Current Plan, Usage) */}
        <CommerceSummaryCards commerceSummary={commerceSummary} />

        {/* 3. Middle Row: Payment Method & Billing Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <PaymentMethodCard lastMethod={commerceSummary.last_payment_method} />
          <BillingInfoCard />
        </div>

        {/* 4. Transaction History Table */}
        <TransactionHistoryTable transactions={commerceSummary.transactions} />
      </main>
    </RecruiterLayout>
  );
}
