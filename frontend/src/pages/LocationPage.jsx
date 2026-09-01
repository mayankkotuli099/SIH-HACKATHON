import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Radio,
  Navigation,
  Layers,
  AlertTriangle,
  ShieldAlert,
  Camera,
  MapPin,
  Clock,
  Eye,
  Sliders,
  Filter,
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api.js';

// Cell Towers in NCR Grid
const CELL_TOWERS = [
  {
    id: 'TWR-01',
    name: 'Sector 18 Market Main Mast',
    cellId: 'DEL-NCR-SEC18-04',
    lat: 28.4721,
    lng: 77.0392,
    radiusM: 650,
    azimuthDeg: 120,
    operator: 'Airtel STF Trunk',
    activeSuspectPings: 4,
    status: 'SURVEILLANCE_ACTIVE',
    color: '#00E5FF'
  },
  {
    id: 'TWR-02',
    name: 'Sector 14 Transit Hub Relay',
    cellId: 'DEL-NCR-SEC14-02',
    lat: 28.4595,
    lng: 77.0266,
    radiusM: 500,
    azimuthDeg: 270,
    operator: 'Jio Intercept Node',
    activeSuspectPings: 2,
    status: 'ACTIVE_INTERCEPT',
    color: '#00E5FF'
  },
  {
    id: 'TWR-03',
    name: 'KMP Expressway Toll Mast',
    cellId: 'DEL-NCR-KMP-09',
    lat: 28.3241,
    lng: 76.9102,
    radiusM: 1200,
    azimuthDeg: 350,
    operator: 'Highway Telecom Relay',
    activeSuspectPings: 3,
    status: 'HIGHWAY_MONITORING',
    color: '#00E5FF'
  },
  {
    id: 'TWR-04',
    name: 'South Delhi STF Special Cell Tower',
    cellId: 'DEL-S-LODHI-01',
    lat: 28.5880,
    lng: 77.2220,
    radiusM: 800,
    azimuthDeg: 90,
    operator: 'Special Cell Dedicated Mast',
    activeSuspectPings: 1,
    status: 'GOVT_SECURE',
    color: '#00E5FF'
  }
];

// ANPR Highway Cameras
const ANPR_CAMERAS = [
  {
    id: 'ANPR-01',
    name: 'KMP Toll Plaza Camera #04',
    lat: 28.3241,
    lng: 76.9102,
    lastHit: 'HR-26-BR-9921 (Getaway Truck)',
    suspect: 'Sameer Qureshi',
    timestamp: '2024-10-27 19:42 IST',
    speedKmph: 92,
    confidence: '99.4%'
  },
  {
    id: 'ANPR-02',
    name: 'IFFCO Chowk Flyover ANPR',
    lat: 28.4750,
    lng: 77.0650,
    lastHit: 'DL-3C-AS-7721 (Fake Taxi)',
    suspect: "Devendra 'D-7' Rawat",
    timestamp: '2024-10-27 18:55 IST',
    speedKmph: 48,
    confidence: '98.1%'
  },
  {
    id: 'ANPR-03',
    name: 'NH-48 Border Checkpost ANPR',
    lat: 28.5100,
    lng: 77.0900,
    lastHit: 'UP-14-MK-9942 (Duke Bike)',
    suspect: 'Mayank Kotoli',
    timestamp: '2024-10-27 19:15 IST',
    speedKmph: 110,
    confidence: '99.8%'
  }
];

// Crime Scenes / Incident Hotspots
const CRIME_SCENES = [
  {
    id: 'CS-01',
    title: 'Sector 18 Homicide Crime Scene',
    firNumber: 'FIR-2024-402',
    lat: 28.4721,
    lng: 77.0392,
    victim: 'Rival Syndicate Financier',
    crimeType: 'Homicide / 9mm Shootout',
    policeStation: 'PS Sector 18 Crime Branch',
    geofenceRadiusM: 600,
    threatLevel: 'CRITICAL',
    color: '#FF5555'
  },
  {
    id: 'CS-02',
    title: 'Sector 14 Transit Hub Stalking Scene',
    firNumber: 'FIR-2024-102',
    lat: 28.4595,
    lng: 77.0266,
    victim: 'Commuter Abduction Attempt',
    crimeType: 'Sexual Offense & Assault',
    policeStation: 'Women Safety PS Sector 14',
    geofenceRadiusM: 500,
    threatLevel: 'CRITICAL',
    color: '#C084FC'
  },
  {
    id: 'CS-03',
    title: 'Axis Bank Vault Armed Heist',
    firNumber: 'FIR-2024-103',
    lat: 28.4600,
    lng: 77.0300,
    victim: 'Axis Bank 14kg Gold Vault',
    crimeType: 'Armed Bank Dacoity',
    policeStation: 'Anti-Robbery Cell PS Sadar',
    geofenceRadiusM: 500,
    threatLevel: 'HIGH',
    color: '#FB923C'
  }
];

