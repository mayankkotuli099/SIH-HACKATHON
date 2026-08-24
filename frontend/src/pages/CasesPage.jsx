import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '../services/api.js';
import './CasesPage.css';

export default function CasesPage() {
  const [tracking, setTracking] = useState(true);
  const [casesList, setCasesList] = useState([]);
  const mapElement = useRef(null);
  const mapInstance = useRef(null);
  const [assetStatus, setAssetStatus] = useState('ACTIVE');

  useEffect(() => {
    async function loadCases() {
      try {
        const data = await api.cases.getAll();
        if (data && data.cases) {
          setCasesList(data.cases);
        }
      } catch (err) {
        console.warn('Using local cases cache');
      }
    }
    loadCases();
  }, []);
  useEffect(() => {
    if (!mapElement.current || mapInstance.current) return undefined;

    const map = L.map(mapElement.current, { zoomControl: false, attributionControl: true }).setView([22.5937, 78.9629], 5);
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const target = L.circleMarker([28.6139, 77.209], {
      radius: 9,
      color: '#ffd1cd',
      weight: 2,
      fillColor: '#ff9f98',
      fillOpacity: 1
    }).addTo(map).bindPopup('<strong>TGT_ALPHA_99</strong><br/>Unauthorized movement detected');

    const asset = L.circleMarker([19.076, 72.8777], {
      radius: 9,
      color: '#9dffff',
      weight: 2,
      fillColor: '#00dce8',
      fillOpacity: 1
    }).addTo(map).bindPopup('<strong>ASSET_B</strong><br/>Intercept unit deployed');

    target.on('click', () => setAssetStatus('HIGH PRIORITY'));
    asset.on('click', () => setAssetStatus('ACTIVE'));
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <section className="cases-screen">
      <main className="case-map">
        <div ref={mapElement} className="live-map" aria-label="Live sector map" />
        <div className="tracking-bar"><div><span>T-MINUS 24:00:00</span><button onClick={() => setTracking(!tracking)} aria-label="Toggle live tracking"><b style={{ left: tracking ? '74%' : '10%' }} /></button><span>{tracking ? 'LIVE TRACKING' : 'TRACKING PAUSED'}</span></div></div>
      </main>
      <aside className="sector-insights">
        <div className="insights-title"><h1>SECTOR INSIGHTS</h1><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20V10l4 4 4-8 4 5 4-7v16" /><path d="M3 20h18" /></svg></div>
        <article className="anomaly-card"><div className="card-kicker">ANOMALY DETECTED <em>HIGH PRIORITY</em></div><h2>UNAUTHORIZED MOVEMENT</h2><p>Target TGT_ALPHA_99 deviated from projected patrol route by 4.2km in Sector 7G.</p><div className="bars"><b /><b /><b /><b /></div></article>
        <article className="asset-card"><div className="card-kicker">ASSET STATUS <em className="active">{assetStatus}</em></div><h2>ASSET_B DEPLOYED</h2><p>Asset intercept vector calculated. ETA to target vicinity: 14 mins.</p></article>
        <article className="telemetry"><div className="card-kicker">ENVIRONMENTAL TELEMETRY</div><div><span>TRAFFIC DENSITY<strong>84% CONGESTED</strong></span><span>SIGINT NOISE<strong>ELEVATED</strong></span></div></article>
      </aside>
    </section>
  );
}
