import { useState, useEffect, useCallback } from 'react';
import ReportsTable from '../../../components/superAdmin/superAdminReports/ReportsTable';
import ReportDetailsPanel from '../../../components/superAdmin/superAdminReports/ReportDetailsPanel';
import InspectReportModal from '../../../components/superAdmin/superAdminReports/InspectReportModal';
import { fetchJobReportsService, reportDecisionService } from '../../../services/superAdmin/superAdminReportsService';

export default function SuperAdminReports() {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState({ open_count: 0, reviewed_count: 0, dismissed_count: 0, total_count: 0 });
  const [selectedReport, setSelectedReport] = useState(null);
  const [inspectModalReport, setInspectModalReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [actionFeedback, setActionFeedback] = useState({ message: '', isError: false });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('');

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchJobReportsService({
        search: searchQuery,
        status: statusFilter,
        location: locationFilter
      });
      setReports(data.results || []);
      setSummary(data.summary || { open_count: 0, reviewed_count: 0, dismissed_count: 0, total_count: 0 });
      if (data.results && data.results.length > 0) {
        setSelectedReport(prev => {
          if (!prev) return data.results[0];
          const match = data.results.find(r => r.id === prev.id);
          return match || data.results[0];
        });
      } else {
        setSelectedReport(null);
      }
    } catch (err) {
      console.error("Failed to load job reports:", err);
      setError("Unable to load job reports queue. Please check server connection.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, locationFilter]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleDecision = async (reportId, payload) => {
    setIsSubmitting(true);
    setActionFeedback({ message: '', isError: false });
    try {
      const res = await reportDecisionService(reportId, payload);
      if (res.success) {
        setActionFeedback({ message: res.data?.message || 'Report decision recorded successfully.', isError: false });
        await loadReports();
        setInspectModalReport(null);
      } else {
        setActionFeedback({ message: res.message || 'Failed to submit decision.', isError: true });
      }
    } catch (err) {
      setActionFeedback({ message: err.message || 'An unexpected error occurred.', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (reports.length === 0) return;

    const headers = ['Report ID', 'Job ID', 'Job Title', 'Company', 'Reason', 'Status', 'Reporter Email', 'Submitted At'];
    const rows = reports.map(r => [
      r.id,
      r.job_id || r.job,
      `"${(r.job_title || '').replace(/"/g, '""')}"`,
      `"${(r.company_name || '').replace(/"/g, '""')}"`,
      `"${(r.reason_display || r.reason || '').replace(/"/g, '""')}"`,
      r.status,
      r.reported_by_email || '',
      r.created_at || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TN_Jobz_Job_Reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="border-b border-slate-150 pb-5">
        <h1 className="text-3xl font-black text-slate-805 tracking-tight">TN Jobz Reports & safety</h1>
        <p className="text-base font-bold text-slate-500 mt-1.5">
          Review reported job posts and enforce platform trust & moderation policies.
        </p>
      </div>

      {actionFeedback.message && (
        <div className={`p-4 rounded-xl text-xs font-extrabold flex items-center justify-between ${
          actionFeedback.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          <span>{actionFeedback.message}</span>
          <button 
            type="button"
            onClick={() => setActionFeedback({ message: '', isError: false })} 
            className="text-slate-400 hover:text-slate-600 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs">
          <span className="text-xs font-black text-amber-600 uppercase block">Open Reports (Pending)</span>
          <span className="text-2xl font-black text-slate-800 mt-2 block">{summary.open_count}</span>
        </div>
        <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs">
          <span className="text-xs font-black text-emerald-600 uppercase block">Action Taken (Reviewed)</span>
          <span className="text-2xl font-black text-slate-800 mt-2 block">{summary.reviewed_count}</span>
        </div>
        <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-2xs">
          <span className="text-xs font-black text-slate-500 uppercase block">Dismissed Reports</span>
          <span className="text-2xl font-black text-slate-800 mt-2 block">{summary.dismissed_count}</span>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-4.5 w-4.5 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by job, company, reason, description..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending Review</option>
          <option value="REVIEWED">Action Taken (Reviewed)</option>
          <option value="REJECTED">Dismissed</option>
        </select>

        <div className="relative">
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Filter location..."
            className="rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-semibold text-slate-800 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={reports.length === 0}
          title={reports.length === 0 ? "There are no job reports to export." : "Export filtered reports to CSV"}
          className={`flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-extrabold transition-colors ${
            reports.length > 0 
              ? 'bg-white hover:bg-slate-50 text-slate-800 shadow-2xs cursor-pointer' 
              : 'bg-slate-50 text-slate-400 cursor-not-allowed'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Export CSV</span>
        </button>
      </div>

      {/* Content Area */}
      {error ? (
        <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center space-y-3">
          <p className="text-sm font-bold text-red-700">{error}</p>
          <button
            type="button"
            onClick={loadReports}
            className="px-4 py-2 rounded-xl bg-white border border-red-200 text-xs font-extrabold text-red-800 shadow-xs hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
          {/* Left Table */}
          <div className="lg:col-span-2 space-y-4">
            <ReportsTable 
              reports={reports}
              selectedReport={selectedReport}
              onSelectReport={setSelectedReport}
              onOpenInspectModal={(r) => {
                setSelectedReport(r);
                setInspectModalReport(r);
              }}
              isLoading={isLoading}
            />
            <div className="text-xs font-bold text-slate-500">
              Showing {reports.length} of {summary.total_count || reports.length} reports
            </div>
          </div>

          {/* Right Details Panel - Sticky with internal scroll */}
          <div className="lg:sticky lg:top-6 self-start max-h-[calc(100vh-90px)] overflow-y-auto space-y-6 pr-1">
            <ReportDetailsPanel 
              selectedReport={selectedReport}
              onDecision={handleDecision}
              onOpenInspectModal={(r) => setInspectModalReport(r || selectedReport)}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Inspect / Moderation Modal */}
      <InspectReportModal
        report={inspectModalReport}
        isOpen={!!inspectModalReport}
        onClose={() => setInspectModalReport(null)}
        onDecision={handleDecision}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
