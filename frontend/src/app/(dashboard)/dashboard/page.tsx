"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api-client";
import { formatDistanceToNow } from "date-fns";
import { Mic, FileText, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  status: string;
  transcript?: string;
  soap_note?: { subjective: string; objective: string; assessment: string; plan: string };
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pollTaskId = searchParams.get("poll");

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      const data = await apiClient.listNotes(1, 50);
      setNotes(data.tasks);
    } catch (error: any) {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Poll for a specific task if just uploaded
  useEffect(() => {
    if (pollTaskId) {
      const interval = setInterval(async () => {
        try {
          const task = await apiClient.getNote(pollTaskId);
          if (task.status === "completed" || task.status === "failed") {
            clearInterval(interval);
            fetchNotes();
            router.replace("/dashboard");
            if (task.status === "completed") {
              toast.success("Transcription completed!");
            } else {
              toast.error("Transcription failed: " + task.error_message);
            }
          }
        } catch (e) {
          // ignore
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [pollTaskId, router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    setDeleting(id);
    try {
      await apiClient.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      toast.success("Note deleted");
    } catch (error: any) {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient">My Notes</h1>
          <p className="text-white/60">All your dictations and SOAP notes</p>
        </div>
        <Link href="/record">
          <Button variant="primary" size="lg" className="gap-2">
            <Mic className="h-5 w-5" /> New Recording
          </Button>
        </Link>
      </div>

      {notes.length === 0 ? (
        <GlassCard className="text-center py-16">
          <FileText className="h-12 w-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/60 text-lg">No notes yet</p>
          <p className="text-white/40 text-sm">Start by recording your first dictation</p>
        </GlassCard>
      ) : (
        <div className="grid gap-4">
          {notes.map((note) => (
            <Link key={note.id} href={`/note/${note.id}`}>
              <GlassCard className="hover:bg-white/15 transition-colors cursor-pointer flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        note.status === "completed"
                          ? "bg-green-400"
                          : note.status === "failed"
                          ? "bg-red-400"
                          : "bg-yellow-400 animate-pulse"
                      }`}
                    />
                    <span className="text-sm text-white/60">
                      {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-white truncate mt-1">
                    {note.transcript
                      ? note.transcript.slice(0, 80) + "..."
                      : "Processing..."}
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  {note.status === "completed" && (
                    <span className="text-xs text-white/40 bg-white/10 px-2 py-1 rounded-full">
                      SOAP ready
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(note.id);
                    }}
                    disabled={deleting === note.id}
                    className="text-white/40 hover:text-red-400 transition-colors p-2"
                  >
                    {deleting === note.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
