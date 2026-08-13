import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, BUS_LAYOUT, getSeatLabel, getSeatPrice, getSeatId, getSeatPosition, MAX_SEATS_PER_BOOKING, FONT_FAMILY } from '../constants/busConfig';
import { Seat, BusType, Booking, BookingItem } from '../types';
import { getBookedSeats, saveBooking, markSeatsAsBooked, generateBookingId } from '../storage/bookingStorage';
import { useNavigation } from '@react-navigation/native';

// ── Dummy Data Generator ────────────────────────
function generateSeats(busType: BusType): Seat[] {
  const layout = BUS_LAYOUT[busType];
  const seats: Seat[] = [];
  
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
    // regenerate seats when bus type changes and clear selection
    setSeats(generateSeats(busType));
    setSelectedSeatIds([]);
  }, [busType]);

  useEffect(() => {
    // when date changes, reset selected seats and reload seat availability
    setSelectedSeatIds([]);
    setSeats(generateSeats(busType));
  }, [departureDate, busType]);

  // Load booked seats from storage for the selected bus type & date
  useEffect(() => {
    if (!departureDate) return; // nothing to load until a date selected

    let mounted = true;
    async function loadBooked() {
      try {
        const booked = await getBookedSeats(busType, departureDate);
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
    setIsProcessing(true);

    try {
      const items: BookingItem[] = selectedSeats.map((s) => ({
        seatId: s.id,
        seatLabel: s.label,
        busType: s.busType,
        position: s.position,
        price: s.price,
        departureDate,
      }));

      const booking: Booking = {
        id: generateBookingId(),
        busType,
        departureDate,
        items,
        totalPrice: totalPrice,
        createdAt: new Date().toISOString(),
      };

      await saveBooking(booking);

      const autoReset = await markSeatsAsBooked(busType, departureDate as string, selectedSeatIds);

      if (autoReset) {
        // storage reset happened — refresh seats
        setSeats(generateSeats(busType));
        // Inform user that seats for this bus type/date were reset
        Alert.alert('Info', 'Semua kursi untuk tipe ini pada tanggal tersebut sudah penuh — ketersediaan dikembalikan. Booking tetap tersimpan di riwayat.');
      } else {
        // mark these seats as booked locally
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

  // Date picker list generator (next 30 days)
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* 1. App Header & Trip Info */}
        <View style={styles.appHeaderRow}>
          <Text style={styles.appTitle}>TrekBus</Text>
          <TouchableOpacity onPress={() => (navigation as any).navigate('SalesHistory')} style={styles.headerIcon}>
            <Ionicons name="receipt-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerCard}>
          <View style={styles.routeContainer}>
            <Ionicons name="bus" size={24} color={COLORS.primary} />
            <View style={styles.routeTextContainer}>
              <Text style={styles.routeText}>Jakarta - Bandung • 24 Oct 2023</Text>
            </View>
          </View>
        </View>

        {/* 2. Bus Type Toggle */}
        <View style={styles.toggleContainer}>
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

        {/* 3. Date Picker Chip (Static) */}
        <TouchableOpacity style={styles.dateChip} onPress={() => setIsDateModalVisible(true)}>
          <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
          <Text style={styles.dateChipText}>{formattedDepartureLabel()}</Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.neutral} />
        </TouchableOpacity>

        <Modal visible={isDateModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Departure Date</Text>
              <FlatList
                data={getNextDates(30)}
                keyExtractor={(item) => item.iso}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dateItem}
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

        {/* 4. Seat Legend */}
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

        {/* 5. Seat Grid (Regular Class) */}
        <View style={[styles.busContainer, !departureDate && styles.lockedBusContainer]}>
          <View style={styles.driverSection}>
            <Ionicons name="car-sport-outline" size={28} color={COLORS.neutral} />
          </View>
          
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
        
        {/* Spacer for bottom bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 6. Sticky Bottom Bar */}
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
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeTextContainer: {
    marginLeft: SPACING.md,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
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
  },
  toggleButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  toggleTextActive: {
    color: COLORS.textOnDark,
  },

  // Date Chip
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  dateChipText: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
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
  },
  driverSection: {
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: SPACING.md,
    marginBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 240, // Lebar fixed untuk 4 kolom + aisle gap
  },
  seat: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.seatAvailable,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.base,
    alignItems: 'center',
    justifyContent: 'center',
    margin: SPACING.xs,
  },
  seatLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  seatPrice: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
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
    // Shadow for iOS/Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 20,
  },
  summaryContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  confirmButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.base,
    marginLeft: SPACING.md,
  },
  confirmButtonDisabled: {
    backgroundColor: COLORS.neutral,
    opacity: 0.5,
  },
  confirmButtonText: {
    color: COLORS.textOnDark,
    fontWeight: '700',
    fontSize: 16,
  },
  appHeaderRow: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
    fontFamily: FONT_FAMILY,
  },
  headerIcon: {
    padding: SPACING.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    maxHeight: '60%',
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    color: COLORS.textPrimary,
  },
  dateItem: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dateItemText: {
    fontSize: 14,
    color: COLORS.textPrimary,
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
  },
});
