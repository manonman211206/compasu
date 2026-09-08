import React from 'react';
import AutocompleteOverlay from './AutocompleteOverlay';
import { FileCode, Terminal, Check, Copy } from 'lucide-react';

export default function CodeEditorHero() {
  const codeLines = [
    { num: '01', code: "import { CampusMesh, GeolocationNode } from '@compasu/core';" },
    { num: '02', code: '' },
    { num: '03', code: 'export const node = new CampusMesh({' },
    { num: '04', code: "  campus: 'VIT_CHENNAI'," },
    { num: '05', code: '  coordinates: { lat: 12.84064, lng: 80.15343 },' },
    { num: '06', code: '  telemetry: { intervalMs: 800, encryption: "AES-GCM" },' },
    { num: '07', code: '});' },
    { num: '08', code: '' },
    { num: '09', code: '// Auto-discover nearby peer nodes in Academic Block 1' },
    { num: '10', code: 'node.on("peer:connect", async (peer) => {' },
    { num: '11', code: '  await peer.syncSpatialRadar({' },
    { num: '12', code: '    landmark: "Netaji Subhas Chandra Bose Block",' },
    { num: '13', code: '    latencyMs: 8.4' },
    { num: '14', code: '  });' },
    { num: '15', code: '});' },
    { num: '16', code: '' },
    { num: '17', code: 'node.broadcastStatus("ACTIVE");' },
  ];

  return (
    <div className="relative w-full h-full min-h-[420px] bg-[#0A0E14] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono text-[12px] leading-relaxed">
      {/* Editor Tab Bar */}
      <div className="h-10 bg-[#070A10] border-b border-white/[0.06] px-4 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1C242C] border border-white/[0.1]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#1C242C] border border-white/[0.1]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#1C242C] border border-white/[0.1]" />
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-[#101A18] border-t-2 border-t-[#D9FF35] border-x border-x-white/[0.06] text-[#F3F5F2] text-[11px] rounded-t">
            <FileCode className="w-3.5 h-3.5 text-[#D9FF35]" />
            <span>mesh.config.ts</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 text-[#626B69] text-[11px] hover:text-[#A2AAA7] transition">
            <FileCode className="w-3.5 h-3.5" />
            <span>radar.worker.ts</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#626B69]">
          <span className="hidden sm:inline text-[#D9FF35]">● connected (8ms)</span>
          <span>UTF-8</span>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-4 overflow-x-auto relative select-text">
        <div className="space-y-1">
          {codeLines.map((line, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-4 px-1.5 py-0.5 rounded ${
                line.num === '10' ? 'bg-[#101A18] border-l-2 border-[#D9FF35]' : ''
              }`}
            >
              <span className="text-[#626B69] w-6 shrink-0 text-right select-none text-[11px]">
                {line.num}
              </span>
              <span className="text-[#A2AAA7] whitespace-pre">
                {line.code.startsWith('//') ? (
                  <span className="text-[#626B69] italic">{line.code}</span>
                ) : line.code.includes('import') || line.code.includes('export') || line.code.includes('const') || line.code.includes('new') ? (
                  <span>
                    <span className="text-[#D9FF35] font-semibold">{line.code.split(' ')[0]} </span>
                    {line.code.substring(line.code.indexOf(' ') + 1)}
                  </span>
                ) : (
                  line.code
                )}
                {line.num === '17' && (
                  <span className="inline-block w-2 h-4 bg-[#D9FF35] ml-1 translate-y-0.5 animate-pulse" />
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Floating IDE Autocomplete Overlay */}
        <AutocompleteOverlay />
      </div>

      {/* Editor Status Bar */}
      <div className="h-7 bg-[#070A10] border-t border-white/[0.06] px-4 flex items-center justify-between text-[10px] text-[#626B69]">
        <div className="flex items-center gap-4">
          <span className="text-[#A2AAA7] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9FF35]" />
            TypeScript 5.4.2
          </span>
          <span>Ln 17, Col 28</span>
        </div>
        <div>
          <span>VIT Chennai • Peer Mesh v2.4</span>
        </div>
      </div>
    </div>
  );
}
