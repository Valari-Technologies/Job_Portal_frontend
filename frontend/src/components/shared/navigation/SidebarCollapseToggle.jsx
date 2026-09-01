import { useSidebarCollapse } from './SidebarCollapseContext';
import SidebarTooltip from './SidebarTooltip';

export default function SidebarCollapseToggle() {
  const { isCollapsed, toggleCollapse } = useSidebarCollapse();

  return (
    <SidebarTooltip text={isCollapsed ? "Open sidebar" : "Close sidebar"}>
      <button
        onClick={toggleCollapse}
        aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
        aria-expanded={!isCollapsed}
        className="p-2.5 rounded-xl transition-all duration-150 shrink-0 cursor-ew-resize focus:outline-none flex items-center justify-center hover:bg-white/5 active:scale-95"
        style={{ cursor: 'ew-resize' }}
      >
        {/* Figma sidebar layout toggle icon (custom SVG layout toggle) */}
        <svg 
          className="h-5.5 w-5.5 transition-colors" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Outline container box */}
          <rect x="3" y="3" width="18" height="18" rx="4" />
          {/* Split line divider */}
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
      </button>
    </SidebarTooltip>
  );
}
