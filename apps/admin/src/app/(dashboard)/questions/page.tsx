import { Button } from "@tesku/ui/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@tesku/ui/components/ui/table";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";

async function getQuestions() {
  const cookieStore = await cookies();
  const token = cookieStore.get("tesku_admin_token")?.value;

  try {
    const res = await fetch("http://localhost:3001/questions?page=1&limit=50", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { data: [] };
    }
    return res.json();
  } catch (error) {
    return { data: [] };
  }
}

export default async function QuestionsPage() {
  const { data: questions } = await getQuestions();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bank Soal</h2>
          <p className="text-muted-foreground mt-1">Kelola semua soal untuk berbagai kategori tes.</p>
        </div>
        <Link href="/questions/create">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Tambah Soal
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-white/10 bg-card/50 backdrop-blur-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Kategori</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead className="w-1/2">Pertanyaan</TableHead>
              <TableHead className="text-center">Tingkat Kesulitan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions && questions.length > 0 ? (
              questions.map((q: any) => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                      {q.category.replace(/_/g, " ")}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{q.type.replace(/_/g, " ")}</TableCell>
                  <TableCell>
                    <div className="line-clamp-2">{q.prompt}</div>
                  </TableCell>
                  <TableCell className="text-center">{q.difficultyLevel}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  Belum ada soal. Silakan tambah soal baru.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
