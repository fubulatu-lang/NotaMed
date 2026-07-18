"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { apiClient } from "@/lib/api-client";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface NoteDetail {
  id: string;
  status: string;
  transcript?: string;
  soap_note?: { subjective: string; objective: string; assessment: string; plan: string };
  created_at: string;
  updated_at: string;
  error_message?: string;
}

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [note, setNote] = useState<NoteDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const data = await apiClient.getNote(id);
        setNote(data);
      } catch (error: any) {
        toast.error("Note not found");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-white/60" />
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/dashboard")}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gradient">SOAP Note</h1>
        <p className="text-white/60 text-sm">
          Created {new Date(note.created_at).toLocaleString()}
        </p>
      </div>

      {note.status === "failed" && (
        <GlassCard variant="dark" className="border-red-500/50">
          <p className="text-red-400">Failed: {note.error_message}</p>
        </GlassCard>
      )}

      {note.status === "completed" && note.soap_note && (
        <div className="grid md:grid-cols-2 gap-4">
          <GlassCard>
            <h2 className="font-semibold text-white/80 mb-2">Transcript</h2>
            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
              {note.transcript || "No transcript"}
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-semibold text-white/80 mb-2">SOAP Summary</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-white/50 font-medium">S (Subjective):</span>
                <p className="text-white/70">{note.soap_note.subjective || "—"}</p>
              </div>
              <div>
                <span className="text-white/50 font-medium">O (Objective):</span>
                <p className="text-white/70">{note.soap_note.objective || "—"}</p>
              </div>
              <div>
                <span className="text-white/50 font-medium">A (Assessment):</span>
                <p className="text-white/70">{note.soap_note.assessment || "—"}</p>
              </div>
              <div>
                <span className="text-white/50 font-medium">P (Plan):</span>
                <p className="text-white/70">{note.soap_note.plan || "—"}</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
