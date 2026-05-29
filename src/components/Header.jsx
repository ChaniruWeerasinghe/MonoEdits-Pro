import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [githubDropdownOpen, setGithubDropdownOpen] = useState(false);
  
  const handleNav = (action) => {
    setIsMobileMenuOpen(false); // Close menu on navigation
    if (action === 'home') {
      navigate('/');
      window.scrollTo(0, 0);
    } else {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => { window.location.hash = action; }, 100);
      } else {
        window.location.hash = action;
      }
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .header-nav { display: none !important; }
          .menu-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .menu-toggle { display: none !important; }
          .header-nav { display: flex !important; }
        }
      `}</style>
      <header style={{
        position: 'absolute', 
        top: 0, left: 0, right: 0, 
        zIndex: 100,
        background: 'transparent',
      }}>
        <div className="site-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 24, paddingBottom: 24 }}>
          <div style={{ cursor: 'pointer' }} onClick={() => handleNav('home')}>
            <Logo />
          </div>

          <nav className="header-nav hidden md:flex gap-8 items-center">
            <a href="/#tools" className="header-link" onClick={(e) => { e.preventDefault(); handleNav('tools'); }}>Tools</a>
            <a href="/#how-it-works" className="header-link" onClick={(e) => { e.preventDefault(); handleNav('how-it-works'); }}>How it Works</a>
            <a href="/#why-monoedits" className="header-link" onClick={(e) => { e.preventDefault(); handleNav('why-monoedits'); }}>Benefits</a>
          </nav>

          <button 
            className="menu-toggle md:hidden flex items-center p-2 text-slate-300 hover:text-white" 
            aria-label="Open Menu"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          opacity: isMobileMenuOpen ? 1 : 0,
          visibility: isMobileMenuOpen ? 'visible' : 'hidden',
          transition: 'all 0.3s ease',
        }}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          width: '280px',
          backgroundColor: '#020617', // Match app background
          borderRight: '1px solid rgba(255,255,255,0.05)',
          zIndex: 1001,
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div onClick={() => handleNav('home')} style={{ cursor: 'pointer' }}>
            <Logo />
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <a href="/#tools" style={{ color: '#e2e8f0', fontSize: '1.1rem', fontWeight: 500, textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); handleNav('tools'); }}>Tools</a>
          <a href="/#how-it-works" style={{ color: '#e2e8f0', fontSize: '1.1rem', fontWeight: 500, textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); handleNav('how-it-works'); }}>How it Works</a>
          <a href="/#why-monoedits" style={{ color: '#e2e8f0', fontSize: '1.1rem', fontWeight: 500, textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); handleNav('why-monoedits'); }}>Benefits</a>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '16px' }}>Developed by Chaniru Weerasinghe</p>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/chaniru-weerasinghe-36aa2a326/" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/chaniruweerasinghe" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            {/* Facebook */}
            <a href="https://web.facebook.com/Chanii2003/" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
            {/* Github with Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                style={{ color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                onClick={() => setGithubDropdownOpen(!githubDropdownOpen)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </button>
              {githubDropdownOpen && (
                <div style={{
                  position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '12px',
                  background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                  padding: '8px 0', minWidth: '200px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}>
                  <a href="https://github.com/ChaniruWeerasinghe" target="_blank" rel="noreferrer" style={{ display: 'block', color: '#e2e8f0', fontSize: '0.85rem', padding: '10px 16px', textDecoration: 'none' }}>@ChaniruWeerasinghe (New)</a>
                  <a href="https://github.com/Chanii2024" target="_blank" rel="noreferrer" style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', padding: '10px 16px', textDecoration: 'none' }}>@Chanii2024 (Legacy)</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
