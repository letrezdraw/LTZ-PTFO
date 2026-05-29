import { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import { pointer } from '../pointerStore';

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================
const DISPLAY_COUNT = 5; // Always show exactly 5 dots
const MARGIN = 0.06; // Keep nodes away from edges
const FLOAT_SPEED = 0.00011; // Slow organic drift speed
const K_NEIGHBORS = 3; // Max edges per node
const ROTATION_INTERVAL = 5000; // Switch artworks every 5s
const DRAG_CLICK_MAX_PX = 14; // Click threshold
const DRAG_CLICK_MAX_MS = 420; // Click threshold

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Seeded hash function for deterministic positioning
 */
function hashUnit(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (Math.abs(h) % 10000) / 10000;
}

/**
 * Clamp value between bounds
 */
function clamp01(v, lo = MARGIN, hi = 1 - MARGIN) {
  return Math.min(hi, Math.max(lo, v));
}

/**
 * Distance squared between two nodes (in canvas space)
 */
function distSq(a, b, w, h) {
  const dx = (a.nx - b.nx) * w;
  const dy = (a.ny - b.ny) * h;
  return dx * dx + dy * dy;
}

/**
 * Compute nearest-neighbor edges
 */
function computeEdges(nodes, w, h) {
  const n = nodes.length;
  if (n < 2) return [];

  const maxD = Math.min(w, h) * 0.48;
  const maxDSq = maxD * maxD;
  const set = new Set();

  // For each node, find K_NEIGHBORS closest neighbors within maxD distance
  for (let i = 0; i < n; i++) {
    const others = [];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const d2 = distSq(nodes[i], nodes[j], w, h);
      if (d2 <= maxDSq) others.push({ j, d2 });
    }
    others.sort((a, b) => a.d2 - b.d2);
    for (let k = 0; k < Math.min(K_NEIGHBORS, others.length); k++) {
      const j = others[k].j;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      set.add(key);
    }
  }

  return [...set].map((key) => {
    const [a, b] = key.split('-').map(Number);
    return { a, b, key };
  });
}

/**
 * Initialize nodes with deterministic positions based on artwork ID
 */
function initNodes(artworks) {
  return artworks.map((artwork) => {
    // Use artwork ID to generate stable position + drift parameters
    let nx = clamp01(hashUnit(`${artwork.id}|nx`) * 0.86 + 0.07);
    let ny = clamp01(hashUnit(`${artwork.id}|ny`) * 0.86 + 0.07);
    
    // Add small random jitter to prevent perfect overlap
    nx = clamp01(nx + (hashUnit(`${artwork.id}|jx`) - 0.5) * 0.06);
    ny = clamp01(ny + (hashUnit(`${artwork.id}|jy`) - 0.5) * 0.06);

    return {
      id: artwork.id,
      artwork,
      nx, // normalized x (0-1)
      ny, // normalized y (0-1)
      phx: hashUnit(`${artwork.id}|phx`) * Math.PI * 2, // phase x (for drift)
      phy: hashUnit(`${artwork.id}|phy`) * Math.PI * 2  // phase y
    };
  });
}

/**
 * Seeded random selection of artworks (always exactly DISPLAY_COUNT)
 */
