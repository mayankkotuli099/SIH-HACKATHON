from typing import Dict, Any
from fastapi import APIRouter
from ..models.schemas import SettingsData

router = APIRouter(prefix="/settings", tags=["Settings & Security Clearance"])

system_settings = SettingsData(
    model="crimelens-titan-4.2",
    sensitivity=85,
    alertsEnabled=True,
    autoDossier=True,
    shaVerification=True
)

@router.get("/")
def get_settings():
    return {
        "success": True,
        "settings": system_settings
    }

@router.post("/")
def update_settings(updates: Dict[str, Any]):
    global system_settings

    current_dict = system_settings.model_dump()
    for k, v in updates.items():
        if k in current_dict:
            current_dict[k] = v

    system_settings = SettingsData(**current_dict)

    return {
        "success": True,
        "message": "System settings synchronized successfully.",
        "settings": system_settings
    }
