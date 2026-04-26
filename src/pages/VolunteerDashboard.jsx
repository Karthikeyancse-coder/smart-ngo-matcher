import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, Phone, MessageSquare, AlertTriangle, ArrowRight, ShieldAlert, Check } from 'lucide-react';

export default function VolunteerDashboard() {
  const [status, setStatus] = useState(() => {
    return localStorage.getItem('volunteer_assignment_status') || 'assigned';
  });

  const handleAccept = () => {
    setStatus('accepted');
    localStorage.setItem('volunteer_assignment_status', 'accepted');
  };

  const handleReject = () => {
    setStatus('rejected');
    localStorage.setItem('volunteer_assignment_status', 'rejected');
  };

  const resetDemo = () => {
    setStatus('assigned');
    localStorage.setItem('volunteer_assignment_status', 'assigned');
  };

  return (
    <div className="pt-24 pb-12 px-6 sm:px-12 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-nx-text-primary tracking-tight">
            My Assignments
          </h1>
          <p className="text-nx-text-secondary mt-1">Manage your active deployments and field tasks.</p>
        </div>
        <div className="flex items-center gap-4 bg-nx-bg-surface px-4 py-2 rounded-full border border-nx-border-default shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-nx-success animate-pulse"></span>
            <span className="text-sm font-bold text-nx-text-primary">Available for deployment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {status === 'rejected' || status === 'completed' ? (
            <div className="bg-nx-bg-surface border border-nx-border-default rounded-xl p-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-nx-bg-elevated rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-nx-text-tertiary" />
              </div>
              <h2 className="text-xl font-bold text-nx-text-primary mb-2">
                {status === 'completed' ? 'Great Job!' : 'No active assignments'}
              </h2>
              <p className="text-nx-text-secondary max-w-md mx-auto mb-6">
                {status === 'completed' 
                  ? 'Your completion proof has been submitted and is awaiting coordinator verification. Take a rest!' 
                  : 'You currently have no tasks assigned to you. The coordinator will notify you when your skills are needed in the field.'}
              </p>
              <button onClick={resetDemo} className="text-sm font-bold text-nx-accent-primary hover:underline">
                [Reset Demo Flow]
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-nx-bg-surface border border-nx-border-strong rounded-xl overflow-hidden shadow-modal relative"
            >
              {status === 'assigned' && (
                <div className="bg-nx-accent-primary/10 border-b border-nx-accent-primary/20 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-nx-accent-primary">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-bold tracking-wide">NEW ASSIGNMENT</span>
                  </div>
                  <span className="text-xs font-bold text-nx-text-secondary">Expires in 24h</span>
                </div>
              )}
              {status === 'accepted' && (
                <div className="bg-nx-success/10 border-b border-nx-success/20 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-nx-success">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-bold tracking-wide">ACTIVE DEPLOYMENT</span>
                  </div>
                  <span className="text-xs font-bold text-nx-text-secondary">Deadline: Apr 27 @ 2:23 PM</span>
                </div>
              )}

              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldAlert className="w-5 h-5 text-nx-crimson" />
                      <h2 className="text-2xl font-bold text-nx-text-primary">Medical Aid / Emergency</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-nx-text-secondary">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-nx-accent-primary" />
                        Kadayam, Tenkasi
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-nx-amber" />
                        12 km away (15 min)
                      </div>
                    </div>
                  </div>
                  <div className="bg-nx-bg-elevated px-3 py-1.5 rounded-lg border border-nx-border-default text-center hidden sm:block">
                    <p className="text-2xl font-display font-bold text-nx-accent-primary">96%</p>
                    <p className="text-[10px] font-bold text-nx-text-tertiary uppercase">Match Score</p>
                  </div>
                </div>

                <div className="bg-nx-bg-elevated rounded-lg p-5 mb-8 border border-nx-border-default">
                  <h3 className="text-sm font-bold text-nx-text-tertiary mb-2 uppercase tracking-wide">Situation Report</h3>
                  <p className="text-nx-text-primary leading-relaxed">
                    "Need immediate antibiotics and emergency kits due to flooding blocking the main access road. 45 families are currently affected and waiting for assistance."
                  </p>
                </div>

                {status === 'assigned' && (
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-nx-border-default">
                    <button 
                      onClick={handleAccept}
                      className="flex-1 bg-nx-accent-primary hover:bg-nx-accent-hover text-white py-3 rounded-lg font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Accept Assignment
                    </button>
                    <button 
                      onClick={handleReject}
                      className="flex-1 bg-nx-bg-elevated hover:bg-nx-bg-overlay border border-nx-border-strong text-nx-text-primary py-3 rounded-lg font-bold transition-all active:scale-95"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {status === 'accepted' && (
                  <div className="pt-4 border-t border-nx-border-default">
                    <button 
                      onClick={() => window.location.href = '/volunteer/feedback'}
                      className="w-full bg-nx-success hover:bg-[#00c885] text-white py-4 rounded-lg font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-lg"
                    >
                      Check-In & Upload Proof
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* History */}
          <div className="pt-8">
            <h3 className="text-lg font-bold text-nx-text-primary mb-4">Previous Deployments</h3>
            <div className="space-y-3">
              <div className="bg-nx-bg-surface border border-nx-border-default p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-nx-text-primary">Water Supply</h4>
                  <p className="text-sm text-nx-text-secondary">Alangulam • Apr 25</p>
                </div>
                <div className="text-right">
                  <p className="text-nx-success font-bold text-sm mb-1">Completed ✓</p>
                  <div className="flex gap-1 text-nx-amber">
                    {'★★★★★'.split('').map((star, i) => <span key={i} className="text-sm">{star}</span>)}
                  </div>
                </div>
              </div>
              <div className="bg-nx-bg-surface border border-nx-border-default p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-nx-text-primary">Food Aid</h4>
                  <p className="text-sm text-nx-text-secondary">Tirunelveli • Apr 23</p>
                </div>
                <div className="text-right">
                  <p className="text-nx-success font-bold text-sm mb-1">Completed ✓</p>
                  <div className="flex gap-1 text-nx-amber">
                    {'★★★★★'.split('').map((star, i) => <span key={i} className="text-sm">{star}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-nx-bg-surface border border-nx-border-default rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-nx-accent-primary/20 rounded-full flex items-center justify-center text-nx-accent-primary font-bold text-xl">
                AK
              </div>
              <div>
                <h3 className="font-bold text-nx-text-primary text-lg">Dr. Aravind</h3>
                <p className="text-sm text-nx-text-secondary">Medical Specialist</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-nx-bg-elevated p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-nx-text-primary">34</p>
                <p className="text-[10px] uppercase font-bold text-nx-text-tertiary tracking-wider mt-1">Completed</p>
              </div>
              <div className="bg-nx-bg-elevated p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-nx-text-primary text-nx-amber">4.9</p>
                <p className="text-[10px] uppercase font-bold text-nx-text-tertiary tracking-wider mt-1">Rating</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-nx-text-secondary">Families Helped</span>
                <span className="font-bold text-nx-text-primary">847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nx-text-secondary">Hours Contributed</span>
                <span className="font-bold text-nx-text-primary">156</span>
              </div>
            </div>
          </div>

          {/* Coordinator Contact */}
          {(status === 'assigned' || status === 'accepted') && (
            <div className="bg-nx-bg-surface border border-nx-border-default rounded-xl p-6">
              <h3 className="text-sm font-bold text-nx-text-tertiary uppercase tracking-wider mb-4">Command Center Contact</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-nx-bg-elevated rounded-full flex items-center justify-center">
                  <span className="font-bold text-nx-text-primary">PS</span>
                </div>
                <div>
                  <p className="font-bold text-nx-text-primary text-sm">Priya Sharma</p>
                  <p className="text-xs text-nx-text-secondary">Field Coordinator</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-nx-bg-elevated hover:bg-nx-bg-overlay border border-nx-border-default py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold text-nx-text-primary transition-colors">
                  <Phone className="w-4 h-4" />
                  Call
                </button>
                <button className="flex-1 bg-nx-bg-elevated hover:bg-nx-bg-overlay border border-nx-border-default py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold text-nx-text-primary transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
