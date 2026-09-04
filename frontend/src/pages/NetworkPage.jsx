import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api.js';
import AddCriminalModal from '../components/AddCriminalModal.jsx';

// Comprehensive Database of Known Gang Networks
const PREDEFINED_SUSPECT_NETWORKS = {
  'MAYANK KOTOLI': {
    name: 'MAYANK KOTOLI',
    id: 'CRM-9942',
    alias: 'The Trigger / MK-99',
    risk: 'CRITICAL',
    riskScore: '99.4%',
    type: 'Lead Hitman / Gang Enforcer',
    cluster: 'CLUSTER_HOMICIDE_GANG [CONTRACT KILLING & ARMS]',
    category: 'Homicide & Contract Killing',
    firstSeen: '15 Jan 2023',
    connections: 28,
    activityLevel: 'Active Fugitive',
    policeStation: 'Special Crime Branch / PS Sector 18',
    description: 'Contract assassination specialist executing point-blank double-taps on rival gang leaders. Ballistics match with 9mm Beretta recovered from Sector 18 double homicide.',
    nodes: [
      { id: 'N_CENTER', label: 'MAYANK KOTOLI', type: 'LEAD_HITMAN', role: 'Central Target / Enforcer', risk: 'CRITICAL', riskScore: '99.4%', x: 300, y: 190, r: 18, color: '#FF5555', status: 'ACTIVE_FUGITIVE', details: 'Wanted under BNS Sec 103 (IPC 302). Primary shooter in Sector 18 double homicide.' },
      { id: 'N_BOSS', label: "MAHESH 'TIGER' KHAN", type: 'GANG_BOSS', role: 'Syndicate Kingpin / Contract Client', risk: 'CRITICAL', riskScore: '98.5%', x: 170, y: 100, r: 14, color: '#FF5555', status: 'MCOCA_FLAGGED', details: 'Financed ₹50L assassination contract; coordinates inter-state operations via Dubai hawala.' },
      { id: 'N_ARMORER', label: "SURESH 'CHHOTA' GOLI", type: 'ARMS_SUPPLIER', role: 'Black Market Armorer', risk: 'HIGH', riskScore: '94.0%', x: 430, y: 100, r: 13, color: '#FBBF24', status: 'RAID_PENDING', details: 'Supplied modified 9mm Beretta 92FS with wiped serials and 30 rounds hollow-point ammo.' },
      { id: 'N_SCENE', label: 'SECTOR-18 CRIME SCENE', type: 'CRIME_SCENE', role: 'Double Homicide Location', risk: 'CRITICAL', riskScore: '100%', x: 140, y: 220, r: 12, color: '#FF5555', status: 'EVIDENCE_SEALED', details: 'Recovered 4x 9mm spent casings with matching firing pin impressions (FSL Ballistics #FSL-884).' },
      { id: 'N_VEHICLE', label: 'KTM DUKE GETAWAY (HR26)', type: 'VEHICLE', role: 'Getaway Vehicle Vector', risk: 'HIGH', riskScore: '88.2%', x: 210, y: 310, r: 11, color: '#00E676', status: 'ANPR_FLAGGED', details: 'Unregistered KTM Duke 390 captured crossing Kherki Daula Toll 14 mins post-incident.' },
      { id: 'N_HAWALA', label: 'HAWALA DROP (₹35 LAKHS)', type: 'FINANCIAL', role: 'Contract Bounty Escrow', risk: 'HIGH', riskScore: '91.5%', x: 390, y: 310, r: 12, color: '#A855F7', status: 'ACCOUNTS_FROZEN', details: 'Benami cash transit conduit routed via Chandni Chowk bullion operators to finance safehouses.' },
      { id: 'N_BURNER', label: 'BURNER +91-98711-40291', type: 'SIGINT', role: 'Active Burner IMEI Intercept', risk: 'MEDIUM', riskScore: '85.0%', x: 460, y: 220, r: 11, color: '#0284c7', status: 'TRIANGULATED', details: 'Cell tower triangulation pings moving along Meerut-Delhi Expressway corridors.' },
    ],
    edges: [
      { from: 'N_BOSS', to: 'N_CENTER', label: 'HIT CONTRACT (₹50L)', type: 'COMMAND', color: '#FF5555', width: 2.5, dashed: false },
      { from: 'N_ARMORER', to: 'N_CENTER', label: '9mm BERETTA SUPPLY', type: 'WEAPON', color: '#FBBF24', width: 2.0, dashed: true },
      { from: 'N_CENTER', to: 'N_SCENE', label: 'BALLISTICS 99.4% MATCH', type: 'FORENSIC', color: '#FF5555', width: 2.5, dashed: false },
      { from: 'N_CENTER', to: 'N_VEHICLE', label: 'GETAWAY ROUTE', type: 'TRANSIT', color: '#00E676', width: 2.0, dashed: true },
      { from: 'N_BOSS', to: 'N_HAWALA', label: 'HAWALA ESCROW', type: 'FINANCIAL', color: '#A855F7', width: 1.8, dashed: false },
      { from: 'N_HAWALA', to: 'N_CENTER', label: 'BOUNTY DISPERSAL', type: 'FINANCIAL', color: '#A855F7', width: 1.8, dashed: true },
      { from: 'N_CENTER', to: 'N_BURNER', label: 'SIGINT ENCRYPTED CHAT', type: 'COMMUNICATION', color: '#0284c7', width: 1.8, dashed: true },
    ]
  },

  'MAHESH KHAN': {
    name: "MAHESH 'TIGER' KHAN",
    id: 'CRM-0014',
    alias: 'Tiger / Bada Don / MK-01',
    risk: 'CRITICAL',
    riskScore: '98.5%',
    type: 'Gang Syndicate Boss / Don',
    cluster: 'CLUSTER_MCOCA_SYNDICATE [EXTORTION & COMMAND]',
    category: 'Organized Crime & Extortion',
    firstSeen: '10 Feb 2020',
    connections: 42,
    activityLevel: 'Surveilled Nexus',
    policeStation: 'Organized Crime Branch / Special Cell STF HQ',
    description: 'Supreme syndicate boss running inter-state protection rackets, hawala channels, and hiring contract hitmen across NCR under MCOCA Act.',
    nodes: [
      { id: 'N_CENTER', label: "MAHESH 'TIGER' KHAN", type: 'GANG_BOSS', role: 'Syndicate Apex Commander', risk: 'CRITICAL', riskScore: '98.5%', x: 300, y: 190, r: 18, color: '#FF5555', status: 'MCOCA_FLAGGED', details: 'Mastermind coordinating multi-tier extortion rings and cross-border weapons consignments.' },
      { id: 'N_HITMAN', label: 'MAYANK KOTOLI', type: 'LEAD_HITMAN', role: 'Primary Enforcer / Hitman', risk: 'CRITICAL', riskScore: '99.4%', x: 170, y: 100, r: 14, color: '#FF5555', status: 'ACTIVE_FUGITIVE', details: 'Executes high-profile intimidation hits and rival gang eliminations on Khan’s direct orders.' },
      { id: 'N_HAWALA', label: 'SAMEER ALI (HAWALA OPERATOR)', type: 'FINANCIAL', role: 'Financial Conduit', risk: 'HIGH', riskScore: '89.0%', x: 430, y: 100, r: 13, color: '#A855F7', status: 'UNDER_SURVEILLANCE', details: 'Manages ₹12 Cr annual illegal syndicate transactions through Dubai-Hong Kong escrow accounts.' },
      { id: 'N_EXTORT', label: 'GURUGRAM INFRASTRUCTURE FIRM', type: 'TARGET', role: '₹50L Extortion Target', risk: 'CRITICAL', riskScore: '96.0%', x: 140, y: 220, r: 12, color: '#FBBF24', status: 'POLICE_PROTECTED', details: 'Received extortion threats via VoIP demands; CCTV captured Khan’s recce scouts.' },
      { id: 'N_ARMS', label: 'VIKRAM SINGH (ARMS BROKER)', type: 'ARMS_SUPPLIER', role: 'Military Arms Importer', risk: 'HIGH', riskScore: '95.2%', x: 460, y: 220, r: 12, color: '#FBBF24', status: 'WARRANT_ISSUED', details: 'Procures imported Glock-17 and AK-series rifles from clandestine cross-border routes.' },
      { id: 'N_VAULT', label: 'DUBAI BULLION VAULT ($1.8M)', type: 'FINANCIAL', role: 'Offshore Gold Reserves', risk: 'HIGH', riskScore: '97.1%', x: 210, y: 310, r: 12, color: '#A855F7', status: 'INTERPOL_FLAGGED', details: 'Benami shell company holding physical bullion assets laundered from syndicate extortion.' },
      { id: 'N_SATCOM', label: 'SATELLITE RELAY (+971-50)', type: 'SIGINT', role: 'Encrypted Comms Hub', risk: 'HIGH', riskScore: '90.0%', x: 390, y: 310, r: 11, color: '#0284c7', status: 'ACTIVE_INTERCEPT', details: 'Satellite VoIP relay routed through encrypted European proxies to evade domestic wiretaps.' },
    ],
    edges: [
      { from: 'N_CENTER', to: 'N_HITMAN', label: 'EXECUTION COMMAND', type: 'COMMAND', color: '#FF5555', width: 2.5, dashed: false },
      { from: 'N_CENTER', to: 'N_HAWALA', label: 'FUNDS LAUNDERING', type: 'FINANCIAL', color: '#A855F7', width: 2.0, dashed: false },
      { from: 'N_CENTER', to: 'N_EXTORT', label: '₹50L EXTORTION DEMAND', type: 'CRIME', color: '#FBBF24', width: 2.2, dashed: true },
      { from: 'N_ARMS', to: 'N_CENTER', label: 'AK-47 / GLOCK SUPPLY', type: 'WEAPON', color: '#FBBF24', width: 2.0, dashed: true },
      { from: 'N_HAWALA', to: 'N_VAULT', label: 'OFFSHORE WIRE', type: 'FINANCIAL', color: '#A855F7', width: 2.0, dashed: false },
      { from: 'N_CENTER', to: 'N_SATCOM', label: 'SATELLITE LINK', type: 'COMMUNICATION', color: '#0284c7', width: 1.8, dashed: true },
      { from: 'N_ARMS', to: 'N_HITMAN', label: 'WEAPON TRANSFER', type: 'WEAPON', color: '#FBBF24', width: 1.5, dashed: true },
    ]
  },

  'DEVENDRA RAWAT': {
    name: "DEVENDRA 'D-7' RAWAT",
    id: 'CRM-7721',
    alias: 'D-7 / Highway Predator / Night Stalker',
    risk: 'CRITICAL',
    riskScore: '99.8%',
    type: 'Serial Predator / Gang Associate',
    cluster: 'CLUSTER_SEXUAL_VIOLENCE_RING',
    category: 'Serial Sexual Assault & Gang Aggravation',
    firstSeen: '12 Sep 2023',
    connections: 19,
    activityLevel: 'High Threat Fugitive',
    policeStation: 'Special SIT / Women Safety PS Sector 14',
    description: 'Serial predator operating modified transport vectors, forged number plates, and coordinated ring associates stalking transit corridors.',
    nodes: [
      { id: 'N_CENTER', label: "DEVENDRA 'D-7' RAWAT", type: 'SERIAL_OFFENDER', role: 'Central Suspect', risk: 'CRITICAL', riskScore: '99.8%', x: 300, y: 190, r: 18, color: '#FF5555', status: 'ACTIVE_FUGITIVE', details: 'Matched 100% STR DNA Profile. Multiple aggravated sexual assault FIRs registered across NCR.' },
      { id: 'N_PLATES', label: "RAJU 'MECHANIC' VERMA", type: 'ACCOMPLICE', role: 'Forged Plates Fabricator', risk: 'HIGH', riskScore: '88.0%', x: 170, y: 100, r: 13, color: '#FBBF24', status: 'DETAINED', details: 'Supplied counterfeit commercial license plates to disguise predator taxi vehicles.' },
      { id: 'N_TAXI', label: 'UNREGISTERED WHITE TAXI', type: 'VEHICLE', role: 'Abduction Transit Vector', risk: 'CRITICAL', riskScore: '96.5%', x: 430, y: 100, r: 14, color: '#FF5555', status: 'ANPR_ALERTLIST', details: 'Vehicle fitted with child-locks disabled from inside and tinted IR-blocking film.' },
      { id: 'N_PRISON', label: 'MAYANK KOTOLI (TIHAR NEXUS)', type: 'GANG_LINK', role: 'Former Inmate / Prison Associate', risk: 'CRITICAL', riskScore: '99.2%', x: 140, y: 220, r: 13, color: '#FF5555', status: 'GANG_AFFILIATE', details: 'Shared Ward #4 in Tihar Jail; established mutual hideout networks in Haryana border towns.' },
      { id: 'N_SAFEHOUSE', label: 'SECTOR-14 HIDEOUT', type: 'INFRASTRUCTURE', role: 'Triangulated Safehouse', risk: 'HIGH', riskScore: '91.0%', x: 460, y: 220, r: 12, color: '#00E676', status: 'RAID_CORDONED', details: 'Abandoned warehouse unit identified via cell tower triangulation and forensic trace analysis.' },
      { id: 'N_DNA', label: 'FORENSIC DNA MATCH #FK-8821', type: 'FORENSIC', role: 'Biological Evidence Vector', risk: 'CRITICAL', riskScore: '100%', x: 210, y: 310, r: 12, color: '#0284c7', status: 'COURT_EVIDENCE', details: '100% STR DNA match confirmed across 3 crime scene rape test kits by State FSL.' },
      { id: 'N_BURNER', label: 'BURNER +91-98112-99011', type: 'SIGINT', role: 'Stalking Telemetry Device', risk: 'MEDIUM', riskScore: '84.0%', x: 390, y: 310, r: 11, color: '#0284c7', status: 'SIGNAL_ACTIVE', details: 'Tower triangulation confirms device pings near bus terminals between 22:00 and 03:00 hrs.' },
    ],
    edges: [
      { from: 'N_PLATES', to: 'N_TAXI', label: 'COUNTERFEIT NUMBER PLATES', type: 'LOGISTICS', color: '#FBBF24', width: 2.0, dashed: true },
      { from: 'N_CENTER', to: 'N_TAXI', label: 'TRANSIT OPERATIONS', type: 'VECTOR', color: '#FF5555', width: 2.5, dashed: false },
      { from: 'N_CENTER', to: 'N_PRISON', label: 'TIHAR PRISON NETWORK', type: 'ASSOCIATE', color: '#FF5555', width: 2.0, dashed: true },
      { from: 'N_CENTER', to: 'N_SAFEHOUSE', label: 'HABITATION BASE', type: 'INFRASTRUCTURE', color: '#00E676', width: 2.0, dashed: false },
      { from: 'N_CENTER', to: 'N_DNA', label: 'STR DNA 100% MATCH', type: 'FORENSIC', color: '#0284c7', width: 2.5, dashed: false },
      { from: 'N_CENTER', to: 'N_BURNER', label: 'IMSI TRACKING', type: 'COMMUNICATION', color: '#0284c7', width: 1.8, dashed: true },
    ]
  },

  'SAMEER QURESHI': {
    name: "SAMEER 'GHOST' QURESHI",
    id: 'CRM-8821',
    alias: 'Ghost / The Drill / SQ-Lock',
    risk: 'HIGH',
    riskScore: '92.4%',
    type: 'Safe Cracker & Armed Heist Master',
    cluster: 'CLUSTER_ROBBERY_FENCING [BANK HEISTS & GOLD BULLION]',
    category: 'Armed Robbery & Bank Heists',
    firstSeen: '05 Mar 2021',
    connections: 23,
    activityLevel: 'Active Tracking',
    policeStation: 'Anti-Robbery Cell / PS Sadar',
    description: 'High-precision vault breaching specialist utilizing thermal lances, signal jammers, and high-speed getaway trucks for commercial bank robberies.',
    nodes: [
      { id: 'N_CENTER', label: "SAMEER 'GHOST' QURESHI", type: 'HEIST_MASTER', role: 'Lead Vault Breaker', risk: 'HIGH', riskScore: '92.4%', x: 300, y: 190, r: 17, color: '#FF9900', status: 'ACTIVE_TRACKING', details: 'Master safe cracker with thermal lance training. Suspect in ₹14 Cr Axis Bank vault heist.' },
      { id: 'N_FENCER', label: "MAHESH 'TIGER' KHAN", type: 'GANG_BOSS', role: 'Syndicate Gold Fencer', risk: 'CRITICAL', riskScore: '98.5%', x: 170, y: 100, r: 14, color: '#FF5555', status: 'MCOCA_FLAGGED', details: 'Buys stolen gold bullion at 40% discount and launders value through jewelry syndicates.' },
      { id: 'N_VAULT', label: 'AXIS BANK VAULT (14KG GOLD)', type: 'CRIME_SCENE', role: 'Heist Target Location', risk: 'CRITICAL', riskScore: '99.0%', x: 430, y: 100, r: 13, color: '#FF5555', status: 'FORENSIC_MAPPED', details: 'Thermal lance breach of reinforced vault steel; glove DNA recovered on security keypad.' },
      { id: 'N_BOLERO', label: 'GETAWAY BOLERO (HR26-XX-4902)', type: 'VEHICLE', role: 'Armed Getaway Vector', risk: 'HIGH', riskScore: '96.0%', x: 140, y: 220, r: 12, color: '#0284c7', status: 'GPS_BEACON_HIT', details: 'Equipped with police scanner and fake police strobe lights to evade highway checkpoints.' },
      { id: 'N_MARKET', label: 'BULLION FENCER (CHANDNI CHOWK)', type: 'FINANCIAL', role: 'Black Market Melter', risk: 'HIGH', riskScore: '89.2%', x: 460, y: 220, r: 12, color: '#A855F7', status: 'SURVEILLED', details: 'Undercover surveillance active on smelting shop converting marked bullion into unmarked bars.' },
      { id: 'N_JAMMER', label: 'SIGNAL JAMMER TRUCK', type: 'EQUIPMENT', role: 'Electronic Warfare Unit', risk: 'MEDIUM', riskScore: '82.0%', x: 210, y: 310, r: 11, color: '#00E676', status: 'SEIZED_PARTS', details: 'High-power RF jammer blocking cellular alarms, CCTV Wi-Fi relays, and guard panic triggers.' },
      { id: 'N_HITMAN', label: 'MAYANK KOTOLI', type: 'LEAD_HITMAN', role: 'Armed Escort / Firepower', risk: 'CRITICAL', riskScore: '99.4%', x: 390, y: 310, r: 13, color: '#FF5555', status: 'ACTIVE_FUGITIVE', details: 'Provided armed perimeter suppression during multi-city bank vault operations.' },
    ],
    edges: [
      { from: 'N_CENTER', to: 'N_VAULT', label: 'THERMAL LANCE BREACH', type: 'HEIST', color: '#FF5555', width: 2.5, dashed: false },
      { from: 'N_CENTER', to: 'N_BOLERO', label: 'EVASION GETAWAY', type: 'TRANSIT', color: '#0284c7', width: 2.0, dashed: true },
      { from: 'N_CENTER', to: 'N_FENCER', label: 'STOLEN GOLD TRANSFER', type: 'FINANCIAL', color: '#FF5555', width: 2.2, dashed: false },
      { from: 'N_FENCER', to: 'N_MARKET', label: 'SMELTING & RESALE', type: 'FINANCIAL', color: '#A855F7', width: 1.8, dashed: true },
      { from: 'N_JAMMER', to: 'N_CENTER', label: 'RF ALARM BLOCK', type: 'TACTICAL', color: '#00E676', width: 1.8, dashed: true },
      { from: 'N_HITMAN', to: 'N_CENTER', label: 'ARMED ESCORT FIREPOWER', type: 'SECURITY', color: '#FF5555', width: 2.0, dashed: true },
    ]
  },

  'ELENA ROSTOVA': {
    name: "ELENA 'CZAR' ROSTOVA",
    id: 'CRM-5512',
    alias: 'The Chemist / Czarina / ER-Narc',
    risk: 'CRITICAL',
    riskScore: '96.0%',
    type: 'Cartel Boss / Arms Trafficker',
    cluster: 'CLUSTER_NARCO_PIPELINE [HEROIN & MILITARY ARMS]',
    category: 'Narcotics & Arms Trafficking',
    firstSeen: '18 Aug 2022',
    connections: 34,
    activityLevel: 'Active Maritime Tracking',
    policeStation: 'Narcotics Control Bureau (NCB) Zonal Unit',
    description: 'International cartel mastermind smuggling synthetic opioids and military-grade weaponry into Northern India via containerized maritime routes.',
    nodes: [
      { id: 'N_CENTER', label: "ELENA 'CZAR' ROSTOVA", type: 'CARTEL_BOSS', role: 'Cartel Apex Director', risk: 'CRITICAL', riskScore: '96.0%', x: 300, y: 190, r: 18, color: '#FF5555', status: 'INTERPOL_RED', details: 'Dual-flagged on Interpol Red Notice for intercontinental synthetic opioid smuggling.' },
      { id: 'N_PORT', label: 'PORT TERMINAL C YARD', type: 'SEIZURE_SITE', role: 'Maritime Container Hub', risk: 'CRITICAL', riskScore: '100%', x: 170, y: 100, r: 14, color: '#FF5555', status: 'NCB_SEIZED', details: 'Recovered 100kg pharmaceutical-grade synthetic opioids concealed inside industrial machinery.' },
      { id: 'N_ARMS', label: 'STEYR TMP FIREARMS CRATE', type: 'WEAPONS_CACHE', role: 'Military Weapon Cache', risk: 'CRITICAL', riskScore: '98.0%', x: 430, y: 100, r: 13, color: '#FBBF24', status: 'CUSTOMS_HOLD', details: 'Seized 24x military 9mm submachine guns and suppressed tactical carbines.' },
      { id: 'N_KHAN', label: "MAHESH 'TIGER' KHAN", type: 'DISTRIBUTION', role: 'NCR Regional Distributor', risk: 'CRITICAL', riskScore: '98.5%', x: 140, y: 220, r: 13, color: '#FF5555', status: 'MCOCA_FLAGGED', details: 'Distributes contraband shipments across NCR through localized dealer networks.' },
      { id: 'N_WIRE', label: 'HSBC HK MARITIME TRUST ($4.2M)', type: 'FINANCIAL', role: 'Offshore Crypto/Wire Account', risk: 'HIGH', riskScore: '94.5%', x: 460, y: 220, r: 12, color: '#A855F7', status: 'ASSETS_FROZEN', details: 'Multi-layered wire transit account channeling narcotics proceeds into crypto liquidity pools.' },
      { id: 'N_VESSEL', label: 'ARABIAN SEA CARGO VESSEL', type: 'MARITIME', role: 'Deep-Sea Smuggling Vessel', risk: 'HIGH', riskScore: '90.0%', x: 210, y: 310, r: 11, color: '#0284c7', status: 'COAST_GUARD_TRACKED', details: 'AIS transponder blacked out periodically across international maritime corridors.' },
      { id: 'N_ENCRYPT', label: 'ENCRYPTED THREEMA / SATCOM', type: 'SIGINT', role: 'Secure Command Channel', risk: 'MEDIUM', riskScore: '86.0%', x: 390, y: 310, r: 11, color: '#0284c7', status: 'SIGNAL_INTERCEPTED', details: 'Encrypted telemetry decoded showing scheduled drops at Gujarat and Maharashtra ports.' },
    ],
    edges: [
      { from: 'N_CENTER', to: 'N_PORT', label: '100KG OPIOIDS SHIPMENT', type: 'NARCO', color: '#FF5555', width: 2.5, dashed: false },
      { from: 'N_CENTER', to: 'N_ARMS', label: 'TACTICAL SMG IMPORTS', type: 'WEAPON', color: '#FBBF24', width: 2.2, dashed: false },
      { from: 'N_CENTER', to: 'N_KHAN', label: 'SYNDICATE DISTRIBUTION', type: 'COMMAND', color: '#FF5555', width: 2.0, dashed: true },
      { from: 'N_CENTER', to: 'N_WIRE', label: '$4.2M OFFSHORE LAUNDERING', type: 'FINANCIAL', color: '#A855F7', width: 2.0, dashed: false },
      { from: 'N_VESSEL', to: 'N_PORT', label: 'MARITIME FREIGHT ROUTE', type: 'LOGISTICS', color: '#0284c7', width: 1.8, dashed: true },
      { from: 'N_CENTER', to: 'N_ENCRYPT', label: 'SATCOM CODES', type: 'COMMUNICATION', color: '#0284c7', width: 1.8, dashed: true },
    ]
  }
};

