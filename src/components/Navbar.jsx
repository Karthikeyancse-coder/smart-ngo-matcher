import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Home, Map as MapIcon, UploadCloud, Users, BarChart2, Sun, Moon, Menu, X, Target, LogOut } from 'lucide-react';

const DASHBOARD_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
  { to: '/map',       label: 'Map',       icon: <MapIcon className="w-4 h-4" />  },
  { to: '/upload',    label: 'Upload',    icon: <UploadCloud className="w-4 h-4" /> },
  { to: '/match',     label: 'Match',     icon: <Users className="w-4 h-4" /> },
  { to: '/reports',   label: 'Reports',   icon: <BarChart2 className="w-4 h-4" /> },
];

const LANDING_LINKS = [
  { to: '#features',  label: 'Features', icon: null },
  { to: '#how-it-works', label: 'How it works', icon: null },
  { to: '#impact',    label: 'Impact', icon: null },
];

const VOLUNTEER_LINKS = [
  { to: '/volunteer/dashboard', label: 'My Tasks', icon: <Home className="w-4 h-4" /> },
  { to: '/volunteer/map',       label: 'Task Map', icon: <MapIcon className="w-4 h-4" /> },
  { to: '/volunteer/feedback',  label: 'Feedback', icon: <UploadCloud className="w-4 h-4" /> },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';
  const userRole = localStorage.getItem('userRole');
  const isVolunteer = userRole === 'volunteer';
  const isLogin = location.pathname.includes('/login');
  
  let activeLinks = DASHBOARD_LINKS;
  if (isLanding) {
    activeLinks = LANDING_LINKS;
  } else if (isVolunteer) {
    activeLinks = VOLUNTEER_LINKS;
  }



  if (isLogin) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className="p-2.5 rounded-full bg-nx-bg-surface border border-nx-border-default shadow-sm text-nx-text-secondary hover:text-nx-text-primary hover:bg-nx-bg-elevated transition-all duration-300 hover:scale-110 active:scale-95"
        >
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <>
    <nav className="sticky top-0 z-50 bg-nx-bg-surface/80 backdrop-blur-md border-b border-nx-border-default shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <NavLink to="/" className="flex items-center gap-2 shrink-0 group">
            <Target className="w-6 h-6 text-nx-accent-primary group-hover:scale-110 transition-transform" />
            <span className="font-display font-bold text-nx-text-primary text-xl tracking-tight">
              NexusAid
            </span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {activeLinks.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'text-nx-accent-primary bg-nx-accent-subtle'
                    : 'text-nx-text-secondary hover:text-nx-text-primary hover:bg-nx-bg-elevated'
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right: theme toggle + logout + hamburger */}
          <div className="flex items-center gap-2">
            {!isLanding && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-lg text-nx-text-secondary hover:text-nx-crimson hover:bg-nx-crimson-subtle transition-all duration-300 hover:scale-110 active:scale-95 flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium hidden md:inline">Logout</span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              title="Toggle theme"
              className="p-2 rounded-lg text-nx-text-secondary hover:bg-nx-bg-elevated transition-all duration-300 hover:scale-110 active:scale-95"
            >
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Mobile hamburger - Only for Landing */}
            {isLanding && (
              <button
                className="md:hidden p-2 rounded-lg text-nx-text-secondary hover:bg-nx-bg-elevated transition-colors"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile dropdown - Only for Landing */}
        {isLanding && menuOpen && (
          <div className="md:hidden pb-3 flex flex-col gap-1 animate-slide-up">
            {activeLinks.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? 'text-nx-accent-primary bg-nx-accent-subtle'
                    : 'text-nx-text-secondary hover:text-nx-text-primary hover:bg-nx-bg-elevated'
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>

    {/* Mobile Bottom Navigation (App-style) for Dashboard routes */}
    {!isLanding && (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-nx-bg-surface/90 backdrop-blur-xl border-t border-nx-border-default shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.3)] pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {activeLinks.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300
                ${isActive ? 'text-nx-accent-primary' : 'text-nx-text-secondary hover:text-nx-text-primary'}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute inset-x-2 inset-y-1.5 bg-nx-accent-primary/10 border border-nx-accent-primary/20 shadow-[0_0_12px_rgba(59,130,246,0.3)] rounded-xl -z-10" />
                  )}
                  <div className={`transition-transform duration-300 ${isActive ? '-translate-y-0.5' : ''}`}>
                    {React.cloneElement(icon, { className: 'w-5 h-5' })}
                  </div>
                  <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? 'opacity-100 font-bold' : 'opacity-70'}`}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    )}
    </>
  );
}
