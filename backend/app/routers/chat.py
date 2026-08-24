from fastapi import APIRouter, HTTPException, status
from ..models.schemas import ChatQueryRequest, AIChatResponse
from ..services.intelligence import intelligence_engine

router = APIRouter(prefix="/chat", tags=["AI Copilot & Neural Chat"])

@router.post("/query")
def chat_query(req: ChatQueryRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message query cannot be empty."
        )

    response = intelligence_engine.process_query(req.message)

    return {
        "success": True,
        "response": response
    }
