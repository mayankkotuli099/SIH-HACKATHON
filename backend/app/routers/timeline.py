from typing import Optional, List
from fastapi import APIRouter
from ..models.schemas import TimelineEvent

router = APIRouter(prefix="/timeline", tags=["Timeline Stream"])

TIMELINE_EVENTS_DB: List[TimelineEvent] = [
    TimelineEvent(
        id="TL-101",
        timestamp="2024-10-27 14:32:00 UTC",
        title="Encrypted C2 Handshake",
        category="NETWORK",
        severity="LOW",
        entity="NODE_X92_BETA",
        description="Direct TLS 1.3 encrypted handshake with Frankfurt exit node.",
        confidence="98.5%",
        coordinates="50.1109° N, 8.6821° E"
    ),
    TimelineEvent(
        id="TL-102",
        timestamp="2024-10-27 14:02:18 UTC",
        title="$450,000 Offshore Wire Transfer",
        category="FINANCIAL",
        severity="HIGH",
        entity="Shell Corp B -> Dubai Bullion",
        description="Wire initiated via proxy bank account. Flagged by anti-money laundering anomaly engine.",
        confidence="99.1%",
        coordinates="25.2048° N, 55.2708° E"
    ),
    TimelineEvent(
        id="TL-103",
        timestamp="2024-10-27 13:54:10 UTC",
        title="Burner SIM Geolocation Triangulation",
        category="GEOSPATIAL",
        severity="MEDIUM",
        entity="Rahul Sharma (+91-98765-43210)",
        description="Cell tower ping near DLF Cyber Hub Sector 29.",
        confidence="92.0%",
        coordinates="28.4595° N, 77.0266° E"
    ),
    TimelineEvent(
        id="TL-104",
        timestamp="2024-10-27 11:18:40 UTC",
        title="Wiretap Audio Intercept: VoIP Session #44",
        category="COMMUNICATION",
        severity="CRITICAL",
        entity="Rahul Sharma & Vikram Mehta",
        description="Discussed delivery of gold bullion consignments and alternate banking rails.",
        confidence="96.8%",
        coordinates="Encrypted SIP VoIP Trunk"
    )
]

@router.get("/")
def get_timeline_events(category: Optional[str] = None, search: Optional[str] = None):
    results = TIMELINE_EVENTS_DB

    if category and category != "ALL":
        results = [e for e in results if e.category.upper() == category.upper()]

    if search:
        q = search.lower()
        results = [
            e for e in results
            if q in e.title.lower() or q in e.entity.lower() or q in e.description.lower()
        ]

    return {
        "success": True,
        "totalCount": len(results),
        "events": results
    }
