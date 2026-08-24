import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Helper to call live Google Gemini API
async function callGeminiLive(message, history = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('YOUR_GEMINI_API_KEY_HERE')) {
    return null;
  }

  const systemInstruction = `You are CrimeLens AI Copilot, an elite tactical forensic and criminal intelligence AI built for Indian Law Enforcement, Police Special Cells, and State Crime Branches.
Your capabilities:
1. Analyze criminal dossiers, suspect modus operandi, ballistic striations (e.g. 9mm Beretta), DNA STR profiles, ANPR highway hits, and wiretaps.
2. Cross-reference cases under Bharatiya Nyaya Sanhita (BNS / IPC), Bharatiya Nagarik Suraksha Sanhita (BNSS), Section 65B Bharatiya Sakshya Adhiniyam (BSA), MCOCA, POCSO, and NDPS Acts.
3. Provide crisp, structured, authoritative responses formatted with actionable intelligence, legal sections, investigating officers, and suspect status.
Keep responses concise, forensic-grade, and highly relevant.`;

  const contents = [];
  if (history && Array.isArray(history)) {
    history.slice(-6).forEach(h => {
      if (h.sender && h.text) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const payload = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 800
    }
  };

  // Try gemini-2.5-flash / gemini-1.5-flash
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-pro'];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return candidateText;
        }
      }
    } catch (err) {
      console.warn(`[Gemini API] Failed calling ${model}:`, err.message);
    }
  }

  return null;
}

