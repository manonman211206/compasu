import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserPill({
  user,
  avatarSrc,
  showStatus = true,
  status = 'online',
  className,
  onClick,
}) {
  const username = user?.username || user?.name || 'user';
  const initial = username.charAt(0).toUpperCase();

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-2 py-1 rounded-lg border border-white/[0.06] bg-[#0A0E14] text-xs font-mono select-none',
        onClick && 'cursor-pointer hover:bg-[#101A18] hover:border-[#D9FF35]/30 transition',
        className
      )}
    >
      <Avatar className="w-6 h-6 border-[#D9FF35]/30">
        {avatarSrc && <AvatarImage src={avatarSrc} alt={username} />}
        <AvatarFallback className="text-[10px] text-[#D9FF35] bg-[#101A18]">
          {initial}
        </AvatarFallback>
      </Avatar>
      <span className="text-[#F3F5F2] font-medium truncate">@{username}</span>
      {showStatus && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full ml-auto',
            status === 'online' ? 'bg-[#D9FF35] animate-pulse' : 'bg-[#626B69]'
          )}
        />
      )}
    </div>
  );
}
