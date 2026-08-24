import React, { useState, useMemo } from 'react';
const INITIAL_NODES = [
  { id: 'MK', name: 'MAHESH KHAN', risk: 'HIGH RISK', riskScore: 98.5, type: 'Individual', color: '#ff4d4d' },
  { id: 'SA', name: 'SAMEER ALI', risk: 'MEDIUM RISK', riskScore: 65.0, type: 'Individual', color: '#ff9900' },
  { id: 'RV', name: 'RAHUL VERMA', risk: 'MEDIUM RISK', riskScore: 58.2, type: 'Individual', color: '#ff9900' },
  { id: 'VS', name: 'VIKRAM SINGH', risk: 'MEDIUM RISK', riskScore: 62.1, type: 'Individual', color: '#ff9900' },
  { id: 'AK', name: 'AJAY KUMAR', risk: 'LOW RISK', riskScore: 22.0, type: 'Individual', color: '#00e5ff' },
  { id: 'RD', name: 'ROHIT DAS', risk: 'MEDIUM RISK', riskScore: 54.0, type: 'Individual', color: '#ff9900' },
  { id: 'IQ', name: 'IMRAN QURESHI', risk: 'MEDIUM RISK', riskScore: 61.4, type: 'Individual', color: '#ff9900' },
  { id: 'DY', name: 'DEEPAK YADAV', risk: 'LOW RISK', riskScore: 18.5, type: 'Individual', color: '#00e5ff' },
  { id: 'AP', name: 'ARUN PATEL', risk: 'LOW RISK', riskScore: 12.0, type: 'Individual', color: '#00e5ff' },
];

const INITIAL_EDGES = [
  { source: 'MK', target: 'SA', weight: 0.9 },
  { source: 'MK', target: 'RV', weight: 0.8 },
  { source: 'MK', target: 'VS', weight: 0.85 },
  { source: 'MK', target: 'AK', weight: 0.4 },
  { source: 'MK', target: 'RD', weight: 0.75 },
  { source: 'MK', target: 'IQ', weight: 0.7 },
  { source: 'MK', target: 'DY', weight: 0.3 },
  { source: 'MK', target: 'AP', weight: 0.2 },
  { source: 'SA', target: 'AP', weight: 0.5 },
  { source: 'VS', target: 'AK', weight: 0.6 },
  { source: 'RD', target: 'IQ', weight: 0.65 },
];

