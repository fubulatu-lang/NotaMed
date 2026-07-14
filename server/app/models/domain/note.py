from pydantic import BaseModel
from datetime import datetime
from typing import Any, Optional
from uuid import UUID

class NoteBase(BaseModel):
    transcript: str
    soap_note: Any  # JSON object
    template: str = "SOAP"

class NoteCreate(NoteBase):
    pass

class NoteResponse(NoteBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
