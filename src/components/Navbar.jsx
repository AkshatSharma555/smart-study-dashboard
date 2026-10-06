import React from 'react';
import { Wifi, ShieldCheck, Cpu } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Left Title */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 rounded-lg text-indigo-400">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-wide text-slate-100">Smart Study Table</h1>
          <p className="text-xs text-slate-400">IoT Posture & Environment Monitor</p>
        </div>
      </div>

      {/* Right Status Badges */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <Wifi className="w-3.5 h-3.5" />
          <span>ESP32 Connected</span>
        </div>

        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>System Secure</span>
        </div>
      </div>
    </header>
  );
}