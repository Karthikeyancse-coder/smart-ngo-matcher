import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Home, Map as MapIcon, UploadCloud, Users, BarChart2, Sun, Moon, Menu, X, Target } from 'lucide-react';

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
  { to: '#pricing',   label: 'Pricing', icon: null },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';
  
  const activeLinks = isLanding ? LANDING_LINKS : DASHBOARD_LINKS;

  return (
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

          {/* Right: theme toggle + hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title="Toggle theme"
              className="p-2 rounded-lg text-nx-text-secondary hover:bg-nx-bg-elevated transition-all duration-300 hover:scale-110 active:scale-95"
            >
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-nx-text-secondary hover:bg-nx-bg-elevated transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
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
  );
}
