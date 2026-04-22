/** Returns Tailwind classes for urgency badge — adapts to light/dark */
export function urgencyColor(score) {
  if (score >= 8) return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20';
  if (score >= 5) return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20';
  return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20';
}

/** Returns hex color for Leaflet map markers — adapts to dark/light */
export function mapMarkerColor(score, isDark = true) {
  if (score >= 8) return isDark ? '#f87171' : '#dc2626'; // red
  if (score >= 5) return isDark ? '#f59e0b' : '#d97706'; // amber
  return isDark ? '#34d399' : '#059669';                  // emerald
}

/** Returns stroke color for markers */
export function mapMarkerStroke(isDark = true) {
  return isDark ? '#ffffff' : '#1e293b';
}

/** Returns urgency tier label */
export function urgencyLabel(score) {
  if (score >= 8) return 'High';
  if (score >= 5) return 'Medium';
  return 'Low';
}

/** Recharts colors that adapt to theme */
export function chartColors(isDark) {
  return {
    high:   isDark ? '#f87171' : '#dc2626',
    medium: isDark ? '#f59e0b' : '#d97706',
    low:    isDark ? '#34d399' : '#059669',
    bar:    isDark ? '#3b82f6' : '#2563eb',
    text:   isDark ? '#94a3b8' : '#475569',
    grid:   isDark ? '#1e293b' : '#e2e8f0',
  };
}

/** Format date string */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}
