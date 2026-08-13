# Product Requirements Document (PRD)

# Bus Seat Booking

## 1. Overview & Tujuan Produk

Bus Seat Booking adalah aplikasi mobile berbasis React Native yang dirancang untuk membantu pengguna memilih dan memesan kursi bus secara cepat, jelas, dan mudah dipahami. Aplikasi ini berfokus pada pengalaman pemilihan kursi yang intuitif, transparansi harga secara real-time, serta penyimpanan data lokal yang aman dan andal tanpa memerlukan backend.

Tujuan utama produk ini adalah menyediakan alur pemesanan kursi bus yang sederhana namun lengkap, mulai dari pemilihan tipe bus, penentuan tanggal keberangkatan, pemilihan kursi, hingga konfirmasi transaksi. Selain itu, aplikasi juga menyediakan riwayat penjualan yang dapat dilihat dalam bentuk daftar transaksi yang tersimpan secara lokal.

Dalam konteks pengembangan, aplikasi ini ditujukan untuk evaluasi teknis dan demonstrasi kemampuan React Native dalam membangun alur interaksi pengguna yang relevan dengan kebutuhan transportasi digital.

## 2. Target User & Use Case Singkat

### Target User
- Penumpang yang ingin memesan kursi bus secara mandiri melalui perangkat mobile.
- Pengguna yang membutuhkan proses booking yang cepat, tidak rumit, dan memiliki pemahaman visual yang jelas mengenai ketersediaan kursi.
- Pengguna yang ingin melihat riwayat transaksi dan total pendapatan secara sederhana.

### Use Case Utama
- Pengguna memilih tipe bus yang diinginkan.
- Pengguna menentukan tanggal keberangkatan.
- Pengguna memilih kursi yang tersedia.
- Pengguna melihat total harga secara langsung.
- Pengguna mengonfirmasi booking.
- Sistem menyimpan data booking secara lokal.
- Pengguna dapat melihat riwayat booking pada layar sales history.

## 3. User Flow

### Alur Utama
1. Pengguna membuka aplikasi.
2. Pengguna memilih tipe bus, yaitu Regular Class atau Express Class.
3. Pengguna memilih tanggal keberangkatan dari daftar tanggal yang tersedia.
4. Sistem menampilkan layout kursi yang sesuai dengan tipe bus dan tanggal yang dipilih.
5. Pengguna memilih kursi yang diinginkan.
6. Sistem memperbarui total harga secara real-time sesuai kursi yang dipilih.
7. Pengguna menekan tombol Confirm Booking.
8. Sistem menyimpan data booking secara lokal dan mengubah kursi yang dipilih menjadi permanen unavailable.
9. Pengguna kembali ke layar pemilihan kursi atau membuka riwayat penjualan.

### Alur Bonus: Date Picker
1. Pengguna membuka layar pemilihan kursi.
2. Jika belum memilih tanggal, layar berada dalam kondisi locked.
3. Pengguna memilih tanggal keberangkatan melalui date picker.
4. Setelah tanggal dipilih, kursi baru dapat dipilih dan tombol konfirmasi dapat diaktifkan.
5. Setiap kursi memiliki status yang bergantung pada tanggal terkait.

### Alur Sales History
1. Pengguna membuka layar riwayat penjualan.
2. Sistem menampilkan daftar booking yang tersimpan.
3. Pengguna dapat memfilter riwayat berdasarkan tanggal keberangkatan.
4. Sistem menampilkan total revenue sesuai dengan data yang sedang muncul.

## 4. Functional Requirements

### [Required]
1. Aplikasi harus menyediakan pilihan tipe bus di bagian atas layar.
2. Tipe bus Regular Class harus menampilkan 20 kursi dengan layout 10 kursi di sisi kiri dan 10 kursi di sisi kanan.
3. Tipe bus Express Class harus menampilkan 12 kursi dengan layout 6 kursi di sisi kiri dan 6 kursi di sisi kanan.
4. Layout kursi harus berubah secara dinamis sesuai tipe bus yang dipilih.
5. Pengguna harus dapat menekan kursi untuk memilih atau membatalkan pemilihan.
6. Kursi yang dipilih harus memiliki indikator visual yang jelas agar mudah dibedakan dari kursi lain.
7. Sistem harus menampilkan total harga secara live berdasarkan kursi yang dipilih.
8. Harga kursi per kolom harus mengikuti aturan berikut:
   - Regular, kolom pertama atau terakhir (dekat jendela): Rp150.000 per kursi.
   - Regular, kolom lainnya: Rp100.000 per kursi.
   - Express, kolom pertama atau terakhir (dekat jendela): Rp200.000 per kursi.
   - Express, kolom lainnya: Rp150.000 per kursi.
