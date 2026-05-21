"use client";

import { useMemo, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Topbar } from "@/components/layout/topbar";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { getToken } from "@/lib/auth";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const chunkSize = 5 * 1024 * 1024;
  const { push } = useToast();

  const totalChunks = useMemo(() => {
    if (!file) return 0;
    return Math.ceil(file.size / chunkSize);
  }, [file]);

  async function uploadChunk(
    uploadId: number,
    chunkIndex: number,
    chunk: Blob,
    token?: string | null
  ) {
    const formData = new FormData();
    formData.append("upload_id", String(uploadId));
    formData.append("chunk_index", String(chunkIndex));
    formData.append("total_chunks", String(totalChunks));
    formData.append("file", chunk);
    await apiRequest("/upload/chunk", { method: "POST", body: formData }, token);
  }

  async function handleUpload() {
    if (!file) return;
    setStatus(null);
    const token = getToken();
    try {
      const init = await apiRequest<{ upload_id: number }>(
        "/upload/init",
        {
          method: "POST",
          body: JSON.stringify({
            filename: file.name,
            total_size: file.size,
            total_chunks: totalChunks,
          }),
        },
        token
      );

      for (let i = 0; i < totalChunks; i += 1) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        await uploadChunk(init.upload_id, i, chunk, token);
        const percent = Math.round(((i + 1) / totalChunks) * 100);
        setProgress(percent);
      }

      await apiRequest(
        "/upload/complete",
        {
          method: "POST",
          body: new URLSearchParams({
            upload_id: String(init.upload_id),
            total_chunks: String(totalChunks),
          }),
        },
        token
      );
      setProgress(100);
      setStatus("Upload completo. Analise em andamento.");
      push({ title: "Upload finalizado", description: "Analise iniciada." });
    } catch (err) {
      setStatus("Falha no upload.");
      setProgress(0);
      push({ title: "Falha no upload", description: "Tente novamente." });
    }
  }

  return (
    <DashboardShell current="/upload">
      <Topbar title="Upload" />
      <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="flex flex-col items-center justify-center border-dashed border-white/20 p-10 text-center">
          <UploadCloud className="h-12 w-12 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Arraste seu video aqui</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            MP4, MOV, AVI, MKV ate 500MB
          </p>
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska"
            className="mt-6 w-full text-sm"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
          <Button className="mt-6" onClick={handleUpload}>
            Iniciar analise
          </Button>
        </Card>

        <Card>
          <div className="text-sm text-muted-foreground">Progresso</div>
          <div className="mt-4">
            <Progress value={progress} />
            <div className="mt-2 text-xs text-muted-foreground">
              {progress}% concluido
            </div>
          </div>
          {file && (
            <div className="mt-6 text-sm">
              <div className="font-semibold">{file.name}</div>
              <div className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(1)} MB
              </div>
            </div>
          )}
          {status && <div className="mt-4 text-sm text-primary">{status}</div>}
        </Card>
      </section>
    </DashboardShell>
  );
}
