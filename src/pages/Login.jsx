import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

export default function Login({ isVolunteerPortal = false }) {
  const navigate = useNavigate();
  const [role, setRole] = useState(isVolunteerPortal ? 'volunteer' : 'coordinator');
  const [email, setEmail] = useState(isVolunteerPortal ? 'dr.aravind@gmail.com' : 'admin@nexusaid.org');
  const [password, setPassword] = useState(isVolunteerPortal ? 'volunteer123' : 'admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    if (newRole === 'coordinator') {
      setEmail('admin@nexusaid.org');
      setPassword('admin123');
    } else {
      setEmail('dr.aravind@gmail.com');
      setPassword('volunteer123');
    }
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', role);
      
      if (role === 'volunteer') {
        navigate('/volunteer/dashboard');
      } else {
        navigate('/dashboard');
      }
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    try {
      // In a real environment, this triggers Google OAuth flow
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      if (error) throw error;
      // Fallback if OAuth is not configured in Supabase
      if (!data) {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      // Fallback for demo purposes
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-nx-bg-base flex font-body selection:bg-nx-accent-subtle selection:text-nx-accent-primary">
      
      {/* Left Side - Visual/Brand */}
      <div className="hidden lg:flex flex-1 relative bg-nx-bg-surface border-r border-nx-border-default overflow-hidden items-center justify-center">
        {/* Subtle background grid & gradient */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--color-accent-primary)_1px,_transparent_1px)]" style={{ backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--color-accent-subtle),_transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-lg px-12">
          <div className="flex items-center gap-3 mb-12">
            <Target className="w-8 h-8 text-nx-accent-primary" />
            <span className="font-display font-bold text-nx-text-primary text-2xl tracking-tight">
              NexusAid
            </span>
          </div>
          
          <h2 className="text-4xl font-display font-bold text-nx-text-primary mb-6 leading-tight tracking-tight">
            Intelligence at <br/>the edge of impact.
          </h2>
          <p className="text-lg text-nx-text-secondary leading-relaxed mb-12">
            Select your role to access the Command Center as a Coordinator, or manage your field assignments as a Volunteer.
          </p>

          <div className="bg-nx-bg-card border border-nx-border-subtle rounded-xl p-6 shadow-modal">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-nx-crimson animate-pulse" />
              <span className="text-xs font-mono font-bold text-nx-text-tertiary uppercase tracking-wider">Live Intel Feed</span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-nx-crimson-subtle flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4 text-nx-crimson" />
                </div>
                <div>
                  <p className="text-sm font-bold text-nx-text-primary">Medical Aid Required</p>
                  <p className="text-xs text-nx-text-secondary">Madurai District • 12 mins ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 relative">
        <div className="w-full max-w-md mx-auto">
          
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <Target className="w-6 h-6 text-nx-accent-primary" />
            <span className="font-display font-bold text-nx-text-primary text-xl tracking-tight">
              NexusAid
            </span>
          </div>

          {/* Animated Mascot */}
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20 bg-nx-bg-elevated rounded-full border-4 border-nx-border-strong overflow-hidden flex items-center justify-center shadow-md">
              {/* Eyes */}
              <div className="flex gap-3 mt-[-10px]">
                <motion.div 
                  className="w-3 h-3 bg-nx-text-primary rounded-full" 
                  animate={{ scaleY: isPasswordFocused && !showPassword ? 0.2 : 1 }}
                />
                <motion.div 
                  className="w-3 h-3 bg-nx-text-primary rounded-full" 
                  animate={{ scaleY: isPasswordFocused && !showPassword ? 0.2 : 1 }}
                />
              </div>
              
              {/* Hands covering eyes */}
              <motion.div 
                className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-1"
                initial={{ y: 50 }}
                animate={{ y: isPasswordFocused && !showPassword ? -10 : 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-8 h-10 bg-nx-accent-primary rounded-t-full shadow-[0_-4px_10px_rgba(0,0,0,0.2)]" />
                <div className="w-8 h-10 bg-nx-accent-primary rounded-t-full shadow-[0_-4px_10px_rgba(0,0,0,0.2)]" />
              </motion.div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-display font-bold text-nx-text-primary mb-2 text-center">Welcome back</h1>
            <p className="text-nx-text-secondary mb-8 text-center">Enter your credentials to access the platform.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Switcher - Hidden in dedicated portals */}
              {!isVolunteerPortal && (
                <div className="flex bg-nx-bg-surface p-1 rounded-lg border border-nx-border-default mb-2">
                  <button 
                    type="button"
                    onClick={() => handleRoleSwitch('coordinator')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${role === 'coordinator' ? 'bg-nx-accent-primary text-white shadow-md' : 'text-nx-text-secondary hover:text-nx-text-primary hover:bg-nx-bg-elevated'}`}
                  >
                    Coordinator
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleRoleSwitch('volunteer')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${role === 'volunteer' ? 'bg-nx-accent-primary text-white shadow-md' : 'text-nx-text-secondary hover:text-nx-text-primary hover:bg-nx-bg-elevated'}`}
                  >
                    Volunteer
                  </button>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-bold text-nx-text-secondary">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-nx-text-tertiary" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-nx-bg-surface border border-nx-border-default focus:border-nx-accent-primary rounded-lg pl-10 pr-4 py-3 text-nx-text-primary placeholder:text-nx-text-disabled outline-none transition-all shadow-sm focus:shadow-glow"
                    placeholder="hq@ngo.org"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-nx-text-secondary">Password</label>
                  <a href="#" className="text-xs font-bold text-nx-accent-primary hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-nx-text-tertiary" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    required
                    className="w-full bg-nx-bg-surface border border-nx-border-default focus:border-nx-accent-primary rounded-lg pl-10 pr-12 py-3 text-nx-text-primary placeholder:text-nx-text-disabled outline-none transition-all shadow-sm focus:shadow-glow"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-nx-text-tertiary hover:text-nx-text-primary transition-colors focus:outline-none"
                    tabIndex="-1"
                  >
                    <AnimatePresence mode="wait">
                      {showPassword ? (
                        <motion.div key="eye-off" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}>
                          <EyeOff className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <motion.div key="eye" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}>
                          <Eye className="w-5 h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-nx-accent-primary hover:bg-nx-accent-hover text-white rounded-lg font-bold text-base flex items-center justify-center transition-all shadow-md hover:shadow-glow active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-nx-border-subtle"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-nx-bg-base text-nx-text-tertiary">Or continue with</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleGoogleLogin}
                  type="button"
                  className="w-full h-12 bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 rounded-lg font-bold text-base flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    <path fill="none" d="M1 1h22v22H1z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                <button 
                  onClick={handleDemoLogin}
                  type="button"
                  className="w-full h-12 bg-nx-bg-surface border border-nx-border-default hover:bg-nx-bg-elevated text-nx-text-primary rounded-lg font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                <span>Demo Mode (Auto-Login)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-center text-nx-text-tertiary mt-4">
                Clicking Demo Mode will bypass authentication and load sample data.
              </p>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
