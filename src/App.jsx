import { useState, useEffect } from 'react';
import { initPointerStore } from './pointerStore';
import { useIsMobile } from './hooks/useIsMobile';
// Desktop components
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Operations } from './components/Operations';
import { Marquee } from './components/Marquee';
import { About } from './components/About';
import { ClearanceHub } from './components/ClearanceHub';
import { Network } from './components/Network';
// Mobile components
import { NavbarMobile } from './components/NavbarMobile';
import { HeroMobile } from './components/HeroMobile';
import { MarqueeMobile } from './components/MarqueeMobile';
import { GalleryMobile } from './components/GalleryMobile';
import { AboutMobile } from './components/AboutMobile';
import { ClearanceHubMobile } from './components/ClearanceHubMobile';
import { NetworkMobile } from './components/NetworkMobile';
import { FooterMobile } from './components/FooterMobile';
// Shared components
import { RedString } from './components/RedString';
import { CustomCursor } from './components/CustomCursor';
import { SiteManager } from './components/SiteManager';
import { BootSequence } from './components/BootSequence';
// Data
import { artworks as allArtworks } from './data/artworks';
import { hydrateArtwork } from './utils/artworkUrls';
import './index.css';

// Page visibility detection for performance optimization
const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isVisible;
};

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [bootInProgress, setBootInProgress] = useState(true);
  const isPageVisible = usePageVisibility();
  const isMobile = useIsMobile();

  const [mobileArtworks, setMobileArtworks] = useState([]);

  useEffect(() => {
    return initPointerStore();
  }, []);

  // Manage overflow during boot
  useEffect(() => {
    if (bootInProgress) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [bootInProgress]);

  useEffect(() => {
    // Screen flicker effect - disable when page not visible
    if (!isPageVisible) return;

    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.92) {
        document.body.style.animation = 'flicker-screen 0.08s ease';
        setTimeout(() => {
          document.body.style.animation = 'none';
        }, 80);
      }
    }, 5000 + Math.random() * 10000);

    return () => clearInterval(flickerInterval);
  }, [isPageVisible]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 48);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Site Manager keyboard shortcut (Alt+W)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.altKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        setManagerOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Manage body class for loading state
  useEffect(() => {
    if (isPageLoading) {
      document.body.classList.add('loading-active');
    } else {
      document.body.classList.remove('loading-active');
    }

    return () => {
      document.body.classList.remove('loading-active');
    };
  }, [isPageLoading]);

  // Mobile artwork manifest load (hooks must not be inside conditional returns)
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const base = import.meta.env.BASE_URL || '/';
        const url = `${base}artwork-manifest.json`.replace(/\/{2,}/g, '/');
        const res = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`manifest fetch failed: ${res.status}`);

        const manifest = await res.json();
        const hydrated = manifest.map(hydrateArtwork);

        if (!cancelled) {
          setMobileArtworks(hydrated);
          setIsPageLoading(false);
        }
      } catch {
        if (!cancelled) {
          setMobileArtworks(allArtworks.map(hydrateArtwork));
          setIsPageLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Mobile View
  if (isMobile) {
    return (
      <div className="app-root app-root-mobile">
        {/* Boot Sequence Overlay */}
        {bootInProgress && <BootSequence onBootComplete={() => setBootInProgress(false)} />}

        {/* Loading Overlay */}
        {isPageLoading && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <p className="loading-text">INITIALIZING...</p>
            </div>
          </div>
        )}
        <CustomCursor />
        <NavbarMobile style={{ visibility: bootInProgress ? 'hidden' : 'visible' }} />
        <main className="app-main-mobile" style={{ marginTop: '48px', visibility: bootInProgress ? 'hidden' : 'visible' }}>
          <HeroMobile />
          <MarqueeMobile
            text="◈ CHARACTER DESIGN ◈ CONCEPT ART ◈ COMMISSIONS OPEN ◈"
            direction="left"
            speed="slow"
          />
          <GalleryMobile artworks={mobileArtworks} />
          <AboutMobile />
          <ClearanceHubMobile />
          <NetworkMobile />
          <FooterMobile />
        </main>
        {managerOpen && <SiteManager onClose={() => setManagerOpen(false)} />}
      </div>
    );
  }

  // Desktop View
  return (
    <div className="app-root">
      {/* Boot Sequence Overlay */}
      {bootInProgress && <BootSequence onBootComplete={() => setBootInProgress(false)} />}

      {/* Loading Overlay */}
      {isPageLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p className="loading-text">INITIALIZING...</p>
          </div>
        </div>
      )}

      {/* Custom Cursor and Red String Effects */}
      <CustomCursor />
      <RedString />

      {/* Sidebar */}
      <Sidebar style={{ visibility: bootInProgress ? 'hidden' : 'visible' }} />

      {/* Navbar */}
      <Navbar scrolled={scrolled} style={{ visibility: bootInProgress ? 'hidden' : 'visible' }} />

      {/* Main Content */}
      <main className="app-main" style={{ visibility: bootInProgress ? 'hidden' : 'visible' }}>
        {/* Hero Section */}
        <Hero />

        {/* Marquee 1 */}
        <Marquee
          text="◈ CHARACTER DESIGN ◈ CONCEPT ART ◈ ENVIRONMENT ART ◈ DIGITAL ILLUSTRATION ◈ COMMISSION OPEN ◈"
          direction="left"
          speed="slow"
        />

        {/* Gallery - Browse by Operations */}
        {mobileArtworks.length > 0 && <Operations artworks={mobileArtworks} />}

        {/* Marquee 2 */}
        <Marquee
          text="// CLASSIFIED // DECLASSIFIED // RESTRICTED // AUTHORIZED // TOP SECRET // ART FILES //"
          direction="right"
          speed="medium"
        />

        {/* About */}
        <About />

        {/* Marquee 3 */}
        <Marquee
          text="◈ HUMAN MADE ◈ NO AI ◈ PUNE INDIA ◈ REMOTE WORLDWIDE ◈ OPEN FOR WORK ◈"
          direction="left"
          speed="slow"
        />

        {/* Clearance + transmission (commissions & contact) */}
        <ClearanceHub />

        {/* Social network */}
        <Network />
      </main>

      {/* Site Manager */}
      {managerOpen && <SiteManager onClose={() => setManagerOpen(false)} />}
    </div>
  );
}

export default App;
