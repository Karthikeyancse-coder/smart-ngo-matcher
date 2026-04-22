import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 page-enter">
      <span className="text-8xl mb-6">🗺️</span>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">404</h1>
      <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 text-center">
        This page doesn't exist on the map.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
