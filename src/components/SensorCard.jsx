import React from 'react';

export default function SensorCard({ title, value, unit, icon: Icon, status, color = "indigo" }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
      {/* Background Glow Effect */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl bg-${color}-500/10 border border-${color}-500/20 text-${color}-400`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline space-x-2">
        <span className="text-3xl font-extrabold tracking-tight text-white">{value}</span>
        <span className="text-sm font-medium text-slate-400">{unit}</span>
      </div>

      {status && (
        <div className="mt-3 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 text-xs font-medium text-slate-300 border border-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{status}</span>
        </div>
      )}
    </div>
  );
}