// TicketList.jsx
import { useEffect, useState } from 'react';
import api from './api';

const priorityConfig = {
  low: { 
    bg: 'bg-green-500/10', 
    border: 'border-green-500/30', 
    text: 'text-green-400',
    gradient: 'from-green-500 to-emerald-500',
    dot: 'bg-green-400'
  },
  medium: { 
    bg: 'bg-yellow-500/10', 
    border: 'border-yellow-500/30', 
    text: 'text-yellow-400',
    gradient: 'from-yellow-500 to-amber-500',
    dot: 'bg-yellow-400'
  },
  high: { 
    bg: 'bg-orange-500/10', 
    border: 'border-orange-500/30', 
    text: 'text-orange-400',
    gradient: 'from-orange-500 to-red-500',
    dot: 'bg-orange-400'
  },
  critical: { 
    bg: 'bg-red-500/10', 
    border: 'border-red-500/30', 
    text: 'text-red-400',
    gradient: 'from-red-500 to-rose-500',
    dot: 'bg-red-400 animate-pulse'
  }
};

const statusConfig = {
  open: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-400 animate-pulse' },
  'in-progress': { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', dot: 'bg-purple-400 animate-pulse' },
  resolved: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', dot: 'bg-green-400' },
  closed: { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400', dot: 'bg-gray-400' }
};

const categoryIcons = {
  general: '📋',
  billing: '💳',
  technical: '⚙️',
  account: '👤',
  feature: '✨',
  bug: '🐛'
};

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const res = await api.get('tickets/');
        setTickets(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, []);

  if (loading) {
    return (
      <div className="space-y-5">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass rounded-3xl border border-white/10 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 animate-pulse"></div>
            <div className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-6 bg-purple-500/10 rounded-lg w-3/4 mb-3 animate-pulse"></div>
                  <div className="h-4 bg-purple-500/10 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-purple-500/10 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="glass rounded-3xl border border-white/10 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500"></div>
        <div className="px-8 py-20 text-center">
          <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 p-[1px]">
            <div className="w-full h-full rounded-2xl bg-slate-900/90 flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-200 mb-2">No Tickets Yet</h3>
          <p className="text-gray-500">Create your first ticket to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {tickets.map((ticket, index) => {
        const priority = priorityConfig[ticket.priority] || priorityConfig.low;
        const status = statusConfig[ticket.status] || statusConfig.open;

        return (
          <div
            key={ticket.id}
            className="group relative glass rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:scale-[1.01] hover:border-purple-500/30"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Priority bar */}
            <div className={`h-1.5 bg-gradient-to-r ${priority.gradient}`}></div>

            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative p-7">
              <div className="flex items-start gap-5">
                {/* Category Icon */}
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-purple-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                  {categoryIcons[ticket.category] || '📌'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-violet-200 to-indigo-200 group-hover:from-white group-hover:to-purple-100 transition-all duration-300 line-clamp-1">
                      {ticket.title}
                    </h3>
                    <span className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${priority.bg} ${priority.border} ${priority.text} border`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`}></span>
                      {ticket.priority}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-5">
                    {ticket.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Category tag */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-xs font-medium text-purple-300 capitalize">{ticket.category}</span>
                    </div>

                    {/* Status tag */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${status.bg} border ${status.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                      <span className={`text-xs font-medium capitalize ${status.text}`}>
                        {ticket.status?.replace('-', ' ')}
                      </span>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/30 ml-auto">
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs text-gray-400 font-medium">
                        {new Date(ticket.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom highlight */}
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        );
      })}
    </div>
  );
}