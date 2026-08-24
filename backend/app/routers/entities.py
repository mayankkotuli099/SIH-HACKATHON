from typing import Optional, List
from fastapi import APIRouter, HTTPException, status
from ..models.schemas import EntityDossier, KnownAssociate, FinancialAccount, BurnerDevice

router = APIRouter(prefix="/entities", tags=["Entities & Dossiers"])

ENTITIES_DATABASE: List[EntityDossier] = [
    EntityDossier(
        id="ENT-8921",
        name="RAHUL SHARMA",
        aliases=["Apex Master", "Operator Zero", "RS_77"],
        riskScore=94.2,
        threatLevel="CRITICAL",
        status="ACTIVE_SURVEILLANCE",
        category="Syndicate Kingpin / Financial Controller",
        biometrics={
            "dob": "1984-06-14",
            "nationality": "Indian (Dual Passport Flagged)",
            "voiceprintConfidence": "96.8%",
            "facialVectorId": "FV-99420-IN"
        },
        knownAssociates=[
            KnownAssociate(id="ENT-4494", name="Vikram Mehta", relation="Hawala Broker", risk="HIGH"),
            KnownAssociate(id="ENT-1120", name="Elena Rostova", relation="Crypto Custodian", risk="CRITICAL")
        ],
        financialAccounts=[
            FinancialAccount(bank="Standard Chartered HK", accNo="****-9921", balance="$2.4M USD (Frozen)"),
            FinancialAccount(bank="Dubai Islamic Bank", accNo="****-3310", balance="$850K USD (Active)")
        ],
        burnerDevices=[
            BurnerDevice(imei="864201938472910", number="+91-98765-43210", status="Cell Tower Triangulated"),
            BurnerDevice(imei="359102847291830", number="+971-50-1234567", status="VoIP Forwarding")
        ]
    ),
    EntityDossier(
        id="ENT-4494",
        name="VIKRAM MEHTA",
        aliases=["VK Broker", "Hawala One"],
        riskScore=88.5,
        threatLevel="HIGH",
        status="ACTIVE_TRACKING",
        category="Hawala Courier & Shell Director",
        biometrics={
            "dob": "1979-11-22",
            "nationality": "Indian",
            "voiceprintConfidence": "91.4%",
            "facialVectorId": "FV-88210-IN"
        },
        knownAssociates=[
            KnownAssociate(id="ENT-8921", name="Rahul Sharma", relation="Syndicate Boss", risk="CRITICAL")
        ],
        financialAccounts=[
            FinancialAccount(bank="Emirates NBD", accNo="****-1104", balance="$420K USD")
        ],
        burnerDevices=[
            BurnerDevice(imei="869201948271049", number="+91-98111-22334", status="Active Signal")
        ]
    ),
    EntityDossier(
        id="ENT-1120",
        name="SHELL CORP B (HONG KONG)",
        aliases=["Apex Global Logistics HK Ltd"],
        riskScore=91.0,
        threatLevel="CRITICAL",
        status="FROZEN_ASSET",
        category="Front Commercial Entity",
        biometrics={
            "registrationNo": "HK-CR-892144",
            "jurisdiction": "Hong Kong SAR",
            "registeredDirector": "Rahul Sharma (Proxy)"
        },
        knownAssociates=[
            KnownAssociate(id="ENT-8921", name="Rahul Sharma", relation="Beneficial Owner", risk="CRITICAL")
        ],
        financialAccounts=[
            FinancialAccount(bank="HSBC Hong Kong", accNo="****-8402", balance="$1.8M USD")
        ],
        burnerDevices=[]
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
