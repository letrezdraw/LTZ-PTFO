import { useState, useRef, useEffect, useCallback, useDeferredValue } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { artworks as fallbackArtworks } from '../data/artworks';
import { hydrateArtwork } from '../utils/artworkUrls';
import { GalleryCard } from './GalleryCard';
import { GalleryWeb } from './GalleryWeb';
import { Lightbox } from './Lightbox';

gsap.registerPlugin(ScrollTrigger);

const manifestUrl = () => `${import.meta.env.BASE_URL}artwork-manifest.json`.replace(/\/{2,}/g, '/');

export const Gallery = () => {
  const [viewMode, setViewMode] = useState('slider');
  const [pieces, setPieces] = useState(fallbackArtworks);
  const deferredPieces = useDeferredValue(pieces);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${manifestUrl()}?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        if (cancelled || !Array.isArray(data)) return;

        const hydrated = data.map((row) => hydrateArtwork(row));
        if (hydrated.length > 0) setPieces(hydrated);
        else setPieces(fallbackArtworks);

        // Ensure ScrollTrigger calculates layout after async data render
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      } catch {
        if (!cancelled) setPieces(fallbackArtworks);

        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToCard = (index) => {
    if (sliderRef.current && index >= 0 && index < pieces.length) {
      const cardWidth = 320;
      sliderRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const handlePrev = () => {
    scrollToCard(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    scrollToCard(Math.min(pieces.length - 1, currentIndex + 1));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex((i) => Math.min(i, Math.max(0, pieces.length - 1)));
  }, [pieces.length]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const sectionStamp = root.querySelector('.section-stamp');
      const cards = root.querySelectorAll('.gallery-card-item, .gallery-web-node-hook');

      if (sectionStamp) {
        gsap.to(sectionStamp, {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionStamp,
            start: 'top 85%',
            once: true
          }
        });
      }

      cards.forEach((card, idx) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true
          },
          delay: idx * 0.05
        });
      });
      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [viewMode, pieces.length]);

  const openArt = useCallback((art) => {
    setSelectedArtwork(art);
  }, []);

  return (
    <section
      id="gallery"
      ref={containerRef}
      style={{
        position: 'relative',
        zIndex: 100,
        padding: '64px 48px',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)'
      }}
    >
      <div
        className="section-stamp"
        style={{
          fontSize: '22px',
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '48px',
          opacity: 0,
          transform: 'translateY(20px)',
          transition: 'all 0.6s ease',
          textAlign: 'center'
        }}
      >
        // <span style={{ color: 'var(--accent-red)' }}>CLASSIFIED_ARCHIVE</span> ◈ EVIDENCE BOARD ◈ {pieces.length}{' '}
        <span style={{ color: 'var(--accent-red)' }}>FILES FOUND</span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}
      >
        {['slider', 'web'].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            style={{
              fontSize: '22px',
              color: viewMode === mode ? 'var(--accent-red)' : 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              background: 'none',
              border: 'none',
              borderBottom: viewMode === mode ? '2px solid var(--accent-red)' : 'none',
              paddingBottom: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            [{mode.toUpperCase()}]
          </button>
        ))}
      </div>

      {viewMode === 'slider' && (
        <div className="gallery-slider-stage" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{
              position: 'relative',
              fontSize: '26px',
              background: 'none',
              border: '1px solid var(--border-color)',
              color: currentIndex === 0 ? 'var(--text-muted)' : 'var(--accent-red)',
              padding: '12px 16px',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              opacity: currentIndex === 0 ? 0.4 : 1
            }}
            onMouseEnter={(e) => {
              if (currentIndex > 0) {
                e.target.style.borderColor = 'var(--accent-red)';
                e.target.style.boxShadow = 'inset 0 0 8px rgba(204, 0, 0, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'none';
            }}
          >
            [←]
          </button>

          <div
            ref={sliderRef}
            style={{
              display: 'flex',
              gap: '16px',
              flex: 1,
              overflowX: 'auto',
              overflowY: 'hidden',
              paddingBottom: '16px',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {deferredPieces.map((artwork) => (
              <div
                key={artwork.id}
                className="gallery-card-item"
                style={{
                  minWidth: '300px',
                  opacity: 1,
                  transform: 'translateY(0px)'
                }}
                onClick={() => openArt(artwork)}
              >
                <GalleryCard artwork={artwork} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === pieces.length - 1}
            style={{
              position: 'relative',
              fontSize: '26px',
              background: 'none',
              border: '1px solid var(--border-color)',
              color: currentIndex === pieces.length - 1 ? 'var(--text-muted)' : 'var(--accent-red)',
              padding: '12px 16px',
              cursor: currentIndex === pieces.length - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              opacity: currentIndex === pieces.length - 1 ? 0.4 : 1
            }}
            onMouseEnter={(e) => {
              if (currentIndex < pieces.length - 1) {
                e.target.style.borderColor = 'var(--accent-red)';
                e.target.style.boxShadow = 'inset 0 0 8px rgba(204, 0, 0, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'none';
            }}
          >
            [→]
          </button>
        </div>
      )}

      {viewMode === 'web' && (
        <div
          className="gallery-web-node-hook"
          style={{
            opacity: 1,
            transform: 'translateY(0px)',
            maxWidth: '1100px',
            margin: '0 auto'
          }}
        >
          <GalleryWeb artworks={deferredPieces} onOpen={openArt} />
        </div>
      )}

      {selectedArtwork && (
        <Lightbox
          artwork={selectedArtwork}
          currentIndex={pieces.findIndex((a) => a.id === selectedArtwork.id)}
          totalFiles={pieces.length}
          onClose={() => setSelectedArtwork(null)}
          onNext={() => {
            const currentIdx = pieces.findIndex((a) => a.id === selectedArtwork.id);
            if (currentIdx < pieces.length - 1) {
              setSelectedArtwork(pieces[currentIdx + 1]);
            }
          }}
          onPrev={() => {
            const currentIdx = pieces.findIndex((a) => a.id === selectedArtwork.id);
            if (currentIdx > 0) {
              setSelectedArtwork(pieces[currentIdx - 1]);
            }
          }}
        />
      )}
    </section>
  );
};
