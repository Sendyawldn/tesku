import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, Settings, LogOut } from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Bank Soal', href: '/questions', icon: BookOpen },
  { name: 'Peserta', href: '/users', icon: Users },
  { name: 'Pengaturan', href: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="fixed hidden md:flex h-screen w-64 flex-col border-r bg-card/50 backdrop-blur-xl transition-all duration-300">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border/50">
        <span className="text-2xl font-bold gradient-text tracking-tighter">TesKu.</span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 px-4">
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Icon className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-border/50">
        <button className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-destructive rounded-lg hover:bg-destructive/10 transition-all">
          <LogOut className="mr-3 h-5 w-5" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
