# ALGORITMA SPACED REPETITION (SM-2)

Gunakan logika ini secara ketat di Backend saat menghitung jadwal review.

## Input
- `q` (Quality): 0-5 (0=Lupa, 5=Mudah Sekali)
- `I` (Interval): Hari sampai review berikutnya
- `EF` (Ease Factor): Tingkat kesulitan kartu (default 2.5)

## Rumus
1. Jika `q` < 3 (Salah/Lupa):
   - Interval Baru = 1 hari
   - EF Baru = EF Lama (Tidak berubah)
   - Streak = 0

2. Jika `q` >= 3 (Benar):
   - Jika Review Pertama: Interval = 1 hari
   - Jika Review Kedua: Interval = 6 hari
   - Jika Review > 2: Interval = Round(Interval Lama * EF Lama)
   
   - EF Baru = EF Lama + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
   - Batas Bawah EF: Jangan biarkan EF < 1.3
