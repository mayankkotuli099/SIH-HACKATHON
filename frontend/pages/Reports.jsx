import { useState } from 'react'
import { FileText, Lock, Upload, Volume2, CheckCircle2, Copy, Download, Printer, ShieldCheck, X } from 'lucide-react'
import TopNav from '../components/TopNav.jsx'
import './Reports.css'

const EVIDENCE = [
  {
    id: 'ev-1',
    time: '11:35:07',
    hash: '12356358a49b77b256b85922b78867537d',
    status: 'VERIFIED'
  },
  {
    id: 'ev-2',
    time: '11:35:16',
    hash: '12356358a49b77b255b85322b78867536d',
    status: 'VERIFIED'
  },
  {
    id: 'ev-3',
    time: '11:35:51',
    hash: '12356358a49b77b245b85322b78825523d',
    status: 'VERIFIED'
  },
]

/* Transcript rendered as segments so flagged phrases can be highlighted. */
const TRANSCRIPT = [
  { text: '"Confirmed the window. Do not put ' },
  { text: 'criminal intent', flag: true },
  { text: ' on this line again. Move to the fallback channel, ' },
  { text: 'secure funds', flag: true },
  { text: ' before the audit lands, and keep the store ledger clean until I say otherwise..."' },
]

const EXPORTS = [
  { id: 'court', label: 'Court Admissible Evidence' },
  { id: 'intercept', label: 'Intercept Logs' },
  { id: 'topology', label: 'Graph Topology PDF' },
]

function Card({ icon, title, children }) {
  return (
    <section className="panel card">
      <h2 className="card-head">
        {icon}
        {title}
      </h2>
      <div className="card-body">{children}</div>
    </section>
  )
}

/* Left box -> hub -> three downstream accounts. */
function NexusGraph() {
  const targets = [23, 71, 119]
  return (
    <svg
      className="nexus"
      viewBox="0 0 380 142"
      role="img"
      aria-label="Financial nexus: one origin account routing through a hub into three downstream accounts"
    >
      <line x1="74" y1="71" x2="158" y2="71" className="nexus-edge" />
      {targets.map((y) => (
        <line key={y} x1="226" y1="71" x2="300" y2={y} className="nexus-edge" />
      ))}

      <rect x="6" y="60" width="68" height="22" rx="3" className="nexus-node" />
      <rect
        x="158"
        y="60"
        width="68"
        height="22"
        rx="3"
        className="nexus-node hub"
      />
      {targets.map((y) => (
        <rect
          key={y}
          x="300"
          y={y - 11}
          width="68"
          height="22"
          rx="3"
          className="nexus-node target"
        />
      ))}
    </svg>
  )
}

