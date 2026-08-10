import React from 'react';
import RiskBadge from './RiskBadge';

const AlertTable = ({ alerts = [] }) => {
  const items = Array.isArray(alerts) ? alerts : [];

  if (items.length === 0) {
    return <div style={{ color: '#64748b', padding: '20px', textAlign: 'center' }}>No security threats detected.</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#e2e8f0', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
            <th style={{ padding: '12px' }}>Event / Title</th>
            <th style={{ padding: '12px' }}>Source IP</th>
            <th style={{ padding: '12px' }}>Severity</th>
            <th style={{ padding: '12px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id || idx} style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '12px', fontWeight: '500' }}>{item.event || item.title || `Alert #${idx + 1}`}</td>
              <td style={{ padding: '12px', fontFamily: 'monospace', color: '#38bdf8' }}>{item.ip || item.source_ip || '192.168.1.100'}</td>
              <td style={{ padding: '12px' }}><RiskBadge level={item.risk_level || item.severity || 'MEDIUM'} /></td>
              <td style={{ padding: '12px', color: '#a7f3d0' }}>{item.status || 'Active'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertTable;