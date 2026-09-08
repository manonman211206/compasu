import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DevNavbar from './components/Navbar/DevNavbar';
import {
  ChevronDown,
  ArrowRight,
  Star,
  Terminal,
  Cpu,
  GitBranch,
  Bug,
  Code2,
  Users,
  Cloud,
  Blocks,
  Shield,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Compass,
  Target,
  Navigation,
  MapPin,
} from 'lucide-react';

export default function Landing() {
  const [activeSimulationPoint, setActiveSimulationPoint] = useState('ab1');

  const simulationDestinations = [
    { id: 'ab1', name: 'Netaji Subhas Chandra Bose Block (AB-1)', code: 'AB1', eta: '3 min', dist: '240m' },
    { id: 'ab2', name: 'Academic Block 2 (CS Laboratories)', code: 'AB2', eta: '5 min', dist: '410m' },
    { id: 'lib', name: 'Central Digital Library', code: 'LIB', eta: '2 min', dist: '180m' },
    { id: 'gzb', name: 'Gazebo Student Commons', code: 'GZB', eta: '4 min', dist: '320m' },
  ];

  const featureCards = [
    {
      id: '01',
      tag: '01 — SPATIAL ENGINE',
      title: 'Multi-Origin Route Convergence',
      desc: 'Calculates real-time walking trajectories for you and every active peer simultaneously to any campus coordinate.',
      ui: (
        <div className="bg-[#070A10] border border-white/[0.08] rounded-lg p-3 font-mono text-[11px] space-y-2">
          <div className="flex justify-between items-center text-[10px] text-[#626B69] pb-1 border-b border-white/[0.06]">
            <span>routingService.ts</span>
            <span className="text-[#D9FF35]">● Mapbox Walking API</span>
          </div>
          <div className="space-y-1 text-[#A2AAA7]">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400">YOU → Target</span>
              <span className="text-[#F3F5F2] font-bold">2.4 min (190m)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#D9FF35]">@rahul → Target</span>
              <span className="text-[#F3F5F2] font-bold">4.1 min (340m)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-400">@priya → Target</span>
              <span className="text-[#F3F5F2] font-bold">5.8 min (490m)</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: '02',
      tag: '02 — SHARED NODES',
      title: 'Arbitrary Shared Meeting Points',
      desc: 'Drop a destination pin anywhere on campus with right-click, map HUD, or landmark cards. Instantly broadcasted to all peers.',
      ui: (
        <div className="bg-[#070A10] border border-white/[0.08] rounded-lg p-3 font-mono text-[11px] space-y-1.5">
          <div className="text-[#626B69] text-[10px]">// socket event payload</div>
          <div className="text-[#A2AAA7]">
            <span className="text-[#D9FF35]">socket</span>.emit(<span className="text-emerald-400">'set_meeting_point'</span>, {'{\n'}
            &nbsp;&nbsp;title: <span className="text-emerald-400">'AB1 Server Room'</span>,{'\n'}
            &nbsp;&nbsp;lat: <span className="text-cyan-400">12.8408</span>, lng: <span className="text-cyan-400">80.1532</span>{'\n'}
            {'}'});
          </div>
        </div>
      ),
    },
    {
      id: '03',
      tag: '03 — STABLE DOM BEACONS',
      title: 'Distinct User & Peer Beacons',
      desc: 'Zero-glitch DOM marker lifecycle with pulsing accuracy rings, custom cyan identity, and isolated CSS matrix transforms.',
      ui: (
        <div className="bg-[#070A10] border border-white/[0.08] rounded-lg p-3 font-mono text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[#F3F5F2] font-bold">YOU (Current Position)</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 text-[10px]">
            LOCKED
          </span>
        </div>
      ),
    },
    {
      id: '04',
      tag: '04 — CAMPUS MESH',
      title: 'Low-Latency Peer Telemetry',
      desc: 'Socket.IO peer streams synchronized with sub-10ms latency across VIT Chennai Kelambakkam campus mesh.',
      ui: (
        <div className="bg-[#070A10] border border-white/[0.08] rounded-lg p-3 font-mono text-[11px] space-y-1">
          <div className="flex justify-between text-[10px] text-[#626B69]">
            <span>NODE_LATENCY</span>
            <span className="text-[#D9FF35]">8.4ms</span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#D9FF35] h-full w-[88%]" />
          </div>
          <div className="text-[10px] text-[#A2AAA7] pt-1">Active peer sockets: 14 connected</div>
        </div>
      ),
    },
    {
      id: '05',
      tag: '05 — LANDMARK CORE',
      title: 'Academic Block Landmarks',
      desc: 'Pre-indexed VIT Chennai locations (AB-1, AB-2, Library, Gazebo, Hostels, Sports Complex) with instant one-click meeting triggers.',
      ui: (
        <div className="bg-[#070A10] border border-white/[0.08] rounded-lg p-2.5 font-mono text-[10px] grid grid-cols-2 gap-1.5">
          <div className="p-1.5 bg-[#14201D] border border-[#D9FF35]/30 rounded text-[#D9FF35]">[AB1] Academic 1</div>
          <div className="p-1.5 bg-[#10151A] border border-white/[0.06] rounded text-[#A2AAA7]">[AB2] CS Labs</div>
          <div className="p-1.5 bg-[#10151A] border border-white/[0.06] rounded text-[#A2AAA7]">[LIB] Library</div>
          <div className="p-1.5 bg-[#10151A] border border-white/[0.06] rounded text-[#A2AAA7]">[GZB] Gazebo</div>
        </div>
      ),
    },
    {
      id: '06',
      tag: '06 — PRIVACY CONTROLS',
      title: 'Zero-Knowledge Stealth Mode',
      desc: 'Toggle Ghost Mode instantly to stop telemetry broadcasting while retaining view access to active peer convergences.',
      ui: (
        <div className="bg-[#070A10] border border-white/[0.08] rounded-lg p-3 font-mono text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-[#D9FF35]" />
            <span className="text-[#F3F5F2]">Ghost Mode</span>
          </div>
          <span className="text-[10px] text-[#D9FF35] bg-[#D9FF35]/10 px-2 py-0.5 rounded font-bold">STEALTH READY</span>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#070A10] text-[#F3F5F2] font-sans antialiased selection:bg-[#D9FF35] selection:text-[#070A10] relative overflow-x-hidden">
      {/* Background subtle technical grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-60 pointer-events-none" />

      {/* Global Navigation */}
      <DevNavbar />

      {/* OVERSIZED TYPOGRAPHIC WORDMARK HERO */}
      <section className="relative pt-6 sm:pt-10 pb-20 px-4 sm:px-8 max-w-[1600px] mx-auto overflow-hidden">
        {/* Top Wordmark Banner */}
        <div className="w-full text-center select-none pb-4 sm:pb-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[clamp(4.8rem,14.5vw,13.5rem)] font-black font-editorial tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#F3F5F2] via-[#E2E8F0] to-[#626B69]/30 drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
              COMPASU
            </h1>
          </motion.div>
          <div className="flex items-center justify-center gap-3 font-mono text-xs sm:text-sm text-[#A2AAA7] mt-2">
            <span className="w-2 h-2 rounded-full bg-[#D9FF35] animate-pulse" />
            <span className="tracking-widest uppercase text-[#D9FF35] font-semibold">
              Meet anywhere. Move together.
            </span>
            <span className="hidden sm:inline text-[#626B69]">•</span>
            <span className="hidden sm:inline text-[#626B69]">VIT CHENNAI SPATIAL LAYER</span>
          </div>
        </div>

        {/* Layer 2: Main Floating Hero Panel */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[94vw] sm:max-w-[90vw] mx-auto bg-[#101A18] border border-white/[0.08] rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.9)] p-6 sm:p-10 md:p-12 transition-transform duration-300"
        >
          {/* Subtle green ambient accent line */}
          <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[#D9FF35]/40 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Side: Hero Narrative & Interactive Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#17231F] border border-[#D9FF35]/20 text-[11px] font-mono text-[#D9FF35]">
                <Target className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                <span>SPATIAL CONVERGENCE PROTOCOL v2.4</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-editorial text-[#F3F5F2] tracking-tight leading-[1.05]">
                Real-time campus radar and multi-peer walking trajectories.
              </h2>

              <p className="text-sm sm:text-base text-[#A2AAA7] leading-relaxed max-w-lg">
                Drop shared meeting targets anywhere across VIT Chennai. Compasu automatically calculates synchronized walking routes for you and every active peer node simultaneously.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/signup"
                  className="h-12 sm:h-13 px-7 sm:px-8 bg-[#D9FF35] hover:bg-[#CFFF24] text-[#080B0E] font-bold text-sm rounded-lg flex items-center gap-2 shadow-[0_0_25px_rgba(217,255,53,0.25)] transition duration-150 active:translate-y-0.5 font-mono"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Launch Campus Radar</span>
                </Link>

                <Link
                  to="/login"
                  className="h-12 sm:h-13 px-6 bg-[#17231F] hover:bg-[#14201D] text-[#F3F5F2] text-sm font-medium rounded-lg border border-white/[0.08] flex items-center gap-2 transition duration-150 font-mono"
                >
                  <Terminal className="w-4 h-4 text-[#D9FF35]" />
                  <span>Sign In</span>
                </Link>
              </div>

              {/* Quick Simulator Picker */}
              <div className="pt-4 border-t border-white/[0.06] space-y-2 font-mono text-xs">
                <span className="text-[11px] text-[#626B69] uppercase tracking-wider block">
                  Simulate destination convergence:
                </span>
                <div className="flex flex-wrap gap-2">
                  {simulationDestinations.map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => setActiveSimulationPoint(dest.id)}
                      className={`px-2.5 py-1.5 rounded text-[11px] transition flex items-center gap-1.5 ${
                        activeSimulationPoint === dest.id
                          ? 'bg-[#D9FF35] text-[#080B0E] font-bold shadow-[0_0_12px_rgba(217,255,53,0.3)]'
                          : 'bg-[#070A10] text-[#A2AAA7] border border-white/[0.08] hover:border-[#D9FF35]/40'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      <span>[{dest.code}] {dest.name.split('(')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: High-End Live Spatial Radar Preview Card */}
            <div className="lg:col-span-6 relative">
              <div className="bg-[#070A10] border border-white/[0.1] rounded-xl overflow-hidden shadow-2xl font-mono text-xs relative">
                {/* HUD Top Bar */}
                <div className="bg-[#0A0E14] px-4 py-2.5 border-b border-white/[0.08] flex items-center justify-between text-[#626B69]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D9FF35] animate-pulse" />
                    <span className="text-[#F3F5F2] font-semibold">RADAR_SIMULATOR // VIT_CHENNAI</span>
                  </div>
                  <span className="text-[#D9FF35] text-[10px]">12.8406° N, 80.1534° E</span>
                </div>

                {/* Simulated Visual Radar Graphic */}
                <div className="p-5 relative bg-[#080C10] min-h-[300px] flex flex-col justify-between overflow-hidden">
                  {/* Subtle Grid Backdrop */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(#D9FF35 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />

                  {/* Top Target Pill */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#101A18] border border-[#D9FF35]/40 text-[#D9FF35] text-[11px] font-bold shadow-lg">
                      <Target className="w-3.5 h-3.5" />
                      <span>
                        TARGET: {simulationDestinations.find((d) => d.id === activeSimulationPoint)?.name}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#D9FF35] text-[#070A10] font-extrabold text-[9px] uppercase tracking-wider">
                      ACTIVE
                    </span>
                  </div>

                  {/* Simulated Converging Route Lines and Nodes */}
                  <div className="relative my-6 py-4 flex flex-col gap-3 z-10">
                    {/* User Route Stream */}
                    <div className="flex items-center justify-between p-2.5 rounded bg-[#0D1418] border border-cyan-400/30 shadow-md">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                        <span className="text-cyan-300 font-bold">YOU (Sub-Meter GPS)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#A2AAA7] text-[10px]">
                        <span className="text-cyan-300 font-bold">
                          {simulationDestinations.find((d) => d.id === activeSimulationPoint)?.eta}
                        </span>
                        <span>({simulationDestinations.find((d) => d.id === activeSimulationPoint)?.dist})</span>
                      </div>
                    </div>

                    {/* Peer 1 Route Stream */}
                    <div className="flex items-center justify-between p-2.5 rounded bg-[#101A18] border border-[#D9FF35]/30 shadow-md">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#D9FF35]" />
                        <span className="text-[#F3F5F2] font-semibold">@rahul (AB-2 Node)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#A2AAA7] text-[10px]">
                        <span className="text-[#D9FF35] font-bold">4.2 min</span>
                        <span>(340m)</span>
                      </div>
                    </div>

                    {/* Peer 2 Route Stream */}
                    <div className="flex items-center justify-between p-2.5 rounded bg-[#121018] border border-purple-400/30 shadow-md">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        <span className="text-[#F3F5F2] font-semibold">@priya (Library Quiet Node)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#A2AAA7] text-[10px]">
                        <span className="text-purple-300 font-bold">5.8 min</span>
                        <span>(490m)</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Telemetry Status */}
                  <div className="relative z-10 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-[#626B69]">
                    <span>MAPBOX_DIRECTIONS // WALKING_PROFILE</span>
                    <span className="text-[#D9FF35]">SOCKET_MESH: SYNCHRONIZED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: FEATURE SHOWCASE */}
      <section id="features" className="py-20 px-6 sm:px-10 max-w-[1500px] mx-auto border-t border-white/[0.06]">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#D9FF35] block mb-1">
              ENGINEERED CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-[#F3F5F2] tracking-tight">
              Dense spatial tooling built directly into the workspace.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#A2AAA7] font-mono max-w-md">
            No external bloat. Every subsystem is designed as lightweight, decoupled developer software.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.15 }}
              className="bg-[#10151A] border border-white/[0.08] hover:border-[#D9FF35]/40 rounded-xl p-5 flex flex-col justify-between transition-colors duration-200 group"
            >
              <div>
                <span className="text-[11px] font-mono text-[#626B69] block mb-2">{card.tag}</span>
                <h3 className="text-base font-semibold text-[#F3F5F2] group-hover:text-[#D9FF35] transition-colors mb-2">
                  {card.title}
                </h3>
                <p className="text-[13px] text-[#A2AAA7] leading-relaxed mb-5">{card.desc}</p>
              </div>

              {/* Miniature Software UI */}
              <div className="mt-2 pt-2 border-t border-white/[0.04]">
                {card.ui}
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#626B69] group-hover:text-[#D9FF35] transition-colors">
                  <span>View specification</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: TECHNICAL WORKFLOW & CAMPUS MESH TELEMETRY */}
      <section id="workflow" className="py-20 px-6 sm:px-10 max-w-[1500px] mx-auto border-t border-white/[0.06]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Technical Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#D9FF35] block">
              ARCHITECTURE & PROTOCOL
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#F3F5F2] leading-tight">
              Low-latency campus mesh with end-to-end telemetry.
            </h2>
            <p className="text-sm text-[#A2AAA7] leading-relaxed">
              Compasu nodes interconnect over Socket.IO websockets with sub-10ms overhead. Discover nearby peers
              in Netaji Subhas Block, Central Library, or Hostels with real-time geospatial coordinate hashing.
            </p>

            <div className="space-y-3 font-mono text-xs text-[#A2AAA7]">
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#101A18] border border-white/[0.06]">
                <Activity className="w-4 h-4 text-[#D9FF35] shrink-0" />
                <span>Socket.IO Latency: <strong className="text-[#F3F5F2]">8.4ms avg</strong> across VIT campus</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#101A18] border border-white/[0.06]">
                <Shield className="w-4 h-4 text-[#D9FF35] shrink-0" />
                <span>Zero-knowledge location hashing with instant ghost mode</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#101A18] border border-white/[0.06]">
                <Zap className="w-4 h-4 text-[#D9FF35] shrink-0" />
                <span>Instant hot reload & state sync across peer instances</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Terminal Log Stream */}
          <div className="lg:col-span-7 bg-[#0A0E14] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl font-mono text-[11px]">
            {/* Terminal Header */}
            <div className="bg-[#070A10] px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between text-[#626B69]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#D9FF35]" />
                <span className="text-[#F3F5F2]">compasu-daemon --telemetry</span>
              </div>
              <span className="text-[#D9FF35]">STATUS: OK</span>
            </div>

            {/* Terminal Output */}
            <div className="p-4 space-y-1.5 text-[#A2AAA7] max-h-80 overflow-y-auto">
              <p className="text-[#626B69]">// [2026-09-08 20:01:42] Booting Compasu Core Engine...</p>
              <p>[INIT] Authenticated user <span className="text-[#F3F5F2]">manonman</span> (ID: usr_9942a1)</p>
              <p>[MESH] Connected to VIT Chennai regional cluster (Kelambakkam)</p>
              <p>[RADAR] Coordinates locked: <span className="text-[#D9FF35]">12.84064° N, 80.15343° E</span></p>
              <p>[ROUTING] Mapbox Walking profile loaded with GeoJSON cache</p>
              <p>[TARGET] Shared meeting point active: <span className="text-[#D9FF35]">Netaji Subhas Block (AB-1)</span></p>
              <p className="text-[#D9FF35]">[OK] 3 active peer route convergences computed.</p>
              <p className="flex items-center gap-1.5 pt-2 text-[#F3F5F2]">
                <span className="text-[#D9FF35]">$</span> compasu test --detectOpenHandles
                <span className="w-1.5 h-3.5 bg-[#D9FF35] animate-pulse" />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CALL TO ACTION */}
      <section className="py-20 px-6 sm:px-10 max-w-[1200px] mx-auto">
        <div className="bg-[#101A18] border border-white/[0.08] rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#D9FF35]/40 to-transparent" />

          <span className="text-[11px] font-mono uppercase tracking-widest text-[#D9FF35] block mb-2">
            START BUILDING TODAY
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#F3F5F2] tracking-tight mb-4">
            Everything you need to ship software and converge on campus.
          </h2>
          <p className="text-sm text-[#A2AAA7] max-w-lg mx-auto mb-8 font-mono">
            Get started with Compasu in seconds. Open your workspace, link your campus credentials, and start collaborating.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="h-12 px-8 bg-[#D9FF35] hover:bg-[#CFFF24] text-[#080B0E] font-bold text-sm rounded-lg flex items-center gap-2 shadow-[0_0_20px_rgba(217,255,53,0.2)] transition active:translate-y-0.5 font-mono"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="h-12 px-6 bg-[#17231F] hover:bg-[#14201D] text-[#F3F5F2] text-sm font-medium rounded-lg border border-white/[0.08] transition font-mono"
            >
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] bg-[#070A10] py-12 px-6 sm:px-10 font-mono text-[12px] text-[#626B69]">
        <div className="max-w-[1500px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-[#F3F5F2] font-bold">
              <Terminal className="w-4 h-4 text-[#D9FF35]" />
              <span>compasu</span>
            </div>
            <p className="text-[#A2AAA7] max-w-xs text-[11px]">
              The technical developer workspace and peer network built specifically for VIT Chennai engineers.
            </p>
            <p className="text-[10px]">v2.4.0 • Node ap-south-1</p>
          </div>

          {/* Links 1 */}
          <div className="space-y-2">
            <div className="text-[#F3F5F2] font-semibold">Product</div>
            <div><a href="#features" className="hover:text-[#D9FF35] transition">Radar</a></div>
            <div><a href="#features" className="hover:text-[#D9FF35] transition">Multi-Route Engine</a></div>
            <div><a href="#features" className="hover:text-[#D9FF35] transition">Shared Targets</a></div>
            <div><a href="#features" className="hover:text-[#D9FF35] transition">Campus Landmarks</a></div>
          </div>

          {/* Links 2 */}
          <div className="space-y-2">
            <div className="text-[#F3F5F2] font-semibold">Campus</div>
            <div><span className="text-[#A2AAA7]">VIT Chennai</span></div>
            <div><span className="text-[#A2AAA7]">Academic Block 1</span></div>
            <div><span className="text-[#A2AAA7]">Academic Block 2</span></div>
            <div><span className="text-[#A2AAA7]">Central Library</span></div>
          </div>

          {/* Links 3 */}
          <div className="space-y-2">
            <div className="text-[#F3F5F2] font-semibold">Security</div>
            <div><span className="hover:text-[#D9FF35] cursor-pointer">Stealth Mode</span></div>
            <div><span className="hover:text-[#D9FF35] cursor-pointer">Telemetry</span></div>
            <div><span className="hover:text-[#D9FF35] cursor-pointer">Zero-Knowledge Mesh</span></div>
            <div><span className="hover:text-[#D9FF35] cursor-pointer">Status</span></div>
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <span>© {new Date().getFullYear()} Compasu Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <span className="hover:text-[#A2AAA7] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#A2AAA7] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#A2AAA7] cursor-pointer">Spatial Telemetry</span>
          </div>
        </div>
      </footer>
    </div>
  );
}