import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, MapPin, Activity, ShieldAlert, HeartPulse, Droplet, Thermometer, Pill, Camera, Mic, Save, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OCR_STEPS = [
  'Image Processing',
  'Text Extraction',
  'AI Classification',
  'Field Mapping'
];

export default function UploadSurvey() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('idle'); // idle, scanning, complete
  const [confidence, setConfidence] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    village: '',
    district: '',
    category: '',
    description: '',
    urgency: 5,
    families: 0
  });

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startOcrPipeline(e.dataTransfer.files[0]);
    }
  };

  const startOcrPipeline = (uploadedFile) => {
    setFile(URL.createObjectURL(uploadedFile));
    setOcrStatus('scanning');
    setOcrProgress(0);

    // Simulate OCR steps
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setOcrProgress(step);
      if (step === 4) {
        clearInterval(interval);
        setOcrStatus('complete');
        setConfidence(94);
        setFormData({
          ...formData,
          village: 'Kadayam',
          district: 'Tenkasi',
          category: 'Medical Aid',
          description: 'Emergency medical supplies needed due to recent flooding affecting main road access.',
          families: 45,
          urgency: 8
        });
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-nx-bg-base font-body pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-nx-text-primary tracking-tight">
            Intelligence Upload
          </h1>
          <p className="text-nx-text-secondary mt-1">
            Upload field surveys for automated AI extraction and mapping.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: Upload & OCR Pipeline */}
          <div className="space-y-6">
            
            {/* Upload Zone */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300 ${
                isDragging ? 'border-nx-accent-primary bg-nx-accent-subtle' : 'border-nx-border-strong bg-nx-bg-surface hover:border-nx-accent-primary hover:bg-nx-bg-elevated'
              }`}
            >
              <div className="p-12 flex flex-col items-center justify-center text-center h-80">
                {file ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden border border-nx-border-subtle group">
                    <img src={file} alt="Survey preview" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-nx-bg-base/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="px-4 py-2 bg-nx-bg-overlay backdrop-blur rounded-lg text-sm font-bold text-white border border-nx-border-default shadow-modal">
                        View Full Size
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-nx-bg-elevated flex items-center justify-center mb-4">
                      <UploadCloud className="w-8 h-8 text-nx-accent-primary" />
                    </div>
                    <p className="text-lg font-bold text-nx-text-primary mb-2 font-display">
                      {isDragging ? 'Drop survey here!' : 'Drop survey or photo here'}
                    </p>
                    <p className="text-sm text-nx-text-tertiary mb-6 max-w-xs">
                      Supports JPG, PNG, and PDF. Our OCR engine handles handwritten forms automatically.
                    </p>
                    <label className="cursor-pointer px-6 py-2.5 bg-nx-bg-elevated border border-nx-border-default hover:bg-nx-bg-overlay text-nx-text-primary rounded-lg text-sm font-bold transition-all active:scale-95">
                      <span>Browse Files</span>
                      <input type="file" className="hidden" onChange={(e) => e.target.files[0] && startOcrPipeline(e.target.files[0])} />
                    </label>
                  </>
                )}
              </div>
              
              {/* Scan Line Animation */}
              {ocrStatus === 'scanning' && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-1 bg-nx-accent-primary shadow-[0_0_15px_rgba(29,78,216,0.8)] animate-scan-fast" />
                </div>
              )}
            </div>

            {/* OCR Pipeline */}
            <div className="bg-nx-bg-surface border border-nx-border-subtle rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-nx-text-secondary uppercase tracking-widest mb-6">OCR Intelligence Pipeline</h3>
              
              <div className="space-y-4">
                {OCR_STEPS.map((stepName, i) => {
                  const isActive = ocrStatus === 'scanning' && ocrProgress === i;
                  const isDone = ocrProgress > i || ocrStatus === 'complete';
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                        isDone ? 'bg-nx-cyan-subtle border-nx-cyan' : 
                        isActive ? 'bg-nx-accent-subtle border-nx-accent-primary' : 
                        'bg-nx-bg-elevated border-nx-border-default'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4 text-nx-cyan" /> :
                         isActive ? <div className="w-4 h-4 border-2 border-nx-accent-primary border-t-transparent rounded-full animate-spin" /> :
                         <span className="text-xs font-mono text-nx-text-tertiary">{i + 1}</span>}
                      </div>
                      <span className={`text-sm font-semibold transition-colors ${
                        isDone || isActive ? 'text-nx-text-primary' : 'text-nx-text-disabled'
                      }`}>
                        {stepName}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Confidence Meter */}
              {ocrStatus === 'complete' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8 pt-6 border-t border-nx-border-subtle">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-nx-text-primary">AI Confidence Score</span>
                    <span className="text-2xl font-mono font-bold text-nx-green">{confidence}%</span>
                  </div>
                  <div className="w-full h-2 bg-nx-bg-elevated rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full bg-nx-green" />
                  </div>
                  <p className="text-xs text-nx-text-tertiary mt-2">All primary fields extracted successfully. Ready for manual review.</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* RIGHT: Form Panel */}
          <div className="bg-nx-bg-surface border border-nx-border-subtle rounded-xl shadow-sm overflow-hidden flex flex-col relative">
            {ocrStatus !== 'complete' && ocrStatus !== 'idle' && (
              <div className="absolute inset-0 bg-nx-bg-surface/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-nx-border-strong border-t-nx-accent-primary rounded-full animate-spin mb-4" />
                <p className="font-mono text-sm text-nx-text-secondary uppercase tracking-widest animate-pulse">Extracting Data...</p>
              </div>
            )}
            
            <div className="p-6 space-y-8 overflow-y-auto">
              
              {/* Location Section */}
              <section>
                <h3 className="text-sm font-bold text-nx-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location Context
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-nx-text-tertiary">Village / Ward</label>
                    <input type="text" value={formData.village} onChange={(e) => setFormData({...formData, village: e.target.value})} className="w-full bg-nx-bg-base border border-nx-border-default focus:border-nx-accent-primary rounded-lg px-3 py-2 text-sm text-nx-text-primary outline-none transition-colors" placeholder="Enter village..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-nx-text-tertiary">District</label>
                    <input type="text" value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} className="w-full bg-nx-bg-base border border-nx-border-default focus:border-nx-accent-primary rounded-lg px-3 py-2 text-sm text-nx-text-primary outline-none transition-colors" placeholder="Select district..." />
                  </div>
                </div>
              </section>

              {/* Need Details */}
              <section>
                <h3 className="text-sm font-bold text-nx-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Need Categorization
                </h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { id: 'Water', icon: Droplet },
                    { id: 'Medical Aid', icon: HeartPulse },
                    { id: 'Food', icon: Pill },
                    { id: 'Sanitation', icon: ShieldAlert },
                    { id: 'Shelter', icon: Thermometer },
                    { id: 'Other', icon: Activity }
                  ].map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setFormData({...formData, category: cat.id})}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                        formData.category === cat.id ? 'bg-nx-accent-subtle border-nx-accent-primary text-nx-accent-primary' : 'bg-nx-bg-base border-nx-border-default text-nx-text-secondary hover:border-nx-text-tertiary'
                      }`}
                    >
                      <cat.icon className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase">{cat.id}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-nx-text-tertiary">Detailed Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} className="w-full bg-nx-bg-base border border-nx-border-default focus:border-nx-accent-primary rounded-lg px-3 py-2 text-sm text-nx-text-primary outline-none transition-colors resize-none" placeholder="Describe the situation..." />
                </div>
              </section>

              {/* Urgency */}
              <section>
                <h3 className="text-sm font-bold text-nx-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Urgency Assessment
                </h3>
                <div className="bg-nx-bg-base border border-nx-border-default rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-nx-text-tertiary">Urgency Level</span>
                    <span className={`text-xl font-mono font-bold ${formData.urgency >= 8 ? 'text-nx-crimson' : formData.urgency >= 5 ? 'text-nx-amber' : 'text-nx-cyan'}`}>
                      {formData.urgency}/10
                    </span>
                  </div>
                  <input 
                    type="range" min="1" max="10" 
                    value={formData.urgency} 
                    onChange={(e) => setFormData({...formData, urgency: Number(e.target.value)})}
                    className="w-full accent-nx-accent-primary h-2 bg-nx-bg-elevated rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-nx-text-disabled mt-2 uppercase">
                    <span>Monitor</span>
                    <span>Urgent</span>
                    <span>Critical</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-nx-text-tertiary">Families Affected</label>
                  <input type="number" value={formData.families} onChange={(e) => setFormData({...formData, families: Number(e.target.value)})} className="w-full bg-nx-bg-base border border-nx-border-default focus:border-nx-accent-primary rounded-lg px-3 py-2 text-sm text-nx-text-primary outline-none transition-colors" />
                </div>
              </section>

              {/* Media */}
              <section className="flex gap-4">
                <button className="flex-1 py-3 bg-nx-bg-base border border-nx-border-dashed hover:bg-nx-bg-elevated text-nx-text-secondary rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  <Camera className="w-4 h-4" /> Add Photos
                </button>
                <button className="flex-1 py-3 bg-nx-bg-base border border-nx-border-dashed hover:bg-nx-bg-elevated text-nx-text-secondary rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  <Mic className="w-4 h-4" /> Voice Note
                </button>
              </section>

            </div>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-nx-bg-surface/80 backdrop-blur-md border-t border-nx-border-strong px-6 py-4 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="w-5 h-5 border border-nx-border-strong rounded bg-nx-bg-base group-hover:border-nx-accent-primary flex items-center justify-center">
              {ocrStatus === 'complete' && <CheckCircle2 className="w-3 h-3 text-nx-accent-primary" />}
            </div>
            <span className="text-sm font-bold text-nx-text-secondary select-none">I verify this information is accurate</span>
          </label>
          <div className="flex gap-4">
            <button className="px-6 py-2.5 bg-nx-bg-elevated border border-nx-border-default hover:bg-nx-bg-overlay text-nx-text-primary rounded-lg font-bold text-sm transition-all shadow-sm">
              Save Draft
            </button>
            <button className="px-8 py-2.5 bg-nx-accent-primary hover:bg-nx-accent-hover text-white rounded-lg font-bold text-sm transition-all shadow-md hover:shadow-glow active:scale-95 flex items-center gap-2">
              <Send className="w-4 h-4" /> Submit Survey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
