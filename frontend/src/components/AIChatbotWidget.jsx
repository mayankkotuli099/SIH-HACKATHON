import React, { useState } from 'react';

export default function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'Trace financial flow for Shell Corp B'
    },
    {
      id: 2,
      sender: 'ai',
      text: 'Analyzing network connections for entity: identified 12 direct connections matching known criminal syndicate associates.',
      entities: [
        { label: 'TARGET: RAHUL SHARMA', type: 'target' },
        { label: 'SUSPICIOUS TRANSFER: $450,000 via Shell Corp B', type: 'money' }
      ],
      note: 'Registered director of "Apex Global Logistics", a suspected front company.'
    }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputVal
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');

    setTimeout(() => {
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
    }, 800);
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
          backgroundColor: 'rgba(11, 15, 23, 0.95)',
          border: '1.5px solid var(--cyan-glow)',
          borderRadius: '12px',
          boxShadow: '0 0 35px rgba(0, 229, 255, 0.25), 0 20px 40px rgba(0,0,0,0.8)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease'
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid rgba(0, 229, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(16, 24, 38, 0.8)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
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
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.5px' }}>
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
                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    color: '#FFFFFF',
                    padding: '8px 12px',
                    borderRadius: '8px 8px 0px 8px',
                    fontSize: '12.5px'
                  }}>
                    {m.text}
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: 'rgba(18, 24, 38, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px 8px 8px 0px',
                    padding: '10px 12px',
                    fontSize: '12px',
                    color: '#E2E8F0',
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
              onClick={() => setInputVal('Expand Node Graph')}
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
              + Expand Node Graph
            </button>
            <button
              onClick={() => setInputVal('Export Case Note')}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '10.5px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Export Case Note
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '10px 12px',
              borderTop: '1px solid rgba(0, 229, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(13, 17, 26, 0.95)'
            }}
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter query parameters..."
              style={{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                padding: '8px 10px',
                color: '#FFFFFF',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                backgroundColor: 'var(--cyan-glow)',
                border: 'none',
                color: '#000000',
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
