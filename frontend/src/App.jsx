import React, { useState, useEffect } from "react";
import { getHealth, getAnalytics, getLogs, addLog } from "./services/api";

function App() {
  const [health, setHealth] = useState({ status: "checking" });
  const [analytics, setAnalytics] = useState({
    total_logs: 0,
    high_risk: 0,
    medium_risk: 0,
    low_risk: 0,
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Log Form State
  const [ip, setIp] = useState("192.168.1.200");
  const [event, setEvent] = useState("Failed SSH Login");
  const [risk, setRisk] = useState("High");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const refreshData = async () => {
    try {
      const [healthData, analyticsData, logsData] = await Promise.all([
        getHealth(),
        getAnalytics(),
        getLogs(),
      ]);
      setHealth(healthData);
      if (analyticsData) setAnalytics(analyticsData);
      if (logsData && logsData.logs) setLogs(logsData.logs);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("Sending threat event to backend...");

    try {
      await addLog({ ip, event, risk });
      setStatusMessage("✅ Log recorded! Refreshing dashboard metrics...");
      // Trigger instant refetch of counts and table
      await refreshData();
      setTimeout(() => setStatusMessage(""), 4000);
    } catch (err) {
      setStatusMessage("❌ Error sending log. Verify backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: "Segoe UI, sans-serif", padding: "20px", maxWidth: "1000px", margin: "0 auto", backgroundColor: "#0f172a", color: "#f8fafc", minHeight: "100vh" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "15px", marginBottom: "25px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", color: "#38bdf8" }}>🛡️ Security Log Analyzer</h1>
          <p style={{ margin: "5px 0 0 0", color: "#94a3b8", fontSize: "14px" }}>Real-time Threat Monitoring & Ingestion Pipeline</p>
        </div>
        <div style={{ padding: "6px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold", backgroundColor: health.status === "healthy" ? "#064e3b" : "#7f1d1d", color: health.status === "healthy" ? "#34d399" : "#f87171" }}>
          System: {health.status.toUpperCase()}
        </div>
      </div>

      {/* Analytics Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "30px" }}>
        <div style={{ backgroundColor: "#1e293b", padding: "18px", borderRadius: "8px", borderLeft: "4px solid #38bdf8" }}>
          <span style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }}>Total Logs</span>
          <h2 style={{ margin: "10px 0 0 0", fontSize: "28px" }}>{analytics.total_logs}</h2>
        </div>
        <div style={{ backgroundColor: "#1e293b", padding: "18px", borderRadius: "8px", borderLeft: "4px solid #f87171" }}>
          <span style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }}>High Risk</span>
          <h2 style={{ margin: "10px 0 0 0", fontSize: "28px", color: "#f87171" }}>{analytics.high_risk}</h2>
        </div>
        <div style={{ backgroundColor: "#1e293b", padding: "18px", borderRadius: "8px", borderLeft: "4px solid #fbbf24" }}>
          <span style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }}>Medium Risk</span>
          <h2 style={{ margin: "10px 0 0 0", fontSize: "28px", color: "#fbbf24" }}>{analytics.medium_risk}</h2>
        </div>
        <div style={{ backgroundColor: "#1e293b", padding: "18px", borderRadius: "8px", borderLeft: "4px solid #34d399" }}>
          <span style={{ color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" }}>Low Risk</span>
          <h2 style={{ margin: "10px 0 0 0", fontSize: "28px", color: "#34d399" }}>{analytics.low_risk}</h2>
        </div>
      </div>

      {/* Interactive Ingestion Form */}
      <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
        <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", color: "#f1f5f9" }}>⚡ Test Ingestion Client (POST /logs)</h3>
        
        <form onSubmit={handleSubmitLog} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr auto", gap: "12px", alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "5px" }}>IP Address</label>
            <input 
              type="text" 
              value={ip} 
              onChange={(e) => setIp(e.target.value)} 
              required 
              style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#fff", boxSizing: "border-box" }} 
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "5px" }}>Event Description</label>
            <input 
              type="text" 
              value={event} 
              onChange={(e) => setEvent(e.target.value)} 
              required 
              style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#fff", boxSizing: "border-box" }} 
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "5px" }}>Risk Severity</label>
            <select 
              value={risk} 
              onChange={(e) => setRisk(e.target.value)} 
              style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#fff", boxSizing: "border-box" }}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            style={{ backgroundColor: "#0284c7", color: "#fff", border: "none", padding: "9px 18px", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}
          >
            {isSubmitting ? "Sending..." : "Send Threat Log"}
          </button>
        </form>

        {statusMessage && (
          <p style={{ margin: "12px 0 0 0", fontSize: "14px", color: statusMessage.includes("❌") ? "#f87171" : "#34d399" }}>
            {statusMessage}
          </p>
        )}
      </div>

      {/* Logs Table */}
      <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3 style={{ margin: 0, fontSize: "18px" }}>📜 Active Security Logs</h3>
          <button onClick={refreshData} style={{ backgroundColor: "#334155", color: "#e2e8f0", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>
            🔄 Refresh Feed
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#94a3b8" }}>Loading security feed...</p>
        ) : logs.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No logs found in database.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8" }}>
                <th style={{ padding: "10px" }}>ID</th>
                <th style={{ padding: "10px" }}>Timestamp</th>
                <th style={{ padding: "10px" }}>Source IP</th>
                <th style={{ padding: "10px" }}>Security Event</th>
                <th style={{ padding: "10px" }}>Risk</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: "1px solid #334155" }}>
                  <td style={{ padding: "10px", color: "#64748b" }}>#{log.id}</td>
                  <td style={{ padding: "10px" }}>{log.timestamp}</td>
                  <td style={{ padding: "10px", fontFamily: "monospace", color: "#38bdf8" }}>{log.ip}</td>
                  <td style={{ padding: "10px" }}>{log.event}</td>
                  <td style={{ padding: "10px" }}>
                    <span style={{ 
                      padding: "3px 8px", 
                      borderRadius: "12px", 
                      fontSize: "12px", 
                      fontWeight: "bold",
                      backgroundColor: log.risk === "High" ? "#7f1d1d" : log.risk === "Medium" ? "#78350f" : "#064e3b",
                      color: log.risk === "High" ? "#f87171" : log.risk === "Medium" ? "#fbbf24" : "#34d399"
                    }}>
                      {log.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

export default App;