// ─────────────────────────────────────────────
//  TrekBus – Bus Configuration Constants
//  Sesuai PRD: layout kursi, harga, aturan kolom
// ─────────────────────────────────────────────

import { BusType, SeatPosition } from '../types';

// ── Kolom Layout ────────────────────────────────
// Setiap tipe bus memiliki 4 kolom per baris.
// Kolom 1 & 4 = window (dekat jendela)
// Kolom 2 & 3 = aisle  (tengah / koridor)
export const COLUMNS_PER_ROW = 4;
export const WINDOW_COLUMNS = [1, 4] as const; // kolom 1 dan 4

// ── Layout Grid ─────────────────────────────────
// Regular Class : 5 baris × 4 kolom = 20 kursi
// Express Class : 3 baris × 4 kolom = 12 kursi
export const BUS_LAYOUT: Record<BusType, { rows: number; cols: number; totalSeats: number }> = {
  Regular: { rows: 5, cols: 4, totalSeats: 20 },
  Express: { rows: 3, cols: 4, totalSeats: 12 },
};

// ── Harga Kursi ─────────────────────────────────
// Regular window  = Rp 150.000
// Regular aisle   = Rp 100.000
// Express window  = Rp 200.000
// Express aisle   = Rp 150.000
export const SEAT_PRICES: Record<BusType, Record<SeatPosition, number>> = {
  Regular: {
    window: 150_000,
    aisle: 100_000,
  },
  Express: {
    window: 200_000,
    aisle: 150_000,
  },
};

// ── Batasan Pemesanan ───────────────────────────
/** Jumlah maksimum kursi yang bisa dipilih dalam satu transaksi */
export const MAX_SEATS_PER_BOOKING = 5;

// ── Label Baris ─────────────────────────────────
// Baris dilabeli A, B, C, D, E (Regular) atau A, B, C (Express)
export const ROW_LABELS = ['A', 'B', 'C', 'D', 'E'] as const;

// ── Helpers ─────────────────────────────────────
/**
 * Menentukan posisi kursi berdasarkan nomor kolom (1-based).
 * Kolom 1 dan 4 = window, kolom 2 dan 3 = aisle.
 */
export function getSeatPosition(col: number): SeatPosition {
  return WINDOW_COLUMNS.includes(col as 1 | 4) ? 'window' : 'aisle';
}

/**
 * Mendapatkan harga kursi berdasarkan tipe bus dan kolom.
 */
export function getSeatPrice(busType: BusType, col: number): number {
  const position = getSeatPosition(col);
  return SEAT_PRICES[busType][position];
}

/**
 * Menghasilkan label kursi, mis. "A1", "B3", "C4".
 * rowIndex: 0-based index baris
 * col: 1-based kolom
 */
export function getSeatLabel(rowIndex: number, col: number): string {
  return `${ROW_LABELS[rowIndex]}${col}`;
}

/**
 * Menghasilkan seat ID unik berdasarkan tipe bus dan label.
 * Contoh: "Regular-A1", "Express-C4"
 */
export function getSeatId(busType: BusType, label: string): string {
  return `${busType}-${label}`;
}

/**
 * Storage key untuk booked seats per tipe bus per tanggal.
 * Contoh: "bookedSeats-Regular-2026-08-15"
 */
export function getBookedSeatsKey(busType: BusType, date: string): string {
  // Storage key per busType + date, normalized to lowercase
  // e.g. booked_seats_regular_2026-08-15
  return `booked_seats_${busType.toLowerCase()}_${date}`;
}

// ── Design Tokens (dari DESIGN.md) ──────────────
export const COLORS = {
  primary:   '#14213D', // Grounded Navy
  secondary: '#E94560', // Coral Red
  tertiary:  '#0F3460', // Muted Blue
  neutral:   '#6C757D', // Gray

  // Seat states
  seatAvailable: '#FFFFFF',
  seatSelected:  '#E94560',
  seatBooked:    '#D1D5DB',

  // Background
  background:  '#F8F9FA',
  surface:     '#FFFFFF',
  border:      '#E5E7EB',

  // Text
  textPrimary:   '#14213D',
  textSecondary: '#6C757D',
  textOnDark:    '#FFFFFF',
} as const;

export const FONT_FAMILY = 'Manrope';

export const BORDER_RADIUS = {
  sm:   4,
  base: 8,  // Round 8 – standar TrekBus
  md:   12,
  lg:   16,
  xl:   24,
} as const;

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const;