// Suspect Trajectory Waypoints across Timeline (17:00 to 20:30)
const SUSPECT_TRAJECTORIES = {
  'Mayank Kotoli': {
    color: '#FF5555',
    waypoints: [
      { time: '17:00', lat: 28.4200, lng: 77.0100, label: 'Sleeper Hideout (Badshahpur)' },
      { time: '17:45', lat: 28.4500, lng: 77.0250, label: 'Fuel Station Refuel' },
      { time: '18:15', lat: 28.4700, lng: 77.0350, label: 'Sector 18 Perimeter Recon' },
      { time: '18:45', lat: 28.4721, lng: 77.0392, label: 'CRIME SCENE: Sector 18 Shootout' },
      { time: '19:15', lat: 28.5100, lng: 77.0900, label: 'NH-48 Border Checkpost Escape' },
      { time: '20:00', lat: 28.5880, lng: 77.2220, label: 'Lodhi Road STF Radar Hit' }
    ]
  },
  "Devendra 'D-7' Rawat": {
    color: '#C084FC',
    waypoints: [
      { time: '17:00', lat: 28.4800, lng: 77.0800, label: 'Cyber Hub Parking' },
      { time: '17:45', lat: 28.4750, lng: 77.0650, label: 'IFFCO Chowk ANPR Hit' },
      { time: '18:15', lat: 28.4650, lng: 77.0450, label: 'Moving to Sector 14 Hub' },
      { time: '18:45', lat: 28.4595, lng: 77.0266, label: 'Sector 14 Transit Stalking' },
      { time: '19:15', lat: 28.4400, lng: 77.0100, label: 'Old Railway Road Slip' },
      { time: '20:00', lat: 28.4089, lng: 77.3178, label: 'Faridabad Border Infiltration' }
    ]
  },
  "Sameer 'Ghost' Qureshi": {
    color: '#FB923C',
    waypoints: [
      { time: '17:00', lat: 28.4400, lng: 77.0000, label: 'Warehouse Staging Base' },
      { time: '17:45', lat: 28.4600, lng: 77.0300, label: 'Axis Bank Heist Breach' },
      { time: '18:15', lat: 28.4650, lng: 77.0200, label: 'Getaway Eicher Truck Route' },
      { time: '18:45', lat: 28.4200, lng: 76.9800, label: 'Manesar Bypass Speeding' },
      { time: '19:15', lat: 28.3580, lng: 76.9380, label: 'KMP Expressway Entry' },
      { time: '20:00', lat: 28.3241, lng: 76.9102, label: 'KMP Toll Plaza ANPR Seizure' }
    ]
  }
};

