// ─────────────────────────────────────────────
//  TrekBus – Core TypeScript Types
// ─────────────────────────────────────────────

/** Tipe bus yang tersedia di aplikasi */
export type BusType = 'Regular' | 'Express';

/** Posisi kursi: dekat jendela (kolom 1 & 4) atau tengah (kolom 2 & 3) */
export type SeatPosition = 'window' | 'aisle';

/** Status kursi */
export type SeatStatus = 'available' | 'selected' | 'booked';

/**
 * Representasi satu kursi di dalam bus.
 * id   : unik identifier, mis. "Regular-A1", "Express-B3"
 * row  : nomor baris (1-based)
 * col  : nomor kolom (1-based)
 * label: label tampilan, mis. "A1"
 */
export interface Seat {
  id: string;
  busType: BusType;
  row: number;
  col: number;
  label: string;
  position: SeatPosition;
  status: SeatStatus;
  price: number;
}

/**
 * Satu item dalam riwayat pemesanan.
 * Mewakili satu kursi yang berhasil di-booking.
 */
export interface BookingItem {
  seatId: string;
  seatLabel: string;
  busType: BusType;
  position: SeatPosition;
  price: number;
  departureDate: string; // ISO date string, contoh: "2026-08-15"
}

/**
 * Satu transaksi booking yang tersimpan di storage.
 * Satu transaksi bisa berisi 1-5 kursi.
 */
export interface Booking {
  id: string;           // UUID / timestamp-based unique id
  busType: BusType;
  departureDate: string; // ISO date string
  items: BookingItem[];
  totalPrice: number;
  createdAt: string;    // ISO datetime string
}

/**
 * State ketersediaan kursi per tipe bus per tanggal.
 * Disimpan di AsyncStorage sebagai lookup table.
 * Key: `${busType}-${departureDate}` -> array seatId yang sudah di-book
 */
export type BookedSeatsMap = Record<string, string[]>;

/**
 * Props dasar untuk layar navigasi
 */
export interface ScreenProps {
  navigation: any;
}
