"use client";

import { Button } from "@tesku/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@tesku/ui/components/ui/card";
import { Input } from "@tesku/ui/components/ui/input";
import { Label } from "@tesku/ui/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginAction } from "../actions/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const res = await loginAction(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else if (res?.success) {
      // Redirect to dashboard
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <Card className="glass-card border-white/10 p-2 shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl mx-auto flex items-center justify-center mb-2">
              <span className="text-2xl font-bold gradient-text">T.</span>
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">Login Admin</CardTitle>
            <CardDescription className="text-muted-foreground">
              Masukkan kredensial Anda untuk masuk ke dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit}>
              <div className="space-y-4">
                {error && (
                  <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20 text-center">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="admin@tesku.id" 
                    required 
                    className="bg-background/50 focus:bg-background transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-sm font-medium text-primary hover:underline">
                      Lupa password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    required 
                    className="bg-background/50 focus:bg-background transition-colors"
                  />
                </div>
              </div>
              <div className="mt-8">
                <Button type="submit" disabled={loading} className="w-full font-medium" size="lg">
                  {loading ? "Memproses..." : "Masuk ke Dashboard"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-8">
          TesKu Admin Panel &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
