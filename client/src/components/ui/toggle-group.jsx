import React, { createContext, useContext } from 'react';
import { Toggle } from './toggle';
import { cn } from '@/lib/utils';

const ToggleGroupContext = createContext(null);

export function ToggleGroup({
  type = 'single',
  value,
  onValueChange,
  className,
  children,
  ...props
}) {
  const handleToggle = (itemValue) => {
    if (type === 'single') {
      onValueChange?.(value === itemValue ? '' : itemValue);
    } else {
      const arr = Array.isArray(value) ? [...value] : [];
      const idx = arr.indexOf(itemValue);
      if (idx > -1) arr.splice(idx, 1);
      else arr.push(itemValue);
      onValueChange?.(arr);
    }
  };

  return (
    <ToggleGroupContext.Provider value={{ value, handleToggle, type }}>
      <div className={cn('flex items-center gap-1', className)} {...props}>
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

export function ToggleGroupItem({ value, className, children, ...props }) {
  const context = useContext(ToggleGroupContext);
  const isPressed = context?.type === 'single'
    ? context?.value === value
    : Array.isArray(context?.value) && context?.value.includes(value);

  return (
    <Toggle
      pressed={isPressed}
      onPressedChange={() => context?.handleToggle(value)}
      className={cn('', className)}
      {...props}
    >
      {children}
    </Toggle>
  );
}
