import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Code2,
  Bot,
  Bug,
  GitBranch,
  Cloud,
  Users2,
  Blocks,
  ArrowRight,
  Terminal,
} from 'lucide-react';

export default function DevNavbar() {
  const [toolsOpen, setToolsOpen] = useState(false);

  const toolItems = [
    { name: 'Code Editor', desc: 'Monaco-grade TypeScript & Rust editing', icon: Code2 },
    { name: 'AI Assistant', desc: 'Context-aware campus code completions', icon: Bot },
    { name: 'Debugger', desc: 'Visual breakpoints & stack inspection', icon: Bug },
    { name: 'Git Integration', desc: 'Multi-branch workspace graph', icon: GitBranch },
    { name: 'Cloud Workspace', desc: 'Instant ephemeral container sandbox', icon: Cloud },
    { name: 'Team Collaboration', desc: 'Multiplayer cursors & spatial audio', icon: Users2 },
    { name: 'Extensions', desc: 'Open VS Code extension compatibility', icon: Blocks },
  ];

  return (
    <nav className="relative z-50 h-16 sm:h-20 border-b border-white/[0.06] bg-[#070A10]/90 backdrop-blur-md px-6 sm:px-10 flex items-center justify-between">
      {/* Left: Brand / Logo */}
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-[#101A18] border border-[#D9FF35]/30 flex items-center justify-center text-[#D9FF35] group-hover:border-[#D9FF35] transition duration-200">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-base tracking-tight text-[#F3F5F2]">
              compasu
            </span>
            <span className="text-[10px] font-mono text-[#D9FF35] bg-[#D9FF35]/10 px-1.5 py-0.5 rounded border border-[#D9FF35]/20">
              v2.4
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-[13px] text-[#A2AAA7]">
          {/* Developer Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1.5 py-2 hover:text-[#F3F5F2] transition duration-150 cursor-pointer group"
            >
              <span>Developer Tools</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#626B69] group-hover:text-[#D9FF35] transition-transform duration-200 ${
                  toolsOpen ? 'rotate-180 text-[#D9FF35]' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {toolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-1 w-80 bg-[#0D1218] border border-white/[0.08] rounded-xl shadow-2xl p-2 z-50"
                >
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#626B69] px-3 py-1.5">
                    Core Tooling
                  </div>
                  <div className="space-y-0.5">
                    {toolItems.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={idx}
                          href="#features"
                          className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#14201D] transition duration-150 group"
                        >
                          <div className="w-7 h-7 rounded bg-[#101A18] border border-white/[0.06] flex items-center justify-center text-[#A2AAA7] group-hover:text-[#D9FF35] group-hover:border-[#D9FF35]/30 transition shrink-0 mt-0.5">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-[#F3F5F2] group-hover:text-[#D9FF35] transition">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-[#626B69] line-clamp-1">{item.desc}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href="#workflow" className="hover:text-[#F3F5F2] transition duration-150">
            Download
          </a>
          <a href="#features" className="hover:text-[#F3F5F2] transition duration-150">
            Documentation
          </a>
          <a href="#technical" className="hover:text-[#F3F5F2] transition duration-150">
            Campus Mesh
          </a>
        </div>
      </div>

      {/* Right: Auth / Action Buttons */}
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-[13px] font-medium text-[#A2AAA7] hover:text-[#F3F5F2] transition"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="h-9 px-4 rounded-md bg-[#D9FF35] text-[#070A10] text-[13px] font-semibold hover:bg-[#CFFF24] transition duration-150 flex items-center gap-1.5 shadow-[0_0_20px_rgba(217,255,53,0.15)] active:translate-y-0.5"
        >
          <span>Get Started</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </nav>
  );
}
