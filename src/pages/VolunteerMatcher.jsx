import React, { useState, useEffect } from 'react';
import { Target, Users, MapPin, Zap, CheckCircle2, Star, Shield, Filter, Search, ArrowRight, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import fallbackSurveys from '../data/surveys.json';

const MOCK_VOLUNTEERS = [
  { id: 'v1', name: 'Dr. Aravind', role: 'Medical Specialist', distance: '2.4 km', rating: 4.9, completed: 34, availability: 'Available Now' },
  { id: 'v2', name: 'Meena K.', role: 'Logistics Coordinator', distance: '5.1 km', rating: 4.7, completed: 12, availability: 'In 2 hours' },
  { id: 'v3', name: 'Rescue Team Alpha', role: 'Heavy Equipment', distance: '8.0 km', rating: 5.0, completed: 108, availability: 'Available Now' },
  { id: 'v4', name: 'Rajesh Kumar', role: 'General Volunteer', distance: '1.2 km', rating: 4.8, completed: 5, availability: 'Available Now' },
];

export default function VolunteerMatcher() {
  const [surveys, setSurveys] = useState([]);
  const [activeSurvey, setActiveSurvey] = useState(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    async function fetchSurveys() {
      try {
        const { data, error } = await supabase.from('surveys').select('*').eq('status', 'reported').order('urgency', { ascending: false });
        if (error || !data?.length) throw error;
        setSurveys(data);
        setActiveSurvey(data[0]);
      } catch {
        const mock = fallbackSurveys.filter(s => s.status === 'reported').sort((a,b) => b.urgency - a.urgency);
        setSurveys(mock);
        setActiveSurvey(mock[0]);
      }
    }
    fetchSurveys();
  }, []);

  const runAiMatch = () => {
    setIsMatching(true);
    setMatches([]);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Create mock match scores based on the active survey
      const scored = MOCK_VOLUNTEERS.map(v => ({
        ...v,
        score: Math.floor(Math.random() * 20) + 75 // 75 - 95 score
      })).sort((a,b) => b.score - a.score);
      
      setMatches(scored);
      setIsMatching(false);
    }, 1500);
  };

  useEffect(() => {
    if (activeSurvey) {
      setMatches([]); // Reset matches when survey changes
    }
  }, [activeSurvey]);

  return (
    <div className="min-h-screen bg-nx-bg-base font-body pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-nx-text-primary tracking-tight flex items-center gap-3">
              <Target className="w-8 h-8 text-nx-accent-primary" />
              AI Volunteer Matcher
            </h1>
            <p className="text-nx-text-secondary mt-1">
              Intelligent resource allocation based on proximity, skills, and urgency.
            </p>
          </div>
          <div className="flex gap-3">
             <div className="bg-nx-bg-surface border border-nx-border-default rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-nx-green animate-pulse" />
                <span className="text-sm font-bold text-nx-text-primary">System Ready</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Unassigned Needs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-nx-text-secondary uppercase tracking-widest">Active Needs Queue</h2>
              <span className="text-xs font-mono bg-nx-bg-elevated px-2 py-1 rounded text-nx-text-tertiary">{surveys.length} PENDING</span>
            </div>
            
            <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
              {surveys.map(survey => (
                <div 
                  key={survey.id} 
                  onClick={() => setActiveSurvey(survey)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    activeSurvey?.id === survey.id 
                      ? 'bg-nx-bg-surface border-nx-accent-primary shadow-[0_0_0_1px_rgba(29,78,216,1)]' 
                      : 'bg-nx-bg-surface border-nx-border-subtle hover:border-nx-border-strong opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${survey.urgency >= 8 ? 'bg-nx-crimson-subtle text-nx-crimson' : 'bg-nx-amber-subtle text-nx-amber'}`}>
                        Priority {survey.urgency}/10
                      </span>
                    </div>
                    <span className="text-xs text-nx-text-tertiary">{survey.created_at ? new Date(survey.created_at).toLocaleTimeString() : 'Just now'}</span>
                  </div>
                  <h3 className="font-bold text-nx-text-primary mb-1">{survey.village}</h3>
                  <div className="flex items-center gap-4 text-xs text-nx-text-secondary">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {survey.district}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {survey.families} Families</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Matcher Interface */}
          <div className="lg:col-span-7 flex flex-col">
            {activeSurvey ? (
              <div className="bg-nx-bg-surface border border-nx-border-subtle rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
                
                {/* Need Details Header */}
                <div className="p-6 border-b border-nx-border-subtle bg-nx-bg-elevated/50">
                   <div className="flex items-center justify-between mb-4">
                     <div>
                       <h2 className="text-xl font-display font-bold text-nx-text-primary">{activeSurvey.village} — {activeSurvey.need_type}</h2>
                       <p className="text-sm text-nx-text-secondary">{activeSurvey.description}</p>
                     </div>
                     <div className="text-right">
                       <div className="text-3xl font-mono font-bold text-nx-text-primary">{activeSurvey.families}</div>
                       <div className="text-[10px] font-bold text-nx-text-tertiary uppercase tracking-wider">Affected</div>
                     </div>
                   </div>
                   
                   {!matches.length && !isMatching && (
                     <button 
                       onClick={runAiMatch}
                       className="w-full py-3 bg-nx-accent-primary hover:bg-nx-accent-hover text-white rounded-lg font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 group"
                     >
                       <Zap className="w-4 h-4 group-hover:animate-pulse" /> Run AI Match Analysis
                     </button>
                   )}
                </div>

                {/* Match Results Area */}
                <div className="flex-1 p-6 bg-nx-bg-base relative min-h-[400px]">
                  
                  {isMatching && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-nx-bg-base/80 backdrop-blur-sm z-10">
                       <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                         <div className="absolute inset-0 border-4 border-nx-border-strong border-t-nx-accent-primary rounded-full animate-spin" />
                         <Target className="w-8 h-8 text-nx-accent-primary animate-pulse" />
                       </div>
                       <p className="font-mono text-sm text-nx-text-primary uppercase tracking-widest animate-pulse">Calculating Synergy Scores...</p>
                       <div className="mt-4 flex gap-2">
                         <span className="w-1.5 h-1.5 bg-nx-accent-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
                         <span className="w-1.5 h-1.5 bg-nx-accent-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
                         <span className="w-1.5 h-1.5 bg-nx-accent-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
                       </div>
                    </div>
                  )}

                  <AnimatePresence>
                    {matches.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <h3 className="text-sm font-bold text-nx-text-secondary uppercase tracking-widest flex items-center gap-2 mb-4">
                          <CheckCircle2 className="w-4 h-4 text-nx-green" /> Recommended Responders
                        </h3>
                        
                        {matches.map((match, index) => (
                          <motion.div 
                            key={match.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-nx-bg-surface border border-nx-border-default rounded-xl p-4 flex items-center justify-between hover:border-nx-accent-primary transition-colors group"
                          >
                            <div className="flex items-center gap-4">
                              {/* Score Circle */}
                              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-nx-bg-elevated border border-nx-border-strong">
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                  <circle cx="24" cy="24" r="22" fill="none" stroke="var(--color-border-subtle)" strokeWidth="4" />
                                  <circle cx="24" cy="24" r="22" fill="none" stroke="var(--color-accent-primary)" strokeWidth="4" strokeDasharray="138" strokeDashoffset={138 - (138 * match.score) / 100} className="transition-all duration-1000" />
                                </svg>
                                <span className="text-xs font-mono font-bold text-nx-text-primary relative z-10">{match.score}%</span>
                              </div>
                              
                              <div>
                                <h4 className="font-bold text-nx-text-primary text-sm">{match.name}</h4>
                                <p className="text-xs text-nx-text-secondary flex items-center gap-1 mt-0.5">
                                  <Shield className="w-3 h-3 text-nx-text-tertiary" /> {match.role}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="text-right hidden sm:block">
                                <div className="text-xs font-bold text-nx-text-primary flex items-center gap-1 justify-end"><MapPin className="w-3 h-3" /> {match.distance}</div>
                                <div className="text-[10px] text-nx-text-tertiary uppercase mt-0.5">{match.availability}</div>
                              </div>
                              <button className="px-4 py-2 bg-nx-bg-elevated border border-nx-border-strong hover:bg-nx-accent-primary hover:text-white hover:border-transparent text-nx-text-primary rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2">
                                Assign <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isMatching && !matches.length && (
                    <div className="h-full flex flex-col items-center justify-center text-nx-text-tertiary">
                      <UserCheck className="w-12 h-12 mb-4 opacity-50" />
                      <p className="text-sm text-center max-w-xs">Select a need from the queue and run the AI Matcher to find the best responders.</p>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div className="bg-nx-bg-surface border border-nx-border-subtle rounded-xl shadow-sm h-full flex flex-col items-center justify-center text-nx-text-tertiary p-8 text-center">
                <Target className="w-12 h-12 mb-4 opacity-20" />
                <h3 className="text-lg font-bold text-nx-text-primary mb-2">No Need Selected</h3>
                <p className="text-sm max-w-sm">Select an active need from the queue to run the AI matching algorithm.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
