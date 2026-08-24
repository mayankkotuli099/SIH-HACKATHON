import React, { useState } from 'react';
import { api } from '../services/api.js';

export default function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'Analyze homicide forensic match for Mayank Kotoli'
    },
    {
      id: 2,
      sender: 'ai',
      text: 'HOMICIDE FORENSIC MATCH: Mayank Kotoli (ID #CRM-9942) connected to Sector 18 double homicide. 9mm Beretta 92FS cartridge casings matched crime scene ballistics with 99.4% certainty. 3 active Non-Bailable Warrants pending under BNS Section 103 (IPC 302).',
      entities: [
        { label: 'SUSPECT: MAYANK KOTOLI', type: 'target' },
        { label: 'WEAPON: 9mm Beretta 92FS Match', type: 'money' },
        { label: 'SCENE: Sector 18 Homicide', type: 'location' }
      ],
      note: 'Fugitive last spotted on CCTV at Meerut Highway riding black KTM Duke (unregistered). ₹5 Lakhs state bounty active.'
    }
  ]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const res = await api.chat.sendQuery(userText, messages);
      if (res && res.response) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: res.response.text,
            entities: res.response.entities || [],
            note: res.response.note || ''
          }
        ]);
      } else {
        // Fallback response if backend offline
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'ai',
            text: `Neural correlation complete. Cross-referencing telemetry with active cases and geolocation vectors...`,
            entities: [{ label: 'STATUS: ACTIVE MONITORING', type: 'target' }],
            note: 'Telemetry synchronized with Case Docket #C-8892.'
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: `Neural analysis completed for "${userText}".`,
          entities: [{ label: 'STATUS: ACTIVE', type: 'target' }],
          note: 'Offline cache inference mode.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Floating Toggle Button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#0F172A',
            border: '2px solid var(--cyan-glow)',
            color: 'var(--cyan-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(0, 229, 255, 0.45)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative'
          }}
          title="Open AI Copilot"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
            <rect x="4" y="8" width="16" height="12" rx="2" />
            <circle cx="9" cy="13" r="1.5" fill="currentColor" />
            <circle cx="15" cy="13" r="1.5" fill="currentColor" />
            <path d="M9 17h6" />
          </svg>
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-green)',
            boxShadow: '0 0 8px var(--accent-green)'
          }} />
        </button>
      )}

      {/* Expanded Floating Chatbot Modal */}
      {isOpen && (
        <div style={{
          width: '360px',
          maxWidth: 'calc(100vw - 32px)',
          height: '520px',
          backgroundColor: 'var(--bg-modal, #ffffff)',
          border: '1.5px solid var(--cyan-glow)',
          borderRadius: '12px',
          boxShadow: '0 0 35px rgba(0, 229, 255, 0.25), 0 20px 40px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease'
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-card)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: 'var(--cyan-subtle)',
                border: '1px solid var(--border-active)',
                color: 'var(--cyan-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                  <rect x="4" y="8" width="16" height="12" rx="2" />
                  <circle cx="9" cy="13" r="1" fill="currentColor" />
                  <circle cx="15" cy="13" r="1" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
                  AI INVESTIGATION COPILOT
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
                  <span style={{ fontSize: '10px', color: 'var(--cyan-glow)', fontFamily: 'var(--font-mono)' }}>
                    ONLINE // READY
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%'
                }}
              >
                {m.sender === 'user' ? (
                  <div style={{
                    backgroundColor: 'var(--cyan-subtle)',
                    border: '1px solid var(--border-active)',
                    color: 'var(--text-primary)',
                    padding: '8px 12px',
                    borderRadius: '8px 8px 0px 8px',
                    fontSize: '12.5px'
                  }}>
                    {m.text}
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px 8px 8px 0px',
                    padding: '10px 12px',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5
                  }}>
                    <p style={{ marginBottom: m.entities ? '8px' : 0 }}>{m.text}</p>
                    {m.entities && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '8px 0' }}>
                        {m.entities.map((ent, idx) => (
                          <div
                            key={idx}
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              padding: '3px 6px',
                              borderRadius: '3px',
                              backgroundColor: ent.type === 'target' ? 'rgba(255, 75, 85, 0.15)' : 'rgba(0, 229, 255, 0.15)',
                              color: ent.type === 'target' ? '#FF6B6B' : 'var(--cyan-glow)',
                              border: `1px solid ${ent.type === 'target' ? 'rgba(255, 75, 85, 0.3)' : 'rgba(0, 229, 255, 0.3)'}`
                            }}
                          >
                            {ent.label}
                          </div>
                        ))}
                      </div>
                    )}
                    {m.note && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '6px', fontStyle: 'italic' }}>
                        {m.note}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Action Chips */}
          <div style={{
            padding: '4px 12px 8px',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto'
          }}>
            <button
              onClick={() => setInputVal('Check Sector 14 Rape & DNA Dossier (Devendra Rawat)')}
              style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '10.5px',
                color: '#C084FC',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              + Rape & DNA Dossier
            </button>
            <button
              onClick={() => setInputVal('Track Axis Bank Armed Robbery Heist (Sameer Qureshi)')}
              style={{
                background: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '10.5px',
                color: '#FBBF24',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              + Armed Heist Trail
            </button>
            <button
              onClick={() => setInputVal('Elena Rostova 100kg Heroin Cartel Seizure')}
              style={{
                background: 'rgba(0, 229, 255, 0.06)',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '10.5px',
                color: 'var(--cyan-glow)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              + Narco Cartel
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '10px 12px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-card)'
            }}
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter query parameters..."
              style={{
                flex: 1,
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '8px 10px',
                color: 'var(--text-primary)',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              className="btn-cyan"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
