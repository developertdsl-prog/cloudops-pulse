import React from 'react';

export default function SloErrorBudgetCard({ sloData }) {
  return (
    <div className="telemetry-card">
      <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>
        Service Level Objective (SLO) Compliance & Error Budgets
      </h3>
      <div className="table-wrapper">
        <table className="sre-table">
          <thead>
            <tr>
              <th>Microservice</th>
              <th>SLO Target</th>
              <th>Current SLI</th>
              <th>Remaining Budget</th>
              <th>Burn Rate</th>
              <th>Compliance</th>
            </tr>
          </thead>
          <tbody>
            {sloData.map((s) => (
              <tr key={s.serviceId}>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td className="mono">{s.targetSloPercent}%</td>
                <td className="mono" style={{ color: s.isCompliant ? '#10b981' : '#f43f5e' }}>{s.sliPercent}%</td>
                <td className="mono" style={{ color: s.remainingErrorBudgetPercent > 20 ? '#06b6d4' : '#f43f5e' }}>
                  {s.remainingErrorBudgetPercent}%
                </td>
                <td className="mono">{s.burnRate}x</td>
                <td>
                  <span className={`sev-badge ${s.isCompliant ? 'sev-p3' : 'sev-p1'}`}>
                    {s.isCompliant ? 'COMPLIANT' : 'BUDGET_EXHAUSTED'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
