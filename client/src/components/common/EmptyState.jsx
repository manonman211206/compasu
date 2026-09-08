import React from 'react';
import { Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function EmptyState({
  icon: Icon = Terminal,
  title = 'No items found',
  description,
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-6 font-mono text-xs',
        className
      )}
    >
      <div className="w-10 h-10 rounded-lg bg-[#101A18] border border-white/[0.08] flex items-center justify-center text-[#D9FF35] mb-3 shadow-md">
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="text-xs font-semibold text-[#F3F5F2]">{title}</h4>
      {description && (
        <p className="text-[11px] text-[#626B69] max-w-xs mt-1 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          variant="lime"
          size="sm"
          onClick={onAction}
          className="mt-3 font-mono text-[11px]"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
