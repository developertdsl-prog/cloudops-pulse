import React from 'react';

export default function IncidentManagementTable({ incidents, onAcknowledge, onResolve }) {
  return (
    <div className="telemetry-card" style={{ padding: '0px', marginBottom: '24px' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Active Incident Escalation Queue</h3>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Automated PagerDuty Integration</span>
      </div>

      <div className="table-wrapper">
        <table className="sre-table">
          <thead>
            <tr>
              <th>Incident ID</th>
              <th>Service</th>
              <th>Severity</th>
              <th>Summary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => (
              <tr key={inc.incidentId}>
                <td className="mono" style={{ color: 'var(--cyan-bright)' }}>{inc.incidentId}</td>
                <td className="mono">{inc.serviceId}</td>
                <td>
                  <span className={`sev-badge ${inc.severity === 'P1_CRITICAL' ? 'sev-p1' : 'sev-p2'}`}>
                    {inc.severity}
                  </span>
                </td>
                <td>{inc.title}</td>
                <td>
                  <span className="mono" style={{ color: inc.status === 'RESOLVED' ? '#10b981' : '#f59e0b' }}>
                    {inc.status}
                  </span>
                </td>
                <td>
                  {inc.status === 'TRIGGERED' && (
                    <button className="btn-ops btn-sm-ops" onClick={() => onAcknowledge(inc.incidentId)}>
                      Acknowledge
                    </button>
                  )}
                  {inc.status !== 'RESOLVED' && inc.status !== 'CLOSED' && inc.status !== 'TRIGGERED' && (
                    <button
                      className="btn-ops btn-sm-ops"
                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      onClick={() => onResolve(inc.incidentId)}
                    >
                      Resolve
                    </button>
                  )}
                  {inc.status === 'RESOLVED' && (
                    <span style={{ fontSize: '11px', color: 'var(--emerald-green)' }}>Postmortem Closed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
