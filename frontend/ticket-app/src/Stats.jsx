// StatsCards.jsx
import { useEffect, useState, useRef } from "react";
import api from "./api";

export default function StatsCards() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({ total: 0, open: 0, avg: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("tickets/stats/");
        setData(res.data);
      } catch (err) {
        console.log(err);
        // Set default data on error
        setData({ total_tickets: 0, open_tickets: 0, avg_tickets_per_day: 0 });
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
    setIsVisible(true);
  }, []);

  const cardStyle = {
    background: "linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95))",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "24px",
    overflow: "hidden"
  };

  if (loading) {
    return (
      <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} style={cardStyle}>
            <div 
              className="h-1 animate-pulse"
              style={{ background: "linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))" }}
            ></div>
            <div className="px-8 py-10 text-center">
              <div 
                className="w-14 h-14 mx-auto rounded-2xl mb-5 animate-pulse"
                style={{ background: "rgba(139, 92, 246, 0.1)" }}
              ></div>
              <div 
                className="h-4 rounded-full w-24 mx-auto mb-4 animate-pulse"
                style={{ background: "rgba(139, 92, 246, 0.1)" }}
              ></div>
              <div 
                className="h-12 rounded-xl w-20 mx-auto animate-pulse"
                style={{ background: "rgba(139, 92, 246, 0.1)" }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Total Tickets",
      value: animatedValues.total,
      suffix: "",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: "linear-gradient(to right, #8b5cf6, #6366f1)",
      sparklineData: [40, 65, 45, 80, 55, 90, 70]
    },
    {
      label: "Open Tickets",
      value: animatedValues.open,
      suffix: "",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      gradient: "linear-gradient(to right, #06b6d4, #3b82f6)",
      sparklineData: [30, 50, 70, 40, 60, 45, 80]
    },
    {
      label: "Daily Average",
      value: animatedValues.avg.toFixed(1),
      suffix: "/day",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      gradient: "linear-gradient(to right, #ec4899, #f97316)",
      sparklineData: [55, 40, 65, 50, 75, 60, 85]
    }
  ];

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <div
          key={item.label}
          className="group relative transition-all duration-500 hover:scale-[1.02]"
          style={{
            ...cardStyle,
            animationDelay: `${index * 150}ms`
          }}
        >
          {/* Top gradient bar */}
          <div className="h-1.5" style={{ background: item.gradient }}></div>

          <div className="relative px-8 py-8">
            {/* Icon */}
            <div 
              className="relative w-14 h-14 mx-auto mb-6 rounded-2xl p-[2px] transition-transform duration-300 group-hover:scale-110"
              style={{ 
                background: item.gradient,
                boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.3)"
              }}
            >
              <div 
                className="w-full h-full rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(15, 23, 42, 0.95)", color: "#ffffff" }}
              >
                {item.icon}
              </div>
            </div>

            {/* Label */}
            <div 
              className="text-sm font-semibold uppercase tracking-widest mb-4 text-center"
              style={{ color: "#9ca3af" }}
            >
              {item.label}
            </div>

            {/* Value */}
            <div className="text-center mb-6">
              <span 
                className="text-5xl font-black"
                style={{ 
                  background: item.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                {item.value}
              </span>
              {item.suffix && (
                <span style={{ color: "#6b7280", fontSize: "18px", marginLeft: "4px" }}>
                  {item.suffix}
                </span>
              )}
            </div>

            {/* Sparkline */}
            <div className="flex items-end justify-center gap-1.5 h-10">
              {item.sparklineData.map((height, i) => (
                <div
                  key={i}
                  className="w-2 rounded-full transition-all duration-300 group-hover:opacity-70"
                  style={{
                    height: `${height}%`,
                    background: item.gradient,
                    opacity: 0.4,
                    transitionDelay: `${i * 50}ms`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}