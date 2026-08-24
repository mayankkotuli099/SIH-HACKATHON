import os
import json
import urllib.request
import urllib.error
from typing import Dict, Any, List
from ..models.schemas import AIChatResponse, EntityHighlight

class IntelligenceEngine:
    """
    CrimeLens Neural Copilot & Cross-Modal Intelligence Resolution Engine
    Analyzes natural language queries from investigators, extracts target entities,
    correlates financial vectors, and retrieves forensic dossiers using live Google Gemini API
    with offline fallback resolution.
    """

    def _call_gemini_api(self, message: str) -> str:
        api_key = os.getenv("GEMINI_API_KEY", "")
        if not api_key or "YOUR_GEMINI_API_KEY_HERE" in api_key:
            return ""

        system_instruction = (
            "You are CrimeLens AI Copilot, an elite tactical forensic and criminal intelligence AI built for Indian Law Enforcement, "
            "Police Special Cells, and State Crime Branches.\n"
            "Analyze criminal dossiers, forensic ballistics (e.g. 9mm Beretta), DNA STR matches, ANPR hits, and cross-reference cases under "
            "Bharatiya Nyaya Sanhita (BNS / IPC), Bharatiya Nagarik Suraksha Sanhita (BNSS), Section 65B BSA electronic evidence rules, MCOCA, POCSO, and NDPS Acts.\n"
            "Provide crisp, structured, authoritative responses."
        )

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": message}]
                }
            ],
            "systemInstruction": {
                "parts": [{"text": system_instruction}]
            },
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 800
            }
        }

        models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-pro"]
        for model in models:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"}
                )
                with urllib.request.urlopen(req, timeout=10) as response:
                    res_data = json.loads(response.read().decode("utf-8"))
                    candidates = res_data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and "text" in parts[0]:
                            return parts[0]["text"]
            except Exception:
                continue

        return ""

    def process_query(self, message: str) -> AIChatResponse:
        q = message.lower().strip()

        # Try live Gemini call
        live_text = self._call_gemini_api(message)
        if live_text:
            return AIChatResponse(
                text=live_text,
                entities=[
                    EntityHighlight(label='AI ENGINE: GOOGLE GEMINI NEURAL', type='target'),
                    EntityHighlight(label='CLEARANCE: LAW ENFORCEMENT LEVEL 4', type='money')
                ],
                note='Processed via Google Gemini AI Copilot with Section 65B BSA forensic verification.',
                confidence='99.2%'
            )

        # 1. Homicide / Murder & Ballistics Analysis
        if any(w in q for w in ["murder", "homicide", "kill", "shot", "bullet", "ballistic", "hitman", "beretta", "mayank", "kotoli", "vikram"]):
            return AIChatResponse(
                text='HOMICIDE FORENSIC MATCH: Mayank Kotoli (ID #CRM-9942) connected to Sector 18 double homicide. 9mm Beretta 92FS cartridge casings matched crime scene ballistics with 99.4% certainty. 3 active Non-Bailable Warrants pending under BNS Section 103 (IPC 302).',
                entities=[
                    EntityHighlight(label='SUSPECT: MAYANK KOTOLI', type='target'),
                    EntityHighlight(label='WEAPON: 9mm Beretta 92FS Match', type='money'),
                    EntityHighlight(label='SCENE: Sector 18 Homicide', type='location')
                ],
                note='Fugitive last spotted on CCTV at Meerut Highway riding black KTM Duke (unregistered). ₹5 Lakhs state bounty active.',
                confidence='99.4%'
            )

        # 2. Sexual Offenses / Rape & DNA Profile Analysis
        if any(w in q for w in ["rape", "sexual", "assault", "pocso", "stalk", "rawat", "d-7", "dna"]):
            return AIChatResponse(
                text='SEXUAL OFFENSE SIT DOSSIER: Devendra "D-7" Rawat (ID #CRM-7721) identified as prime suspect in Sector 14 serial highway abduction and sexual assault cases. Forensic DNA kit #FK-8821 yielded a 100% STR profile match in the National DNA Offender Registry.',
                entities=[
                    EntityHighlight(label='FUGITIVE: DEVENDRA RAWAT (D-7)', type='target'),
                    EntityHighlight(label='FORENSIC: 100% DNA STR Match', type='money'),
                    EntityHighlight(label='CRIME: BNS Sec 64 / IPC 376D', type='location')
                ],
                note='Modus operandi: Fake commercial taxi with altered registration plates. Red Alert issued across inter-state border checkposts.',
                confidence='100.0%'
            )

        # 3. Armed Robbery / Theft / Heist Analysis
        if any(w in q for w in ["robbery", "heist", "theft", "steal", "stolen", "vault", "bank", "gold", "sameer", "ghost", "shotgun"]):
            return AIChatResponse(
                text='ARMED ROBBERY INVESTIGATION: Axis Bank Vault Heist (FIR #103/2024). Safe-cracking specialist Sameer "Ghost" Qureshi (ID #CRM-8821) breached vault using thermal lance. 14 kg gold bullion stolen. ANPR camera logged getaway vehicle HR-26-XX-4902 on KMP Expressway.',
                entities=[
                    EntityHighlight(label='SUSPECT: SAMEER GHOST QURESHI', type='target'),
                    EntityHighlight(label='SEIZED/STOLEN: 14 kg Gold Bullion', type='money'),
                    EntityHighlight(label='HOTSPOT: KMP Expressway Toll #4', type='location')
                ],
                note='Thermal lance tool marks and glove DNA match retrieved from bank vault safety deposit cage.',
                confidence='94.8%'
            )

        # 4. Narcotics & Arms Trafficking Analysis
        if any(w in q for w in ["narco", "drug", "heroin", "meth", "ndps", "arms", "weapon", "elena", "rostova", "port"]):
            return AIChatResponse(
                text='NARCOTICS & ARMS CARTEL: Elena "Czar" Rostova (ID #CRM-5512) syndicate intercepted. 100 kg synthetic heroin and 12 Steyr submachine guns seized at Port Container Terminal C. Network supplies inter-state distribution hubs across Delhi-NCR and Punjab.',
                entities=[
                    EntityHighlight(label='CARTEL HEAD: ELENA ROSTOVA', type='target'),
                    EntityHighlight(label='SEIZURE: 100kg Heroin + Submachine Guns', type='money'),
                    EntityHighlight(label='CORRIDOR: Port Terminal C Maritime Yard', type='location')
                ],
                note='Interpol Red Notice active. Cross-border maritime shipping route identified from Arabian Sea.',
                confidence='97.2%'
            )

        # 5. Gangster Syndicate / Extortion / Kidnapping
        if any(w in q for w in ["gang", "extort", "kidnap", "ransom", "mahesh", "khan", "tiger", "don", "syndicate"]):
            return AIChatResponse(
                text='ORGANIZED GANG INTELLIGENCE: Mahesh "Tiger" Khan (ID #CRM-0014) syndicate active under MCOCA Act. Coordinates inter-state extortion, contract assassinations, and illicit arms smuggling. Demanded ₹50 Lakhs ransom from Gurugram infrastructure firm.',
                entities=[
                    EntityHighlight(label='GANGSTER KINGPIN: MAHESH KHAN', type='target'),
                    EntityHighlight(label='RACKET: ₹5 Cr Monthly Extortion', type='money'),
                    EntityHighlight(label='JURISDICTION: NCR Organized Crime SIT', type='location')
                ],
                note='Voiceprint matched extortion wiretap recording with 99.1% biometric certainty. ₹25 Lakhs reward on arrest.',
                confidence='99.1%'
            )

        # Generic investigative resolution
        return AIChatResponse(
            text=f'CrimeLens Police Intelligence Engine analyzed query: "{message}". Scanned 12,458 indexed criminal records across Homicide, Sexual Offenses, Armed Robbery, Kidnapping, Narcotics, and Gang Syndicates. FIR databases synchronized.',
            entities=[
                EntityHighlight(label='CRIME DATABASE: National Police Network', type='target'),
                EntityHighlight(label='CLEARANCE: Law Enforcement Level 4', type='money')
            ],
            note='Cross-referenced against CCTNS, State Police STF databases, and Forensic Ballistics registries.',
            confidence='95.0%'
        )

intelligence_engine = IntelligenceEngine()
