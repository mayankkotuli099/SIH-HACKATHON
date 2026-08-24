import time
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, status
from ..models.schemas import DashboardOverviewResponse, MetricItem, TelemetryLog, QueryDispatchRequest

router = APIRouter(prefix="/dashboard", tags=["Dashboard & Telemetry"])

metrics_state = {
    "entities": 12458,
    "relationships": 35789,
    "cases": 245,
    "high_risk": 32
}

telemetry_logs_db: List[TelemetryLog] = [
    TelemetryLog(
        id=101,
        time="2024-10-27 15:10:22",
        type="BALLISTICS HIT",
        typeColor="#FF5555",
        entity="CRIME SCENE #18 → VIKRAM 'RAJA' MALHOTRA",
        severity="▲ CRITICAL",
        severityBadge="CRITICAL",
        severityColor="#FF5555",
        action="DISPATCH STF",
        rawPayload="FSL Forensic Ballistics match: 9mm cartridge casing recovered from Sector 18 double homicide fired from seized Beretta #92FS-881.",
        hash="sha256:4f8a91c78b66e9921c",
        location="Sector 18 Homicide Scene (28.5700° N, 77.3200° E)",
        interceptType="FORENSIC_BALLISTICS"
    ),
    TelemetryLog(
        id=102,
        time="2024-10-27 14:48:15",
        type="DNA MATCH ALERT",
        typeColor="#FF5555",
        entity="DEVENDRA 'D-7' RAWAT (Fugitive)",
        severity="▲ CRITICAL",
        severityBadge="CRITICAL",
        severityColor="#FF5555",
        action="APPREHEND",
        rawPayload="Automated National DNA Registry hit: 100% STR profile match with evidence kit from Sector 14 highway abduction case.",
        hash="sha256:b93c8472ef9104492a",
        location="Special SIT Forensics Lab",
        interceptType="DNA_FORENSICS"
    ),
    TelemetryLog(
        id=103,
        time="2024-10-27 14:22:40",
        type="ANPR TOLL HIT",
        typeColor="#FBBF24",
        entity="ARMED HEIST GETAWAY (HR-26-XX-4902)",
        severity="HIGH",
        severityBadge="HIGH",
        severityColor="#FBBF24",
        action="INTERCEPT",
        rawPayload="Automatic Number Plate Recognition camera detected suspect Bolero vehicle used in Axis Bank gold heist heading towards Meerut Expressway.",
        hash="sha256:71de01488ca901192b",
        location="KMP Expressway Toll Gate #4",
        interceptType="HIGHWAY_SURVEILLANCE"
    ),
    TelemetryLog(
        id=104,
        time="2024-10-27 13:58:18",
        type="PORT NARCO SEIZURE",
        typeColor="#A855F7",
        entity="ELENA ROSTOVA → PORT TERMINAL C",
        severity="HIGH",
        severityBadge="HIGH",
        severityColor="#A855F7",
        action="SEAL CARGO",
        rawPayload="Customs & NCB special inspection intercepted container with 100kg synthetic heroin hidden inside industrial compressor units.",
        hash="sha256:dd82910fa31b57891c",
        location="Port Container Terminal C",
        interceptType="NARCOTICS_INTERCEPT"
    ),
    TelemetryLog(
        id=105,
        time="2024-10-27 13:30:10",
        type="EXTORTION WIREPING",
        typeColor="var(--cyan-glow)",
        entity="MAHESH 'TIGER' KHAN SYNDICATE",
        severity="MEDIUM",
        severityBadge="MEDIUM",
        severityColor="var(--cyan-glow)",
        action="VIEW RECORD",
        rawPayload="Voice intercept: Threat call recorded demanding ₹50 Lakhs ransom from real estate developer in Sector 62.",
        hash="sha256:aa290192eef814402a",
        location="Cell Tower #88 Gurgaon",
        interceptType="SIGINT_EXTORTION"
    )
]

@router.get("/overview", response_model=DashboardOverviewResponse)
def get_dashboard_overview():
    metrics = [
        MetricItem(
            id="entities",
            title="WANTED CRIMINALS",
            value=metrics_state["entities"],
            displayValue=f"{metrics_state['entities']:,}",
            change="+18 Active Warrants this week",
            icon="🚨",
            borderAccent="rgba(255, 85, 85, 0.3)",
            targetPage="entities"
        ),
        MetricItem(
            id="relationships",
            title="CRIME SYNDICATE LINKS",
            value=metrics_state["relationships"],
            displayValue=f"{metrics_state['relationships']:,}",
            change="+45 Gang Associates mapped",
            icon="🕸️",
            borderAccent="rgba(0, 229, 255, 0.2)",
            targetPage="network"
        ),
        MetricItem(
            id="cases",
            title="ACTIVE FIR & CASES",
            value=metrics_state["cases"],
            displayValue=str(metrics_state["cases"]),
            change="14 Homicide & Rape cases in SIT",
            icon="📁",
            borderAccent="rgba(251, 191, 36, 0.2)",
            targetPage="cases"
        ),
        MetricItem(
            id="high-risk",
            title="RED CORNER FUGITIVES",
            value=metrics_state["high_risk"],
            displayValue=f"{metrics_state['high_risk']} •",
            change="! RED ALERT MANHUNT IN PROGRESS",
            icon="⚠️",
            borderAccent="rgba(255, 85, 85, 0.5)",
            targetPage="entities",
            isWarning=True
        )
    ]

    return DashboardOverviewResponse(
        success=True,
        metrics=metrics,
        logs=telemetry_logs_db
    )

@router.post("/query", status_code=status.HTTP_201_CREATED)
def dispatch_query(req: QueryDispatchRequest):
    if not req.identifier.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Target identifier is required."
        )

    now = datetime.utcnow()
    time_str = now.strftime("%Y-%m-%d %H:%M:%S")

    new_log = TelemetryLog(
        id=int(time.time() * 1000),
        time=time_str,
        type="MANUAL QUERY",
        typeColor="var(--cyan-glow)",
        entity=f"TARGET: {req.identifier.upper()} [{req.targetType}]",
        severity="▲ CRITICAL" if req.priority == "CRITICAL" else req.priority,
        severityBadge=req.priority,
        severityColor="#FF5555" if req.priority == "CRITICAL" else "var(--cyan-glow)",
        action="VIEW DETAILS",
        rawPayload=f"Operator dispatched search on jurisdiction: {req.jurisdiction}. Neural indexing active.",
        hash=f"sha256:{hex(int(time.time() * 1000))[2:14]}...",
        location="Direct Operator Terminal",
        interceptType="OPERATOR_DISPATCH"
    )

    telemetry_logs_db.insert(0, new_log)
    metrics_state["entities"] += 1
    metrics_state["relationships"] += 2

    return {
        "success": True,
        "message": f'Target investigation query "{req.identifier}" dispatched successfully.',
        "log": new_log
    }
