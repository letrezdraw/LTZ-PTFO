import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BorderGlow from './BorderGlow';
import { publicAsset } from '../utils/publicAsset';

gsap.registerPlugin(ScrollTrigger);

export const AboutMobile = () => {
  const containerRef = useRef(null);
  const [recActive, setRecActive] = useState(true);

  // Pulsing recording indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setRecActive((prev) => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // Initialize scroll animations
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      root.querySelectorAll('.about-reveal').forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true
          },
          delay: i * 0.06
        });
      });
    }, root);

    // Refresh ScrollTrigger on various scroll events (mouse, touch, scrollbar)
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
      id="about"
      ref={containerRef}
      style={{
        position: 'relative',
        zIndex: 100,
        padding: '32px 16px',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)'
      }}
    >
      <div
        className="section-stamp about-reveal"
        style={{
          fontSize: '22px',
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '24px',
          opacity: 0,
          transform: 'translateY(16px)'
        }}
      >
        // <span style={{ color: 'var(--accent-red)' }}>SUBJECT</span> ◈ LTZ-ARCHIVE ◈{' '}
        <span style={{ color: 'var(--accent-red)' }}>VERIFIED</span>
      </div>

      <div className="about-reveal" style={{ opacity: 0, transform: 'translateY(16px)' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          {/* Profile Photo */}
          <div
            className="about-reveal"
            style={{
              opacity: 0,
              transform: 'translateY(16px)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              background: 'var(--bg-card)'
            }}
          >
            <div style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden' }}>
              <img
                src={publicAsset('artwork/profile.jpg')}
                alt="Profile"
                loading="lazy"
                decoding="async"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
              {/* REC indicator */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  padding: '6px 10px',
                  border: '1px solid var(--accent-red)',
                  fontSize: '22px',
                  color: 'var(--accent-red)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 600
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: recActive ? 'var(--accent-red)' : 'rgba(204, 0, 0, 0.35)',
                    animation: recActive ? 'pulse-blink 1s infinite' : 'none'
                  }}
                />
                REC
              </div>
              {/* FACE_ID badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  padding: '6px 10px',
                  border: '1px solid var(--accent-red)',
                  fontSize: '15px',
                  color: 'var(--accent-red)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: 600
                }}
              >
                FACE_ID · OK
              </div>
            </div>
          </div>

          {/* Profile Info Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}
          >
            <BorderGlow className="about-reveal" glowColor="204 0 0" borderRadius={4} glowRadius={15} glowIntensity={0.6} colors={['#cc0000', '#ff4444', '#ff8888']} fillOpacity={0.2} edgeSensitivity={40} style={{ opacity: 0, transform: 'translateY(16px)' }}>
              <div style={{ padding: '12px' }}>
                <dt style={{ fontSize: '22px', color: 'var(--accent-red)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>CODENAME</dt>
                <dd style={{ fontSize: '22px', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>LETREZDRAW</dd>
              </div>
            </BorderGlow>
            <BorderGlow className="about-reveal" glowColor="204 0 0" borderRadius={4} glowRadius={15} glowIntensity={0.6} colors={['#cc0000', '#ff4444', '#ff8888']} fillOpacity={0.2} edgeSensitivity={40} style={{ opacity: 0, transform: 'translateY(16px)' }}>
              <div style={{ padding: '12px' }}>
                <dt style={{ fontSize: '22px', color: 'var(--accent-red)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>CLASS</dt>
                <dd style={{ fontSize: '22px', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>ILLUSTRATOR</dd>
              </div>
            </BorderGlow>
            <BorderGlow className="about-reveal" glowColor="204 0 0" borderRadius={4} glowRadius={15} glowIntensity={0.6} colors={['#cc0000', '#ff4444', '#ff8888']} fillOpacity={0.2} edgeSensitivity={40} style={{ opacity: 0, transform: 'translateY(16px)' }}>
              <div style={{ padding: '12px' }}>
                <dt style={{ fontSize: '22px', color: 'var(--accent-red)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>STATUS</dt>
                <dd style={{ fontSize: '22px', color: 'var(--accent-red)', margin: 0, fontWeight: 600 }}>OPEN</dd>
              </div>
            </BorderGlow>
            <BorderGlow className="about-reveal" glowColor="204 0 0" borderRadius={4} glowRadius={15} glowIntensity={0.6} colors={['#cc0000', '#ff4444', '#ff8888']} fillOpacity={0.2} edgeSensitivity={40} style={{ opacity: 0, transform: 'translateY(16px)' }}>
              <div style={{ padding: '12px' }}>
                <dt style={{ fontSize: '22px', color: 'var(--accent-red)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>REMOTE</dt>
                <dd style={{ fontSize: '22px', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>ENABLED</dd>
              </div>
            </BorderGlow>
          </div>
          {/* Profile Summary */}
          <div
            style={{
              border: '1px solid var(--border-color)',
              padding: '16px',
              background: 'var(--bg-card)'
            }}
          >
            <h3
              style={{
                fontSize: '15px',
                color: 'var(--accent-red)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                margin: '0 0 12px 0',
                fontWeight: 600
              }}
            >
              // CLASSIFIED_PROFILE
            </h3>
            <p
              style={{
                fontSize: '22px',
                color: 'var(--text-secondary)',
                lineHeight: '1.8',
                margin: 0,
                letterSpacing: '0.3px'
              }}
            >
              Digital artist with 7+ years of experience creating character designs, concept art, and detailed illustrations. Specialized in stylized and semi-realistic digital painting.
            </p>
          </div>

          {/* Specialties */}
          <div
            style={{
              border: '1px solid var(--border-color)',
              padding: '16px',
              background: 'var(--bg-card)'
            }}
          >
            <h3
              style={{
                fontSize: '15px',
                color: 'var(--accent-red)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                margin: '0 0 12px 0',
                fontWeight: 600
              }}
            >
              // EXPERTISE · DOMAINS
            </h3>
            <ul
              style={{
                fontSize: '22px',
                color: 'var(--text-secondary)',
                lineHeight: '1.8',
                margin: 0,
                paddingLeft: '0',
                listStyle: 'none',
                letterSpacing: '0.3px'
              }}
            >
              <li>▸ Character Design & Illustration</li>
              <li>▸ Environment & Concept Art</li>
              <li>▸ Digital Painting</li>
              <li>▸ Custom Commissions</li>
            </ul>
          </div>

          {/* Software & Tools */}
          <div
            style={{
              border: '1px solid var(--border-color)',
              padding: '16px',
              background: 'var(--bg-card)'
            }}
          >
            <h3
              style={{
                fontSize: '15px',
                color: 'var(--accent-red)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                margin: '0 0 12px 0',
                fontWeight: 600
              }}
            >
              // TOOLKIT · APPROVED
            </h3>
            <div
              style={{
                fontSize: '22px',
                color: 'var(--text-secondary)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                letterSpacing: '0.3px'
              }}
            >
              {['Procreate', 'Photoshop', 'Clip Studio', 'Blender'].map((tool) => (
                <span
                  key={tool}
                  style={{
                    padding: '6px 10px',
                    border: '1px solid var(--border-color)',
                    fontSize: '22px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}
          >
            <div
              style={{
                border: '1px solid var(--border-color)',
                padding: '12px',
                background: 'var(--bg-card)',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  fontSize: '22px',
                  color: 'var(--accent-red)',
                  fontWeight: 600,
                  marginBottom: '4px'
                }}
              >
                7+
              </div>
              <div
                style={{
                  fontSize: '22px',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Years
              </div>
            </div>
            <div
              style={{
                border: '1px solid var(--border-color)',
                padding: '12px',
                background: 'var(--bg-card)',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  fontSize: '22px',
                  color: 'var(--accent-red)',
                  fontWeight: 600,
                  marginBottom: '4px'
                }}
              >
                100+
              </div>
              <div
                style={{
                  fontSize: '22px',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Commissions
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
