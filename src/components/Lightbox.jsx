import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const Lightbox = ({ artwork, currentIndex, totalFiles, onClose, onNext, onPrev }) => {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredExtraIdx, setHoveredExtraIdx] = useState(null);

  const extras = [...(artwork.extraImages || [])];
  if (extras.length === 0 && artwork.imageSecondary) {
    extras.push(artwork.imageSecondary);
  }

  useEffect(() => {
    const timeline = gsap.timeline();

    timeline.to(overlayRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    });

    timeline.to(
      panelRef.current,
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      },
      0
    );

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onNext, onPrev]);

  const handleClose = () => {
    const timeline = gsap.timeline();

    timeline.to(panelRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    });

    timeline.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.2
      },
      0
    );

    timeline.eventCallback('onComplete', onClose);
  };

  const handleNavigation = (callback) => {
    if (isLoading) return;
    setIsLoading(true);

    gsap.to(panelRef.current, {
      opacity: 0.4,
      duration: 0.15,
      ease: 'power2.in'
    });

    setTimeout(() => {
      callback();
      setTimeout(() => {
        gsap.to(panelRef.current, {
          opacity: 1,
          duration: 0.15,
          ease: 'power2.out'
        });
        setIsLoading(false);
      }, 100);
    }, 200);
  };

  const lastIdx = Math.max(0, (totalFiles ?? 1) - 1);

  return (
    <>
      <div
        ref={overlayRef}
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          opacity: 0,
          zIndex: 8500,
          backdropFilter: 'blur(4px)'
        }}
      />

      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-color)',
          maxHeight: '90vh',
          overflowY: 'auto',
          zIndex: 8501,
          y: 40,
          opacity: 0
        }}
      >
        <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-color)'
            }}
          >
            <div style={{ fontSize: '22px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              TOP SECRET // DECLASSIFIED
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                type="button"
                onClick={() => window.open(artwork.imageHd || artwork.image, '_blank')}
                style={{
                  fontSize: '15px',
                  color: 'var(--text-secondary)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--accent-red)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--text-secondary)';
                }}
              >
                [FULLSCREEN]
              </button>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  fontSize: '15px',
                  color: 'var(--text-secondary)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--accent-red)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--text-secondary)';
                }}
              >
                [CLOSE FILE ESC]
              </button>
            </div>
          </div>

          <div
            className="lightbox-top-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '48px',
              marginBottom: '64px',
              alignItems: 'start'
            }}
          >
            <div>
              <div style={{ position: 'relative', maxHeight: '80vh', overflow: 'auto' }}>
                <img
                  src={artwork.imageWeb || artwork.image}
                  srcSet={`${artwork.imageWeb || artwork.image} 1280w, ${artwork.imageHd || artwork.image} 1920w`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={artwork.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    border: '1px solid var(--border-color)',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
                <div className="corner-bracket corner-tl" style={{ top: 8, left: 8 }} />
                <div className="corner-bracket corner-tr" style={{ top: 8, right: 8 }} />
                <div className="corner-bracket corner-bl" style={{ bottom: 8, left: 8 }} />
                <div className="corner-bracket corner-br" style={{ bottom: 8, right: 8 }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <div style={{ fontSize: '15px', color: 'var(--accent-red)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {artwork.id}
                </div>
                <div style={{ fontSize: '15px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  TYPE: {artwork.category}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  // METADATA
                </h4>
                <div style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  {artwork.year ? <div>YEAR: {artwork.year}</div> : null}
                  {artwork.medium ? <div>MEDIUM: {artwork.medium}</div> : null}
                  <div>CATEGORY: {artwork.category}</div>
                  {artwork.tags?.length ? <div>TAGS: {artwork.tags.join(', ')}</div> : null}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  // ARTWORK_BRIEF
                </h4>
                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8', margin: 0 }}>
                  {artwork.description || '—'}
                </p>
              </div>

              {artwork.tools?.length ? (
                <div>
                  <h4 style={{ fontSize: '15px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    // TOOLS_USED
                  </h4>
                  <div style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>{artwork.tools.join(' · ')}</div>
                </div>
              ) : null}

              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  // COMMISSION_STATUS
                </h4>
                <div style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                  ◉ {artwork.commissionStatus || 'OPEN'} — Request Available
                </div>
              </div>
            </div>
          </div>

          {extras.length > 0 && (
            <>
              <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '22px', color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                  // RELATED_ASSETS (from ARTWORK folder: 2, 3, 4…)
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '20px',
                  marginBottom: '48px'
                }}
              >
                {extras.map((item, idx) => {
                  const isString = typeof item === 'string';
                  const imgSrc = isString ? item : (item.web || item.original);
                  const imgSrcSet = isString ? undefined : `${item.web || item.original} 1280w, ${item.hd || item.original} 1920w`;

                  const openSrc = isString ? item : (item.hd || item.original || item.web);

                  const isHovered = hoveredExtraIdx === idx;

                  return (
                    <div
                      key={`${imgSrc}-${idx}`}
                      style={{ display: 'flex', flexDirection: 'column' }}
                      onMouseEnter={() => setHoveredExtraIdx(idx)}
                      onMouseLeave={() => setHoveredExtraIdx((v) => (v === idx ? null : v))}
                    >
                      <div style={{ position: 'relative', marginBottom: '10px' }}>
                        <img
                          src={imgSrc}
                          srcSet={imgSrcSet}
                          sizes="(max-width: 768px) 100vw, 220px"
                          alt={`Reference ${idx + 2}`}
                          style={{
                            width: '100%',
                            height: '200px',
                            border: '1px solid var(--border-color)',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => window.open(openSrc, '_blank')}
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            zIndex: 2,
                            fontSize: '15px',
                            color: 'var(--text-secondary)',
                            background: 'rgba(0,0,0,0.55)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '999px',
                            padding: '8px 10px',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            opacity: isHovered ? 1 : 0,
                            pointerEvents: isHovered ? 'auto' : 'none',
                            transition: 'opacity 0.15s ease, transform 0.15s ease'
                          }}
                        >
                          [OPEN]
                        </button>

                        <div
                          aria-hidden
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.15)',
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.15s ease',
                            border: '1px solid transparent'
                          }}
                        />
                      </div>

                      <div style={{ fontSize: '22px', color: 'var(--accent-red)', letterSpacing: '1px' }}>
                        FILE_{String(idx + 2).padStart(2, '0')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)'
            }}
          >
            <button
              type="button"
              onClick={() => handleNavigation(onPrev)}
              disabled={isLoading || currentIndex <= 0}
              className="button-terminal"
              style={{
                opacity: isLoading || currentIndex <= 0 ? 0.5 : 1,
                pointerEvents: isLoading || currentIndex <= 0 ? 'none' : 'auto',
                cursor: isLoading || currentIndex <= 0 ? 'not-allowed' : 'pointer'
              }}
            >
              [← PREV FILE]
            </button>

            <div style={{ fontSize: '15px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {isLoading ? (
                <span style={{ animation: 'pulse-blink 1.5s infinite', display: 'inline-block' }}>LOADING...</span>
              ) : (
                `File ${(currentIndex ?? 0) + 1} of ${totalFiles ?? 1}`
              )}
            </div>

            <button
              type="button"
              onClick={() => handleNavigation(onNext)}
              disabled={isLoading || currentIndex >= lastIdx}
              className="button-terminal"
              style={{
                opacity: isLoading || currentIndex >= lastIdx ? 0.5 : 1,
                pointerEvents: isLoading || currentIndex >= lastIdx ? 'none' : 'auto',
                cursor: isLoading || currentIndex >= lastIdx ? 'not-allowed' : 'pointer'
              }}
            >
              [NEXT FILE →]
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