// Procedurally and contextually build a full Gang Network for ANY criminal
export function buildCriminalGangNetwork(criminal) {
  const cleanName = (criminal.name || 'UNKNOWN OFFENDER').trim().toUpperCase();
  const id = criminal.id || `CRM-${Math.floor(1000 + Math.random() * 9000)}`;
  const riskNum = Number(criminal.riskScore) || (criminal.threatLevel === 'CRITICAL' ? 98.4 : 92.0);
  const threatLevel = criminal.threatLevel || (riskNum > 90 ? 'CRITICAL' : 'HIGH');
  const crimeType = criminal.crimeType || criminal.category || 'Organized Gang Activity';
  const alias = (criminal.aliases && criminal.aliases.length > 0) ? criminal.aliases.join(' / ') : `Code ${cleanName.split(' ')[0]}-X`;
  const firList = Array.isArray(criminal.firNumbers) ? criminal.firNumbers : (criminal.firNumbers ? [criminal.firNumbers] : []);
  const firText = firList.length > 0 ? firList[0] : `FIR-2024-${id.replace(/[^0-9]/g, '') || '402'}`;
  const policeStation = criminal.policeStation || 'Special Crime Branch / State STF';
  const weapon = criminal.weaponSignature || 'Country-made Firearm / Edged Weapon';
  const modus = criminal.modusOperandi || `Active suspect under STF surveillance for ${crimeType}.`;

  const nodes = [
    {
      id: 'N_CENTER',
      label: cleanName,
      type: 'PRIMARY_SUSPECT',
      role: 'Central Target / Operative',
      risk: threatLevel,
      riskScore: `${riskNum}%`,
      x: 300,
      y: 190,
      r: 18,
      color: threatLevel === 'CRITICAL' ? '#FF5555' : '#FF9900',
      status: criminal.status || 'ACTIVE_WARRANT',
      details: `ID: ${id} | Wanted under ${firText}. Modus: ${modus}`
    },
    {
      id: 'N_WEAPON',
      label: weapon.length > 25 ? `${weapon.slice(0, 23)}...` : weapon,
      type: 'ARMS_SUPPLIER',
      role: 'Weaponry & Ballistics Signature',
      risk: 'HIGH',
      riskScore: '92.0%',
      x: 430,
      y: 100,
      r: 13,
      color: '#FBBF24',
      status: 'BALLISTICS_MATCH',
      details: `Forensic ballistic match: ${weapon}. Striation characteristics catalogued in police archive.`
    },
    {
      id: 'N_JURISDICTION',
      label: policeStation.length > 26 ? `${policeStation.slice(0, 24)}...` : policeStation,
      type: 'CRIME_SCENE',
      role: 'Jurisdiction & FIR Crime Scene',
      risk: 'CRITICAL',
      riskScore: '98.0%',
      x: 140,
      y: 220,
      r: 12,
      color: '#FF5555',
      status: 'SCENE_CORDONED',
      details: `Primary FIRs: ${firList.length > 0 ? firList.join(', ') : firText} at ${policeStation}.`
    },
    {
      id: 'N_ASSOCIATE',
      label: (criminal.knownAssociates && criminal.knownAssociates.length > 0)
        ? criminal.knownAssociates[0].name
        : "MAHESH 'TIGER' KHAN",
      type: 'GANG_BOSS',
      role: (criminal.knownAssociates && criminal.knownAssociates.length > 0)
        ? criminal.knownAssociates[0].relation
        : 'Syndicate Network Link',
      risk: 'CRITICAL',
      riskScore: '98.5%',
      x: 170,
      y: 100,
      r: 14,
      color: '#FF5555',
      status: 'MCOCA_FLAGGED',
      details: 'Command nexus coordinating regional sleeper cells, contract dispatch, and cross-border hideouts.'
    },
    {
      id: 'N_FINANCIAL',
      label: (criminal.financialAccounts && criminal.financialAccounts.length > 0)
        ? `${criminal.financialAccounts[0].bank}`
        : 'BENAMI HAWALA CONDUIT',
      type: 'FINANCIAL',
      role: 'Illicit Hawala & Asset Conduit',
      risk: 'HIGH',
      riskScore: '89.5%',
      x: 460,
      y: 220,
      r: 12,
      color: '#A855F7',
      status: 'AUDIT_FROZEN',
      details: (criminal.financialAccounts && criminal.financialAccounts.length > 0)
        ? `Account: ${criminal.financialAccounts[0].accNo} - Balance: ${criminal.financialAccounts[0].balance}`
        : 'Benami cash channels routed to finance safehouses and legal defense escrows.'
    },
    {
      id: 'N_TRANSIT',
      label: 'SURVEILLED TRANSIT VECTOR',
      type: 'VEHICLE',
      role: 'Getaway & Transport Vector',
      risk: 'MEDIUM',
      riskScore: '82.5%',
      x: 210,
      y: 310,
      r: 11,
      color: '#00E676',
      status: 'ANPR_FLAGGED',
      details: `Getaway transport logged crossing regional highway toll checkpoints post incident.`
    },
    {
      id: 'N_SIGINT',
      label: criminal.phone
        ? `BURNER ${criminal.phone}`
        : ((criminal.burnerDevices && criminal.burnerDevices.length > 0) ? `IMEI ${criminal.burnerDevices[0].imei.slice(0, 8)}...` : 'ENCRYPTED SIGINT BEACON'),
      type: 'SIGINT',
      role: 'Active Cellular & IMSI Intercept',
      risk: 'MEDIUM',
      riskScore: '86.0%',
      x: 390,
      y: 310,
      r: 11,
      color: '#0284c7',
      status: 'TRIANGULATED',
      details: `Cell tower triangulation and packet intercepts logged under Section 65B BSA.`
    }
  ];

  const edges = [
    { from: 'N_ASSOCIATE', to: 'N_CENTER', label: 'OPERATIONAL COMMAND', type: 'COMMAND', color: '#FF5555', width: 2.4, dashed: false },
    { from: 'N_WEAPON', to: 'N_CENTER', label: 'WEAPONS LOGISTICS', type: 'WEAPON', color: '#FBBF24', width: 2.0, dashed: true },
    { from: 'N_CENTER', to: 'N_JURISDICTION', label: 'INCIDENT HOTSPOT', type: 'FORENSIC', color: '#FF5555', width: 2.2, dashed: false },
    { from: 'N_CENTER', to: 'N_FINANCIAL', label: 'HAWALA CAPITAL FLOW', type: 'FINANCIAL', color: '#A855F7', width: 1.8, dashed: false },
    { from: 'N_CENTER', to: 'N_TRANSIT', label: 'GETAWAY TRANSIT', type: 'TRANSIT', color: '#00E676', width: 1.8, dashed: true },
    { from: 'N_CENTER', to: 'N_SIGINT', label: 'SIGINT WIREPING', type: 'COMMUNICATION', color: '#0284c7', width: 1.8, dashed: true }
  ];

  return {
    name: cleanName,
    id: id,
    alias: alias,
    risk: threatLevel,
    riskScore: `${riskNum}%`,
    type: `Gang Operative (${crimeType.split(' ')[0]})`,
    cluster: `CLUSTER_${cleanName.replace(/[^A-Z0-9]/g, '_')} [GANG SYNDICATE]`,
    category: crimeType,
    firstSeen: '2024 CCTNS Register',
    connections: 18 + (cleanName.length % 15),
    activityLevel: criminal.status || 'Active Surveillance',
    policeStation: policeStation,
    description: `${cleanName} (${id}) is catalogued under ${firText}. ${modus}`,
    isCustom: true,
    nodes,
    edges
  };
}

