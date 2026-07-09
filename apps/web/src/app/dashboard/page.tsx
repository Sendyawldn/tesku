"use client";

import { Button } from "@tesku/ui/components/ui/button";
import { LogOut, Play, Clock, BrainCircuit, Activity } from "lucide-react";
import { logoutUser } from "../actions/auth";
import { startTestSession } from "../actions/test";
import { useState } from "react";

import { getMyTestHistory } from "../actions/history";
import { useEffect } from "react";

const testModules = [
  {
    id: "DEDUCTIVE_REASONING",
    name: "Penalaran Deduktif",
    desc: "Uji kemampuan Anda menarik kesimpulan logis dari premis yang ada.",
    icon: BrainCircuit,
    time: "15 Menit",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: "PERSONALITY",
    name: "Kepribadian",
    desc: "Pahami gaya kerja dan kecenderungan perilaku Anda secara profesional.",
    icon: Activity,
    time: "10 Menit",
    color: "from-purple-500/20 to-pink-500/20"
  }
];

export default function DashboardPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    async function loadHistory() {
      const data = await getMyTestHistory();
      setHistory(data);
    }
    loadHistory();
  }, []);

  async function handleLogout() {
    await logoutUser();
    window.location.href = "/login";
  }

  async function handleStartTest(category: string) {
    setLoadingId(category);
    await startTestSession(category);
    setLoadingId(null);
  }

  return (
    <div className="min-h-screen p-6 md:p-12 pb-24">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex justify-between items-center bg-card/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Dasbor Peserta</h1>
            <p className="text-muted-foreground mt-1">Pilih modul ujian untuk memulai evaluasi Anda.</p>
          </div>
          <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-2" />
            Keluar
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testModules.map((mod) => (
            <div key={mod.id} className={`glass-card p-6 rounded-2xl relative overflow-hidden group transition-all hover:scale-[1.02]`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10 space-y-4">
                <div className="bg-background/80 w-12 h-12 rounded-xl flex items-center justify-center border border-white/10">
                  <mod.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{mod.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{mod.desc}</p>
                </div>
                <div className="flex items-center text-sm font-medium text-muted-foreground bg-background/50 w-fit px-3 py-1.5 rounded-full border border-white/5">
                  <Clock className="h-4 w-4 mr-2" />
                  {mod.time}
                </div>
                <Button 
                  className="w-full mt-4" 
                  disabled={loadingId === mod.id}
                  onClick={() => handleStartTest(mod.id)}
                >
                  {loadingId === mod.id ? "Memulai..." : (
                    <>
                      <Play className="h-4 w-4 mr-2" /> Mulai Simulasi
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <h2 className="text-2xl font-bold mb-6">Riwayat Ujian Saya</h2>
          {history.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((session) => (
                <div key={session.id} className="glass-card p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{session.category.replace(/_/g, " ")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.startedAt).toLocaleDateString("id-ID", {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    {session.status === 'COMPLETED' ? (
                      <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
                        Skor: {session.totalScore ?? 0}
                      </div>
                    ) : (
                      <div className="inline-flex items-center rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-500 ring-1 ring-inset ring-yellow-500/20">
                        Belum Selesai
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-2xl border-white/20 text-muted-foreground">
              Anda belum memiliki riwayat ujian.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
