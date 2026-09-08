import React from 'react';
import { cn } from '@/lib/utils';

export function NavigationMenu({ className, children, ...props }) {
  return (
    <nav
      className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center font-mono', className)}
      {...props}
    >
      {children}
    </nav>
  );
}

export function NavigationMenuList({ className, children, ...props }) {
  return (
    <ul
      className={cn('group flex flex-1 list-none items-center justify-center space-x-1 p-1', className)}
      {...props}
    >
      {children}
    </ul>
  );
}

export function NavigationMenuItem({ className, children, ...props }) {
  return <li className={cn('relative', className)} {...props}>{children}</li>;
}

export function NavigationMenuLink({ className, children, ...props }) {
  return (
    <a
      className={cn(
        'group inline-flex h-9 w-max items-center justify-center rounded-md px-3 py-2 text-xs font-medium transition-colors hover:bg-[#101A18] hover:text-[#D9FF35] focus:bg-[#101A18] focus:text-[#D9FF35] focus:outline-none disabled:pointer-events-none disabled:opacity-50 text-[#A2AAA7]',
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