9. Pengguna hanya dapat memilih maksimal 5 kursi dalam satu transaksi.
10. Tombol Confirm Booking harus tersedia dan berfungsi untuk menyimpan booking yang dipilih.
11. Setelah booking dikonfirmasi, kursi yang dipilih harus menjadi permanen unavailable dan tidak dapat dipilih lagi.
12. Data booking harus disimpan secara lokal tanpa memerlukan backend.
13. Ketersediaan kursi harus otomatis direset hanya ketika semua kursi untuk tipe bus tersebut sudah penuh dan tidak berlaku untuk tipe bus lain.
14. Aplikasi harus memisahkan status kursi berdasarkan tipe bus dan tanggal keberangkatan.

### [Optional / Bonus]
15. Aplikasi harus menyediakan date picker pada layar seat selection.
16. Tanggal keberangkatan harus dipilih sebelum pengguna dapat memilih kursi atau menekan tombol konfirmasi.
17. Status kursi harus terikat pada tanggal tertentu.
18. Reset kursi harus dilakukan secara spesifik per tanggal, bukan global.
19. Aplikasi harus menyediakan layar sales history untuk menampilkan riwayat booking.
20. Aplikasi harus menyediakan filter tanggal pada sales history.

## 5. Business Rules & Edge Cases

1. Pengguna tidak dapat memilih kursi lebih dari 5 dalam satu transaksi.
2. Jika pengguna mencoba memilih kursi tambahan setelah batas maksimal tercapai, sistem harus menolak tindakan tersebut dan menampilkan pesan yang jelas.
3. Jika pengguna mengganti tipe bus saat kursi sudah dipilih, sistem harus menghapus pilihan sebelumnya agar tidak terjadi inkonsistensi state.
4. Kursi yang sudah dibooking tidak dapat dipilih kembali.
5. Jika pengguna menekan kursi yang sudah dibooking, tidak ada perubahan state yang terjadi.
6. Jika pengguna mengganti tanggal setelah memilih kursi, seleksi kursi sebelumnya harus dihapus agar sesuai dengan tanggal baru.
7. Reset kursi hanya terjadi saat semua kursi untuk tipe bus tertentu pada tanggal tertentu sudah penuh.
8. Reset tidak berlaku untuk semua tipe bus secara bersamaan; operasi reset harus independen per bus type.
9. Data booking yang sudah tersimpan tidak boleh dihapus saat terjadi reset seat availability.
10. Jika semua kursi pada tanggal tertentu padat, semua data kursi untuk tanggal tersebut dapat dihapus agar ketersediaan dapat dibangun ulang.
11. Booking yang tersimpan harus tetap ada di riwayat meskipun terjadi auto reset.
12. Pengguna tidak dapat mengonfirmasi booking jika belum memilih tanggal.
13. Jika bus type berubah, layout kursi dan daftar kursi yang tersedia harus diperbarui sesuai state yang baru.
14. Aplikasi harus menangani kondisi ketika AsyncStorage kosong atau data tidak tersedia dengan aman.

## 6. Data Model

### Bus Type
- Regular
- Express

### Seat
Struktur data kursi lokal mencakup:
- id
- busType
- row
- col
- label
- position
- status
- price

### Booking Item
Struktur item booking mencakup:
- seatId
- seatLabel
- busType
- position
- price
- departureDate

### Booking Record
Struktur transaksi booking mencakup:
- id
- busType
- departureDate
- items
- totalPrice
- createdAt

### Stored Seat Availability
Status kursi harus disimpan secara lokal berdasarkan kombinasi:
- bus type
- tanggal keberangkatan

Dengan pola penyimpanan yang memungkinkan pengambilan seat availability per tanggal secara terisolasi.

