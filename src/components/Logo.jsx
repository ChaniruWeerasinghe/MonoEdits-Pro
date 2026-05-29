import React from 'react';

export default function Logo({ size = 'md' }) {
  const s = size === 'sm' ? { box: 26, fs: '0.9rem' } : { box: 36, fs: '1.15rem' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img
        src="/favicon.png"
        alt="MonoEdits logo"
        style={{ width: s.box, height: s.box, objectFit: 'contain', flexShrink: 0 }}
      />
      <div>
        <span className="gradient-text" style={{ fontSize: s.fs, fontWeight: 800, lineHeight: 1, display: 'block' }}>MonoEdits</span>
        {size !== 'sm' && <span style={{ fontSize: '0.6rem', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>PDF TOOLKIT</span>}
      </div>
    </div>
  );
}
