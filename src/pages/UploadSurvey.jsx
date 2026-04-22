import React, { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const NEED_TYPES = ['Clean Water', 'Medical Aid', 'Education', 'Food Supply', 'Sanitation', 'Infrastructure'];
const MOCK_PARSED = { village: 'Kadayam', need_type: 'Food Supply', urgency: 9, families: 140 };

function Toast({ msg, type }) {
  if (!msg) return null;
  const cls = type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white';
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold animate-slide-up ${cls}`}>
      {msg}
    </div>
  );
}

export default function UploadSurvey() {
  const navigate   = useNavigate();
  const inputRef   = useRef();
  const [file,     setFile]     = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [parsed,   setParsed]   = useState(null);
  const [form,     setForm]     = useState(MOCK_PARSED);
  const [toast,    setToast]    = useState({ msg: '', type: '' });
  const [dragging, setDragging] = useState(false);
  const [saving,   setSaving]   = useState(false);

  function showToast(msg, type) {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3500);
  }

  function handleFile(f) {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setParsed(null);
  }

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  function analyze() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setParsed(MOCK_PARSED);
      setForm(MOCK_PARSED);
    }, 1500);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('surveys').insert([{
        village: form.village, need_type: form.need_type,
        urgency: Number(form.urgency), families: Number(form.families),
        lat: 9.1205, lng: 77.3982, status: 'open',
      }]);
      if (error) throw error;
      showToast('✅ Survey added to heatmap!', 'success');
      setTimeout(() => navigate('/map'), 1500);
    } catch (err) {
      showToast(`❌ ${err?.message || 'Failed to save survey.'}`, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 page-enter">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Upload Survey</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
          Upload a paper survey image — our system will extract the data automatically.
        </p>

        {!preview && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-14 flex flex-col items-center cursor-pointer transition-all duration-200
              ${dragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
          >
            <span className="text-5xl mb-4">📄</span>
            <p className="text-slate-700 dark:text-slate-300 font-semibold mb-1">Drag & drop survey image here</p>
            <p className="text-sm text-slate-400">or click to browse · PNG, JPG</p>
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => handleFile(e.target.files[0])} />
          </div>
        )}

        {preview && (
          <div className="mb-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <img src={preview} alt="Survey preview" className="w-full max-h-60 object-contain bg-slate-100 dark:bg-slate-900" />
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400 truncate">{file?.name}</span>
              <button onClick={() => { setPreview(null); setFile(null); setParsed(null); }}
                className="text-xs text-red-500 hover:text-red-600 font-medium">Remove ✕</button>
            </div>
          </div>
        )}

        {preview && !parsed && (
          <button onClick={analyze} disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95 mb-6 flex items-center justify-center gap-2">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Analyzing survey…</>
              : '🔍 Analyze Survey'}
          </button>
        )}

        {parsed && (
          <form onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-5 animate-slide-up">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">📋 Parsed Survey Data</h2>

            {[
              { label: 'Village', key: 'village', type: 'text' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">{label}</label>
                <input type={type} required value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">Need Type</label>
              <select value={form.need_type} onChange={(e) => setForm({ ...form, need_type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                {NEED_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">
                Urgency: <span className="text-blue-600 dark:text-blue-400 font-bold">{form.urgency}/10</span>
              </label>
              <input type="range" min="1" max="10" value={form.urgency}
                onChange={(e) => setForm({ ...form, urgency: Number(e.target.value) })} className="w-full" />
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Low</span><span>High</span></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">Families Affected</label>
              <input type="number" min="1" required value={form.families}
                onChange={(e) => setForm({ ...form, families: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>

            <button type="submit" disabled={saving}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
              {saving
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
                : '✅ Confirm & Save to Database'}
            </button>
          </form>
        )}
      </div>
      <Toast msg={toast.msg} type={toast.type} />
    </div>
  );
}
