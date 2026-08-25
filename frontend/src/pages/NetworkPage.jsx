import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api.js';

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
      { id: 'N_BURNER', label: 'BURNER +91-98711-40291', type: 'SIGINT', role: 'Active Burner IMEI Intercept', risk: 'MEDIUM', riskScore: '85.0%', x: 460, y: 220, r: 11, color: '#00E5FF', status: 'TRIANGULATED', details: 'Cell tower triangulation pings moving along Meerut-Delhi Expressway corridors.' },
    ],
    edges: [
      { from: 'N_BOSS', to: 'N_CENTER', label: 'HIT CONTRACT (₹50L)', type: 'COMMAND', color: '#FF5555', width: 2.5, dashed: false },
      { from: 'N_ARMORER', to: 'N_CENTER', label: '9mm BERETTA SUPPLY', type: 'WEAPON', color: '#FBBF24', width: 2.0, dashed: true },
      { from: 'N_CENTER', to: 'N_SCENE', label: 'BALLISTICS 99.4% MATCH', type: 'FORENSIC', color: '#FF5555', width: 2.5, dashed: false },
      { from: 'N_CENTER', to: 'N_VEHICLE', label: 'GETAWAY ROUTE', type: 'TRANSIT', color: '#00E676', width: 2.0, dashed: true },
      { from: 'N_BOSS', to: 'N_HAWALA', label: 'HAWALA ESCROW', type: 'FINANCIAL', color: '#A855F7', width: 1.8, dashed: false },
      { from: 'N_HAWALA', to: 'N_CENTER', label: 'BOUNTY DISPERSAL', type: 'FINANCIAL', color: '#A855F7', width: 1.8, dashed: true },
      { from: 'N_CENTER', to: 'N_BURNER', label: 'SIGINT ENCRYPTED CHAT', type: 'COMMUNICATION', color: '#00E5FF', width: 1.8, dashed: true },
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
      { id: 'N_SATCOM', label: 'SATELLITE RELAY (+971-50)', type: 'SIGINT', role: 'Encrypted Comms Hub', risk: 'HIGH', riskScore: '90.0%', x: 390, y: 310, r: 11, color: '#00E5FF', status: 'ACTIVE_INTERCEPT', details: 'Satellite VoIP relay routed through encrypted European proxies to evade domestic wiretaps.' },
    ],
    edges: [
      { from: 'N_CENTER', to: 'N_HITMAN', label: 'EXECUTION COMMAND', type: 'COMMAND', color: '#FF5555', width: 2.5, dashed: false },
      { from: 'N_CENTER', to: 'N_HAWALA', label: 'FUNDS LAUNDERING', type: 'FINANCIAL', color: '#A855F7', width: 2.0, dashed: false },
      { from: 'N_CENTER', to: 'N_EXTORT', label: '₹50L EXTORTION DEMAND', type: 'CRIME', color: '#FBBF24', width: 2.2, dashed: true },
      { from: 'N_ARMS', to: 'N_CENTER', label: 'AK-47 / GLOCK SUPPLY', type: 'WEAPON', color: '#FBBF24', width: 2.0, dashed: true },
      { from: 'N_HAWALA', to: 'N_VAULT', label: 'OFFSHORE WIRE', type: 'FINANCIAL', color: '#A855F7', width: 2.0, dashed: false },
      { from: 'N_CENTER', to: 'N_SATCOM', label: 'SATELLITE LINK', type: 'COMMUNICATION', color: '#00E5FF', width: 1.8, dashed: true },
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
      { id: 'N_DNA', label: 'FORENSIC DNA MATCH #FK-8821', type: 'FORENSIC', role: 'Biological Evidence Vector', risk: 'CRITICAL', riskScore: '100%', x: 210, y: 310, r: 12, color: '#00E5FF', status: 'COURT_EVIDENCE', details: '100% STR DNA match confirmed across 3 crime scene rape test kits by State FSL.' },
      { id: 'N_BURNER', label: 'BURNER +91-98112-99011', type: 'SIGINT', role: 'Stalking Telemetry Device', risk: 'MEDIUM', riskScore: '84.0%', x: 390, y: 310, r: 11, color: '#00E5FF', status: 'SIGNAL_ACTIVE', details: 'Tower triangulation confirms device pings near bus terminals between 22:00 and 03:00 hrs.' },
    ],
    edges: [
      { from: 'N_PLATES', to: 'N_TAXI', label: 'COUNTERFEIT NUMBER PLATES', type: 'LOGISTICS', color: '#FBBF24', width: 2.0, dashed: true },
      { from: 'N_CENTER', to: 'N_TAXI', label: 'TRANSIT OPERATIONS', type: 'VECTOR', color: '#FF5555', width: 2.5, dashed: false },
      { from: 'N_CENTER', to: 'N_PRISON', label: 'TIHAR PRISON NETWORK', type: 'ASSOCIATE', color: '#FF5555', width: 2.0, dashed: true },
      { from: 'N_CENTER', to: 'N_SAFEHOUSE', label: 'HABITATION BASE', type: 'INFRASTRUCTURE', color: '#00E676', width: 2.0, dashed: false },
      { from: 'N_CENTER', to: 'N_DNA', label: 'STR DNA 100% MATCH', type: 'FORENSIC', color: '#00E5FF', width: 2.5, dashed: false },
      { from: 'N_CENTER', to: 'N_BURNER', label: 'IMSI TRACKING', type: 'COMMUNICATION', color: '#00E5FF', width: 1.8, dashed: true },
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
      { id: 'N_BOLERO', label: 'GETAWAY BOLERO (HR26-XX-4902)', type: 'VEHICLE', role: 'Armed Getaway Vector', risk: 'HIGH', riskScore: '96.0%', x: 140, y: 220, r: 12, color: '#00E5FF', status: 'GPS_BEACON_HIT', details: 'Equipped with police scanner and fake police strobe lights to evade highway checkpoints.' },
      { id: 'N_MARKET', label: 'BULLION FENCER (CHANDNI CHOWK)', type: 'FINANCIAL', role: 'Black Market Melter', risk: 'HIGH', riskScore: '89.2%', x: 460, y: 220, r: 12, color: '#A855F7', status: 'SURVEILLED', details: 'Undercover surveillance active on smelting shop converting marked bullion into unmarked bars.' },
      { id: 'N_JAMMER', label: 'SIGNAL JAMMER TRUCK', type: 'EQUIPMENT', role: 'Electronic Warfare Unit', risk: 'MEDIUM', riskScore: '82.0%', x: 210, y: 310, r: 11, color: '#00E676', status: 'SEIZED_PARTS', details: 'High-power RF jammer blocking cellular alarms, CCTV Wi-Fi relays, and guard panic triggers.' },
      { id: 'N_HITMAN', label: 'MAYANK KOTOLI', type: 'LEAD_HITMAN', role: 'Armed Escort / Firepower', risk: 'CRITICAL', riskScore: '99.4%', x: 390, y: 310, r: 13, color: '#FF5555', status: 'ACTIVE_FUGITIVE', details: 'Provided armed perimeter suppression during multi-city bank vault operations.' },
    ],
    edges: [
      { from: 'N_CENTER', to: 'N_VAULT', label: 'THERMAL LANCE BREACH', type: 'HEIST', color: '#FF5555', width: 2.5, dashed: false },
      { from: 'N_CENTER', to: 'N_BOLERO', label: 'EVASION GETAWAY', type: 'TRANSIT', color: '#00E5FF', width: 2.0, dashed: true },
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
      { id: 'N_VESSEL', label: 'ARABIAN SEA CARGO VESSEL', type: 'MARITIME', role: 'Deep-Sea Smuggling Vessel', risk: 'HIGH', riskScore: '90.0%', x: 210, y: 310, r: 11, color: '#00E5FF', status: 'COAST_GUARD_TRACKED', details: 'AIS transponder blacked out periodically across international maritime corridors.' },
      { id: 'N_ENCRYPT', label: 'ENCRYPTED THREEMA / SATCOM', type: 'SIGINT', role: 'Secure Command Channel', risk: 'MEDIUM', riskScore: '86.0%', x: 390, y: 310, r: 11, color: '#00E5FF', status: 'SIGNAL_INTERCEPTED', details: 'Encrypted telemetry decoded showing scheduled drops at Gujarat and Maharashtra ports.' },
    ],
    edges: [
      { from: 'N_CENTER', to: 'N_PORT', label: '100KG OPIOIDS SHIPMENT', type: 'NARCO', color: '#FF5555', width: 2.5, dashed: false },
      { from: 'N_CENTER', to: 'N_ARMS', label: 'TACTICAL SMG IMPORTS', type: 'WEAPON', color: '#FBBF24', width: 2.2, dashed: false },
      { from: 'N_CENTER', to: 'N_KHAN', label: 'SYNDICATE DISTRIBUTION', type: 'COMMAND', color: '#FF5555', width: 2.0, dashed: true },
      { from: 'N_CENTER', to: 'N_WIRE', label: '$4.2M OFFSHORE LAUNDERING', type: 'FINANCIAL', color: '#A855F7', width: 2.0, dashed: false },
      { from: 'N_VESSEL', to: 'N_PORT', label: 'MARITIME FREIGHT ROUTE', type: 'LOGISTICS', color: '#00E5FF', width: 1.8, dashed: true },
      { from: 'N_CENTER', to: 'N_ENCRYPT', label: 'SATCOM CODES', type: 'COMMUNICATION', color: '#00E5FF', width: 1.8, dashed: true },
    ]
  }
};