function selectRandomArtworks(allArtworks, seed) {
  if (allArtworks.length <= DISPLAY_COUNT) {
    return allArtworks;
  }

  const arr = allArtworks.slice();
  
  // Fisher-Yates shuffle with seeded LCG
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const rand = () => (s = (s * 16807) % 2147483647) / 2147483647;

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.slice(0, DISPLAY_COUNT);
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const GalleryWeb = memo(({ artworks, onOpen }) => {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const dragRef = useRef(null);
  const rafRef = useRef(0);
  const pointerCanvasRef = useRef({ mx: 0, my: 0 });
  
  // Canvas dimensions
  const [dims, setDims] = useState({ w: 900, h: 560 });
  const { w, h } = dims;

  // Currently displayed artwork subset
  const [displayArtworks, setDisplayArtworks] = useState([]);
  const n = displayArtworks.length;

  // State counters for throttled updates
  const tickCounterRef = useRef(0);
  const edgeCounterRef = useRef(0);
  const [edgeVersion, setEdgeVersion] = useState(0);

  // ========================================================================
  // EFFECT: Select initial artwork subset + rotate every ROTATION_INTERVAL
  // ========================================================================
  useEffect(() => {
    if (!Array.isArray(artworks) || artworks.length === 0) return;

    // Initial selection using current timestamp for seed
    const seed = Math.floor(Date.now() / 1000);
    setDisplayArtworks(selectRandomArtworks(artworks, seed));

    // If more artworks than display count, rotate selection every 5 seconds
    if (artworks.length > DISPLAY_COUNT) {
      const intervalId = setInterval(() => {
        const newSeed = Math.floor(Date.now() / 1000);
        setDisplayArtworks(selectRandomArtworks(artworks, newSeed));
      }, ROTATION_INTERVAL);

      return () => clearInterval(intervalId);
    }
  }, [artworks]);

  // ========================================================================
  // EFFECT: Initialize or update nodes when displayArtworks changes
  // ========================================================================
  useEffect(() => {
    if (!Array.isArray(displayArtworks) || displayArtworks.length === 0) return;

    // First time initialization
    if (nodesRef.current.length === 0) {
      nodesRef.current = initNodes(displayArtworks);
      return;
    }

    // Update: preserve node positions but swap artwork payloads
    // This creates seamless transitions where dots don't jump around
    const nodes = nodesRef.current;
    const newNodes = initNodes(displayArtworks);
    const count = Math.min(nodes.length, newNodes.length);

    for (let i = 0; i < count; i++) {
      // Update artwork data
      nodes[i].id = newNodes[i].id;
      nodes[i].artwork = newNodes[i].artwork;
      // Positions and motion preserved automatically
    }
  }, [displayArtworks]);

  // ========================================================================
  // EFFECT: Measure canvas and set dimensions
  // ========================================================================
  useEffect(() => {
    const measure = () => {
      const el = wrapRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const availW = Math.max(320, rect.width);
      const availH = Math.max(320, rect.height);
      const aspectRatio = 0.72;
      const h = Math.min(availH, Math.max(420, availW * aspectRatio));

      setDims({
        w: Math.max(360, Math.floor(availW)),
        h: Math.max(420, Math.floor(h))
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (wrapRef.current) observer.observe(wrapRef.current);
    window.addEventListener('resize', measure, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // ========================================================================
  // HELPER: Throttled state updates
  // ========================================================================
  const bump = useCallback(() => {
    tickCounterRef.current++;

    // Update visual state every 4 frames (for hover scaling)
    if (tickCounterRef.current % 4 === 0) {
      setEdgeVersion((x) => x + 1);
    }

    // Update edge connections every 8 frames
    edgeCounterRef.current++;
    if (edgeCounterRef.current % 8 === 0) {
      setEdgeVersion((x) => x + 1);
    }
  }, []);

  // ========================================================================
  // EFFECT: Animation loop - drift nodes, track pointer
  // ========================================================================
  useEffect(() => {
    if (!n || !w || h === 0) return;

    const animate = () => {
      const time = performance.now() * 0.001; // seconds
      const nodes = nodesRef.current;
      const dragNode = dragRef.current;

      // Update pointer position relative to canvas
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect && rect.width > 0) {
        pointerCanvasRef.current.mx = pointer.x - rect.left;
        pointerCanvasRef.current.my = pointer.y - rect.top;
      }

      // Update node positions with slow organic drift
      for (const node of nodes) {
        // Skip if this node is being dragged
        if (dragNode && dragNode.id === node.id) continue;

        // Sinusoidal drift using perlin-like phase
        const dnx = Math.sin(time * 0.31 + node.phx) * FLOAT_SPEED;
        const dny = Math.cos(time * 0.27 + node.phy) * FLOAT_SPEED;

        node.nx = clamp01(node.nx + dnx);
        node.ny = clamp01(node.ny + dny);
      }

      rafRef.current = requestAnimationFrame(animate);
      bump();
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [n, w, h, bump]);

  // ========================================================================
  // MEMOIZED: Compute edges based on current node positions
  // ========================================================================
  const edges = useMemo(
    () => computeEdges(nodesRef.current, w, h),
    [w, h, n, edgeVersion]
  );

  // ========================================================================
  // MEMOIZED: Background stars (decorative dust)
  // ========================================================================
  const bgStars = useMemo(() => {
    const dots = [];
    const seed = w + h * 0.001;
    for (let i = 0; i < 120; i++) {
      const x = (hashUnit(`star${i}x${seed}`) * 0.92 + 0.04) * w;
      const y = (hashUnit(`star${i}y${seed}`) * 0.92 + 0.04) * h;
      const r = 0.35 + hashUnit(`star${i}r${seed}`) * 1.1;
      const o = 0.08 + hashUnit(`star${i}o${seed}`) * 0.35;
      dots.push({ x, y, r, o, i });
    }
    return dots;
  }, [w, h]);

  // ========================================================================
  // HANDLERS: Pointer events for dragging and clicking
  // ========================================================================
  const pointerDown = useCallback((e, nodeId) => {
    if (e.button !== 0) return;

    const rect = canvasRef.current?.getBoundingClientRect() ?? null;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    dragRef.current = {
      id: nodeId,
      pointerId: e.pointerId,
      startT: performance.now(),
      moved: 0,
      lastX: e.clientX,
      lastY: e.clientY,
      rect: rect && rect.width > 0 ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null
    };
  }, []);

  const pointerMove = useCallback(
    (e) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;

      drag.moved += Math.abs(e.clientX - drag.lastX) + Math.abs(e.clientY - drag.lastY);
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;

      if (!drag.rect) return;

      const nx = (e.clientX - drag.rect.left) / drag.rect.width;
      const ny = (e.clientY - drag.rect.top) / drag.rect.height;

      const node = nodesRef.current.find((n) => n.id === drag.id);
      if (node) {
        node.nx = clamp01(nx);
        node.ny = clamp01(ny);
        bump();
      }
    },
    [bump]
  );

  const pointerUp = useCallback(
    (e, artwork) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }

      const elapsed = performance.now() - drag.startT;
      const isClick = drag.moved < DRAG_CLICK_MAX_PX && elapsed < DRAG_CLICK_MAX_MS;
      dragRef.current = null;

      if (isClick) onOpen(artwork);
      bump();
    },
    [onOpen, bump]
  );

  const pointerCancel = useCallback(
    (e) => {
      if (dragRef.current?.pointerId === e.pointerId) {
        dragRef.current = null;
        bump();
      }
    },
    [bump]
  );

  // ========================================================================
  // RENDER: Empty state
  // ========================================================================
  if (n === 0) {
    return (
      <div className="gallery-web gallery-web--empty">
        <p style={{ color: 'var(--text-secondary)', fontSize: '22px' }}>
          Initializing constellation view...
        </p>
      </div>
    );
  }

  // ========================================================================
  // RENDER: Main constellation view
  // ========================================================================
  const nodes = nodesRef.current;
  const { mx, my } = pointerCanvasRef.current;

  return (
    <div ref={wrapRef} className="gallery-web gallery-web--constellation" style={{ width: '100%' }}>
      <p
        className="gallery-web__hint"
        style={{
          textAlign: 'center',
          fontSize: '22px',
          color: 'var(--text-muted)',
          marginBottom: '12px',
          letterSpacing: '1px',
          maxWidth: '520px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        5 random artworks displayed. Drag a star to reposition. Click to view details.
      </p>

      <div
        ref={canvasRef}
        className="gallery-web__universe"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: `${w}px`,
          margin: '0 auto',
          height: `${h}px`,
          touchAction: 'none'
        }}
      >
        {/* SVG Layer: Background stars + connecting lines */}
        <svg
          className="gallery-web__svg"
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          style={{ display: 'block' }}
          aria-hidden
        >
          <defs>
            <linearGradient id="const-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-red)" stopOpacity="0.2" />
              <stop offset="50%" stopColor="var(--accent-red)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--accent-red)" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Background dust */}
          {bgStars.map((s) => (
            <circle
              key={s.i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              className="gallery-web__dust"
              fill="var(--accent-red)"
              opacity={s.o}
            />
          ))}

          {/* Edges between nearest neighbors */}
          {edges.map(({ a, b, key }) => {
            const na = nodes[a];
            const nb = nodes[b];
            if (!na || !nb) return null;
            return (
              <line
                key={key}
                x1={na.nx * w}
                y1={na.ny * h}
                x2={nb.nx * w}
                y2={nb.ny * h}
                className="gallery-web__line"
                stroke="url(#const-line-grad)"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Node Layer: Interactive artwork nodes */}
        <div className="gallery-web__nodes" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {nodes.map((node) => {
            // Hover proximity scaling
            const distToPointer = Math.hypot(mx - node.nx * w, my - node.ny * h);
            const proximityFactor = Math.min(distToPointer, 200) / 200; // 0-1
            const scale = 0.82 + (1 - proximityFactor) * 0.3; // 0.82 to 1.12

            return (
              <button
                key={node.id}
                type="button"
                className="gallery-web__node interactive gallery-web__star"
                style={{
                  position: 'absolute',
                  left: `${node.nx * 100}%`,
                  top: `${node.ny * 100}%`,
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  pointerEvents: 'auto',
                  transition: 'transform 0.08s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                onPointerDown={(e) => pointerDown(e, node.id)}
                onPointerMove={pointerMove}
                onPointerUp={(e) => pointerUp(e, node.artwork)}
                onPointerCancel={pointerCancel}
                aria-label={`${node.artwork.title} — drag or click`}
              >
                <span className="gallery-web__ring" />
                <span className="gallery-web__img-wrap">
                  <img
                    src={node.artwork.imageThumb || node.artwork.image}
                    alt=""
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="gallery-web__title">{node.artwork.id}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

GalleryWeb.displayName = 'GalleryWeb';
