import { useState, useEffect, useRef } from 'react';
import '../styles/ArtworkDashboard.css';

const DASHBOARD_PASSWORD = 'G311soham@';  // 🔑 Change this to your password

export const ArtworkDashboard = ({ onClose }) => {
  const [artworks, setArtworks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const fileInputRef = useRef(null);

  // Load manifest on mount
  useEffect(() => {
    const loadManifest = async () => {
      try {
        const manifestUrl = `${import.meta.env.BASE_URL}artwork-manifest.json?t=${Date.now()}`;
        const res = await fetch(manifestUrl);
        if (!res.ok) throw new Error(`Failed to load manifest: ${res.status}`);
        const data = await res.json();
        setArtworks(data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadManifest();
  }, []);

  const handleEdit = (id, field, value) => {
    setArtworks(
      artworks.map((art) =>
        art.id === id ? { ...art, [field]: value } : art
      )
    );
    setChanged(true);
  };

  const handleArrayEdit = (id, field, value) => {
    const arr = value.split(',').map((v) => v.trim()).filter(Boolean);
    handleEdit(id, field, arr);
  };

  const handleMove = (index, direction) => {
    const newArtworks = [...artworks];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newArtworks.length) return;
    [newArtworks[index], newArtworks[newIndex]] = [
      newArtworks[newIndex],
      newArtworks[index],
    ];
    setArtworks(newArtworks);
    setChanged(true);
  };

  const handleExport = () => {
    const json = JSON.stringify(artworks, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'artwork-manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!Array.isArray(data)) throw new Error('Invalid format: expected array');
        setArtworks(data);
        setChanged(false);
        alert('✅ Manifest imported successfully!\n\nCopy the exported JSON to public/artwork-manifest.json');
      } catch (err) {
        alert(`❌ Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const categories = ['all', ...new Set(artworks.map((a) => a.category))];
  const filtered = filterCategory === 'all'
    ? artworks
    : artworks.filter((a) => a.category === filterCategory);

  const selected = artworks.find((a) => a.id === selectedId);

  if (loading)
    return (
      <div className="dashboard-overlay">
        <div className="dashboard-container">
          <div className="dashboard-loading">Loading artworks...</div>
        </div>
      </div>
    );

  // 🔐 PASSWORD AUTHENTICATION
  if (!authenticated) {
    return (
      <div className="dashboard-overlay" onClick={onClose}>
        <div className="dashboard-container-small" onClick={(e) => e.stopPropagation()}>
          <div className="dashboard-auth-header">
            <h2>🔐 Admin Dashboard</h2>
            <button className="dashboard-close" onClick={onClose}>✕</button>
          </div>
          
          <div className="dashboard-auth-content">
            <p>Enter password to manage artworks:</p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (passwordInput === DASHBOARD_PASSWORD) {
                    setAuthenticated(true);
                  } else {
                    alert('❌ Wrong password!');
                    setPasswordInput('');
                  }
                }
              }}
              placeholder="Enter password..."
              className="dashboard-password-input"
              autoFocus
            />
            <div className="dashboard-auth-buttons">
              <button
                className="dashboard-btn-primary"
                onClick={() => {
                  if (passwordInput === DASHBOARD_PASSWORD) {
                    setAuthenticated(true);
                  } else {
                    alert('❌ Wrong password!');
                    setPasswordInput('');
                  }
                }}
              >
                Unlock
              </button>
              <button
                className="dashboard-btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="dashboard-auth-hint">
            💡 <strong>Hint:</strong> Check your email or ask the developer
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-overlay" onClick={onClose}>
      <div className="dashboard-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dashboard-header">
          <h1>🎨 Artwork Manager</h1>
          <button
            className="dashboard-close"
            onClick={onClose}
            title="Close (Alt+Q)"
          >
            ✕
          </button>
        </div>

        {/* Error */}
        {error && <div className="dashboard-error">{error}</div>}

        <div className="dashboard-content">
          {/* Left Panel - List */}
          <div className="dashboard-list-panel">
            <div className="dashboard-list-header">
              <h2>Artworks ({filtered.length})</h2>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="dashboard-filter"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="dashboard-list">
              {filtered.map((artwork) => (
                <div
                  key={artwork.id}
                  className={`dashboard-item ${
                    selectedId === artwork.id ? 'active' : ''
                  }`}
                  onClick={() => setSelectedId(artwork.id)}
                >
                  <div className="dashboard-item-thumb">
                    {artwork.imageThumb && (
                      <img src={artwork.imageThumb} alt={artwork.title} />
                    )}
                  </div>
                  <div className="dashboard-item-info">
                    <div className="dashboard-item-id">{artwork.id}</div>
                    <div className="dashboard-item-title">{artwork.title}</div>
                    <div className="dashboard-item-category">{artwork.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Editor */}
          <div className="dashboard-editor-panel">
            {selected ? (
              <>
                <div className="dashboard-editor-header">
                  <h3>{selected.title}</h3>
                  <div className="dashboard-editor-controls">
                    <button
                      onClick={() =>
                        handleMove(
                          artworks.findIndex((a) => a.id === selectedId),
                          -1
                        )
                      }
                      className="dashboard-btn-small"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() =>
                        handleMove(
                          artworks.findIndex((a) => a.id === selectedId),
                          1
                        )
                      }
                      className="dashboard-btn-small"
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>
                </div>

                <div className="dashboard-editor-form">
                  {/* Folder */}
                  <div className="dashboard-field">
                    <label>Folder</label>
                    <input
                      type="text"
                      value={selected.folder || ''}
                      readOnly
                      className="dashboard-input-readonly"
                    />
                  </div>

                  {/* Title */}
                  <div className="dashboard-field">
                    <label>Title</label>
                    <input
                      type="text"
                      value={selected.title}
                      onChange={(e) => handleEdit(selectedId, 'title', e.target.value)}
                      className="dashboard-input"
                    />
                  </div>

                  {/* Category */}
                  <div className="dashboard-field">
                    <label>Category</label>
                    <input
                      type="text"
                      value={selected.category}
                      onChange={(e) => handleEdit(selectedId, 'category', e.target.value)}
                      className="dashboard-input"
                    />
                  </div>

                  {/* Year */}
                  <div className="dashboard-field">
                    <label>Year</label>
                    <input
                      type="text"
                      value={selected.year || ''}
                      onChange={(e) => handleEdit(selectedId, 'year', e.target.value)}
                      className="dashboard-input"
                      placeholder="e.g., 2025"
                    />
                  </div>

                  {/* Medium */}
                  <div className="dashboard-field">
                    <label>Medium</label>
                    <input
                      type="text"
                      value={selected.medium || ''}
                      onChange={(e) => handleEdit(selectedId, 'medium', e.target.value)}
                      className="dashboard-input"
                      placeholder="e.g., Digital / Photoshop"
                    />
                  </div>

                  {/* Tags */}
                  <div className="dashboard-field">
                    <label>Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(selected.tags) ? selected.tags.join(', ') : ''}
                      onChange={(e) => handleArrayEdit(selectedId, 'tags', e.target.value)}
                      className="dashboard-input"
                      placeholder="e.g., character, digital, stylized"
                    />
                  </div>

                  {/* Tools */}
                  <div className="dashboard-field">
                    <label>Tools (comma-separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(selected.tools) ? selected.tools.join(', ') : ''}
                      onChange={(e) => handleArrayEdit(selectedId, 'tools', e.target.value)}
                      className="dashboard-input"
                      placeholder="e.g., Photoshop, Wacom, Procreate"
                    />
                  </div>

                  {/* Commission Status */}
                  <div className="dashboard-field">
                    <label>Commission Status</label>
                    <select
                      value={selected.commissionStatus || 'OPEN'}
                      onChange={(e) =>
                        handleEdit(selectedId, 'commissionStatus', e.target.value)
                      }
                      className="dashboard-input"
                    >
                      <option value="OPEN">Open</option>
                      <option value="CLOSED">Closed</option>
                      <option value="AVAILABLE">Available</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="dashboard-field">
                    <label>Description</label>
                    <textarea
                      value={selected.description || ''}
                      onChange={(e) =>
                        handleEdit(selectedId, 'description', e.target.value)
                      }
                      className="dashboard-textarea"
                      placeholder="Enter detailed description..."
                      rows={4}
                    />
                  </div>

                  {/* Image Paths */}
                  <div className="dashboard-field">
                    <label>Primary Image</label>
                    <input
                      type="text"
                      value={selected.image || ''}
                      readOnly
                      className="dashboard-input-readonly"
                    />
                  </div>

                  {selected.imageThumb && (
                    <div className="dashboard-field">
                      <label>Thumbnail</label>
                      <input
                        type="text"
                        value={selected.imageThumb}
                        readOnly
                        className="dashboard-input-readonly"
                      />
                    </div>
                  )}

                  {selected.imageWeb && (
                    <div className="dashboard-field">
                      <label>Web Optimized</label>
                      <input
                        type="text"
                        value={selected.imageWeb}
                        readOnly
                        className="dashboard-input-readonly"
                      />
                    </div>
                  )}

                  {selected.imageHd && (
                    <div className="dashboard-field">
                      <label>HD (Full Resolution)</label>
                      <input
                        type="text"
                        value={selected.imageHd}
                        readOnly
                        className="dashboard-input-readonly"
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="dashboard-editor-empty">
                Select an artwork to edit metadata
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="dashboard-footer">
          <div className="dashboard-footer-status">
            {changed && <span className="dashboard-changed-indicator">● Changes made</span>}
            <span className="dashboard-info">
              {selected ? `Editing: ${selected.title}` : 'Select artwork'}
            </span>
          </div>

          <div className="dashboard-footer-buttons">
            <button className="dashboard-btn-secondary" onClick={() => fileInputRef.current?.click()}>
              📥 Import JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
            <button className="dashboard-btn-primary" onClick={handleExport}>
              📤 Export JSON
            </button>
            <button className="dashboard-btn-secondary" onClick={onClose}>
              Close (Alt+Q)
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="dashboard-instructions">
          <strong>📝 How to save changes:</strong>
          <ol>
            <li>Edit metadata above</li>
            <li>Click <strong>📤 Export JSON</strong></li>
            <li>Replace <code>public/artwork-manifest.json</code> with exported file</li>
            <li>Refresh page to see updates</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
