import React from 'react';
import { AlertTriangle, RotateCcw, Home, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Universal ErrorBoundary Component
 * Protects Candidate, Recruiter (HR), Admin, and Super Admin portals from white-screen crashes.
 * Gracefully displays an elegant error recovery screen with Try Again and Dashboard navigation.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  getDashboardPath = () => {
    const path = window.location.pathname;
    if (path.startsWith('/super-admin')) return '/super-admin/overview';
    if (path.startsWith('/admin')) return '/admin/dashboard';
    if (path.startsWith('/recruiter')) return '/recruiter/dashboard';
    if (path.startsWith('/employer')) return '/employer/overview';
    return '/candidate/dashboard';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const portalTitle = this.props.portalTitle || 'TN Jobz Portal';
      const dashboardPath = this.getDashboardPath();

      return (
        <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-8 font-sans">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 text-center space-y-6 animate-scaleUp">
            
            {/* Warning Icon Badge */}
            <div className="h-16 w-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="h-8 w-8 stroke-[2.2]" />
            </div>

            {/* Error Title and Explanation */}
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                {portalTitle}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Something went wrong
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto leading-relaxed">
                This page encountered an unexpected issue, but your session and data are completely safe.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl bg-[#3B00FF] hover:bg-[#3000D6] text-white text-xs font-black flex items-center gap-2 shadow-md shadow-[#3B00FF]/20 transition-all cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Try Again</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Reload Page
              </button>

              <a
                href={dashboardPath}
                className="px-5 py-2.5 rounded-xl border border-indigo-100 bg-indigo-50/70 hover:bg-indigo-100 text-[#3B00FF] text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Home className="h-4 w-4" />
                <span>Go to Dashboard</span>
              </a>
            </div>

            {/* Collapsible Technical Error Details */}
            {this.state.error && (
              <div className="pt-2 text-left border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                  className="flex items-center justify-between w-full text-[11px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <span>Technical details</span>
                  {this.state.showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {this.state.showDetails && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto max-h-40 leading-relaxed shadow-inner">
                    <p className="text-rose-400 font-bold mb-1">{this.state.error?.toString()}</p>
                    {this.state.errorInfo?.componentStack && (
                      <pre className="text-[10px] text-slate-400 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
