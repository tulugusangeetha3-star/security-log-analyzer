import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [analytics, setAnalytics] = useState({
    total_logs: 0,
    high_risk: 0,
    medium_risk: 0,
    low_risk: 0,
  });

  const [logs, setLogs] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [reports, setReports] = useState(null);

  const [apiStatus, setApiStatus] = useState("Checking...");
  const [loading, setLoading] = useState(true);

  const [searchIp, setSearchIp] = useState("");
  const [ipResults, setIpResults] = useState([]);

  // -----------------------------
  // FETCH DATA FROM FASTAPI
  // -----------------------------
  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);

    try {
      const healthResponse = await fetch(`${API_URL}/health`);

      if (!healthResponse.ok) {
        throw new Error("Backend unavailable");
      }

      const healthData = await healthResponse.json();

      if (healthData.status === "healthy") {
        setApiStatus("Online");
      } else {
        setApiStatus("Offline");
      }

      const [
        analyticsResponse,
        logsResponse,
        incidentsResponse,
        reportsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/analytics`),
        fetch(`${API_URL}/logs`),
        fetch(`${API_URL}/incidents`),
        fetch(`${API_URL}/reports`),
      ]);

      const analyticsData = await analyticsResponse.json();
      const logsData = await logsResponse.json();
      const incidentsData = await incidentsResponse.json();
      const reportsData = await reportsResponse.json();

      setAnalytics(analyticsData);
      setLogs(logsData.logs || []);
      setIncidents(incidentsData.incidents || []);
      setReports(reportsData);
    } catch (error) {
      console.error("Backend connection error:", error);
      setApiStatus("Offline");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // IP ANALYSIS
  // -----------------------------
  function analyzeIP(e) {
    e.preventDefault();

    if (!searchIp.trim()) {
      setIpResults([]);
      return;
    }

    const results = logs.filter(
      (log) =>
        log.ip &&
        log.ip.toLowerCase().includes(searchIp.trim().toLowerCase())
    );

    setIpResults(results);
  }

  // -----------------------------
  // NAVIGATION
  // -----------------------------
  const navigation = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "logs", icon: "📜", label: "Security Logs" },
    { id: "incidents", icon: "🚨", label: "Incidents" },
    { id: "ip-analysis", icon: "🌐", label: "IP Analysis" },
    { id: "analytics", icon: "📈", label: "Analytics" },
    { id: "reports", icon: "📋", label: "Reports" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  // -----------------------------
  // DASHBOARD
  // -----------------------------
  function Dashboard() {
    return (
      <div>
        <div className="page-title">
          <h1>📊 Security Dashboard</h1>
          <p>Real-time overview from the FastAPI security backend</p>
        </div>

        <div className="cards">
          <StatCard
            title="Total Logs"
            value={analytics.total_logs}
            color="#2563eb"
            icon="📜"
          />

          <StatCard
            title="High Risk"
            value={analytics.high_risk}
            color="#dc2626"
            icon="🔴"
          />

          <StatCard
            title="Medium Risk"
            value={analytics.medium_risk}
            color="#d97706"
            icon="🟡"
          />

          <StatCard
            title="Low Risk"
            value={analytics.low_risk}
            color="#16a34a"
            icon="🟢"
          />
        </div>

        <div className="connection-card">
          <div>
            <h3>Backend Connection</h3>
            <p>FastAPI security service</p>
          </div>

          <div
            className={`status ${
              apiStatus === "Online" ? "online" : "offline"
            }`}
          >
            <span></span>
            API: {apiStatus.toUpperCase()}
          </div>
        </div>

        <div className="info-grid">
          <div className="panel">
            <h2>Recent Security Events</h2>

            {logs.length === 0 ? (
              <p className="empty">No logs available.</p>
            ) : (
              logs.slice(0, 5).map((log) => (
                <div className="event" key={log.id}>
                  <div>
                    <strong>{log.event}</strong>
                    <small>{log.ip}</small>
                  </div>

                  <span className={`badge ${log.severity.toLowerCase()}`}>
                    {log.severity}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="panel">
            <h2>Active Incidents</h2>

            {incidents.length === 0 ? (
              <p className="empty">No active incidents.</p>
            ) : (
              incidents.map((incident) => (
                <div className="incident" key={incident.id}>
                  <div>
                    <strong>🚨 {incident.title}</strong>
                    <small>Status: {incident.status}</small>
                  </div>

                  <span className="badge high">
                    {incident.severity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // LOGS
  // -----------------------------
  function Logs() {
    return (
      <div>
        <div className="page-title">
          <h1>📜 Security Logs</h1>
          <p>Logs received from the FastAPI backend</p>
        </div>

        <div className="panel table-panel">
          {logs.length === 0 ? (
            <p className="empty">No logs available.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>IP Address</th>
                  <th>Event</th>
                  <th>Severity</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.ip}</td>
                    <td>{log.event}</td>
                    <td>
                      <span
                        className={`badge ${log.severity.toLowerCase()}`}
                      >
                        {log.severity}
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

  // -----------------------------
  // INCIDENTS
  // -----------------------------
  function Incidents() {
    return (
      <div>
        <div className="page-title">
          <h1>🚨 Security Incidents</h1>
          <p>Detected security incidents</p>
        </div>

        {incidents.length === 0 ? (
          <div className="panel empty">
            No active incidents.
          </div>
        ) : (
          incidents.map((incident) => (
            <div className="incident-card" key={incident.id}>
              <div>
                <h2>🚨 {incident.title}</h2>

                <p>
                  Severity:
                  <strong> {incident.severity}</strong>
                </p>

                <p>
                  Status:
                  <strong> {incident.status}</strong>
                </p>
              </div>

              <span className="badge high">
                {incident.severity}
              </span>
            </div>
          ))
        )}
      </div>
    );
  }

  // -----------------------------
  // IP ANALYSIS
  // -----------------------------
  function IPAnalysis() {
    return (
      <div>
        <div className="page-title">
          <h1>🌐 IP Analysis</h1>
          <p>Search security events by IP address</p>
        </div>

        <div className="panel">
          <form onSubmit={analyzeIP} className="search-form">
            <input
              type="text"
              placeholder="Enter IP address..."
              value={searchIp}
              onChange={(e) => setSearchIp(e.target.value)}
            />

            <button type="submit">Analyze IP</button>
          </form>
        </div>

        {searchIp && (
          <div className="panel">
            <h2>Analysis Result</h2>

            <p>
              IP Address: <strong>{searchIp}</strong>
            </p>

            {ipResults.length === 0 ? (
              <p className="empty">
                No matching events found for this IP address.
              </p>
            ) : (
              ipResults.map((log) => (
                <div className="event" key={log.id}>
                  <div>
                    <strong>{log.event}</strong>
                    <small>{log.ip}</small>
                  </div>

                  <span
                    className={`badge ${log.severity.toLowerCase()}`}
                  >
                    {log.severity}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  // -----------------------------
  // ANALYTICS
  // -----------------------------
  function Analytics() {
    const total = analytics.total_logs || 1;

    return (
      <div>
        <div className="page-title">
          <h1>📈 Security Analytics</h1>
          <p>Security event statistics</p>
        </div>

        <div className="cards">
          <StatCard
            title="High Risk"
            value={analytics.high_risk}
            color="#dc2626"
            icon="🔴"
          />

          <StatCard
            title="Medium Risk"
            value={analytics.medium_risk}
            color="#d97706"
            icon="🟡"
          />

          <StatCard
            title="Low Risk"
            value={analytics.low_risk}
            color="#16a34a"
            icon="🟢"
          />
        </div>

        <div className="panel">
          <h2>Risk Distribution</h2>

          <div className="bar-container">
            <div className="bar-label">
              <span>High Risk</span>
              <strong>{analytics.high_risk}</strong>
            </div>

            <div className="bar">
              <div
                className="bar-high"
                style={{
                  width: `${(analytics.high_risk / total) * 100}%`,
                }}
              ></div>
            </div>

            <div className="bar-label">
              <span>Medium Risk</span>
              <strong>{analytics.medium_risk}</strong>
            </div>

            <div className="bar">
              <div
                className="bar-medium"
                style={{
                  width: `${(analytics.medium_risk / total) * 100}%`,
                }}
              ></div>
            </div>

            <div className="bar-label">
              <span>Low Risk</span>
              <strong>{analytics.low_risk}</strong>
            </div>

            <div className="bar">
              <div
                className="bar-low"
                style={{
                  width: `${(analytics.low_risk / total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // REPORTS
  // -----------------------------
  function Reports() {
    return (
      <div>
        <div className="page-title">
          <h1>📋 Security Reports</h1>
          <p>Reports generated by the FastAPI backend</p>
        </div>

        <div className="panel">
          {reports ? (
            <pre>{JSON.stringify(reports, null, 2)}</pre>
          ) : (
            <p className="empty">No report data available.</p>
          )}
        </div>
      </div>
    );
  }

  // -----------------------------
  // SETTINGS
  // -----------------------------
  function Settings() {
    return (
      <div>
        <div className="page-title">
          <h1>⚙️ Settings</h1>
          <p>Security Log Analyzer configuration</p>
        </div>

        <div className="panel settings-panel">
          <h2>Backend API</h2>

          <div className="setting-row">
            <span>API URL</span>
            <code>{API_URL}</code>
          </div>

          <div className="setting-row">
            <span>Status</span>

            <strong
              className={
                apiStatus === "Online"
                  ? "text-green"
                  : "text-red"
              }
            >
              {apiStatus}
            </strong>
          </div>

          <button onClick={loadAllData} className="refresh-button">
            🔄 Refresh Backend Data
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------
  // CONTENT SWITCH
  // -----------------------------
  function renderContent() {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;

      case "logs":
        return <Logs />;

      case "incidents":
        return <Incidents />;

      case "ip-analysis":
        return <IPAnalysis />;

      case "analytics":
        return <Analytics />;

      case "reports":
        return <Reports />;

      case "settings":
        return <Settings />;

      default:
        return <Dashboard />;
    }
  }

  return (
    <div className="app">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #f1f5f9;
          color: #0f172a;
        }

        button,
        input {
          font-family: inherit;
        }

        .app {
          min-height: 100vh;
        }

        header {
          height: 72px;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          padding: 0 32px;
          gap: 15px;
        }

        .brand {
          font-size: 21px;
          font-weight: 700;
          color: #0f172a;
        }

        .brand span {
          color: #2563eb;
        }

        .api-pill {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 15px;
          border-radius: 20px;
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
          font-size: 13px;
          font-weight: 600;
        }

        .api-dot {
          width: 9px;
          height: 9px;
          background: #22c55e;
          border-radius: 50%;
        }

        nav {
          background: #38bdf8;
          display: flex;
          padding: 0 25px;
          min-height: 54px;
          overflow-x: auto;
        }

        nav button {
          border: 0;
          background: transparent;
          color: #075985;
          font-size: 14px;
          font-weight: 600;
          padding: 15px 18px;
          cursor: pointer;
          white-space: nowrap;
        }

        nav button:hover {
          background: rgba(255,255,255,.25);
        }

        nav button.active {
          background: white;
          color: #0369a1;
        }

        main {
          max-width: 1250px;
          margin: auto;
          padding: 35px 25px 60px;
        }

        .page-title {
          margin-bottom: 25px;
        }

        .page-title h1 {
          margin: 0 0 7px;
          font-size: 28px;
        }

        .page-title p {
          margin: 0;
          color: #64748b;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-bottom: 22px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 22px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 5px rgba(0,0,0,.04);
        }

        .stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-title {
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
        }

        .stat-icon {
          font-size: 21px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          margin-top: 12px;
        }

        .connection-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }

        .connection-card h3 {
          margin: 0 0 5px;
        }

        .connection-card p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .status {
          padding: 8px 15px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 13px;
        }

        .status.online {
          color: #166534;
          background: #dcfce7;
        }

        .status.offline {
          color: #991b1b;
          background: #fee2e2;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }

        .panel {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 23px;
          box-shadow: 0 2px 5px rgba(0,0,0,.03);
          margin-bottom: 22px;
        }

        .panel h2 {
          font-size: 18px;
          margin: 0 0 20px;
        }

        .event,
        .incident {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .event:last-child,
        .incident:last-child {
          border-bottom: 0;
        }

        .event strong,
        .incident strong {
          display: block;
          margin-bottom: 5px;
        }

        .event small,
        .incident small {
          color: #64748b;
        }

        .badge {
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 700;
        }

        .badge.high {
          color: #991b1b;
          background: #fee2e2;
        }

        .badge.medium {
          color: #92400e;
          background: #fef3c7;
        }

        .badge.low {
          color: #166534;
          background: #dcfce7;
        }

        .badge.critical {
          color: #7f1d1d;
          background: #fecaca;
        }

        .table-panel {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        th {
          color: #475569;
          font-size: 13px;
          background: #f8fafc;
        }

        td {
          font-size: 14px;
        }

        .incident-card {
          background: white;
          border: 1px solid #fecaca;
          border-left: 5px solid #dc2626;
          border-radius: 10px;
          padding: 22px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .incident-card h2 {
          margin: 0 0 12px;
        }

        .incident-card p {
          margin: 6px 0;
          color: #475569;
        }

        .search-form {
          display: flex;
          gap: 12px;
        }

        .search-form input {
          flex: 1;
          padding: 13px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
        }

        .search-form input:focus {
          border-color: #2563eb;
        }

        button {
          border: 0;
        }

        .search-form button,
        .refresh-button {
          background: #2563eb;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .search-form button:hover,
        .refresh-button:hover {
          background: #1d4ed8;
        }

        .bar-container {
          max-width: 700px;
        }

        .bar-label {
          display: flex;
          justify-content: space-between;
          margin: 17px 0 7px;
          font-size: 14px;
        }

        .bar {
          height: 12px;
          background: #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
        }

        .bar-high {
          height: 100%;
          background: #ef4444;
        }

        .bar-medium {
          height: 100%;
          background: #f59e0b;
        }

        .bar-low {
          height: 100%;
          background: #22c55e;
        }

        pre {
          background: #0f172a;
          color: #e2e8f0;
          padding: 20px;
          border-radius: 8px;
          overflow-x: auto;
        }

        .setting-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .setting-row code {
          background: #f1f5f9;
          padding: 7px 10px;
          border-radius: 5px;
        }

        .refresh-button {
          margin-top: 20px;
        }

        .text-green {
          color: #16a34a;
        }

        .text-red {
          color: #dc2626;
        }

        .empty {
          color: #64748b;
          text-align: center;
          padding: 20px;
        }

        @media (max-width: 850px) {
          .cards {
            grid-template-columns: repeat(2, 1fr);
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 550px) {
          .cards {
            grid-template-columns: 1fr;
          }

          header {
            padding: 0 15px;
          }

          main {
            padding: 25px 15px;
          }

          .search-form {
            flex-direction: column;
          }
        }
      `}</style>

      <header>
        <div className="brand">
          🛡️ <span>Security</span> Log Analyzer
        </div>

        <div className="api-pill">
          <span className="api-dot"></span>
          API Status: {apiStatus}
        </div>
      </header>

      <nav>
        {navigation.map((item) => (
          <button
            key={item.id}
            className={activeTab === item.id ? "active" : ""}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      <main>
        {loading ? (
          <div className="panel empty">
            Connecting to Security Backend...
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
}

// -----------------------------
// STAT CARD COMPONENT
// -----------------------------
function StatCard({ title, value, color, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className="stat-title">{title}</span>
        <span className="stat-icon">{icon}</span>
      </div>

      <div
        className="stat-value"
        style={{ color }}
      >
        {value}
      </div>
    </div>
  );
}