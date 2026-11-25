import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';

/**
 * Portal-based 3-dot action menu that renders above overflow-clipped tables
 * without triggering scrollbars or clipping near table edges.
 */
export default function TableActionMenu({ items = [], ariaLabel = 'Actions menu' }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0, openUp: false });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const estimatedHeight = items.length * 40 + 16;
    const openUp = spaceBelow < estimatedHeight && rect.top > estimatedHeight;

    setCoords({
      top: openUp ? rect.top - 6 : rect.bottom + 6,
      right: Math.max(8, window.innerWidth - rect.right),
      openUp,
    });
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const handleScrollOrResize = () => {
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [open]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!open) {
      updatePosition();
    }
    setOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          open
            ? 'bg-slate-100 text-slate-800'
            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
        }`}
        aria-label={ariaLabel}
        aria-expanded={open}
      >
        <MoreVertical className="h-4.5 w-4.5" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: coords.top,
              right: coords.right,
              transform: coords.openUp ? 'translateY(-100%)' : 'none',
            }}
            className="w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 z-[9999] space-y-0.5 text-left"
          >
            {items.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (item.onClick) item.onClick();
                }}
                className={
                  item.className ||
                  'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-teal-600 rounded-lg transition-colors cursor-pointer'
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
