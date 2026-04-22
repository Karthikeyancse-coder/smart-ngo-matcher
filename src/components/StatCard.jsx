import React from 'react';

export default function StatCard({ icon, label, value, color, loading }) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 animate-pulse">
        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 mb-3" />
        <div className="h-8 w-20 rounded-lg bg-slate-200 dark:bg-slate-700 mb-2" />
        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${color} bg-opacity-20`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
        {value}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
        {label}
      </p>
    </div>
  );
}
