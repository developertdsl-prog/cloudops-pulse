import React from 'react';

export default function TelemetryStreamChart() {
  const bars = [42, 48, 55, 62, 70, 85, 92, 110, 140, 220, 310, 280, 180, 140, 125, 115, 108, 98, 92, 85];

  return (
    <div className="telemetry-card" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700 }}>Real-Time Cluster Latency Distribution (Last 20 Minutes)</h3>
        <span style={{ fontSize: '12px', color: 'var(--cyan-bright)', fontFamily: 'var(--font-mono)' }}>LIVE METRICS</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '90px', padding: '10px 0' }}>
        {bars.map((val, idx) => {
          const heightPct = Math.min(100, (val / 320) * 100);
          const isSpike = val > 200;
          return (
            <div
              key={idx}
              style={{
                flex: 1,
                height: `${heightPct}%`,
                background: isSpike ? 'linear-gradient(to top, #f43f5e, #fb7185)' : 'linear-gradient(to top, #06b6d4, #3b82f6)',
                borderRadius: '3px'
              }}
              title={`${val} ms`}
            />
          );
        })}
      </div>
    </div>
  );
}
