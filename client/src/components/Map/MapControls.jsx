import React from 'react';
import { Target, Navigation, Terminal, MapPin, X, Compass, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function MapControls({
  isSettingMeetingPoint,
  onToggleSetMeetingPoint,
  activeMeetingPoint,
  onClearMeetingPoint,
  onFitAll,
  onCenterUser,
  onCenterVIT,
  showLandmarks,
  onToggleLandmarks,
  landmarksCount = 0,
  showFriends,
  onToggleFriends,
  friendsCount = 0,
}) {
  return (
    <TooltipProvider>
      {/* Top Left Status & Mode Banner */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 font-mono text-xs select-none pointer-events-none">
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Radar Node Badge */}
          <div className="bg-[#0A0E14]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/[0.08] text-[#F3F5F2] flex items-center gap-2 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-[#D9FF35] animate-pulse" />
            <span className="text-[11px] font-semibold text-[#D9FF35]">SPATIAL RADAR</span>
            <span className="text-[#626B69] hidden sm:inline">12.8406° N, 80.1534° E</span>
          </div>

          {/* Layer Toggles */}
          <div className="bg-[#0A0E14]/90 backdrop-blur-md p-1 rounded-lg border border-white/[0.08] flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleLandmarks}
              className={`px-2 py-1 rounded text-[11px] transition font-mono ${
                showLandmarks ? 'bg-[#17231F] text-[#D9FF35] border border-[#D9FF35]/30 font-semibold' : 'text-[#626B69]'
              }`}
            >
              Landmarks ({landmarksCount})
            </button>
            <button
              type="button"
              onClick={onToggleFriends}
              className={`px-2 py-1 rounded text-[11px] transition font-mono ${
                showFriends ? 'bg-[#17231F] text-[#D9FF35] border border-[#D9FF35]/30 font-semibold' : 'text-[#626B69]'
              }`}
            >
              Peers ({friendsCount})
            </button>
          </div>
        </div>

        {/* Set Meeting Point Active Callout */}
        {isSettingMeetingPoint && (
          <div className="pointer-events-auto flex items-center gap-2 bg-[#D9FF35] text-[#070A10] px-3 py-1.5 rounded-lg font-bold text-xs shadow-[0_0_20px_rgba(217,255,53,0.4)] animate-pulse border border-[#070A10]/20">
            <Target className="w-4 h-4 animate-spin" />
            <span>CLICK ANYWHERE ON MAP TO DROP SHARED MEETING POINT</span>
            <button
              type="button"
              onClick={onToggleSetMeetingPoint}
              className="ml-2 hover:opacity-75 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Active Meeting Point Info Badge */}
        {activeMeetingPoint && !isSettingMeetingPoint && (
          <div className="pointer-events-auto flex items-center gap-2 bg-[#101A18]/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#D9FF35]/40 text-[#F3F5F2] shadow-xl">
            <Target className="w-3.5 h-3.5 text-[#D9FF35]" />
            <div>
              <span className="text-[10px] text-[#626B69] uppercase mr-1">Target:</span>
              <span className="font-semibold text-[#D9FF35] text-xs">
                {activeMeetingPoint.title || 'Campus Destination'}
              </span>
            </div>
            {onClearMeetingPoint && (
              <button
                type="button"
                onClick={onClearMeetingPoint}
                className="ml-2 text-[#626B69] hover:text-red-400 p-0.5 transition"
                title="Clear meeting point"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Controls (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2 font-mono">
        {/* Set Meeting Point Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={isSettingMeetingPoint ? 'lime' : 'panel'}
              size="sm"
              onClick={onToggleSetMeetingPoint}
              className="flex items-center gap-1.5 shadow-xl font-mono text-[11px] h-9"
            >
              <Target className="w-3.5 h-3.5" />
              <span>{isSettingMeetingPoint ? 'Cancel Mode' : '+ Set Meeting Point'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {isSettingMeetingPoint ? 'Exit coordinate drop mode' : 'Click to drop a shared meeting point on map'}
          </TooltipContent>
        </Tooltip>

        {/* Fit Routes & All Peers */}
        {activeMeetingPoint && onFitAll && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="panel"
                size="sm"
                onClick={onFitAll}
                className="flex items-center gap-1.5 shadow-xl font-mono text-[11px] h-8 text-[#22d3ee] border-[#22d3ee]/30"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Fit All Routes</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Zoom out to fit all peers and destination</TooltipContent>
          </Tooltip>
        )}

        {/* VIT Campus Camera Reset */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="panel"
              size="sm"
              onClick={onCenterVIT}
              className="flex items-center gap-1.5 shadow-xl font-mono text-[11px] h-8 text-[#A2AAA7]"
            >
              <Terminal className="w-3 h-3 text-[#D9FF35]" />
              <span>VIT Campus</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Center map on VIT Chennai academic core</TooltipContent>
        </Tooltip>

        {/* GPS Locate Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="lime"
              size="sm"
              onClick={onCenterUser}
              className="flex items-center gap-1.5 shadow-xl font-mono text-[11px] h-9 font-bold"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Locate Me</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Lock camera onto your active GPS coordinates</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
