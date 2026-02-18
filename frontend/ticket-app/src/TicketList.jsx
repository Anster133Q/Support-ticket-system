// TicketList.jsx
import { useEffect, useState } from "react";
import api from "./api";

const priorityConfig = {
  low: { color: "#22c55e", label: "Low" },
  medium: { color: "#eab308", label: "Medium" },
  high: { color: "#f97316", label: "High" },
  critical: { color: "#ef4444", label: "Critical" }
};

const statusConfig = {
  open: { color: "#22c55e", label: "Open" },
  in_progress: { color: "#3b82f6", label: "In Progress" },
  closed: { color: "#6b7280", label: "Closed" }
};

const categoryIcons = {
  billing: "💳",
  technical: "⚙️",
  account: "👤",
  general: "📋",
  feature: "✨",
  bug: "🐛"
};

export default function TicketList({ role }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const cardStyle = {
    background: "linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95))",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "24px",
    overflow: "hidden"
  };

  const loadTickets = async () => {
    try {
      const res = await api.get("tickets/");
      setTickets(res.data);
    } catch (err) {
      console.log(err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.patch(`tickets/${id}/`, { status });
      await loadTickets();
    } catch (err) {
      console.log(err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-10 h-10 rounded-xl"
            style={{ background: "rgba(139, 92, 246, 0.1)" }}
          ></div>
          <div 
            className="h-6 w-24 rounded-lg"
            style={{ background: "rgba(139, 92, 246, 0.1)" }}
          ></div>
        </div>
        
        {[1, 2, 3].map(i => (
          <div key={i} style={cardStyle}>
            <div 
              className="h-1.5 animate-pulse"
              style={{ background: "linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))" }}
            ></div>
            <div className="p-7">
              <div className="flex items-start gap-5">
                <div 
                  className="w-14 h-14 rounded-2xl animate-pulse"
                  style={{ background: "rgba(139, 92, 246, 0.1)" }}
                ></div>
                <div className="flex-1 space-y-3">
                  <div 
                    className="h-6 rounded-lg w-3/4 animate-pulse"
                    style={{ background: "rgba(139, 92, 246, 0.1)" }}
                  ></div>
                  <div 
                    className="h-4 rounded w-full animate-pulse"
                    style={{ background: "rgba(139, 92, 246, 0.1)" }}
                  ></div>
                  <div 
                    className="h-4 rounded w-2/3 animate-pulse"
                    style={{ background: "rgba(139, 92, 246, 0.1)" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ 
              background: "linear-gradient(to bottom right, #8b5cf6, #6366f1)",
              boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.4)"
            }}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 style={{ color: "#f3f4f6", fontSize: "20px", fontWeight: 700 }}>Tickets</h2>
            <p style={{ color: "#6b7280", fontSize: "12px" }}>{tickets.length} total</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {tickets.length === 0 && (
        <div style={cardStyle}>
          <div 
            className="h-1.5"
            style={{ background: "linear-gradient(to right, #8b5cf6, #6366f1)" }}
          ></div>
          <div className="px-8 py-16 text-center">
            <div 
              className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{ 
                background: "linear-gradient(to bottom right, #8b5cf6, #6366f1)",
                boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.5)"
              }}
            >
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 style={{ color: "#f3f4f6", fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
              No Tickets Yet
            </h3>
            <p style={{ color: "#6b7280" }}>
              Create your first ticket to get started
            </p>
          </div>
        </div>
      )}

      {/* Tickets */}
      <div className="space-y-5">
        {tickets.map((ticket, index) => {
          const priority = priorityConfig[ticket.priority] || priorityConfig.low;
          const status = statusConfig[ticket.status] || statusConfig.open;
          const isUpdating = updating === ticket.id;

          return (
            <div
              key={ticket.id}
              className="transition-all duration-300 hover:scale-[1.01]"
              style={{
                ...cardStyle,
                opacity: isUpdating ? 0.7 : 1
              }}
            >
              {/* Priority bar */}
              <div 
                className="h-1.5"
                style={{ background: priority.color }}
              ></div>

              <div className="p-7">
                <div className="flex items-start gap-5">
                  {/* Category Icon */}
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ 
                      background: "rgba(139, 92, 246, 0.1)",
                      border: "1px solid rgba(139, 92, 246, 0.2)"
                    }}
                  >
                    {categoryIcons[ticket.category] || "📋"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 
                        className="text-lg font-bold truncate"
                        style={{ color: "#f3f4f6" }}
                      >
                        {ticket.title}
                      </h3>
                      
                      {/* Priority Badge */}
                      <span 
                        className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase flex-shrink-0"
                        style={{
                          background: `${priority.color}20`,
                          border: `1px solid ${priority.color}50`,
                          color: priority.color
                        }}
                      >
                        <span 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: priority.color }}
                        ></span>
                        {priority.label}
                      </span>
                    </div>

                    {/* Description */}
                    <p 
                      className="text-sm mb-4 line-clamp-2"
                      style={{ color: "#9ca3af" }}
                    >
                      {ticket.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      {/* Category */}
                      <div 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{
                          background: "rgba(99, 102, 241, 0.1)",
                          border: "1px solid rgba(99, 102, 241, 0.2)",
                          color: "#818cf8"
                        }}
                      >
                        {ticket.category}
                      </div>

                      {/* Status */}
                      <div 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{
                          background: `${status.color}15`,
                          border: `1px solid ${status.color}30`,
                          color: status.color
                        }}
                      >
                        <span 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: status.color }}
                        ></span>
                        {status.label}
                      </div>

                      {/* Time */}
                      <div 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ml-auto"
                        style={{
                          background: "rgba(55, 65, 81, 0.5)",
                          border: "1px solid rgba(55, 65, 81, 0.5)",
                          color: "#9ca3af"
                        }}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(ticket.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </div>

                    {/* Admin Actions */}
                    {role === "admin" && (
                      <div 
                        className="pt-4 flex flex-wrap items-center gap-2"
                        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}
                      >
                        <span 
                          className="text-xs font-medium uppercase tracking-wider mr-2"
                          style={{ color: "#6b7280" }}
                        >
                          Status:
                        </span>

                        {["open", "in_progress", "closed"].map(s => {
                          const sConfig = statusConfig[s];
                          const isActive = ticket.status === s;
                          
                          return (
                            <button
                              key={s}
                              onClick={() => updateStatus(ticket.id, s)}
                              disabled={isUpdating || isActive}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300"
                              style={{
                                background: isActive ? `${sConfig.color}30` : "rgba(55, 65, 81, 0.3)",
                                border: `1px solid ${isActive ? sConfig.color : "rgba(255, 255, 255, 0.1)"}`,
                                color: isActive ? sConfig.color : "#9ca3af",
                                cursor: isActive ? "default" : "pointer",
                                opacity: isUpdating ? 0.5 : 1
                              }}
                            >
                              <span 
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: isActive ? sConfig.color : "#6b7280" }}
                              ></span>
                              {sConfig.label}
                            </button>
                          );
                        })}

                        {isUpdating && (
                          <div className="flex items-center gap-2 ml-2">
                            <div 
                              className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                              style={{ borderColor: "#a78bfa", borderTopColor: "transparent" }}
                            ></div>
                            <span style={{ color: "#a78bfa", fontSize: "12px" }}>Updating...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}