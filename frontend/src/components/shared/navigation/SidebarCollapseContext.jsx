/* eslint-disable react-refresh/only-export-components */
import { useState, createContext, useContext } from 'react';

const SidebarCollapseContext = createContext(null);

export function SidebarCollapseProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(prev => !prev);

  return (
    <SidebarCollapseContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </SidebarCollapseContext.Provider>
  );
}

export function useSidebarCollapse() {
  const context = useContext(SidebarCollapseContext);
  if (!context) {
    // Fallback safe defaults if used outside provider
    return { isCollapsed: false, toggleCollapse: () => {} };
  }
  return context;
}
