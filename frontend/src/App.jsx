import React, { useState, useEffect } from "react";
import {
  getHealth,
  getAnalytics,
  getLogs,
  getIncidents,
  getReports,
  addLog,
  API_BASE_URL,
} from "./services/api";

function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [health, setHealth] = useState({ status: "checking" });
  const [analytics, setAnalytics] = useState({
    total_logs: 0,
    high_risk: 0,
    medium_risk: 0,
    low_risk: 0,
  });
  const [logs, setLogs] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);

  // Ingestion / Risk Assessment Form State
  const [inputIp, setInputIp] = useState("192.168.1.200");
  const [inputEvent, setInputEvent] = useState("Failed SSH Login");
  const [inputRisk, setInputRisk] = useState("High");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // IP Analysis Search State
  const [searchIp, setSearchIp] = useState("");
  const [ipAnalysisResult, setIpAnalysisResult] = useState(null);

  // Fetch all backend data
  const refreshData = async () => {
    setLoading(true);
    try {
      const [healthData, analyticsData, logsData, incidentsData, reportsData] =
        await Promise.all([
          getHealth(),
          getAnalytics(),
          getLogs(),
          getIncidents(),
          getReports(),
        ]);

      setHealth(healthData || { status: "offline" });
      if (analyticsData) setAnalytics(analyticsData);
      if (logsData && logsData.logs) setLogs(logsData.logs);
      if (incidentsData && incidentsData.incidents) setIncidents(incidentsData.incidents);
      if (reportsData) setReports(reportsData);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
      setHealth({ status: "offline" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Automatically calculate risk for any given IP based on log history or rules
  const analyzeIpRisk = (ipToAnalyze) => {
    if (!ipToAnalyze) return null;
    const matchedLogs = logs.filter((l) => l.ip === ipToAnalyze);
    
    let calculatedRisk = "Low";
    if (matchedLogs.some((l) => l.risk === "High")) {
      calculatedRisk = "High";
    } else if (matchedLogs.some((l) => l.risk === "Medium") || matchedLogs.length > 2) {
      calculatedRisk = "Medium";
    }

    return {
      ip: ipToAnalyze,
      totalEvents: matchedLogs.length,
      riskLevel: calculatedRisk,
      history: matchedLogs,
    };
  };

  const handleIpSearch = (e) => {
    e.preventDefault();
    const result = analyzeIpRisk(searchIp.trim());
    setIpAnalysisResult(result);
  };

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("Sending threat data to backend...");

    try {
      await addLog({ ip: inputIp, event: inputEvent, risk: inputRisk });
      setStatusMessage("✅ Security log recorded! Metrics updated.");
      await refreshData();
      setTimeout(() => setStatusMessage(""), 4000);
    } catch (err) {
      setStatusMessage("❌ Failed to send log. Check backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isHealthy = health.status === "healthy";

  return (
    <div style={{ fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#f0f4f8", minHeight: "100vh", color: "#1e293b" }}>
      
      {/* --- Top Header Navigation Bar --- */}
      <div style={{ backgroundColor: "#3b82f6", color: "#ffffff", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>🛡️</span>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
            Security <span style={{ color: "#dbeafe" }}>Log Analyzer</span>
          </h1>
        </div>

        <div style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", backgroundColor: isHealthy ? "#dcfce7" : "#fee2e2", color: isHealthy ? "#166534" : "#991b1b", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ height: "8px", width: "8px", borderRadius: "50%", backgroundColor: isHealthy ? "#22c55e" : "#ef4444", display: "inline-block" }}></span>
          API Status: {isHealthy ? "Online" : "Offline"}
        </div>
      </div>

      {/* --- Tabs Header --- */}
      <div style={{ backgroundColor: "#60a5fa", display: "flex", overflowX: "auto", borderBottom: "2px solid #2563eb", paddingLeft: "15px" }}>
        {[
          { id: "Dashboard", label: "📊 Dashboard" },
          { id: "Security Logs", label: "📜 Security Logs" },
          { id: "Incidents", label: "🚨 Incidents" },
          { id: "IP Analysis", label: "🌐 IP Risk Analysis" },
          { id: "Analytics", label: "📈 Analytics" },
          { id: "Reports", label: "📋 Reports" },
          { id: "Settings", label: "⚙️ Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "12px 20px",
              border: "none",
              backgroundColor: activeTab === tab.id ? "#ffffff" : "transparent",
              color: activeTab === tab.id ? "#1d4ed8" : "#ffffff",
              fontWeight: activeTab === tab.id ? "bold" : "600",
              cursor: "pointer",
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
              marginRight: "4px",
              fontSize: "14px",
              transition: "all 0.2s ease"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- Main Content Area --- */}
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* ================= TAB 1: DASHBOARD ================= */}
        {activeTab === "Dashboard" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "22px", color: "#0f172a" }}>📊 Security Dashboard</h2>
              <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>Real-time overview from the FastAPI security backend</p>
            </div>

            {/* Metrics Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: "4px solid #3b82f6" }}>
                <span style={{ color: "#64748b", fontSize: "13px", fontWeight: "bold" }}>Total Logs</span>
                <h3 style={{ margin: "10px 0 0 0", fontSize: "32px", color: "#1e293b" }}>{analytics.total_logs}</h3>
              </div>
              <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: "4px solid #ef4444" }}>
                <span style={{ color: "#64748b", fontSize: "13px", fontWeight: "bold" }}>High Risk</span>
                <h3 style={{ margin: "10px 0 0 0", fontSize: "32px", color: "#dc2626" }}>{analytics.high_risk}</h3>
              </div>
              <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: "4px solid #f59e0b" }}>
                <span style={{ color: "#64748b", fontSize: "13px", fontWeight: "bold" }}>Medium Risk</span>
                <h3 style={{ margin: "10px 0 0 0", fontSize: "32px", color: "#d97706" }}>{analytics.medium_risk}</h3>
              </div>
              <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderLeft: "4px solid #22c55e" }}>
                <span style={{ color: "#64748b", fontSize: "13px", fontWeight: "bold" }}>Low Risk</span>
                <h3 style={{ margin: "10px 0 0 0", fontSize: "32px", color: "#16a34a" }}>{analytics.low_risk}</h3>
              </div>
            </div>

            {/* Test Ingestion Section */}
            <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: "24px" }}>
              <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "#1e293b" }}>⚡ Test Ingestion Client (POST /logs)</h3>
              <form onSubmit={handleSubmitLog} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr auto", gap: "12px", alignItems: "end" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>IP Address</label>
                  <input type="text" value={inputIp} onChange={(e) => setInputIp(e.target.value)} required style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Event Description</label>
                  <input type="text" value={inputEvent} onChange={(e) => setInputEvent(e.target.value)} required style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}>Risk Severity</label>
                  <select value={inputRisk} onChange={(e) => setInputRisk(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box", backgroundColor: "#fff" }}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <button type="submit" disabled={isSubmitting} style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                  {isSubmitting ? "Sending..." : "Send Threat Log"}
                </button>
              </form>
              {statusMessage && <p style={{ margin: "10px 0 0 0", fontSize: "13px", fontWeight: "bold", color: statusMessage.includes("❌") ? "#dc2626" : "#16a34a" }}>{statusMessage}</p>}
            </div>

            {/* Recent Security Events */}
            <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <h3 style={{ margin: "0 0 15px 0", fontSize: "16px" }}>Recent Security Events</h3>
              {logs.length === 0 ? (
                <p style={{ color: "#94a3b8", margin: 0 }}>No logs available.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {logs.slice(0, 5).map((log) => (
                    <li key={log.id} style={{ padding: "10px 0", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong style={{ color: "#2563eb", fontFamily: "monospace" }}>{log.ip}</strong> - {log.event}
                        <span style={{ fontSize: "12px", color: "#94a3b8", marginLeft: "10px" }}>{log.timestamp}</span>
                      </div>
                      <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", backgroundColor: log.risk === "High" ? "#fee2e2" : log.risk === "Medium" ? "#fef3c7" : "#dcfce7", color: log.risk === "High" ? "#dc2626" : log.risk === "Medium" ? "#d97706" : "#16a34a" }}>
                        {log.risk}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: SECURITY LOGS ================= */}
        {activeTab === "Security Logs" && (
          <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>📜 Security Logs</h2>
            <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: "14px" }}>Logs received from the FastAPI backend</p>

            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
                  <th style={{ padding: "10px" }}>ID</th>
                  <th style={{ padding: "10px" }}>Timestamp</th>
                  <th style={{ padding: "10px" }}>Source IP</th>
                  <th style={{ padding: "10px" }}>Security Event</th>
                  <th style={{ padding: "10px" }}>Risk</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px", color: "#94a3b8" }}>#{log.id}</td>
                    <td style={{ padding: "10px" }}>{log.timestamp}</td>
                    <td style={{ padding: "10px", fontFamily: "monospace", color: "#2563eb", fontWeight: "bold" }}>{log.ip}</td>
                    <td style={{ padding: "10px" }}>{log.event}</td>
                    <td style={{ padding: "10px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", backgroundColor: log.risk === "High" ? "#fee2e2" : log.risk === "Medium" ? "#fef3c7" : "#dcfce7", color: log.risk === "High" ? "#dc2626" : log.risk === "Medium" ? "#d97706" : "#16a34a" }}>
                        {log.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= TAB 3: INCIDENTS ================= */}
        {activeTab === "Incidents" && (
          <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>🚨 Security Incidents</h2>
            <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: "14px" }}>Detected critical security incidents requiring immediate action</p>

            {logs.filter((l) => l.risk === "High").length === 0 ? (
              <p style={{ color: "#94a3b8" }}>No active high-risk incidents detected.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {logs.filter((l) => l.risk === "High").map((inc) => (
                  <div key={inc.id} style={{ padding: "14px 18px", backgroundColor: "#fef2f2", borderRadius: "8px", borderLeft: "4px solid #ef4444", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ margin: "0 0 4px 0", color: "#991b1b", fontSize: "15px" }}>{inc.event}</h4>
                      <p style={{ margin: 0, fontSize: "13px", color: "#7f1d1d" }}>Origin IP: <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>{inc.ip}</span> | Time: {inc.timestamp}</p>
                    </div>
                    <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", backgroundColor: "#dc2626", color: "#ffffff" }}>
                      HIGH THREAT
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: IP RISK ANALYSIS ================= */}
        {activeTab === "IP Analysis" && (
          <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>🌐 IP Address Risk Lookup</h2>
            <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: "14px" }}>Search any client IP to automatically evaluate threat risk level</p>

            <form onSubmit={handleIpSearch} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Enter IP address (e.g. 192.168.1.105 or 10.0.0.15)..."
                value={searchIp}
                onChange={(e) => setSearchIp(e.target.value)}
                style={{ flex: 1, padding: "10px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px" }}
              />
              <button type="submit" style={{ backgroundColor: "#2563eb", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                Analyze IP
              </button>
            </form>

            {ipAnalysisResult && (
              <div style={{ backgroundColor: "#f8fafc", padding: "18px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Analysis Results for: <span style={{ color: "#2563eb", fontFamily: "monospace" }}>{ipAnalysisResult.ip}</span></h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "12px" }}>Calculated Risk Level:</span>
                    <h4 style={{ margin: "4px 0 0 0", color: ipAnalysisResult.riskLevel === "High" ? "#dc2626" : ipAnalysisResult.riskLevel === "Medium" ? "#d97706" : "#16a34a", fontSize: "20px" }}>
                      {ipAnalysisResult.riskLevel} Risk
                    </h4>
                  </div>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "12px" }}>Total Recorded Events:</span>
                    <h4 style={{ margin: "4px 0 0 0", fontSize: "20px" }}>{ipAnalysisResult.totalEvents}</h4>
                  </div>
                </div>

                <h4 style={{ margin: "15px 0 8px 0", fontSize: "14px" }}>Log History for this IP:</h4>
                {ipAnalysisResult.history.length === 0 ? (
                  <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>No prior malicious activity recorded for this IP address.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px" }}>
                    {ipAnalysisResult.history.map((h) => (
                      <li key={h.id} style={{ marginBottom: "4px" }}>
                        <strong>{h.event}</strong> ({h.risk} Risk) at {h.timestamp}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: ANALYTICS ================= */}
        {activeTab === "Analytics" && (
          <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>📈 Security Analytics</h2>
            <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "14px" }}>Risk distribution and security event breakdown</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "14px" }}>
                  <span style={{ fontWeight: "bold", color: "#dc2626" }}>High Risk Events</span>
                  <span>{analytics.high_risk}</span>
                </div>
                <div style={{ width: "100%", height: "12px", backgroundColor: "#fee2e2", borderRadius: "6px", overflow: "hidden" }}>
                  <div style={{ height: "100%", backgroundColor: "#ef4444", width: `${analytics.total_logs ? (analytics.high_risk / analytics.total_logs) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "14px" }}>
                  <span style={{ fontWeight: "bold", color: "#d97706" }}>Medium Risk Events</span>
                  <span>{analytics.medium_risk}</span>
                </div>
                <div style={{ width: "100%", height: "12px", backgroundColor: "#fef3c7", borderRadius: "6px", overflow: "hidden" }}>
                  <div style={{ height: "100%", backgroundColor: "#f59e0b", width: `${analytics.total_logs ? (analytics.medium_risk / analytics.total_logs) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "14px" }}>
                  <span style={{ fontWeight: "bold", color: "#16a34a" }}>Low Risk Events</span>
                  <span>{analytics.low_risk}</span>
                </div>
                <div style={{ width: "100%", height: "12px", backgroundColor: "#dcfce7", borderRadius: "6px", overflow: "hidden" }}>
                  <div style={{ height: "100%", backgroundColor: "#22c55e", width: `${analytics.total_logs ? (analytics.low_risk / analytics.total_logs) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: REPORTS ================= */}
        {activeTab === "Reports" && (
          <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>📋 Security Reports</h2>
            <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: "14px" }}>Automated system threat summary generated by backend</p>

            <div style={{ gridTemplateColumns: "1fr 1fr", gap: "15px", display: "grid" }}>
              <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 6px 0", color: "#2563eb" }}>Primary Threat Vector</h4>
                <p style={{ margin: 0, fontSize: "14px" }}>{reports.top_threat || "Brute Force Authentication"}</p>
              </div>
              <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 6px 0", color: "#16a34a" }}>Rule Engine Status</h4>
                <p style={{ margin: 0, fontSize: "14px" }}>{reports.status || "Active - Monitoring log stream"}</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 7: SETTINGS ================= */}
        {activeTab === "Settings" && (
          <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>⚙️ Settings</h2>
            <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: "14px" }}>Backend API configuration and system diagnostic controls</p>

            <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <div style={{ marginBottom: "12px" }}>
                <strong style={{ display: "block", fontSize: "13px", color: "#64748b" }}>API Target Base URL:</strong>
                <code style={{ fontSize: "14px", color: "#2563eb" }}>{API_BASE_URL}</code>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <strong style={{ display: "block", fontSize: "13px", color: "#64748b" }}>Connection Status:</strong>
                <span style={{ fontWeight: "bold", color: isHealthy ? "#16a34a" : "#dc2626" }}>{health.status ? health.status.toUpperCase() : "OFFLINE"}</span>
              </div>
              <button onClick={refreshData} style={{ backgroundColor: "#2563eb", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                🔄 Refresh Backend Connection
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;