function Reports() {
  const [enabled, setEnabled] = useState({
    court: true,
    intercept: true,
    topology: false,
  })
  const [dossierModal, setDossierModal] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const toggle = (id) => {
    setEnabled((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      showToast(`${EXPORTS.find(e => e.id === id)?.label} export ${next[id] ? 'enabled' : 'disabled'}`)
      return next
    })
  }

  const handleGenerateDossier = () => {
    setIsGenerating(true)
    showToast('Compiling judicial cryptographic hashes and case evidence...')
    setTimeout(() => {
      setIsGenerating(false)
      setDossierModal(true)
      showToast('✓ Subpoena Dossier Bundle compiled and cryptographically verified.')
    }, 600)
  }

  const handleCopyHash = () => {
    const hash = 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    navigator.clipboard?.writeText(hash)
    showToast('✓ Cryptographic SHA-256 seal copied to clipboard.')
  }

  const handleDownload = () => {
    showToast('✓ Subpoena_Dossier_Package_CL-8921.enc downloaded.')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="reports">
      <TopNav />

      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          backgroundColor: 'rgba(0, 229, 255, 0.95)',
          color: '#07090E',
          padding: '12px 20px',
          borderRadius: '6px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '13px',
          boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="reports-main">
        <header className="reports-head">
          <h1 className="reports-title">Intelligence Reports &amp; Evidence Vault</h1>
          <p className="reports-sub">
            Cryptographically verified evidence compilation and judicial-grade
            case briefs
          </p>
        </header>

        <div className="reports-grid">
          {/* ---- chain of custody ---- */}
          <Card
            icon={<FileText size={17} strokeWidth={2} />}
            title="Evidence Chain of Custody"
          >
            {EVIDENCE.map(({ id, time, hash }) => (
              <article key={id} className="evidence">
                <div className="evidence-head">
                  <h3>Sealed Digital Evidence Log</h3>
                  <Lock size={14} strokeWidth={2} className="evidence-lock" />
                </div>
                <p className="label evidence-meta">SHA-256 Hash {time}</p>
                <p className="evidence-hash">SHA-256:{hash}</p>
                <p className="label evidence-sig">
                  Digital Signature: <em>Verified</em>
                </p>
              </article>
            ))}
          </Card>

          {/* ---- AI brief ---- */}
          <Card
            icon={<FileText size={17} strokeWidth={2} />}
            title="AI Executive Brief Generator"
          >
            <ol className="brief">
              <li className="brief-item">
                <div className="brief-row">
                  <h3>Synthesized Incident Timeline</h3>
                  <time className="brief-time">2024-10-27 16:45:30 UTC</time>
                </div>
                <div className="brief-pair">
                  <div>
                    <p className="label">Source</p>
                    <p className="brief-value">+1 (555) 019-8372</p>
                  </div>
                  <div>
                    <p className="label">Target</p>
                    <p className="brief-value">+44 7708 980077</p>
                  </div>
                </div>
                <p className="label">Analysis</p>
                <p className="brief-text">
                  Encrypted signal detected. Duration: 04m 12s. High probability
                  of operational coordination based on historical patterns.
                </p>
              </li>

              <li className="brief-item alt">
                <div className="brief-row">
                  <h3>Financial Nexus Breakdown</h3>
                </div>
                <NexusGraph />
              </li>
            </ol>

            <div className="transcript">
              <div className="transcript-head">
                <p className="label">Audio Intercept Transcription</p>
                <Volume2 size={15} strokeWidth={2} />
              </div>
              <p className="transcript-body">
                {TRANSCRIPT.map((seg, i) =>
                  seg.flag ? (
                    <mark key={i}>{seg.text}</mark>
                  ) : (
                    <span key={i}>{seg.text}</span>
                  ),
                )}
              </p>
            </div>
          </Card>

          {/* ---- export ---- */}
          <Card
            icon={<Upload size={17} strokeWidth={2} />}
            title="Export Compliance &amp; Dossier Bundle"
          >
            <div className="exports">
              {EXPORTS.map(({ id, label }) => (
                <div key={id} className="export-row">
                  <span className="export-label">{label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled[id]}
                    aria-label={label}
                    className={`switch ${enabled[id] ? 'on' : ''}`}
                    onClick={() => toggle(id)}
                  >
                    <span className="switch-knob" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="dossier"
              disabled={isGenerating}
              onClick={handleGenerateDossier}
              style={{ cursor: isGenerating ? 'wait' : 'pointer' }}
            >
              {isGenerating ? 'Compiling Dossier...' : 'Generate Subpoena Dossier'}
            </button>
          </Card>
        </div>
      </main>

      {/* Subpoena Dossier Modal */}
      {dossierModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1.5rem'
        }}>
          <div className="panel" style={{
            maxWidth: '650px',
            width: '100%',
            backgroundColor: '#0c111a',
            border: '1px solid var(--cyan, #00e5ff)',
            borderRadius: '8px',
            padding: '2rem',
            boxShadow: '0 0 50px rgba(0, 229, 255, 0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0, 229, 255, 0.2)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={26} color="#00e5ff" />
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    JUDICIAL SUBPOENA EVIDENCE DOSSIER
                  </h2>
                  <span style={{ fontSize: '11px', color: '#00e5ff', fontFamily: 'monospace' }}>
                    CASE REF: CL-2024-8921 // SEAL #CL-9942
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDossierModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '13px', color: '#94a3b8' }}>
              <div style={{ backgroundColor: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)', padding: '12px 16px', borderRadius: '6px' }}>
                <strong style={{ color: '#ffffff', display: 'block', marginBottom: '4px' }}>
                  Cryptographic Chain-of-Custody Certificate
                </strong>
                <p style={{ margin: 0, fontSize: '12px', fontFamily: 'monospace', color: '#00e5ff', wordBreak: 'break-all' }}>
                  ROOT_SEAL: SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Target Suspects:</span>
                  <p style={{ margin: '4px 0 0 0', fontWeight: 700, color: '#ffffff' }}>Vikram Malhotra &amp; Gang Cartel</p>
                </div>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Prosecution Jurisdiction:</span>
                  <p style={{ margin: '4px 0 0 0', fontWeight: 700, color: '#ffffff' }}>Special Task Force &amp; Sessions Court</p>
                </div>
              </div>

              <div>
                <strong style={{ color: '#ffffff', display: 'block', marginBottom: '6px' }}>Included Multi-Domain Forensic Evidence:</strong>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>✓ CFSL Ballistics Report: 9mm Beretta 92FS chamber markings match Sector 18 Homicide</li>
                  <li>✓ National DNA Registry Hit: 100% STR profile match (FK-8821 Sexual Assault Case)</li>
                  <li>✓ ANPR Highway Camera Timestamp: Bolero Getaway vehicle (Axis Bank Gold Heist)</li>
                  <li>✓ Seizure Memo: 100kg Synthetic Heroin &amp; Steyr SMG Crates (Port Terminal C)</li>
                  <li>✓ Wiretap Audio Intercept: Extortion threat call recording (MCOCA Gang Boss)</li>
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="btn-outline-cyan"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '12px' }}
                >
                  <Copy size={14} /> COPY SEAL
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="btn-outline-cyan"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '12px' }}
                  >
                    <Printer size={14} /> PRINT
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="btn-cyan"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '12px' }}
                  >
                    <Download size={14} /> DOWNLOAD BUNDLE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports
