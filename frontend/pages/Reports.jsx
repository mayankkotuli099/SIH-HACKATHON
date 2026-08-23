import { useState } from 'react'
import { FileText, Lock, Upload, Volume2 } from 'lucide-react'
import TopNav from '../components/TopNav.jsx'
import './Reports.css'

const EVIDENCE = [
  {
    id: 'ev-1',
    time: '11:35:07',
    hash: '12356358a49b77b256b85922b78867537d',
  },
  {
    id: 'ev-2',
    time: '11:35:16',
    hash: '12356358a49b77b255b85322b78867536d',
  },
  {
    id: 'ev-3',
    time: '11:35:51',
    hash: '12356358a49b77b245b85322b78825523d',
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
    court: false,
    intercept: false,
    topology: false,
  })

  const toggle = (id) =>
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="reports">
      <TopNav />

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
                  <time className="brief-time">2023-10-27 16:45:30 UTC</time>
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

            <button type="button" className="dossier">
              Generate Subpoena Dossier
            </button>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Reports
