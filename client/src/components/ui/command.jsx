import React, { useState, createContext, useContext } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const CommandContext = createContext(null);

export function Command({ className, children, ...props }) {
  const [search, setSearch] = useState('');

  return (
    <CommandContext.Provider value={{ search, setSearch }}>
      <div
        className={cn(
          'flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/[0.1] bg-[#0A0E14] text-[#F3F5F2] font-mono text-xs shadow-2xl',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
}

export function CommandInput({ className, placeholder = 'Type a command or search...', ...props }) {
  const { search, setSearch } = useContext(CommandContext);

  return (
    <div className="flex items-center border-b border-white/[0.08] px-3">
      <Search className="mr-2 h-3.5 w-3.5 shrink-0 opacity-50 text-[#A2AAA7]" />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'flex h-10 w-full rounded-md bg-transparent py-3 text-xs font-mono outline-none placeholder:text-[#626B69] disabled:cursor-not-allowed disabled:opacity-50 text-[#F3F5F2]',
          className
        )}
        {...props}
      />
    </div>
  );
}

export function CommandList({ className, children, ...props }) {
  return (
    <div
      className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden p-1', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CommandEmpty({ className, children = 'No results found.', ...props }) {
  return (
    <div
      className={cn('py-6 text-center text-xs font-mono text-[#626B69]', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CommandGroup({ heading, className, children, ...props }) {
  return (
    <div className={cn('overflow-hidden p-1 text-[#F3F5F2]', className)} {...props}>
      {heading && (
        <div className="px-2 py-1.5 text-[10px] font-semibold text-[#626B69] uppercase tracking-wider">
          {heading}
        </div>
      )}
      {children}
    </div>
  );
}

export function CommandItem({ className, disabled = false, onSelect, children, ...props }) {
  return (
    <div
      role="option"
      onClick={() => !disabled && onSelect?.()}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-xs font-mono outline-none hover:bg-[#14201D] hover:text-[#D9FF35] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CommandSeparator({ className, ...props }) {
  return <div className={cn('-mx-1 h-px bg-white/[0.06]', className)} {...props} />;
}

export function CommandShortcut({ className, ...props }) {
  return (
    <span
      className={cn('ml-auto text-[10px] tracking-widest text-[#626B69]', className)}
      {...props}
    />
  );
}
