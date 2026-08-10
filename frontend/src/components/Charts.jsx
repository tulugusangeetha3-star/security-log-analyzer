import React from 'react';

const Charts = () => {
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {/* SVG Threat Distribution Chart */}
      <div style={{ flex: 1, minWidth: '280px', background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
        <h4 style={{ margin: '0 0 12px', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>Threat Trend (24h)</h4>
        <svg viewBox="0 0 300 100" style={{ width: '100%', height: '120px' }}>
          <polyline
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            points="0,80 50,60 100,75 150,30 200,45 250,10 300,50"
          />
          <circle cx="250" cy="10" r="4" fill="#ef4444" />
        </svg>
      </div>

      {/* SVG Severity Bar Chart */}
      <div style={{ flex: 1, minWidth: '280px', background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
        <h4 style={{ margin: '0 0 12px', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>Risk Level Breakdown</h4>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '100px', gap: '20px', paddingLeft: '10px' }}>
          <div style={{ width: '30px', height: '30%', background: '#34d399', borderRadius: '4px' }} title="Low"></div>
          <div style={{ width: '30px', height: '60%', background: '#facc15', borderRadius: '4px' }} title="Medium"></div>
          <div style={{ width: '30px', height: '85%', background: '#f87171', borderRadius: '4px' }} title="High"></div>
          <div style={{ width: '30px', height: '40%', background: '#f97316', borderRadius: '4px' }} title="Critical"></div>
        </div>
      </div>
    </div>
  );
};

export default Charts;