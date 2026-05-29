import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lightbox } from './Lightbox';
import { hydrateArtwork } from '../utils/artworkUrls';
import '../styles/Operations.css';

gsap.registerPlugin(ScrollTrigger);

export const Operations = ({ artworks = [] }) => {
  const [operations, setOperations] = useState([]);
  const [selectedOperation, setSelectedOperation] = useState('all'); // Default to 'all'
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [artworksList, setArtworksList] = useState([]);
  const containerRef = useRef(null);

  // Generate operations from artworks and load localStorage
  useEffect(() => {
    // Try to load from localStorage first (prioritize user's published works)
    const savedArtworks = localStorage.getItem('portfolio_artworks');
    let finalArtworks = artworks;
    
    if (savedArtworks) {
      try {
        const parsed = JSON.parse(savedArtworks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          finalArtworks = parsed;
        }
      } catch {
        console.warn('Failed to load saved artworks from localStorage');
      }
    }

    const hydrated = finalArtworks.map((art) => hydrateArtwork(art));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setArtworksList(hydrated);

    // Generate operations dynamically from artworks
    const categorySet = new Set();
    hydrated.forEach(art => {
      if (art.category) categorySet.add(art.category);
    });

    const categories = Array.from(categorySet).sort();
    const generatedOps = categories.map((cat, idx) => ({
      id: cat.toLowerCase().replace(/\s+/g, '-'),
      name: cat,
      icon: '🎨',
      order: idx + 1,
      subcategories: [{ id: `sub-${cat}-1`, name: 'General', order: 1 }]
    }));

    setOperations(generatedOps);
  }, [artworks]);

  // Get artworks for selected category (or all if 'all' selected)
  const selectedOp = operations.find(op => op.id === selectedOperation);
  const currentArtworks = selectedOperation === 'all'
    ? artworksList
    : (selectedOperation && selectedOp
      ? artworksList.filter(art => 
          art.category?.toLowerCase().replace(/\s+/g, '-') === selectedOperation
        )
      : artworksList);

  const handleOperationSelect = (opId) => {
    setSelectedOperation(opId);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subId) => {
    setSelectedSubcategory(subId);
  };

  const handleArtworkSelect = (artwork) => {
    setSelectedArtwork(artwork);
    setIsOpen(true);
  };

  const handlePrevNext = (direction) => {
    const currentIndex = currentArtworks.findIndex((a) => a.id === selectedArtwork?.id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + currentArtworks.length) % currentArtworks.length
      : (currentIndex + 1) % currentArtworks.length;
    
    setSelectedArtwork(currentArtworks[newIndex]);
  };

  const operation = selectedOp;
  const subcategoriesAvailable = operation?.subcategories || [];

  return (
    <section id="operations" ref={containerRef} className="operations-section">
      {/* Header */}
      <div className="operations-header">
        <div className="section-stamp">
          <span style={{ color: 'var(--accent-red)' }}>[</span>OPERATIONS<span style={{ color: 'var(--accent-red)' }}>]</span>
        </div>
        <h2 className="ops-title">CLASSIFIED ARCHIVES</h2>
        <p className="ops-subtitle">Browse by operation category</p>
      </div>

      {/* Operation Categories */}
      <div className="operations-categories">
        <button
          className={`ops-category-btn ${selectedOperation === 'all' ? 'active' : ''}`}
          onClick={() => handleOperationSelect('all')}
        >
          <span className="ops-cat-icon">📋</span>
          <span className="ops-cat-name">ALL CATEGORIES</span>
        </button>
        {operations.map((op) => (
          <button
            key={op.id}
            className={`ops-category-btn ${selectedOperation === op.id ? 'active' : ''}`}
            onClick={() => handleOperationSelect(op.id)}
          >
            <span className="ops-cat-icon">{op.icon}</span>
            <span className="ops-cat-name">{op.name.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {/* Subcategories (if operation selected) */}
      {selectedOperation && subcategoriesAvailable.length > 0 && (
        <div className="operations-subcategories">
          <button
            className={`ops-subcat-btn ${selectedSubcategory === null ? 'active' : ''}`}
            onClick={() => handleSubcategorySelect(null)}
          >
            ALL
          </button>
          {subcategoriesAvailable
            .filter(subcat => subcat.name !== 'General')
            .map((subcat) => (
            <button
              key={subcat.id}
              className={`ops-subcat-btn ${selectedSubcategory === subcat.id ? 'active' : ''}`}
              onClick={() => handleSubcategorySelect(subcat.id)}
            >
              {subcat.name.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Artworks Grid */}
      {(selectedOperation === 'all' || selectedOperation) && (
        <div className="operations-grid">
          {currentArtworks.length > 0 ? (
            currentArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="ops-artwork-card"
                onClick={() => handleArtworkSelect(artwork)}
              >
                <div className="ops-artwork-image">
                  {artwork.imageThumb ? (
                    <img
                      src={artwork.imageThumb}
                      alt={artwork.title}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (!e.target.nextElementSibling?.classList.contains('placeholder-text')) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'placeholder-text';
                          placeholder.style.cssText = 'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:100%; text-align:center; font-size:12px; color:var(--text-muted); background:var(--bg-secondary); width:100%; height:100%; display:flex; alignItems:center; justifyContent:center;';
                          placeholder.textContent = 'No Image';
                          e.target.parentElement.appendChild(placeholder);
                        }
                      }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                      No Image
                    </div>
                  )}
                  <div className="ops-artwork-overlay">
                    <div className="ops-artwork-meta">
                      <div className="ops-artwork-title">{artwork.title}</div>
                      <div className="ops-artwork-id">{artwork.id}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="ops-empty">No artworks in this category yet</div>
          )}
        </div>
      )}

      {selectedOperation !== 'all' && !selectedOperation && (
        <div className="ops-empty-state">
          <div className="ops-empty-text">SELECT AN OPERATION TO VIEW ARCHIVES</div>
        </div>
      )}

      {/* Lightbox */}
      {isOpen && selectedArtwork && (
        <Lightbox
          artwork={selectedArtwork}
          onClose={() => setIsOpen(false)}
          onPrev={() => handlePrevNext('prev')}
          onNext={() => handlePrevNext('next')}
        />
      )}
    </section>
  );
};
