import React from 'react';
import { Bug, Play, StepForward, Disc, CheckCircle2 } from 'lucide-react';

export default function MiniDebuggerUI() {
  const variables = [
    { name: 'activeCampus', val: '"VIT_CHENNAI"', type: 'string' },
    { name: 'meshLatency', val: '8.4', unit: 'ms', type: 'number' },
    { name: 'peersConnected', val: '14', type: 'number' },
    { name: 'isEncrypted', val: 'true', type: 'boolean' },
  ];

  return (
    <div className="w-full bg-[#070A10] border border-white/[0.06] rounded-lg p-3 font-mono text-[11px] select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-[#626B69] text-[10px]">
        <div className="flex items-center gap-1.5 text-[#F3F5F2]">
          <Disc className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
          <span>PAUSED ON BREAKPOINT :12</span>
        </div>
        <div className="flex items-center gap-2">
          <Play className="w-3 h-3 text-[#D9FF35] cursor-pointer hover:scale-110 transition" />
          <StepForward className="w-3 h-3 text-[#A2AAA7] cursor-pointer hover:scale-110 transition" />
        </div>
      </div>

      <div className="space-y-1">
        {variables.map((v, idx) => (
          <div key={idx} className="flex items-center justify-between px-1.5 py-1 rounded bg-[#101A18]/50">
            <span className="text-[#A2AAA7]">{v.name}</span>
            <span className="text-[#D9FF35]">
              {v.val} {v.unit && <span className="text-[#626B69]">{v.unit}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
