import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Activity, AlertTriangle, ArrowRight, ArrowUpRight, BarChart3, Clock, Droplet, FileText, Globe2, HeartPulse, MapPin, Pill, Search, ShieldAlert, Thermometer, UploadCloud, Users, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import fallbackSurveys from '../data/surveys.json';

const NEED_ICONS = {
  'Clean Water': Droplet,
  'Medical Aid': HeartPulse,
  'Education': Activity,
  'Food Supply': Pill,
  'Sanitation': ShieldAlert,
  'Infrastructure': Thermometer,
};

const getNexusScoreColor = (score) => {
  if (score >= 8) return 'var(--color-crimson)';
  if (score >= 5) return 'var(--color-amber)';
  return 'var(--color-green)';
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
        setSurveys(fallbackSurveys || []);
      } finally {
        setLoading(false);
      }
    }
    fetchSurveys();
  }, []);

  const totalSurveys = surveys.length;
  const urgentNeeds = surveys.filter((s) => s.urgency >= 8).length;
  const areasCount = new Set(surveys.map((s) => s.village)).size;
  const recentAlerts = [...surveys].sort((a, b) => b.urgency - a.urgency).slice(0, 5);

  // Calculate Average Urgency (NexusScore)
  const avgUrgency = surveys.length ? (surveys.reduce((acc, curr) => acc + curr.urgency, 0) / surveys.length).toFixed(1) : 0;
  const nexusScore = avgUrgency;

  const pieData = [
    { name: 'Score', value: Number(nexusScore) },
    { name: 'Remaining', value: 10 - Number(nexusScore) }
  ];

  return (
    <div className="min-h-screen bg-nx-bg-base transition-colors duration-300 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top Command Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-nx-text-primary tracking-tight">
              Command Center
            </h1>
            <p className="text-nx-text-secondary mt-1 flex items-center gap-2 font-mono text-sm uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-nx-green animate-pulse" /> Live Intelligence Active
            </p>
          </div>

          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nx-text-tertiary group-focus-within:text-nx-accent-primary transition-colors" />
            <input
              type="text"
              placeholder="Search districts, needs, or organizations... (Press '/')"
              className="w-full bg-nx-bg-surface border border-nx-border-default focus:border-nx-accent-primary rounded-lg pl-10 pr-4 py-2.5 text-sm text-nx-text-primary placeholder:text-nx-text-disabled outline-none transition-all shadow-sm focus:shadow-glow"
            />

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Dashboard Content (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <Link to="/upload" className="flex flex-col items-center justify-center gap-1.5 md:gap-2 p-3 md:p-4 rounded-2xl md:rounded-xl bg-nx-accent-primary hover:bg-nx-accent-hover text-white transition-all hover:-translate-y-1 shadow-[0_4px_16px_rgba(59,130,246,0.3)] md:shadow-card hover:shadow-glow group active:scale-95">
                <UploadCloud className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-[10px] md:text-sm text-center leading-[1.15] md:leading-normal">Upload<br className="md:hidden" /> <span className="hidden md:inline"> </span>Survey</span>
              </Link>
              <Link to="/map" className="flex flex-col items-center justify-center gap-1.5 md:gap-2 p-3 md:p-4 rounded-2xl md:rounded-xl bg-nx-bg-surface/80 backdrop-blur-md md:bg-nx-bg-surface border border-nx-border-subtle md:border-nx-border-default hover:border-nx-accent-primary text-nx-text-primary transition-all hover:-translate-y-1 shadow-[0_4px_12px_rgba(0,0,0,0.2)] md:shadow-sm group active:scale-95">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-nx-cyan group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] md:drop-shadow-none" />
                <span className="font-semibold text-[10px] md:text-sm text-center leading-[1.15] md:leading-normal">Intel<br className="md:hidden" /> <span className="hidden md:inline"> </span>Heatmap</span>
              </Link>
              <Link to="/match" className="flex flex-col items-center justify-center gap-1.5 md:gap-2 p-3 md:p-4 rounded-2xl md:rounded-xl bg-nx-bg-surface/80 backdrop-blur-md md:bg-nx-bg-surface border border-nx-border-subtle md:border-nx-border-default hover:border-nx-accent-primary text-nx-text-primary transition-all hover:-translate-y-1 shadow-[0_4px_12px_rgba(0,0,0,0.2)] md:shadow-sm group active:scale-95">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-nx-amber group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(245,158,11,0.4)] md:drop-shadow-none" />
                <span className="font-semibold text-[10px] md:text-sm text-center leading-[1.15] md:leading-normal">Smart<br className="md:hidden" /> <span className="hidden md:inline"> </span>Match</span>
              </Link>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Scans', value: totalSurveys, icon: FileText, color: 'text-nx-blue' },
                { label: 'Critical Alerts', value: urgentNeeds, icon: AlertTriangle, color: 'text-nx-crimson' },
                { label: 'Active Teams', value: 8, icon: Activity, color: 'text-nx-green' },
                { label: 'Sectors Mapped', value: areasCount, icon: Zap, color: 'text-nx-amber' }
              ].map((metric, i) => (
                <div key={i} className="bg-nx-bg-surface border border-nx-border-subtle rounded-xl p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                    {loading ? (
                      <div className="w-4 h-4 rounded-full border-2 border-nx-border-strong border-t-transparent animate-spin" />
                    ) : (
                      <ArrowUpRight className="w-3 h-3 text-nx-text-disabled" />
                    )}
                  </div>
                  <div>
                    <div className="text-2xl font-mono font-bold text-nx-text-primary">
                      {loading ? '...' : metric.value}
                    </div>
                    <div className="text-xs font-bold text-nx-text-tertiary uppercase tracking-wider mt-1">
                      {metric.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Crisis Map Preview */}
            <div className="bg-nx-bg-surface border border-nx-border-subtle rounded-xl overflow-hidden shadow-sm flex flex-col relative h-64">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--color-accent-primary)_1px,_transparent_1px)]" style={{ backgroundSize: '16px 16px' }} />
              <div className="px-4 py-3 border-b border-nx-border-subtle bg-nx-bg-base/50 backdrop-blur flex justify-between items-center relative z-10">
                <h2 className="text-sm font-bold text-nx-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <Globe2 className="w-4 h-4" /> Regional Threat Level
                </h2>
                <Link to="/map" className="text-xs text-nx-accent-primary hover:underline font-mono">FULL MAP →</Link>
              </div>
              <div className="flex-1 relative">
                {/* Fake map markers for aesthetic */}
                {!loading && recentAlerts.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="absolute"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`
                    }}
                  >
                    <div className={`w-3 h-3 rounded-full shadow-glow ${s.urgency >= 8 ? 'bg-nx-crimson shadow-[0_0_10px_rgba(220,38,38,0.8)]' : s.urgency >= 5 ? 'bg-nx-amber shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 'bg-nx-cyan shadow-[0_0_10px_rgba(6,182,212,0.8)]'}`} />
                    {s.urgency >= 8 && <div className="absolute inset-0 bg-nx-crimson rounded-full animate-pulse opacity-50 scale-[3]" />}
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar (NexusScore & Intelligence Feed) */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* NexusScore Gauge */}
            <div className="bg-nx-bg-surface border border-nx-border-subtle rounded-xl p-6 shadow-sm relative overflow-hidden flex flex-col items-center text-center">
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-nx-green via-nx-amber to-nx-crimson" />
              <h2 className="text-sm font-bold text-nx-text-secondary uppercase tracking-widest mb-4">NexusScore</h2>

              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill={getNexusScoreColor(nexusScore)} />
                      <Cell fill="var(--color-bg-elevated)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
                  <span className="text-4xl font-display font-bold" style={{ color: getNexusScoreColor(nexusScore) }}>
                    {loading ? '-' : nexusScore}
                  </span>
                  <span className="text-xs text-nx-text-tertiary mt-1">/ 10</span>
                </div>
              </div>
              <p className="text-sm text-nx-text-secondary">
                Overall crisis severity index based on latest intelligence.
              </p>
            </div>

            {/* Field Intelligence Feed */}
            <div className="bg-nx-bg-surface border border-nx-border-subtle rounded-xl overflow-hidden shadow-sm flex-1 flex flex-col">
              <div className="px-4 py-3 border-b border-nx-border-subtle bg-nx-bg-base/50 flex justify-between items-center">
                <h2 className="text-sm font-bold text-nx-text-primary uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-nx-accent-primary" /> Intel Feed
                </h2>
                <span className="w-2 h-2 rounded-full bg-nx-crimson animate-pulse" />
              </div>

              <div className="flex-1 overflow-y-auto max-h-[400px]">
                {loading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-nx-bg-elevated shrink-0" />
                        <div className="space-y-2 flex-1">
                          <div className="h-3 bg-nx-bg-elevated rounded w-3/4" />
                          <div className="h-2 bg-nx-bg-elevated rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-nx-border-subtle">
                    <AnimatePresence>
                      {recentAlerts.map((survey, i) => {
                        const Icon = NEED_ICONS[survey.need_type] || AlertTriangle;
                        const uColor = survey.urgency >= 8 ? 'text-nx-crimson' : survey.urgency >= 5 ? 'text-nx-amber' : 'text-nx-cyan';
                        return (
                          <motion.div
                            key={survey.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-4 hover:bg-nx-bg-elevated transition-colors group cursor-pointer"
                          >
                            <div className="flex gap-3">
                              <div className={`w-8 h-8 rounded-full bg-nx-bg-base border border-nx-border-subtle flex items-center justify-center shrink-0 ${uColor}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="text-sm font-semibold text-nx-text-primary">
                                    {survey.village}
                                  </p>
                                  <span className="text-[10px] font-mono text-nx-text-tertiary flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Just now
                                  </span>
                                </div>
                                <p className="text-xs text-nx-text-secondary leading-relaxed">
                                  {survey.families} families reported needing <span className="font-bold text-nx-text-primary">{survey.need_type.toLowerCase()}</span>.
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${survey.urgency >= 8 ? 'bg-nx-crimson-subtle text-nx-crimson' : 'bg-nx-bg-base border border-nx-border-default'}`}>
                                    Urgency: {survey.urgency}/10
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
