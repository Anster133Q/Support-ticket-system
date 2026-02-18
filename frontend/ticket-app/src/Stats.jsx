// StatsCards.jsx
import { useEffect, useState, useRef } from 'react';
import api from './api';

export default function StatsCards() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({ total: 0, open: 0, avg: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('tickets/stats/');
        setData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (data && isVisible) {
      const duration = 1500;
      const steps = 60;
      const stepTime = duration / steps;

      const targets = {
        total: data.total_tickets || 0,
        open: data.open_tickets || 0,
        avg: data.avg_tickets_per_day || 0
      };

      let step = 0;
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setAnimatedValues({
          total: Math.round(targets.total * easeOut),
          open: Math.round(targets.open * easeOut),
          avg: targets.avg * easeOut
        });

        if (step >= steps) clearInterval(interval);
      }, stepTime);

      return () => clearInterval(interval);
    }
  }, [data, isVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass rounded-3xl border border-white/10 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 animate-pulse"></div>
            <div className="px-8 py-10 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 animate-pulse mb-5"></div>
              <div className="h-4 bg-purple-500/10 rounded-full w-24 mx-auto mb-4 animate-pulse"></div>
              <div className="h-12 bg-purple-500/10 rounded-xl w-20 mx-auto animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const items = [
    {
      label: 'Total Tickets',
      value: animatedValues.total,
      suffix: '',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: 'from-violet-500 via-purple-500 to-indigo-500',
      bgGlow: 'rgba(139, 92, 246, 0.15)',
      sparklineData: [40, 65, 45, 80, 55, 90, 70]
    },
    {
      label: 'Open Tickets',
      value: animatedValues.open,
      suffix: '',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
      bgGlow: 'rgba(59, 130, 246, 0.15)',
      sparklineData: [30, 50, 70, 40, 60, 45, 80]
    },
    {
      label: 'Daily Average',
      value: animatedValues.avg.toFixed(1),
      suffix: '/day',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      gradient: 'from-pink-500 via-rose-500 to-orange-500',
      bgGlow: 'rgba(236, 72, 153, 0.15)',
      sparklineData: [55, 40, 65, 50, 75, 60, 85]
    }
  ];

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <div
          key={item.label}
          className="group relative glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02]"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          {/* Top gradient bar */}
          <div className={`h-1.5 bg-gradient-to-r ${item.gradient}`}></div>

          {/* Background glow */}
          <div 
            className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
            style={{ background: item.bgGlow }}
          ></div>

          <div className="relative px-8 py-8">
            {/* Icon */}
            <div className={`relative w-14 h-14 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.gradient} p-[1px] shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
              <div className="w-full h-full rounded-2xl bg-slate-900/90 backdrop-blur-sm flex items-center justify-center text-white">
                {item.icon}
              </div>
            </div>

            {/* Label */}
            <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 text-center">
              {item.label}
            </div>

            {/* Value */}
            <div className="text-center mb-6">
              <span className={`text-5xl font-black bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent tracking-tight`}>
                {item.value}
              </span>
              {item.suffix && (
                <span className="text-lg font-medium text-gray-500 ml-1">{item.suffix}</span>
              )}
            </div>

            {/* Sparkline */}
            <div className="flex items-end justify-center gap-1.5 h-10">
              {item.sparklineData.map((height, i) => (
                <div
                  key={i}
                  className={`w-2 rounded-full bg-gradient-to-t ${item.gradient} opacity-40 group-hover:opacity-70 transition-all duration-300`}
                  style={{
                    height: `${height}%`,
                    transitionDelay: `${i * 50}ms`
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Bottom highlight */}
          <div className={`h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent`}></div>
        </div>
      ))}
    </div>
  );
}