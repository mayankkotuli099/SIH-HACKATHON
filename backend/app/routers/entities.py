from typing import Optional, List
from fastapi import APIRouter, HTTPException, status
from ..models.schemas import EntityDossier, KnownAssociate, FinancialAccount, BurnerDevice

router = APIRouter(prefix="/entities", tags=["Entities & Dossiers"])

ENTITIES_DATABASE: List[EntityDossier] = [
    EntityDossier(
        id="CRM-9942",
        name="VIKRAM 'RAJA' MALHOTRA",
        aliases=["Raja Bhai", "The Trigger", "VK-99"],
        crimeType="HOMICIDE & CONTRACT KILLING",
        firNumbers=["FIR-2024-402 (Murder Sec 302/103)", "FIR-2023-881 (Attempted Murder)", "FIR-2022-119 (Illegal Arms)"],
        weaponSignature="9mm Beretta 92FS / .32 Desi Katta",
        modusOperandi="Ambush contract killings on rival gang leaders using point-blank double-tap; getaway via unregistered KTM Duke bikes.",
        wantedReward="₹500,000 INR ($6,000 USD)",
        dnaProfileMatch="99.4% Match to Blood Splatter at Sector 18 Homicide Scene",
        riskScore=99.2,
        threatLevel="CRITICAL",
        status="ACTIVE_FUGITIVE",
        category="Serial Homicide / Gang Enforcer",
        biometrics={
            "dob": "1987-05-14",
            "nationality": "Indian (Interpol Blue Notice)",
            "scarsAndMarks": "Deep scar across left jawline; Cobra tattoo on right forearm",
            "voiceprintConfidence": "98.9%",
            "facialVectorId": "FV-99420-VK"
        },
        knownAssociates=[
            KnownAssociate(id="CRM-0014", name="Mahesh 'Tiger' Khan", relation="Gang Syndicate Boss", risk="CRITICAL"),
            KnownAssociate(id="CRM-4494", name="Suresh 'Chhota' Goli", relation="Armorer & Weapon Supplier", risk="HIGH"),
            KnownAssociate(id="CRM-8821", name="Sameer Qureshi", relation="Getaway Driver", risk="HIGH")
        ],
        financialAccounts=[
            FinancialAccount(bank="Cash Hawala Drops", accNo="SECTOR-12-HAWALA", balance="₹35 Lakhs Cash"),
            FinancialAccount(bank="Axis Bank (Benami Proxy)", accNo="****-4901", balance="₹14.2 Lakhs (Frozen)")
        ],
        burnerDevices=[
            BurnerDevice(imei="864201938472910", number="+91-98711-40291", status="Cell Tower Ping: Meerut Highway"),
            BurnerDevice(imei="359102847291830", number="+91-99882-11049", status="Signal Intercepted")
        ]
    ),
    EntityDossier(
        id="CRM-7721",
        name="DEVENDRA 'D-7' RAWAT",
        aliases=["D-7", "Highway Predator", "Night Stalker"],
        crimeType="SEXUAL ASSAULT & SERIAL RAPE",
        firNumbers=["FIR-2024-102 (Aggravated Rape Sec 376D/64)", "FIR-2024-089 (POCSO Act)", "FIR-2023-312 (Kidnapping Sec 363)"],
        weaponSignature="Hunting Knife / Chloroform / Pepper Spray",
        modusOperandi="Stalks lone commuters near unlit transit hubs and ring roads; uses fake taxi cabs with altered plates.",
        wantedReward="₹1,000,000 INR ($12,000 USD)",
        dnaProfileMatch="100% STR DNA Match from Forensic Kit #FK-8821",
        riskScore=99.8,
        threatLevel="CRITICAL",
        status="ACTIVE_FUGITIVE",
        category="Serial Sexual Offenses & Abduction",
        biometrics={
            "dob": "1991-11-03",
            "nationality": "Indian",
            "scarsAndMarks": "Burn mark on right shoulder; Stutter in speech",
            "voiceprintConfidence": "96.4%",
            "facialVectorId": "FV-77210-DR"
        },
        knownAssociates=[
            KnownAssociate(id="CRM-3310", name="Raju 'Mechanic' Verma", relation="Fake Number Plate Supplier", risk="HIGH"),
            KnownAssociate(id="CRM-9942", name="Vikram Malhotra", relation="Former Inmate / Gang Link", risk="CRITICAL")
        ],
        financialAccounts=[
            FinancialAccount(bank="Punjab National Bank", accNo="****-8821", balance="₹1.8 Lakhs (Monitored)")
        ],
        burnerDevices=[
            BurnerDevice(imei="869201948271049", number="+91-98112-99011", status="Tower Triangulation: Sector 14")
        ]
    ),
    EntityDossier(
        id="CRM-0014",
        name="MAHESH 'TIGER' KHAN",
        aliases=["Tiger", "Bada Don", "MK-01"],
        crimeType="ORGANIZED GANG SYNDICATE & EXTORTION",
        firNumbers=["FIR-2024-001 (MCOCA Act)", "FIR-2023-909 (Extortion & Kidnapping)", "FIR-2022-441 (Arms Act)"],
        weaponSignature="AK-47 / Imported Glock 17",
        modusOperandi="Extortion rackets on builders, inter-state contraband protection, contract killings via youth recruit sleeper cells.",
        wantedReward="₹2,500,000 INR ($30,000 USD)",
        dnaProfileMatch="Indexed in State Police Gangster Database",
        riskScore=98.5,
        threatLevel="CRITICAL",
        status="WARRANT_ISSUED",
        category="Syndicate Kingpin / Inter-State Gang Leader",
        biometrics={
            "dob": "1978-08-22",
            "nationality": "Indian (Red Corner Notice)",
            "scarsAndMarks": "Bullet exit wound scar on abdomen; Tiger tattoo on neck",
            "voiceprintConfidence": "99.1%",
            "facialVectorId": "FV-00145-MK"
        },
        knownAssociates=[
            KnownAssociate(id="CRM-9942", name="Vikram 'Raja' Malhotra", relation="Lead Hitman", risk="CRITICAL"),
            KnownAssociate(id="CRM-5512", name="Elena 'Czar' Rostova", relation="Narcotics Supply Partner", risk="CRITICAL"),
            KnownAssociate(id="CRM-8821", name="Sameer Qureshi", relation="Heist Specialist", risk="HIGH")
        ],
        financialAccounts=[
            FinancialAccount(bank="Dubai Bullion Vault", accNo="****-9102", balance="$1.8M Gold Bullion"),
            FinancialAccount(bank="Swiss Escrow #88", accNo="****-3310", balance="$3.2M USD (Frozen)")
        ],
        burnerDevices=[
            BurnerDevice(imei="861902847291830", number="+971-50-8819021", status="Encrypted Satellite Relay")
        ]
    ),
    EntityDossier(
        id="CRM-8821",
        name="SAMEER 'GHOST' QURESHI",
        aliases=["Ghost", "The Drill", "SQ-Lock"],
        crimeType="ARMED ROBBERY & BANK HEISTS",
        firNumbers=["FIR-2024-103 (Armed Bank Robbery Sec 392/397)", "FIR-2023-662 (Jewelry Vault Burglary)", "FIR-2022-210 (Vehicle Theft)"],
        weaponSignature="Sawed-off 12-Gauge Shotgun / Thermal Lance",
        modusOperandi="High-precision vault breaching, security guard neutralization, laser jammer deployment, signal blocker trucks.",
        wantedReward="₹750,000 INR ($9,000 USD)",
        dnaProfileMatch="Glove DNA Match from Axis Bank Vault Heist",
        riskScore=92.4,
        threatLevel="HIGH",
        status="ACTIVE_TRACKING",
        category="Armed Robber & Safe Cracker",
        biometrics={
            "dob": "1989-02-18",
            "nationality": "Indian",
            "scarsAndMarks": "Missing tip of right index finger",
            "voiceprintConfidence": "94.2%",
            "facialVectorId": "FV-88210-SQ"
        },
        knownAssociates=[
            KnownAssociate(id="CRM-0014", name="Mahesh Khan", relation="Syndicate Boss / Fencer", risk="CRITICAL"),
            KnownAssociate(id="CRM-4494", name="Vikram Mehta", relation="Hawala Fencer", risk="HIGH")
        ],
        financialAccounts=[
            FinancialAccount(bank="Stolen Gold Bullion Reserves", accNo="HEIST-OCT-2024", balance="14 kg Stolen Gold")
        ],
        burnerDevices=[
            BurnerDevice(imei="864201938472888", number="+91-98991-00219", status="Active GPS Beacon on Getaway Truck")
        ]
    ),
    EntityDossier(
        id="CRM-5512",
        name="ELENA 'CZAR' ROSTOVA",
        aliases=["The Chemist", "Czarina", "ER-Narc"],
        crimeType="NARCOTICS & ILLICIT ARMS TRAFFICKING",
        firNumbers=["FIR-2024-104 (NDPS Act 100kg Seizure)", "FIR-2023-419 (Cross-Border Arms Smuggling)"],
        weaponSignature="Steyr TMP 9mm Submachine Gun",
        modusOperandi="Maritime container smuggling of synthetic opioids, military-grade arms distribution across Northern India.",
        wantedReward="₹1,500,000 INR ($18,000 USD)",
        dnaProfileMatch="Fingerprint match on Port Terminal C Container Seal",
        riskScore=96.0,
        threatLevel="CRITICAL",
        status="ACTIVE_SURVEILLANCE",
        category="Narcotics Cartel & Arms Trafficking",
        biometrics={
            "dob": "1986-10-12",
            "nationality": "Dual Flagged (Interpol Red Notice)",
            "scarsAndMarks": "Tattoo of Russian Eagle on back",
            "voiceprintConfidence": "97.8%",
            "facialVectorId": "FV-55120-ER"
        },
        knownAssociates=[
            KnownAssociate(id="CRM-0014", name="Mahesh Khan", relation="Distribution Partner", risk="CRITICAL"),
            KnownAssociate(id="CRM-9942", name="Vikram Malhotra", relation="Enforcer", risk="CRITICAL")
        ],
        financialAccounts=[
            FinancialAccount(bank="HSBC HK Maritime Trust", accNo="****-9921", balance="$4.2M USD (Frozen)")
        ],
        burnerDevices=[
            BurnerDevice(imei="359102847291999", number="+44-7700-900821", status="Satellite Tracked: Arabian Sea")
        ]
    )
]

