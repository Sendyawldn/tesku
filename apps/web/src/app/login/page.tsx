"use client";

import { Button } from "@tesku/ui/components/ui/button";
import { Input } from "@tesku/ui/components/ui/input";
import { Label } from "@tesku/ui/components/ui/label";
import Link from "next/link";
import { loginUser } from "../actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const res = await loginUser(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Aesthetic background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 text-2xl font-bold gradient-text tracking-tighter">
        TesKu.
      </Link>

      <div className="glass-card w-full max-w-md p-8 rounded-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Selamat Datang Kembali</h1>
          <p className="text-muted-foreground">Masuk untuk melanjutkan sesi tes Anda</p>
        </div>

        {error && (
          <div className="mb-6 p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md text-center">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              placeholder="nama@email.com" 
              required 
              className="bg-background/50 h-12"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Kata Sandi</Label>
              <Link href="#" className="text-xs text-primary hover:underline">
                Lupa sandi?
              </Link>
            </div>
            <Input 
              id="password" 
              name="password"
              type="password" 
              placeholder="••••••••" 
              required 
              className="bg-background/50 h-12"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-md" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
