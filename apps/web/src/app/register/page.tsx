"use client";

import { Button } from "@tesku/ui/components/ui/button";
import { Input } from "@tesku/ui/components/ui/input";
import { Label } from "@tesku/ui/components/ui/label";
import Link from "next/link";
import { registerUser } from "../actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const res = await registerUser(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 text-2xl font-bold gradient-text tracking-tighter">
        TesKu.
      </Link>

      <div className="glass-card w-full max-w-md p-8 rounded-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Buat Akun Baru</h1>
          <p className="text-muted-foreground">Mulai ukur potensi diri Anda hari ini</p>
        </div>

        {error && (
          <div className="mb-6 p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md text-center">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input 
              id="name" 
              name="name"
              type="text" 
              placeholder="John Doe" 
              required 
              className="bg-background/50 h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              placeholder="nama@email.com" 
              required 
              className="bg-background/50 h-11"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input 
              id="password" 
              name="password"
              type="password" 
              placeholder="Min. 6 karakter" 
              required 
              minLength={6}
              className="bg-background/50 h-11"
            />
          </div>

          <Button type="submit" className="w-full h-12 mt-4 text-md" disabled={loading}>
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
