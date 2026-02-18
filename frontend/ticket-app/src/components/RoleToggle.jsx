// components/RoleToggle.jsx
export default function RoleToggle({ role, setRole }) {
  return (
    <div className="relative">
      <div 
        className="flex items-center gap-1 p-1.5 rounded-xl"
        style={{ 
          background: "rgba(30, 41, 59, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <button
          onClick={() => setRole("user")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
          style={{
            background: role === "user" 
              ? "linear-gradient(to right, #8b5cf6, #6366f1)" 
              : "transparent",
            color: role === "user" ? "#ffffff" : "#9ca3af",
            boxShadow: role === "user" ? "0 4px 15px -3px rgba(139, 92, 246, 0.4)" : "none"
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          User
        </button>

        <button
          onClick={() => setRole("admin")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
          style={{
            background: role === "admin" 
              ? "linear-gradient(to right, #06b6d4, #3b82f6)" 
              : "transparent",
            color: role === "admin" ? "#ffffff" : "#9ca3af",
            boxShadow: role === "admin" ? "0 4px 15px -3px rgba(6, 182, 212, 0.4)" : "none"
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Admin
        </button>
      </div>

      {/* Role indicator */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap">
        <div 
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: role === "admin" ? "#22d3ee" : "#a78bfa" }}
        ></div>
        <span style={{ fontSize: "12px", color: "#6b7280" }}>
          Viewing as{" "}
          <span style={{ 
            fontWeight: 600, 
            color: role === "admin" ? "#22d3ee" : "#a78bfa" 
          }}>
            {role}
          </span>
        </span>
      </div>
    </div>
  );
}