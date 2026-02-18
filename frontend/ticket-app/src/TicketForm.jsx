// TicketForm.jsx
import { useState } from 'react';
import api from './api';

const categoryConfig = {
  general: { icon: '📋', color: 'from-slate-500 to-gray-500' },
  billing: { icon: '💳', color: 'from-green-500 to-emerald-500' },
  technical: { icon: '⚙️', color: 'from-blue-500 to-cyan-500' },
  account: { icon: '👤', color: 'from-purple-500 to-violet-500' },
  feature: { icon: '✨', color: 'from-yellow-500 to-orange-500' },
  bug: { icon: '🐛', color: 'from-red-500 to-pink-500' }
};

const priorityConfig = {
  low: { color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
  medium: { color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
  high: { color: 'from-orange-500 to-red-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
  critical: { color: 'from-red-500 to-rose-500', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' }
};

export default function TicketForm({ onTicketCreated }) {
  const [values, setValues] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'low'
  });

  const [isClassifying, setIsClassifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);

  const categories = ['general', 'billing', 'technical', 'account', 'feature', 'bug'];

  const handleClassify = async () => {
    if (!values.description.trim() || values.description.length < 10) return;
    
    setIsClassifying(true);
    try {
      const response = await api.post('tickets/classify/', {
        description: values.description
      });
      
      setValues(prev => ({
        ...prev,
        category: response.data.suggested_category || prev.category,
        priority: response.data.suggested_priority || prev.priority
      }));
    } catch (err) {
      console.log('classify failed', err);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSubmit = async () => {
    if (!values.title.trim() || !values.description.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post('tickets/', { ...values, status: 'open' });
      setJustSubmitted(true);
      setValues({
        title: '',
        description: '',
        category: 'general',
        priority: 'low'
      });
      if (onTicketCreated) onTicketCreated();
      setTimeout(() => setJustSubmitted(false), 4500);
    } catch (err) {
      console.log('submit error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = values.title.trim() && values.description.trim();

  return (
    <div className="group relative glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Top gradient bar */}
      <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500"></div>

      {/* Background effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="px-8 py-10 sm:px-12 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 p-[1px] shadow-lg shadow-purple-500/25">
            <div className="w-full h-full rounded-2xl bg-slate-900/90 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-7 h-7 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-200 via-violet-200 to-indigo-200 bg-clip-text text-transparent">
              Create New Ticket
            </h2>
            <p className="text-sm text-gray-500 mt-1">Fill in the details below</p>
          </div>
        </div>

        <div className="space-y-7">
          {/* Title Input */}
          <div className="relative">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2.5 uppercase tracking-wider">
              <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Title
            </label>
            <div className={`relative rounded-xl transition-all duration-300 ${focused === 'title' ? 'ring-2 ring-purple-500/50' : ''}`}>
              <input
                type="text"
                className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-5 py-4 text-gray-100 placeholder-gray-500 focus:border-purple-500/50 focus:bg-slate-900/80 outline-none transition-all"
                placeholder="Brief summary of the issue..."
                value={values.title}
                onChange={e => setValues({...values, title: e.target.value})}
                onFocus={() => setFocused('title')}
                onBlur={() => setFocused(null)}
              />
              {values.title && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Description Input */}
          <div className="relative">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2.5 uppercase tracking-wider">
              <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Description
            </label>
            <div className={`relative rounded-xl transition-all duration-300 ${focused === 'description' ? 'ring-2 ring-purple-500/50' : ''}`}>
              <textarea
                rows={4}
                className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-5 py-4 text-gray-100 placeholder-gray-500 focus:border-purple-500/50 focus:bg-slate-900/80 outline-none transition-all resize-none"
                placeholder="Describe your issue in detail..."
                value={values.description}
                onChange={e => setValues({...values, description: e.target.value})}
                onFocus={() => setFocused('description')}
                onBlur={() => {
                  setFocused(null);
                  handleClassify();
                }}
              />
              <div className="absolute right-4 bottom-4 text-xs text-gray-500">
                {values.description.length} characters
              </div>
            </div>
          </div>

          {/* AI Classification Status */}
          {isClassifying && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
              <div className="relative">
                <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-5 h-5 border-2 border-purple-300/30 rounded-full"></div>
              </div>
              <div>
                <span className="text-sm font-medium text-purple-300">AI is analyzing your description...</span>
                <div className="w-32 h-1 bg-purple-900/50 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Category Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
              <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setValues({...values, category: cat})}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
                    values.category === cat
                      ? `bg-gradient-to-br ${categoryConfig[cat].color} border-transparent shadow-lg scale-105`
                      : 'bg-slate-900/40 border-white/10 hover:border-white/20 hover:bg-slate-900/60'
                  }`}
                >
                  <span className="text-2xl">{categoryConfig[cat].icon}</span>
                  <span className={`text-xs font-medium capitalize ${values.category === cat ? 'text-white' : 'text-gray-400'}`}>
                    {cat}
                  </span>
                  {values.category === cat && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
              <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              Priority
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(priorityConfig).map(([priority, config]) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setValues({...values, priority})}
                  className={`relative flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border transition-all duration-300 ${
                    values.priority === priority
                      ? `bg-gradient-to-r ${config.color} border-transparent shadow-lg scale-105 text-white`
                      : `${config.bg} ${config.border} ${config.text} hover:scale-102`
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${values.priority === priority ? 'bg-white' : `bg-gradient-to-r ${config.color}`}`}></div>
                  <span className="text-sm font-bold uppercase tracking-wide">{priority}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Success Message */}
          {justSubmitted && (
            <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-green-500/10 border border-green-500/30 backdrop-blur-sm animate-pulse">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-green-300">Ticket Created Successfully!</p>
                <p className="text-sm text-green-400/70">Your ticket has been submitted and is being processed.</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={!isValid || isClassifying || isSubmitting}
              className={`group relative w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-white shadow-xl transition-all duration-300 overflow-hidden ${
                isValid && !isClassifying && !isSubmitting
                  ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-700 cursor-not-allowed opacity-50'
              }`}
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
              
              <span className="relative flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Create Ticket</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </div>
  );
}