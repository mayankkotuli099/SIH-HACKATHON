import React, { useState } from 'react';

export default function OperationalWorkflow() {
  const [activeStep, setActiveStep] = useState(3); // default highlighted step 4

  const steps = [
    {
      id: 0,
      number: '01. COLLECT',
      description: 'Ingest vast amounts of structured and unstructured data streams.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      )
    },
    {
      id: 1,
      number: '02. EXTRACT',
      description: 'NLP and AI parse texts, identifying key entities and attributes.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      )
    },
    {
      id: 2,
      number: '03. CONNECT',
      description: 'Graph algorithms link entities based on spatial and temporal relationships.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M10 6.5h4" />
          <path d="M17.5 10v4" />
          <path d="M10 17.5h4" />
          <path d="M6.5 10v4" />
        </svg>
      )
    },
    {
      id: 3,
      number: '04. ANALYZE',
      description: 'Expose hidden hierarchies, clusters, and predictive threats.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      )
    }
  ];

  return (
    <section id="workflow" style={{
      padding: '4rem 1.5rem 7rem',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative'
    }}>
      {/* Section Title */}
      <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
          letterSpacing: '-0.01em'
        }}>
          Operational Workflow
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '15px',
          fontWeight: 400
        }}>
          The critical path from raw data to actionable intelligence.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '2rem',
        position: 'relative'
      }}>
        {steps.map((step) => {
          const isSelected = activeStep === step.id;
          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Icon Container with glowing active states */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '8px',
                backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                border: isSelected ? '1.5px solid #1e40af' : '1px solid #e2e8f0',
                color: isSelected ? '#1e40af' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                boxShadow: isSelected ? '0 4px 6px -1px rgba(30, 64, 175, 0.1)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}>
                {step.icon}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-12px',
                    width: '32px',
                    height: '2px',
                    backgroundColor: '#1e40af'
                  }} />
                )}
              </div>

              {/* Step Number Tag */}
              <h4 style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                color: isSelected ? '#1e40af' : 'var(--text-primary)',
                marginBottom: '0.65rem'
              }}>
                {step.number}
              </h4>

              {/* Step Description */}
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
                maxWidth: '220px'
              }}>
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
