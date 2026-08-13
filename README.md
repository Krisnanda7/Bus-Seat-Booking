# Bus Seat Booking (TrekBus)

PENTING — Install / Unduh APK (utama)
- Google Drive (APK): https://drive.google.com/REPLACE-WITH-YOUR-GDRIVE-LINK
- GitHub repo: https://github.com/REPLACE-WITH-YOUR-GITHUB

---

Penulis: I Dewa Gede Mas Bagus Krisnanda
Email: baguskrisna424@gmail.com

Deskripsi singkat
-----------------
Proyek ini adalah aplikasi mobile untuk pemesanan kursi bus (React Native + Expo). Aplikasi mendukung pemilihan tipe bus (Regular / Express), pemilihan tanggal, pemilihan kursi, penyimpanan booking secara lokal (AsyncStorage), dan riwayat penjualan.

Fitur utama
-----------
- Pilih tipe bus: Regular (20 kursi) atau Express (12 kursi)
- Pemilihan tanggal keberangkatan (date picker)
- Pilih / batal pilih kursi (maks. 5 kursi per transaksi)
- Harga tampil secara real-time
- Simpan booking secara lokal dan tampilkan riwayat penjualan

Prasyarat
---------
- Node.js LTS
- npm atau yarn
- Expo CLI (opsional untuk development): `npm install -g expo-cli`
- Jika membangun APK: EAS CLI (`npm install -g eas-cli`)

Instalasi & Menjalankan (Development)
-------------------------------------
1. Clone repository (atau unduh ZIP dari GitHub):

```bash
git clone https://github.com/REPLACE-WITH-YOUR-GITHUB.git
cd BusSeatBooking
```

2. Pasang dependensi:

```bash
npm install
# atau
# yarn install
```

3. Jalankan aplikasi (Expo web / perangkat):

```bash
npx expo start
```

Build APK (EAS - direkomendasikan)
---------------------------------
1. Instal EAS CLI dan login:

```bash
npm install -g eas-cli
eas login
```

2. Siapkan konfigurasi EAS (jika belum):

```bash
eas build:configure
```

3. Mulai build untuk Android (preview/debug APK):

```bash
eas build -p android --profile preview
```

Setelah build selesai, unduh APK dari tautan yang disediakan oleh EAS atau unggah APK ke Google Drive untuk distribusi.

Catatan singkat: Jika Anda tidak ingin menggunakan EAS, jalankan `npx expo prebuild` lalu buka proyek native di Android Studio untuk membuat APK secara lokal.

Struktur proyek (ringkas)
------------------------
- `App.tsx` – entry point
- `src/screens/SeatSelectionScreen.tsx` – layar pemilihan kursi
- `src/screens/SalesHistoryScreen.tsx` – layar riwayat penjualan
- `src/storage/bookingStorage.ts` – helper penyimpanan lokal
- `src/constants/busConfig.ts` – konfigurasi layout, harga, warna, token desain

Cara berkontribusi
------------------
1. Fork repository dan buat branch baru untuk fitur atau perbaikan.
2. Buat pull request dengan deskripsi perubahan.

Lisensi
-------
Lisensi proyek ini: MIT (sesuaikan jika perlu).

Catatan
-------
- Ganti tautan Google Drive dan GitHub di bagian atas README dengan link yang benar agar cepat diakses.
- Jika ingin, saya dapat membantu menautkan APK yang telah Anda unggah ke Google Drive dan memperbarui README secara langsung.
