"""
LLM Engine - Cloud Only Version
Supports: Groq (Free Llama 3.1) and OpenAI (Paid GPT)
No local AI processing
"""
import time
import structlog
from app.core.config import settings

logger = structlog.get_logger()


class LLMEngine:
    """Cloud-based LLM Engine for clinical note formatting"""
    
    def __init__(self):
        self.provider = settings.AI_PROVIDER
        self._validate_credentials()
    
    def _validate_credentials(self):
        """Ensure required API keys are set"""
        if self.provider == "groq" and not settings.GROQ_API_KEY:
            logger.warning("GROQ_API_KEY not set. Formatting will fail.")
        elif self.provider == "openai" and not settings.OPENAI_API_KEY:
            logger.warning("OPENAI_API_KEY not set. Formatting will fail.")
    
    async def format_note(self, transcript: str, template_type: str = "soap") -> dict:
        """
        Format transcript into clinical note using cloud LLM
        
        Args:
            transcript: Raw transcription text from phone recording
            template_type: Note template (soap, consultation, discharge, procedure)
            
        Returns:
            dict with formatted_note, template_used, processing_time, provider
        """
        start_time = time.time()
        
        logger.info("Formatting clinical note via cloud", 
                   template=template_type, 
                   provider=self.provider,
                   transcript_length=len(transcript))
        
        # Get appropriate prompt
        prompt = self._get_prompt(transcript, template_type)
        
        # Get completion from cloud LLM
        formatted_text = await self._get_completion(prompt)
        
        processing_time = time.time() - start_time
        
        logger.info("Cloud formatting complete", processing_time=f"{processing_time:.2f}s")
        
        return {
            "formatted_note": formatted_text,
            "template_used": template_type,
            "processing_time": processing_time,
            "provider": self.provider
        }
    
    def _get_prompt(self, transcript: str, template_type: str) -> str:
        """Generate clinical formatting prompt"""
        
        if template_type == "soap":
            return f"""You are a medical documentation expert. Convert the following clinical dictation into a professionally formatted SOAP note.

## Guidelines:
- **S (Subjective)**: Patient's reported symptoms, history, complaints
- **O (Objective)**: Vital signs, physical exam findings, lab results
- **A (Assessment)**: Diagnosis, differential diagnoses, clinical impression  
- **P (Plan)**: Treatment plan, medications, follow-up instructions

- Use proper medical terminology
- Maintain a professional, concise tone
- Include all clinically relevant information
- Format with clear section headers
- Note any missing information with [Not specified]

## Clinical Dictation:
{transcript}

## Formatted SOAP Note:
"""
        
        elif template_type == "consultation":
            return f"""Convert this clinical consultation dictation into a formatted consultation note.

Include:
- Reason for Consultation
- History of Present Illness
- Review of Systems
- Physical Examination
- Assessment and Recommendations

## Dictation:
{transcript}

## Consultation Note:
"""
        
        elif template_type == "discharge":
            return f"""Create a discharge summary from this dictation.

Include:
- Admission & Discharge Dates
- Admitting Diagnosis
- Discharge Diagnosis
- Hospital Course
- Discharge Medications
- Follow-up Instructions
- Discharge Condition

## Dictation:
{transcript}

## Discharge Summary:
"""
        
        else:
            return f"""Format this clinical dictation into a structured medical note.

## Dictation:
{transcript}

## Structured Note:
"""
    
    async def _get_completion(self, prompt: str) -> str:
        """Get completion from cloud LLM provider"""
        
        if self.provider == "groq":
            return await self._complete_groq(prompt)
        elif self.provider == "openai":
            return await self._complete_openai(prompt)
        else:
            raise ValueError(f"Unsupported cloud LLM provider: {self.provider}. Use 'groq' or 'openai'")
    
    async def _complete_groq(self, prompt: str) -> str:
        """
        Complete using Groq Cloud API (FREE TIER)
        Uses Llama 3.1 70B model via Groq's fast inference
        """
        try:
            from groq import Groq
            
            if not settings.GROQ_API_KEY:
                raise ValueError("GROQ_API_KEY is required. Get free key at https://console.groq.com")
            
            client = Groq(api_key=settings.GROQ_API_KEY)
            
            response = client.chat.completions.create(
                model=settings.GROQ_LLM_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert medical documentation assistant. Format clinical notes professionally and accurately. Always return properly formatted text with clear section headers."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,  # Lower temperature for consistent formatting
                max_tokens=2000,
                top_p=0.9,
            )
            
            formatted_text = response.choices[0].message.content
            
            logger.info("Groq cloud completion successful", 
                       tokens_used=response.usage.total_tokens if hasattr(response, 'usage') else 'N/A')
            
            return formatted_text
            
        except Exception as e:
            logger.error("Groq cloud completion failed", error=str(e))
            raise Exception(f"Cloud formatting failed: {str(e)}")
    
    async def _complete_openai(self, prompt: str) -> str:
        """
        Complete using OpenAI API (PAID)
        Fallback option if Groq is unavailable
        """
        try:
            from openai import AsyncOpenAI
            
            if not settings.OPENAI_API_KEY:
                raise ValueError("OPENAI_API_KEY is required")
            
            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            
            response = await client.chat.completions.create(
                model=settings.OPENAI_LLM_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert medical documentation assistant. Format clinical notes professionally and accurately."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=2000,
            )
            
            formatted_text = response.choices[0].message.content
            
            logger.info("OpenAI cloud completion successful")
            
            return formatted_text
            
        except Exception as e:
            logger.error("OpenAI cloud completion failed", error=str(e))
            raise Exception(f"Cloud formatting failed: {str(e)}")


# Singleton instance
llm_engine = LLMEngine()
