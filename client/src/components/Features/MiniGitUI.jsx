import React from 'react';
import { GitBranch, GitCommit, GitMerge, Check } from 'lucide-react';

export default function MiniGitUI() {
  const commits = [
    { hash: 'e49f2b', msg: 'feat(mesh): vit-chennai academic block sync', branch: 'main', active: true },
    { hash: '92a11c', msg: 'fix(socket): drop latency to <9ms', branch: 'perf', active: false },
    { hash: '33b87d', msg: 'chore: enable end-to-end telemetry', branch: 'main', active: false },
  ];

  return (
    <div className="w-full bg-[#070A10] border border-white/[0.06] rounded-lg p-3 font-mono text-[11px] select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-[#626B69] text-[10px]">
        <div className="flex items-center gap-1.5 text-[#F3F5F2]">
          <GitBranch className="w-3.5 h-3.5 text-[#D9FF35]" />
          <span>branch: main</span>
        </div>
        <span className="text-[#D9FF35]">● 0 uncommitted</span>
      </div>

      <div className="space-y-1.5">
        {commits.map((c, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between p-1.5 rounded transition ${
              c.active ? 'bg-[#101A18] text-[#F3F5F2]' : 'text-[#A2AAA7] hover:bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <GitCommit className={`w-3.5 h-3.5 shrink-0 ${c.active ? 'text-[#D9FF35]' : 'text-[#626B69]'}`} />
              <span className="text-[#626B69] shrink-0">{c.hash}</span>
              <span className="truncate">{c.msg}</span>
            </div>
            {c.active && <Check className="w-3.5 h-3.5 text-[#D9FF35] shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}
