import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FormattedNote } from '../../types';
import { HiDocumentText, HiClock, HiTrash } from 'react-icons/hi';

// Mock data for MVP - will be replaced with actual state management
const mockNotes: FormattedNote[] = [];

export default function SessionHistory() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<FormattedNote[]>(mockNotes);

  const clearHistory = () => {
    setNotes([]);
  };

  if (notes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-headline-sm">Session History</h2>
        </div>
        
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-title-lg mb-2">No Notes Yet</h3>
          <p className="text-body-md text-on-surface-variant mb-6">
            Your session notes will appear here. Notes are cleared when you sign out.
          </p>
          <button
            onClick={() => navigate('/record')}
            className="btn-primary"
          >
            Start Recording
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-sm">Session History</h2>
        <button
          onClick={clearHistory}
          className="btn-secondary text-error flex items-center gap-2"
        >
          <HiTrash className="w-5 h-5" />
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="card hover:shadow-elevation-3 transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <HiDocumentText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-title-md">
                    {note.template.toUpperCase()} Note
                  </h3>
                  <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                    <HiClock className="w-4 h-4" />
                    <span>{new Date(note.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              <span className="text-label-sm text-primary bg-primary-50 px-3 py-1 rounded-full">
                {Math.round(note.confidence * 100)}% confidence
              </span>
            </div>

            <p className="text-body-md text-on-surface-variant line-clamp-3 mb-4">
              {note.formattedNote.substring(0, 150)}...
            </p>

            <button
              onClick={() => navigate('/record')}
              className="btn-secondary w-full"
            >
              View Note
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