export default function LocationPage({ onNavigate }) {
  const [layers, setLayers] = useState({
    cellTowers: true,
    anprCameras: true,
    crimeScenes: true,
    trajectories: true,
    triangulationRings: true
  });

  const [selectedSuspect, setSelectedSuspect] = useState('ALL');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0.5); // 0.0 to 1.0 (corresponds to 17:00 -> 20:00)
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [geofenceCollisionAlert, setGeofenceCollisionAlert] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef({});
  const animationTimerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  }, []);

  // Compute interpolated position along waypoints
  const getInterpolatedPosition = (waypoints, progress) => {
    if (!waypoints || waypoints.length === 0) return null;
    if (progress <= 0) return { lat: waypoints[0].lat, lng: waypoints[0].lng, label: waypoints[0].label, time: waypoints[0].time };
    if (progress >= 1) {
      const last = waypoints[waypoints.length - 1];
      return { lat: last.lat, lng: last.lng, label: last.label, time: last.time };
    }

    const totalSegments = waypoints.length - 1;
    const currentSegmentIndex = Math.min(Math.floor(progress * totalSegments), totalSegments - 1);
    const segmentFraction = (progress * totalSegments) - currentSegmentIndex;

    const p1 = waypoints[currentSegmentIndex];
    const p2 = waypoints[currentSegmentIndex + 1];

    const lat = p1.lat + (p2.lat - p1.lat) * segmentFraction;
    const lng = p1.lng + (p2.lng - p1.lng) * segmentFraction;

    return {
      lat,
      lng,
      label: segmentFraction > 0.5 ? p2.label : p1.label,
      time: p1.time
    };
  };

  // Check geofence collisions at current progress
  useEffect(() => {
    // Check if Mayank Kotoli and Devendra Rawat are both near Sector 18 (at progress ~0.60, 18:45)
    if (playbackProgress >= 0.55 && playbackProgress <= 0.70) {
      setGeofenceCollisionAlert({
        title: '🚨 GEOFENCE PROXIMITY COLLISION DETECTED',
        location: 'Sector 18 Crime Perimeter (600m Radius)',
        suspects: ['Mayank Kotoli (Shooter)', "Devendra 'D-7' Rawat (Co-located)", "Sameer Qureshi (Perimeter Truck)"],
        time: '18:45:00 IST',
        confidence: '99.8% GPS & Cell Tower Correlation'
      });
    } else {
      setGeofenceCollisionAlert(null);
    }
  }, [playbackProgress]);

  // Trajectory Animation Engine
  useEffect(() => {
    if (isPlaying) {
      animationTimerRef.current = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 1) {
            setIsPlaying(false);
            return 1;
          }
          return Math.min(1, prev + 0.008 * playbackSpeed);
        });
      }, 100);
    } else {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
    }

    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  // Function to render all GIS map layers
  const renderAllLayers = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous dynamic layers
    Object.values(layersGroupRef.current).forEach((grp) => {
      try {
        grp?.clearLayers();
      } catch {
        // ignore
      }
    });

    // 1. Cell Towers & Triangulation Cones
    if (layers.cellTowers && layersGroupRef.current.cellTowers) {
      CELL_TOWERS.forEach((twr) => {
        const marker = L.circleMarker([twr.lat, twr.lng], {
          radius: 9,
          color: '#FFFFFF',
          weight: 2,
          fillColor: twr.color,
          fillOpacity: 0.9
        });

        marker.bindPopup(`
          <div style="color: #07090E; font-family: sans-serif; min-width: 200px;">
            <div style="font-size: 10px; font-weight: 800; color: #0284C7;">📡 CELLULAR MAST NODE</div>
            <div style="font-size: 13px; font-weight: 800; margin: 2px 0;">${twr.name}</div>
            <div style="font-size: 11px; color: #475569;">Cell ID: ${twr.cellId}</div>
            <div style="font-size: 11px; color: #DC2626; font-weight: 700; margin-top: 4px;">
              ⚡ ${twr.activeSuspectPings} Active Intercept Pings
            </div>
          </div>
        `);

        marker.on('click', () => setSelectedItem({ type: 'CELL_TOWER', data: twr }));
        layersGroupRef.current.cellTowers.addLayer(marker);

        // Triangulation Range Circles
        if (layers.triangulationRings) {
          const circle = L.circle([twr.lat, twr.lng], {
            radius: twr.radiusM,
            color: '#00E5FF',
            weight: 1,
            dashArray: '4, 6',
            fillColor: '#00E5FF',
            fillOpacity: 0.08
          });
          layersGroupRef.current.cellTowers.addLayer(circle);
        }
      });
    }

    // 2. ANPR Highway Cameras
    if (layers.anprCameras && layersGroupRef.current.anprCameras) {
      ANPR_CAMERAS.forEach((cam) => {
        const marker = L.circleMarker([cam.lat, cam.lng], {
          radius: 8,
          color: '#07090E',
          weight: 2,
          fillColor: '#FACC15',
          fillOpacity: 0.95
        });

        marker.bindPopup(`
          <div style="color: #07090E; font-family: sans-serif; min-width: 210px;">
            <div style="font-size: 10px; font-weight: 800; color: #B45309;">📷 ANPR HIGHWAY HIT</div>
            <div style="font-size: 13px; font-weight: 800; margin: 2px 0;">${cam.name}</div>
            <div style="background: #FEF3C7; padding: 4px 6px; border-radius: 4px; font-size: 11px; margin: 4px 0;">
              <div><strong>Plate:</strong> <span style="color: #DC2626; font-weight: 800;">${cam.lastHit}</span></div>
              <div><strong>Suspect:</strong> ${cam.suspect} (${cam.speedKmph} km/h)</div>
            </div>
            <div style="font-size: 10px; color: #16A34A; font-weight: 700;">CONFIDENCE: ${cam.confidence}</div>
          </div>
        `);

        marker.on('click', () => setSelectedItem({ type: 'ANPR_CAMERA', data: cam }));
        layersGroupRef.current.anprCameras.addLayer(marker);
      });
    }

    // 3. Crime Scenes & Geofences
    if (layers.crimeScenes && layersGroupRef.current.crimeScenes) {
      CRIME_SCENES.forEach((cs) => {
        const marker = L.circleMarker([cs.lat, cs.lng], {
          radius: 11,
          color: '#FFFFFF',
          weight: 2.5,
          fillColor: cs.color,
          fillOpacity: 0.95
        });

        marker.bindPopup(`
          <div style="color: #07090E; font-family: sans-serif; min-width: 220px;">
            <div style="font-size: 10px; font-weight: 800; color: #DC2626;">🚨 CRIME SCENE PERIMETER</div>
            <div style="font-size: 13px; font-weight: 800; margin: 2px 0;">${cs.title}</div>
            <div style="font-size: 11px; color: #0284C7; font-weight: 700;">${cs.firNumber} • ${cs.policeStation}</div>
            <div style="margin-top: 4px; font-size: 11px; color: #475569;">Geofence Radius: ${cs.geofenceRadiusM}m</div>
          </div>
        `);

        marker.on('click', () => setSelectedItem({ type: 'CRIME_SCENE', data: cs }));
        layersGroupRef.current.crimeScenes.addLayer(marker);

        // Geofence Red Perimeter Ring
        const geofence = L.circle([cs.lat, cs.lng], {
          radius: cs.geofenceRadiusM,
          color: cs.color,
          weight: 1.5,
          dashArray: '6, 6',
          fillColor: cs.color,
          fillOpacity: 0.12
        });
        layersGroupRef.current.crimeScenes.addLayer(geofence);
      });
    }

    // 4. Suspect Animated Trajectories
    if (layers.trajectories && layersGroupRef.current.trajectories) {
      Object.entries(SUSPECT_TRAJECTORIES).forEach(([name, data]) => {
        if (selectedSuspect !== 'ALL' && selectedSuspect !== name) return;

        // Draw Historical Full Path
        const pathCoords = data.waypoints.map(w => [w.lat, w.lng]);
        const polyline = L.polyline(pathCoords, {
          color: data.color,
          weight: 2.5,
          dashArray: '5, 8',
          opacity: 0.55
        });
        layersGroupRef.current.trajectories.addLayer(polyline);

        // Interpolated Active Suspect Position at current progress
        const currentPos = getInterpolatedPosition(data.waypoints, playbackProgress);
        if (currentPos) {
          const suspectMarker = L.circleMarker([currentPos.lat, currentPos.lng], {
            radius: 10,
            color: '#FFFFFF',
            weight: 2.5,
            fillColor: data.color,
            fillOpacity: 1
          });

          suspectMarker.bindPopup(`
            <div style="color: #07090E; font-family: sans-serif; min-width: 200px;">
              <div style="font-size: 10px; font-weight: 800; color: #DC2626;">🎯 REAL-TIME SUSPECT VECTOR</div>
              <div style="font-size: 13.5px; font-weight: 800; color: #0F172A;">${name}</div>
              <div style="font-size: 11px; color: #475569; margin: 3px 0;">📍 ${currentPos.label}</div>
              <div style="font-size: 10px; color: #0284C7; font-weight: 700;">TIMESTAMP: ~${currentPos.time} IST</div>
            </div>
          `);

          suspectMarker.on('click', () => setSelectedItem({ type: 'SUSPECT_VECTOR', name, currentPos, color: data.color }));
          layersGroupRef.current.trajectories.addLayer(suspectMarker);
        }
      });
    }
  }, [layers, selectedSuspect, playbackProgress]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return undefined;

    if (mapContainerRef.current._leaflet_id) {
      mapContainerRef.current._leaflet_id = null;
    }

    let map = null;
    try {
      map = L.map(mapContainerRef.current, {
        center: [28.4600, 77.0500],
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      }).addTo(map);

      // Layer groups
      layersGroupRef.current = {
        cellTowers: L.featureGroup().addTo(map),
        anprCameras: L.featureGroup().addTo(map),
        crimeScenes: L.featureGroup().addTo(map),
        trajectories: L.featureGroup().addTo(map)
      };

      mapInstanceRef.current = map;
      renderAllLayers();

      setTimeout(() => {
        map?.invalidateSize();
      }, 200);
    } catch (err) {
      console.warn('Map initialization notice:', err);
    }

    return () => {
      try {
        map?.remove();
      } catch {
        // ignore
      }
      mapInstanceRef.current = null;
      if (mapContainerRef.current) {
        mapContainerRef.current._leaflet_id = null;
      }
    };
  }, []);

  // Update map when layers or progress change
  useEffect(() => {
    renderAllLayers();
  }, [layers, selectedSuspect, playbackProgress, renderAllLayers]);

  // Derived current timestamp label based on progress
  const currentTimeLabel = useMemo(() => {
    const startMins = 17 * 60; // 17:00
    const endMins = 20.5 * 60; // 20:30
    const totalMins = startMins + playbackProgress * (endMins - startMins);
    const hrs = Math.floor(totalMins / 60);
    const mins = Math.floor(totalMins % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} IST`;
  }, [playbackProgress]);

  const toggleLayer = (key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{
      padding: '1.5rem 2rem 3rem 2rem',
      backgroundColor: 'var(--bg-dark, #07090E)',
      minHeight: '100vh',
      color: '#FFFFFF',
      boxSizing: 'border-box'
    }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          backgroundColor: '#00E5FF',
          color: '#07090E',
          padding: '10px 18px',
          borderRadius: '6px',
          fontWeight: 800,
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '12px',
          boxShadow: '0 0 25px rgba(0, 229, 255, 0.45)',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
        paddingBottom: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '11px',
            color: '#00E5FF',
            letterSpacing: '1.5px',
            marginBottom: '4px'
          }}>
            <Navigation size={13} className="pulse-dot" />
            <span>GIS TACTICAL MATRIX // GEOSPATIAL TELEMETRY &amp; GEOFENCING ENGINE</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, letterSpacing: '0.5px' }}>
            GEOSPATIAL TRACKING &amp; TRAJECTORY PLAYBACK
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => onNavigate && onNavigate('timeline')}
            className="btn-outline-cyan"
            style={{ fontSize: '12px', padding: '7px 14px' }}
          >
            ⏱️ VIEW TIMELINE STREAM
          </button>
          <button
            onClick={() => onNavigate && onNavigate('reports')}
            className="btn-cyan"
            style={{ fontSize: '12px', padding: '7px 14px' }}
          >
            📄 GENERATE CHARGESHEET
          </button>
        </div>
      </div>

      {/* Geofence Collision Alert Banner */}
      {geofenceCollisionAlert && (
        <div style={{
          backgroundColor: 'rgba(255, 85, 85, 0.15)',
          border: '1.5px solid #FF5555',
          borderRadius: '8px',
          padding: '12px 18px',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          animation: 'pulse 2s infinite',
          boxShadow: '0 0 25px rgba(255, 85, 85, 0.35)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={24} color="#FF5555" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#FF6B6B', letterSpacing: '0.5px' }}>
                {geofenceCollisionAlert.title}
              </div>
              <div style={{ fontSize: '12px', color: '#FFFFFF', marginTop: '2px' }}>
                <strong>Location:</strong> {geofenceCollisionAlert.location} • <strong>Suspects Co-located:</strong> {geofenceCollisionAlert.suspects.join(', ')}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{
              backgroundColor: '#FF5555',
              color: '#07090E',
              fontWeight: 800,
              fontSize: '11px',
              padding: '4px 8px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono, monospace)'
            }}>
              AT {geofenceCollisionAlert.time}
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Controls + Map + Inspector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '1.25rem',
        minHeight: '620px'
      }}>
        {/* Left Column: Layer Toggles & Suspect Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Layer Control Card */}
          <div style={{
            backgroundColor: 'rgba(12, 17, 26, 0.95)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '8px',
            padding: '14px 16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11.5px',
              fontWeight: 800,
              color: '#00E5FF',
              fontFamily: 'var(--font-mono, monospace)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '8px',
              marginBottom: '10px'
            }}>
              <Layers size={14} />
              <span>GIS MAP VECTOR LAYERS</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={layers.cellTowers}
                  onChange={() => toggleLayer('cellTowers')}
                  style={{ accentColor: '#00E5FF' }}
                />
                <span>📡 Cell Towers ({CELL_TOWERS.length})</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={layers.triangulationRings}
                  onChange={() => toggleLayer('triangulationRings')}
                  style={{ accentColor: '#00E5FF' }}
                />
                <span>⭕ Triangulation Radiuses</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={layers.anprCameras}
                  onChange={() => toggleLayer('anprCameras')}
                  style={{ accentColor: '#FACC15' }}
                />
                <span>📷 ANPR Highway Cameras ({ANPR_CAMERAS.length})</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={layers.crimeScenes}
                  onChange={() => toggleLayer('crimeScenes')}
                  style={{ accentColor: '#FF5555' }}
                />
                <span>🚨 Crime Scene Hotspots ({CRIME_SCENES.length})</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={layers.trajectories}
                  onChange={() => toggleLayer('trajectories')}
                  style={{ accentColor: '#00E676' }}
                />
                <span>🎯 Suspect Movement Vectors</span>
              </label>
            </div>
          </div>

          {/* Suspect Vector Filter Card */}
          <div style={{
            backgroundColor: 'rgba(12, 17, 26, 0.95)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '8px',
            padding: '14px 16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11.5px',
              fontWeight: 800,
              color: '#00E5FF',
              fontFamily: 'var(--font-mono, monospace)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '8px',
              marginBottom: '10px'
            }}>
              <MapPin size={14} />
              <span>TARGET TRAJECTORY</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                onClick={() => setSelectedSuspect('ALL')}
                style={{
                  textAlign: 'left',
                  padding: '7px 10px',
                  borderRadius: '5px',
                  backgroundColor: selectedSuspect === 'ALL' ? 'rgba(0, 229, 255, 0.2)' : 'transparent',
                  border: selectedSuspect === 'ALL' ? '1px solid #00E5FF' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: selectedSuspect === 'ALL' ? '#00E5FF' : '#94A3B8',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono, monospace)',
                  cursor: 'pointer'
                }}
              >
                ALL SUSPECTS (3 VECTORS)
              </button>

              {Object.entries(SUSPECT_TRAJECTORIES).map(([name, data]) => {
                const isSelected = selectedSuspect === name;
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedSuspect(name)}
                    style={{
                      textAlign: 'left',
                      padding: '7px 10px',
                      borderRadius: '5px',
                      backgroundColor: isSelected ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                      border: isSelected ? `1.5px solid ${data.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#FFFFFF' : '#94A3B8',
                      fontSize: '11.5px',
                      fontWeight: isSelected ? 800 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: data.color }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inspector Panel */}
          {selectedItem && (
            <div style={{
              backgroundColor: 'rgba(12, 17, 26, 0.95)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: '8px',
              padding: '14px 16px',
              animation: 'fadeIn 0.2s ease'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '6px'
              }}>
                <span style={{ fontSize: '10.5px', color: '#00E5FF', fontWeight: 800, fontFamily: 'var(--font-mono, monospace)' }}>
                  INSPECTOR // {selectedItem.type}
                </span>
                <button
                  onClick={() => setSelectedItem(null)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '11px' }}
                >
                  ✕
                </button>
              </div>

              {selectedItem.type === 'CELL_TOWER' && (
                <div style={{ fontSize: '12px' }}>
                  <div style={{ fontWeight: 800, color: '#FFFFFF', marginBottom: '2px' }}>{selectedItem.data.name}</div>
                  <div style={{ color: '#94A3B8', fontSize: '11px' }}>ID: {selectedItem.data.cellId}</div>
                  <div style={{ color: '#00E676', fontWeight: 700, marginTop: '4px' }}>Range: {selectedItem.data.radiusM}m • Azimuth: {selectedItem.data.azimuthDeg}°</div>
                </div>
              )}

              {selectedItem.type === 'ANPR_CAMERA' && (
                <div style={{ fontSize: '12px' }}>
                  <div style={{ fontWeight: 800, color: '#FACC15', marginBottom: '2px' }}>{selectedItem.data.name}</div>
                  <div style={{ color: '#FFFFFF' }}>Hit: <strong>{selectedItem.data.lastHit}</strong></div>
                  <div style={{ color: '#FF8888', fontSize: '11px', marginTop: '2px' }}>Suspect: {selectedItem.data.suspect} ({selectedItem.data.speedKmph} km/h)</div>
                </div>
              )}

              {selectedItem.type === 'CRIME_SCENE' && (
                <div style={{ fontSize: '12px' }}>
                  <div style={{ fontWeight: 800, color: '#FF6B6B', marginBottom: '2px' }}>{selectedItem.data.title}</div>
                  <div style={{ color: '#00E5FF' }}>{selectedItem.data.firNumber}</div>
                  <div style={{ color: '#CBD5E1', fontSize: '11px', marginTop: '2px' }}>PS: {selectedItem.data.policeStation}</div>
                </div>
              )}

              {selectedItem.type === 'SUSPECT_VECTOR' && (
                <div style={{ fontSize: '12px' }}>
                  <div style={{ fontWeight: 800, color: selectedItem.color, marginBottom: '2px' }}>{selectedItem.name}</div>
                  <div style={{ color: '#FFFFFF' }}>Position: {selectedItem.currentPos.label}</div>
                  <div style={{ color: '#94A3B8', fontSize: '11px', marginTop: '2px' }}>Est. Time: {selectedItem.currentPos.time} IST</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Map & Playback Control Ribbon */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Tactical Map Container */}
          <div style={{
            position: 'relative',
            height: '520px',
            width: '100%',
            borderRadius: '10px',
            border: '1.5px solid rgba(0, 229, 255, 0.3)',
            overflow: 'hidden',
            boxShadow: '0 0 35px rgba(0, 0, 0, 0.8)'
          }}>
            <div
              ref={mapContainerRef}
              style={{ width: '100%', height: '100%', backgroundColor: '#07090E' }}
            />

            {/* Map Floating HUD Overlay */}
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'rgba(7, 10, 16, 0.88)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              backdropFilter: 'blur(12px)',
              padding: '8px 14px',
              borderRadius: '6px',
              zIndex: 1000,
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11.5px'
            }}>
              <div style={{ color: '#94A3B8', fontSize: '9.5px' }}>INTERCEPT CLOCK</div>
              <div style={{ color: '#00E5FF', fontWeight: 800, fontSize: '14px' }}>
                {currentTimeLabel}
              </div>
            </div>
          </div>

          {/* Trajectory Playback Scrubber Bar */}
          <div style={{
            backgroundColor: 'rgba(12, 17, 26, 0.95)',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            borderRadius: '8px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                backgroundColor: isPlaying ? '#FF5555' : '#00E5FF',
                border: 'none',
                color: '#07090E',
                borderRadius: '6px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isPlaying ? '0 0 15px rgba(255, 85, 85, 0.5)' : '0 0 15px rgba(0, 229, 255, 0.4)'
              }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
            </button>

            {/* Reset Button */}
            <button
              onClick={() => {
                setIsPlaying(false);
                setPlaybackProgress(0);
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#94A3B8',
                borderRadius: '6px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Reset Timeline to 17:00"
            >
              <RotateCcw size={16} />
            </button>

            {/* Scrubber Range Slider */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontFamily: 'var(--font-mono, monospace)', color: '#94A3B8' }}>
                <span>17:00 IST (Hideouts Active)</span>
                <span style={{ color: '#00E5FF', fontWeight: 800 }}>{currentTimeLabel}</span>
                <span>20:30 IST (STF Intercepts)</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={playbackProgress}
                onChange={(e) => {
                  setIsPlaying(false);
                  setPlaybackProgress(parseFloat(e.target.value));
                }}
                style={{
                  width: '100%',
                  accentColor: '#00E5FF',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Speed Multipliers */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {[1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  style={{
                    backgroundColor: playbackSpeed === spd ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: playbackSpeed === spd ? '1px solid #00E5FF' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: playbackSpeed === spd ? '#00E5FF' : '#94A3B8',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono, monospace)',
                    cursor: 'pointer'
                  }}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
