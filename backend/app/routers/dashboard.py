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
        time="2024-10-27 14:32:01",
        type="NEW CONNECTION",
        typeColor="var(--cyan-glow)",
        entity="NODE_X92_BETA → ALIAS_UK_09",
        severity="LOW",
        severityBadge="LOW",
        severityColor="var(--text-secondary)",
        action="VIEW DETAILS",
        rawPayload="Direct TCP handshake logged on port 8443 with encrypted payload size 12.4 KB.",
        hash="sha256:4f8a91c78b66e...",
        location="Frankfurt DE -> Zurich CH",
        interceptType="NETWORK_TELEMETRY"
    ),
    TelemetryLog(
        id=102,
        time="2024-10-27 14:28:45",
        type="ANOMALY DETECTED",
        typeColor="#FF5555",
        entity="IP_ROUTE_77.9.XX",
        severity="▲ CRITICAL",
        severityBadge="CRITICAL",
        severityColor="#FF5555",
        action="INVESTIGATE",
        rawPayload="Surge of 400+ encrypted packets to known C2 server in under 12 seconds.",
        hash="sha256:b93c8472ef910...",
        location="Hong Kong SAR",
        interceptType="SIGNALS_INTELLIGENCE"
    ),
    TelemetryLog(
        id=103,
        time="2024-10-27 14:15:22",
        type="DATA IMPORT",
        typeColor="var(--text-muted)",
        entity="BATCH_REQ_992 (450 records)",
        severity="INFO",
        severityBadge="INFO",
        severityColor="var(--text-muted)",
        action="VIEW LOG",
        rawPayload="Batch bank transaction CSV ingested into unified knowledge graph. 32 new suspect links synthesized.",
        hash="sha256:71de01488ca90...",
        location="Internal Ingestion Pipeline",
        interceptType="DATA_INGESTION"
    ),
    TelemetryLog(
        id=104,
        time="2024-10-27 14:02:18",
        type="SUSPICIOUS TRANSFER",
        typeColor="#FBBF24",
        entity="SHELL_CORP_B → DUBAI_BULLION",
        severity="HIGH",
        severityBadge="HIGH",
        severityColor="#FBBF24",
        action="INVESTIGATE",
        rawPayload="Automated wire of $450,000 USD routed via three intermediate escrow accounts.",
        hash="sha256:dd82910fa31b5...",
        location="Dubai UAE",
        interceptType="FINANCIAL_TRANSACTION"
    ),
    TelemetryLog(
        id=105,
        time="2024-10-27 13:54:10",
        type="GEOLOCATION PING",
        typeColor="var(--cyan-glow)",
        entity="RAHUL_SHARMA_ALIAS (Burner #2)",
        severity="MEDIUM",
        severityBadge="MEDIUM",
        severityColor="#FBBF24",
        action="VIEW DETAILS",
        rawPayload="Triangulated cell tower handshake in Sector 29 Cyber Hub near financial district.",
        hash="sha256:aa290192eef81...",
        location="NCR 28.4595° N, 77.0266° E",
        interceptType="GEOSPATIAL_VECTOR"
    )
]

@router.get("/overview", response_model=DashboardOverviewResponse)
def get_dashboard_overview():
    metrics = [
        MetricItem(
            id="entities",
            title="TOTAL ENTITIES",
            value=metrics_state["entities"],
            displayValue=f"{metrics_state['entities']:,}",
            change="+3.4% from last week",
            icon="🛡️",
            borderAccent="rgba(0, 229, 255, 0.2)",
            targetPage="entities"
        ),
        MetricItem(
            id="relationships",
            title="RELATIONSHIPS",
            value=metrics_state["relationships"],
            displayValue=f"{metrics_state['relationships']:,}",
            change="+8.1% from last week",
            icon="🕸️",
            borderAccent="rgba(41, 121, 255, 0.2)",
            targetPage="network"
        ),
        MetricItem(
            id="cases",
            title="ACTIVE CASES",
            value=metrics_state["cases"],
            displayValue=str(metrics_state["cases"]),
            change="12 REQUIRING ATTENTION",
            icon="📁",
            borderAccent="rgba(0, 230, 118, 0.2)",
            targetPage="cases"
        ),
        MetricItem(
            id="high-risk",
            title="HIGH-RISK ENTITIES",
            value=metrics_state["high_risk"],
            displayValue=f"{metrics_state['high_risk']} •",
            change="! IMMEDIATE REVIEW REQUIRED",
            icon="⚠️",
            borderAccent="rgba(255, 85, 85, 0.4)",
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
