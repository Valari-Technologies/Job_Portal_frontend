import { Download, CreditCard } from 'lucide-react';
import TransactionStatusBadge from './TransactionStatusBadge';

export default function TransactionHistoryTable({ transactions = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-150 p-6 space-y-4 shadow-xs">
      <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-600">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-800">
              {transactions.map((tx, idx) => (
                <tr key={tx.id || idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-slate-600 font-mono text-xs font-semibold">{tx.date}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">{tx.description}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">{tx.formatted_amount}</td>
                  <td className="py-4 px-4">
                    <TransactionStatusBadge status={tx.status} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    {tx.invoice_url ? (
                      <a
                        href={tx.invoice_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-8 text-center space-y-2 border border-slate-150">
          <CreditCard className="h-8 w-8 text-indigo-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">No transactions yet</h4>
          <p className="text-sm font-medium text-slate-600 max-w-sm mx-auto">
            Your verified plan purchases and billing transactions will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
