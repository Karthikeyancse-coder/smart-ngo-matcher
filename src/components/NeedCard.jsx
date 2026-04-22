import React from 'react';
import { urgencyColor, urgencyLabel } from '../lib/utils';

const NEED_ICONS = {
  'Clean Water':   '💧',
  'Medical Aid':   '🏥',
  'Education':     '📚',
  'Food Supply':   '🍚',
  'Sanitation':    '🚿',
  'Infrastructure':'🏗️',
};

export default function NeedCard({ survey, isSelected, onSelect }) {
  const badgeClass = urgencyColor(survey.urgency);
  const icon = NEED_ICONS[survey.need_type] || '📌';

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
        ${isSelected
          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/10 shadow-md'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
        }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">{survey.village}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{survey.need_type}</p>
          </div>
        </div>
        <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
          {urgencyLabel(survey.urgency)} {survey.urgency}/10
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span>👨‍👩‍👧‍👦 {survey.families} families</span>
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium capitalize
          ${survey.status === 'open' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' :
            survey.status === 'assigned' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' :
            'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
          }`}>
          {survey.status}
        </span>
      </div>
    </button>
  );
}
