"""
Transcription Endpoints
"""
import time
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.api.deps import get_required_user
from app.models.database.user_table import User
from app.models.domain.transcription import TranscriptionResponse
from app.services.stt.engine import stt_engine
import structlog

logger = structlog.get_logger()
router = APIRouter()


@router.post("/audio", response_model=TranscriptionResponse)
async def transcribe_audio(
    audio_file: UploadFile = File(...),
    current_user: User = Depends(get_required_user),
):
    """
    Transcribe audio file to text using medical-grade STT
    """
    
    # Validate file
    if not audio_file.content_type or "audio" not in audio_file.content_type:
        raise HTTPException(
            status_code=400,
            detail="File must be an audio file"
        )
    
    # Read audio data
    audio_data = await audio_file.read()
    
    if len(audio_data) == 0:
        raise HTTPException(
            status_code=400,
            detail="Audio file is empty"
        )
    
    # Limit file size (25MB for MVP)
    max_size = 25 * 1024 * 1024  # 25 MB
    if len(audio_data) > max_size:
        raise HTTPException(
            status_code=400,
            detail=f"Audio file too large. Maximum size: {max_size // (1024*1024)}MB"
        )
    
    logger.info(
        "Processing transcription",
        user_id=current_user.id,
        file_size=len(audio_data),
        content_type=audio_file.content_type,
    )
    
    try:
        # Transcribe audio
        start_time = time.time()
        result = await stt_engine.transcribe(audio_data)
        processing_time = time.time() - start_time
        
        return TranscriptionResponse(
            text=result["text"],
            confidence=result.get("confidence", 0.0),
            duration_seconds=processing_time,
            segments=result.get("segments"),
            medical_terms_detected=[],  # Will be enhanced in later versions
        )
        
    except Exception as e:
        logger.error("Transcription failed", error=str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Transcription failed: {str(e)}"
        )
