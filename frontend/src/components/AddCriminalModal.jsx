import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { api } from '../services/api.js';

export default function AddCriminalModal({ isOpen, onClose, onCriminalAdded, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    aliases: '',
    crimeType: 'HOMICIDE & CONTRACT KILLING',
    firNumbers: '',
    policeStation: 'Special Crime Branch / PS Sector 18',
    weaponSignature: '',
    modusOperandi: '',
    wantedReward: '₹200,000 INR',
    scarsAndMarks: '',
    phone: '',
    threatLevel: 'CRITICAL',
    riskScore: 95
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      const newId = `CRM-${Math.floor(1000 + Math.random() * 9000)}`;
      const aliasList = formData.aliases
        ? formData.aliases.split(',').map(a => a.trim()).filter(Boolean)
        : [`Alias ${formData.name.trim().split(' ')[0]}`];

      const firList = formData.firNumbers
        ? formData.firNumbers.split(',').map(f => f.trim()).filter(Boolean)
        : [`FIR-2024-${Math.floor(100 + Math.random() * 900)} (${formData.policeStation})`];

      const payload = {
        id: newId,
        name: formData.name.trim().toUpperCase(),
        aliases: aliasList,
        crimeType: formData.crimeType,
        firNumbers: firList,
        policeStation: formData.policeStation || 'State Crime Branch',
        weaponSignature: formData.weaponSignature || 'Unlicensed Firearm / Country-made Pistol',
        modusOperandi: formData.modusOperandi || 'Repeat violent offender tracked by State Police STF.',
        wantedReward: formData.wantedReward || '₹200,000 INR',
        dnaProfileMatch: 'Indexed in Police Biometrics Archive',
        scarsAndMarks: formData.scarsAndMarks || 'Identification marks catalogued in CCTNS records.',
        phone: formData.phone || '',
        threatLevel: formData.threatLevel,
        riskScore: Number(formData.riskScore) || 92,
        status: 'ACTIVE_WARRANT',
        category: formData.crimeType,
        biometrics: {
          dob: '1990-01-01',
          nationality: 'Indian',
          scarsAndMarks: formData.scarsAndMarks || 'Identification marks catalogued in police records.',
          voiceprintConfidence: '95.2%',
          facialVectorId: `FV-${newId}`
        },
        knownAssociates: [
          { id: 'CRM-0014', name: "Mahesh 'Tiger' Khan", relation: 'Syndicate Network Link', risk: 'CRITICAL' }
        ],
        financialAccounts: [
          { bank: 'Benami Cash Ledger', accNo: 'SECTOR-CASH-DROP', balance: '₹5.5 Lakhs (Flagged)' }
        ],
        burnerDevices: formData.phone ? [
          { imei: `86420193847${Math.floor(1000 + Math.random() * 9000)}`, number: formData.phone, status: 'Active Signal Surveillance' }
        ] : []
      };

      let finalEntity = payload;

      try {
        const res = await api.entities.create(payload);
        if (res && res.entity) {
          finalEntity = { ...payload, ...res.entity };
        }
      } catch (err) {
        console.warn('API sync fallback, saving locally:', err);
      }

      // Persist permanently in localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('crimelens_custom_criminals') || '[]');
        const updatedStored = [finalEntity, ...stored.filter(c => c.id !== finalEntity.id && c.name !== finalEntity.name)];
        localStorage.setItem('crimelens_custom_criminals', JSON.stringify(updatedStored));
        localStorage.setItem('crimelens_selected_chargesheet', finalEntity.id);
      } catch (storageErr) {
        console.warn('LocalStorage error:', storageErr);
      }

      // Broadcast event globally to any open pages or tabs
      window.dispatchEvent(new CustomEvent('crimelens:criminal-added', { detail: finalEntity }));

      if (onCriminalAdded) onCriminalAdded(finalEntity);
      if (onSuccess) onSuccess(finalEntity);

      onClose();
    } catch (err) {
      console.error('Error adding criminal:', err);
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: '1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <div style={{
        backgroundColor: '#0c111a',
        border: '1.5px solid #00E5FF',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '88vh',
        overflowY: 'auto',
        boxShadow: '0 0 60px rgba(0, 229, 255, 0.35)',
        padding: '2rem',
        boxSizing: 'border-box',
        color: '#FFFFFF',
        fontFamily: 'var(--font-sans, sans-serif)',
        margin: 'auto',
        position: 'relative'
      }}>
        {/* Modal Header with Indian Police Badge styling */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(0, 229, 255, 0.25)',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 229, 255, 0.15)',
              border: '1px solid #00E5FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px'
            }}>
              🚨
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, letterSpacing: '0.5px' }}>
                INDIAN POLICE CRIMINAL INTAKE & CCTNS ENTRY
              </h2>
              <p style={{ margin: '3px 0 0 0', fontSize: '11.5px', color: '#00E5FF', fontFamily: 'var(--font-mono, monospace)' }}>
                LAW ENFORCEMENT RECORDING SYSTEM // STATE CRIME BRANCH
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px 10px',
              fontSize: '14px',
              fontWeight: 700
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Row 1: Name and Aliases */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--font-mono, monospace)' }}>
                FULL LEGAL NAME OF SUSPECT / OFFENDER *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. JAGDISH SINGH, MANOJ GUJJAR"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: '#070a10',
                  border: '1px solid rgba(0, 229, 255, 0.35)',
                  borderRadius: '4px',
                  padding: '9px 12px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--font-mono, monospace)' }}>
                ALIASES / GANG MONIKERS
              </label>
              <input
                type="text"
                placeholder="e.g. Jagga Pehalwan, Goli"
                value={formData.aliases}
                onChange={(e) => setFormData({ ...formData, aliases: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: '#070a10',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  padding: '9px 12px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Row 2: Crime Category & Threat Level */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--font-mono, monospace)' }}>
                PRIMARY CRIME CLASSIFICATION *
              </label>
              <select
                value={formData.crimeType}
                onChange={(e) => setFormData({ ...formData, crimeType: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: '#070a10',
                  border: '1px solid rgba(0, 229, 255, 0.35)',
                  borderRadius: '4px',
                  padding: '9px 12px',
                  color: '#00E5FF',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="HOMICIDE & CONTRACT KILLING">🔴 Homicide & Contract Murder (BNS 103 / IPC 302)</option>
                <option value="SEXUAL ASSAULT & SERIAL RAPE">🟣 Sexual Assault & Serial Rape (BNS 64 / IPC 376D)</option>
                <option value="ARMED ROBBERY & BANK HEISTS">🟠 Armed Robbery & Bank Dacoity (BNS 310 / IPC 392)</option>
                <option value="KIDNAPPING & RANSOM EXTORTION">🟡 Kidnapping & Ransom Extortion (BNS 140 / IPC 364A)</option>
                <option value="NARCOTICS & ILLICIT ARMS TRAFFICKING">🟢 Narcotics & NDPS Trafficking (Commercial Quantity)</option>
                <option value="ORGANIZED GANG SYNDICATE & MCOCA">🔵 Organized Crime Gang & MCOCA Racket</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--font-mono, monospace)' }}>
                WARRANT / THREAT LEVEL
              </label>
              <select
                value={formData.threatLevel}
                onChange={(e) => setFormData({ ...formData, threatLevel: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: '#070a10',
                  border: '1px solid rgba(255, 85, 85, 0.4)',
                  borderRadius: '4px',
                  padding: '9px 12px',
                  color: '#FF5555',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="CRITICAL">▲ CRITICAL (Red Corner / STF Search)</option>
                <option value="HIGH">HIGH (Non-Bailable Warrant Issued)</option>
                <option value="MEDIUM">MEDIUM (Active SIT Case / Watchlist)</option>
              </select>
            </div>
          </div>

          {/* Row 3: FIR Number & Police Station */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--font-mono, monospace)' }}>
                FIR NUMBER & LEGAL SECTIONS
              </label>
              <input
                type="text"
                placeholder="e.g. FIR-2024-402 (BNS Sec 103, Arms Act)"
                value={formData.firNumbers}
                onChange={(e) => setFormData({ ...formData, firNumbers: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: '#070a10',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  padding: '9px 12px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--font-mono, monospace)' }}>
                POLICE STATION / JURISDICTION
              </label>
              <input
                type="text"
                placeholder="e.g. PS Sector 14, Crime Branch Gurugram"
                value={formData.policeStation}
                onChange={(e) => setFormData({ ...formData, policeStation: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: '#070a10',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  padding: '9px 12px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Row 4: Weapon Used & Wanted Reward */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--font-mono, monospace)' }}>
                WEAPON USED / FIREARM SIGNATURE
              </label>
              <input
                type="text"
                placeholder="e.g. 9mm Beretta, .32 Katta, Sawed-off 12G"
                value={formData.weaponSignature}
                onChange={(e) => setFormData({ ...formData, weaponSignature: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: '#070a10',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  padding: '9px 12px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--font-mono, monospace)' }}>
                STATE REWARD / BOUNTY
              </label>
              <input
                type="text"
                placeholder="e.g. ₹500,000 INR"
                value={formData.wantedReward}
                onChange={(e) => setFormData({ ...formData, wantedReward: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: '#070a10',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  borderRadius: '4px',
                  padding: '9px 12px',
                  color: '#FBBF24',
                  fontWeight: 700,
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Row 5: Modus Operandi */}
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--font-mono, monospace)' }}>
              MODUS OPERANDI / CRIME PATTERN DESCRIPTION
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Targets jewelry merchants on highway transit; uses fake taxi cabs and KTM getaway bikes."
              value={formData.modusOperandi}
              onChange={(e) => setFormData({ ...formData, modusOperandi: e.target.value })}
              style={{
                width: '100%',
                backgroundColor: '#070a10',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                padding: '9px 12px',
                color: '#FFFFFF',
                fontSize: '12.5px',
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Row 6: Scars & Marks + Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--font-mono, monospace)' }}>
                IDENTIFICATION SCARS / TATTOOS
              </label>
              <input
                type="text"
                placeholder="e.g. Scar on left cheek, Cobra tattoo on forearm"
                value={formData.scarsAndMarks}
                onChange={(e) => setFormData({ ...formData, scarsAndMarks: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: '#070a10',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  padding: '9px 12px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--font-mono, monospace)' }}>
                PHONE / VEHICLE PLATE
              </label>
              <input
                type="text"
                placeholder="e.g. +91-98765-XXXXX / HR-26-XX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: '#070a10',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  padding: '9px 12px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#94a3b8',
                borderRadius: '6px',
                padding: '10px 18px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#00E5FF',
                border: 'none',
                color: '#07090E',
                borderRadius: '6px',
                padding: '10px 22px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'var(--font-mono, monospace)',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)'
              }}
            >
              {loading ? 'REGISTERING IN CCTNS...' : '✓ REGISTER CRIMINAL RECORD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? ReactDOM.createPortal(modalContent, document.body)
    : modalContent;
}
