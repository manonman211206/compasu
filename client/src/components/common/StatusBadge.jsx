import React from 'react';
import { cn } from '@/lib/utils';

export function StatusBadge({
  status = 'online',
  label,
  latency,
  className,
  ...props
}) {
  const isOnline = status === 'online';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border select-none',
        isOnline
          ? 'bg-[#101A18] text-[#D9FF35] border-[#D9FF35]/30'
          : 'bg-[#141C24] text-[#626B69] border-white/[0.06]',
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          isOnline ? 'bg-[#D9FF35] animate-pulse' : 'bg-[#626B69]'
        )}
      />
      <span>{label || (isOnline ? 'ONLINE' : 'OFFLINE')}</span>
      {latency && (
        <span className="text-[#626B69] border-l border-white/[0.08] pl-1.5">
          {latency}
        </span>
      )}
    </div>
  );
}
