# Design System & Project Brief: TrekBus Mobile App

## 1. Gambaran Umum & Identitas Produk

TrekBus adalah aplikasi mobile berbasis React Native yang dirancang untuk pemesanan tiket bus dengan pendekatan yang profesional, bersih, dan konsisten. Sistem desain ini berfungsi sebagai panduan utama dalam membangun antarmuka agar tetap koheren, mudah dibaca, dan ramah pengguna.

- Jenis font utama: Manrope, yaitu font sans-serif modern yang bersih dan mudah dibaca.
- Komponen UI: Menggunakan sudut membulat yang konsisten dengan radius 8px untuk kartu, tombol, dan input.
- Batasan teknis: Layout berbasis Flexbox, orientasi portrait untuk perangkat mobile, dan batas maksimal pemilihan kursi adalah 5 kursi per transaksi.

## 2. Palet Warna Resmi

Semua komponen UI harus mengikuti kode warna berikut secara konsisten:

- Primary Color: #14213D (Grounded Navy)
- Secondary Color: #E94560 (Coral Red)
- Tertiary Color: #0F3460 (Muted Blue)
- Neutral Color: #6C757D (Gray)

### Fungsi Warna
- Primary Color digunakan sebagai warna utama aplikasi dan elemen branding.
- Secondary Color digunakan untuk status aktif, tombol prioritas, dan indikator yang memerlukan perhatian.
- Tertiary Color digunakan untuk elemen sekunder yang tetap terlihat jelas namun tidak lebih dominan daripada primary.
- Neutral Color digunakan untuk teks sekunder, ikon non-aktif, dan pembatas visual.

## 3. Struktur Navigasi & Tata Letak Halaman

- Top App Bar harus berukuran ringkas dengan branding di sisi kiri atau tengah serta tombol aksi di sisi kanan.
- Bottom Navigation Bar, bila digunakan, dapat terdiri dari label dan ikon sebagai navigasi utama seperti Search, Trips, Tickets, dan Profile.

## 4. Aturan Fitur & Alur Kursi

### 4.1 Keadaan Locked
Sebelum tanggal keberangkatan dipilih, layar harus berada dalam keadaan locked. Pada kondisi ini:
- Tombol Confirm Booking tidak aktif.
- Grid kursi tampak redup atau berbentuk placeholder.
- Muncul pesan: “Pilih tanggal keberangkatan untuk melihat kursi”.

### 4.2 Regular Bus Selection
- Tipe bus Regular memiliki total 20 kursi.
- Layout kursi berbentuk 5x4.
- Kursi dekat jendela (kolom pertama dan terakhir) dihargai Rp150.000 per kursi.
- Kursi lainnya dihargai Rp100.000 per kursi.
- Wajib tersedia komponen legenda kursi: Available, Selected, Occupied.

### 4.3 Express Bus Selection
- Tipe bus Express memiliki total 12 kursi.
- Layout kursi menggunakan konfigurasi premium dengan proporsi yang konsisten.
- Kursi dekat jendela (kolom pertama dan terakhir) dihargai Rp200.000 per kursi.
- Kursi lainnya dihargai Rp150.000 per kursi.
- Warna dan kontrol interaksi harus konsisten dengan Regular Bus.

## 5. Prinsip Desain dan Konsistensi UI

1. Seluruh antarmuka harus mengikuti sistem desain yang rapi dan konsisten.
2. Semua elemen utama seperti kartu, tombol, dan input harus memiliki sudut membulat yang seragam.
3. Ukuran elemen, jarak vertikal, dan spasi internal harus dibuat secara terukur agar tampilan lebih stabil dan profesional.
4. Visual state kursi harus mudah dibedakan antara tersedia, dipilih, dan terisi.
5. Elemen yang paling penting seperti tombol konfirmasi harus memiliki bobot visual yang lebih kuat dibanding elemen sekunder.

## 6. Standar Interaksi dan Tata Letak

- Pengguna dapat memilih kursi dengan sentuhan untuk memilih atau membatalkan pemilihan.
- Sistem harus menampilkan harga secara live sesuai kursi yang dipilih.
- Tombol konfirmasi harus ditampilkan dengan warna yang menonjol dan teks yang jelas.
- Aplikasi harus menjaga keseimbangan antara ruang kosong, kepadatan informasi, dan keterbacaan.

## 7. Pedoman Implementasi Visual

- Gunakan border radius yang konsisten dan tidak terlalu kecil agar tampilan lebih halus.
- Gunakan warna yang sesuai dengan kanal visual produk agar identitas terlihat jelas.
- Perhatikan keterbacaan teks, terutama untuk label kursi, harga, status, dan judul utama.
- Hindari penggunaan visual yang terlalu ramai agar antarmuka tetap bersih.

## 8. Ringkasan

Sistem desain ini bertujuan untuk menghasilkan aplikasi TrekBus yang terlihat modern, profesional, mudah dipahami, dan konsisten secara visual. Semua keputusan visual harus berfungsi untuk mendukung pengalaman pemesanan kursi yang cepat, jelas, dan nyaman bagi pengguna.
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

1. **Locked State (Sebelum Pilih Tanggal):**Tombol "Confirm Booking" mati (disabled). Grid kursi 20 slot buram/placeholder. Muncul pesan "Pilih tanggal keberangkatan untuk melihat kursi".
2. **Regular Bus Selection (20 Kursi):** Grid 5x4 (A1-D5). Kursi jendela (Window) Rp 150.000, kursi koridor (Aisle) Rp 100.000. Wajib ada "Seat Legend" (Available, Selected, Occupied).
3. **Express Bus Selection:** Jumlah kursi lebih sedikit, konfigurasi premium, namun warna dan kontrol tetap konsisten dengan Regular Bus.
