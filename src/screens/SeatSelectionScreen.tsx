import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, BUS_LAYOUT, getSeatLabel, getSeatPrice, getSeatId, getSeatPosition, MAX_SEATS_PER_BOOKING, FONT_FAMILY } from '../constants/busConfig';
import { Seat, BusType, Booking, BookingItem } from '../types';
import { getBookedSeats, saveBooking, markSeatsAsBooked, generateBookingId } from '../storage/bookingStorage';
import { useNavigation } from '@react-navigation/native';

// Generate tempat duduk (seats) berdasarkan tipe bus, termasuk label, posisi, harga, dan status awal
function generateSeats(busType: BusType): Seat[] {
  const layout = BUS_LAYOUT[busType];
  const seats: Seat[] = [];
  
  // Loop melalui baris dan kolom untuk membuat objek Seat untuk setiap kursi
  for (let r = 0; r < layout.rows; r++) {
    for (let c = 1; c <= layout.cols; c++) {
      const label = getSeatLabel(r, c);
      seats.push({
        id: getSeatId(busType, label),
        busType,
        row: r + 1,
        col: c,
        label,
        position: getSeatPosition(c),
        status: 'available', // statis dulu
        price: getSeatPrice(busType, c),
      });
    }
  }
  return seats;
}

// 
const DUMMY_REGULAR_SEATS = generateSeats('Regular');