@router.get("/")
def get_entities(search: Optional[str] = None, risk: Optional[str] = None):
    results = ENTITIES_DATABASE

    if search:
        q = search.lower()
        results = [
            e for e in results
            if q in e.name.lower() or q in e.id.lower() or any(q in a.lower() for a in e.aliases)
        ]

    if risk and risk != "ALL":
        results = [e for e in results if e.threatLevel.upper() == risk.upper()]

    return {
        "success": True,
        "totalCount": len(results),
        "entities": results
    }

@router.get("/{entity_id}")
def get_entity_by_id(entity_id: str):
    entity = next(
        (e for e in ENTITIES_DATABASE if e.id.lower() == entity_id.lower() or entity_id.lower() in e.name.lower()),
        None
    )

    if not entity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'Entity with ID or Name "{entity_id}" not found.'
        )

    return {
        "success": True,
        "entity": entity
    }

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_criminal_record(payload: dict):
    name = payload.get("name", "").strip().upper()
    if not name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Criminal Name is required."
        )

    # Generate random ID or use provided
    import random
    new_id = payload.get("id") or f"CRM-{random.randint(1000, 9999)}"
    aliases = payload.get("aliases") or []
    if isinstance(aliases, str):
        aliases = [a.strip() for a in aliases.split(",") if a.strip()]

    fir_list = payload.get("firNumbers") or []
    if isinstance(fir_list, str):
        fir_list = [f.strip() for f in fir_list.split(",") if f.strip()]

    new_criminal = EntityDossier(
        id=new_id,
        name=name,
        aliases=aliases if aliases else [f"Alias {name.split()[0]}"],
        crimeType=payload.get("crimeType", "HOMICIDE & VIOLENT CRIME"),
        firNumbers=fir_list if fir_list else ["FIR-2024-PENDING (Registered)"],
        weaponSignature=payload.get("weaponSignature", "Illegal Firearm / Edged Weapon"),
        modusOperandi=payload.get("modusOperandi", "Active suspect under police investigation."),
        wantedReward=payload.get("wantedReward", "₹100,000 INR"),
        dnaProfileMatch=payload.get("dnaProfileMatch", "Forensic Sampling Scheduled"),
        riskScore=float(payload.get("riskScore", 90.0)),
        threatLevel=payload.get("threatLevel", "HIGH"),
        status=payload.get("status", "ACTIVE_WARRANT"),
        category=payload.get("category", payload.get("crimeType", "Criminal Offender")),
        biometrics={
            "dob": payload.get("dob", "1990-01-01"),
            "nationality": "Indian",
            "scarsAndMarks": payload.get("scarsAndMarks", "Identification marks recorded in CCTNS"),
            "voiceprintConfidence": "Recorded",
            "facialVectorId": f"FV-{new_id}"
        },
        knownAssociates=[],
        financialAccounts=[],
        burnerDevices=[
            BurnerDevice(
                imei=f"86{random.randint(1000000000000, 9999999999999)}",
                number=payload.get("phone", "+91-98XXX-XXXXX"),
                status="Signal Surveillance Active"
            )
        ] if payload.get("phone") else []
    )

    ENTITIES_DATABASE.insert(0, new_criminal)

    return {
        "success": True,
        "message": f"Criminal record for {new_criminal.name} registered successfully with ID {new_criminal.id}.",
        "entity": new_criminal
    }

