import { apiClient } from './client';
import type { TranscriptionResult, FormattedNote, NoteTemplate } from '../../types';

class TranscriptionService {
  async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    return apiClient.uploadFile<TranscriptionResult>(
      '/transcribe/audio',
      audioBlob,
      'audio_file'
    );
  }

  async formatNote(
    transcript: string,
    template: NoteTemplate = 'soap'
  ): Promise<FormattedNote> {
    return apiClient.post<FormattedNote>('/format/note', {
      transcript,
      template_type: template,
      specialty: 'general',
    });
  }

  async getTemplates(): Promise<{ templates: Array<{ id: string; name: string; description: string; sections: string[] }> }> {
    return apiClient.get('/format/templates');
  }

  async processFullWorkflow(
    audioBlob: Blob,
    template: NoteTemplate = 'soap'
  ): Promise<{
    transcription: TranscriptionResult;
    formattedNote: FormattedNote;
  }> {
    const transcription = await this.transcribeAudio(audioBlob);
    const formattedNote = await this.formatNote(transcription.text, template);
    return { transcription, formattedNote };
  }
}

export const transcriptionService = new TranscriptionService();
