import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, X, ChevronRight, ChevronLeft, MapPin, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import fallbackSurveys from '../data/surveys.json';

export default function HeatMap() {
  const [surveys, setSurveys] = useState([]);
  const [activeSurvey, setActiveSurvey] = useState(null);
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minUrgency, setMinUrgency] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Computed filtered surveys
  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = !searchQuery || 
      survey.village.toLowerCase().includes(searchQuery.toLowerCase()) || 
      survey.district.toLowerCase().includes(searchQuery.toLowerCase()) || 
      survey.need_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(survey.need_type);
    
    const matchesUrgency = survey.urgency >= minUrgency;

    return matchesSearch && matchesCategory && matchesUrgency;
  });
  
  useEffect(() => {
    async function fetchSurveys() {
      try {
        const { data, error } = await supabase.from('surveys').select('*');
        if (error || !data?.length) throw error;
        setSurveys(data);
      } catch {
        setSurveys(fallbackSurveys || []);
      }
    }
    fetchSurveys();
  }, []);

  const getUrgencyColor = (urgency) => {
    if (urgency >= 8) return '#DC2626'; // crimson
    if (urgency >= 5) return '#F59E0B'; // amber
    return '#06B6D4'; // cyan
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-nx-bg-base overflow-hidden font-body flex">
      
      {/* MAP LAYER */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={[10.8505, 76.2711]} // approximate Tamil Nadu center
          zoom={7} 
          style={{ height: '100%', width: '100%', background: isDark ? '#040812' : '#ffffff' }}
          zoomControl={false}
        >
          {/* CartoDB TileLayer based on Theme */}
          <TileLayer
            url={isDark 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            }
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          />

          {filteredSurveys.map((survey) => (
            <CircleMarker
              key={survey.id}
              center={[survey.lat, survey.lng]}
              radius={Math.max(6, Math.min(24, survey.families / 10))}
              pathOptions={{
                color: getUrgencyColor(survey.urgency),
                fillColor: getUrgencyColor(survey.urgency),
                fillOpacity: 0.6,
                weight: survey.urgency >= 8 ? 2 : 1
              }}
              eventHandlers={{
                click: () => setActiveSurvey(survey)
              }}
            >
              <Popup className="nx-popup">
                <div className="text-sm font-bold">{survey.village}</div>
                <div className="text-xs text-nx-text-secondary">{survey.need_type}</div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* TOP SEARCH BAR (Floating) */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[400] w-full max-w-md px-4">
        <div className="bg-nx-bg-surface/90 backdrop-blur-md border border-nx-border-default rounded-xl shadow-modal flex items-center px-4 py-3">
          <Search className="w-5 h-5 text-nx-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search village, district, need type..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-nx-text-primary text-sm flex-1 ml-3 placeholder:text-nx-text-disabled" 
          />
        </div>
      </div>

      {/* Mobile Filter Backdrop */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileFilterOpen(false)}
            className="md:hidden absolute inset-0 bg-nx-bg-base/80 backdrop-blur-sm z-[399]"
          />
        )}
      </AnimatePresence>

      {/* Mobile Filter Toggle */}
      <button 
        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        className={`md:hidden absolute top-1/2 -translate-y-1/2 z-[401] flex items-center justify-center w-8 h-16 bg-nx-bg-surface/90 backdrop-blur-md border border-l-0 border-nx-border-default rounded-r-2xl shadow-[0_0_15px_rgba(59,130,246,0.3)] text-nx-accent-primary transition-transform duration-300 ease-in-out ${isMobileFilterOpen ? 'translate-x-[85vw]' : 'translate-x-0'}`}
      >
        {isMobileFilterOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 animate-pulse" />}
      </button>

      {/* LEFT FILTER PANEL */}
      <div 
        className={`absolute top-0 md:top-24 left-0 md:left-6 z-[400] h-full md:h-auto w-[85vw] md:w-80 bg-nx-bg-surface/90 backdrop-blur-md border-r md:border border-nx-border-default md:rounded-2xl shadow-modal p-5 flex flex-col md:max-h-[calc(100vh-140px)] transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-nx-border-subtle">
          <h2 className="text-lg font-display font-bold text-nx-text-primary flex items-center gap-2">
            <Target className="w-5 h-5 text-nx-accent-primary" /> Intelligence
          </h2>
          <span className="text-xs font-mono bg-nx-bg-elevated px-2 py-1 rounded text-nx-text-secondary">
            {filteredSurveys.length} NEEDS
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold text-nx-text-secondary uppercase tracking-widest mb-3">Categories</h3>
            <div className="space-y-2">
              {['Water', 'Health', 'Education', 'Food', 'Medical Aid', 'Shelter', 'Heavy Eqpt'].map(c => (
                <label key={c} className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={selectedCategories.includes(c)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, c]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(cat => cat !== c));
                      }
                    }}
                    className="w-4 h-4 rounded border border-nx-border-strong bg-nx-bg-elevated text-nx-accent-primary focus:ring-nx-accent-primary accent-nx-accent-primary cursor-pointer" 
                  />
                  <span className="text-sm text-nx-text-primary">{c}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Urgency */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-nx-text-secondary uppercase tracking-widest">Urgency Level</h3>
              <span className="text-xs font-mono text-nx-text-primary">{minUrgency}+</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={minUrgency}
              onChange={(e) => setMinUrgency(Number(e.target.value))}
              className="w-full accent-nx-accent-primary" 
            />
          </div>
        </div>

        <div className="pt-4 border-t border-nx-border-subtle mt-4">
          <button className="w-full py-2.5 bg-nx-accent-primary hover:bg-nx-accent-hover text-white rounded-lg font-bold text-sm transition-all shadow-md">
            Apply Filters
          </button>
        </div>
      </div>

      {/* RIGHT DETAIL PANEL (Slide-in) */}
      <AnimatePresence>
        {activeSurvey && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 z-[500] w-full max-w-md h-full bg-nx-bg-surface border-l border-nx-border-strong shadow-modal flex flex-col"
          >
            <div className="p-4 border-b border-nx-border-subtle flex items-center justify-between bg-nx-bg-base/50">
              <span className="text-xs font-mono font-bold text-nx-text-tertiary uppercase tracking-wider">Need Details</span>
              <button onClick={() => setActiveSurvey(null)} className="p-2 hover:bg-nx-bg-elevated rounded-lg transition-colors">
                <X className="w-5 h-5 text-nx-text-secondary" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Header */}
              <div>
                <div className="flex gap-2 items-center mb-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase ${activeSurvey.urgency >= 8 ? 'bg-nx-crimson-subtle text-nx-crimson' : 'bg-nx-amber-subtle text-nx-amber'}`}>
                    Urgency {activeSurvey.urgency}/10
                  </span>
                  <span className="px-2 py-1 rounded bg-nx-bg-elevated text-nx-text-secondary text-[10px] font-mono uppercase">
                    Open
                  </span>
                </div>
                <h2 className="text-2xl font-display font-bold text-nx-text-primary mb-1">{activeSurvey.village}</h2>
                <p className="text-sm text-nx-text-secondary flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {activeSurvey.district} District
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-nx-bg-base border border-nx-border-subtle p-3 rounded-lg">
                  <div className="text-xs text-nx-text-tertiary font-bold uppercase mb-1">Category</div>
                  <div className="text-sm font-semibold text-nx-text-primary">{activeSurvey.need_type}</div>
                </div>
                <div className="bg-nx-bg-base border border-nx-border-subtle p-3 rounded-lg">
                  <div className="text-xs text-nx-text-tertiary font-bold uppercase mb-1">Affected</div>
                  <div className="text-sm font-semibold text-nx-text-primary">{activeSurvey.families} Families</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-nx-text-primary mb-2">Description</h3>
                <p className="text-sm text-nx-text-secondary leading-relaxed bg-nx-bg-elevated p-4 rounded-lg border border-nx-border-subtle">
                  {activeSurvey.description || "No specific details provided in the field report. Assessment required."}
                </p>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-bold text-nx-text-primary mb-4">Status Timeline</h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-nx-border-strong before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-nx-accent-primary bg-nx-bg-base text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <div className="w-1.5 h-1.5 bg-nx-accent-primary rounded-full" />
                    </div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded shadow-sm bg-nx-bg-base border border-nx-border-default">
                      <div className="font-bold text-xs text-nx-text-primary">Reported</div>
                      <div className="text-[10px] text-nx-text-tertiary font-mono">14:23 Today</div>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-nx-border-strong bg-nx-bg-base shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded shadow-sm bg-transparent border border-nx-border-subtle opacity-50">
                      <div className="font-bold text-xs text-nx-text-secondary">Assigned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-nx-border-strong bg-nx-bg-base/80 backdrop-blur">
              <button 
                onClick={() => navigate('/match')}
                className="w-full py-3 bg-nx-accent-primary hover:bg-nx-accent-hover text-white rounded-lg font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 hover:shadow-glow active:scale-95"
              >
                Find Volunteers <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .leaflet-container {
          background: var(--color-bg-base);
          font-family: var(--font-body);
        }
        .leaflet-popup-content-wrapper {
          background: var(--color-bg-elevated);
          color: var(--color-text-primary);
          border: 1px solid var(--color-border-strong);
          border-radius: 8px;
          box-shadow: var(--shadow-card);
        }
        .leaflet-popup-tip {
          background: var(--color-bg-elevated);
          border-top: 1px solid var(--color-border-strong);
          border-left: 1px solid var(--color-border-strong);
        }
      `}</style>
    </div>
  );
}
