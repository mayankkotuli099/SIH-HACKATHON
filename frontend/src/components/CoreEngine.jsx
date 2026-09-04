import React from 'react';

export default function CoreEngine() {
  const features = [
    {
      id: 'nlp',
      title: 'Natural Language Processing',
      description: 'Extract unstructured data from field reports, communications, and open-source intelligence with high precision.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 8 6 6" />
          <path d="m4 14 6-6 2-3" />
          <path d="M2 5h12" />
          <path d="M7 2h1" />
          <path d="m22 22-5-10-5 10" />
          <path d="M14 18h6" />
        </svg>
      ),
      iconColor: '#1e40af',
      iconBg: '#eff6ff',
      borderAccent: '#bfdbfe'
    },
    {
      id: 'ml',
      title: 'Machine Learning',
      description: 'Predictive models identify behavioral anomalies and flag high-risk actors before networks expand.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.25.5 2.38 1.32 3.2L7 11.5A5.5 5.5 0 0 0 2 17v2h20v-2a5.5 5.5 0 0 0-5-5.5l-1.82-1.8c.82-.82 1.32-1.95 1.32-3.2A4.5 4.5 0 0 0 12 2z" />
          <circle cx="12" cy="6.5" r="1.5" fill="currentColor" />
        </svg>
      ),
      iconColor: '#16a34a',
      iconBg: '#f0fdf4',
      borderAccent: '#bbf7d0'
    },
    {
      id: 'graph',
      title: 'Graph Analytics',
      description: 'Visualize complex multi-layered relationships between entities, resolving degrees of separation instantly.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <circle cx="18" cy="6" r="3" />
          <path d="M8.6 7.4l6.8 3.2" />
          <path d="M8.6 6h6.8" />
          <path d="M18 9v6" />
        </svg>
      ),
      iconColor: '#2563eb',
      iconBg: '#eff6ff',
      borderAccent: '#bfdbfe'
    },
    {
      id: 'entity',
      title: 'Entity Resolution',
      description: 'Merge disparate data points to create unified, highly accurate profiles of targets, vehicles, and locations.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11v.5" />
        </svg>
      ),
      iconColor: '#7c3aed',
      iconBg: '#f5f3ff',
      borderAccent: '#ddd6fe'
    }
  ];

  return (
    <section id="explore" style={{
      padding: '4rem 1.5rem 6rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Section Title */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
          letterSpacing: '-0.01em'
        }}>
          Core Intelligence Engine
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '15px',
          fontWeight: 400
        }}>
          Advanced algorithms powering deep entity resolution.
        </p>
      </div>

      {/* Grid of 4 Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem'
      }}>
        {features.map((item) => (
          <div
            key={item.id}
            className="glass-card"
            style={{
              padding: '2rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              position: 'relative'
            }}
          >
            {/* Top Icon Badge */}
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '6px',
              backgroundColor: item.iconBg,
              border: `1px solid ${item.borderAccent}`,
              color: item.iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {item.icon}
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: '17px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '0.85rem',
              letterSpacing: '-0.01em'
            }}>
              {item.title}
            </h3>

            {/* Description */}
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '13.5px',
              lineHeight: 1.6,
              fontWeight: 400
            }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
