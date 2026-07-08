import { Button } from "@tesku/ui/components/ui/button";
import { LogOut } from "lucide-react";
import { logoutUser } from "../actions/auth";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  async function handleLogout() {
    "use server";
    await logoutUser();
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center h-[80vh] space-y-8 text-center">
        <h1 className="text-4xl font-bold gradient-text">Dasbor Peserta</h1>
        <p className="text-xl text-muted-foreground">
          Selamat datang! Modul ujian dan hasil analisis Anda akan segera tersedia di sini.
        </p>
        
        <form action={handleLogout}>
          <Button variant="destructive" size="lg" className="gap-2">
            <LogOut className="h-5 w-5" />
            Keluar
          </Button>
        </form>
      </div>
    </div>
  );
}
