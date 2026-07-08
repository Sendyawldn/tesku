"use server";

import { cookies } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(1, { message: "Password wajib diisi" }),
});

const registerSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export async function loginUser(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  try {
    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedFields.data),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Email atau password salah" };
    }

    if (data.user.role !== "USER") {
      return { error: "Akun ini tidak memiliki akses ke portal peserta" };
    }

    const cookieStore = await cookies();
    cookieStore.set("tesku_user_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true };
  } catch (error) {
    return { error: "Gagal terhubung ke server" };
  }
}

export async function registerUser(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedFields = registerSchema.safeParse({ name, email, password });

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  try {
    // 1. Register the user
    const res = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedFields.data),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Gagal mendaftar, email mungkin sudah digunakan" };
    }

    // 2. Automatically login after successful registration
    return await loginUser(formData);
  } catch (error) {
    return { error: "Gagal terhubung ke server" };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("tesku_user_token");
}
