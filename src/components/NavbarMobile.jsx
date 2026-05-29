import { useState } from 'react';
import { useRenderTheme } from '../context/RenderThemeContext';
import { scrollToSection } from '../utils/scrollToSection';

export const NavbarMobile = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { themeIndex, increaseRenderTheme } = useRenderTheme();

  const navItems = [
    { label: 'HOME', id: 'hero' },
    { label: 'GALLERY', id: 'gallery' },
    { label: 'ABOUT', id: 'about' },
    { label: 'COMMISSIONS', id: 'clearance-hub' },
    { label: 'NETWORK', id: 'network' }
  ];

  const handleNav = (id) => {
    scrollToSection(id);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Fixed Header */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '48px',
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          alignItems: 'center',
          paddingLeft: '12px',
          paddingRight: '12px',
          gap: '8px',
          zIndex: 100,
          backdropFilter: 'blur(2px)'
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--accent-red)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            cursor: 'pointer'
          }}
          onClick={() => handleNav('hero')}
        >
          LETREZDRAW
        </div>

        {/* Theme Switcher */}
        <button
          type="button"
          onClick={increaseRenderTheme}
          style={{
            fontSize: '22px',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            background: 'transparent',
            padding: '4px 8px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'var(--accent-red)';
            e.target.style.borderColor = 'var(--accent-red)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'var(--text-secondary)';
            e.target.style.borderColor = 'var(--border-color)';
          }}
        >
          [{themeIndex}]
        </button>

        {/* Menu Toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            fontSize: '22px',
            color: 'var(--text-primary)',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: '4px 8px'
          }}
        >
          {menuOpen ? '✕' : '≡'}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '48px',
            left: 0,
            right: 0,
            background: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 99
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              style={{
                padding: '12px 16px',
                fontSize: '22px',
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border-color)',
                textAlign: 'left',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--accent-red)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--text-secondary)';
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};
