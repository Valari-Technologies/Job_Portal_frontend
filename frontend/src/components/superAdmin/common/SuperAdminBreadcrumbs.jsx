import { Link } from 'react-router-dom';
import { superAdminRouteMeta } from '../../../config/superAdminRouteMeta';

export default function SuperAdminBreadcrumbs({ pathname }) {
  const currentMeta = superAdminRouteMeta[pathname] || { section: null, label: "Overview" };

  return (
    <nav className="flex items-center gap-2 text-base text-slate-700" aria-label="Breadcrumb">
      <Link
        to="/super-admin/overview"
        aria-label="Go to Super Admin overview"
        title="Overview"
        className="text-slate-500 hover:text-teal-600 focus-visible:underline focus:outline-none transition-colors inline-flex items-center justify-center p-1"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </Link>

      {currentMeta.items ? (
        currentMeta.items.map((item, idx) => {
          const isLast = idx === currentMeta.items.length - 1;
          return (
            <span key={idx} className="flex items-center gap-2">
              <span className="text-slate-350" aria-hidden="true">/</span>
              {isLast ? (
                <span className="font-extrabold text-slate-805" aria-current="page">
                  {item.label}
                </span>
              ) : item.path ? (
                <Link to={item.path} className="font-extrabold text-slate-450 hover:text-teal-600 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className="font-extrabold text-slate-450">{item.label}</span>
              )}
            </span>
          );
        })
      ) : (
        <>
          {currentMeta.section && (
            <>
              <span className="text-slate-350" aria-hidden="true">/</span>
              <span className="font-extrabold text-slate-450">{currentMeta.section}</span>
            </>
          )}

          {currentMeta.section && <span className="text-slate-350" aria-hidden="true">/</span>}
          <span className="font-extrabold text-slate-805" aria-current="page">
            {currentMeta.label}
          </span>
        </>
      )}
    </nav>
  );
}
