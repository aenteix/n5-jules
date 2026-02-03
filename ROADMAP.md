# JAPANESE LEARNING RPG - MASTER ROADMAP

## 🛠 Tech Stack
- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS + Lucide React (Icons)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Animation:** Framer Motion
- **Japanese Lib:** `wanakana` (Romaji -> Kana converter)
- **State:** Zustand

## 🟢 FASE 0: INITIALIZATION (System Boot)
**Goal:** Setup Framework & Clean Install.
1. `npx create-next-app@latest . --typescript --tailwind --eslint`
2. Konfigurasi `jsconfig.json` atau `tsconfig.json` untuk path alias `@/*`.
3. Hapus default CSS Next.js, buat Landing Page sederhana "Status: System Ready".
4. Pastikan `npm run dev` berjalan tanpa error di port 3000.

## 🟢 FASE 1: DATABASE & SCHEMA (The Brain)
**Goal:** Struktur Data & Seeding.
1. Setup Prisma Client.
2. Schema Models:
   - `User`: id, email, xp, level, currentStreak.
   - `Vocabulary`: id, kanji, kana, romaji, meaning, jlpt_level (N5-N1).
   - `StudyProgress`: id, userId, vocabId, nextReviewDate, interval, easeFactor, streak.
3. Seed Script: Masukkan 50 kata dasar JLPT N5 ke database.

## 🟢 FASE 2: CORE GAMEPLAY (The Mechanics)
**Goal:** Flashcard & SRS Logic.
1. Backend: API Route untuk mengambil kartu yang `nextReviewDate <= Today`.
2. Backend: API Route untuk submit jawaban (hitung interval baru pakai algoritma SM-2).
3. Frontend: Komponen `Flashcard` (Flip animation).
4. Frontend: Input field dengan `wanakana` (Auto-convert Romaji ke Kana).

## 🟡 FASE 3: GAMIFICATION (The Fun)
**Goal:** XP & Leveling.
1. Tambah logika: Jawaban benar = +10 XP.
2. Tambah logika: Cek Level Up setiap kali XP bertambah.
3. UI: Tampilkan Progress Bar XP dan Badge Level di Header.
