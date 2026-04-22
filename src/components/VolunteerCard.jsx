import React from 'react';
import { scoreToPercent } from '../lib/matchVolunteers';

export default function VolunteerCard({ volunteer, onAssign, assigned }) {
  const score = volunteer.matchScore || 0;
  const scoreColor =
    score >= 80 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20' :
    score >= 50 ? 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20' :
                  'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {volunteer.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">{volunteer.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${volunteer.available ? 'bg-emerald-500' : 'bg-red-400'}`} />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {volunteer.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
        </div>
        <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-lg ${scoreColor}`}>
          {scoreToPercent(score)} match
        </span>
      </div>

      {/* Skills */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(volunteer.skills || []).map((skill) => (
          <span
            key={skill}
            className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-medium"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Location + contact */}
      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex gap-3">
        <span>📍 {volunteer.location}</span>
        <span>📞 {volunteer.contact}</span>
      </div>

      {/* Assign button */}
      <div className="mt-3">
        {assigned ? (
          <div className="w-full text-center py-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
            ✅ Assigned
          </div>
        ) : (
          <button
            onClick={onAssign}
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
          >
            Assign Volunteer
          </button>
        )}
      </div>
    </div>
  );
}
