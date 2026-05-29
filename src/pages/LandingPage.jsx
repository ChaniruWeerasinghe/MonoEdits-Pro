import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import { FEATURES } from '../utils/constants';



const STEPS = {
  signatures: [
    {
      num: '01',
      title: 'Upload Your PDF',
      desc: 'Drag and drop or click to browse. Your file stays entirely on your device.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Sign & Place',
      desc: 'Draw or upload your signature, then drag and resize it perfectly into position.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Download Instantly',
      desc: 'Your signed PDF is ready in seconds. No email, no account, no waiting.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
    },
  ],
  merge: [
    { num: '01', title: 'Select PDFs', desc: 'Choose two or more PDF files from your device to merge.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg> },
    { num: '02', title: 'Reorder Pages', desc: 'Drag and drop to arrange the files in the exact order you want.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg> },
    { num: '03', title: 'Combine & Save', desc: 'Merge them instantly into a single document, ready to share.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg> },
  ],
  compress: [
    { num: '01', title: 'Upload Large PDF', desc: 'Select a bulky PDF file that needs its file size reduced.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg> },
    { num: '02', title: 'Optimize Content', desc: 'Our engine compresses images and removes redundant data.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="10" y1="14" x2="21" y2="3" /><line x1="3" y1="21" x2="14" y2="10" /></svg> },
    { num: '03', title: 'Get Smaller File', desc: 'Download your optimized, much smaller PDF file immediately.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg> },
  ],
  forms: [
    { num: '01', title: 'Open Form', desc: 'Load any interactive PDF form or standard document.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg> },
    { num: '02', title: 'Fill Fields', desc: 'Type directly into form fields or add custom text anywhere.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg> },
    { num: '03', title: 'Save & Lock', desc: 'Download the completed form, locking your inputs securely.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg> },
  ],
  watermark: [
    { num: '01', title: 'Upload File', desc: 'Select the PDF document you want to protect or brand.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg> },
    { num: '02', title: 'Design Watermark', desc: 'Add text or an image, then set opacity, angle, and position.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" /></svg> },
    { num: '03', title: 'Apply to All', desc: 'Stamp the watermark across all pages and save the result.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg> },
  ],
};

const STEP_TITLES = {
  signatures: { title: 'Three steps to a signed PDF', desc: 'No learning curve. No clutter. Just open and go.' },
  merge: { title: 'Combine files instantly', desc: 'Bring your documents together in perfect order.' },
  compress: { title: 'Shrink files, keep quality', desc: 'Reduce PDF sizes without losing clarity.' },
  forms: { title: 'Fill forms effortlessly', desc: 'Type directly into fields and lock them down.' },
  watermark: { title: 'Stamp your brand', desc: 'Apply text or image watermarks in seconds.' },
};

const BENEFITS = [
  {
    title: '100% Private',
    desc: 'Your files are processed entirely in your browser. Nothing is ever uploaded to a server.',
    color: '#0d9488',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'Blazing Fast',
    desc: 'No round-trips to a server. Operations complete instantly, regardless of file size.',
    color: '#0ea5e9',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: 'No Account Needed',
    desc: 'Open the page and start working. Zero sign-up, zero tracking, zero friction.',
    color: '#8b5cf6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <line x1="18" y1="8" x2="23" y2="13" /><line x1="23" y1="8" x2="18" y2="13" />
      </svg>
    ),
  },
  {
    title: 'Always Free',
    desc: 'All core tools are and will remain free. No freemium traps or hidden charges.',
    color: '#f59e0b',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

function Logo({ size = 'md' }) {
  const s = size === 'sm' ? { box: 26, fs: '0.9rem' } : { box: 36, fs: '1.15rem' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img
        src="/src/assets/favicon.png"
        alt="MonoEdits logo"
        style={{ width: s.box, height: s.box, objectFit: 'contain', filter: 'invert(1) brightness(2) sepia(1) hue-rotate(130deg) saturate(4)', flexShrink: 0 }}
      />
      <div>
        <span className="gradient-text" style={{ fontSize: s.fs, fontWeight: 800, lineHeight: 1, display: 'block' }}>MonoEdits</span>
        {size !== 'sm' && <span style={{ fontSize: '0.6rem', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>PDF TOOLKIT</span>}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signatures');

  const handleNav = (id) => {
    navigate(`/${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Notification />

      {/* ── Header ── */}
      <Header />

      {/* ── Hero ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 'clamp(140px, 18vh, 180px)', paddingBottom: 'clamp(60px, 10vh, 120px)' }}>
        <div className="site-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,100px)', alignItems: 'center', width: '100%' }}>

          {/* LEFT */}
          <div className="animate-fadeup" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="section-label">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="#0d9488"><circle cx="5" cy="5" r="5" /></svg>
              The PDF Toolkit
            </div>

            <div>
              <h1 style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', fontWeight: 800, lineHeight: 1.12, color: '#f1f5f9', margin: 0 }}>
                Edit, Sign &amp; Transform PDFs{' '}
                <span className="gradient-text">entirely in your browser.</span>
              </h1>
              <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.75, margin: '20px 0 0', maxWidth: 460 }}>
                A growing suite of privacy-first PDF tools. No uploads. No accounts. No servers.
                Everything runs locally — your files never leave your device.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <button
                id="hero-cta-btn"
                className="btn-primary"
                onClick={() => handleNav('signatures')}
                style={{ fontSize: '0.95rem', padding: '14px 32px' }}
              >
                Start for Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                100% local &bull; No sign-up &bull; Always free
              </span>
            </div>
          </div>

          {/* RIGHT — Feature links */}
          <div id="tools" className="animate-fadeup" style={{ display: 'flex', flexDirection: 'column', gap: 10, animationDelay: '0.1s' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
              Available Tools
            </p>
            {FEATURES.map((f) => (
              <div
                key={f.id}
                id={`feature-link-${f.id}`}
                className={`feature-row ${f.active ? 'active' : 'coming'}`}
                onClick={f.active ? () => handleNav(f.id) : undefined}
                role={f.active ? 'button' : 'presentation'}
                tabIndex={f.active ? 0 : -1}
                onKeyDown={f.active ? (e) => e.key === 'Enter' && handleNav(f.id) : undefined}
                aria-label={f.active ? `Open ${f.name}` : `${f.name} — coming soon`}
              >
                <div className="feature-icon-wrap">{f.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: f.active ? '#e2e8f0' : '#94a3b8', margin: 0, lineHeight: 1.2 }}>{f.name}</p>
                  <p style={{ fontSize: '0.73rem', color: '#94a3b8', margin: '3px 0 0', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.desc}</p>
                </div>
                {!f.active && <span className="coming-soon-badge">Soon</span>}
                <div className="feature-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" style={{ padding: 'clamp(70px, 10vh, 120px) 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="site-container">
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>How It Works</div>
          </div>

          {/* ── Tabs ── */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
            {FEATURES.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveTab(f.id)}
                style={{
                  background: activeTab === f.id ? 'rgba(13,148,136,0.1)' : 'transparent',
                  border: `1px solid ${activeTab === f.id ? 'rgba(13,148,136,0.3)' : 'transparent'}`,
                  color: activeTab === f.id ? '#2dd4bf' : '#94a3b8',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 6,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {f.name}
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="animate-fadeup" key={activeTab} style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
              {STEP_TITLES[activeTab].title}
            </h2>
            <p className="animate-fadeup" key={`${activeTab}-desc`} style={{ color: '#94a3b8', marginTop: 10, fontSize: '0.9rem', animationDelay: '0.1s' }}>
              {STEP_TITLES[activeTab].desc}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'clamp(16px,3vw,40px)', flexWrap: 'wrap' }}>
            {STEPS[activeTab].map((s, i) => (
              <div key={s.num} className="how-step animate-fadeup" style={{ minWidth: 200, animationDelay: `${i * 0.1}s` }}>
                {i < STEPS[activeTab].length - 1 && <div className="how-connector" />}
                <div style={{
                  width: 64, height: 64, borderRadius: 18,
                  background: 'rgba(13,148,136,0.08)',
                  border: '1px solid rgba(13,148,136,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {s.icon}
                </div>
                <div className="how-step-num">{s.num}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: '#e2e8f0', margin: '0 0 8px' }}>{s.title}</p>
                  <p style={{ fontSize: '0.83rem', color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why MonoEdits ── */}
      <section id="why-monoedits" style={{ padding: 'clamp(70px, 10vh, 120px) 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="site-container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Why MonoEdits</div>
            <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
              Built around your privacy
            </h2>
            <p style={{ color: '#94a3b8', marginTop: 10, fontSize: '0.9rem', maxWidth: 500, margin: '10px auto 0' }}>
              Most online PDF tools upload your files to remote servers. MonoEdits never does.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {BENEFITS.map((b) => (
              <div key={b.title} className="benefit-card">
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${b.color}18`,
                  border: `1px solid ${b.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: b.color, marginBottom: 18,
                }}>
                  {b.icon}
                </div>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: '#e2e8f0', margin: '0 0 8px' }}>{b.title}</p>
                <p style={{ fontSize: '0.83rem', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: 'clamp(60px, 8vh, 100px) 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="site-container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(13,148,136,0.12), rgba(13,148,136,0.04))',
            border: '1px solid rgba(13,148,136,0.2)',
            borderRadius: 24, padding: 'clamp(32px,5vw,56px)',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24,
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.3rem,2.5vw,1.9rem)', fontWeight: 800, color: '#f1f5f9', margin: '0 0 8px' }}>
                Ready to enhance your PDFs?
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                Choose from our growing suite of privacy-first, local PDF tools.
              </p>
            </div>
            <button
              id="cta-banner-btn"
              className="btn-primary"
              onClick={() => handleNav('signatures')}
              style={{ fontSize: '0.95rem', padding: '14px 32px', flexShrink: 0 }}
            >
              Get Started Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
