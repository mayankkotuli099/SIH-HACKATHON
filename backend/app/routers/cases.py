from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, status
from ..models.schemas import CaseFile, CreateCaseRequest

router = APIRouter(prefix="/cases", tags=["Cases Management"])

CASES_DATABASE: List[CaseFile] = [
    CaseFile(
        id="CASE-2024-001",
        title="Operation Apex Shadow",
        leadSuspect="Rahul Sharma",
        status="ACTIVE_INVESTIGATION",
        priority="CRITICAL",
        assignedOfficer="OP_01 (Clearance L4)",
        openedDate="2024-09-12",
        evidenceCount=42,
        description="Cross-border hawala syndicate funneling illicit proceeds into luxury real estate and bullion accounts.",
        tags=["HAWALA", "SHELL_CORP", "HIGH_RISK"]
    ),
    CaseFile(
        id="CASE-2024-002",
        title="Project DarkFlow Nexus",
        leadSuspect="Unknown Operator (C2 #77)",
        status="SURVEILLANCE",
        priority="HIGH",
        assignedOfficer="OP_03 (Signals Team)",
        openedDate="2024-10-01",
        evidenceCount=18,
        description="Decentralized botnet coordinating DDoS extortion and crypto tumbler laundering.",
        tags=["BOTNET", "CRYPTO", "SIGINT"]
    ),
    CaseFile(
        id="CASE-2024-003",
        title="Operation Silver Route",
        leadSuspect="Vikram Mehta",
        status="EVIDENCE_SEALED",
        priority="MEDIUM",
        assignedOfficer="OP_01 (Clearance L4)",
        openedDate="2024-08-19",
        evidenceCount=29,
        description="Hawala cash drop courier network operating in Delhi-NCR and Mumbai financial corridors.",
        tags=["COURIER", "NCR", "INTERCEPT"]
    )
]

@router.get("/")
def get_all_cases():
    return {
        "success": True,
        "totalCount": len(CASES_DATABASE),
        "cases": CASES_DATABASE
    }

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_case(req: CreateCaseRequest):
    if not req.title.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Case title is required."
        )

    new_id = f"CASE-2024-{str(len(CASES_DATABASE) + 1).zfill(3)}"
    now_date = datetime.utcnow().strftime("%Y-%m-%d")

    new_case = CaseFile(
        id=new_id,
        title=req.title,
        leadSuspect=req.leadSuspect or "Pending Identification",
        status="ACTIVE_INVESTIGATION",
        priority=req.priority or "HIGH",
        assignedOfficer="OP_01 (Clearance L4)",
        openedDate=now_date,
        evidenceCount=1,
        description=req.description or "Initial case file opened via CrimeLens investigator portal.",
        tags=req.tags or ["TACTICAL_DISPATCH"]
    )

    CASES_DATABASE.insert(0, new_case)

    return {
        "success": True,
        "message": f"Case {new_id} registered successfully.",
        "case": new_case
    }