// Procedural Gang Network Generator for ANY custom suspect name
function generateCustomSuspectNetwork(suspectName) {
  const cleanName = suspectName.trim().toUpperCase();
  const idHash = Math.abs(cleanName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 9000) + 1000;
  const riskNum = (85 + (idHash % 150) / 10).toFixed(1);

  return {
    name: cleanName,
    id: `CRM-${idHash}`,
    alias: `Code ${cleanName.split(' ')[0]}-X`,
    risk: riskNum > 90 ? 'CRITICAL' : 'HIGH',
    riskScore: `${riskNum}%`,
    type: 'Suspected Syndicate Operative',
    cluster: `CLUSTER_SYNTHETIC_${cleanName.replace(/\s+/g, '_')}`,
    category: 'Syndicate Affiliation & Inter-state Network',
    firstSeen: '01 Jan 2024',
    connections: 16 + (idHash % 12),
    activityLevel: 'Under Intelligence Surveillance',
    policeStation: 'State Intelligence Bureau / Special Task Force',
    description: `Procedurally generated gang network topology for suspect "${cleanName}". Neural graph engine correlated active phone records, known co-defendants, vehicle ANPR sightings, and financial transaction links.`,
    nodes: [
      { id: 'N_CENTER', label: cleanName, type: 'PRIMARY_SUSPECT', role: 'Target Suspect Node', risk: riskNum > 90 ? 'CRITICAL' : 'HIGH', riskScore: `${riskNum}%`, x: 300, y: 190, r: 18, color: '#FF5555', status: 'SURVEILLED', details: `Indexed under Central Police Crime Database. Subject of active intelligence inquiries.` },
      { id: 'N_ASSOCIATE_1', label: `LIEUTENANT (${cleanName.slice(0, 3)}-CELL)`, type: 'GANG_MEMBER', role: 'Key Sub-Lieutenant', risk: 'HIGH', riskScore: '88.5%', x: 170, y: 100, r: 13, color: '#FF9900', status: 'ACTIVE_MONITORING', details: `Coordinates ground logistical execution and field recruit dispatch.` },
      { id: 'N_SUPPLIER', label: 'ILLEGAL WEAPONRY CONDUIT', type: 'ARMS_SUPPLIER', role: 'Armorer / Firearms Nexus', risk: 'HIGH', riskScore: '92.0%', x: 430, y: 100, r: 13, color: '#FBBF24', status: 'STF_WATCHLIST', details: `Linked to illicit firearm procurement channels and unlicensed ammunition trade.` },
      { id: 'N_SAFEHOUSE', label: 'NCR BORDER SAFEHOUSE', type: 'INFRASTRUCTURE', role: 'Triangulated Shelter', risk: 'MEDIUM', riskScore: '81.4%', x: 140, y: 220, r: 12, color: '#00E676', status: 'SURVEILLED', details: `Tactical rendezvous point identified via recurring cellular tower handoffs.` },
      { id: 'N_FINANCIAL', label: 'BENAMI UPI / HAWALA LEDGER', type: 'FINANCIAL', role: 'Illicit Capital Flow', risk: 'HIGH', riskScore: '89.0%', x: 460, y: 220, r: 12, color: '#A855F7', status: 'AUDIT_FLAGGED', details: `Suspicious high-velocity split transactions detected across benami accounts.` },
      { id: 'N_TRANSIT', label: 'SURVEILLED TRANSIT VECTOR', type: 'VEHICLE', role: 'Getaway & Transport', risk: 'MEDIUM', riskScore: '78.5%', x: 210, y: 310, r: 11, color: '#00E5FF', status: 'ANPR_FLAGGED', details: `Registered to proxy owner; captured near key crime incident hotspots.` },
      { id: 'N_COMM', label: 'BURNING SIM TELEMETRY', type: 'SIGINT', role: 'Encrypted Comms Hub', risk: 'MEDIUM', riskScore: '84.0%', x: 390, y: 310, r: 11, color: '#00E5FF', status: 'INTERCEPT_ACTIVE', details: `Signal analysis shows burner swaps every 14 days to evade long-term wiretapping.` },
    ],
    edges: [
      { from: 'N_CENTER', to: 'N_ASSOCIATE_1', label: 'DIRECT INSTRUCTION', type: 'COMMAND', color: '#FF5555', width: 2.2, dashed: false },
      { from: 'N_SUPPLIER', to: 'N_CENTER', label: 'EQUIPMENT SUPPLY', type: 'WEAPON', color: '#FBBF24', width: 2.0, dashed: true },
      { from: 'N_CENTER', to: 'N_SAFEHOUSE', label: 'FREQUENT VISITATION', type: 'INFRASTRUCTURE', color: '#00E676', width: 1.8, dashed: false },
      { from: 'N_CENTER', to: 'N_FINANCIAL', label: 'FUNDS TRANSIT', type: 'FINANCIAL', color: '#A855F7', width: 2.0, dashed: true },
      { from: 'N_CENTER', to: 'N_TRANSIT', label: 'TRANSIT CORRIDOR', type: 'LOGISTICS', color: '#00E5FF', width: 1.8, dashed: false },
      { from: 'N_CENTER', to: 'N_COMM', label: 'ENCRYPTED SIGNAL', type: 'COMMUNICATION', color: '#00E5FF', width: 1.8, dashed: true },
    ]
  };
}

