"""
STT Engine - Cloud Only Version
Supports: Groq (Free) and OpenAI (Paid)
No local AI processing
"""
import structlog
from app.core.config import settings

logger = structlog.get_logger()


class STTEngine:
    """Cloud-based Speech-to-Text Engine"""
    
    def __init__(self):
        self.provider = settings.AI_PROVIDER
        self._validate_credentials()
    
    def _validate_credentials(self):
        """Ensure required API keys are set"""
        if self.provider == "groq" and not settings.GROQ_API_KEY:
            logger.warning("GROQ_API_KEY not set. Transcription will fail.")
        elif self.provider == "openai" and not settings.OPENAI_API_KEY:
            logger.warning("OPENAI_API_KEY not set. Transcription will fail.")
    
    async def transcribe(self, audio_data: bytes, language: str = "en") -> dict:
        """
        Transcribe audio to text using cloud STT
        
        Args:
            audio_data: Raw audio bytes (from phone recording)
            language: Language code (default: en)
            
        Returns:
            dict with text, confidence, segments, duration, provider
        """
        logger.info("Transcribing audio via cloud", provider=self.provider, size_bytes=len(audio_data))
        
        if self.provider == "groq":
            return await self._transcribe_groq(audio_data, language)
        elif self.provider == "openai":
            return await self._transcribe_openai(audio_data, language)
        else:
            raise ValueError(f"Unsupported cloud STT provider: {self.provider}. Use 'groq' or 'openai'")
    
    async def _transcribe_groq(self, audio_data: bytes, language: str) -> dict:
        """
        Transcribe using Groq Cloud API (FREE TIER)
        Uses Whisper Large v3 model via Groq's fast inference
        """
        try:
            from groq import Groq
            
            if not settings.GROQ_API_KEY:
                raise ValueError("GROQ_API_KEY is required. Get free key at https://console.groq.com")
            
            client = Groq(api_key=settings.GROQ_API_KEY)
            
            # Send audio to Groq cloud for processing
            response = client.audio.transcriptions.create(
                model=settings.GROQ_STT_MODEL,
                file=("recording.webm", audio_data),
                language=language,
                response_format="verbose_json",
                temperature=0.0,  # Most accurate transcription
            )
            
            logger.info("Groq transcription complete", 
                       confidence=getattr(response, 'confidence', 'N/A'),
                       duration=getattr(response, 'duration', 0))
            
            return {
                "text": response.text,
                "confidence": getattr(response, 'confidence', 0.9),
                "segments": getattr(response, 'segments', []),
                "duration": getattr(response, 'duration', 0.0),
                "provider": "groq"
            }
            
        except Exception as e:
            logger.error("Groq cloud transcription failed", error=str(e))
            raise Exception(f"Cloud transcription failed: {str(e)}")
    
    async def _transcribe_openai(self, audio_data: bytes, language: str) -> dict:
        """
        Transcribe using OpenAI Whisper API (PAID)
        Fallback option if Groq is unavailable
        """
        try:
            from openai import AsyncOpenAI
            
            if not settings.OPENAI_API_KEY:
                raise ValueError("OPENAI_API_KEY is required")
            
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            
            response = await client.audio.transcriptions.create(
                model=settings.OPENAI_STT_MODEL,
                file=("recording.webm", audio_data),
                language=language,
                response_format="verbose_json",
                temperature=0.0,
            )
            
            logger.info("OpenAI transcription complete", duration=getattr(response, 'duration', 0))
            
            return {
                "text": response.text,
                "confidence": getattr(response, 'confidence', 0.95),
                "segments": getattr(response, 'segments', []),
                "duration": getattr(response, 'duration', 0.0),
                "provider": "openai"
            }
            
        except Exception as e:
            logger.error("OpenAI cloud transcription failed", error=str(e))
            raise Exception(f"Cloud transcription failed: {str(e)}")


# Singleton instance
stt_engine = STTEngine()
