import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import CoreEngine from './components/CoreEngine';
import OperationalWorkflow from './components/OperationalWorkflow';
import AIChatbotWidget from './components/AIChatbotWidget';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import TimelinePage from './pages/TimelinePage';
import SettingsPage from './pages/SettingsPage';
import EntityPage from './pages/EntityPage';
import CasesPage from './pages/CasesPage';
import NetworkPage from './pages/NetworkPage';

export default function App({ initialPage = 'home' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Derive current page directly from URL location path
  const getCurrentPage = () => {
    const path = location.pathname.replace(/^\//, '').toLowerCase().trim();
    if (!path) return initialPage || 'home';
    if (path.startsWith('cases')) return 'cases';
    if (path.startsWith('entities')) return 'entities';
    if (path.startsWith('timeline')) return 'timeline';
    if (path.startsWith('dashboard')) return 'dashboard';
    if (path.startsWith('network')) return 'network';
    if (path.startsWith('settings')) return 'settings';
    if (path.startsWith('anomalies')) return 'anomalies';
    if (path.startsWith('location')) return 'location';
    return initialPage || 'home';
  };

  const currentPage = getCurrentPage();

  const handleNavigate = (page) => {
    if (page === 'ai_assistant') {
      setIsAIChatOpen(true);
      window.dispatchEvent(new CustomEvent('crimelens:open-ai-chat'));
      return;
    }
    if (page === 'reports') {
      navigate('/reports');
    } else if (page === 'home') {
      navigate('/');
    } else {
      navigate(`/${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="cyber-grid-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Main Navigation Bar */}
      <Navbar activePage={currentPage} onNavigate={handleNavigate} />

      {/* When on Home Page: Clean full-width landing layout without sidebar */}
      {currentPage === 'home' ? (
        <main style={{ flex: 1 }}>
          <Hero
            onExplore={() => handleNavigate('dashboard')}
            onNavigate={handleNavigate}
          />
          <CoreEngine />
          <OperationalWorkflow />
          <Footer onNavigate={handleNavigate} />
        </main>
      ) : (
        /* On All Other Pages: Pinned Collapsible Sidebar on Left + Content View on Right */
        <div style={{
          display: 'flex',
          flex: 1,
          minHeight: 'calc(100vh - 68px)',
          position: 'relative',
          width: '100%'
        }}>
          {/* Tactical Collapsible Sidebar */}
          <Sidebar
              activePage={currentPage}
              onNavigate={handleNavigate}
              isCollapsed={isSidebarCollapsed}
              onToggle={toggleSidebar}
            />

          {/* Main Content Area */}
          <main style={{
            flex: 1,
            minWidth: 0,
            overflowY: 'auto',
            backgroundColor: 'var(--bg-dark)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            {currentPage === 'dashboard' && (
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

            {currentPage === 'cases' && (
              <CasesPage />
            )}

            {currentPage === 'network' && (
              <NetworkPage onNavigate={handleNavigate} />
            )}

            {/* Tactical Fallbacks / Modules for Network, Anomalies, Location, Influencers, Cases */}
            {(currentPage === 'anomalies' || currentPage === 'location' || currentPage === 'ai_assistant') && (
              <div style={{
                flex: 1,
                padding: '2.5rem 3rem',
                maxWidth: '1350px',
                margin: '0 auto',
                width: '100%'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '2rem',
                  borderBottom: '1px solid rgba(0, 229, 255, 0.15)',
                  paddingBottom: '1rem'
                }}>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--cyan-glow)',
                      letterSpacing: '1.5px',
                      marginBottom: '6px'
                    }}>
                      // TACTICAL INTELLIGENCE FEED
                    </div>
                    <h1 style={{
                      fontSize: '2rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}>
                      {currentPage === 'anomalies' && '⚡ Real-time Threat Anomalies'}
                      {currentPage === 'location' && '📍 Geospatial Vectors & Tracking'}
                      {currentPage === 'ai_assistant' && '🤖 Neural Copilot & AI Investigation'}
                    </h1>
                  </div>

                  <button
                    onClick={() => handleNavigate('dashboard')}
                    className="btn-outline-cyan"
                    style={{ fontSize: '11.5px', padding: '8px 16px' }}
                  >
                    ← BACK TO DASHBOARD
                  </button>
                </div>

                <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    fontSize: '28px'
                  }}>
                    {currentPage === 'anomalies' && '⚡'}
                    {currentPage === 'location' && '📍'}
                    {currentPage === 'ai_assistant' && '🤖'}
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    Active Telemetry Stream Initialized
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto 1.5rem auto', fontSize: '13.5px' }}>
                    Neural processing pipeline is actively mapping {currentPage.toUpperCase()} vectors. You can cross-reference findings directly with the Timeline, Entity 360 Dossier, or Main Dashboard.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button onClick={() => handleNavigate('entities')} className="btn-cyan">
                      VIEW ENTITY 360 DOSSIER
                    </button>
                    <button onClick={() => handleNavigate('timeline')} className="btn-outline-cyan">
                      CHECK TIMELINE
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Global AI Intelligence Chatbot Widget */}
      <AIChatbotWidget
        isOpen={isAIChatOpen}
        onToggle={setIsAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />
    </div>
  );
}
