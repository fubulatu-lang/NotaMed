"""
Clinical Note Prompt Templates
"""

SOAP_TEMPLATE = """You are a medical documentation expert. Convert the following clinical dictation into a professionally formatted SOAP note.

## Guidelines:
- **S (Subjective)**: Patient's reported symptoms, history, complaints, and concerns
- **O (Objective)**: Vital signs, physical exam findings, lab results, imaging
- **A (Assessment)**: Primary diagnosis, differential diagnoses, clinical impression
- **P (Plan)**: Treatment plan, medications, procedures, follow-up, patient education

## Style Rules:
- Use proper medical terminology and abbreviations
- Maintain professional, concise language
- Include all clinically relevant information from dictation
- Mark any unclear information as [Needs Clarification]
- Use bullet points for multiple items in Plan section
- Include medication names, dosages, and frequencies when specified

## Dictation:
{transcript}

## SOAP Note:
"""

CONSULTATION_TEMPLATE = """You are a medical documentation expert. Format this consultation dictation into a structured consultation note.

## Sections:
1. **Reason for Consultation**: Why the consult was requested
2. **History of Present Illness**: Detailed timeline and progression
3. **Review of Systems**: Systematic review findings
4. **Physical Examination**: Relevant exam findings
5. **Assessment**: Consultant's diagnosis and impression
6. **Recommendations**: Suggested treatment, tests, follow-up

## Dictation:
{transcript}

## Consultation Note:
"""

DISCHARGE_TEMPLATE = """You are a medical documentation expert. Create a discharge summary from this dictation.

## Required Elements:
- **Admission Date & Discharge Date**: If mentioned
- **Admitting Diagnosis**: Primary reason for admission
- **Discharge Diagnosis**: Final diagnoses
- **Hospital Course**: Brief summary of treatment
- **Discharge Medications**: Complete medication list
- **Follow-up Instructions**: Appointments, tests, precautions
- **Discharge Condition**: Patient status at discharge

## Dictation:
{transcript}

## Discharge Summary:
"""

PROCEDURE_TEMPLATE = """You are a medical documentation expert. Convert this procedure dictation into a formal procedure note.

## Structure:
- **Procedure**: Name and type
- **Indication**: Why procedure was performed
- **Consent**: Verification of informed consent
- **Technique**: Description of procedure steps
- **Findings**: Results and observations
- **Complications**: Any adverse events
- **Disposition**: Post-procedure status and plan

## Dictation:
{transcript}

## Procedure Note:
"""


def get_template(template_type: str) -> str:
    """Get prompt template by type"""
    templates = {
        "soap": SOAP_TEMPLATE,
        "consultation": CONSULTATION_TEMPLATE,
        "discharge": DISCHARGE_TEMPLATE,
        "procedure": PROCEDURE_TEMPLATE,
    }
    return templates.get(template_type, SOAP_TEMPLATE)
