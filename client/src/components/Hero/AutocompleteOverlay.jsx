import React from 'react';
import { Box, Code, Cpu, FileCode2, Layers, Zap } from 'lucide-react';

export default function AutocompleteOverlay() {
  const suggestions = [
    { label: 'VITCampusMesh', type: 'class', icon: Box, detail: 'CampusPeerNode', selected: true },
    { label: 'locateNearbyPeers', type: 'method', icon: Zap, detail: '(radius: number) => Peer[]' },
    { label: 'openDirectChannel', type: 'method', icon: FileCode2, detail: '(peerId: string) => Socket' },
    { label: 'telemetryStream', type: 'property', icon: Cpu, detail: 'Observable<PingMetrics>' },
    { label: 'broadcastGeolocation', type: 'method', icon: Layers, detail: '(coords: LatLng) => void' },
  ];

  return (
    <div className="absolute top-28 left-12 sm:left-24 z-20 w-72 sm:w-80 bg-[#070A10]/95 backdrop-blur-md border border-white/[0.12] rounded-lg shadow-2xl p-1 font-mono text-[11px] select-none pointer-events-auto">
      {/* Autocomplete Header / Mode */}
      <div className="px-2.5 py-1 flex items-center justify-between text-[10px] text-[#626B69] border-b border-white/[0.06] mb-1">
        <span>IntelliSense • TypeScript</span>
        <span className="text-[#D9FF35]">Tab ⇥ to accept</span>
      </div>

      {/* Suggestion list */}
      <div className="space-y-0.5">
        {suggestions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                item.selected
                  ? 'bg-[#17231F] text-[#F3F5F2] border border-[#D9FF35]/30'
                  : 'text-[#A2AAA7] hover:bg-[#101A18]'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${item.selected ? 'text-[#D9FF35]' : 'text-[#626B69]'}`} />
                <span className={`truncate font-medium ${item.selected ? 'text-[#D9FF35]' : ''}`}>
                  {item.label}
                </span>
              </div>
              <span className="text-[10px] text-[#626B69] truncate max-w-[100px] ml-2">
                {item.detail}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
