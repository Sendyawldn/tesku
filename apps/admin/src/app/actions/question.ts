"use server";

import { cookies } from "next/headers";

export async function submitQuestion(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("tesku_admin_token")?.value;

  if (!token) {
    return { error: "Anda tidak memiliki akses (Sesi kedaluwarsa)." };
  }

  const category = formData.get("category")?.toString();
  const type = formData.get("type")?.toString();
  const prompt = formData.get("prompt")?.toString();
  const difficultyLevel = parseInt(formData.get("difficultyLevel")?.toString() || "1", 10);
  
  let options = [];
  try {
    const optionsStr = formData.get("options")?.toString();
    if (optionsStr) {
      options = JSON.parse(optionsStr);
    }
  } catch (e) {
    console.error("Gagal parse opsi:", e);
  }

  if (!category || !type || !prompt) {
    return { error: "Semua kolom utama (Kategori, Tipe, Prompt) wajib diisi." };
  }

  try {
    const res = await fetch("http://localhost:3001/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category,
        type,
        prompt,
        difficultyLevel,
        options,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.message || "Gagal menyimpan soal." };
    }

    return { success: true };
  } catch (error) {
    console.error("Create question error:", error);
    return { error: "Gagal terhubung ke server API." };
  }
}
