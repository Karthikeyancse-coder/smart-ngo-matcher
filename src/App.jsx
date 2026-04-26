import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';

// Lazy-load all pages for smaller initial bundle
const Login = lazy(() => import('./pages/Login'));
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const HeatMap = lazy(() => import('./pages/HeatMap'));
const UploadSurvey = lazy(() => import('./pages/UploadSurvey'));
const VolunteerMatcher = lazy(() => import('./pages/VolunteerMatcher'));
const VolunteerDashboard = lazy(() => import('./pages/VolunteerDashboard'));
const VolunteerMap = lazy(() => import('./pages/VolunteerMap'));
const VolunteerFeedback = lazy(() => import('./pages/VolunteerFeedback'));
const Reports = lazy(() => import('./pages/Reports'));
const NotFound = lazy(() => import('./pages/NotFound'));

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

function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-nx-bg-base text-nx-text-primary transition-colors duration-300 font-body pb-20 md:pb-0">
          <Navbar />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              {/* <Route path="/volunteer/login" element={<Login isVolunteerPortal={true} />} /> */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/volunteer/dashboard" element={<ProtectedRoute><VolunteerDashboard /></ProtectedRoute>} />
              <Route path="/volunteer/map" element={<ProtectedRoute><VolunteerMap /></ProtectedRoute>} />
              <Route path="/volunteer/feedback" element={<ProtectedRoute><VolunteerFeedback /></ProtectedRoute>} />
              <Route path="/map" element={<ProtectedRoute><HeatMap /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><UploadSurvey /></ProtectedRoute>} />
              <Route path="/match" element={<ProtectedRoute><VolunteerMatcher /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
