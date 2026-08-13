import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, BusType, BookedSeatsMap } from '../types';
import { BUS_LAYOUT, getBookedSeatsKey } from '../constants/busConfig';

// Key untuk menyimpan semua riwayat booking di AsyncStorage
const BOOKINGS_KEY = 'trekbus_bookings';



// Mengambil semua booking yang tersimpan di AsyncStorage
export async function getAllBookings(): Promise<Booking[]> {
  try {
    const raw = await AsyncStorage.getItem(BOOKINGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Booking[];
  } catch (error) {
    console.error('[bookingStorage] getAllBookings error:', error);
    return [];
  }
}

// Menyimpan booking baru ke AsyncStorage
export async function saveBooking(booking: Booking): Promise<void> {
  try {
    const existing = await getAllBookings();
    const updated = [booking, ...existing];
    await AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('[bookingStorage] saveBooking error:', error);
    throw error;
  }
}

// Menghapus semua booking dari AsyncStorage (untuk keperluan testing atau reset)
export async function clearAllBookings(): Promise<void> {
  try {
    await AsyncStorage.removeItem(BOOKINGS_KEY);
  } catch (error) {
    console.error('[bookingStorage] clearAllBookings error:', error);
  }
}

// Mengambil daftar seatId yang sudah di-book untuk tipe bus dan tanggal tertentu
export async function getBookedSeats(
  busType: BusType,
  date: string
): Promise<string[]> {
  try {
    const key = getBookedSeatsKey(busType, date);
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch (error) {
    console.error('[bookingStorage] getBookedSeats error:', error);
    return [];
  }
}

/**
 * Menambahkan seatId ke daftar kursi yang sudah di-book
 * untuk tipe bus dan tanggal tertentu.
 *
 * Business Rule: jika setelah penambahan SEMUA kursi sudah
 * di-book, maka ketersediaan kursi direset otomatis.
 *
 * @returns boolean — true jika terjadi auto-reset (semua kursi sudah penuh), false jika tidak.
 */
export async function markSeatsAsBooked(
  busType: BusType,
  date: string,
  seatIds: string[]
): Promise<boolean> {
  try {
    const key = getBookedSeatsKey(busType, date);
    const existing = await getBookedSeats(busType, date);
    const updated = [...new Set([...existing, ...seatIds])];

    const { totalSeats } = BUS_LAYOUT[busType];
    const isFullyBooked = updated.length >= totalSeats;

    if (isFullyBooked) {
      // Auto-reset: hapus semua data booked kursi untuk tipe bus ini
      await AsyncStorage.removeItem(key);
      console.info(
        `[bookingStorage] Auto-reset: semua ${totalSeats} kursi ${busType} pada ${date} sudah penuh, kursi direset.`
      );
      return true; // sinyal reset terjadi
    }

    await AsyncStorage.setItem(key, JSON.stringify(updated));
    return false;
  } catch (error) {
    console.error('[bookingStorage] markSeatsAsBooked error:', error);
    throw error;
  }
}

// Menghapus seatId dari daftar kursi yang sudah di-book
export async function resetSeatsForBusType(
  busType: BusType,
  date: string
): Promise<void> {
  try {
    const key = getBookedSeatsKey(busType, date);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('[bookingStorage] resetSeatsForBusType error:', error);
  }
}

// Generate unique booking ID
export function generateBookingId(): string {
  return `booking-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
