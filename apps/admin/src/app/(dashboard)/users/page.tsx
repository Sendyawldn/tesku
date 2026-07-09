import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tesku/ui/components/ui/table";

async function getUsers() {
  const cookieStore = await cookies();
  const token = cookieStore.get("tesku_admin_token")?.value;

  if (!token) redirect("/login");

  const res = await fetch("http://localhost:3001/users", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Peserta</h1>
        <p className="text-muted-foreground">
          Kelola peserta ujian dan pantau hasil tes mereka.
        </p>
      </div>

      <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tanggal Daftar</TableHead>
              <TableHead>Total Ujian</TableHead>
              <TableHead>Skor Terakhir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => {
              const completedSessions = user.testSessions.filter((s: any) => s.status === 'COMPLETED');
              const lastScore = completedSessions.length > 0 ? completedSessions[0].totalScore : '-';
              
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>{completedSessions.length}</TableCell>
                  <TableCell>
                    {lastScore !== '-' ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
                        {lastScore} Poin
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Belum ada peserta yang mendaftar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
