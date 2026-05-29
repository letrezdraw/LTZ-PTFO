import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { socialLinks } from '../data/socialLinks';

gsap.registerPlugin(ScrollTrigger);

export const Network = () => {
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

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="network"
      ref={rootRef}
      style={{
        position: 'relative',
        zIndex: 100,
        padding: '72px 48px 96px',
        minHeight: '70vh',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)'
      }}
    >
      <div className="hub-inner">
      <div
        className="section-stamp net-reveal"
        style={{
          fontSize: '22px',
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '12px',
          opacity: 0,
          transform: 'translateY(16px)'
        }}
      >
        // <span style={{ color: 'var(--accent-red)' }}>NETWORK_RELAY</span> ◈ ALL_SOCIAL_LINKS ◈{' '}
        <span style={{ color: 'var(--text-secondary)' }}>PUBLIC_CHANNELS</span>
      </div>
      <p
        className="net-reveal net-lead"
        style={{
          fontSize: '22px',
          color: 'var(--text-secondary)',
          maxWidth: '560px',
          lineHeight: '1.7',
          marginBottom: '36px',
          opacity: 0,
          transform: 'translateY(16px)'
        }}
      >
        Outbound nodes for updates, process clips, and commission queue. Replace placeholder URLs in{' '}
        <code style={{ color: 'var(--accent-red)' }}>src/data/socialLinks.js</code>.
      </p>

      <div
        className="network-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}
      >
        {socialLinks.map((s) => (
          <div
            key={s.id}
            className="net-reveal"
            style={{
              opacity: 0,
              transform: 'translateY(18px)'
            }}
          >
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="network-card interactive"
            >
            <div style={{ fontSize: '22px', color: 'var(--accent-red)', letterSpacing: '2px', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontSize: '22px', color: 'var(--text-primary)', fontFamily: "'Cinzel', serif" }}>{s.handle}</div>
            <div style={{ fontSize: '22px', color: 'var(--text-muted)', marginTop: '12px' }}>[ OPEN CHANNEL → ]</div>
            </a>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};
