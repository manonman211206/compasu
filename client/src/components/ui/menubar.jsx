import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

const MenubarContext = createContext(null);

export function Menubar({ className, children, ...props }) {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <MenubarContext.Provider value={{ activeMenu, setActiveMenu }}>
      <div
        className={cn(
          'flex h-9 items-center space-x-1 rounded-lg border border-white/[0.08] bg-[#070A10] p-1 font-mono text-xs',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </MenubarContext.Provider>
  );
}

export function MenubarMenu({ value, children }) {
  return <div className="relative">{children}</div>;
}

export function MenubarTrigger({ value, className, children, ...props }) {
  const { activeMenu, setActiveMenu } = useContext(MenubarContext);
  const isOpen = activeMenu === value;

  return (
    <button
      type="button"
      onClick={() => setActiveMenu(isOpen ? null : value)}
      className={cn(
        'flex cursor-pointer select-none items-center rounded-sm px-2.5 py-1 text-xs font-mono font-medium outline-none transition-colors hover:bg-[#14201D] hover:text-[#D9FF35] focus:bg-[#14201D] focus:text-[#D9FF35]',
        isOpen && 'bg-[#14201D] text-[#D9FF35]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function MenubarContent({ value, className, children, ...props }) {
  const { activeMenu, setActiveMenu } = useContext(MenubarContext);
  const ref = useRef(null);
  const isOpen = activeMenu === value;

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isOpen, setActiveMenu]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'absolute left-0 z-50 mt-1 min-w-[10rem] overflow-hidden rounded-lg border border-white/[0.1] bg-[#0A0E14] p-1 text-[#F3F5F2] shadow-2xl font-mono text-xs animate-in fade-in-0 zoom-in-95',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function MenubarItem({ className, inset, disabled = false, onClick, children, ...props }) {
  const { setActiveMenu } = useContext(MenubarContext);

  return (
    <div
      role="menuitem"
      onClick={(e) => {
        if (disabled) return;
        onClick?.(e);
        setActiveMenu(null);
      }}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-xs font-mono outline-none hover:bg-[#14201D] hover:text-[#D9FF35]',
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

export function MenubarSeparator({ className, ...props }) {
  return <div className={cn('-mx-1 my-1 h-px bg-white/[0.06]', className)} {...props} />;
}
