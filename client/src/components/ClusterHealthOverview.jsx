import React from 'react';

export default function ClusterHealthOverview({ summary }) {
  return (
    <div className="overview-row">
      <div className="telemetry-card">
        <div className="metric-title">Cluster Throughput</div>
        <div className="metric-number" style={{ color: 'var(--cyan-bright)' }}>
          {summary?.clusterTotalRps?.toLocaleString() || '6,420'} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>RPS</span>
        </div>
      </div>

      <div className="telemetry-card">
        <div className="metric-title">P95 Latency (Aggregated)</div>
        <div className="metric-number">
          {summary?.clusterAvgLatencyP95Ms || '142'} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>ms</span>
        </div>
      </div>

      <div className="telemetry-card">
        <div className="metric-title">Active Service Nodes</div>
        <div className="metric-number" style={{ color: 'var(--emerald-green)' }}>
          {summary?.healthyServices || 5} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ {summary?.totalServices || 6} Healthy</span>
        </div>
      </div>

      <div className="telemetry-card">
        <div className="metric-title">Global Error Rate</div>
        <div className="metric-number" style={{ color: summary?.clusterAvgErrorRatePercent > 1.0 ? '#f43f5e' : '#10b981' }}>
          {summary?.clusterAvgErrorRatePercent || '0.28'}%
        </div>
      </div>
    </div>
  );
}
