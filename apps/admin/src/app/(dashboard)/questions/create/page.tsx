"use client";

import { Button } from "@tesku/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@tesku/ui/components/ui/card";
import { Input } from "@tesku/ui/components/ui/input";
import { Label } from "@tesku/ui/components/ui/label";
import { Textarea } from "@tesku/ui/components/ui/textarea";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { submitQuestion } from "../../../actions/question";

export default function CreateQuestionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([
    { label: "", isCorrect: true },
    { label: "", isCorrect: false }
  ]);

  const addOption = () => {
    setOptions([...options, { label: "", isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const setCorrectOption = (index: number) => {
    setOptions(options.map((opt, i) => ({ ...opt, isCorrect: i === index })));
  };

  const updateOptionLabel = (index: number, label: string) => {
    setOptions(options.map((opt, i) => i === index ? { ...opt, label } : opt));
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    
    // Add options to formData as a JSON string
    formData.append("options", JSON.stringify(options));
    
    const res = await submitQuestion(formData);
    
    if (res?.success) {
      router.push("/questions");
      router.refresh();
    } else {
      setLoading(false);
      alert(res?.error || "Terjadi kesalahan saat menyimpan soal");
    }
  }

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div className="flex items-center gap-4">
        <Link href="/questions">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tambah Soal</h2>
          <p className="text-muted-foreground mt-1">Buat soal baru untuk dimasukkan ke bank soal.</p>
        </div>
      </div>

      <form action={handleSubmit}>
        <div className="grid gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori Tes</Label>
                  <select 
                    id="category"
                    name="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="DEDUCTIVE_REASONING">Deductive Reasoning</option>
                    <option value="READING_COMPREHENSION">Reading Comprehension</option>
                    <option value="QUANTITATIVE_REASONING">Quantitative Reasoning</option>
                    <option value="PERSONALITY">Personality</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipe Soal</Label>
                  <select 
                    id="type"
                    name="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="MULTIPLE_CHOICE">Pilihan Ganda (Teks)</option>
                    <option value="NUMERIC_INPUT">Input Numerik</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Pertanyaan / Instruksi</Label>
                <Textarea 
                  id="prompt" 
                  name="prompt"
                  required
                  placeholder="Tuliskan pertanyaan di sini..."
                  className="min-h-[120px] bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficultyLevel">Tingkat Kesulitan (1-5)</Label>
                <Input 
                  id="difficultyLevel" 
                  name="difficultyLevel"
                  type="number"
                  min={1}
                  max={5}
                  defaultValue={1}
                  className="bg-background/50 max-w-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Opsi Jawaban (Pilihan Ganda)</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addOption}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Opsi
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {options.map((option, index) => (
                <div key={index} className={`flex items-start gap-4 p-4 rounded-lg border ${option.isCorrect ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10'}`}>
                  <div className="pt-2">
                    <input 
                      type="radio" 
                      name="correctOption" 
                      checked={option.isCorrect}
                      onChange={() => setCorrectOption(index)}
                      className="w-4 h-4 text-primary bg-background border-border"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Teks Opsi {index + 1}</Label>
                    <Input 
                      value={option.label}
                      onChange={(e) => updateOptionLabel(index, e.target.value)}
                      placeholder={`Masukkan opsi ${index + 1}`}
                      className="bg-background/50"
                      required
                    />
                  </div>
                  {options.length > 2 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="mt-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/questions">
              <Button type="button" variant="ghost">Batal</Button>
            </Link>
            <Button type="submit" disabled={loading} size="lg">
              {loading ? "Menyimpan..." : "Simpan Soal"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