export default function NetworkTopologyPage({ onNavigate: _onNavigate }) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSuspectKey, setActiveSuspectKey] = useState('MAYANK KOTOLI');
  const [allNetworksMap, setAllNetworksMap] = useState(PREDEFINED_SUSPECT_NETWORKS);
  const [currentNetwork, setCurrentNetwork] = useState(PREDEFINED_SUSPECT_NETWORKS['MAYANK KOTOLI']);
  const [selectedNode, setSelectedNode] = useState(PREDEFINED_SUSPECT_NETWORKS['MAYANK KOTOLI'].nodes[0]);
  const [toastMessage, setToastMessage] = useState(null);
  const [filterRisk, setFilterRisk] = useState('All Levels');
  const [filterType, setFilterType] = useState('All Connections');
  const [activeTab, setActiveTab] = useState('Network Overview');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Show Toast
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Synchronize all networks with local custom criminals & backend API
  const loadAllNetworks = useCallback(async (preferredSuspectName = null) => {
    let customList = [];
    try {
      const stored = localStorage.getItem('crimelens_custom_criminals');
      if (stored) customList = JSON.parse(stored);
    } catch {
      customList = [];
    }

    let backendEntities = [];
    try {
      const data = await api.entities.getAll();
      if (data && data.entities) {
        backendEntities = data.entities;
      }
    } catch {
      backendEntities = [];
    }

    const mergedNetworks = { ...PREDEFINED_SUSPECT_NETWORKS };

    // Process backend and custom entities
    [...backendEntities, ...customList].forEach((criminal) => {
      if (criminal && criminal.name) {
        const upper = criminal.name.trim().toUpperCase();
        if (!mergedNetworks[upper]) {
          mergedNetworks[upper] = buildCriminalGangNetwork(criminal);
        }
      }
    });

    setAllNetworksMap(mergedNetworks);

    // If preferred suspect provided
    if (preferredSuspectName) {
      const upperQuery = preferredSuspectName.trim().toUpperCase();
      const matchKey = Object.keys(mergedNetworks).find(
        key => key === upperQuery ||
               key.includes(upperQuery) ||
               mergedNetworks[key].name.toUpperCase().includes(upperQuery) ||
               mergedNetworks[key].id.toUpperCase().includes(upperQuery)
      );

      if (matchKey && mergedNetworks[matchKey]) {
        const net = mergedNetworks[matchKey];
        setCurrentNetwork(net);
        setSelectedNode(net.nodes[0]);
        setActiveSuspectKey(matchKey);
        setSearchQuery(net.name);
        return;
      }
    }
  }, []);

  // Helper to load or map suspect network
  const loadSuspectNetwork = useCallback((name) => {
    if (!name || !name.trim()) return;
    const query = name.trim();
    const upperQuery = query.toUpperCase();

    // Check if matches key in allNetworksMap
    let foundKey = Object.keys(allNetworksMap).find(
      key => key === upperQuery || 
             allNetworksMap[key].name.toUpperCase().includes(upperQuery) ||
             allNetworksMap[key].alias.toUpperCase().includes(upperQuery) ||
             allNetworksMap[key].id.toUpperCase().includes(upperQuery)
    );

    let network;
    if (foundKey) {
      network = allNetworksMap[foundKey];
      setActiveSuspectKey(foundKey);
    } else {
      // Procedurally build custom network for unknown query
      network = buildCriminalGangNetwork({ name: query });
      setActiveSuspectKey(query.toUpperCase());
    }

    setCurrentNetwork(network);
    setSelectedNode(network.nodes[0]);
    setSearchQuery(network.name);
    setIsDropdownOpen(false);
    showToast(`🕸️ Gang network mapped successfully for ${network.name}`);
  }, [allNetworksMap, showToast]);

  // Initial load and URL query sync
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const suspectParam = params.get('suspect') || params.get('id');
    loadAllNetworks(suspectParam);

    // Listen for global criminal added event
    const handleCriminalAdded = (e) => {
      const newCrim = e.detail;
      if (newCrim && newCrim.name) {
        showToast(`✓ New Criminal "${newCrim.name}" added to Gang Network.`);
        loadAllNetworks(newCrim.name);
      }
    };

    window.addEventListener('crimelens:criminal-added', handleCriminalAdded);
    return () => window.removeEventListener('crimelens:criminal-added', handleCriminalAdded);
  }, [location.search, loadAllNetworks, showToast]);

  // Handle Search Input submit
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      showToast('⚠️ Please enter a suspect name to map network.');
      return;
    }
    loadSuspectNetwork(searchQuery);
  };

  // Quick Suspect Preset List for instant chip selection (all networks)
  const quickSuspectChips = useMemo(() => {
    return Object.values(allNetworksMap).map((net) => {
      const isCritical = net.risk === 'CRITICAL';
      const color = isCritical ? '#dc2626' : (net.color || '#2563eb');
      return {
        label: `${net.isCustom ? '✨ ' : ''}${net.name} (${net.type.split(' ')[0]})`,
        key: net.name.toUpperCase(),
        color,
        isCustom: Boolean(net.isCustom),
        rawName: net.name
      };
    });
  }, [allNetworksMap]);

  // Suggestions for autocomplete dropdown
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      return Object.values(allNetworksMap);
    }
    const q = searchQuery.toLowerCase();
    return Object.values(allNetworksMap).filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.alias.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [allNetworksMap, searchQuery]);

  // Map nodes to coordinates lookup for edge drawing
  const nodeCoordsMap = useMemo(() => {
    const map = {};
    currentNetwork.nodes.forEach(n => {
      map[n.id] = { x: n.x, y: n.y, label: n.label, color: n.color };
    });
    return map;
  }, [currentNetwork]);

  return (
    <div style={{
      flex: 1,
      backgroundColor: 'var(--bg-app, #f8fafc)',
      color: 'var(--text-primary, #0f172a)',
      fontFamily: 'var(--font-sans, sans-serif)',
      padding: '24px 28px',
      maxWidth: '1600px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      
      {/* Component Styles */}
      <style>{`
        .interactive-btn {
          transition: all 0.15s ease;
        }
        .interactive-btn:hover {
          border-color: var(--accent-primary, #1e40af) !important;
        }

        .node-group {
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .node-group:hover {
          transform: scale(1.03);
        }
      `}</style>

      {/* ================= TOP SEARCH & SUSPECT CONTROL BANNER ================= */}
      <div style={{
        backgroundColor: 'var(--card-bg, #ffffff)',
        border: '1px solid var(--card-border, #e2e8f0)',
        borderRadius: '6px',
        padding: '16px 20px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '14px'
        }}>
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#1e40af',
              letterSpacing: '0.8px',
              marginBottom: '2px'
            }}>
              GANG SYNDICATE TOPOLOGY &amp; NEXUS
            </div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 800,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--card-text, #0f172a)'
            }}>
              <span>Gang Network Analyzer</span>
              <span style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: currentNetwork.risk === 'CRITICAL' ? '#dc2626' : '#d97706',
                backgroundColor: currentNetwork.risk === 'CRITICAL' ? '#fef2f2' : '#fffbeb',
                border: currentNetwork.risk === 'CRITICAL' ? '1px solid #fecaca' : '1px solid #fde68a',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                TARGET: {currentNetwork.name}
              </span>
            </h1>
          </div>

          {/* Quick Metrics Badge and Add Criminal Button */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              <span>+ Add Suspect to Map</span>
            </button>

            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#1e40af'
            }}>
              NODES: <strong>{currentNetwork.nodes.length}</strong> | EDGES: <strong>{currentNetwork.edges.length}</strong>
            </div>
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#dc2626'
            }}>
              THREAT INDEX: <strong>{currentNetwork.riskScore}</strong>
            </div>
          </div>
        </div>

        {/* Dynamic Suspect Name Search Input Form */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', marginBottom: '1rem' }}>
          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '14px',
                color: '#64748b'
              }}>
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Enter suspect name (e.g. Mayank Kotoli, Mahesh Khan, Devendra Rawat, Sameer Qureshi, Elena Rostova)..."
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  backgroundColor: 'var(--bg-input, #ffffff)',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  borderRadius: '6px',
                  padding: '9px 12px 9px 36px',
                  color: 'var(--text-primary, #0f172a)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsDropdownOpen(false);
                  }}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                padding: '9px 18px',
                fontSize: '12.5px',
                whiteSpace: 'nowrap'
              }}
            >
              <span>Map Network Graph</span>
            </button>
          </div>

          {/* Autocomplete / Preset Dropdown */}
          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: '160px',
              backgroundColor: 'var(--bg-modal, #ffffff)',
              border: '1px solid var(--border-color, #cbd5e1)',
              borderRadius: '0 0 6px 6px',
              marginTop: '4px',
              zIndex: 100,
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '260px',
              overflowY: 'auto'
            }}>
              <div style={{
                padding: '6px 12px',
                fontSize: '10.5px',
                fontFamily: 'monospace',
                color: 'var(--text-muted, #64748b)',
                backgroundColor: 'var(--bg-subtle, #f8fafc)',
                borderBottom: '1px solid var(--border-color, #e2e8f0)'
              }}>
                REGISTERED SYNDICATE SUSPECTS:
              </div>
              {filteredSuggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadSuspectNetwork(item.name)}
                  style={{
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--border-subtle, #f1f5f9)',
                    transition: 'background 0.12s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle, #f1f5f9)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                      {item.name} <span style={{ color: 'var(--accent-primary, #1e40af)', fontSize: '11px', fontWeight: 500 }}>({item.id})</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>
                      {item.type} • {item.alias}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    color: item.risk === 'CRITICAL' ? '#dc2626' : '#d97706',
                    backgroundColor: item.risk === 'CRITICAL' ? '#fef2f2' : '#fffbeb',
                    border: item.risk === 'CRITICAL' ? '1px solid #fecaca' : '1px solid #fde68a',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {item.riskScore}
                  </span>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Quick Suspect Selection Chips */}
        <div style={{
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b' }}>
            QUICK TARGETS:
          </span>
          {quickSuspectChips.map((chip) => {
            const isSelected = activeSuspectKey === chip.key || currentNetwork.name.toUpperCase().includes(chip.key);
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => loadSuspectNetwork(chip.key)}
                style={{
                  backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                  border: `1px solid ${isSelected ? '#bfdbfe' : '#e2e8f0'}`,
                  color: isSelected ? '#1e40af' : '#475569',
                  padding: '4px 10px',
                  borderRadius: '14px',
                  fontSize: '11px',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer'
                }}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= MAIN 3-COLUMN GRID LAYOUT ================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr 310px',
        gap: '1.25rem',
        alignItems: 'start'
      }}>

        {/* ================= LEFT CONTROLS PANEL ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{
            backgroundColor: 'var(--card-bg, #ffffff)',
            border: '1px solid var(--card-border, #e2e8f0)',
            borderRadius: '6px',
            padding: '14px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#1e40af',
              letterSpacing: '0.5px',
              fontWeight: 700,
              marginBottom: '4px'
            }}>
              TOPOLOGY VIEWS
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>
              Select neural analysis dimension
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { label: 'Network Overview', icon: '🌐' },
                { label: 'Syndicate Clusters', icon: '⚛' },
                { label: 'Weapon & Ballistics', icon: '🔫' },
                { label: 'Financial / Hawala', icon: '💰' },
                { label: 'Sigint Intercepts', icon: '📡' },
                { label: 'Transit & Safehouses', icon: '📍' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveTab(item.label);
                    showToast(`Switched view to: ${item.label}`);
                  }}
                  className="interactive-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: activeTab === item.label ? '600' : '500',
                    color: activeTab === item.label ? '#1e40af' : '#475569',
                    backgroundColor: activeTab === item.label ? '#eff6ff' : 'transparent',
                    border: `1px solid ${activeTab === item.label ? '#bfdbfe' : 'transparent'}`,
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

          {/* Graph Filters */}
          <div style={{
            backgroundColor: 'var(--card-bg, #ffffff)',
            border: '1px solid var(--card-border, #e2e8f0)',
            borderRadius: '6px',
            padding: '14px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted, #64748b)', letterSpacing: '0.5px', marginBottom: '12px', fontWeight: 700 }}>
              FILTER CONNECTIONS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary, #475569)', marginBottom: '4px' }}>Threat Level</label>
                <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)} style={{ width: '100%', backgroundColor: 'var(--bg-input, #ffffff)', border: '1px solid var(--border-color, #cbd5e1)', color: 'var(--text-primary, #0f172a)', padding: '6px 8px', borderRadius: '4px', fontSize: '12px' }}>
                  <option>All Levels</option>
                  <option>Critical & High Risk Only</option>
                  <option>Forensic & Weapon Links Only</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary, #475569)', marginBottom: '4px' }}>Link Category</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ width: '100%', backgroundColor: 'var(--bg-input, #ffffff)', border: '1px solid var(--border-color, #cbd5e1)', color: 'var(--text-primary, #0f172a)', padding: '6px 8px', borderRadius: '4px', fontSize: '12px' }}>
                  <option>All Connections</option>
                  <option>Contract & Command Links</option>
                  <option>Hawala & Financial Drops</option>
                  <option>Vehicle & Getaway Vectors</option>
                </select>
              </div>

              <button
                onClick={() => showToast(`✓ Topology filter active: ${filterRisk} · ${filterType}`)}
                className="btn-secondary"
                style={{ width: '100%', padding: '6px', fontSize: '12px', marginTop: '4px' }}
              >
                Apply Filter
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--card-bg-elevated, #f8fafc)', border: '1px solid var(--card-border, #e2e8f0)', borderRadius: '6px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'monospace' }}>
              <span style={{ color: 'var(--text-muted, #64748b)' }}>NEURAL ENGINE</span>
              <span style={{ color: 'var(--status-verified, #16a34a)', fontWeight: 600 }}>● SYNCHRONIZED</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'monospace' }}>
              <span style={{ color: 'var(--text-muted, #64748b)' }}>CENTRALITY ALGO</span>
              <span style={{ color: 'var(--accent-primary, #1e40af)', fontWeight: 600 }}>PageRank v4.2</span>
            </div>
          </div>

        </div>

        {/* ================= CENTER GRAPH CANVAS ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{
            backgroundColor: 'var(--card-bg, #ffffff)',
            border: '1px solid var(--card-border, #e2e8f0)',
            borderRadius: '6px',
            padding: '16px',
            position: 'relative',
            minHeight: '520px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-sm)'
          }}>
            
            {/* Header / Suspect Subtitle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '0.3px', margin: 0, color: 'var(--card-text, #0f172a)' }}>
                  {currentNetwork.name} // GANG TOPOLOGY
                </h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Cluster: <strong style={{ color: '#1e40af' }}>{currentNetwork.cluster}</strong>
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    setSelectedNode(currentNetwork.nodes[0]);
                    showToast(`Target node centered on ${currentNetwork.name}`);
                  }}
                  className="btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '11.5px' }}
                >
                  🎯 Center Target
                </button>
              </div>
            </div>

            {/* SVG Interactive Canvas */}
            <div style={{ flex: 1, position: 'relative', width: '100%', height: '390px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <svg width="100%" height="100%" viewBox="0 0 600 390" style={{ overflow: 'visible' }}>
                
                {/* Background Radar Rings */}
                <circle cx="300" cy="190" r="100" fill="none" stroke="#e2e8f0" strokeDasharray="3 3" />
                <circle cx="300" cy="190" r="160" fill="none" stroke="#e2e8f0" strokeDasharray="4 4" />

                {/* Graph Edges */}
                <g>
                  {currentNetwork.edges.map((edge, idx) => {
                    const src = nodeCoordsMap[edge.from];
                    const tgt = nodeCoordsMap[edge.to];
                    if (!src || !tgt) return null;

                    const midX = (src.x + tgt.x) / 2;
                    const midY = (src.y + tgt.y) / 2;

                    return (
                      <g key={idx}>
                        <line
                          x1={src.x}
                          y1={src.y}
                          x2={tgt.x}
                          y2={tgt.y}
                          stroke={edge.color || '#94a3b8'}
                          strokeWidth={edge.width || 1.6}
                          strokeDasharray={edge.dashed ? '4 4' : 'none'}
                        />
                        {/* Edge Label */}
                        <rect
                          x={midX - 35}
                          y={midY - 7}
                          width="70"
                          height="14"
                          fill="#ffffff"
                          rx="3"
                          stroke={edge.color || '#cbd5e1'}
                          strokeWidth="1"
                        />
                        <text
                          x={midX}
                          y={midY + 3.5}
                          fill="#0f172a"
                          fontSize="7.5"
                          fontFamily="monospace"
                          textAnchor="middle"
                          fontWeight="700"
                        >
                          {edge.label}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* Graph Nodes */}
                <g>
                  {currentNetwork.nodes.map((node) => {
                    const isCenter = node.id === 'N_CENTER';
                    const isSelected = selectedNode && selectedNode.id === node.id;

                    return (
                      <g
                        key={node.id}
                        className="node-group"
                        onClick={() => {
                          setSelectedNode(node);
                          showToast(`Selected Node: ${node.label}`);
                        }}
                      >
                        {/* Center Node Radar Halo */}
                        {isCenter && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="24"
                            fill="rgba(255, 77, 77, 0.18)"
                            stroke={node.color}
                            className="pulse-ring"
                          />
                        )}

                        {/* Node Halo for Selected */}
                        {isSelected && !isCenter && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.r + 7}
                            fill="none"
                            stroke="#1e40af"
                            strokeWidth="2"
                            strokeDasharray="2 2"
                          />
                        )}

                        {/* Node Circle */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.r}
                          fill={node.color}
                          stroke={isSelected ? '#0f172a' : '#ffffff'}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                        />

                        {/* Text Label */}
                        <text
                          x={node.x}
                          y={node.y > 190 ? node.y + node.r + 13 : node.y - node.r - 7}
                          fill="#0f172a"
                          fontSize={isCenter ? '10' : '8.5'}
                          fontFamily="sans-serif"
                          textAnchor="middle"
                          fontWeight={isCenter ? '800' : '600'}
                        >
                          {node.label}
                        </text>

                        {/* Sub-label for risk */}
                        <text
                          x={node.x}
                          y={node.y > 190 ? node.y + node.r + 22 : node.y - node.r - 16}
                          fill={node.color}
                          fontSize="7"
                          fontFamily="monospace"
                          textAnchor="middle"
                          fontWeight="700"
                        >
                          {node.risk} ({node.riskScore})
                        </text>
                      </g>
                    );
                  })}
                </g>

              </svg>
            </div>

            {/* Canvas Legend */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '10px',
              marginTop: '10px',
              fontSize: '11px',
              color: '#64748b'
            }}>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626' }}></span> Primary Target / Scene
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d97706' }}></span> Armorer / Weaponry
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></span> Hawala / Financial Escrow
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span> Sigint &amp; Getaway Vector
                </span>
              </div>

              <span style={{ fontFamily: 'monospace', color: '#1e40af', fontWeight: 600 }}>
                CLICK ANY NODE TO INSPECT
              </span>
            </div>

          </div>

          {/* ================= SELECTED NODE INSPECTOR ================= */}
          <div style={{
            backgroundColor: 'var(--card-bg, #ffffff)',
            border: '1px solid var(--card-border, #e2e8f0)',
            borderRadius: '6px',
            padding: '16px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <div style={{ fontSize: '11px', color: '#1e40af', fontFamily: 'monospace', fontWeight: 700 }}>
                SELECTED NODE INTELLIGENCE DOSSIER
              </div>
              <span style={{
                fontSize: '10px',
                fontFamily: 'monospace',
                color: selectedNode?.color || '#1e40af',
                backgroundColor: '#f1f5f9',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 700
              }}>
                STATUS: {selectedNode?.status || 'ACTIVE'}
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.8fr 1.2fr 1fr 1fr',
              gap: '1rem',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{selectedNode?.label}</div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>ROLE: {selectedNode?.role}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>THREAT / RISK</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: selectedNode?.color || '#dc2626' }}>
                  {selectedNode?.riskScore} ({selectedNode?.risk})
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>NODE TYPE</div>
                <div style={{ fontSize: '11.5px', fontWeight: 'bold', color: '#1e40af' }}>{selectedNode?.type}</div>
              </div>
              <div>
                <button
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('entities', { suspect: selectedNode?.label });
                    } else {
                      showToast(`Navigating to 360° Dossier for ${selectedNode?.label}`);
                    }
                  }}
                  className="btn-primary"
                  style={{
                    padding: '6px 12px',
                    fontSize: '11px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  View Dossier →
                </button>
              </div>
            </div>

            {/* Tactical Detail Snippet */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '10px 14px',
              fontSize: '12px',
              color: '#334155',
              lineHeight: 1.5
            }}>
              <strong style={{ color: '#0f172a' }}>FORENSIC &amp; OPERATIONAL INTEL:</strong> {selectedNode?.details || currentNetwork.description}
            </div>
          </div>

        </div>

        {/* ================= RIGHT METRICS & QUICK ACTIONS PANEL ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Suspect Profile Card */}
          <div style={{ backgroundColor: 'var(--card-bg, #ffffff)', border: '1px solid var(--card-border, #e2e8f0)', borderRadius: '6px', padding: '14px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted, #64748b)', marginBottom: '0.75rem', fontWeight: 700 }}>
              SUSPECT PROFILE SUMMARY
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>CRIMINAL ID</span>
                <strong style={{ color: 'var(--accent-primary, #1e40af)', fontFamily: 'monospace' }}>{currentNetwork.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>ALIAS</span>
                <strong style={{ color: 'var(--card-text, #0f172a)' }}>{currentNetwork.alias}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>CATEGORY</span>
                <strong style={{ color: 'var(--status-critical, #dc2626)' }}>{currentNetwork.category}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>POLICE STATION</span>
                <span style={{ color: 'var(--card-text, #0f172a)' }}>{currentNetwork.policeStation}</span>
              </div>
            </div>
          </div>

          {/* Network Statistics */}
          <div style={{ backgroundColor: 'var(--card-bg, #ffffff)', border: '1px solid var(--card-border, #e2e8f0)', borderRadius: '6px', padding: '14px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted, #64748b)', marginBottom: '0.75rem', fontWeight: 700 }}>
              TOPOLOGY METRICS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>Mapped Nodes</span>
                <strong style={{ color: 'var(--card-text, #0f172a)' }}>{currentNetwork.nodes.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>Active Vectors</span>
                <strong style={{ color: 'var(--card-text, #0f172a)' }}>{currentNetwork.edges.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>Network Density</span>
                <strong style={{ color: 'var(--accent-primary, #1e40af)' }}>0.82</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted, #64748b)' }}>Betweenness Centrality</span>
                <strong style={{ color: 'var(--status-critical, #dc2626)' }}>0.94 (High)</strong>
              </div>
            </div>
          </div>

          {/* Tactical Quick Actions */}
          <div style={{ backgroundColor: 'var(--card-bg, #ffffff)', border: '1px solid var(--card-border, #e2e8f0)', borderRadius: '6px', padding: '14px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b', marginBottom: '0.75rem', fontWeight: 700 }}>
              TACTICAL ACTIONS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => showToast(`🚨 STF Intercept alert broadcasted for ${currentNetwork.name} across NCR jurisdiction.`)}
                className="btn-danger"
                style={{
                  width: '100%',
                  fontSize: '12px',
                  padding: '8px',
                  justifyContent: 'center'
                }}
              >
                <span>Dispatch STF Intercept</span>
              </button>

              <button
                onClick={() => showToast(`📄 Exporting complete Gang Network Report for ${currentNetwork.name}...`)}
                className="btn-secondary"
                style={{
                  width: '100%',
                  fontSize: '12px',
                  padding: '8px',
                  justifyContent: 'center'
                }}
              >
                <span>Export Graph Report</span>
              </button>

              <button
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('entities', { suspect: currentNetwork.name });
                  } else {
                    showToast(`Navigating to 360° Dossier`);
                  }
                }}
                className="btn-primary"
                style={{
                  width: '100%',
                  fontSize: '12px',
                  padding: '8px',
                  justifyContent: 'center'
                }}
              >
                <span>Open 360° Dossier</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'var(--card-bg, #ffffff)',
          color: 'var(--card-text, #0f172a)',
          border: '1px solid var(--card-border, #e2e8f0)',
          padding: '10px 18px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
          boxShadow: 'var(--shadow-lg)',
          zIndex: 99999
        }}>
          {toastMessage}
        </div>
      )}

      {/* Add Criminal Modal */}
      <AddCriminalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCriminalAdded={(newCrim) => {
          if (newCrim) {
            showToast(`✓ Offender ${newCrim.name} mapped into Gang Network.`);
            loadAllNetworks(newCrim.name);
          }
        }}
      />
    </div>
  );
}