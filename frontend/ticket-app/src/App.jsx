// App.jsx
import { useState } from "react";
import RoleToggle from "./components/RoleToggle";
import TicketForm from "./TicketForm";
import TicketList from "./TicketList";
import StatsCards from "./Stats";

export default function App() {
  const [role, setRole] = useState("user");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTicketCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ 
        background: "linear-gradient(to bottom right, #020617, #0f172a, #020617)" 
      }}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "rgba(139, 92, 246, 0.15)" }}
        ></div>
        <div 
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{ background: "rgba(99, 102, 241, 0.1)" }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "rgba(139, 92, 246, 0.08)" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <header>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              {/* Logo & Title */}
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ 
                    background: "linear-gradient(to bottom right, #8b5cf6, #6366f1)",
                    boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.5)"
                  }}
                >
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div>
                  <h1 
                    className="text-3xl font-bold"
                    style={{ color: "#f3f4f6" }}
                  >
                    Support Tickets
                  </h1>
                  <p style={{ color: "#6b7280", fontSize: "14px" }}>
                    AI-Powered Ticket Management
                  </p>
                </div>
              </div>

              <RoleToggle role={role} setRole={setRole} />
            </div>

            {/* Divider */}
            <div 
              className="mt-6 h-px"
              style={{ 
                background: "linear-gradient(to right, transparent, rgba(139, 92, 246, 0.3), transparent)" 
              }}
            ></div>
          </header>

          {/* Stats */}
          <StatsCards key={`stats-${refreshKey}`} />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TicketForm role={role} onTicketCreated={handleTicketCreated} />
            <TicketList role={role} key={`list-${refreshKey}`} />
          </div>

          {/* Footer */}
          <footer className="pt-8">
            <div 
              className="h-px mb-6"
              style={{ 
                background: "linear-gradient(to right, transparent, rgba(139, 92, 246, 0.2), transparent)" 
              }}
            ></div>
            <div className="flex justify-between items-center text-sm" style={{ color: "#6b7280" }}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#4ade80" }}
                ></div>
                <span>System Online</span>
              </div>
              <span style={{ color: "#a78bfa" }}>v2.0</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}