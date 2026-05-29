import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { SOCIAL_LINKS, FEATURES } from '../utils/constants';

export default function Footer() {
  const navigate = useNavigate();

  const handleNav = (id) => {
    if (id === 'signatures') {
      navigate('/signatures');
      window.scrollTo(0, 0);
    } else {
      // For future tools
      navigate('/');
      setTimeout(() => { window.location.hash = id; }, 100);
    }
  };

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 'clamp(60px, 8vh, 100px)', paddingBottom: '40px' }}>
      <div className="site-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 14, minWidth: 200 }}>
            <Logo size="sm" />
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.7, maxWidth: 260, margin: 0 }}>
              A privacy-first PDF toolkit that runs entirely in your browser. No servers. No accounts. No compromise.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {SOCIAL_LINKS.map((s) => (
                s.dropdown ? (
                  <div key={s.label} className="social-link" aria-label={s.label} tabIndex={0} style={{ position: 'relative' }}>
                    {s.icon}
                    <div className="social-dropdown">
                      {s.dropdown.map(d => (
                        <a key={d.label} href={d.href} target="_blank" rel="noopener noreferrer">
                          {d.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={s.label}>
                    {s.icon}
                  </a>
                )
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>Navigation</p>
            {FEATURES.map((f) => (
              <span
                key={f.id}
                onClick={f.active ? () => handleNav(f.id) : undefined}
                style={{ fontSize: '0.82rem', color: f.active ? '#e2e8f0' : '#475569', cursor: f.active ? 'pointer' : 'default', transition: 'color 0.2s' }}
                onMouseEnter={(e) => f.active && (e.target.style.color = '#5eead4')}
                onMouseLeave={(e) => f.active && (e.target.style.color = '#e2e8f0')}
              >
                {f.name}{!f.active && ' (Soon)'}
              </span>
            ))}
          </div>

          {/* Build Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>Build Stack</p>
            {['React 18', 'Vite', 'Tailwind CSS', 'pdf-lib', 'PDF.js', 'react-rnd'].map((t) => (
              <span key={t} style={{ fontSize: '0.82rem', color: '#64748b' }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
            Developed by Chaniru Weerasinghe
          </p>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
            MonoEdits &copy; {new Date().getFullYear()} &mdash; All processing is 100% local.
          </p>
        </div>
      </div>
    </footer>
  );
}
