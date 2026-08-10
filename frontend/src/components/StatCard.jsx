import React from 'react';

const StatCard = ({ title, value, color = '#38bdf8', subtitle }) => {
  return (
    <div style={{
      background: '#1e293b',
      borderLeft: `4px solid ${color}`,
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '16px 20px',
      flex: '1',
      minWidth: '220px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
    }}>
      <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
        {title}
      </p>
      <div style={{ fontSize: '28px', fontWeight: '800', color: '#f8fafc', margin: '8px 0' }}>
        {value}
      </div>
      {subtitle && <span style={{ fontSize: '12px', color: '#64748b' }}>{subtitle}</span>}
    </div>
  );
};

export default StatCard;