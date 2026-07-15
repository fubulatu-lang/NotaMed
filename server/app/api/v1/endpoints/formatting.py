from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any
from app.core.config import settings
import groq
import json
import re

router = APIRouter()

class FormatRequest(BaseModel):
    transcript: str
    template: str = "SOAP"

class FormatResponse(BaseModel):
    formatted_note: Dict[str, Any]

@router.post("/note", response_model=FormatResponse)
async def format_note(req: FormatRequest):
    """
    Accept a transcript and return a structured SOAP note.
    No authentication required.
    """
    try:
        client = groq.Groq(api_key=settings.GROQ_API_KEY)
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