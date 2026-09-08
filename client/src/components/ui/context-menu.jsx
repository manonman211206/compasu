import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

const ContextMenuContext = createContext(null);

export function ContextMenu({ children }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <ContextMenuContext.Provider value={{ open, setOpen, position, setPosition }}>
      <div className="relative">{children}</div>
    </ContextMenuContext.Provider>
  );
}

export function ContextMenuTrigger({ className, children, ...props }) {
  const { setOpen, setPosition } = useContext(ContextMenuContext);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };

  return (
    <div onContextMenu={handleContextMenu} className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export function ContextMenuContent({ className, children, ...props }) {
  const { open, setOpen, position } = useContext(ContextMenuContext);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('contextmenu', handleClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('contextmenu', handleClick);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
      className={cn(
        'fixed z-50 min-w-[8rem] overflow-hidden rounded-lg border border-white/[0.1] bg-[#0A0E14] p-1 text-[#F3F5F2] shadow-2xl font-mono text-xs animate-in fade-in-0 zoom-in-95',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ContextMenuItem({
  className,
  inset,
  disabled = false,
  onClick,
  children,
  ...props
}) {
  const { setOpen } = useContext(ContextMenuContext);

  return (
    <div
      role="menuitem"
      onClick={(e) => {
        if (disabled) return;
        onClick?.(e);
        setOpen(false);
      }}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-md px-2.5 py-1.5 text-xs font-mono outline-none hover:bg-[#14201D] hover:text-[#D9FF35] focus:bg-[#14201D] focus:text-[#D9FF35]',
        inset && 'pl-8',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ContextMenuLabel({ className, inset, children, ...props }) {
  return (
    <div
      className={cn(
        'px-2.5 py-1.5 text-[10px] font-semibold text-[#626B69] uppercase tracking-wider',
        inset && 'pl-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ContextMenuSeparator({ className, ...props }) {
  return <div className={cn('-mx-1 my-1 h-px bg-white/[0.06]', className)} {...props} />;
}
