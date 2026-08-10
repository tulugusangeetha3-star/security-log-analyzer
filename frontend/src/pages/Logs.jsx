import React, { useEffect, useState } from 'react';
import LogTable from '../components/LogTable';
import { getLogs } from '../services/api';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  useEffect(() => { getLogs().then(data => setLogs(Array.isArray(data) ? data : [])); }, []);
  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ color: '#f8fafc' }}>Ingested Logs</h2>
      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
        <LogTable logs={logs} />
      </div>
    </div>
  );
}