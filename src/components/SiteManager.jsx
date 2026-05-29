import { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/SiteManager.css';

const MANAGER_PASSWORD = 'G311soham@';

export const SiteManager = ({ onClose }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('artworks');
  const [artworks, setArtworks] = useState([]);
  const [operations, setOperations] = useState([]);
  const [selectedArtworkId, setSelectedArtworkId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changed, setChanged] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState('order'); // 'order', 'title', 'category'
  const loadingRef = useRef(false);
  const manifestCacheRef = useRef(null);

  // Form state for new artwork
  const [newArtworkForm, setNewArtworkForm] = useState({
    title: '',
    category: '',
    subcategory: '',
    year: new Date().getFullYear().toString(),
    medium: '',
    tags: '',
    description: '',
    tools: '',
    commissionStatus: 'OPEN',
    mainImage: null,
    mainImagePreview: '',
    thumbnailImage: null,
    webImage: null,
    hdImage: null,
    extraImages: [],
    extraImagePreviews: []
  });

  // Load artworks once and cache the result
  useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const loadData = async () => {
      try {
        // Check localStorage first for recently added artworks
        const savedArtworks = localStorage.getItem('portfolio_artworks');
        let artworksData = [];

        if (savedArtworks) {
          try {
            artworksData = JSON.parse(savedArtworks);
          } catch {
            console.warn('Failed to parse saved artworks');
          }
        }

        // If no saved data, load from manifest
        if (artworksData.length === 0) {
          const manifestUrl = `${import.meta.env.BASE_URL}artwork-manifest.json?t=${Date.now()}`;
          const res = await fetch(manifestUrl, { signal: AbortSignal.timeout(5000) });
          
          if (res.ok) {
            artworksData = await res.json();
            if (!Array.isArray(artworksData)) throw new Error('Manifest is not an array');
          }
        }

        manifestCacheRef.current = artworksData;
        setArtworks(artworksData || []);

        // Extract unique categories
        const categorySet = new Set();
        artworksData.forEach(art => {
          if (art.category) categorySet.add(art.category);
        });

        const categories = Array.from(categorySet).sort();
        const ops = categories.map((cat, idx) => ({
          id: cat.toLowerCase().replace(/\s+/g, '-'),
          name: cat,
          icon: '🎨',
          order: idx + 1,
          subcategories: [{ id: `sub-${cat}-1`, name: 'General', order: 1 }]
        }));
        
        setOperations(ops);
      } catch (err) {
        console.error('Load error:', err);
        setArtworks([]);
        setOperations([]);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };

    loadData();

    return () => {
      loadingRef.current = false;
    };
  }, []); // Only run once on mount

  // Cleanup object URLs when component unmounts or form closes
  useEffect(() => {
    return () => {
      newArtworkForm.mainImagePreview && URL.revokeObjectURL(newArtworkForm.mainImagePreview);
      newArtworkForm.extraImagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddForm]);

  // Auto-save artworks to localStorage when they change
  useEffect(() => {
    if (artworks.length > 0 && !loadingRef.current) {
      localStorage.setItem('portfolio_artworks', JSON.stringify(artworks));
    }
  }, [artworks]);

  // All hooks must be called before any conditional returns
  // Helper functions - memoized to prevent re-renders
  const updateArtwork = useCallback((id, field, value) => {
    setArtworks(prevArtworks =>
      prevArtworks.map((art) =>
        art.id === id ? { ...art, [field]: value } : art
      )
    );
    setChanged(true);
  }, []);

  const addOperation = useCallback(() => {
    setOperations(prev => [...prev, {
      id: `op-${Date.now()}`,
      name: 'New Category',
      icon: '🎨',
      order: prev.length + 1,
      subcategories: [{ id: `sub-1`, name: 'General', order: 1 }]
    }]);
    setChanged(true);
  }, []);

  const deleteOperation = useCallback((id) => {
    if (window.confirm('Delete this category?')) {
      setOperations(prev => prev.filter((op) => op.id !== id));
      setSelectedOpId(null);
      setChanged(true);
    }
  }, []);

  const updateOperation = useCallback((id, field, value) => {
    setOperations(prev =>
      prev.map((op) =>
        op.id === id ? { ...op, [field]: value } : op
      )
    );
    setChanged(true);
  }, []);

  const addSubcategory = useCallback((opId) => {
    setOperations(prev =>
      prev.map((op) => {
        if (op.id === opId) {
          return {
            ...op,
            subcategories: [
              ...op.subcategories,
              { id: `sub-${Date.now()}`, name: 'New Sub', order: op.subcategories.length + 1 }
            ]
          };
        }
        return op;
      })
    );
    setChanged(true);
  }, []);

  const deleteSubcategory = useCallback((opId, subId) => {
    setOperations(prev =>
      prev.map((op) => {
        if (op.id === opId) {
          return {
            ...op,
            subcategories: op.subcategories.filter((sub) => sub.id !== subId)
          };
        }
        return op;
      })
    );
    setChanged(true);
  }, []);

  const updateSubcategory = useCallback((opId, subId, field, value) => {
    setOperations(prev =>
      prev.map((op) => {
        if (op.id === opId) {
          return {
            ...op,
            subcategories: op.subcategories.map((sub) =>
              sub.id === subId ? { ...sub, [field]: value } : sub
            )
          };
        }
        return op;
      })
    );
    setChanged(true);
  }, []);

  const exportData = useCallback(() => {
    // Save artworks to localStorage
    localStorage.setItem('portfolio_artworks', JSON.stringify(artworks));
    
    // Also log to console for backend integration
    console.log('📊 Artworks saved to device storage:', {
      total: artworks.length,
      lastUpdated: new Date().toISOString(),
      data: artworks
    });
    
    alert('✅ All artworks saved to your device!\n\n💾 ' + artworks.length + ' artworks are now persistent.\n\nYou can refresh the page and they will still be there.');
    setChanged(false);
  }, [artworks]);

  // Add new artwork with file handling
  const addNewArtwork = useCallback(() => {
    if (!newArtworkForm.title || !newArtworkForm.category || !newArtworkForm.mainImage) {
      alert('❌ Title, Category, and Main Image are required');
      return;
    }

    // Create folder name from title
    const folderName = newArtworkForm.title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    const basePath = `artwork/${newArtworkForm.category.replace(/\s+/g, '_')}/${folderName}`;

    const newArtwork = {
      id: `ART-${Date.now()}`,
      title: newArtworkForm.title,
      category: newArtworkForm.category,
      subcategory: newArtworkForm.subcategory || 'General',
      year: newArtworkForm.year,
      medium: newArtworkForm.medium,
      tags: newArtworkForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      description: newArtworkForm.description,
      tools: newArtworkForm.tools.split(',').map(t => t.trim()).filter(Boolean),
      commissionStatus: newArtworkForm.commissionStatus,
      image: `${basePath}/main.jpg`,
      imageThumb: `${basePath}/main-thumb.jpg`,
      imageWeb: `${basePath}/main-web.jpg`,
      imageHd: `${basePath}/main-hd.jpg`,
      folder: folderName,
      order: artworks.length + 1,
      extraImages: newArtworkForm.extraImages.map((_, idx) => ({
        original: `${basePath}/extra-${idx + 1}.jpg`,
        thumb: `${basePath}/extra-${idx + 1}-thumb.jpg`,
        web: `${basePath}/extra-${idx + 1}-web.jpg`,
        hd: `${basePath}/extra-${idx + 1}-hd.jpg`
      }))
    };

    // Log file upload info (for backend integration)
    console.log('📁 Artwork folder structure:', {
      folder: basePath,
      files: {
        main: newArtworkForm.mainImage.name,
        thumbnail: newArtworkForm.thumbnailImage?.name || 'auto-generate',
        web: newArtworkForm.webImage?.name || 'auto-generate',
        hd: newArtworkForm.hdImage?.name || 'auto-generate',
        extras: newArtworkForm.extraImages.map(img => img.name)
      }
    });

    setArtworks(prev => [...prev, newArtwork]);
    setChanged(true);
    setShowAddForm(false);
    
    // Reset form completely
    setNewArtworkForm({
      title: '',
      category: '',
      subcategory: '',
      year: new Date().getFullYear().toString(),
      medium: '',
      tags: '',
      description: '',
      tools: '',
      commissionStatus: 'OPEN',
      mainImage: null,
      mainImagePreview: '',
      thumbnailImage: null,
      webImage: null,
      hdImage: null,
      extraImages: [],
      extraImagePreviews: []
    });
  }, [newArtworkForm, artworks.length]);

  // Handle adding extra images (append to existing, don't replace)
  const handleAddExtraImages = useCallback((newFiles) => {
    const files = Array.from(newFiles || []);
    const currentExtraImages = newArtworkForm.extraImages || [];
    const currentPreviews = newArtworkForm.extraImagePreviews || [];
    
    const newPreviews = files.map(f => URL.createObjectURL(f));
    
    setNewArtworkForm({
      ...newArtworkForm,
      extraImages: [...currentExtraImages, ...files],
      extraImagePreviews: [...currentPreviews, ...newPreviews]
    });
  }, [newArtworkForm]);

  // Remove individual extra image
  const removeExtraImage = useCallback((index) => {
    const newExtraImages = newArtworkForm.extraImages.filter((_, i) => i !== index);
    const newExtraPreviews = newArtworkForm.extraImagePreviews.filter((_, i) => i !== index);
    
    setNewArtworkForm({
      ...newArtworkForm,
      extraImages: newExtraImages,
      extraImagePreviews: newExtraPreviews
    });
  }, [newArtworkForm]);

  // Delete artwork
  const deleteArtwork = useCallback((id) => {
    if (window.confirm('🗑️ Delete this artwork? This action cannot be undone.')) {
      setArtworks(prev => prev.filter(art => art.id !== id));
      setSelectedArtworkId(null);
      setChanged(true);
    }
  }, []);

  // Get sorted and filtered artworks
  const getFilteredArtworks = useCallback(() => {
    let filtered = artworks.filter(art =>
      art.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      art.category.toLowerCase().includes(searchFilter.toLowerCase())
    );

    switch (sortBy) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'order':
      default:
        filtered.sort((a, b) => a.order - b.order);
    }

    return filtered;
  }, [artworks, searchFilter, sortBy]);

  // Now safe to have early returns
  if (loading) {
    return (
      <div className="manager-overlay">
        <div className="manager-container">
          <div className="manager-loading">Loading site data...</div>
        </div>
      </div>
    );
  }

  // Password Authentication
  if (!authenticated) {
    return (
      <div className="manager-overlay" onClick={onClose}>
        <div className="manager-auth-box" onClick={(e) => e.stopPropagation()}>
          <div className="manager-auth-header">
            <h2>🔐 SITE MANAGER</h2>
            <button className="manager-close" onClick={onClose}>✕</button>
          </div>
          <div className="manager-auth-content">
            <p>Administrative access required</p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (passwordInput === MANAGER_PASSWORD) {
                    setAuthenticated(true);
                  } else {
                    alert('❌ Incorrect password');
                    setPasswordInput('');
                  }
                }
              }}
              placeholder="Enter password..."
              className="manager-password-input"
              autoFocus
            />
            <div className="manager-auth-buttons">
              <button
                className="manager-btn-primary"
                onClick={() => {
                  if (passwordInput === MANAGER_PASSWORD) {
                    setAuthenticated(true);
                  } else {
                    alert('❌ Incorrect password');
                    setPasswordInput('');
                  }
                }}
              >
                UNLOCK
              </button>
              <button className="manager-btn-secondary" onClick={onClose}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedArtwork = artworks.find((a) => a.id === selectedArtworkId);

  return (
    <div className="manager-overlay" onClick={onClose}>
      <div className="manager-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="manager-header">
          <h1>⚙️ SITE MANAGER</h1>
          <button className="manager-close" onClick={onClose} title="Close (Alt+W)">✕</button>
        </div>

        {/* Tabs */}
        <div className="manager-tabs">
          <button
            className={`manager-tab ${activeTab === 'artworks' ? 'active' : ''}`}
            onClick={() => setActiveTab('artworks')}
          >
            🖼 ARTWORKS ({artworks.length})
          </button>
          <button
            className={`manager-tab ${activeTab === 'operations' ? 'active' : ''}`}
            onClick={() => setActiveTab('operations')}
          >
            📋 CATEGORIES ({operations.length})
          </button>
        </div>

        {/* Content */}
        <div className="manager-content">
          {/* Artworks Tab */}
          {activeTab === 'artworks' && (
            <div className="manager-tab-content">
              <div className="manager-artworks-header">
                <div>
                  <h2>🖼️ MANAGE ARTWORKS</h2>
                  <p>Total: {artworks.length} artworks</p>
                </div>
                <button 
                  className="manager-btn-primary"
                  onClick={() => setShowAddForm(true)}
                >
                  ➕ ADD ARTWORK
                </button>
              </div>

              {/* Search and Sort Controls */}
              <div className="manager-controls">
                <input
                  type="text"
                  placeholder="🔍 Search artworks..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="manager-search-input"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="manager-sort-select"
                >
                  <option value="order">Sort: Order</option>
                  <option value="title">Sort: Title</option>
                  <option value="category">Sort: Category</option>
                </select>
              </div>

              {/* Add Artwork Form Modal */}
              {showAddForm && (
                <div className="manager-form-modal">
                  <div className="manager-form-box">
                    <div className="manager-form-header">
                      <h3>➕ ADD NEW ARTWORK</h3>
                      <button 
                        className="manager-close" 
                        onClick={() => setShowAddForm(false)}
                      >✕</button>
                    </div>
                    <div className="manager-form-content">
                      <div className="manager-field">
                        <label>Title *</label>
                        <input
                          type="text"
                          value={newArtworkForm.title}
                          onChange={(e) => setNewArtworkForm({...newArtworkForm, title: e.target.value})}
                          className="manager-input"
                          placeholder="Artwork title"
                        />
                      </div>

                      <div className="manager-form-row">
                        <div className="manager-field">
                          <label>Category *</label>
                          <select
                            value={newArtworkForm.category}
                            onChange={(e) => setNewArtworkForm({...newArtworkForm, category: e.target.value})}
                            className="manager-input"
                          >
                            <option value="">Select category</option>
                            {operations.map((op) => (
                              <option key={op.id} value={op.name}>
                                {op.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="manager-field">
                          <label>Subcategory</label>
                          <select
                            value={newArtworkForm.subcategory}
                            onChange={(e) => setNewArtworkForm({...newArtworkForm, subcategory: e.target.value})}
                            className="manager-input"
                          >
                            <option value="">None</option>
                            {operations.find((op) => op.name === newArtworkForm.category)?.subcategories.map((sub) => (
                              <option key={sub.id} value={sub.name}>
                                {sub.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="manager-form-row">
                        <div className="manager-field">
                          <label>Year</label>
                          <input
                            type="text"
                            value={newArtworkForm.year}
                            onChange={(e) => setNewArtworkForm({...newArtworkForm, year: e.target.value})}
                            className="manager-input"
                          />
                        </div>

                        <div className="manager-field">
                          <label>Medium</label>
                          <input
                            type="text"
                            value={newArtworkForm.medium}
                            onChange={(e) => setNewArtworkForm({...newArtworkForm, medium: e.target.value})}
                            className="manager-input"
                            placeholder="e.g., Digital Painting"
                          />
                        </div>
                      </div>

                      <div className="manager-field">
                        <label>Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={newArtworkForm.tags}
                          onChange={(e) => setNewArtworkForm({...newArtworkForm, tags: e.target.value})}
                          className="manager-input"
                          placeholder="character, anime, redraw"
                        />
                      </div>

                      <div className="manager-field">
                        <label>Tools Used (comma-separated)</label>
                        <input
                          type="text"
                          value={newArtworkForm.tools}
                          onChange={(e) => setNewArtworkForm({...newArtworkForm, tools: e.target.value})}
                          className="manager-input"
                          placeholder="Photoshop, Clip Studio Paint, Pen Tool"
                        />
                      </div>

                      <div className="manager-field">
                        <label>Commission Status</label>
                        <select
                          value={newArtworkForm.commissionStatus}
                          onChange={(e) => setNewArtworkForm({...newArtworkForm, commissionStatus: e.target.value})}
                          className="manager-input"
                        >
                          <option value="OPEN">Open for Commission</option>
                          <option value="CLOSED">Closed for Commission</option>
                          <option value="PORTFOLIO">Portfolio Only</option>
                        </select>
                      </div>

                      <div className="manager-field">
                        <label>Description</label>
                        <textarea
                          value={newArtworkForm.description}
                          onChange={(e) => setNewArtworkForm({...newArtworkForm, description: e.target.value})}
                          className="manager-textarea"
                          rows={4}
                          placeholder="Artwork description, story, process, or notes..."
                        />
                      </div>

                      {/* Main Image Upload */}
                      <div className="manager-upload-section">
                        <h4>📸 Main Image *</h4>
                        <div className="manager-upload-box">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const preview = URL.createObjectURL(file);
                                setNewArtworkForm({
                                  ...newArtworkForm,
                                  mainImage: file,
                                  mainImagePreview: preview
                                });
                              }
                            }}
                            className="manager-file-input"
                          />
                          {newArtworkForm.mainImagePreview ? (
                            <div className="manager-preview">
                              <img src={newArtworkForm.mainImagePreview} alt="Preview" />
                              <p className="manager-file-name">{newArtworkForm.mainImage?.name}</p>
                            </div>
                          ) : (
                            <div className="manager-upload-placeholder">
                              <p>📁 Click or drag to upload main image</p>
                              <small>JPG, PNG, GIF (Max 50MB)</small>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Additional Images */}
                      <div className="manager-upload-section">
                        <h4>🖼️ Additional Images (Optional)</h4>
                        
                        {/* Existing images grid */}
                        {newArtworkForm.extraImagePreviews.length > 0 && (
                          <div className="manager-extra-images-list">
                            <p className="manager-file-count">
                              ✅ {newArtworkForm.extraImagePreviews.length} image{newArtworkForm.extraImagePreviews.length !== 1 ? 's' : ''} added
                            </p>
                            <div className="manager-thumbnail-grid-removable">
                              {newArtworkForm.extraImagePreviews.map((preview, idx) => (
                                <div key={idx} className="manager-thumbnail-item">
                                  <img src={preview} alt={`Extra ${idx + 1}`} title={newArtworkForm.extraImages[idx]?.name} />
                                  <div className="manager-thumbnail-overlay">
                                    <button
                                      className="manager-thumbnail-remove"
                                      onClick={() => removeExtraImage(idx)}
                                      title="Remove this image"
                                    >
                                      🗑️ REMOVE
                                    </button>
                                  </div>
                                  <p className="manager-thumbnail-filename">
                                    {newArtworkForm.extraImages[idx]?.name.slice(0, 15)}...
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Upload box for adding more images */}
                        <div className="manager-upload-box manager-upload-multiple">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleAddExtraImages(e.target.files)}
                            className="manager-file-input"
                          />
                          <div className="manager-upload-placeholder">
                            <p>📁 {newArtworkForm.extraImagePreviews.length > 0 ? 'Click to add more images' : 'Click or drag to upload additional images'}</p>
                            <small>{newArtworkForm.extraImagePreviews.length > 0 ? 'Add process shots, WIPs, or variations' : 'Add multiple process shots, WIPs, variations'}</small>
                          </div>
                        </div>
                      </div>

                      <div className="manager-form-info">
                        <p>ℹ️ <strong>Folder Structure Will Be Created:</strong></p>
                        <code>
                          artwork/{newArtworkForm.category.replace(/\s+/g, '_')}/{newArtworkForm.title.replace(/\s+/g, '_').slice(0, 20)}/
                        </code>
                        <p className="manager-form-info-text">
                          Images will be automatically organized with variants: main, main-thumb, main-web, main-hd
                        </p>
                      </div>

                      <div className="manager-form-buttons">
                        <button 
                          className="manager-btn-primary"
                          onClick={addNewArtwork}
                          disabled={!newArtworkForm.mainImage}
                        >
                          ✅ PUBLISH ARTWORK
                        </button>
                        <button 
                          className="manager-btn-secondary"
                          onClick={() => setShowAddForm(false)}
                        >
                          ❌ CANCEL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="manager-split">
                <div className="manager-list">
                  {getFilteredArtworks().map((art) => (
                    <div
                      key={art.id}
                      className={`manager-item ${selectedArtworkId === art.id ? 'active' : ''}`}
                    >
                      <div
                        className="manager-item-content"
                        onClick={() => setSelectedArtworkId(art.id)}
                      >
                        <div className="manager-item-thumb">
                          {art.imageThumb && <img src={art.imageThumb} alt={art.title} loading="lazy" />}
                        </div>
                        <div className="manager-item-info">
                          <div className="manager-item-title">{art.title}</div>
                          <div className="manager-item-category">{art.category}</div>
                          <div className="manager-item-year">{art.year}</div>
                        </div>
                      </div>
                      <button
                        className="manager-item-delete"
                        onClick={() => deleteArtwork(art.id)}
                        title="Delete artwork"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                <div className="manager-editor">
                  {selectedArtwork ? (
                    <>
                      <div className="manager-editor-header">
                        <h3>{selectedArtwork.title}</h3>
                        <span className="manager-editor-id">ID: {selectedArtwork.id}</span>
                      </div>
                      <div className="manager-form">
                        <div className="manager-field">
                          <label>Category</label>
                          <select
                            value={selectedArtwork.category || ''}
                            onChange={(e) => updateArtwork(selectedArtworkId, 'category', e.target.value)}
                            className="manager-input"
                          >
                            <option value="">Select category</option>
                            {operations.map((op) => (
                              <option key={op.id} value={op.name}>
                                {op.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="manager-field">
                          <label>Subcategory</label>
                          <select
                            value={selectedArtwork.subcategory || ''}
                            onChange={(e) => updateArtwork(selectedArtworkId, 'subcategory', e.target.value)}
                            className="manager-input"
                          >
                            <option value="">None</option>
                            {operations.find((op) => op.name === selectedArtwork.category)?.subcategories.map((sub) => (
                              <option key={sub.id} value={sub.name}>
                                {sub.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="manager-field">
                          <label>Title</label>
                          <input
                            type="text"
                            value={selectedArtwork.title || ''}
                            onChange={(e) => updateArtwork(selectedArtworkId, 'title', e.target.value)}
                            className="manager-input"
                          />
                        </div>

                        <div className="manager-field">
                          <label>Year</label>
                          <input
                            type="text"
                            value={selectedArtwork.year || ''}
                            onChange={(e) => updateArtwork(selectedArtworkId, 'year', e.target.value)}
                            className="manager-input"
                          />
                        </div>

                        <div className="manager-field">
                          <label>Medium</label>
                          <input
                            type="text"
                            value={selectedArtwork.medium || ''}
                            onChange={(e) => updateArtwork(selectedArtworkId, 'medium', e.target.value)}
                            className="manager-input"
                          />
                        </div>

                        <div className="manager-field">
                          <label>Tags (comma-separated)</label>
                          <input
                            type="text"
                            value={Array.isArray(selectedArtwork.tags) ? selectedArtwork.tags.join(', ') : ''}
                            onChange={(e) => {
                              const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                              updateArtwork(selectedArtworkId, 'tags', tags);
                            }}
                            className="manager-input"
                          />
                        </div>

                        <div className="manager-field">
                          <label>Description</label>
                          <textarea
                            value={selectedArtwork.description || ''}
                            onChange={(e) => updateArtwork(selectedArtworkId, 'description', e.target.value)}
                            className="manager-textarea"
                            rows={4}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="manager-empty-editor">Select an artwork to edit</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Operations Tab */}
          {activeTab === 'operations' && (
            <div className="manager-tab-content">
              <div className="manager-ops-header">
                <h2>MANAGE CATEGORIES</h2>
                <button className="manager-btn-small" onClick={addOperation}>
                  + ADD CATEGORY
                </button>
              </div>

              <div className="manager-ops-list">
                {operations.map((op) => (
                  <div key={op.id} className="manager-op-card">
                    <div className="manager-op-top">
                      <div className="manager-op-edit">
                        <label>Icon</label>
                        <input
                          type="text"
                          value={op.icon || ''}
                          onChange={(e) => updateOperation(op.id, 'icon', e.target.value)}
                          className="manager-input-small"
                          maxLength="2"
                        />
                      </div>
                      <div className="manager-op-edit" style={{ flex: 1 }}>
                        <label>Name</label>
                        <input
                          type="text"
                          value={op.name}
                          onChange={(e) => updateOperation(op.id, 'name', e.target.value)}
                          className="manager-input"
                        />
                      </div>
                      <button
                        className="manager-btn-danger"
                        onClick={() => deleteOperation(op.id)}
                      >
                        DELETE
                      </button>
                    </div>

                    <div className="manager-op-subcats">
                      <div className="manager-subcat-header">
                        <h4>Subcategories</h4>
                        <button className="manager-btn-small" onClick={() => addSubcategory(op.id)}>
                          + ADD
                        </button>
                      </div>

                      {op.subcategories.map((sub) => (
                        <div key={sub.id} className="manager-subcat-item">
                          <input
                            type="text"
                            value={sub.name}
                            onChange={(e) => updateSubcategory(op.id, sub.id, 'name', e.target.value)}
                            className="manager-input-small"
                          />
                          <button
                            className="manager-btn-danger-small"
                            onClick={() => deleteSubcategory(op.id, sub.id)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="manager-footer">
          {changed && <span className="manager-changed">● Unsaved changes</span>}
          <div className="manager-footer-buttons">
            <button 
              className="manager-btn-primary" 
              onClick={exportData}
              style={{opacity: changed ? 1 : 0.5}}
            >
              💾 SAVE CHANGES
            </button>
            <button className="manager-btn-secondary" onClick={onClose}>
              CLOSE (Alt+W)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
