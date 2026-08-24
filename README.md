# 🛡️ CrimeLens — Intelligence Beyond Connections

![CrimeLens Banner](https://img.shields.io/badge/Security_Clearance-LEVEL_4_OPERATOR-00E5FF?style=for-the-badge&logo=shield&logoColor=black)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active_Telemetry_Live-00E676?style=for-the-badge)

**CrimeLens** is a next-generation cybernetic crime investigation and intelligence analytics platform designed for law enforcement, intelligence operatives, and digital forensics teams. It bridges fragmented data—combining communications wiretaps, financial transactions, geospatial vectors, and dark web signals—into unified, real-time threat intelligence and suspect dossiers.

---

## 🌟 Key Features

### 📊 Tactical Live Dashboard
- **Real-time Telemetry & KPIs**: Active monitoring of total entities, relationships, threat levels, and active cases.
- **Risk Distribution Matrix**: Visual risk categorization (Low, Medium, High, Critical) to prioritize investigative workflows.
- **Live Activity Feed**: UTC timestamped stream of suspect events, transactions, and anomaly detections with direct drill-down links.

### 🕸️ Interactive Network Nexus Graph
- **Node & Cluster Visualization**: Visual mapping of suspect nodes, shell organizations, burner phones, and cross-border bank accounts.
- **Interactive Relationship Tracing**: Filter and inspect multi-hop associations, financial flows, and command hierarchies.

### ⏱️ Chronological Event Timeline
- **Multi-Source Event Trace**: Integrated timeline of intercepted messages, financial transfers, and physical check-ins.
- **Threat Anomaly Highlighting**: Color-coded severity indicators alerting investigators to sudden spikes in syndicate communication.

### 🛡️ Entity 360 Dossier
- **Biometric & Profile Intel**: Complete dossier compilation unifying suspect aliases, associated entities, and criminal histories.
- **Automated Entity Resolution**: AI-driven merging of burner phones, shell accounts, and proxy identities into a singular identity graph.

### 📁 Active Case Management
- **Case Evidence Vault**: Centralized case tracking, priority sorting, assigned officer clearance, and status management.
- **Cryptographic Evidence Sealing**: Adherence to chain of custody standards with digital signature verification.

### 🤖 Neural Investigation Copilot (AI Chatbot)
- **Natural Language Querying**: Query complex intelligence databases in plain language (e.g., *"Trace financial flow for Shell Corp B"*).
- **Automated Summary & Insight Extraction**: Instant breakdown of suspect connections, suspicious transactions, and flagged aliases.

### 📄 Intelligence Reports & Export
- **Court-Ready Dossier Export**: Generate structured, exportable intelligence briefs and evidence summaries.
- **Operator Access Control**: Level 4 security clearance management, terminal session locking, and authenticated login flows.

---

## 🛠️ Technology Stack

- **Frontend Core**: [React 19](https://react.dev/), [Vite 8](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons & Visuals**: [Lucide React](https://lucide.dev/), Leaflet, SVG Visualizations
- **Styling**: Cybernetic Tactical Glassmorphism (Pure CSS with custom design tokens)
- **Linting & Code Quality**: [Oxlint](https://oxc.rs/)

---

## 📂 Directory Structure

```text
SIH-HACKATHON/
├── frontend/
│   ├── components/        # TopNav, Logo, and shared UI elements
│   ├── pages/             # Authenticated views (Login, Reports)
│   ├── src/               # Core Application Module
│   │   ├── components/    # Tactical Components (Navbar, Sidebar, AIChatbotWidget, Hero, etc.)
│   │   ├── pages/         # Investigation Views (Dashboard, Network, Timeline, Entity, Cases, Profile, Settings)
│   │   ├── App.jsx        # Internal state & layout router
│   │   ├── index.css      # Cyber design tokens and glassmorphism styling
│   │   └── main.jsx       # Sub-module entrypoint
│   ├── App.jsx            # Top-level route configuration
│   ├── index.css          # Scoped application styles
│   └── main.jsx           # Application bootstrap
├── index.html             # HTML5 Entry point
├── package.json           # Project manifest and dependencies
└── vite.config.js         # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mayankkotuli099/SIH-HACKATHON.git
   cd SIH-HACKATHON
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to launch the CrimeLens tactical terminal.

### Production Build

To compile a production bundle:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 🔒 Security & Inference Modes

CrimeLens supports selectable neural inference environments under **Settings**:
- **CrimeLens-Titan v4.2**: Multimodal entity graph with audio forensics and voiceprint analysis.
- **CrimeLens-Sentinel Ultra**: Real-time financial nexus analysis and SIGINT stream processing.
- **CrimeLens-AirGap Local**: Fully on-premise, encrypted offline inference for classified operations.

---

## 📄 License & Attribution

&copy; 2024–2026 **CrimeLens** — *Intelligence Beyond Connections*. Built for the Smart India Hackathon (SIH).