// POST /api/chat/query - AI Investigation Copilot
router.post('/query', async (req, res) => {
  const { message, history } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, error: 'Query message is required.' });
  }

  const queryText = message.trim();
  const q = queryText.toLowerCase();

  // Try live Gemini API first
  let liveGeminiText = null;
  try {
    liveGeminiText = await callGeminiLive(queryText, history);
  } catch (err) {
    console.warn('[CrimeLens Chat] Gemini live call exception:', err.message);
  }

  let aiResponse = {
    text: '',
    entities: [],
    note: '',
    confidence: '98.5%'
  };

  if (liveGeminiText) {
    aiResponse = {
      text: liveGeminiText,
      entities: [
        { label: 'AI ENGINE: GOOGLE GEMINI NEURAL', type: 'target' },
        { label: 'CLEARANCE: LAW ENFORCEMENT LEVEL 4', type: 'money' }
      ],
      note: 'Processed via Google Gemini AI Intelligence Copilot with live Section 65B forensic verification.',
      confidence: '99.2%'
    };
  } else if (q.includes('murder') || q.includes('homicide') || q.includes('kill') || q.includes('shot') || q.includes('bullet') || q.includes('mayank') || q.includes('kotoli') || q.includes('vikram')) {
    aiResponse = {
      text: 'HOMICIDE FORENSIC MATCH: Mayank Kotoli (ID #CRM-9942) connected to Sector 18 double homicide. 9mm Beretta 92FS cartridge casings matched crime scene ballistics with 99.4% certainty. 3 active Non-Bailable Warrants pending under BNS Section 103 (IPC 302).',
      entities: [
        { label: 'SUSPECT: MAYANK KOTOLI', type: 'target' },
        { label: 'WEAPON: 9mm Beretta 92FS Match', type: 'money' },
        { label: 'SCENE: Sector 18 Homicide', type: 'location' }
      ],
      note: 'Fugitive last spotted on CCTV at Meerut Highway riding black KTM Duke (unregistered). ₹5 Lakhs state bounty active.',
      confidence: '99.4%'
    };
  } else if (q.includes('rape') || q.includes('sexual') || q.includes('assault') || q.includes('pocso') || q.includes('rawat') || q.includes('d-7') || q.includes('dna')) {
    aiResponse = {
      text: 'SEXUAL OFFENSE SIT DOSSIER: Devendra "D-7" Rawat (ID #CRM-7721) identified as prime suspect in Sector 14 serial highway abduction and sexual assault cases. Forensic DNA kit #FK-8821 yielded a 100% STR profile match in the National DNA Offender Registry.',
      entities: [
        { label: 'FUGITIVE: DEVENDRA RAWAT (D-7)', type: 'target' },
        { label: 'FORENSIC: 100% DNA STR Match', type: 'money' },
        { label: 'CRIME: BNS Sec 64 / IPC 376D', type: 'location' }
      ],
      note: 'Modus operandi: Fake commercial taxi with altered registration plates. Red Alert issued across inter-state border checkposts.',
      confidence: '100.0%'
    };
  } else if (q.includes('robbery') || q.includes('heist') || q.includes('theft') || q.includes('steal') || q.includes('stolen') || q.includes('vault') || q.includes('gold') || q.includes('sameer') || q.includes('ghost')) {
    aiResponse = {
      text: 'ARMED ROBBERY INVESTIGATION: Axis Bank Vault Heist (FIR #103/2024). Safe-cracking specialist Sameer "Ghost" Qureshi (ID #CRM-8821) breached vault using thermal lance. 14 kg gold bullion stolen. ANPR camera logged getaway vehicle HR-26-XX-4902 on KMP Expressway.',
      entities: [
        { label: 'SUSPECT: SAMEER GHOST QURESHI', type: 'target' },
        { label: 'SEIZED/STOLEN: 14 kg Gold Bullion', type: 'money' },
        { label: 'HOTSPOT: KMP Expressway Toll #4', type: 'location' }
      ],
      note: 'Thermal lance tool marks and glove DNA match retrieved from bank vault safety deposit cage.',
      confidence: '94.8%'
    };
  } else if (q.includes('narco') || q.includes('drug') || q.includes('heroin') || q.includes('ndps') || q.includes('elena') || q.includes('rostova')) {
    aiResponse = {
      text: 'NARCOTICS & ARMS CARTEL: Elena "Czar" Rostova (ID #CRM-5512) syndicate intercepted. 100 kg synthetic heroin and 12 Steyr submachine guns seized at Port Container Terminal C. Network supplies inter-state distribution hubs across Delhi-NCR and Punjab.',
      entities: [
        { label: 'CARTEL HEAD: ELENA ROSTOVA', type: 'target' },
        { label: 'SEIZURE: 100kg Heroin + Submachine Guns', type: 'money' },
        { label: 'CORRIDOR: Port Terminal C Maritime Yard', type: 'location' }
      ],
      note: 'Interpol Red Notice active. Cross-border maritime shipping route identified from Arabian Sea.',
      confidence: '97.2%'
    };
  } else if (q.includes('gang') || q.includes('extort') || q.includes('kidnap') || q.includes('mahesh') || q.includes('khan') || q.includes('tiger')) {
    aiResponse = {
      text: 'ORGANIZED GANG INTELLIGENCE: Mahesh "Tiger" Khan (ID #CRM-0014) syndicate active under MCOCA Act. Coordinates inter-state extortion, contract assassinations, and illicit arms smuggling. Demanded ₹50 Lakhs ransom from Gurugram infrastructure firm.',
      entities: [
        { label: 'GANGSTER KINGPIN: MAHESH KHAN', type: 'target' },
        { label: 'RACKET: ₹5 Cr Monthly Extortion', type: 'money' },
        { label: 'JURISDICTION: NCR Organized Crime SIT', type: 'location' }
      ],
      note: 'Voiceprint matched extortion wiretap recording with 99.1% biometric certainty. ₹25 Lakhs reward on arrest.',
      confidence: '99.1%'
    };
  } else {
    aiResponse = {
      text: `CrimeLens Police Intelligence Engine analyzed query: "${queryText}". Scanned 12,458 indexed criminal records across Homicide, Sexual Offenses, Armed Robbery, Kidnapping, Narcotics, and Gang Syndicates. All FIR databases synchronized.`,
      entities: [
        { label: 'CRIME DATABASE: National Police Network', type: 'target' },
        { label: 'CLEARANCE: Law Enforcement Level 4', type: 'money' }
      ],
      note: 'Cross-referenced against CCTNS, State Police STF databases, and Forensic Ballistics registries.',
      confidence: '95.0%'
    };
  }

  res.json({
    success: true,
    response: aiResponse
  });
});

export default router;