export default function SeatSelectionScreen() {
  const [busType, setBusType] = useState<BusType>('Regular');
  const [seats, setSeats] = useState<Seat[]>(() => generateSeats('Regular'));
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [departureDate, setDepartureDate] = useState<string | null>(null); // ISO YYYY-MM-DD
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    // untuk mengatur ulang kursi saat tipe bus berubah
    setSeats(generateSeats(busType));
    setSelectedSeatIds([]);
  }, [busType]);

  useEffect(() => {
    // untuk mengatur ulang kursi saat tanggal keberangkatan berubah
    setSelectedSeatIds([]);
    setSeats(generateSeats(busType));
  }, [departureDate, busType]);

  // untuk memuat kursi yang sudah dibooking dari AsyncStorage saat tanggal keberangkatan dipilih
  useEffect(() => {
    if (!departureDate) return; 

    const selectedDate = departureDate;
    let mounted = true;
    async function loadBooked() {
      try {
        const booked = await getBookedSeats(busType, selectedDate);
        if (!mounted) return;
        setSeats((prev) => prev.map((s) => ({ ...s, status: booked.includes(s.id) ? 'booked' : 'available' })));
      } catch (error) {
        console.error('loadBooked error', error);
      }
    }
    loadBooked();
    return () => {
      mounted = false;
    };
  }, [busType, departureDate]);

  const selectedSeats = useMemo(
    () => seats.filter((s) => selectedSeatIds.includes(s.id)),
    [seats, selectedSeatIds]
  );

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + s.price, 0);
  }, [selectedSeats]);

  function handleSeatPress(seat: Seat) {
    if (!departureDate) {
      Alert.alert('Pilih tanggal', 'Pilih tanggal keberangkatan terlebih dahulu');
      return;
    }

    if (seat.status === 'booked') return; // cannot act on booked

    const isSelected = selectedSeatIds.includes(seat.id);

    if (isSelected) {
      // unselect
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seat.id));
      setSeats((prev) => prev.map((s) => (s.id === seat.id ? { ...s, status: 'available' } : s)));
      return;
    }

    // selecting
    if (selectedSeatIds.length >= MAX_SEATS_PER_BOOKING) {
      Alert.alert('Batas Maksimum', `Maksimum ${MAX_SEATS_PER_BOOKING} kursi per pemesanan`);
      return;
    }

    setSelectedSeatIds((prev) => [...prev, seat.id]);
    setSeats((prev) => prev.map((s) => (s.id === seat.id ? { ...s, status: 'selected' } : s)));
  }

  async function confirmBooking() {
    if (selectedSeatIds.length === 0) return;
    if (!departureDate) {
      Alert.alert('Pilih tanggal', 'Pilih tanggal keberangkatan terlebih dahulu');
      return;
    }

    setIsProcessing(true);

    try {
      const selectedDate = departureDate;
      const items: BookingItem[] = selectedSeats.map((s) => ({
        seatId: s.id,
        seatLabel: s.label,
        busType: s.busType,
        position: s.position,
        price: s.price,
        departureDate: selectedDate,
      }));

      const booking: Booking = {
        id: generateBookingId(),
        busType,
        departureDate: selectedDate,
        items,
        totalPrice: totalPrice,
        createdAt: new Date().toISOString(),
      };

      await saveBooking(booking);

      const autoReset = await markSeatsAsBooked(busType, departureDate as string, selectedSeatIds);

      if (autoReset) {
        // riset kursi karena sudah penuh
        setSeats(generateSeats(busType));
        // Inform user that seats for this bus type/date were reset
        Alert.alert('Info', 'Semua kursi untuk tipe ini pada tanggal tersebut sudah penuh — ketersediaan dikembalikan. Booking tetap tersimpan di riwayat.');
      } else {
        // update kursi yang sudah dibooking di state
        setSeats((prev) => prev.map((s) => (selectedSeatIds.includes(s.id) ? { ...s, status: 'booked' } : s)));
        Alert.alert('Sukses', 'Booking berhasil disimpan');
      }

      setSelectedSeatIds([]);
    } catch (error) {
      console.error('confirmBooking error', error);
      Alert.alert('Error', 'Gagal menyimpan booking');
    } finally {
      setIsProcessing(false);
    }
  }

  // tanggal berikutnya untuk filter, default 30 hari
  function getNextDates(days = 30) {
    const list: { iso: string; label: string }[] = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const iso = `${yyyy}-${mm}-${dd}`;
      const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      list.push({ iso, label });
    }
    return list;
  }

  function formattedDepartureLabel() {
    if (!departureDate) return 'Select Departure Date';
    const d = new Date(departureDate + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const routeDisplay = departureDate
    ? `Denpasar - Gilimanuk • ${formattedDepartureLabel()}`
    : 'Denpasar - Gilimanuk • Select Date';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* 1. App header dan info perjalanan */}
        <View style={styles.appHeaderRow}>
          <Text style={styles.appTitle}>TrekBus</Text>
          <TouchableOpacity onPress={() => (navigation as any).navigate('SalesHistory')}>
            <Text style={styles.headerLink}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.headerCard, styles.cardShadow]}>
          <View style={styles.routeContainer}>
            <View style={styles.routeIconWrap}>
              <Ionicons name="bus" size={22} color={COLORS.primary} />
            </View>
            <View style={styles.routeTextContainer}>
              <Text style={styles.routeText}>{routeDisplay}</Text>
            </View>
          </View>
        </View>

        {/* 2. Tipe Bus */}
        <View style={[styles.toggleContainer, styles.cardShadow]}>
          <TouchableOpacity
            style={[styles.toggleButton, busType === 'Regular' && styles.toggleActive]}
            onPress={() => setBusType('Regular')}
          >
            <Text style={[styles.toggleText, busType === 'Regular' && styles.toggleTextActive]}>Regular Class</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, busType === 'Express' && styles.toggleActive]}
            onPress={() => setBusType('Express')}
          >
            <Text style={[styles.toggleText, busType === 'Express' && styles.toggleTextActive]}>Express Class</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Tanggal Keberangkatan */}
        <TouchableOpacity style={[styles.dateChip, styles.cardShadow]} onPress={() => setIsDateModalVisible(true)}>
          <View style={styles.dateChipLeft}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
            <Text style={styles.dateChipText}>{formattedDepartureLabel()}</Text>
          </View>
          <Ionicons name="chevron-down" size={18} color={COLORS.neutral} />
        </TouchableOpacity>

        <Modal visible={isDateModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, styles.cardShadow]}>
              <Text style={styles.modalTitle}>Select Departure Date</Text>
              <FlatList
                data={getNextDates(30)}
                keyExtractor={(item) => item.iso}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.dateItem, departureDate === item.iso && styles.dateItemSelected]}
                    onPress={() => {
                      setDepartureDate(item.iso);
                      setIsDateModalVisible(false);
                    }}
                  >
                    <Text style={styles.dateItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.modalClose} onPress={() => setIsDateModalVisible(false)}>
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 4. Legend Kursi */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: COLORS.seatAvailable, borderColor: COLORS.border, borderWidth: 1 }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: COLORS.seatSelected }]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: COLORS.seatBooked }]} />
            <Text style={styles.legendText}>Occupied</Text>
          </View>
        </View>

        {/* 5. Grid Kursi */}
        <View style={[styles.busContainer, styles.cardShadow, !departureDate && styles.lockedBusContainer]}>
          <View style={styles.grid}>
            {seats.map((seat) => {
              const isAisleLeft = seat.col === 2;
              const isSelected = selectedSeatIds.includes(seat.id);
              const bg = seat.status === 'booked' ? COLORS.seatBooked : isSelected ? COLORS.seatSelected : COLORS.seatAvailable;
              const textColor = isSelected ? COLORS.textOnDark : COLORS.textPrimary;

              return (
                <TouchableOpacity
                  key={seat.id}
                  onPress={() => handleSeatPress(seat)}
                  disabled={seat.status === 'booked' || !departureDate}
                  style={[
                    styles.seat,
                    { backgroundColor: bg },
                    isAisleLeft && { marginRight: SPACING.xl },
                    seat.status === 'booked' && { opacity: 0.8 },
                  ]}
                >
                  <Text style={[styles.seatLabel, { color: textColor }]}>{seat.label}</Text>
                  <Text style={[styles.seatPrice, { color: textColor }]}>
                    {seat.price / 1000}k
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
            {!departureDate && (
              <View style={styles.lockedOverlay} pointerEvents="none">
                <Text style={styles.lockedText}>Pilih tanggal keberangkatan untuk melihat kursi</Text>
              </View>
            )}
        </View>
        
        {/* untuk jarak antara grid kursi dan bottom bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 6. Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>{selectedSeatIds.length} Seats Selected</Text>
          <Text style={styles.summaryPrice}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmButton, (selectedSeatIds.length === 0 || isProcessing) && styles.confirmButtonDisabled]}
          disabled={selectedSeatIds.length === 0 || isProcessing}
          onPress={confirmBooking}
        >
          <Text style={styles.confirmButtonText}>{isProcessing ? 'Processing...' : 'Confirm Booking'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: SPACING.md,
  },
  
  // Header
  headerCard: {
    backgroundColor: COLORS.surface,
    paddingVertical: 18,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    minHeight: 72,
    justifyContent: 'center',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  routeTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Toggle
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.base,
    padding: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY,
  },
  toggleTextActive: {
    color: COLORS.textOnDark,
  },

  // Date Chip
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    minHeight: 48,
  },
  dateChipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateChipText: {
    marginLeft: SPACING.sm,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.1,
  },

  // Legend
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSwatch: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  // Bus & Grid
  busContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    minHeight: 340,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 320,
  },
  seat: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.seatAvailable,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.base,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
  },
  seatLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.2,
  },
  seatPrice: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.1,
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 20,
  },
  summaryContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.12,
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    fontFamily: FONT_FAMILY,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.base,
    marginLeft: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 6,
  },
  confirmButtonDisabled: {
    backgroundColor: '#B8C0C8',
    opacity: 0.8,
  },
  confirmButtonText: {
    color: COLORS.textOnDark,
    fontWeight: '700',
    fontSize: 15,
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.12,
  },
  appHeaderRow: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.2,
  },
  headerLink: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    maxHeight: '60%',
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    color: COLORS.textPrimary,
    fontFamily: FONT_FAMILY,
  },
  dateItem: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dateItemSelected: {
    backgroundColor: '#F5F7FF',
    borderRadius: BORDER_RADIUS.base,
    paddingHorizontal: SPACING.sm,
  },
  dateItemText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: FONT_FAMILY,
  },
  modalClose: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  modalCloseText: {
    color: COLORS.tertiary,
    fontWeight: '700',
  },
  lockedBusContainer: {
    opacity: 0.6,
  },
  lockedOverlay: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  lockedText: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.base,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontFamily: FONT_FAMILY,
    fontWeight: '600',
  },
  // subtle card shadow to match design
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
});
