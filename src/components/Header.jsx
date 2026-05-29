import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNav = (action) => {
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

        <nav className="header-nav">
          <a href="/#tools" className="header-link" onClick={(e) => { e.preventDefault(); handleNav('tools'); }}>Tools</a>
          <a href="/#how-it-works" className="header-link" onClick={(e) => { e.preventDefault(); handleNav('how-it-works'); }}>How it Works</a>
          <a href="/#why-monoedits" className="header-link" onClick={(e) => { e.preventDefault(); handleNav('why-monoedits'); }}>Benefits</a>
        </nav>

        <button className="menu-toggle" aria-label="Open Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>
  );
}
