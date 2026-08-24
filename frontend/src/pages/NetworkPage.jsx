  import React, { useState, useEffect } from 'react';
  import { api } from '../services/api.js';

  export default function NetworkTopologyPage({ onNavigate }) {
    const [networkData, setNetworkData] = useState(null);
    const [selectedEntity, setSelectedEntity] = useState({
      name: 'MAHESH KHAN',
      id: 'ENT_001_4545',
      risk: 'HIGH RISK',
      type: 'Individual',
      firstSeen: '15 Jan 2024',
      connections: 24,
      riskScore: '98.5%',
      cluster: 'Alpha_9',
      activityLevel: 'High'
    });

    useEffect(() => {
      async function loadNetwork() {
        try {
          const data = await api.network.getClusters();
          if (data && data.clusters) {
            setNetworkData(data.clusters);
          }
        } catch (err) {
          console.warn('Network cache fallback active.');
        }
      }
      loadNetwork();
    }, []);

    const [activeTab, setActiveTab] = useState('Network Overview');
    const [filterTime, setFilterTime] = useState('Last 30 Days');
    const [filterRisk, setFilterRisk] = useState('All Levels');
    const [filterType, setFilterType] = useState('All Types');

    return (
      <div style={{
        flex: 1,
        backgroundColor: 'var(--bg-dark)',
        color: 'var(--text-primary)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        padding: '1.5rem 2rem',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* Keyframe Animations & Global Styles */}
        <style>{`
          :root {
            --bg-dark: #070c14;
            --card-bg: rgba(11, 18, 30, 0.85);
            --border-color: rgba(0, 229, 255, 0.15);
            --cyan-glow: #00e5ff;
            --coral-glow: #ff4d4d;
            --orange-glow: #ff9900;
            --text-muted: #64748b;
            --text-secondary: #94a3b8;
          }

          /* Continuous Pulse Animation for High Risk Central Node */
          @keyframes pulseGlow {
            0% {
              r: 20px;
              opacity: 0.8;
              stroke-width: 1.5px;
            }
            50% {
              r: 30px;
              opacity: 0.2;
              stroke-width: 3px;
            }
            100% {
              r: 20px;
              opacity: 0.8;
              stroke-width: 1.5px;
            }
          }

          /* Subtle Floating Animation for Nodes */
          @keyframes nodeFloat {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
            100% { transform: translateY(0px); }
          }

          /* Radar Scanning Line Animation */
          @keyframes radarScan {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* Dashed Line Data Flow Animation */
          @keyframes dashFlow {
            to {
              stroke-dashoffset: -20;
            }
          }

          .pulse-ring {
            animation: pulseGlow 2.5s infinite ease-in-out;
            transform-origin: center;
          }

          .floating-node {
            animation: nodeFloat 4s infinite ease-in-out;
          }

          .animated-edge {
            stroke-dasharray: 4;
            animation: dashFlow 1s linear infinite;
          }

          .interactive-btn {
            transition: all 0.2s ease;
          }
          .interactive-btn:hover {
            border-color: var(--cyan-glow) !important;
            color: #ffffff !important;
            box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
          }

          .node-group {
            cursor: pointer;
            transition: transform 0.2s ease, filter 0.2s ease;
          }
          .node-group:hover {
            filter: drop-shadow(0 0 10px currentColor);
          }
        `}</style>

        {/* Main Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr 300px',
          gap: '1.25rem',
          alignItems: 'start'
        }}>

          {/* ================= LEFT PANEL ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <div style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                color: 'var(--cyan-glow)',
                letterSpacing: '1px',
                marginBottom: '4px'
              }}>
                // NETWORK ANALYSIS
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Visualize relationships & connections
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { label: 'Network Overview', icon: '🌐' },
                  { label: 'Clusters', icon: '⚛' },
                  { label: 'Communities', icon: '👥' },
                  { label: 'Key Influencers', icon: '👑' },
                  { label: 'Connection Map', icon: '🗺' },
                  { label: 'Network Metrics', icon: '📊' }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setActiveTab(item.label)}
                    className="interactive-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: activeTab === item.label ? '600' : '400',
                      color: activeTab === item.label ? 'var(--cyan-glow)' : 'var(--text-secondary)',
                      backgroundColor: activeTab === item.label ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
                      border: `1px solid ${activeTab === item.label ? 'rgba(0, 229, 255, 0.3)' : 'transparent'}`,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '1rem', fontWeight: 700 }}>
                FILTERS
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Time Range</label>
                  <select value={filterTime} onChange={(e) => setFilterTime(e.target.value)} style={{ width: '100%', backgroundColor: 'rgba(7, 12, 20, 0.8)', border: '1px solid rgba(0, 229, 255, 0.2)', color: '#fff', padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
                    <option>Last 30 Days</option>
                    <option>Last 7 Days</option>
                    <option>Last 24 Hours</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Risk Level</label>
                  <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)} style={{ width: '100%', backgroundColor: 'rgba(7, 12, 20, 0.8)', border: '1px solid rgba(0, 229, 255, 0.2)', color: '#fff', padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
                    <option>All Levels</option>
                    <option>High Risk Only</option>
                    <option>Medium Risk Only</option>
                  </select>
                </div>

                <button className="interactive-btn" style={{ width: '100%', backgroundColor: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--cyan-glow)', color: 'var(--cyan-glow)', padding: '8px', borderRadius: '4px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>
                  APPLY FILTERS
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'monospace' }}>
                <span style={{ color: 'var(--text-secondary)' }}>SYSTEM STATUS</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>● OPERATIONAL</span>
              </div>
            </div>

          </div>

          {/* ================= CENTER GRAPH CANVAS ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '1.25rem',
              position: 'relative',
              minHeight: '520px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px', margin: 0 }}>
                    NETWORK TOPOLOGY
                  </h2>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Interactive visualization of entity relationships and connections
                  </span>
                </div>

                <button className="interactive-btn" style={{ backgroundColor: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.2)', color: 'var(--cyan-glow)', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>
                  🔍 VIEW OPTIONS ▾
                </button>
              </div>

              {/* SVG Interactive Canvas */}
              <div style={{ flex: 1, position: 'relative', width: '100%', height: '380px' }}>
                <svg width="100%" height="100%" viewBox="0 0 600 380" style={{ overflow: 'visible' }}>
                  
                  {/* Edge Lines */}
                  <g stroke="rgba(0, 229, 255, 0.25)" strokeWidth="1">
                    <line x1="300" y1="190" x2="180" y2="120" />
                    <line x1="300" y1="190" x2="280" y2="80" />
                    <line x1="300" y1="190" x2="420" y2="110" />
                    <line x1="300" y1="190" x2="460" y2="200" />
                    <line x1="300" y1="190" x2="410" y2="280" />
                    <line x1="300" y1="190" x2="280" y2="310" />
                    <line x1="300" y1="190" x2="190" y2="270" />
                    
                    {/* Animated Dashed Active Connection Edge */}
                    <line x1="300" y1="190" x2="160" y2="190" stroke="var(--cyan-glow)" strokeWidth="1.5" className="animated-edge" />

                    {/* Secondary Edges */}
                    <line x1="180" y1="120" x2="130" y2="90" />
                    <line x1="180" y1="120" x2="140" y2="140" />
                    <line x1="280" y1="80" x2="240" y2="50" />
                    <line x1="420" y1="110" x2="480" y2="120" />
                    <line x1="410" y1="280" x2="450" y2="330" />
                  </g>

                  {/* Nodes with Floating Animation */}
                  <g className="floating-node">
                    {/* Outer Low-Risk Nodes */}
                    {[
                      { x: 130, y: 90 }, { x: 140, y: 140 }, { x: 240, y: 50 },
                      { x: 480, y: 120 }, { x: 450, y: 330 }
                    ].map((pos, i) => (
                      <circle key={i} cx={pos.x} cy={pos.y} r="5" fill="#00e5ff" style={{ filter: 'drop-shadow(0 0 4px #00e5ff)' }} />
                    ))}

                    {/* Medium Risk Orange Nodes */}
                    <g className="node-group" onClick={() => setSelectedEntity({ ...selectedEntity, name: 'SAMEER ALI', risk: 'MEDIUM RISK' })}>
                      <circle cx="180" cy="120" r="10" fill="#ff9900" />
                      <text x="180" y="140" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold">SAMEER ALI</text>
                    </g>

                    <g className="node-group" onClick={() => setSelectedEntity({ ...selectedEntity, name: 'RAHUL VERMA', risk: 'MEDIUM RISK' })}>
                      <circle cx="280" cy="80" r="10" fill="#ff9900" />
                      <text x="280" y="62" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold">RAHUL VERMA</text>
                    </g>

                    <g className="node-group" onClick={() => setSelectedEntity({ ...selectedEntity, name: 'VIKRAM SINGH', risk: 'MEDIUM RISK' })}>
                      <circle cx="420" cy="110" r="10" fill="#ff9900" />
                      <text x="420" y="130" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold">VIKRAM SINGH</text>
                    </g>
                  </g>

                  {/* Central Animated High-Risk Node (Mahesh Khan) */}
                  <g className="node-group" onClick={() => setSelectedEntity({
                    name: 'MAHESH KHAN',
                    id: 'ENT_001_4545',
                    risk: 'HIGH RISK',
                    type: 'Individual',
                    firstSeen: '15 Jan 2024',
                    connections: 24,
                    riskScore: '98.5%',
                    cluster: 'Alpha_9',
                    activityLevel: 'High'
                  })}>
                    {/* Animated Pulsing Outer Halo */}
                    <circle cx="300" cy="190" r="24" fill="rgba(255, 77, 77, 0.15)" stroke="#ff4d4d" className="pulse-ring" />
                    <circle cx="300" cy="190" r="14" fill="#ff4d4d" style={{ filter: 'drop-shadow(0 0 12px #ff4d4d)' }} />
                    <text x="300" y="222" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="800">MAHESH KHAN</text>
                    <text x="300" y="233" fill="#ff4d4d" fontSize="8" textAnchor="middle" fontWeight="bold">HIGH RISK</text>
                  </g>

                </svg>
              </div>

              {/* Legend Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff4d4d' }}></span> High Risk</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff9900' }}></span> Medium Risk</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00e5ff' }}></span> Low Risk</span>
                </div>
              </div>

            </div>

            {/* Selected Entity Details */}
            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
              <div style={{ fontSize: '11px', color: 'var(--cyan-glow)', fontFamily: 'monospace', marginBottom: '10px' }}>🎯 SELECTED ENTITY DETAILS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedEntity.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>ID: {selectedEntity.id}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>CONNECTIONS</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{selectedEntity.connections}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>RISK SCORE</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--coral-glow)' }}>{selectedEntity.riskScore}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>CLUSTER</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--cyan-glow)' }}>{selectedEntity.cluster}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>ACTIVITY</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff9900' }}>{selectedEntity.activityLevel}</div>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT METRICS PANEL ================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 700 }}>NETWORK STATISTICS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Entities</span><strong>206</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Relationships</span><strong>98</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Connected Components</span><strong>12</strong></div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 700 }}>QUICK ACTIONS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button className="interactive-btn" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>👤 View Profile</button>
                <button className="interactive-btn" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>☆ Add Watchlist</button>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }