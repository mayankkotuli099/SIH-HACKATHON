import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AIChatbotWidget from './components/AIChatbotWidget';
import DashboardPage from './pages/DashboardPage';
import TimelinePage from './pages/TimelinePage';
import SettingsPage from './pages/SettingsPage';
import EntityPage from './pages/EntityPage';
import CasesPage from './pages/CasesPage';
import NetworkPage from './pages/NetworkPage';
import LocationPage from './pages/LocationPage';
import Reports from '../pages/Reports';
import CDRForensicsIngestion from './components/CDRForensicsIngestion';
import GlobalSearchModal from './components/GlobalSearchModal';

export default function App({ initialPage = 'dashboard' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isIngestionOpen, setIsIngestionOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Derive current page directly from URL location path & query
  const getCurrentPage = () => {
    const path = location.pathname.replace(/^\//, '').toLowerCase().trim();
    const searchParams = new URLSearchParams(location.search);
    if (path.startsWith('cases') && searchParams.get('tab')?.toUpperCase() === 'EVIDENCE') return 'evidence';
    if (!path) return initialPage === 'home' ? 'dashboard' : (initialPage || 'dashboard');
    if (path.startsWith('cases')) return 'cases';
    if (path.startsWith('entities')) return 'entities';
    if (path.startsWith('timeline')) return 'timeline';
    if (path.startsWith('dashboard') || path.startsWith('home')) return 'dashboard';
    if (path.startsWith('network')) return 'network';
    if (path.startsWith('settings')) return 'settings';
    if (path.startsWith('anomalies')) return 'anomalies';
    if (path.startsWith('location')) return 'location';
    if (path.startsWith('reports')) return 'reports';
    return initialPage === 'home' ? 'dashboard' : (initialPage || 'dashboard');
  };

  const currentPage = getCurrentPage();

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener('crimelens:open-global-search', handleOpenSearch);
    return () => window.removeEventListener('crimelens:open-global-search', handleOpenSearch);
  }, []);

  const handleNavigate = (page, extra) => {
    setIsMobileSidebarOpen(false);

    if (page === 'ai_assistant') {
      setIsAIChatOpen(true);
      window.dispatchEvent(new CustomEvent('crimelens:open-ai-chat'));
      return;
    }
    if (page === 'ingestion') {
      setIsIngestionOpen(true);
      return;
    }
    if (page === 'evidence') {
      navigate('/cases?tab=EVIDENCE');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (page === 'reports') {
      navigate('/reports');
    } else if (page === 'home' || page === 'dashboard') {
      navigate('/dashboard');
    } else if (extra && extra.suspect) {
      navigate(`/${page}?suspect=${encodeURIComponent(extra.suspect)}`);
    } else if (extra && extra.caseId) {
      navigate(`/${page}?case=${encodeURIComponent(extra.caseId)}`);
    } else if (typeof extra === 'string') {
      navigate(`/${page}?${extra}`);
    } else {
      navigate(`/${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="crimelens-layout-root">
      {/* 1. Permanent Fixed 300px Global Sidebar (Present on Home/Dashboard and All Routes) */}
      <Sidebar
        activePage={currentPage}
        onNavigate={handleNavigate}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Backdrop overlay for mobile drawer */}
      {isMobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 999
          }}
        />
      )}

      {/* 2. Main Viewport Container (Offset 300px on desktop to prevent overlap) */}
      <div className="crimelens-main-viewport">
        {/* Top Contextual Utility Bar / Page Header */}
        <Navbar
          activePage={currentPage}
          onNavigate={handleNavigate}
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* 3. Main Content Area (Independently scrollable) */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            overflowY: 'auto',
            backgroundColor: 'var(--bg-app)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          {(currentPage === 'dashboard' || currentPage === 'home') && (
            <DashboardPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'network' && (
            <NetworkPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'timeline' && (
            <TimelinePage onNavigate={handleNavigate} />
          )}

          {currentPage === 'entities' && (
            <EntityPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'settings' && (
            <SettingsPage onNavigate={handleNavigate} />
          )}

          {(currentPage === 'cases' || currentPage === 'evidence') && (
            <CasesPage />
          )}

          {currentPage === 'location' && (
            <LocationPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'reports' && (
            <Reports embedded={true} onNavigate={handleNavigate} />
          )}

          {/* Tactical Fallbacks / Modules for Anomalies and AI Copilot */}
          {(currentPage === 'anomalies' || currentPage === 'ai_assistant') && (
            <div
              style={{
                flex: 1,
                padding: '2rem 2.5rem',
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '1rem'
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#1e40af',
                      letterSpacing: '1px',
                      marginBottom: '4px'
                    }}
                  >
                    INTELLIGENCE & ANALYSIS
                  </div>
                  <h1
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: '#0f172a'
                    }}
                  >
                    {currentPage === 'anomalies' && 'Real-time Threat Anomalies'}
                    {currentPage === 'ai_assistant' && 'Neural Copilot & AI Investigation'}
                  </h1>
                </div>

                <button
                  onClick={() => handleNavigate('dashboard')}
                  className="btn-secondary"
                  style={{ fontSize: '12px' }}
                >
                  ← Back to Overview
                </button>
              </div>

              <div className="cl-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '8px',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                    fontSize: '24px'
                  }}
                >
                  {currentPage === 'anomalies' && '⚡'}
                  {currentPage === 'ai_assistant' && '🤖'}
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  Active Intelligence Stream Ready
                </h3>
                <p style={{ color: '#64748b', maxWidth: '520px', margin: '0 auto 1.5rem auto', fontSize: '13.5px' }}>
                  Forensic processing pipeline is actively mapping {currentPage.toUpperCase()} vectors. You can cross-reference findings directly with the Timeline, Entity 360 Dossier, or Main Dashboard.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                  <button onClick={() => handleNavigate('entities')} className="btn-primary">
                    View Suspects 360°
                  </button>
                  <button onClick={() => handleNavigate('timeline')} className="btn-secondary">
                    Check Timeline & Map
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global AI Intelligence Chatbot Widget */}
      <AIChatbotWidget
        isOpen={isAIChatOpen}
        onToggle={setIsAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />

      {/* Global CDR & Forensic Data Ingestion Hub Modal */}
      <CDRForensicsIngestion
        isOpen={isIngestionOpen}
        onClose={() => setIsIngestionOpen(false)}
        onIngestSuccess={() => {
          setIsIngestionOpen(false);
          handleNavigate('location');
        }}
      />

      {/* Global Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
