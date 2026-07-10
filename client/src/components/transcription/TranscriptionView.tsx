import type { TranscriptionResult } from '../../types';

interface TranscriptionViewProps {
  transcription: TranscriptionResult;
  onEdit?: (text: string) => void;
}

export default function TranscriptionView({ transcription, onEdit }: TranscriptionViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-title-md">Raw Transcription</h3>
        <div className="flex items-center gap-2">
          <span className="text-label-sm text-on-surface-variant">
            Confidence:
          </span>
          <span className={`text-label-lg font-bold ${
            transcription.confidence > 0.9
              ? 'text-green-600'
              : transcription.confidence > 0.7
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}>
            {Math.round(transcription.confidence * 100)}%
          </span>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl p-4">
        <p className="text-body-lg whitespace-pre-wrap">
          {transcription.text}
        </p>
      </div>

      {transcription.medicalTerms && transcription.medicalTerms.length > 0 && (
        <div>
          <h4 className="text-label-lg mb-2">Detected Medical Terms</h4>
          <div className="flex flex-wrap gap-2">
            {transcription.medicalTerms.map((term) => (
              <span
                key={term}
                className="px-3 py-1 bg-primary-50 text-primary rounded-full text-label-sm"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      )}

      {onEdit && (
        <button
          onClick={() => onEdit(transcription.text)}
          className="btn-secondary w-full"
        >
          Edit Transcription
        </button>
      )}
    </div>
  );
}