export default function NetworkTopologyPage({ onNavigate }) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSuspectKey, setActiveSuspectKey] = useState('MAYANK KOTOLI');
  const [currentNetwork, setCurrentNetwork] = useState(PREDEFINED_SUSPECT_NETWORKS['MAYANK KOTOLI']);
  const [selectedNode, setSelectedNode] = useState(PREDEFINED_SUSPECT_NETWORKS['MAYANK KOTOLI'].nodes[0]);
  const [toastMessage, setToastMessage] = useState(null);
  const [filterRisk, setFilterRisk] = useState('All Levels');
  const [filterType, setFilterType] = useState('All Connections');
  const [activeTab, setActiveTab] = useState('Network Overview');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Show Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to load or map suspect network
  const loadSuspectNetwork = (name) => {
    if (!name || !name.trim()) return;
    const query = name.trim();
    const upperQuery = query.toUpperCase();

    // Check if matches predefined key or alias
    let foundKey = Object.keys(PREDEFINED_SUSPECT_NETWORKS).find(
      key => key === upperQuery || 
             PREDEFINED_SUSPECT_NETWORKS[key].name.toUpperCase().includes(upperQuery) ||
             PREDEFINED_SUSPECT_NETWORKS[key].alias.toUpperCase().includes(upperQuery) ||
             PREDEFINED_SUSPECT_NETWORKS[key].id.toUpperCase().includes(upperQuery)
    );

    let network;
    if (foundKey) {
      network = PREDEFINED_SUSPECT_NETWORKS[foundKey];
      setActiveSuspectKey(foundKey);
    } else {
      // Check partial match
      if (upperQuery.includes('MAYANK') || upperQuery.includes('KOTOLI')) {
        network = PREDEFINED_SUSPECT_NETWORKS['MAYANK KOTOLI'];
        setActiveSuspectKey('MAYANK KOTOLI');
      } else if (upperQuery.includes('MAHESH') || upperQuery.includes('KHAN') || upperQuery.includes('TIGER')) {
        network = PREDEFINED_SUSPECT_NETWORKS['MAHESH KHAN'];
        setActiveSuspectKey('MAHESH KHAN');
      } else if (upperQuery.includes('DEVENDRA') || upperQuery.includes('RAWAT') || upperQuery.includes('D-7')) {
        network = PREDEFINED_SUSPECT_NETWORKS['DEVENDRA RAWAT'];
        setActiveSuspectKey('DEVENDRA RAWAT');
      } else if (upperQuery.includes('SAMEER') || upperQuery.includes('QURESHI') || upperQuery.includes('GHOST')) {
        network = PREDEFINED_SUSPECT_NETWORKS['SAMEER QURESHI'];
        setActiveSuspectKey('SAMEER QURESHI');
      } else if (upperQuery.includes('ELENA') || upperQuery.includes('ROSTOVA') || upperQuery.includes('CZAR')) {
        network = PREDEFINED_SUSPECT_NETWORKS['ELENA ROSTOVA'];
        setActiveSuspectKey('ELENA ROSTOVA');
      } else {
        // Generate procedural dynamic gang network
        network = generateCustomSuspectNetwork(query);
        setActiveSuspectKey(query.toUpperCase());
      }
    }

    setCurrentNetwork(network);
    setSelectedNode(network.nodes[0]);
    setSearchQuery(network.name);
    setIsDropdownOpen(false);
    showToast(`🕸️ Gang network mapped successfully for ${network.name}`);
  };

  // Sync with URL query parameter on mount if provided (e.g. ?suspect=Mahesh+Khan)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const suspectParam = params.get('suspect');
    if (suspectParam) {
      loadSuspectNetwork(suspectParam);
    }
  }, [location.search]);

  // Handle Search Input submit
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      showToast('⚠️ Please enter a suspect name to map network.');
      return;
    }
    loadSuspectNetwork(searchQuery);
  };

  // Quick Suspect Preset List for instant chip selection
  const quickSuspectChips = [
    { label: '🔴 Mayank Kotoli (Hitman)', key: 'MAYANK KOTOLI', color: '#FF5555' },
    { label: '🔵 Mahesh Khan (Kingpin)', key: 'MAHESH KHAN', color: '#00E5FF' },
    { label: '🟠 Devendra Rawat (Predator)', key: 'DEVENDRA RAWAT', color: '#FF9900' },
    { label: '🟡 Sameer Qureshi (Heist)', key: 'SAMEER QURESHI', color: '#FBBF24' },
    { label: '🟣 Elena Rostova (Cartel)', key: 'ELENA ROSTOVA', color: '#A855F7' }
  ];

  // Suggestions for autocomplete dropdown
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      return Object.values(PREDEFINED_SUSPECT_NETWORKS);
    }
    const q = searchQuery.toLowerCase();
    return Object.values(PREDEFINED_SUSPECT_NETWORKS).filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.alias.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

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
      backgroundColor: 'var(--bg-dark, #070c14)',
      color: 'var(--text-primary, #F8FAFC)',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '1.5rem 2rem',
      maxWidth: '1600px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      
      {/* Keyframe Animations & Global Cyber Styles */}
      <style>{`
        :root {
          --bg-dark: #070c14;
          --card-bg: rgba(11, 18, 30, 0.88);
          --border-color: rgba(0, 229, 255, 0.18);
          --cyan-glow: #00e5ff;
          --coral-glow: #ff4d4d;
          --orange-glow: #ff9900;
          --text-muted: #64748b;
          --text-secondary: #94a3b8;
        }

        /* Continuous Pulse Animation for High Risk Central Node */
        @keyframes pulseGlow {
          0% {
            r: 22px;
            opacity: 0.85;
            stroke-width: 1.5px;
          }
          50% {
            r: 34px;
            opacity: 0.15;
            stroke-width: 3px;
          }
          100% {
            r: 22px;
            opacity: 0.85;
            stroke-width: 1.5px;
          }
        }

        /* Subtle Floating Animation for Nodes */
        @keyframes nodeFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
          100% { transform: translateY(0px); }
        }

        /* Dashed Line Data Flow Animation */
        @keyframes dashFlow {
          to {
            stroke-dashoffset: -20;
          }
        }

        .pulse-ring {
          animation: pulseGlow 2.4s infinite ease-in-out;
          transform-origin: center;
        }

        .floating-group {
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
          box-shadow: 0 0 12px rgba(0, 229, 255, 0.25);
        }

        .node-group {
          cursor: pointer;
          transition: transform 0.2s ease, filter 0.2s ease;
        }
        .node-group:hover {
          filter: drop-shadow(0 0 10px currentColor);
          transform: scale(1.04);
        }
      `}</style>

      {/* ================= TOP SEARCH & SUSPECT CONTROL BANNER ================= */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1.5px solid var(--border-color)',
        borderRadius: '10px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              color: 'var(--cyan-glow)',
              letterSpacing: '1.5px',
              marginBottom: '4px'
            }}>
              // GANG NETWORK TOPOLOGY & INTELLIGENCE NEXUS
            </div>
            <h1 style={{
              fontSize: '22px',
              fontWeight: 900,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#FFFFFF'
            }}>
              <span>🕸️</span>
              <span>GANG NETWORK ANALYZER</span>
              <span style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#07090E',
                backgroundColor: currentNetwork.risk === 'CRITICAL' ? '#FF5555' : '#FBBF24',
                padding: '3px 8px',
                borderRadius: '4px'
              }}>
                TARGET: {currentNetwork.name}
              </span>
            </h1>
          </div>

          {/* Quick Metrics Badge */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{
              backgroundColor: 'rgba(0, 229, 255, 0.08)',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: 'var(--cyan-glow)'
            }}>
              NODES: <strong>{currentNetwork.nodes.length}</strong> | EDGES: <strong>{currentNetwork.edges.length}</strong>
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 85, 85, 0.1)',
              border: '1px solid rgba(255, 85, 85, 0.3)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#FF5555'
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
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                color: 'var(--cyan-glow)'
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
                  backgroundColor: 'rgba(7, 12, 20, 0.95)',
                  border: '1.5px solid rgba(0, 229, 255, 0.4)',
                  borderRadius: '6px',
                  padding: '12px 14px 12px 42px',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  outline: 'none',
                  boxShadow: '0 0 15px rgba(0, 229, 255, 0.1)'
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
                    color: '#94A3B8',
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
              className="interactive-btn"
              style={{
                backgroundColor: 'var(--cyan-glow)',
                color: '#07090E',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 22px',
                fontSize: '12.5px',
                fontWeight: 800,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)'
              }}
            >
              <span>⚡</span>
              <span>MAP GANG NETWORK</span>
            </button>
          </div>

          {/* Autocomplete / Preset Dropdown */}
          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: '180px',
              backgroundColor: 'rgba(11, 18, 30, 0.98)',
              border: '1px solid var(--cyan-glow)',
              borderRadius: '0 0 8px 8px',
              marginTop: '4px',
              zIndex: 100,
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.8)',
              maxHeight: '260px',
              overflowY: 'auto'
            }}>
              <div style={{
                padding: '8px 12px',
                fontSize: '10.5px',
                fontFamily: 'monospace',
                color: 'var(--text-secondary)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                SELECT REGISTERED SYNDICATE SUSPECT OR PRESS ENTER FOR CUSTOM NETWORK:
              </div>
              {filteredSuggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadSuspectNetwork(item.name)}
                  style={{
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.12)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                      {item.name} <span style={{ color: 'var(--cyan-glow)', fontSize: '11px', fontWeight: 500 }}>({item.id})</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {item.type} • {item.alias}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    color: item.risk === 'CRITICAL' ? '#FF5555' : '#FBBF24',
                    backgroundColor: item.risk === 'CRITICAL' ? 'rgba(255, 85, 85, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                    padding: '2px 8px',
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
          gap: '8px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
            QUICK SELECT:
          </span>
          {quickSuspectChips.map((chip) => {
            const isSelected = activeSuspectKey === chip.key || currentNetwork.name.toUpperCase().includes(chip.key);
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => loadSuspectNetwork(chip.key)}
                className="interactive-btn"
                style={{
                  backgroundColor: isSelected ? 'rgba(0, 229, 255, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${isSelected ? 'var(--cyan-glow)' : 'rgba(255, 255, 255, 0.12)'}`,
                  color: isSelected ? 'var(--cyan-glow)' : 'var(--text-secondary)',
                  padding: '5px 11px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  fontWeight: isSelected ? 700 : 500,
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
              // TOPOLOGY VIEWS
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
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

          {/* Graph Filters */}
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1rem'
          }}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '1rem', fontWeight: 700 }}>
              FILTER CONNECTIONS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Threat Level</label>
                <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)} style={{ width: '100%', backgroundColor: 'rgba(7, 12, 20, 0.8)', border: '1px solid rgba(0, 229, 255, 0.2)', color: '#fff', padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
                  <option>All Levels</option>
                  <option>Critical & High Risk Only</option>
                  <option>Forensic & Weapon Links Only</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Link Category</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ width: '100%', backgroundColor: 'rgba(7, 12, 20, 0.8)', border: '1px solid rgba(0, 229, 255, 0.2)', color: '#fff', padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
                  <option>All Connections</option>
                  <option>Contract & Command Links</option>
                  <option>Hawala & Financial Drops</option>
                  <option>Vehicle & Getaway Vectors</option>
                </select>
              </div>

              <button
                onClick={() => showToast(`✓ Topology filter active: ${filterRisk} · ${filterType}`)}
                className="interactive-btn"
                style={{ width: '100%', backgroundColor: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--cyan-glow)', color: 'var(--cyan-glow)', padding: '8px', borderRadius: '4px', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
              >
                APPLY FILTER
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'monospace' }}>
              <span style={{ color: 'var(--text-secondary)' }}>NEURAL ENGINE</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>● SYNCHRONIZED</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'monospace' }}>
              <span style={{ color: 'var(--text-secondary)' }}>CENTRALITY ALGO</span>
              <span style={{ color: 'var(--cyan-glow)' }}>PageRank v4.2</span>
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
            flexDirection: 'column',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}>
            
            {/* Header / Suspect Subtitle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px', margin: 0, color: '#FFFFFF' }}>
                  {currentNetwork.name} // GANG NETWORK TOPOLOGY
                </h2>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Cluster: <strong style={{ color: 'var(--cyan-glow)' }}>{currentNetwork.cluster}</strong>
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    setSelectedNode(currentNetwork.nodes[0]);
                    showToast(`Target node centered on ${currentNetwork.name}`);
                  }}
                  className="interactive-btn"
                  style={{ backgroundColor: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.3)', color: 'var(--cyan-glow)', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
                >
                  🎯 CENTER TARGET
                </button>
              </div>
            </div>

            {/* SVG Interactive Canvas */}
            <div style={{ flex: 1, position: 'relative', width: '100%', height: '390px', backgroundColor: 'rgba(4, 8, 15, 0.75)', borderRadius: '6px', border: '1px solid rgba(0, 229, 255, 0.1)' }}>
              <svg width="100%" height="100%" viewBox="0 0 600 390" style={{ overflow: 'visible' }}>
                
                {/* Background Radar Rings */}
                <circle cx="300" cy="190" r="100" fill="none" stroke="rgba(0, 229, 255, 0.05)" strokeDasharray="3 3" />
                <circle cx="300" cy="190" r="160" fill="none" stroke="rgba(0, 229, 255, 0.03)" strokeDasharray="4 4" />

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
                          stroke={edge.color || 'rgba(0, 229, 255, 0.4)'}
                          strokeWidth={edge.width || 1.5}
                          className={edge.dashed ? 'animated-edge' : ''}
                        />
                        {/* Edge Label */}
                        <rect
                          x={midX - 35}
                          y={midY - 7}
                          width="70"
                          height="14"
                          fill="rgba(7, 12, 20, 0.9)"
                          rx="3"
                          stroke={edge.color}
                          strokeWidth="0.5"
                        />
                        <text
                          x={midX}
                          y={midY + 3}
                          fill="#FFFFFF"
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
                <g className="floating-group">
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
                            stroke="var(--cyan-glow)"
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
                          stroke={isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)'}
                          strokeWidth={isSelected ? 2 : 1}
                          style={{ filter: `drop-shadow(0 0 8px ${node.color})` }}
                        />

                        {/* Text Label */}
                        <text
                          x={node.x}
                          y={node.y > 190 ? node.y + node.r + 14 : node.y - node.r - 8}
                          fill="#FFFFFF"
                          fontSize={isCenter ? '10.5' : '9'}
                          fontFamily="sans-serif"
                          textAnchor="middle"
                          fontWeight={isCenter ? '900' : '700'}
                          style={{ textShadow: '0 2px 4px #000000' }}
                        >
                          {node.label}
                        </text>

                        {/* Sub-label for risk */}
                        <text
                          x={node.x}
                          y={node.y > 190 ? node.y + node.r + 24 : node.y - node.r - 18}
                          fill={node.color}
                          fontSize="7.5"
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
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: '10px',
              marginTop: '10px',
              fontSize: '11px',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF5555' }}></span> Primary Target / Crime Scene
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FBBF24' }}></span> Armorer / Weaponry
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#A855F7' }}></span> Hawala / Financial Escrow
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00E5FF' }}></span> Sigint & Getaway Vector
                </span>
              </div>

              <span style={{ fontFamily: 'monospace', color: 'var(--cyan-glow)' }}>
                CLICK ANY NODE TO INSPECT
              </span>
            </div>

          </div>

          {/* ================= SELECTED NODE INSPECTOR ================= */}
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.25rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--cyan-glow)', fontFamily: 'monospace' }}>
                🎯 SELECTED NODE INTELLIGENCE DOSSIER
              </div>
              <span style={{
                fontSize: '10px',
                fontFamily: 'monospace',
                color: selectedNode?.color || '#00E5FF',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
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
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#FFFFFF' }}>{selectedNode?.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ROLE: {selectedNode?.role}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>THREAT / RISK</div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: selectedNode?.color }}>
                  {selectedNode?.riskScore} ({selectedNode?.risk})
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>NODE TYPE</div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--cyan-glow)' }}>{selectedNode?.type}</div>
              </div>
              <div>
                <button
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('entities');
                    } else {
                      showToast(`Navigating to 360° Dossier for ${selectedNode?.label}`);
                    }
                  }}
                  className="interactive-btn"
                  style={{
                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    border: '1px solid var(--cyan-glow)',
                    color: 'var(--cyan-glow)',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  VIEW DOSSIER →
                </button>
              </div>
            </div>

            {/* Tactical Detail Snippet */}
            <div style={{
              backgroundColor: 'rgba(7, 12, 20, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              padding: '10px 14px',
              fontSize: '12px',
              color: '#CBD5E1',
              lineHeight: 1.5
            }}>
              <strong>FORENSIC & OPERATIONAL INTEL:</strong> {selectedNode?.details || currentNetwork.description}
            </div>
          </div>

        </div>

        {/* ================= RIGHT METRICS & QUICK ACTIONS PANEL ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Suspect Profile Card */}
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 700 }}>
              SUSPECT PROFILE SUMMARY
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>CRIMINAL ID</span>
                <strong style={{ color: 'var(--cyan-glow)' }}>{currentNetwork.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>ALIAS</span>
                <strong>{currentNetwork.alias}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>CATEGORY</span>
                <strong style={{ color: '#FF5555' }}>{currentNetwork.category}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>POLICE STATION</span>
                <span>{currentNetwork.policeStation}</span>
              </div>
            </div>
          </div>

          {/* Network Statistics */}
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 700 }}>
              TOPOLOGY METRICS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Mapped Nodes</span>
                <strong>{currentNetwork.nodes.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Active Edges / Vectors</span>
                <strong>{currentNetwork.edges.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Network Density</span>
                <strong style={{ color: 'var(--cyan-glow)' }}>0.82</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Betweenness Centrality</span>
                <strong style={{ color: '#FF5555' }}>0.94 (Max)</strong>
              </div>
            </div>
          </div>

          {/* Tactical Quick Actions */}
          <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 700 }}>
              TACTICAL COMMAND ACTIONS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => showToast(`🚨 Tactical STF Intercept alert broadcasted for ${currentNetwork.name} across NCR jurisdiction.`)}
                className="interactive-btn"
                style={{
                  backgroundColor: 'rgba(255, 85, 85, 0.15)',
                  border: '1px solid #FF5555',
                  color: '#FF5555',
                  padding: '9px',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>🚨</span>
                <span>DISPATCH STF INTERCEPT</span>
              </button>

              <button
                onClick={() => showToast(`📄 Exporting complete Gang Network Intelligence Dossier for ${currentNetwork.name}...`)}
                className="interactive-btn"
                style={{
                  backgroundColor: 'rgba(0, 229, 255, 0.1)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  color: 'var(--cyan-glow)',
                  padding: '9px',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>📄</span>
                <span>EXPORT GRAPH REPORT</span>
              </button>

              <button
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('entities');
                  } else {
                    showToast(`Navigating to Entity 360 page`);
                  }
                }}
                className="interactive-btn"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '9px',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>👤</span>
                <span>OPEN 360° DOSSIER</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Floating Tactical Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          backgroundColor: 'rgba(0, 229, 255, 0.95)',
          color: '#07090E',
          padding: '12px 20px',
          borderRadius: '6px',
          fontWeight: 800,
          fontFamily: 'monospace',
          fontSize: '13px',
          boxShadow: '0 0 25px rgba(0, 229, 255, 0.6)',
          zIndex: 99999,
          border: '1px solid #FFFFFF'
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}