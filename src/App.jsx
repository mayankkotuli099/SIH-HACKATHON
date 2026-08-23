import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CoreEngine from './components/CoreEngine';
import OperationalWorkflow from './components/OperationalWorkflow';
import AIChatbotWidget from './components/AIChatbotWidget';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import TimelinePage from './pages/TimelinePage';
import SettingsPage from './pages/SettingsPage';

export default function App({ initialPage = 'home' }) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="cyber-grid-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activePage={currentPage} onNavigate={handleNavigate} />

      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <>
            <Hero onExplore={() => handleNavigate('dashboard')} />
            <CoreEngine />
            <OperationalWorkflow />
          </>
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'timeline' && (
          <TimelinePage onNavigate={handleNavigate} />
        )}

        {currentPage === 'settings' && (
          <SettingsPage onNavigate={handleNavigate} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
      <AIChatbotWidget />
    </div>
  );
}
