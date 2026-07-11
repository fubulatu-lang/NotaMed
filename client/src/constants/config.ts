export const APP_CONFIG = {
  name: 'MediVoice',
  version: '0.1.0',
  apiUrl: 'https://medivoice-api.vercel.app',
  apiPrefix: '/api/v1',
} as const;

export const RECORDING_CONFIG = {
  maxDuration: 300,
  mimeType: 'audio/webm',
  audioBitsPerSecond: 128000,
  channels: 1,
} as const;

export const NOTE_TEMPLATES = {
  soap: {
    name: 'SOAP Note',
    sections: ['Subjective', 'Objective', 'Assessment', 'Plan'],
    icon: '📋',
  },
  consultation: {
    name: 'Consultation Note',
    sections: ['Reason', 'History', 'Examination', 'Assessment', 'Recommendations'],
    icon: '🏥',
  },
  discharge: {
    name: 'Discharge Summary',
    sections: ['Admission', 'Course', 'Medications', 'Follow-up', 'Condition'],
    icon: '📝',
  },
  procedure: {
    name: 'Procedure Note',
    sections: ['Procedure', 'Indication', 'Technique', 'Findings', 'Complications'],
    icon: '🔬',
  },
} as const;

export const SESSION_CONFIG = {
  timeoutMinutes: 10,
  maxNotesPerSession: 5,
} as const;
