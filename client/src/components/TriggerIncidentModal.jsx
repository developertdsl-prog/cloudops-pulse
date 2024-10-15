import React, { useState } from 'react';

export default function TriggerIncidentModal({ isOpen, onClose, onTrigger, services }) {
  const [formData, setFormData] = useState({
    serviceId: 'svc-payment-core',
    title: 'Upstream Database Connection Saturation',
    severity: 'P1_CRITICAL',
    rootCauseNotes: 'Investigating high replication lag on database secondary nodes.'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onTrigger(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Declare Production Incident</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Target Microservice</label>
            <select
              style={{ width: '100%', padding: '8px', background: '#080b11', border: '1px solid var(--border-line)', color: '#fff', borderRadius: '6px' }}
              value={formData.serviceId}
              onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
            >
              {services.map(s => (
                <option key={s.serviceId} value={s.serviceId}>{s.name} ({s.serviceId})</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Severity Level</label>
            <select
              style={{ width: '100%', padding: '8px', background: '#080b11', border: '1px solid var(--border-line)', color: '#fff', borderRadius: '6px' }}
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
            >
              <option value="P1_CRITICAL">P1 - Critical Outage / Data Degradation</option>
              <option value="P2_HIGH">P2 - Elevated Latency / Impaired Capability</option>
              <option value="P3_MEDIUM">P3 - Non-Critical Degradation</option>
            </select>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Incident Summary</label>
            <input
              type="text"
              required
              style={{ width: '100%', padding: '8px', background: '#080b11', border: '1px solid var(--border-line)', color: '#fff', borderRadius: '6px' }}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="tab-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-ops">Escalate Incident</button>
          </div>
        </form>
      </div>
    </div>
  );
}
