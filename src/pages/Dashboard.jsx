import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { supabase } from '../lib/supabaseClient';
import { urgencyColor } from '../lib/utils';
import fallbackSurveys from '../data/surveys.json';

const NEED_ICONS = {
  'Clean Water': '💧', 'Medical Aid': '🏥', 'Education': '📚',
  'Food Supply': '🍚', 'Sanitation': '🚿', 'Infrastructure': '🏗️',
};

export default function Dashboard() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSurveys() {
      try {
        const { data, error } = await supabase
          .from('surveys')
          .select('*')
          .order('created_at', { ascending: false });
        if (error || !data?.length) throw error;
        setSurveys(data);
      } catch {
        setSurveys(fallbackSurveys);
      } finally {
        setLoading(false);
      }
    }
    fetchSurveys();
  }, []);

  const totalSurveys  = surveys.length;
  const urgentNeeds   = surveys.filter((s) => s.urgency >= 8).length;
  const areasCount    = new Set(surveys.map((s) => s.village)).size;
  const recentAlerts  = [...surveys].sort((a, b) => b.urgency - a.urgency).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Live overview of community needs across Tamil Nadu
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard loading={loading} icon="📋" label="Total Surveys"    value={totalSurveys}  color="bg-blue-500/10" />
          <StatCard loading={loading} icon="🚨" label="Urgent Needs"     value={urgentNeeds}   color="bg-red-500/10" />
          <StatCard loading={loading} icon="🙋" label="Active Volunteers" value={8}             color="bg-emerald-500/10" />
          <StatCard loading={loading} icon="📍" label="Areas Covered"    value={areasCount}    color="bg-amber-500/10" />
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link to="/upload"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20">
            📤 Upload Survey
          </Link>
          <Link to="/map"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-all hover:scale-105 active:scale-95 hover:shadow-md">
            🗺️ View Heatmap
          </Link>
          <Link to="/match"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-all hover:scale-105 active:scale-95 hover:shadow-md">
            🤝 Match Volunteers
          </Link>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              🚨 Recent Alerts
            </h2>
            <Link to="/map" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-6 py-4 animate-pulse flex justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentAlerts.map((survey, i) => (
                <div
                  key={survey.id}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors animate-fade-in"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{NEED_ICONS[survey.need_type] || '📌'}</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{survey.village}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {survey.need_type} · {survey.families} families
                      </p>
                    </div>
                  </div>
                  <span className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${urgencyColor(survey.urgency)}`}>
                    {survey.urgency}/10
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
