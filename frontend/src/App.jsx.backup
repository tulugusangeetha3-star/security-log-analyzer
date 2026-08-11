import React, { useState, useEffect } from 'react';
import { getHealth, getAnalytics, getLogs, getIncidents, getReports } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [status, setStatus] = useState('Offline');
  const [analytics, setAnalytics] = useState({ total_logs: 0, high_risk: 0, medium_risk: 0, low_risk: 0 });
  const [logs, setLogs] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [reports, setReports] = useState(null);
  const [ipQuery, setIpQuery] = useState('');
  const [ipResult, setIpResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const healthRes = await getHealth();
      if (healthRes && healthRes.status === 'healthy') {
        setStatus('Online');
      } else {
        setStatus('Offline');
      }

      const analyticsData = await getAnalytics();
      if (analyticsData && analyticsData.total_logs !== undefined) {
        setAnalytics(analyticsData);
      }

      const logsData = await getLogs();
      if (logsData && logsData.logs) {
        setLogs(logsData.logs);
      }

      const incidentsData = await getIncidents();
      if (incidentsData && incidentsData.incidents) {
        setIncidents(incidentsData.incidents);
      }

      const reportsData = await getReports();
      if (reportsData) {
        setReports(reportsData);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setStatus('Offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleIpSearch = (e) => {
    e.preventDefault();
    if (!ipQuery.trim()) return;
    const matches = logs.filter(log => log.ip.includes(ipQuery.trim()));
    setIpResult(matches);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f0f4f8', minHeight: '100vh', color: '#1e293b' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🛡️</span>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
            <span style={{ color: '#3b82f6' }}>Security</span> Log Analyzer
          </h1>
        </div>
        <div style={{
          backgroundColor: status === 'Online' ? '#dcfce7' : '#fee2e2',
          color: status === 'Online' ? '#166534' : '#991b1b',
          padding: '6px 14px',
          borderRadius: '20px',
          fontWeight: '600',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: status === 'Online' ? '#22c55e' : '#ef4444' }}></span>
          API Status: {status}
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ backgroundColor: '#60a5fa', display: 'flex', gap: '4px', padding: '0 16px', overflowX: 'auto' }}>
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'logs', label: '📜 Security Logs' },
          { id: 'incidents', label: '🚨 Incidents' },
          { id: 'ip', label: '🌐 IP Analysis' },
          { id: 'analytics', label: '📈 Analytics' },
          { id: 'reports', label: '📋 Reports' },
          { id: 'settings', label: '⚙️ Settings' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              backgroundColor: activeTab === tab.id ? '#ffffff' : 'transparent',
              color: activeTab === tab.id ? '#1d4ed8' : '#ffffff',
              border: 'none',
              padding: '12px 20px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              borderTopLeftRadius: '6px',
              borderTopRightRadius: '6px',
              marginTop: '6px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1100px', margin: '24px auto', padding: '0 16px' }}>

        {/* 1. DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '4px' }}>📊 Security Dashboard</h2>
            <p style={{ color: '#64748b', marginTop: 0, marginBottom: '20px' }}>Real-time overview from the FastAPI security backend</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Total Logs</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>{analytics.total_logs}</div>
                </div>
                <span style={{ fontSize: '28px' }}>📜</span>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>High Risk</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>{analytics.high_risk}</div>
                </div>
                <span style={{ height: '20px', width: '20px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }}></span>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Medium Risk</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706' }}>{analytics.medium_risk}</div>
                </div>
                <span style={{ height: '20px', width: '20px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }}></span>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Low Risk</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>{analytics.low_risk}</div>
                </div>
                <span style={{ height: '20px', width: '20px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Backend Connection</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>FastAPI security service</p>
              </div>
              <span style={{
                backgroundColor: status === 'Online' ? '#dcfce7' : '#fee2e2',
                color: status === 'Online' ? '#15803d' : '#b91c1c',
                padding: '6px 16px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '12px'
              }}>
                API: {status.toUpperCase()}
              </span>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: 'bold' }}>Recent Security Events</h3>
              {logs.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0' }}>No logs available.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '10px' }}>ID</th>
                      <th style={{ padding: '10px' }}>Timestamp</th>
                      <th style={{ padding: '10px' }}>IP Address</th>
                      <th style={{ padding: '10px' }}>Event</th>
                      <th style={{ padding: '10px' }}>Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px' }}>{log.id}</td>
                        <td style={{ padding: '10px' }}>{log.timestamp}</td>
                        <td style={{ padding: '10px' }}>{log.ip}</td>
                        <td style={{ padding: '10px' }}>{log.event}</td>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: log.risk === 'High' ? '#dc2626' : log.risk === 'Medium' ? '#d97706' : '#16a34a' }}>
                          {log.risk}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* 2. LOGS TAB */}
        {activeTab === 'logs' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '4px' }}>📜 Security Logs</h2>
            <p style={{ color: '#64748b', marginTop: 0, marginBottom: '20px' }}>Logs received from the FastAPI backend</p>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              {logs.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0' }}>No logs available.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '10px' }}>ID</th>
                      <th style={{ padding: '10px' }}>Timestamp</th>
                      <th style={{ padding: '10px' }}>IP Address</th>
                      <th style={{ padding: '10px' }}>Event</th>
                      <th style={{ padding: '10px' }}>Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px' }}>{log.id}</td>
                        <td style={{ padding: '10px' }}>{log.timestamp}</td>
                        <td style={{ padding: '10px' }}>{log.ip}</td>
                        <td style={{ padding: '10px' }}>{log.event}</td>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: log.risk === 'High' ? '#dc2626' : log.risk === 'Medium' ? '#d97706' : '#16a34a' }}>
                          {log.risk}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* 3. INCIDENTS TAB */}
        {activeTab === 'incidents' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '4px' }}>🚨 Security Incidents</h2>
            <p style={{ color: '#64748b', marginTop: 0, marginBottom: '20px' }}>Detected security incidents</p>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              {incidents.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0' }}>No active incidents.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '10px' }}>ID</th>
                      <th style={{ padding: '10px' }}>Timestamp</th>
                      <th style={{ padding: '10px' }}>IP Address</th>
                      <th style={{ padding: '10px' }}>Incident Event</th>
                      <th style={{ padding: '10px' }}>Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidents.map(inc => (
                      <tr key={inc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px' }}>{inc.id}</td>
                        <td style={{ padding: '10px' }}>{inc.timestamp}</td>
                        <td style={{ padding: '10px' }}>{inc.ip}</td>
                        <td style={{ padding: '10px' }}>{inc.event}</td>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: inc.risk === 'High' ? '#dc2626' : '#d97706' }}>
                          {inc.risk}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* 4. IP ANALYSIS TAB */}
        {activeTab === 'ip' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '4px' }}>🌐 IP Analysis</h2>
            <p style={{ color: '#64748b', marginTop: 0, marginBottom: '20px' }}>Search security events by IP address</p>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <form onSubmit={handleIpSearch} style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Enter IP address..."
                  value={ipQuery}
                  onChange={(e) => setIpQuery(e.target.value)}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
                <button type="submit" style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Analyze IP
                </button>
              </form>
            </div>
            {ipResult && (
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: 0, marginBottom: '12px', fontSize: '16px' }}>Search Results</h3>
                {ipResult.length === 0 ? (
                  <p style={{ color: '#64748b' }}>No security events found for this IP.</p>
                ) : (
                  <ul>
                    {ipResult.map(log => (
                      <li key={log.id} style={{ marginBottom: '8px' }}>
                        <strong>{log.timestamp}</strong> - {log.event} (<span style={{ color: log.risk === 'High' ? '#dc2626' : '#16a34a' }}>{log.risk} Risk</span>)
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* 5. ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '4px' }}>📈 Security Analytics</h2>
            <p style={{ color: '#64748b', marginTop: 0, marginBottom: '20px' }}>Security event statistics</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '14px' }}>High Risk</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>{analytics.high_risk}</div>
                </div>
                <span style={{ height: '20px', width: '20px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }}></span>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '14px' }}>Medium Risk</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706' }}>{analytics.medium_risk}</div>
                </div>
                <span style={{ height: '20px', width: '20px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }}></span>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '14px' }}>Low Risk</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>{analytics.low_risk}</div>
                </div>
                <span style={{ height: '20px', width: '20px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: 'bold' }}>Risk Distribution</h3>
              <div style={{ marginTop: '16px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
                    <span>High Risk</span>
                    <span>{analytics.high_risk}</span>
                  </div>
                  <div style={{ backgroundColor: '#f1f5f9', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#ef4444', width: `${analytics.total_logs ? (analytics.high_risk / analytics.total_logs) * 100 : 0}%`, height: '100%' }}></div>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
                    <span>Medium Risk</span>
                    <span>{analytics.medium_risk}</span>
                  </div>
                  <div style={{ backgroundColor: '#f1f5f9', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#f59e0b', width: `${analytics.total_logs ? (analytics.medium_risk / analytics.total_logs) * 100 : 0}%`, height: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
                    <span>Low Risk</span>
                    <span>{analytics.low_risk}</span>
                  </div>
                  <div style={{ backgroundColor: '#f1f5f9', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#22c55e', width: `${analytics.total_logs ? (analytics.low_risk / analytics.total_logs) * 100 : 0}%`, height: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. REPORTS TAB */}
        {activeTab === 'reports' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '4px' }}>📋 Security Reports</h2>
            <p style={{ color: '#64748b', marginTop: 0, marginBottom: '20px' }}>Reports generated by the FastAPI backend</p>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              {!reports ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0' }}>No report data available.</p>
              ) : (
                <div>
                  <h3 style={{ marginTop: 0 }}>{reports.summary || 'Security Assessment Report'}</h3>
                  <p><strong>Total Events Analyzed:</strong> {reports.total_events_analyzed || analytics.total_logs}</p>
                  <p><strong>Overall Risk Level:</strong> {reports.risk_level || 'Elevated'}</p>
                  <p><strong>Status:</strong> {reports.status || 'Active'}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 7. SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '4px' }}>⚙️ Settings</h2>
            <p style={{ color: '#64748b', marginTop: 0, marginBottom: '20px' }}>Security Log Analyzer configuration</p>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px', fontWeight: 'bold' }}>Backend API</h3>
              <div style={{ margin: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>API URL</span>
                <code style={{ backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '6px', fontSize: '13px' }}>
                  https://security-log-analyzer-backend.onrender.com
                </code>
              </div>
              <div style={{ margin: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Status</span>
                <span style={{ color: status === 'Online' ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>
                  {status}
                </span>
              </div>
              <button
                onClick={fetchAllData}
                disabled={loading}
                style={{
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🔄 {loading ? 'Refreshing...' : 'Refresh Backend Data'}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;