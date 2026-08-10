import React, { useEffect, useState } from 'react';
import AlertTable from '../components/AlertTable';
import { getIncidents } from '../services/api';

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  useEffect(() => { getIncidents().then(data => setIncidents(Array.isArray(data) ? data : [])); }, []);
  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ color: '#f8fafc' }}>Incident Management</h2>
      <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
        <AlertTable alerts={incidents} />
      </div>
    </div>
  );
}