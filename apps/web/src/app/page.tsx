import Link from "next/link";
import { Button } from "@tesku/ui/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 h-16 flex items-center justify-between border-b border-border/50 bg-background/50 backdrop-blur-xl fixed w-full z-50">
        <div className="text-2xl font-bold gradient-text tracking-tighter">TesKu.</div>
        <nav className="flex gap-4 items-center">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Masuk
          </Link>
          <Link href="/register">
            <Button size="sm">Daftar Sekarang</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-16">
        <div className="max-w-4xl w-full text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Ukur Potensi Anda Secara <span className="gradient-text">Akurat</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Platform simulasi psikotes terdepan dengan laporan analisis kompetensi yang mendalam dan *real-time*.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full">
                Mulai Tes Gratis
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full">
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid Mockup */}
        <div id="features" className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 mb-16">
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">1</div>
            <h3 className="text-xl font-bold">Lengkap & Beragam</h3>
            <p className="text-muted-foreground">Dari tes kognitif, figural, hingga tes kepribadian lengkap.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl space-y-4 border-primary/20">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">2</div>
            <h3 className="text-xl font-bold">Simulasi Nyata</h3>
            <p className="text-muted-foreground">Lingkungan tes yang dirancang menyerupai standar industri rekrutmen.</p>
          </div>
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">3</div>
            <h3 className="text-xl font-bold">Analisis Pintar</h3>
            <p className="text-muted-foreground">Dapatkan wawasan mendalam mengenai kekuatan dan kelemahan Anda seketika.</p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center border-t border-border/50 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} TesKu. Seluruh hak cipta dilindungi.
      </footer>
    </div>
  );
}
