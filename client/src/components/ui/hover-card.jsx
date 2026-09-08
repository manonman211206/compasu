import React, { useState, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

const HoverCardContext = createContext(null);

export function HoverCard({ openDelay = 200, closeDelay = 200, children }) {
  const [open, setOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => setOpen(true), openDelay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => setOpen(false), closeDelay);
    setTimeoutId(id);
  };

  return (
    <HoverCardContext.Provider value={{ open, handleMouseEnter, handleMouseLeave }}>
      <div
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </HoverCardContext.Provider>
  );
}

export function HoverCardTrigger({ asChild, children, ...props }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, props);
  }
  return <span {...props}>{children}</span>;
}

export function HoverCardContent({
  className,
  align = 'center',
  children,
  ...props
}) {
  const { open } = useContext(HoverCardContext);

  if (!open) return null;

  const alignment = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  return (
    <div
      className={cn(
        'absolute z-50 mt-2 w-64 rounded-xl border border-white/[0.1] bg-[#0A0E14] p-4 text-[#F3F5F2] shadow-2xl font-mono text-xs animate-in fade-in-0 zoom-in-95',
        alignment[align] || alignment.center,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
