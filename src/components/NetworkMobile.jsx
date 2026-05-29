import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BorderGlow from './BorderGlow';
import { socialLinks } from '../data/socialLinks';

gsap.registerPlugin(ScrollTrigger);

export const NetworkMobile = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      root.querySelectorAll('.net-reveal').forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true
          },
          delay: i * 0.05
        });
      });
    }, root);

    // Refresh ScrollTrigger on various scroll events
    const refreshTriggers = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('scroll', refreshTriggers, { passive: true });
    window.addEventListener('touchmove', refreshTriggers, { passive: true });
    window.addEventListener('wheel', refreshTriggers, { passive: true });

    return () => {
      window.removeEventListener('scroll', refreshTriggers);
      window.removeEventListener('touchmove', refreshTriggers);
      window.removeEventListener('wheel', refreshTriggers);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="network"
      ref={rootRef}
      style={{
        position: 'relative',
        zIndex: 100,
        padding: '32px 16px',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)'
      }}
    >
      <div
        className="section-stamp net-reveal"
        style={{
          fontSize: '15px',
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginBottom: '16px',
          opacity: 0,
          transform: 'translateY(16px)'
        }}
      >
        // <span style={{ color: 'var(--accent-red)' }}>NETWORK_RELAY</span> ◈{' '}
        <span style={{ color: 'var(--text-secondary)' }}>PUBLIC</span>
      </div>

      <p
        className="net-reveal net-lead"
        style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          marginBottom: '20px',
          opacity: 0,
          transform: 'translateY(16px)',
          letterSpacing: '0.3px'
        }}
      >
        Connect via social channels for updates, process shots, and commission info.
      </p>

      <div
        className="network-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}
      >
        {socialLinks.map((s) => (
          <BorderGlow
            key={s.id}
            className="net-reveal"
            glowColor="204 0 0"
            borderRadius={4}
            glowRadius={15}
            glowIntensity={0.65}
            colors={['#cc0000', '#ff4444', '#ff9999']}
            fillOpacity={0.2}
            edgeSensitivity={45}
            style={{
              opacity: 0,
              transform: 'translateY(16px)'
            }}
          >
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="network-card interactive"
              style={{
                display: 'block',
                padding: '12px 14px',
                background: 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.querySelector('.net-label').style.color = 'var(--accent-red)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.querySelector('.net-label').style.color = 'var(--text-secondary)';
              }}
            >
              <div className="net-label" style={{ fontSize: '22px', color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '6px', transition: 'color 0.2s' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '22px', color: 'var(--text-primary)', fontFamily: "'Cinzel', serif", fontWeight: 500 }}>
                {s.handle}
              </div>
              <div style={{ fontSize: '22px', color: 'var(--text-muted)', marginTop: '8px' }}>
                [ OPEN → ]
              </div>
            </a>
          </BorderGlow>
        ))}
      </div>
    </section>
  );
};
