import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, AlertTriangle, UploadCloud } from 'lucide-react';

export default function VolunteerFeedback() {
  const navigate = useNavigate();
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);
  const [dragActiveBefore, setDragActiveBefore] = useState(false);
  const [dragActiveAfter, setDragActiveAfter] = useState(false);

  const handleFile = (file, type) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'before') setBeforePhoto(e.target.result);
        if (type === 'after') setAfterPhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e, type) => {
    e.preventDefault();
    if (type === 'before') setDragActiveBefore(true);
    if (type === 'after') setDragActiveAfter(true);
  };

  const onDragLeave = (e, type) => {
    e.preventDefault();
    if (type === 'before') setDragActiveBefore(false);
    if (type === 'after') setDragActiveAfter(false);
  };

  const onDrop = (e, type) => {
    e.preventDefault();
    if (type === 'before') setDragActiveBefore(false);
    if (type === 'after') setDragActiveAfter(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], type);
    }
  };

  const onChange = (e, type) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0], type);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.setItem('volunteer_assignment_status', 'completed');
      navigate('/volunteer/dashboard');
    }, 1500);
  };
  return (
    <div className="pt-24 pb-12 px-6 sm:px-12 max-w-3xl mx-auto min-h-[calc(100vh-80px)]">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-nx-text-primary tracking-tight">
          Completion Proof
        </h1>
        <p className="text-nx-text-secondary mt-1">
          Upload your before/after photos and report the status of the assigned task.
        </p>
      </div>

      <div className="bg-nx-bg-surface border border-nx-border-default rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 text-nx-text-primary font-bold mb-4">
          <AlertTriangle className="w-5 h-5 text-nx-crimson" />
          Task: Medical Aid (Kadayam)
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before Photo */}
            <div 
              onDragOver={(e) => onDragOver(e, 'before')}
              onDragLeave={(e) => onDragLeave(e, 'before')}
              onDrop={(e) => onDrop(e, 'before')}
              onClick={() => beforeInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-2 h-48 flex flex-col items-center justify-center text-center cursor-pointer transition-colors overflow-hidden
                ${dragActiveBefore ? 'bg-nx-accent-subtle border-nx-accent-primary' : 'bg-nx-bg-elevated border-nx-border-default hover:border-nx-accent-primary'}
              `}
            >
              <input 
                ref={beforeInputRef}
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={(e) => onChange(e, 'before')}
                className="hidden" 
              />
              
              {beforePhoto ? (
                <>
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${beforePhoto})` }}></div>
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white mb-2" />
                    <p className="text-white text-sm font-bold">Change Photo</p>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-nx-success text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                    ✓ Uploaded
                  </div>
                </>
              ) : (
                <>
                  <Camera className={`w-8 h-8 mb-3 ${dragActiveBefore ? 'text-nx-accent-primary animate-bounce' : 'text-nx-text-tertiary'}`} />
                  <p className="text-sm font-bold text-nx-text-primary mb-1">Upload BEFORE Photo</p>
                  <p className="text-xs text-nx-text-secondary max-w-[180px]">Drag & drop image or tap to open camera</p>
                </>
              )}
            </div>

            {/* After Photo */}
            <div 
              onDragOver={(e) => onDragOver(e, 'after')}
              onDragLeave={(e) => onDragLeave(e, 'after')}
              onDrop={(e) => onDrop(e, 'after')}
              onClick={() => afterInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-2 h-48 flex flex-col items-center justify-center text-center cursor-pointer transition-colors overflow-hidden
                ${dragActiveAfter ? 'bg-nx-accent-subtle border-nx-accent-primary' : 'bg-nx-bg-elevated border-nx-border-default hover:border-nx-accent-primary'}
              `}
            >
              <input 
                ref={afterInputRef}
                type="file" 
                accept="image/*" 
                capture="environment"
                onChange={(e) => onChange(e, 'after')}
                className="hidden" 
              />
              
              {afterPhoto ? (
                <>
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${afterPhoto})` }}></div>
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white mb-2" />
                    <p className="text-white text-sm font-bold">Change Photo</p>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-nx-success text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                    ✓ Uploaded
                  </div>
                </>
              ) : (
                <>
                  <Camera className={`w-8 h-8 mb-3 ${dragActiveAfter ? 'text-nx-accent-primary animate-bounce' : 'text-nx-text-tertiary'}`} />
                  <p className="text-sm font-bold text-nx-text-primary mb-1">Upload AFTER Photo</p>
                  <p className="text-xs text-nx-text-secondary max-w-[180px]">Drag & drop image or tap to open camera</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-nx-border-default">
            <h3 className="text-sm font-bold text-nx-text-primary">Is the problem solved?</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 border border-nx-border-strong rounded-lg p-4 cursor-pointer hover:bg-nx-bg-elevated transition-colors flex items-center gap-3 group">
                <input type="radio" name="solved" value="yes" className="w-4 h-4 accent-nx-success" />
                <div>
                  <p className="text-sm font-bold text-nx-text-primary group-hover:text-nx-success transition-colors">YES</p>
                  <p className="text-xs text-nx-text-secondary">Problem fully solved</p>
                </div>
              </label>
              
              <label className="flex-1 border border-nx-border-strong rounded-lg p-4 cursor-pointer hover:bg-nx-bg-elevated transition-colors flex items-center gap-3 group">
                <input type="radio" name="solved" value="partial" className="w-4 h-4 accent-nx-amber" />
                <div>
                  <p className="text-sm font-bold text-nx-text-primary group-hover:text-nx-amber transition-colors">PARTIAL</p>
                  <p className="text-xs text-nx-text-secondary">Needs more work/supplies</p>
                </div>
              </label>

              <label className="flex-1 border border-nx-border-strong rounded-lg p-4 cursor-pointer hover:bg-nx-bg-elevated transition-colors flex items-center gap-3 group">
                <input type="radio" name="solved" value="no" className="w-4 h-4 accent-nx-crimson" />
                <div>
                  <p className="text-sm font-bold text-nx-text-primary group-hover:text-nx-crimson transition-colors">NO</p>
                  <p className="text-xs text-nx-text-secondary">Could not resolve</p>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-nx-border-default">
            <label className="text-sm font-bold text-nx-text-primary">Additional Notes (Optional)</label>
            <textarea 
              className="w-full bg-nx-bg-elevated border border-nx-border-default rounded-lg p-3 text-sm text-nx-text-primary placeholder-nx-text-disabled focus:border-nx-accent-primary outline-none min-h-[100px] resize-none"
              placeholder="e.g. Distributed antibiotics to 45 families. Requesting a follow-up visit in 3 days."
            ></textarea>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || !beforePhoto || !afterPhoto}
            className="w-full bg-nx-accent-primary hover:bg-nx-accent-hover text-white py-4 rounded-lg font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UploadCloud className="w-5 h-5" />
                Submit Completion Proof
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
