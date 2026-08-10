import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'logs', label: '📜 Logs' },
    { id: 'incidents', label: '🚨 Incidents' },
    { id: 'ip-analysis', label: '🌐 IP Analysis' },
    { id: 'reports', label: '📑 Reports' },
    { id: 'users', label: '👥 Users' },
  ];

  return (
    <aside style={{ width: '220px', backgroundColor: '#0f172a', borderRight: '1px solid #334155', padding: '20px 12px' }}>
      <div style={{ padding: '0 12px 20px 12px' }}>
        <h2 style={{ fontSize: '16px', margin: 0, color: '#38bdf8' }}>🛡️ Security SOC</h2>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              textAlign: 'left',
              padding: '10px 12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === item.id ? '#1e293b' : 'transparent',
              color: activeTab === item.id ? '#38bdf8' : '#94a3b8',
              fontWeight: activeTab === item.id ? 'bold' : 'normal',
              fontSize: '14px'
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;