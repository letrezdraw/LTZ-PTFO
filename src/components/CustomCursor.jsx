import { useEffect, useRef, useState } from 'react';
import { pointer } from '../pointerStore';

const lerp = (a, b, t) => a + (b - a) * t;

export const CustomCursor = () => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const coordsRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [cursorContext, setCursorContext] = useState('');
  const innerPos = useRef({ x: 0, y: 0 });
  const outerPos = useRef({ x: 0, y: 0 });
  const coordsPos = useRef({ x: 0, y: 0 });
  const expandedRef = useRef(false);
  const contextRef = useRef('');
  const rafRef = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      document.documentElement.classList.add('use-system-cursor');
      return () => document.documentElement.classList.remove('use-system-cursor');
    }

    innerPos.current = { x: pointer.x, y: pointer.y };
    outerPos.current = { x: pointer.x, y: pointer.y };
    coordsPos.current = { x: pointer.x, y: pointer.y };

    const handleMouseMove = (e) => {
      const target = e.target;
      let expanded = false;
      let context = '';

      if (target.tagName === 'BUTTON' || target.closest('button')) {
        expanded = true;
        context = 'OPEN_FILE';
      } else if (target.tagName === 'A' || target.closest('a')) {
        expanded = true;
        context = 'LINK_OPEN';
      } else if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select')
      ) {
        expanded = true;
        context = 'TXT_INPUT';
      } else if (target.classList.contains('interactive')) {
        expanded = true;
        context = 'INTERACT';
      }

      if (expanded !== expandedRef.current) {
        expandedRef.current = expanded;
        setIsExpanded(expanded);
      }
      if (context !== contextRef.current) {
        contextRef.current = context;
        setCursorContext(context);
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    const tick = () => {
      const ix = innerRef.current;
      const ox = outerRef.current;
      const cr = coordsRef.current;

      innerPos.current.x = lerp(innerPos.current.x, pointer.x, 0.42);
      innerPos.current.y = lerp(innerPos.current.y, pointer.y, 0.42);

      outerPos.current.x = lerp(outerPos.current.x, pointer.x, 0.14);
      outerPos.current.y = lerp(outerPos.current.y, pointer.y, 0.14);

      coordsPos.current.x = lerp(coordsPos.current.x, pointer.x, 0.22);
      coordsPos.current.y = lerp(coordsPos.current.y, pointer.y, 0.22);

      const innerSize = expandedRef.current ? 10 : 6;
      const outerSize = expandedRef.current ? 40 : 28;
      const innerOff = innerSize / 2;
      const outerOff = outerSize / 2;

      if (ix) {
        ix.style.transform = `translate3d(${innerPos.current.x - innerOff}px, ${innerPos.current.y - innerOff}px, 0)`;
        ix.style.width = `${innerSize}px`;
        ix.style.height = `${innerSize}px`;
      }
      if (ox) {
        ox.style.transform = `translate3d(${outerPos.current.x - outerOff}px, ${outerPos.current.y - outerOff}px, 0)`;
        ox.style.width = `${outerSize}px`;
        ox.style.height = `${outerSize}px`;
      }
      if (cr) {
        cr.style.transform = `translate3d(${coordsPos.current.x + 16}px, ${coordsPos.current.y + 16}px, 0)`;
        const cx = Math.round(pointer.x);
        const cy = Math.round(pointer.y);
        const line1 = cr.querySelector('[data-cursor-coords]');
        if (line1) {
          line1.textContent = `X:${String(cx).padStart(4, '0')} Y:${String(cy).padStart(4, '0')}`;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  return (
    <>
      <div
        ref={outerRef}
        className="cursor-outer"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 28,
          height: 28,
          border: '1px solid rgba(212, 0, 0, 0.55)',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          zIndex: 12100,
          borderRadius: 2,
          boxShadow: '0 0 20px rgba(212, 0, 0, 0.15)',
          willChange: 'transform'
        }}
      />
      <div
        ref={innerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          background: isExpanded ? 'transparent' : 'var(--accent-red)',
          border: isExpanded ? '2px solid var(--accent-red)' : 'none',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          zIndex: 12200,
          borderRadius: 1,
          transition: 'background 0.15s ease-out, border 0.15s ease-out',
          willChange: 'transform'
        }}
      />
      <div
        ref={coordsRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          fontSize: '22px',
          color: 'var(--accent-red)',
          fontFamily: "'Share Tech Mono', monospace",
          pointerEvents: 'none',
          zIndex: 12050,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          whiteSpace: 'nowrap',
          textShadow: '0 0 8px rgba(0, 0, 0, 0.85)',
          willChange: 'transform'
        }}
      >
        <div data-cursor-coords>X:0000 Y:0000</div>
        {cursorContext ? (
          <div style={{ fontSize: '15px', marginTop: '2px' }}>{cursorContext}</div>
        ) : null}
      </div>
    </>
  );
};
