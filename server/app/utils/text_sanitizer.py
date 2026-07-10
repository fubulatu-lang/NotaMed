"""
Text Sanitizer Utility
Cleans and validates clinical text output
"""
import re
from typing import List


def sanitize_clinical_text(text: str) -> str:
    """
    Sanitize clinical note text
    
    - Removes excessive whitespace
    - Normalizes line endings
    - Removes control characters
    - Ensures proper section spacing
    """
    if not text:
        return ""
    
    # Remove control characters except newlines
    text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', text)
    
    # Normalize line endings
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    
    # Remove excessive blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Strip whitespace
    text = text.strip()
    
    return text


def detect_phi(text: str) -> List[str]:
    """
    Basic PHI detection patterns
    Identifies potential Protected Health Information
    
    Returns list of detected PHI types
    """
    phi_found = []
    
    patterns = {
        "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
        "phone": r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
        "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
        "mrn": r'(?i)\bMRN[:\s]*\d+\b',
    }
    
    for phi_type, pattern in patterns.items():
        if re.search(pattern, text):
            phi_found.append(phi_type)
    
    return phi_found


def extract_medical_terms(text: str) -> List[str]:
    """
    Extract common medical terms from text
    Useful for confidence scoring
    """
    common_terms = [
        "diagnosis", "treatment", "medication", "symptoms",
        "examination", "patient", "history", "assessment",
        "hypertension", "diabetes", "infection", "chronic",
        "acute", "prescribed", "referral", "follow-up",
    ]
    
    found_terms = []
    text_lower = text.lower()
    
    for term in common_terms:
        if term in text_lower:
            found_terms.append(term)
    
    return found_terms
