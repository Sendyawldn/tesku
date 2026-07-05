import { Button } from "@tesku/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@tesku/ui/components/ui/card";
import { Input } from "@tesku/ui/components/ui/input";
import { Label } from "@tesku/ui/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
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
            <form>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
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
                    type="password" 
                    required 
                    className="bg-background/50 focus:bg-background transition-colors"
                  />
                </div>
              </div>
              <div className="mt-8">
                <Link href="/">
                  <Button className="w-full font-medium" size="lg">
                    Masuk ke Dashboard
                  </Button>
                </Link>
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
