import React, { useState } from 'react';
import './NetworkPage.css';

const navItems = ['ANOMALIES', 'LOCATION', 'INFLUENCERS', 'AI ASSISTANT'];

export default function NetworkPage({ onNavigate }) {
  const [active, setActive] = useState('INFLUENCERS');
  const [selected, setSelected] = useState('ID-8924A');
  const influencers = [
    { id: 'ID-8924A', score: '98.2', detail: 'Centrality: 0.92 · 142 Connections', type: 'person' },
    { id: 'FRONT_ORG_X', score: '45.1', detail: 'Centrality: 0.76 · 89 Connections', type: 'org' }
  ];
  return <section className="influencer-screen">
    <aside className="influencer-side">
      <div className="influencer-operator"><div>O1</div><p><b>OPERATOR_01</b><span>LEVEL 4 ACCESS</span></p></div>
      <div className="influencer-nav">{navItems.map(item => <button key={item} className={active === item ? 'active' : ''} onClick={() => setActive(item)}><i>{item === 'ANOMALIES' ? '◎' : item === 'LOCATION' ? '⌖' : item === 'INFLUENCERS' ? '◉' : '◌'}</i>{item}</button>)}</div>
      <div className="influencer-bottom"><button onClick={() => onNavigate?.('settings')}>⚙ SETTINGS</button><button>ⓘ HELP</button></div>
    </aside>
    <main className="influencer-main">
      <header><h1>NETWORK INFLUENCERS</h1><p>Identifying key actors through graph centrality and community analysis. Data reflects real-time SIGINT aggregations.</p></header>
      <section className="influencer-metrics"><div><span>Total Influence Nodes</span><b>1,492</b></div><div><span>Detected Communities</span><b>8</b></div><div><span>Average Degree Centrality</span><b>0.84</b></div></section>
      <section className="influencer-lists">
        <div className="syndicates"><h2>Top Syndicates <em>♟</em></h2><article><i className="cyan-dot"/><p><b>Syndicate Alpha</b><span>Tech Sector · 42 Nodes</span></p><strong>High<br/>Risk</strong></article><article><i className="red-dot"/><p><b>Syndicate Beta</b><span>Finance · 28 Nodes</span></p><strong className="critical">Critical</strong></article></div>
        <div className="ranked"><h2>Ranked Influencers <button>VIEW ALL</button></h2>{influencers.map(item => <article key={item.id}><i className="identity-icon">{item.type === 'person' ? '♙' : '▦'}</i><p><b>{item.id}</b><span>{item.detail}</span></p><strong className={item.score === '98.2' ? 'danger-score' : 'safe-score'}>{item.score}<small>RISK SCORE</small></strong><button className={selected === item.id ? 'investigate selected' : 'investigate'} onClick={() => setSelected(item.id)}>INVESTIGATE</button></article>)}</div>
      </section>
    </main>
  </section>;
}
