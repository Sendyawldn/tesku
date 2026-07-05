<div align="center">

# ✨ TesKu Platform 

**Platform Latihan Psikotes Online Interaktif & Terintegrasi**

[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/repo)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

---

## 🎯 Tentang TesKu
**TesKu** adalah platform latihan psikotes online mutakhir yang membantu pengguna dalam mempersiapkan tes seleksi kerja (korporat, CPNS, dsb). Dilengkapi timer real-time, analitik canggih, dan skema bank soal dinamis.

---

## 🏗 Arsitektur Monorepo
Proyek ini dibangun di atas infrastruktur monorepo modern menggunakan **Turborepo** dan **pnpm workspaces** untuk memaksimalkan penggunaan ulang kode (*code reusability*) secara efisien antara frontend dan backend.

```text
📦 tesku
 ┣ 📂 apps
 ┃ ┣ 📜 api       (NestJS - Backend API)
 ┃ ┣ 📜 web       (Next.js - Portal Peserta)
 ┃ ┗ 📜 admin     (Next.js - Dashboard Admin)
 ┣ 📂 packages
 ┃ ┣ 📜 database  (Prisma Schema & Client)
 ┃ ┣ 📜 schemas   (Zod Validation Types)
 ┃ ┣ 📜 ui        (Shadcn UI & React Components)
 ┃ ┗ 📜 config    (ESLint, TSConfig, Tailwind)
 ┗ 🐳 docker-compose.yml
```

---

## 🚀 Memulai (Getting Started)

Langkah mudah untuk menjalankan seluruh ekosistem aplikasi di lingkungan lokal Anda.

### 1. Persiapan Awal
Pastikan Anda telah menginstal `Node.js (v18+)`, `pnpm (v9+)`, dan `Docker`.

```bash
# Instal semua dependensi workspace
pnpm install
```

### 2. Jalankan Database Lokal (Docker)
Menyalakan *container* PostgreSQL & Redis di latar belakang.
```bash
docker compose up -d
```

### 3. Migrasi Prisma & Generate Klien
Menyingkronkan skema basis data ke PostgreSQL dan membangun klien database.
```bash
pnpm --filter @tesku/database generate
pnpm --filter @tesku/database run push
```

### 4. Mulai Development Server
Menjalankan seluruh aplikasi (Web, Admin, API) secara paralel berkat kecepatan Turborepo.
```bash
pnpm dev
```

---

## 🎨 Fitur Utama
- **⏱ Timer Server-Side**: Mencegah kecurangan manipulasi waktu (sinkronasi Redis).
- **📊 Real-Time Analytics**: Visualisasi grafik hasil tes per kategori (Recharts).
- **🛡 Type-Safety End-to-End**: Mulai dari Prisma Client, API (NestJS), hingga validasi UI (Zod & React Hook Form).
- **👥 Role Based Access Control**: Pembagian terstruktur untuk `ADMIN` dan `USER`.

---

<div align="center">
<i>Dibangun dengan ❤️ untuk masa depan rekrutmen yang lebih cerdas.</i>
</div>
