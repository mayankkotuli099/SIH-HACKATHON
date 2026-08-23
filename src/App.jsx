import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CoreEngine from './components/CoreEngine';
import OperationalWorkflow from './components/OperationalWorkflow';
import AIChatbotWidget from './components/AIChatbotWidget';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="cyber-grid-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Hero />
        <CoreEngine />
        <OperationalWorkflow />
      </main>
      <Footer />
      <AIChatbotWidget />
    </div>
  );
}
