import React from 'react';

const LogTable = ({ logs = [] }) => {
  const logList = Array.isArray(logs) ? logs : [];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#cbd5e1', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
            <th style={{ padding: '10px' }}>Timestamp</th>
            <th style={{ padding: '10px' }}>IP Address</th>
            <th style={{ padding: '10px' }}>Action / Message</th>
          </tr>
        </thead>
        <tbody>
          {logList.slice(0, 10).map((log, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '10px', color: '#64748b' }}>{log.timestamp || new Date().toISOString()}</td>
              <td style={{ padding: '10px', fontFamily: 'monospace', color: '#38bdf8' }}>{log.ip || log.source_ip || '10.0.0.1'}</td>
              <td style={{ padding: '10px' }}>{log.message || log.raw || 'Standard Auth Log Ingestion'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;