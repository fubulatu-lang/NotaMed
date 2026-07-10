// Audio Types
export interface AudioRecording {
  blob: Blob;
  url: string;
  duration: number;
  size: number;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioLevel: number;
}

// Transcription Types
export interface TranscriptionResult {
  id: string;
  text: string;
  confidence: number;
  duration: number;
  segments?: TranscriptionSegment[];
  medicalTerms?: string[];
  timestamp: Date;
}

export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
  confidence: number;
}

// Note Types
export type NoteTemplate = 'soap' | 'consultation' | 'discharge' | 'procedure';

export interface FormattedNote {
  id: string;
  originalTranscript: string;
  formattedNote: string;
  template: NoteTemplate;
  confidence: number;
  processingTime: number;
  timestamp: Date;
  sections?: NoteSections;
}

export interface NoteSections {
  [key: string]: string;
}

// Auth Types
export interface User {
  id: number;
  email: string;
  fullName?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName?: string;
}

// API Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// App State
export interface AppState {
  currentNote: FormattedNote | null;
  notes: FormattedNote[];
  isRecording: boolean;
  isProcessing: boolean;
}
