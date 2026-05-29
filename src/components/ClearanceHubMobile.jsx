import { useState, useEffect, useRef } from 'react';
import BorderGlow from './BorderGlow';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const commissionTiers = [
  {
    name: 'TIER_01',
    title: 'CHARACTER ILLUSTRATION',
    items: [
      { label: 'Headshot', price: '₹3,000 / $36' },
      { label: 'Half Body', price: '₹4,500 / $54' },
      { label: 'Full Body', price: '₹6,000 / $72' }
    ]
  },
  {
    name: 'TIER_02',
    title: 'CHARACTER DESIGN (Pro)',
    price: '₹18,000 / $217',
    features: ['Character Sheet', 'Front + Back View', '3 Facial Expressions']
  },
  {
    name: 'TIER_03',
    title: 'BOOK COVERS & SPLASH ART',
    items: [
      { label: 'Cover', price: '₹12,000 / $145' },
      { label: 'Full Wrap Cover', price: '₹20,000 / $241' },
      { label: 'Splash / Wallpaper', price: '₹15,000 / $181' }
    ]
  },
  {
    name: 'TIER_04',
    title: 'VECTOR & LINE ART',
    items: [
      { label: 'Complex Vector', price: '₹4,000 / $48' },
      { label: 'Illustration (Flat)', price: '₹6,500 / $78' }
    ]
  }
];

export const ClearanceHubMobile = () => {
  const rootRef = useRef(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      root.querySelectorAll('.hub-reveal').forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true
          },
          delay: i * 0.04
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
      id="clearance-hub"
      ref={rootRef}
      className="clearance-hub"
      style={{
        position: 'relative',
        zIndex: 100,
        padding: '32px 16px',
        background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 52%, var(--bg-primary) 100%)',
        borderTop: '1px solid var(--border-color)'
      }}
    >
      <div
        className="section-stamp hub-reveal"
        style={{
          fontSize: '15px',
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginBottom: '24px',
          opacity: 0,
          transform: 'translateY(16px)'
        }}
      >
        // <span style={{ color: 'var(--accent-red)' }}>CLEARANCE</span> ·{' '}
        <span style={{ color: 'var(--text-secondary)' }}>PRICING</span> ◈{' '}
        <span style={{ color: 'var(--accent-red)' }}>OPEN</span>
      </div>

      {/* Commission Tiers */}
      <div
        className="hub-reveal"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '24px',
          opacity: 0,
          transform: 'translateY(16px)'
        }}
      >
        {commissionTiers.map((tier) => (
          <BorderGlow
            key={tier.name}
            glowColor="204 0 0"
            borderRadius={5}
            glowRadius={18}
            glowIntensity={0.6}
            colors={['#cc0000', '#ff3333', '#ff7777']}
            fillOpacity={0.22}
            edgeSensitivity={45}
          >
            <button
              type="button"
              onClick={() => setExpanded(expanded === tier.name ? null : tier.name)}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'transparent',
                border: 'none',
                borderBottom: expanded === tier.name ? '1px solid var(--border-color)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(204, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: 600,
                    color: 'var(--accent-red)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  {tier.name}
                </div>
                <div
                  style={{
                    fontSize: '15px',
                    color: 'var(--text-secondary)',
                    marginTop: '2px',
                    letterSpacing: '0.3px'
                  }}
                >
                  {tier.title}
                </div>
              </div>
              <div
                style={{
                  fontSize: '22px',
                  color: 'var(--accent-red)',
                  fontWeight: 700
                }}
              >
                {expanded === tier.name ? '−' : '+'}
              </div>
            </button>

            {expanded === tier.name && (
              <div style={{ padding: '12px 14px' }}>
                {tier.items ? (
                  <ul
                    style={{
                      fontSize: '15px',
                      color: 'var(--text-secondary)',
                      margin: 0,
                      paddingLeft: '0',
                      listStyle: 'none',
                      lineHeight: '1.8',
                      letterSpacing: '0.3px'
                    }}
                  >
                    {tier.items.map((item) => (
                      <li key={item.label}>
                        <span style={{ color: 'var(--accent-red)' }}>▸</span> {item.label}:{' '}
                        <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>{item.price}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul
                    style={{
                      fontSize: '15px',
                      color: 'var(--text-secondary)',
                      margin: 0,
                      paddingLeft: '0',
                      listStyle: 'none',
                      lineHeight: '1.8',
                      letterSpacing: '0.3px'
                    }}
                  >
                    {tier.features.map((f) => (
                      <li key={f}>
                        <span style={{ color: 'var(--accent-red)' }}>▸</span> {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </BorderGlow>
        ))}
      </div>

      {/* Contact CTA */}
      <div
        className="hub-reveal"
        style={{
          border: '1px solid var(--accent-red)',
          background: 'rgba(204, 0, 0, 0.05)',
          padding: '16px',
          textAlign: 'center',
          opacity: 0,
          transform: 'translateY(16px)'
        }}
      >
        <div
          style={{
            fontSize: '22px',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          // REQUEST_COMMISSION
        </div>
        <a
          href="mailto:commissions@letrezdraw.com"
          style={{
            display: 'inline-block',
            padding: '10px 16px',
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--bg-primary)',
            background: 'var(--accent-red)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            border: '1px solid var(--accent-red)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--accent-red)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--accent-red)';
            e.currentTarget.style.color = 'var(--bg-primary)';
          }}
        >
          INQUIRE NOW
        </a>
      </div>
    </section>
  );
};
