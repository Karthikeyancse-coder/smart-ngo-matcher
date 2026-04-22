import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend, ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { chartColors } from '../lib/utils';
import surveysData from '../data/surveys.json';

function buildBarData(surveys) {
  const map = {};
  surveys.forEach(({ need_type, families }) => {
    map[need_type] = (map[need_type] || 0) + (families || 0);
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

function buildPieData(surveys, colors) {
  const tiers = { High: 0, Medium: 0, Low: 0 };
  surveys.forEach(({ urgency }) => {
    if (urgency >= 8) tiers.High++;
    else if (urgency >= 5) tiers.Medium++;
    else tiers.Low++;
  });
  return [
    { name: 'High (8–10)',   value: tiers.High,   color: colors.high   },
    { name: 'Medium (5–7)', value: tiers.Medium, color: colors.medium },
    { name: 'Low (1–4)',    value: tiers.Low,    color: colors.low    },
  ];
}

const RADIAN = Math.PI / 180;
function renderLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      className="text-xs font-bold" fontSize={12}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function Reports() {
  const { isDark } = useTheme();
  const colors  = chartColors(isDark);
  const barData = buildBarData(surveysData);
  const pieData = buildPieData(surveysData, colors);

  const totalFamilies = surveysData.reduce((s, r) => s + (r.families || 0), 0);
  const criticalNeed  = barData.sort((a, b) => b.value - a.value)[0]?.name ?? '—';
  const criticalArea  = [...surveysData].sort((a, b) => b.urgency - a.urgency)[0]?.village ?? '—';

  const cardBase = 'bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Reports</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
          Visual analytics of community needs and urgency distribution.
        </p>

        {/* Summary row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Families',    value: totalFamilies, icon: '👨‍👩‍👧‍👦' },
            { label: 'Most Critical Need', value: criticalNeed, icon: '🚨' },
            { label: 'Most Affected Area', value: criticalArea, icon: '📍' },
          ].map(({ label, value, icon }) => (
            <div key={label} className={cardBase}>
              <p className="text-2xl mb-1">{icon}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className={cardBase}>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">
              📊 Families Affected by Need Category
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 0, right: 10, left: -10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis
                  dataKey="name" tick={{ fill: colors.text, fontSize: 11 }}
                  angle={-30} textAnchor="end" interval={0}
                />
                <YAxis tick={{ fill: colors.text, fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                    color: isDark ? '#f1f5f9' : '#0f172a',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="value" fill={colors.bar} radius={[6, 6, 0, 0]} name="Families" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className={cardBase}>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">
              🥧 Urgency Distribution
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData} cx="50%" cy="50%"
                  outerRadius={100} dataKey="value"
                  labelLine={false} label={renderLabel}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  formatter={(value) => (
                    <span style={{ color: colors.text, fontSize: 12 }}>{value}</span>
                  )}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                    color: isDark ? '#f1f5f9' : '#0f172a',
                    borderRadius: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
