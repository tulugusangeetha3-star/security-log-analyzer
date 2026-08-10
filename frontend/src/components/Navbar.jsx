import React from 'react';

const Navbar = ({ healthStatus }) => {
  const isHealthy = healthStatus === 'healthy' || healthStatus === 'running';

  return (
    <header style={{
      height: '60px',
      backgroundColor: '#1e293b',
      borderBottom: '1px solid #334155',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px'
    }}>
      <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '16px' }}>SOC Control Panel</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
        <span style={{
          height: '10px',
          width: '10px',
          borderRadius: '50%',
          backgroundColor: isHealthy ? '#22c55e' : '#ef4444',
          display: 'inline-block'
        }}></span>
        <span style={{ color: '#94a3b8' }}>API Status: <strong style={{ color: '#f8fafc' }}>{healthStatus}</strong></span>
      </div>
    </header>
  );
};

export default Navbar;