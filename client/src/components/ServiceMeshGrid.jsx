import React from 'react';

export default function ServiceMeshGrid({ services }) {
  const getDotClass = (status) => {
    if (status === 'HEALTHY') return 'dot-healthy';
    if (status === 'DEGRADED') return 'dot-degraded';
    return 'dot-outage';
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '15px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px', letterSpacing: '0.5px' }}>
        Service Mesh Nodes & Health Status
      </h3>
      <div className="mesh-grid">
        {services.map((svc) => (
          <div key={svc.serviceId} className="service-card">
            <div className="service-header">
              <span style={{ fontWeight: 700, fontSize: '14px' }}>{svc.name}</span>
              <span className={`status-dot ${getDotClass(svc.healthStatus)}`}></span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
              {svc.serviceId} | {svc.tier}
            </div>

            <div className="stat-metric-line">
              <span>Replicas:</span>
              <span className="stat-metric-val">{svc.replicaCount} Pods</span>
            </div>
            <div className="stat-metric-line">
              <span>SLO Target:</span>
              <span className="stat-metric-val" style={{ color: 'var(--cyan-bright)' }}>{svc.sloTargetPercent}%</span>
            </div>
            <div className="stat-metric-line">
              <span>Status:</span>
              <span className="stat-metric-val" style={{ color: svc.healthStatus === 'HEALTHY' ? '#10b981' : '#f59e0b' }}>
                {svc.healthStatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
