import { useState, useEffect, useRef } from 'react';
import { Lightbox } from './Lightbox';
import BorderGlow from './BorderGlow';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const GalleryMobile = ({ artworks }) => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      root.querySelectorAll('.gallery-card-item').forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
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
    window.addEventListener('resize', refreshTriggers, { passive: true });

    return () => {
      window.removeEventListener('scroll', refreshTriggers);
      window.removeEventListener('touchmove', refreshTriggers);
      window.removeEventListener('wheel', refreshTriggers);
      window.removeEventListener('resize', refreshTriggers);
      ctx.revert();
    };
  }, []);

  const handleOpenArtwork = (artwork, idx) => {
    setSelectedArtwork(artwork);
    setSelectedIdx(idx);
  };

  const handlePrev = () => {
    if (selectedIdx === null) return;
    const prevIdx = selectedIdx === 0 ? artworks.length - 1 : selectedIdx - 1;
    setSelectedArtwork(artworks[prevIdx]);
    setSelectedIdx(prevIdx);
  };

  const handleNext = () => {
    if (selectedIdx === null) return;
    const nextIdx = selectedIdx === artworks.length - 1 ? 0 : selectedIdx + 1;
    setSelectedArtwork(artworks[nextIdx]);
    setSelectedIdx(nextIdx);
  };

  return (
    <section
      id="gallery"
      ref={containerRef}
      style={{
        padding: '32px 16px',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        position: 'relative',
        zIndex: 100
      }}
    >
      <div
        style={{
          fontSize: '15px',
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginBottom: '24px',
          opacity: 0,
          transform: 'translateY(16px)',
          animation: 'slide-up 0.6s ease-out forwards'
        }}
        className="section-stamp"
      >
        // <span style={{ color: 'var(--accent-red)' }}>VAULT</span> ◈ EXHIBITION ◈{' '}
        <span style={{ color: 'var(--accent-red)' }}>LIVE</span>
      </div>

      {/* Grid - 2 columns on mobile */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}
      >
        {artworks.map((artwork, idx) => (
          <BorderGlow
            key={artwork.id}
            className="gallery-card-item"
            glowColor="204 0 0"
            borderRadius={6}
            glowRadius={20}
            glowIntensity={0.7}
            colors={['#cc0000', '#ff4444', '#ff8888']}
            fillOpacity={0.25}
            edgeSensitivity={50}
            style={{
              opacity: 0,
              transform: 'translateY(16px)',
              cursor: 'pointer'
            }}
          >
            <button
              type="button"
              onClick={() => handleOpenArtwork(artwork, idx)}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                overflow: 'hidden',
                padding: 0,
                margin: 0
              }}
            >
              <div
                style={{
                  position: 'relative',
                  paddingBottom: '100%',
                  overflow: 'hidden',
                  background: 'var(--bg-secondary)'
                }}
              >
                <img
                  src={artwork.imageThumb || artwork.imageWeb || artwork.image}
                  alt={artwork.title}
                  loading="eager"
                  decoding="async"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    opacity: artwork.imageThumb || artwork.imageWeb || artwork.image ? 1 : 0.3
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    padding: '12px 8px 8px',
                    fontSize: '15px'
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      color: 'var(--accent-red)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '2px'
                    }}
                  >
                    {artwork.id}
                  </div>
                </div>
              </div>
            </button>
          </BorderGlow>
        ))}
      </div>

      {/* Lightbox */}
      {selectedArtwork && (
        <Lightbox
          artwork={selectedArtwork}
          currentIndex={selectedIdx}
          totalFiles={artworks.length}
          onClose={() => setSelectedArtwork(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </section>
  );
};
