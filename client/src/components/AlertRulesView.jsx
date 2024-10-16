import React from 'react';

export default function AlertRulesView({ rules }) {
  return (
    <div className="telemetry-card">
      <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Active SRE Metric Threshold Rules</h3>
      <div className="table-wrapper">
        <table className="sre-table">
          <thead>
            <tr>
              <th>Rule ID</th>
              <th>Rule Name</th>
              <th>Target Service</th>
              <th>Metric Condition</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.ruleId}>
                <td className="mono" style={{ color: 'var(--cyan-bright)' }}>{r.ruleId}</td>
                <td>{r.name}</td>
                <td className="mono">{r.serviceId}</td>
                <td className="mono">{r.metricType} &gt; {r.thresholdValue}</td>
                <td>
                  <span className={`sev-badge ${r.severity === 'P1_CRITICAL' ? 'sev-p1' : 'sev-p2'}`}>
                    {r.severity}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>ACTIVE</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
