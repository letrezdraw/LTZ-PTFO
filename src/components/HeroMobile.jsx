import { useState, useEffect } from 'react';
import gsap from 'gsap';

export const HeroMobile = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const [glitchOffset] = useState(() => Math.random() * 4 - 2);

  // Disable scrolling during boot sequence
  useEffect(() => {
    if (bootComplete) {
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [bootComplete]);

  // Boot sequence animation - shorter for mobile
  useEffect(() => {
    if (bootComplete) return;

    const bootLines = [
      { text: 'INITIALIZING...', delay: 0 },
      { text: 'CLEARANCE: UNRESTRICTED', delay: 0.3 },
      { text: 'STATUS: [██████████] LOADED', delay: 0.6 },
      { text: 'PRESS TO CONTINUE...', delay: 0.9, isBlinking: true }
    ];

    const timeline = gsap.timeline();

    bootLines.forEach((line, idx) => {
      const elementId = `boot-line-${idx}`;
      timeline.to(
        `#${elementId}`,
        {
          duration: line.text.length * 0.02,
          onStart: () => {
            const el = document.getElementById(elementId);
            if (el) {
              let displayText = '';
              const chars = line.text.split('');
              let charIdx = 0;

              const typeInterval = setInterval(() => {
                if (charIdx < chars.length) {
                  displayText += chars[charIdx];
                  el.textContent = displayText;
                  charIdx++;
                } else {
                  clearInterval(typeInterval);
                }
              }, 20);
            }
          }
        },
        line.delay
      );
    });

    timeline.set({}, {}, '+=0.5');

    // Listen for key press or click to skip boot
    const handleKeyPress = () => {
      timeline.progress(1);
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleKeyPress);
      document.removeEventListener('touchstart', handleKeyPress);
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handleKeyPress);
    document.addEventListener('touchstart', handleKeyPress);

    // Complete boot after timeline finishes
    timeline.eventCallback('onComplete', () => {
      setBootComplete(true);
    });

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleKeyPress);
      document.removeEventListener('touchstart', handleKeyPress);
    };
  }, [bootComplete]);

  // Glitch effect on main title
  useEffect(() => {
    if (!bootComplete) return;

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setShowGlitch(true);
        setTimeout(() => setShowGlitch(false), 120);
      }
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(glitchInterval);
  }, [bootComplete]);

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--bg-primary)',
        padding: '48px 20px 20px',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '48px'
      }}
    >
      {/* Boot Sequence */}
      {!bootComplete && (
        <div
          style={{
            width: '100%',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '15px',
            lineHeight: '2.5',
            color: 'var(--text-primary)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            textAlign: 'center'
          }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} id={`boot-line-${i}`} style={{ minHeight: '24px' }} />
          ))}
        </div>
      )}

      {/* Hero Content */}
      {bootComplete && (
        <div style={{ textAlign: 'center', zIndex: 10, animation: 'fadeIn 0.6s ease-out' }}>
          <div
            style={{
              fontSize: '34px',
              fontWeight: 700,
              color: 'var(--accent-red)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '12px',
              lineHeight: 1.1,
              position: 'relative',
              textShadow: showGlitch ? '2px 2px var(--accent-red), -2px -2px var(--bg-primary)' : 'none',
              transform: showGlitch ? 'skewX(-5deg)' : 'skewX(0deg)',
              transition: 'none',
              fontFamily: "'Courier New', monospace"
            }}
          >
            {showGlitch && (
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: glitchOffset + 'px',
                  color: 'var(--bg-secondary)',
                  opacity: 0.7,
                  zIndex: -1
                }}
              >
                LETREZDRAW
              </div>
            )}
            LETREZDRAW
          </div>
          <div
            style={{
              fontSize: '22px',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginBottom: '20px',
              animation: 'fadeIn 0.8s ease-out 0.2s both'
            }}
          >
            CONCEPT ART & ILLUSTRATION
          </div>
          <p
            style={{
              fontSize: '22px',
              color: 'var(--text-secondary)',
              maxWidth: '280px',
              lineHeight: '1.8',
              margin: '0 auto 24px',
              letterSpacing: '0.5px',
              animation: 'fadeIn 0.8s ease-out 0.3s both'
            }}
          >
            Digital artist specializing in character design, environment art, and detailed illustration. Commissions open.
          </p>

          <button
            type="button"
            onClick={() => {
              const elem = document.getElementById('gallery');
              elem?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              padding: '10px 20px',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--bg-primary)',
              background: 'var(--accent-red)',
              border: '1px solid var(--accent-red)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              animation: 'fadeIn 0.8s ease-out 0.4s both'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--accent-red)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--accent-red)';
              e.target.style.color = 'var(--bg-primary)';
            }}
          >
            VIEW GALLERY
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};
