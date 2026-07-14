from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any
from app.core.config import settings
from app.core.security import get_current_user
from app.models.domain.user import User
import groq
import json

router = APIRouter()

class FormatRequest(BaseModel):
    transcript: str
    template: str = "SOAP"

class FormatResponse(BaseModel):
    formatted_note: Dict[str, Any]

@router.post("/note", response_model=FormatResponse)
async def format_note(
    req: FormatRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Accept a transcript and a template, return a structured SOAP note.
    """
    try:
        client = groq.Groq(api_key=settings.GROQ_API_KEY)
        # Build prompt based on template
        prompt = f"""Convert the following clinical dictation into a structured {req.template} note.
        Use Subjective, Objective, Assessment, Plan format.
        Dictation: {req.transcript}
        Output only valid JSON with keys: subjective, objective, assessment, plan.
        Do not include any additional text outside the JSON.
        """
        response = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        try:
            note_data = json.loads(content)
        except json.JSONDecodeError:
            # Fallback: try to extract JSON from text
            import re
            match = re.search(r'\{.*\}', content, re.DOTALL)
            if match:
                note_data = json.loads(match.group())
            else:
                note_data = {"raw": content}
        return FormatResponse(formatted_note=note_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Groq API error: {str(e)}"
        )
