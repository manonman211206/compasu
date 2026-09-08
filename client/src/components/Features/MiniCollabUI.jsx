import React from 'react';
import { Users, MousePointer, ShieldCheck } from 'lucide-react';

export default function MiniCollabUI() {
  const peers = [
    { name: 'manonman (You)', color: '#D9FF35', status: 'Editing AB-1 mesh', line: ':17' },
    { name: 'rahul.s', color: '#60A5FA', status: 'Viewing Central Library', line: ':04' },
    { name: 'priya.v', color: '#F472B6', status: 'Reviewing pull request', line: ':29' },
  ];

  return (
    <div className="w-full bg-[#070A10] border border-white/[0.06] rounded-lg p-3 font-mono text-[11px] select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-[#626B69] text-[10px]">
        <div className="flex items-center gap-1.5 text-[#F3F5F2]">
          <Users className="w-3.5 h-3.5 text-[#D9FF35]" />
          <span>Multiplayer Session (3 Live)</span>
        </div>
        <span className="text-[#626B69] flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#D9FF35]" />
          e2e locked
        </span>
      </div>

      <div className="space-y-1.5">
        {peers.map((p, idx) => (
          <div key={idx} className="flex items-center justify-between px-2 py-1 rounded bg-[#101A18]/40">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
              <span className="text-[#F3F5F2] font-medium truncate">{p.name}</span>
            </div>
            <span className="text-[#626B69] text-[10px] shrink-0">{p.line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
