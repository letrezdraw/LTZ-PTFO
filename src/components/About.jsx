import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { publicAsset } from '../utils/publicAsset';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  const containerRef = useRef(null);
  const [recActive, setRecActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecActive((prev) => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, []);

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

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="about-section"
      style={{
        position: 'relative',
        zIndex: 100,
        padding: '72px 48px 96px',
        minHeight: '100vh',
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
          marginBottom: '28px',
          opacity: 0,
          transform: 'translateY(18px)'
        }}
      >
        // <span style={{ color: 'var(--accent-red)' }}>SUBJECT_PROFILE</span> ◈ LTZ-ARCHIVE ◈{' '}
        <span style={{ color: 'var(--accent-red)' }}>VERIFIED</span>
      </div>

      <div className="about-shell about-reveal" style={{ opacity: 0, transform: 'translateY(20px)' }}>
        <div className="about-shell__grid">
          <aside className="about-identity">
            <div className="about-photo-frame">
              <img
                src={publicAsset('artwork/profile.jpg')}
                alt="Profile"
                loading="lazy"
                decoding="async"
                className="about-photo-frame__img"
              />
              <div className="corner-bracket corner-tl" />
              <div className="corner-bracket corner-tr" />
              <div className="corner-bracket corner-bl" />
              <div className="corner-bracket corner-br" />
              <div className="about-photo-frame__rec">
                <span
                  className="about-photo-frame__dot"
                  style={{
                    background: recActive ? 'var(--accent-red)' : 'rgba(204, 0, 0, 0.35)',
                    animation: recActive ? 'pulse-blink 1s infinite' : 'none'
                  }}
                />
                REC
              </div>
              <div className="about-photo-frame__scan" />
              <div className="about-photo-frame__badge">FACE_ID · OK</div>
            </div>

            <dl className="about-stat-list">
              <div className="about-stat-list__row">
                <dt>CODENAME</dt>
                <dd>LETREZDRAW</dd>
              </div>
              <div className="about-stat-list__row">
                <dt>CLASS</dt>
                <dd>DIGITAL_ILLUSTRATOR</dd>
              </div>
              <div className="about-stat-list__row">
                <dt>CLEARANCE</dt>
                <dd>LEVEL_5</dd>
              </div>
              <div className="about-stat-list__row">
                <dt>LOCATION</dt>
                <dd>PUNE, INDIA</dd>
              </div>
              <div className="about-stat-list__row">
                <dt>STATUS</dt>
                <dd>OPEN_FOR_WORK</dd>
              </div>
              <div className="about-stat-list__row">
                <dt>REMOTE</dt>
                <dd>ENABLED</dd>
              </div>
            </dl>
          </aside>

          <div className="about-main">
            <section className="about-block">
              <h4 className="about-block__label">// OPERATIVE_BRIEF</h4>
              <p className="about-block__text">
                Digital illustrator focused on character design, concept art, and environments. Human-made work, no
                AI. Available for commissions and freelance worldwide.
              </p>
            </section>

            <section className="about-block">
              <h4 className="about-block__label">// SKILL_INVENTORY</h4>
              <div className="about-skills">
                {[
                  'CHARACTER DESIGN',
                  'CONCEPT ART',
                  'ENVIRONMENTS',
                  'PHOTOSHOP',
                  'DIGITAL PAINTING',
                  'COMMISSIONS'
                ].map((skill) => (
                  <span key={skill} className="about-skills__chip">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <div className="about-split-2">
              <section className="about-block">
                <h4 className="about-block__label">// FIELD_OPS</h4>
                <ul className="about-timeline">
                  <li>
                    <span className="about-timeline__y">2023</span> First commission
                  </li>
                  <li>
                    <span className="about-timeline__y">2024</span> Portfolio expansion
                  </li>
                  <li>
                    <span className="about-timeline__y">2025</span> Full-time illustrator
                  </li>
                  <li>
                    <span className="about-timeline__y">2026</span> Present
                  </li>
                </ul>
              </section>
              <section className="about-block">
                <h4 className="about-block__label">// SPECIALIZATION</h4>
                {[
                  { name: 'CHARACTER', value: 90 },
                  { name: 'CONCEPT', value: 85 },
                  { name: 'ENVIRONMENT', value: 80 }
                ].map((s) => (
                  <div key={s.name} className="about-meter">
                    <div className="about-meter__top">
                      <span>{s.name}</span>
                      <span>{s.value}%</span>
                    </div>
                    <div className="about-meter__track">
                      <div className="about-meter__fill" style={{ width: `${s.value}%` }} />
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
