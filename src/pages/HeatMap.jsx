import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { supabase } from '../lib/supabaseClient';
import { mapMarkerColor, mapMarkerStroke, urgencyColor, urgencyLabel } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';
import fallbackSurveys from '../data/surveys.json';

const NEED_ICONS = {
  'Clean Water': '💧', 'Medical Aid': '🏥', 'Education': '📚',
  'Food Supply': '🍚', 'Sanitation': '🚿', 'Infrastructure': '🏗️',
};

function MapLegend() {
  return (
    <div className="absolute bottom-6 right-4 z-[999] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wide">Urgency</p>
      {[
        { label: 'High (8–10)',   color: '#f87171' },
        { label: 'Medium (5–7)', color: '#f59e0b' },
        { label: 'Low (1–4)',    color: '#34d399' },
      ].map(({ label, color }) => (
        <div key={label} className="flex items-center gap-2 mb-1.5 last:mb-0">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-slate-700 dark:text-slate-300 text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function HeatMap() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    async function fetchSurveys() {
      try {
        const { data, error } = await supabase.from('surveys').select('*');
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

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <div className="relative" style={{ height: 'calc(100vh - 64px)' }}>
      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-slate-100 dark:bg-slate-900">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-600 dark:text-slate-400 text-sm">Loading map data…</p>
          </div>
        </div>
      )}

      <MapContainer
        center={[9.2, 77.5]}
        zoom={9}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a>'
        />
        {surveys.map((survey) => (
          <CircleMarker
            key={survey.id}
            center={[survey.lat, survey.lng]}
            radius={8 + survey.urgency / 2}
            pathOptions={{
              fillColor:   mapMarkerColor(survey.urgency, isDark),
              fillOpacity: 0.85,
              color:       mapMarkerStroke(isDark),
              weight:      1.5,
            }}
          >
            <Popup>
              <div className="min-w-[160px]">
                <p className="text-base font-bold text-slate-900 mb-1">{survey.village}</p>
                <p className="text-sm text-slate-600 mb-1">
                  {NEED_ICONS[survey.need_type]} {survey.need_type}
                </p>
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${urgencyColor(survey.urgency)}`}>
                  {urgencyLabel(survey.urgency)} · {survey.urgency}/10
                </span>
                <p className="text-sm text-slate-600 mt-1.5">
                  👨‍👩‍👧‍👦 {survey.families} families
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <MapLegend />
    </div>
  );
}
