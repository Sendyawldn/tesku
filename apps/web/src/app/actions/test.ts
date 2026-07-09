"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function getAuthHeaders(token: string | undefined) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function startTestSession(category: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("tesku_user_token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const res = await fetch("http://localhost:3001/sessions/start", {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ category, durationMinutes: 15 }),
      cache: "no-store",
    });

    const data = await res.json();
    if (res.ok && data.id) {
      redirect(`/dashboard/test/${data.id}`);
    }
    
    return { error: data.message || "Gagal memulai tes" };
  } catch (error) {
    // If redirect throws, let it pass
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    return { error: "Terjadi kesalahan pada server" };
  }
}

export async function submitTestAnswers(sessionId: number, answers: any[], isFinalSubmit: boolean = false) {
  const cookieStore = await cookies();
  const token = cookieStore.get("tesku_user_token")?.value;

  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`http://localhost:3001/sessions/${sessionId}/submit`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ answers, isFinalSubmit }),
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) {
      return { error: data.message || "Gagal menyimpan jawaban" };
    }

    if (isFinalSubmit) {
      redirect("/dashboard");
    }

    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error; // Let Next.js handle redirect
    }
    return { error: "Terjadi kesalahan" };
  }
}
