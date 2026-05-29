import { useRef, useState, useCallback, memo } from 'react';

export const GalleryCard = memo(({ artwork }) => {
  const wrapRef = useRef(null);
  const faceRef = useRef(null);
  const [hover, setHover] = useState(false);
  const hoverRef = useRef(false);
  const rafRef = useRef(0);

  const applyTilt = useCallback((clientX, clientY) => {
    const el = wrapRef.current;
    const face = faceRef.current;
    if (!el || !face) return;
    const r = el.getBoundingClientRect();
    const px = (clientX - r.left) / r.width - 0.5;
    const py = (clientY - r.top) / r.height - 0.5;
    const rx = py * -9;
    const ry = px * 11;
    face.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(12px)`;
  }, []);

  const onMove = (e) => {
    if (!hoverRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      applyTilt(e.clientX, e.clientY);
    });
  };

  const onEnter = () => {
    hoverRef.current = true;
    setHover(true);
  };

  const onLeave = () => {
    hoverRef.current = false;
    setHover(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (faceRef.current) {
      faceRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    }
  };

  return (
    <div
      ref={wrapRef}
      className={`gallery-card-3d-wrap${hover ? ' is-hover' : ''}`}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div ref={faceRef} className="gallery-card-3d">
        <div className="gallery-card-3d__shine" aria-hidden />
        <div className="gallery-card-3d__inner">
          <img
            src={artwork.imageThumb || artwork.image}
            srcSet={`${artwork.imageThumb || artwork.image} 400w, ${artwork.imageWeb || artwork.image} 1280w`}
            sizes="(max-width: 768px) 400px, 1280px"
            alt={artwork.title}
            loading="lazy"
            decoding="async"
            className="gallery-card-3d__img"
            draggable={false}
            onError={(e) => {
              e.target.style.display = 'none';
              const parent = e.target.parentElement;
              if (parent && !parent.querySelector('.placeholder-image')) {
                const placeholder = document.createElement('div');
                placeholder.className = 'placeholder-image';
                placeholder.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; backgroundColor:#333; display:flex; alignItems:center; justifyContent:center; color:#666; fontSize:14px;';
                placeholder.textContent = 'Image Not Available';
                parent.appendChild(placeholder);
              }
            }}
          />
          <div className={`gallery-card-3d__overlay${hover ? ' is-on' : ''}`} />
          <div className="corner-bracket corner-tl" />
          <div className="corner-bracket corner-tr" />
          <div className="corner-bracket corner-bl" />
          <div className="corner-bracket corner-br" />
          <div className="gallery-card-3d__meta">
            <div className="gallery-card-3d__id">{artwork.id}</div>
            <div className="gallery-card-3d__cat">{artwork.category}</div>
            <h3 className="gallery-card-3d__title">{artwork.title}</h3>
            <p className="gallery-card-3d__hint">[ OPEN FILE ]</p>
          </div>
        </div>
      </div>
    </div>
  );
});
