// tipe bus: Regular = bus biasa, Express = bus cepat
export type BusType = 'Regular' | 'Express';

// posisi kursi di dalam bus: window = dekat jendela, aisle = dekat koridor
export type SeatPosition = 'window' | 'aisle';

// status kursi: available = bisa dipilih, selected = sedang dipilih user, booked = sudah di-booking
export type SeatStatus = 'available' | 'selected' | 'booked';

// representasi satu kursi di dalam bus
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

// representasi satu item booking (satu kursi yang dipesan)
export interface BookingItem {
  seatId: string;
  seatLabel: string;
  busType: BusType;
  position: SeatPosition;
  price: number;
  departureDate: string; // ISO date string, contoh: "2026-08-15"
}

// representasi satu booking (bisa terdiri dari beberapa kursi)
export interface Booking {
  id: string;           // UUID / timestamp-based unique id
  busType: BusType;
  departureDate: string; // ISO date string
  items: BookingItem[];
  totalPrice: number;
  createdAt: string;    // ISO datetime string
}

// representasi daftar kursi yang sudah di-book untuk setiap busType dan tanggal
export type BookedSeatsMap = Record<string, string[]>;

// shared props untuk semua screen di RootNavigator
export interface ScreenProps {
  navigation: any;
}