export default function NetworkTopologyPage({ onNavigate }) {
  const [selectedEntity, setSelectedEntity] = useState(INITIAL_NODES[0]);
  const [activeTab, setActiveTab] = useState('Network Overview');
  const [showAnalysisDrawer, setShowAnalysisDrawer] = useState(false);
  const [analysisTab, setAnalysisTab] = useState('centrality'); 
  const [sourceNode, setSourceNode] = useState('AP');
  const [targetNode, setTargetNode] = useState('AK');
  const analysisData = useMemo(() => {
    const degreeMap = {};
    INITIAL_NODES.forEach(n => (degreeMap[n.id] = 0));
    INITIAL_EDGES.forEach(e => {
      degreeMap[e.source] = (degreeMap[e.source] || 0) + 1;
      degreeMap[e.target] = (degreeMap[e.target] || 0) + 1;
    });

    const totalNodes = INITIAL_NODES.length;
    const centralityList = INITIAL_NODES.map(node => {
      const degree = degreeMap[node.id] || 0;
      const normalizedDegree = (degree / (totalNodes - 1)).toFixed(2);
      const betweenness = node.id === 'MK' ? '0.84' : node.id === 'SA' ? '0.32' : '0.05';
      const eigenvector = node.id === 'MK' ? '0.99' : (degree * 0.12).toFixed(2);

      return {
        ...node,
        degree,
        normalizedDegree,
        betweenness,
        eigenvector
      };
    }).sort((a, b) => b.degree - a.degree);
    const findShortestPath = (start, end) => {
      const adjacency = {};
      INITIAL_NODES.forEach(n => (adjacency[n.id] = []));
      INITIAL_EDGES.forEach(e => {
        adjacency[e.source].push(e.target);
        adjacency[e.target].push(e.source);
      });

      const queue = [[start]];
      const visited = new Set([start]);

      while (queue.length > 0) {
        const path = queue.shift();
        const curr = path[path.length - 1];

        if (curr === end) return path;

        for (const neighbor of adjacency[curr] || []) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push([...path, neighbor]);
          }
        }
      }
      return [];
    };

    const calculatedPath = findShortestPath(sourceNode, targetNode);

    return {
      centralityList,
      calculatedPath
    };
  }, [sourceNode, targetNode]);

  return (
    <div style={{
      flex: 1,
      backgroundColor: '#03070d',
      color: '#e2e8f0',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '1.5rem 2rem',
      maxWidth: '1600px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      
      <style>{`
        :root {
          --card-bg: rgba(11, 18, 30, 0.85);
          --border-color: rgba(0, 229, 255, 0.15);
          --cyan-glow: #00e5ff;
          --coral-glow: #ff4d4d;
          --orange-glow: #ff9900;
          --text-muted: #64748b;
          --text-secondary: #94a3b8;
        }

        @keyframes pulseGlow {
          0%, 100% { r: 20px; opacity: 0.8; }
          50% { r: 28px; opacity: 0.2; }
        }

        .pulse-ring { animation: pulseGlow 2.5s infinite ease-in-out; transform-origin: center; }
        .interactive-btn { transition: all 0.2s ease; }
        .interactive-btn:hover { border-color: var(--cyan-glow) !important; color: #ffffff !important; box-shadow: 0 0 10px rgba(0, 229, 255, 0.2); }
        .node-group { cursor: pointer; transition: transform 0.2s ease; }
        .node-group:hover { filter: drop-shadow(0 0 8px currentColor); }
      `}</style>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 300px', gap: '1.25rem', alignItems: 'start' }}>

        {/* ================= LEFT COLUMN ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--cyan-glow)', letterSpacing: '1px', marginBottom: '4px' }}>// NETWORK ANALYSIS</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Visualize relationships & connections</div>

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
                  onClick={() => {
                    setActiveTab(item.label);
                    if (item.label === 'Network Metrics' || item.label === 'Key Influencers') {
                      setShowAnalysisDrawer(true);
                    }
                  }}
                  className="interactive-btn"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '8px 12px', borderRadius: '6px',
                    fontSize: '12px', fontWeight: activeTab === item.label ? '600' : '400',
                    color: activeTab === item.label ? 'var(--cyan-glow)' : 'var(--text-secondary)',
                    backgroundColor: activeTab === item.label ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
                    border: `1px solid ${activeTab === item.label ? 'rgba(0, 229, 255, 0.3)' : 'transparent'}`, cursor: 'pointer'
                  }}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 700 }}>ANALYSIS TOOLKIT</div>
            <button
              onClick={() => setShowAnalysisDrawer(!showAnalysisDrawer)}
              className="interactive-btn"
              style={{
                width: '100%', backgroundColor: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--cyan-glow)',
                color: 'var(--cyan-glow)', padding: '10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer'
              }}
            >
              {showAnalysisDrawer ? '⚡ CLOSE ANALYSIS PANEL' : '⚡ OPEN ADVANCED ANALYSIS'}
            </button>
          </div>
        </div>

        {/* ================= CENTER COLUMN ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', minHeight: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>NETWORK TOPOLOGY</h2>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Interactive visualization of entity relationships</span>
              </div>
              <button onClick={() => setShowAnalysisDrawer(true)} className="interactive-btn" style={{ backgroundColor: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.2)', color: 'var(--cyan-glow)', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>
                📊 RUN GRAPH ANALYTICS
              </button>
            </div>

            {/* SVG Visualizer */}
            <div style={{ position: 'relative', width: '100%', height: '360px' }}>
              <svg width="100%" height="100%" viewBox="0 0 600 360">
                <g stroke="rgba(0, 229, 255, 0.25)" strokeWidth="1">
                  {INITIAL_EDGES.map((edge, idx) => {
                    const isHighlighted = analysisData.calculatedPath.includes(edge.source) && analysisData.calculatedPath.includes(edge.target);
                    return (
                      <line
                        key={idx}
                        x1={edge.source === 'MK' ? 300 : edge.source === 'SA' ? 180 : edge.source === 'RV' ? 280 : edge.source === 'VS' ? 420 : edge.source === 'AK' ? 460 : edge.source === 'RD' ? 410 : edge.source === 'IQ' ? 280 : edge.source === 'DY' ? 190 : 160}
                        y1={edge.source === 'MK' ? 180 : edge.source === 'SA' ? 110 : edge.source === 'RV' ? 70 : edge.source === 'VS' ? 100 : edge.source === 'AK' ? 190 : edge.source === 'RD' ? 270 : edge.source === 'IQ' ? 300 : edge.source === 'DY' ? 260 : 180}
                        x2={edge.target === 'MK' ? 300 : edge.target === 'SA' ? 180 : edge.target === 'RV' ? 280 : edge.target === 'VS' ? 420 : edge.target === 'AK' ? 460 : edge.target === 'RD' ? 410 : edge.target === 'IQ' ? 280 : edge.target === 'DY' ? 190 : 160}
                        y2={edge.target === 'MK' ? 180 : edge.target === 'SA' ? 110 : edge.target === 'RV' ? 70 : edge.target === 'VS' ? 100 : edge.target === 'AK' ? 190 : edge.target === 'RD' ? 270 : edge.target === 'IQ' ? 300 : edge.target === 'DY' ? 260 : 180}
                        stroke={isHighlighted ? '#00e5ff' : 'rgba(0, 229, 255, 0.25)'}
                        strokeWidth={isHighlighted ? 2.5 : 1}
                      />
                    );
                  })}
                </g>

                {/* Nodes */}
                <g className="node-group" onClick={() => setSelectedEntity(INITIAL_NODES[0])}>
                  <circle cx="300" cy="180" r="22" fill="rgba(255, 77, 77, 0.2)" stroke="#ff4d4d" className="pulse-ring" />
                  <circle cx="300" cy="180" r="14" fill="#ff4d4d" />
                  <text x="300" y="210" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="800">MAHESH KHAN</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Dynamic Analysis Drawer Panel */}
          {showAnalysisDrawer && (
            <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--cyan-glow)', borderRadius: '8px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--cyan-glow)', fontFamily: 'monospace' }}>
                  🧠 NETWORK ANALYSIS & ALGORITHMIC METRICS
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['centrality', 'path', 'community'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setAnalysisTab(t)}
                      style={{
                        backgroundColor: analysisTab === t ? 'rgba(0,229,255,0.2)' : 'transparent',
                        border: '1px solid rgba(0,229,255,0.3)', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', textTransform: 'uppercase'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Centrality Analysis Tab */}
              {analysisTab === 'centrality' && (
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    Centrality algorithms identify influential nodes acting as bridges or hubs in the network.
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                          <th style={{ padding: '6px' }}>Entity</th>
                          <th style={{ padding: '6px' }}>Degree</th>
                          <th style={{ padding: '6px' }}>Norm. Centrality</th>
                          <th style={{ padding: '6px' }}>Betweenness</th>
                          <th style={{ padding: '6px' }}>Eigenvector</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisData.centralityList.map((item) => (
                          <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '6px', fontWeight: 'bold', color: item.color }}>{item.name}</td>
                            <td style={{ padding: '6px' }}>{item.degree} links</td>
                            <td style={{ padding: '6px', fontFamily: 'monospace' }}>{item.normalizedDegree}</td>
                            <td style={{ padding: '6px', fontFamily: 'monospace' }}>{item.betweenness}</td>
                            <td style={{ padding: '6px', fontFamily: 'monospace' }}>{item.eigenvector}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Path Routing Tab */}
              {analysisTab === 'path' && (
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    Calculate shortest connection paths between entities using Breadth-First Search (BFS).
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Source Node</label>
                      <select value={sourceNode} onChange={(e) => setSourceNode(e.target.value)} style={{ width: '100%', backgroundColor: '#070c14', border: '1px solid rgba(0,229,255,0.3)', color: '#fff', padding: '6px', borderRadius: '4px', fontSize: '11px' }}>
                        {INITIAL_NODES.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Target Node</label>
                      <select value={targetNode} onChange={(e) => setTargetNode(e.target.value)} style={{ width: '100%', backgroundColor: '#070c14', border: '1px solid rgba(0,229,255,0.3)', color: '#fff', padding: '6px', borderRadius: '4px', fontSize: '11px' }}>
                        {INITIAL_NODES.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(0, 229, 255, 0.05)', border: '1px dashed rgba(0, 229, 255, 0.3)', padding: '10px', borderRadius: '6px', fontSize: '11px' }}>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>SHORTEST ROUTE PATH ({analysisData.calculatedPath.length - 1} HOPS):</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: 'var(--cyan-glow)', fontFamily: 'monospace' }}>
                      {analysisData.calculatedPath.join(' ➔ ')}
                    </div>
                  </div>
                </div>
              )}

              {/* Community Detection Tab */}
              {analysisTab === 'community' && (
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    Louvain Modularily Clustering detected 3 primary communities in the current topology view.
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div style={{ border: '1px solid rgba(255,77,77,0.3)', padding: '8px', borderRadius: '4px', backgroundColor: 'rgba(255,77,77,0.05)' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#ff4d4d' }}>Cluster Alpha (Core)</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>3 Entities • High Density</div>
                    </div>
                    <div style={{ border: '1px solid rgba(255,153,0,0.3)', padding: '8px', borderRadius: '4px', backgroundColor: 'rgba(255,153,0,0.05)' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#ff9900' }}>Cluster Beta (Financial)</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>4 Entities • Med Density</div>
                    </div>
                    <div style={{ border: '1px solid rgba(0,229,255,0.3)', padding: '8px', borderRadius: '4px', backgroundColor: 'rgba(0,229,255,0.05)' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#00e5ff' }}>Cluster Gamma (Peripheral)</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>2 Entities • Low Density</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 700 }}>QUICK ACTIONS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button className="interactive-btn" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>👤 Full Profile</button>
              <button className="interactive-btn" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>☆ Watchlist</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}