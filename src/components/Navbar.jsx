import { useState, useEffect } from 'react';
import { scrollToSection } from '../utils/scrollToSection';
import { useRenderTheme } from '../context/RenderThemeContext';

export const Navbar = ({ scrolled }) => {
  const [time, setTime] = useState(new Date());
  const [blinkState, setBlinkState] = useState(true);
  const { cycleTheme, displayStyle } = useRenderTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkState((prev) => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  return (
    <nav
      className="top-nav"
      style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      minHeight: '56px',
      height: 'auto',
      paddingTop: '12px',
      paddingBottom: '12px',
      background: 'linear-gradient(90deg, rgba(5, 5, 5, 0.98) 0%, rgba(10, 10, 10, 0.95) 50%, rgba(5, 5, 5, 0.98) 100%)',
      backdropFilter: 'blur(12px)',
      borderBottom: scrolled 
        ? '1px solid rgba(212, 0, 0, 0.5)' 
        : '1px solid var(--border-color)',
      boxShadow: scrolled 
        ? '0 2px 16px rgba(212, 0, 0, 0.1)' 
        : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      rowGap: '12px',
      paddingLeft: '32px',
      paddingRight: '32px',
      zIndex: 1100,
      transition: 'all 0.3s ease'
    }}>
      {/* Left - Logo/Archive ID */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '22px',
        color: 'var(--text-primary)',
        fontWeight: 'bold',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        fontFamily: "'Share Tech Mono', monospace"
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--accent-red)',
          boxShadow: '0 0 8px var(--accent-red)',
          animation: 'pulse-blink 1.2s infinite'
        }} />
        LTZ
      </div>

      {/* Center - Nav Links */}
      <div style={{
        display: 'flex',
        gap: '32px',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '1 1 auto',
        minWidth: 0
      }}>
        {['FILES', 'PROFILE', 'CLEARANCE', 'NETWORK'].map((link) => (
          <button
            key={link}
            className="red-underline"
            style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              cursor: 'pointer',
              fontFamily: "'Share Tech Mono', monospace",
              background: 'none',
              border: 'none',
              padding: '4px 8px',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onClick={(e) => {
              e.preventDefault();
              const sectionMap = {
                FILES: 'operations',
                PROFILE: 'about',
                CLEARANCE: 'clearance',
                NETWORK: 'network'
              };
              scrollToSection(sectionMap[link]);
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--accent-red)';
              e.target.style.textShadow = '0 0 8px rgba(212, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--text-secondary)';
              e.target.style.textShadow = 'none';
            }}
          >
            [{link}]
          </button>
        ))}
      </div>

      <button
        type="button"
        className="navbar-theme-btn"
        onClick={cycleTheme}
        title="Cycle render theme"
        style={{
          fontSize: '22px',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          cursor: 'pointer',
          fontFamily: "'Share Tech Mono', monospace",
          background: 'none',
          border: '1px solid var(--border-color)',
          padding: '6px 12px',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'var(--accent-red)';
          e.target.style.color = 'var(--accent-red)';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'var(--border-color)';
          e.target.style.color = 'var(--text-secondary)';
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
        S{displayStyle}
      </button>

      {/* Right - Status Indicator and Time */}
      <div style={{
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
        fontSize: '15px',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        flexShrink: 0,
        fontFamily: "'Share Tech Mono', monospace"
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: blinkState ? '#00ff00' : 'rgba(0,255,0,0.2)',
            boxShadow: blinkState ? '0 0 6px #00ff00' : 'none',
            transition: 'all 0.2s ease'
          }} />
          <span style={{ fontSize: '15px', letterSpacing: '2px' }}>OK</span>
        </div>
        <div style={{ 
          fontSize: '22px',
          letterSpacing: '1px',
          opacity: 0.8
        }}>{formatTime(time)}</div>
      </div>
    </nav>
  );
};
