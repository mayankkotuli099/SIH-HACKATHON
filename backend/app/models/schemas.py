from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

# Auth Schemas
class LoginRequest(BaseModel):
    id: str
    password: str

class RegisterRequest(BaseModel):
    id: str
    name: str
    password: str

class UserProfile(BaseModel):
    id: str
    name: str
    role: str
    clearance: str
    badgeId: str
    email: str

class AuthResponse(BaseModel):
    success: bool
    message: str
    token: Optional[str] = None
    user: Optional[UserProfile] = None

# Telemetry & Dashboard Schemas
class TelemetryLog(BaseModel):
    id: int
    time: str
    type: str
    typeColor: str
    entity: str
    severity: str
    severityBadge: str
    severityColor: str
    action: str
    rawPayload: str
    hash: str
    location: str
    interceptType: str

class MetricItem(BaseModel):
    id: str
    title: str
    value: int
    displayValue: str
    change: str
    icon: str
    borderAccent: str
    targetPage: str
    isWarning: Optional[bool] = False

class DashboardOverviewResponse(BaseModel):
    success: bool
    metrics: List[MetricItem]
    logs: List[TelemetryLog]

class QueryDispatchRequest(BaseModel):
    targetType: str
    identifier: str
    jurisdiction: Optional[str] = "DOMESTIC_SIGINT"
    priority: Optional[str] = "HIGH"

# Entity Schemas
class KnownAssociate(BaseModel):
    id: str
    name: str
    relation: str
    risk: str

class FinancialAccount(BaseModel):
    bank: str
    accNo: str
    balance: str

class BurnerDevice(BaseModel):
    imei: str
    number: str
    status: str

class EntityDossier(BaseModel):
    id: str
    name: str
    aliases: List[str]
    crimeType: Optional[str] = "HOMICIDE_AND_VIOLENT_CRIME"
    firNumbers: Optional[List[str]] = []
    weaponSignature: Optional[str] = None
    modusOperandi: Optional[str] = None
    wantedReward: Optional[str] = None
    dnaProfileMatch: Optional[str] = None
    riskScore: float
    threatLevel: str
    status: str
    category: str
    biometrics: Dict[str, Any]
    knownAssociates: List[KnownAssociate]
    financialAccounts: List[FinancialAccount]
    burnerDevices: List[BurnerDevice]

# Network Topology Schemas
class NetworkNode(BaseModel):
    id: str
    label: str
    category: str
    risk: float
    degree: int
    group: str

class NetworkEdge(BaseModel):
    source: str
    target: str
    label: str
    weight: float
    type: str

class NetworkCluster(BaseModel):
    id: str
    name: str
    description: str
    nodes: List[NetworkNode]
    edges: List[NetworkEdge]

# Timeline Schemas
class TimelineEvent(BaseModel):
    id: str
    timestamp: str
    title: str
    category: str
    severity: str
    entity: str
    description: str
    confidence: str
    coordinates: str

# Case Schemas
class CaseFile(BaseModel):
    id: str
    title: str
    leadSuspect: str
    status: str
    priority: str
    assignedOfficer: str
    openedDate: str
    evidenceCount: int
    description: str
    tags: List[str]

class CreateCaseRequest(BaseModel):
    title: str
    leadSuspect: Optional[str] = "Pending Identification"
    priority: Optional[str] = "HIGH"
    description: Optional[str] = ""
    tags: Optional[List[str]] = ["TACTICAL_DISPATCH"]

# Chat / AI Copilot Schemas
class ChatMessage(BaseModel):
    id: Optional[int] = None
    sender: str
    text: str

class EntityHighlight(BaseModel):
    label: str
    type: str

class AIChatResponse(BaseModel):
    text: str
    entities: List[EntityHighlight]
    note: str
    confidence: str

class ChatQueryRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, Any]]] = []

# Settings Schemas
class SettingsData(BaseModel):
    model: str = "crimelens-titan-4.2"
    sensitivity: int = 85
    alertsEnabled: bool = True
    autoDossier: bool = True
    shaVerification: bool = True