## 7. Non-Functional Requirements

1. Aplikasi harus dibangun menggunakan React Native.
2. Penggunaan lifecycle React Native harus eksplisit dan terarah, terutama melalui useEffect, useState, dan useMemo.
3. Data harus disimpan secara lokal menggunakan AsyncStorage atau solusi lokal lainnya.
4. UI harus bersifat friendly, mudah dibaca, dan tidak membingungkan pengguna.
5. Sistem harus menjaga consistensi data antar state UI dan storage.
6. Waktu respon interaksi seperti pemilihan kursi dan pembaruan total harga harus terasa cepat dan responsif.
7. Implementasi harus mudah dipelihara dan dapat dijelaskan dengan struktur komponen yang jelas.

## 8. Out of Scope

- Integrasi ke backend atau layanan pembayaran.
- Login atau autentikasi pengguna.
- Integrasi API real-time.
- Manajemen seat inventory multi-user secara sinkron.
- Fitur pengiriman notifikasi atau reminder.

## 9. Acceptance Criteria per Fitur

### Fitur 1: Pilihan Tipe Bus
- [ ] Pengguna dapat memilih antara Regular Class dan Express Class.
- [ ] Saat tipe bus berubah, layout kursi berubah sesuai tipe yang dipilih.

### Fitur 2: Layout Kursi Dinamis
- [ ] Regular Class menampilkan layout yang sesuai dengan 20 kursi.
- [ ] Express Class menampilkan layout yang sesuai dengan 12 kursi.
- [ ] Setiap kursi memiliki label yang jelas dan terstruktur.

### Fitur 3: Pemilihan Kursi
- [ ] Pengguna dapat memilih kursi dengan tap.
- [ ] Pengguna dapat membatalkan pilihan kursi dengan tap ulang.
- [ ] Kursi yang dipilih memiliki indikator visual yang jelas.

### Fitur 4: Harga Real-time
- [ ] Total harga berubah sesuai kursi yang dipilih.
- [ ] Harga per kursi mengikuti aturan yang telah ditetapkan.

### Fitur 5: Batas Maksimal Pemesanan
- [ ] Sistem membatasi jumlah kursi yang dapat dipilih dalam satu transaksi maksimal 5 kursi.
- [ ] Jika mencoba memilih lebih dari 5, sistem menolak tindakan tersebut.

### Fitur 6: Confirm Booking
- [ ] Tombol Confirm Booking berfungsi untuk menyimpan booking.
- [ ] Kursi yang berhasil dibooking berubah menjadi unavailable.

### Fitur 7: Penyimpanan Lokal
- [ ] Data booking disimpan secara lokal.
- [ ] Data kursi yang dipesan dapat diakses kembali saat aplikasi dibuka ulang.

### Fitur 8: Auto Reset Seat Availability
- [ ] Reset hanya terjadi ketika semua kursi untuk tipe bus tertentu benar-benar penuh.
- [ ] Reset tidak mengganggu tipe bus lain.

### Fitur 9: Date Picker
- [ ] Pengguna harus memilih tanggal sebelum dapat memilih kursi.
- [ ] Kursi yang sudah dibooking pada tanggal tertentu tidak tampil sebagai available pada tanggal lain.

### Fitur 10: Sales History
- [ ] Pengguna dapat membuka layar riwayat transaksi.
- [ ] Setiap booking menampilkan informasi terkait kursi dan tanggal keberangkatan.
- [ ] Total revenue dihitung sesuai riwayat yang ditampilkan.

### Fitur 11: Date Filter
- [ ] Pengguna dapat memfilter riwayat transaksi berdasarkan tanggal tertentu.
- [ ] Sistem hanya menampilkan riwayat yang sesuai dengan filter.

## Kesimpulan

PRD ini menetapkan fondasi produk yang jelas untuk aplikasi Bus Seat Booking berbasis React Native. Fokus utama aplikasi adalah pengalaman booking yang cepat, akurat, dan konsisten, dengan pengelolaan data lokal yang aman dan aturan bisnis yang jelas. Dengan implementasi yang sesuai PRD ini, aplikasi akan memenuhi kebutuhan dasar pemesan kursi bus serta dapat diperluas ke fitur bonus yang menambah nilai pengguna.
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
