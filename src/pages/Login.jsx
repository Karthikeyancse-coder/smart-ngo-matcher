import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, ArrowRight, Mail, Lock, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = (e) => {
    e.preventDefault();
    setEmail('admin@nexusaid.org');
    setPassword('••••••••••••');
    setIsLoading(true);
    
    // Simulate network delay for demo
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
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
            Sign in to access the Command Center, view live threat maps, and deploy resources to communities in need.
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-display font-bold text-nx-text-primary mb-2">Welcome back</h1>
            <p className="text-nx-text-secondary mb-8">Enter your credentials to access the platform.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-nx-bg-surface border border-nx-border-default focus:border-nx-accent-primary rounded-lg pl-10 pr-4 py-3 text-nx-text-primary placeholder:text-nx-text-disabled outline-none transition-all shadow-sm focus:shadow-glow"
                    placeholder="••••••••"
                  />
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

            <div className="mt-8 pt-8 border-t border-nx-border-subtle">
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}
