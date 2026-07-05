import { z } from "zod";

// Base Schema untuk Otentikasi
export const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
});

// Anda bisa mengekspor tipe untuk digunakan di frontend/backend
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
