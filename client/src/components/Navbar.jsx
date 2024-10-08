import React from 'react';

export default function Navbar({ activeTab, setActiveTab, activeP1Count }) {
  return (
    <nav className="navbar-wrapper">
      <div className="brand-section">
        <span className="brand-text">CLOUDOPS-PULSE</span>
        <span className="zone-badge">ZONE: US-EAST-1A</span>
      </div>

      <div className="nav-tabs">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={`tab-btn ${activeTab === 'mesh' ? 'active' : ''}`} onClick={() => setActiveTab('mesh')}>
          Service Mesh
        </button>
        <button className={`tab-btn ${activeTab === 'incidents' ? 'active' : ''}`} onClick={() => setActiveTab('incidents')}>
          Incidents {activeP1Count > 0 && <span style={{ color: '#f43f5e', fontWeight: 800 }}>({activeP1Count})</span>}
        </button>
        <button className={`tab-btn ${activeTab === 'slo' ? 'active' : ''}`} onClick={() => setActiveTab('slo')}>
          SLO & Error Budgets
        </button>
        <button className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}>
          Alert Rules
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span className="status-dot dot-healthy"></span>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          K8S TELEMETRY STREAM
        </span>
      </div>
    </nav>
  );
}
