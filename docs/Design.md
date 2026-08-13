# Design System & Project Brief: TrekBus Mobile App

## 1. Project Overview & Identity

TrekBus adalah aplikasi mobile (React Native) untuk pemesanan tiket bus Jakarta-Bandung. Desain harus mengikuti estetika profesional, bersih, dan konsisten menggunakan sistem "TrekBus Core".

- **Font Utama**: `Manrope` (Clean, modern sans-serif)
- **Komponen UI**: Wajib menggunakan sudut melengkung `border-radius: 8px` (Round 8) untuk semua kartu, tombol, dan input.
- **Batasan Teknis**: Layout berbasis Flexbox, resolusi Mobile Portrait, dan maksimal pemilihan adalah 5 kursi per pemesanan.

## 2. Palet Warna Resmi (Color Palette)

Gunakan kode HEX spesifik ini di seluruh aplikasi:

- **Primary Color**: `#14213D` (Grounded Navy - Warna utama aplikasi)
- **Secondary Color**: `#E94560` (Coral Red - Digunakan untuk tombol aktif/utama seperti "Confirm Booking")
- **Tertiary Color**: `#0F3460` (Muted Blue - Untuk elemen sekunder)
- **Neutral Color**: `#6C757D` (Gray - Untuk teks sekunder, ikon tidak aktif, atau garis pembatas)

## 3. Komponen Navigasi & Struktur Halaman

- **Top App Bar**: Berukuran kecil dengan branding di kiri/tengah dan tombol aksi di kanan.
- **Bottom Navigation Bar**: Menggunakan Label + Ikon untuk menu utama: `Search`, `Trips`, `Tickets`, dan `Profile`.

## 4. Aturan Fitur & Alur Kursi (Seat Selection States)

AI harus mengikuti 3 kondisi layar pemilihan kursi ini:

1. **Locked State (Sebelum Pilih Tanggal):**Tombol "Confirm Booking" mati (disabled). Grid kursi 20 slot buram/placeholder. Muncul pesan "Pilih tanggal keberangkatan untuk melihat kursi".
2. **Regular Bus Selection (20 Kursi):** Grid 5x4 (A1-D5). Kursi jendela (Window) Rp 150.000, kursi koridor (Aisle) Rp 100.000. Wajib ada "Seat Legend" (Available, Selected, Occupied).
3. **Express Bus Selection:** Jumlah kursi lebih sedikit, konfigurasi premium, namun warna dan kontrol tetap konsisten dengan Regular Bus.
