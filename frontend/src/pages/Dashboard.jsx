import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import AlertTable from '../components/AlertTable';
import Charts from '../components/Charts';
import { getHealth, getLogs, getIncidents } from '../services/api';

const Dashboard = () => {
  const [health, setHealth] = useState('checking...');
  const [logs, setLogs] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      const healthData = await getHealth();
      setHealth(healthData.status || 'offline');

      const logsData = await getLogs();
      setLogs(Array.isArray(logsData) ? logsData : logsData.logs || []);

      const incidentsData = await getIncidents();
      setIncidents(Array.isArray(incidentsData) ? incidentsData : incidentsData.incidents || []);

      setLoading(false);
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div style={{ padding: '30px', color: '#94a3b8' }}>Loading Security Center Dashboard...</div>;
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#0f172a', minHeight: 'calc(100vh - 60px)' }}>
      <header style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#f8fafc' }}>Threat Overview</h2>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>Real-time telemetry and incident intelligence</p>
      </header>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <StatCard title="API Engine Status" value={health.toUpperCase()} color="#34d399" subtitle="FastAPI Backend" />
        <StatCard title="Total Logs Processed" value={logs.length} color="#38bdf8" subtitle="Ingested Events" />
        <StatCard title="Active Incidents" value={incidents.length} color="#ef4444" subtitle="Requires Action" />
      </div>

      {/* Charts Section */}
      <div style={{ marginBottom: '24px' }}>
        <Charts />
      </div>

      {/* Active Incidents Table */}
      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
        <h3 style={{ marginTop: 0, color: '#f8fafc', fontSize: '16px' }}>Recent Security Incidents</h3>
        <AlertTable alerts={incidents} />
      </div>
    </div>
  );
};

export default Dashboard;