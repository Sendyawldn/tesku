"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@tesku/ui/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Clock } from "lucide-react";
import { submitTestAnswers } from "../../../actions/test";
import { useRouter } from "next/navigation";

// Utility hook for Countdown
function useCountdown(expiresAt: string) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const end = new Date(expiresAt).getTime();
    
    const tick = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(diff);
      if (diff === 0) clearInterval(timer);
    };
    
    tick(); // initial call
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return { minutes, seconds, isTimeUp: timeLeft === 0 };
}

export default function TestSimulationPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const sessionId = parseInt(params.sessionId, 10);
  const [sessionData, setSessionData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // questionId -> optionId
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch test data directly using API (client-side approach for real-time app)
    const fetchQuestions = async () => {
      const cookieMatches = document.cookie.match(/tesku_user_token=([^;]+)/);
      const token = cookieMatches ? cookieMatches[1] : null;

      const res = await fetch(`http://localhost:3001/sessions/${sessionId}/questions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSessionData(data.session);
        setQuestions(data.questions);
        
        // Restore answers if resuming
        const restoredAnswers: Record<number, number> = {};
        data.answers.forEach((ans: any) => {
          if (ans.selectedOptionId) restoredAnswers[ans.questionId] = ans.selectedOptionId;
        });
        setAnswers(restoredAnswers);
      } else {
        router.push("/dashboard");
      }
    };
    fetchQuestions();
  }, [sessionId, router]);

  const { minutes, seconds, isTimeUp } = useCountdown(sessionData?.expiresAt || new Date().toISOString());

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    const answersArray = Object.entries(answers).map(([qId, oId]) => ({
      questionId: parseInt(qId, 10),
      selectedOptionId: oId,
    }));
    await submitTestAnswers(sessionId, answersArray, true);
    // Redirection happens in Server Action
  };

  // Auto-submit when time is up
  useEffect(() => {
    if (isTimeUp && sessionData && sessionData.status === 'IN_PROGRESS') {
      handleFinalSubmit();
    }
  }, [isTimeUp, sessionData]);

  const handleSelectOption = async (questionId: number, optionId: number) => {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);

    // Auto-save
    await submitTestAnswers(sessionId, [{ questionId, selectedOptionId: optionId }], false);
  };

  if (!sessionData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const progress = ((currentIndex + 1) / totalQ) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-md fixed top-0 w-full z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="font-semibold text-lg hidden sm:block">{sessionData.category.replace(/_/g, " ")}</div>
          <div className="h-4 w-[1px] bg-border hidden sm:block" />
          <div className="text-muted-foreground text-sm">
            Soal {currentIndex + 1} dari {totalQ}
          </div>
        </div>
        
        {/* Timer */}
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono font-medium ${parseInt(minutes) < 3 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
          <Clock className="h-4 w-4" />
          {minutes}:{seconds}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-16 left-0 w-full h-1 bg-secondary z-50">
        <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <main className="flex-1 flex justify-center pt-24 pb-32 px-4">
        <div className="w-full max-w-3xl space-y-8">
          
          {/* Question Display */}
          {currentQ ? (
            <div className="glass-card p-6 md:p-10 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
                {currentQ.prompt}
              </h2>
              
              <div className="space-y-3">
                {currentQ.options.map((opt: any) => {
                  const isSelected = answers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQ.id, opt.id)}
                      className={`w-full flex items-center p-4 rounded-xl border text-left transition-all ${
                        isSelected 
                          ? "border-primary bg-primary/10 ring-1 ring-primary/50" 
                          : "border-white/10 bg-background/50 hover:border-white/30 hover:bg-white/5"
                      }`}
                    >
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full border mr-4 flex items-center justify-center ${
                        isSelected ? "border-primary" : "border-muted-foreground"
                      }`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <span className="text-base">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
             <div className="text-center text-muted-foreground py-20">Tidak ada soal tersedia.</div>
          )}

        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 w-full border-t border-border/50 bg-card/80 backdrop-blur-md p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button 
            variant="outline" 
            size="lg"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </Button>

          <div className="flex gap-2">
            {currentIndex < totalQ - 1 ? (
              <Button size="lg" onClick={() => setCurrentIndex(prev => prev + 1)}>
                <span className="hidden sm:inline">Selanjutnya</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant="default"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={submitting}
                onClick={handleFinalSubmit}
              >
                {submitting ? "Memproses..." : (
                  <>
                    Selesai & Kumpulkan <CheckCircle className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
