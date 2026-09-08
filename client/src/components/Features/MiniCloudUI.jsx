import React from 'react';
import { Cloud, CheckCircle2, ArrowUpRight, Cpu } from 'lucide-react';

export default function MiniCloudUI() {
  return (
    <div className="w-full bg-[#070A10] border border-white/[0.06] rounded-lg p-3 font-mono text-[11px] select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-[#626B69] text-[10px]">
        <div className="flex items-center gap-1.5 text-[#F3F5F2]">
          <Cloud className="w-3.5 h-3.5 text-[#D9FF35]" />
          <span>vit-chennai.mesh.compasu.dev</span>
        </div>
        <span className="text-[#D9FF35] flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Healthy
        </span>
      </div>

      <div className="space-y-1 text-[#A2AAA7]">
        <div className="flex justify-between items-center text-[10px] bg-[#101A18]/40 px-2 py-1 rounded">
          <span>Container State</span>
          <span className="text-[#D9FF35]">RUNNING • 0.12 CPU</span>
        </div>
        <div className="flex justify-between items-center text-[10px] bg-[#101A18]/40 px-2 py-1 rounded">
          <span>Campus Edge Region</span>
          <span className="text-[#F3F5F2]">ap-south-1 (Chennai)</span>
        </div>
        <div className="flex justify-between items-center text-[10px] bg-[#101A18]/40 px-2 py-1 rounded">
          <span>Active WebSockets</span>
          <span className="text-[#D9FF35]">48 Connections</span>
        </div>
      </div>
    </div>
  );
}
