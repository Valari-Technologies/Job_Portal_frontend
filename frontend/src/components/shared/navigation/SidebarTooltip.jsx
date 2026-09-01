import { useState, useEffect, useRef } from 'react';

export default function SidebarTooltip({ text, children, positionClass = "left-full ml-3" }) {
  const [delayedVisible, setDelayedVisible] = useState(false);
  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDelayedVisible(true);
    }, 200); // 150ms-250ms delay
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDelayedVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleMouseLeave}
      onFocusCapture={handleMouseEnter}
      onBlurCapture={handleMouseLeave}
    >
      {children}
      {delayedVisible && (
        <div 
          className={`fixed pointer-events-none z-[999] bg-[#0f172a] text-white text-[12px] font-medium px-2.5 py-1.5 rounded-lg shadow-md whitespace-nowrap animate-fadeIn transition-opacity duration-150 ${positionClass}`}
          style={{ cursor: 'default' }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
