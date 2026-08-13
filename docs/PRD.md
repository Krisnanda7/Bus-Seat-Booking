Kamu adalah Product Manager berpengalaman di industri transportasi/travel-tech.
Buatkan PRD (Product Requirements Document) lengkap untuk fitur "Bus Seat Booking"
di dalam aplikasi React Native, berdasarkan spesifikasi berikut:

KONTEKS

- Ini adalah aplikasi mobile untuk memilih dan memesan kursi bus.
- Tidak ada backend — semua data disimpan lokal (AsyncStorage / WatermelonDB).
- Target: bisa dinilai reviewer teknis (technical test intern React Native).

CORE FEATURES

1. Radio button pilih tipe bus di bagian atas:
   - Regular Class: 20 kursi, 10 kiri + 10 kanan, layout grid 1:1 (persegi)
   - Express Class: 12 kursi, 6 kiri + 6 kanan, layout grid 2:1 (persegi panjang)
2. Saat tipe bus dipilih, grid kursi berubah dinamis sesuai layout di atas.
3. User bisa tap kursi untuk select/unselect, dengan highlight visual yang jelas.
4. Total harga live berdasarkan pilihan kursi:
   - Regular, kolom pertama/terakhir (dekat jendela) = Rp150.000/kursi
   - Regular, kolom lain = Rp100.000/kursi
   - Express, kolom pertama/terakhir (dekat jendela) = Rp200.000/kursi
   - Express, kolom lain = Rp150.000/kursi
5. Maksimum 5 kursi bisa dipilih dalam satu transaksi.
6. Tombol "Confirm Booking" → kursi terpilih jadi permanently unavailable (disabled).
7. Data booking disimpan lokal, tidak perlu backend.
8. Aturan reset kursi: ketersediaan kursi reset otomatis HANYA ketika SEMUA kursi
   pada tipe bus tersebut sudah fully booked (reset per tipe bus, independen
   antara Regular dan Express).

BONUS FEATURES (opsional tapi nilai plus)

- Date picker di layar pilih kursi (bottomsheet/dialog/dropdown), wajib dipilih
  dulu sebelum bisa pilih kursi & confirm. Status booked kursi terikat ke
  tanggal tersebut, reset hanya saat semua kursi di tanggal itu fully booked.
- Layar simple sales history: daftar kursi yang dibooking, tanggal keberangkatan,
  total revenue.
- Date filter di sales history (button + pop up dialog) untuk filter history
  berdasarkan tanggal.

ATURAN TEKNIS

- React Native murni (bukan Flutter/native lain).
- Manfaatkan React Native lifecycle secara eksplisit (useEffect, dsb).
- Tanpa backend, data lokal saja.
- UI harus ramah pengguna (friendly, jelas, tidak membingungkan).

TUGAS KAMU:
Susun PRD dengan struktur berikut, tulis dengan bahasa yang jelas dan actionable:

1. Overview & Tujuan Produk
2. Target User & Use Case singkat
3. User Flow (langkah demi langkah dari buka app sampai booking selesai,
   termasuk flow bonus date picker)
4. Functional Requirements (breakdown semua poin di atas jadi requirement
   bernomor, termasuk bonus, ditandai [Required] / [Optional])
5. Business Rules & Edge Cases (termasuk edge case: user pilih kursi lebih dari
   5, ganti tipe bus saat sudah ada kursi terpilih, reset kursi, kursi yang
   sudah booked di-tap lagi, ganti tanggal setelah pilih kursi, dll)
6. Data Model (struktur data lokal: bus type, seat, booking, sales history)
7. Non-Functional Requirements (performance, penyimpanan lokal, UX friendliness)
8. Out of Scope
9. Acceptance Criteria per fitur (checklist yang bisa dicek reviewer)

Format output dalam Markdown dengan heading rapi, siap dipakai sebagai dokumen
kerja sebelum development dimulai.
