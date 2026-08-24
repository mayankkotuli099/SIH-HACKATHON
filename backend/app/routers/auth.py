import base64
import time
from fastapi import APIRouter, HTTPException, status
from ..models.schemas import LoginRequest, RegisterRequest, AuthResponse, UserProfile

router = APIRouter(prefix="/auth", tags=["Authentication"])

MOCK_USERS = [
    UserProfile(
        id="OP_01",
        name="Operator 01",
        role="Lead Forensic Investigator",
        clearance="LEVEL 4 ACCESS",
        badgeId="#CL-8921",
        email="op01@crimelens.intel.gov"
    )
]

@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest):
    if not req.id or not req.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Investigator ID and password are required."
        )

    # Search or instantiate user profile
    user = next((u for u in MOCK_USERS if u.id.lower() == req.id.lower()), None)
    if not user:
        user = UserProfile(
            id=req.id.upper(),
            name=f"Investigator {req.id.upper()}",
            role="Tactical Analyst",
            clearance="LEVEL 4 ACCESS",
            badgeId=f"#CL-{int(time.time()) % 9000 + 1000}",
            email=f"{req.id.lower()}@crimelens.intel.gov"
        )
        MOCK_USERS.append(user)

    token_data = f"{req.id}:{int(time.time())}"
    token = f"cl_token_{base64.b64encode(token_data.encode()).decode()}"

    return AuthResponse(
        success=True,
        message="Authentication successful. Security Level 4 granted.",
        token=token,
        user=user
    )

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest):
    if not req.id or not req.name or not req.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All registration fields are required."
        )

    new_user = UserProfile(
        id=req.id.upper(),
        name=req.name,
        role="Field Analyst",
        clearance="LEVEL 4 ACCESS",
        badgeId=f"#CL-{int(time.time()) % 9000 + 1000}",
        email=f"{req.id.lower()}@crimelens.intel.gov"
    )
    MOCK_USERS.append(new_user)

    token_data = f"{req.id}:{int(time.time())}"
    token = f"cl_token_{base64.b64encode(token_data.encode()).decode()}"

    return AuthResponse(
        success=True,
        message="Investigator credentials registered successfully.",
        token=token,
        user=new_user
    )

@router.get("/me")
def get_current_user():
    return {
        "success": True,
        "user": MOCK_USERS[0]
    }
