import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const BootSequence = ({ onBootComplete }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const bootLines = [
      { text: 'INITIALIZING ARCHIVE SYSTEM...', delay: 0 },
      { text: 'CLEARANCE LEVEL: UNRESTRICTED', delay: 0.6 },
      { text: 'ACCESSING FILE: LETREZDRAW_ART_VAULT', delay: 1.2 },
      { text: 'ENCRYPTION: BYPASSED', delay: 1.8 },
      { text: 'STATUS: [████████████] 100% LOADED', delay: 2.2 },
      { text: 'WARNING: CLASSIFIED CONTENT AHEAD', delay: 2.8, isRed: true },
      { text: 'PRESS ANY KEY TO DECLASSIFY...', delay: 3.2, isBlinking: true }
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

    // After boot sequence, auto-complete (no clicking to skip)
    timeline.set({}, {}, '+=1.5');

    // Complete boot after timeline finishes
    timeline.eventCallback('onComplete', () => {
      // Fade out the boot overlay
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          onBootComplete();
        }
      });
    });

    return () => {
      timeline.kill();
    };
  }, [onBootComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999999,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '16px',
          lineHeight: '2',
          color: 'var(--text-primary)',
          textAlign: 'left',
          paddingLeft: '48px',
          paddingRight: '48px'
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            id={`boot-line-${idx}`}
            style={{
              minHeight: '32px',
              color: idx === 5 ? 'var(--accent-red)' : 'var(--text-primary)',
              animation: idx === 6 ? 'blink-cursor 0.8s infinite' : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
};
