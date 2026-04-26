import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Activity, Download, Filter, TrendingUp, Users, Target, Calendar, ChevronDown, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import fallbackSurveys from '../data/surveys.json';

const trendData = [
  { name: 'Mon', needs: 12, resolved: 8 },
  { name: 'Tue', needs: 19, resolved: 10 },
  { name: 'Wed', needs: 15, resolved: 14 },
  { name: 'Thu', needs: 22, resolved: 16 },
  { name: 'Fri', needs: 30, resolved: 21 },
  { name: 'Sat', needs: 28, resolved: 25 },
  { name: 'Sun', needs: 18, resolved: 29 },
];

const categoryData = [
  { name: 'Medical Aid', count: 45 },
  { name: 'Water', count: 32 },
  { name: 'Food Supply', count: 28 },
  { name: 'Shelter', count: 18 },
  { name: 'Heavy Eqpt', count: 12 },
];

export default function Reports() {
  const [stats, setStats] = useState({ totalNeeds: 0, critical: 0, resolved: 0 });
  const [timeframe, setTimeframe] = useState('7 Days');

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase.from('surveys').select('*');
        if (error || !data?.length) throw error;
        calculateStats(data);
      } catch {
        calculateStats(fallbackSurveys || []);
      }
    }
    loadData();
  }, []);

  const calculateStats = (data) => {
    setStats({
      totalNeeds: data.length,
      critical: data.filter(d => d.urgency >= 8).length,
      resolved: data.filter(d => d.status === 'resolved' || d.status === 'assigned').length, // mocked resolved
    });
  };

  return (
    <div className="min-h-screen bg-nx-bg-base font-body pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-nx-text-primary tracking-tight flex items-center gap-3">
              <Activity className="w-8 h-8 text-nx-accent-primary" />
              Intelligence Reports
            </h1>
            <p className="text-nx-text-secondary mt-1">
              Real-time analytics and impact assessment data.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-nx-bg-surface border border-nx-border-default hover:border-nx-text-tertiary rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-bold text-nx-text-primary transition-colors">
              <Calendar className="w-4 h-4 text-nx-text-secondary" /> {timeframe} <ChevronDown className="w-4 h-4" />
            </button>
            <button className="bg-nx-accent-primary hover:bg-nx-accent-hover text-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-bold transition-all shadow-md active:scale-95">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-nx-bg-surface border border-nx-border-subtle rounded-xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-nx-accent-primary/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
            <h3 className="text-sm font-bold text-nx-text-tertiary uppercase tracking-widest mb-1 relative z-10">Total Assessed Needs</h3>
            <div className="flex items-end gap-3 relative z-10">
              <span className="text-4xl font-display font-bold text-nx-text-primary">{stats.totalNeeds || 142}</span>
              <span className="flex items-center gap-1 text-sm font-bold text-nx-green mb-1"><TrendingUp className="w-4 h-4" /> +12%</span>
            </div>
          </div>
          
          <div className="bg-nx-bg-surface border border-nx-crimson-subtle rounded-xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-nx-crimson/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
            <h3 className="text-sm font-bold text-nx-text-tertiary uppercase tracking-widest mb-1 relative z-10">Critical High-Priority</h3>
            <div className="flex items-end gap-3 relative z-10">
              <span className="text-4xl font-display font-bold text-nx-crimson">{stats.critical || 28}</span>
              <span className="flex items-center gap-1 text-sm font-bold text-nx-crimson mb-1"><TrendingUp className="w-4 h-4" /> Action Req</span>
            </div>
          </div>

          <div className="bg-nx-bg-surface border border-nx-border-subtle rounded-xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-nx-green/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
            <h3 className="text-sm font-bold text-nx-text-tertiary uppercase tracking-widest mb-1 relative z-10">Resolved / Dispatched</h3>
            <div className="flex items-end gap-3 relative z-10">
              <span className="text-4xl font-display font-bold text-nx-green">{stats.resolved || 84}</span>
              <span className="flex items-center gap-1 text-sm font-bold text-nx-text-secondary mb-1">Volunteers Deployed</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Need vs Resolution Trend */}
          <div className="bg-nx-bg-surface border border-nx-border-subtle rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-display font-bold text-nx-text-primary mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-nx-accent-primary" /> Incident Resolution Velocity
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNeeds" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-crimson)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-crimson)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-green)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-green)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--color-text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-strong)', borderRadius: '8px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="needs" stroke="var(--color-crimson)" fillOpacity={1} fill="url(#colorNeeds)" strokeWidth={2} name="Reported Needs" />
                  <Area type="monotone" dataKey="resolved" stroke="var(--color-green)" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={2} name="Resolved" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categorical Distribution */}
          <div className="bg-nx-bg-surface border border-nx-border-subtle rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-display font-bold text-nx-text-primary mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-nx-accent-primary" /> Distribution by Category
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="var(--color-text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={{fill: 'var(--color-bg-elevated)'}}
                    contentStyle={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border-strong)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="var(--color-accent-primary)" radius={[0, 4, 4, 0]} barSize={20} name="Total Incidents" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
