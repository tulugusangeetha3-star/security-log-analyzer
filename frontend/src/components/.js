<div className="app-container">
  {/* Sidebar */}
  <aside className="sidebar">
    <div className="brand-header">
      🛡️ Security SOC
    </div>
    <nav>
      <div className="nav-item">📊 Dashboard</div>
      <div className="nav-item">📜 Logs</div>
      <div className="nav-item">🚨 Incidents</div>
      <div className="nav-item active">🌐 IP Analysis</div>
      <div className="nav-item">📄 Reports</div>
      <div className="nav-item">👥 Users</div>
    </nav>
  </aside>

  {/* Main Workspace */}
  <main className="main-content">
    <header className="top-header">
      <h1 className="page-title">SOC Control Panel</h1>
      <div className="status-pill">
        <span className="status-dot"></span>
        API Status: healthy
      </div>
    </header>

    <div className="dashboard-card">
      <h2 className="card-title">IP Threat Intelligence</h2>
      <p className="card-subtitle">Backend analytics connection ready.</p>
    </div>
  </main>
</div>