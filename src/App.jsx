import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';

// Lazy-load all pages for smaller initial bundle
const Dashboard        = lazy(() => import('./pages/Dashboard'));
const HeatMap          = lazy(() => import('./pages/HeatMap'));
const UploadSurvey     = lazy(() => import('./pages/UploadSurvey'));
const VolunteerMatcher = lazy(() => import('./pages/VolunteerMatcher'));
const Reports          = lazy(() => import('./pages/Reports'));
const NotFound         = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 dark:text-slate-500 text-sm">Loading…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
          <Navbar />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"        element={<Dashboard />} />
              <Route path="/map"     element={<HeatMap />} />
              <Route path="/upload"  element={<UploadSurvey />} />
              <Route path="/match"   element={<VolunteerMatcher />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*"        element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
