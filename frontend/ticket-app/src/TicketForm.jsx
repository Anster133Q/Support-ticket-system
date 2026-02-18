// TicketForm.jsx
import { useState } from "react";
import api from "./api";

const categoryConfig = {
  billing: { icon: "💳", label: "Billing" },
  technical: { icon: "⚙️", label: "Technical" },
  account: { icon: "👤", label: "Account" },
  general: { icon: "📋", label: "General" },
  feature: { icon: "✨", label: "Feature" },
  bug: { icon: "🐛", label: "Bug" }
};

const priorityConfig = {
  low: { label: "Low", color: "#22c55e" },
  medium: { label: "Medium", color: "#eab308" },
  high: { label: "High", color: "#f97316" },
  critical: { label: "Critical", color: "#ef4444" }
};

export default function TicketForm({ role, onTicketCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const cardStyle = {
    background: "linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95))",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "24px",
    overflow: "hidden"
  };

  const inputStyle = {
    width: "100%",
    padding: "16px 20px",
    borderRadius: "12px",
    background: "rgba(30, 41, 59, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#f3f4f6",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s"
  };

  const autoClassify = async () => {
    if (!description.trim()) return;
    setLoadingAI(true);
    try {
      const res = await api.post("tickets/classify/", { description });
      setCategory(res.data.suggested_category || "general");
      setPriority(res.data.suggested_priority || "low");
    } catch (err) {
      console.log("AI classify failed", err);
    }
    setLoadingAI(false);
  };

  const submit = async () => {
    if (!title || !description) return;
    setSubmitting(true);
    try {
      await api.post("tickets/", {
        title,
        description,
        category: category || "general",
        priority: priority || "low"
      });
      setTitle("");
      setDescription("");
      setCategory("");
      setPriority("");
      setSuccess(true);
      if (onTicketCreated) onTicketCreated();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.log("Submit failed", err);
    }
    setSubmitting(false);
  };

  const isValid = title.trim() && description.trim();

  return (
    <div style={cardStyle}>
      {/* Top bar */}
      <div 
        className="h-1.5"
        style={{ background: "linear-gradient(to right, #8b5cf6, #6366f1)" }}
      ></div>

      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ 
              background: "linear-gradient(to bottom right, #8b5cf6, #6366f1)",
              boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.5)"
            }}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 style={{ color: "#f3f4f6", fontSize: "24px", fontWeight: 700 }}>
              Create Ticket
            </h2>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              AI-powered classification
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label 
              className="block mb-2 text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#9ca3af" }}
            >
              Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Brief summary of your issue..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label 
              className="block mb-2 text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#9ca3af" }}
            >
              Description <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              placeholder="Describe your issue in detail..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>

          {/* AI Button */}
          <button
            onClick={autoClassify}
            disabled={loadingAI || !description.trim()}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300"
            style={{
              background: description.trim() && !loadingAI 
                ? "linear-gradient(to right, #8b5cf6, #6366f1)" 
                : "rgba(55, 65, 81, 0.5)",
              color: "#ffffff",
              opacity: description.trim() && !loadingAI ? 1 : 0.5,
              cursor: description.trim() && !loadingAI ? "pointer" : "not-allowed"
            }}
          >
            {loadingAI ? (
              <>
                <div 
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></div>
                <span>AI Analyzing...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Auto Classify with AI</span>
              </>
            )}
          </button>

          {/* Category */}
          <div>
            <label 
              className="block mb-3 text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#9ca3af" }}
            >
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(categoryConfig).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-300"
                  style={{
                    background: category === key 
                      ? "linear-gradient(to bottom right, #8b5cf6, #6366f1)" 
                      : "rgba(30, 41, 59, 0.5)",
                    border: category === key 
                      ? "1px solid transparent" 
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    transform: category === key ? "scale(1.05)" : "scale(1)",
                    boxShadow: category === key ? "0 10px 30px -10px rgba(139, 92, 246, 0.4)" : "none"
                  }}
                >
                  <span className="text-xl">{config.icon}</span>
                  <span 
                    className="text-xs font-semibold"
                    style={{ color: category === key ? "#ffffff" : "#9ca3af" }}
                  >
                    {config.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label 
              className="block mb-3 text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#9ca3af" }}
            >
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(priorityConfig).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPriority(key)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300"
                  style={{
                    background: priority === key 
                      ? config.color 
                      : `${config.color}20`,
                    border: `1px solid ${config.color}50`,
                    transform: priority === key ? "scale(1.05)" : "scale(1)"
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ 
                      background: priority === key ? "#ffffff" : config.color,
                      animation: key === "critical" ? "pulse 2s infinite" : "none"
                    }}
                  ></div>
                  <span 
                    className="text-xs font-bold uppercase"
                    style={{ color: priority === key ? "#ffffff" : config.color }}
                  >
                    {config.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div 
              className="flex items-center gap-4 px-5 py-4 rounded-xl animate-pulse"
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)"
              }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(34, 197, 94, 0.2)" }}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#4ade80">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p style={{ color: "#4ade80", fontWeight: 700 }}>Ticket Created!</p>
                <p style={{ color: "rgba(74, 222, 128, 0.7)", fontSize: "14px" }}>
                  Your ticket has been submitted.
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={submit}
            disabled={!isValid || submitting}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
            style={{
              background: isValid && !submitting 
                ? "linear-gradient(to right, #8b5cf6, #6366f1)" 
                : "rgba(55, 65, 81, 0.5)",
              color: "#ffffff",
              opacity: isValid && !submitting ? 1 : 0.5,
              cursor: isValid && !submitting ? "pointer" : "not-allowed",
              boxShadow: isValid && !submitting ? "0 10px 30px -10px rgba(139, 92, 246, 0.5)" : "none"
            }}
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Submit Ticket</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}