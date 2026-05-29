import { useState, useEffect } from 'react';

export const Sidebar = () => {
  const [blinkState, setBlinkState] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkState((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="desktop-only" style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: '56px',
      height: '100vh',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '32px 0',
      zIndex: 980,
    }}>
      <div style={{
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        fontSize: '15px',
        color: 'var(--accent-red)',
        letterSpacing: '2px',
        transform: 'rotate(180deg) translateY(60px)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        LETREZDRAW
      </div>

      <div style={{
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        fontSize: '15px',
        color: 'var(--text-secondary)',
        letterSpacing: '2px',
        transform: 'rotate(180deg)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: blinkState ? 'var(--accent-red)' : 'transparent',
          transition: 'all 0.3s ease'
        }} />
        CLASSIFIED
      </div>
    </aside>
  );
};
