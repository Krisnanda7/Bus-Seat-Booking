import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, BUS_LAYOUT, getSeatLabel, getSeatPrice, getSeatId, getSeatPosition } from '../constants/busConfig';
import { Seat, BusType } from '../types';

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
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* 1. App Header & Trip Info */}
        <View style={styles.appHeaderRow}>
          <Text style={styles.appTitle}>TrekBus</Text>
        </View>

        <View style={styles.headerCard}>
          <View style={styles.routeContainer}>
            <Ionicons name="bus" size={24} color={COLORS.primary} />
            <View style={styles.routeTextContainer}>
              <Text style={styles.routeText}>Jakarta - Bandung • 24 Oct 2023</Text>
            </View>
          </View>
        </View>

        {/* 2. Bus Type Toggle (Static) */}
        <View style={styles.toggleContainer}>
          <View style={[styles.toggleButton, styles.toggleActive]}>
            <Text style={[styles.toggleText, styles.toggleTextActive]}>Regular Class</Text>
          </View>
          <View style={styles.toggleButton}>
            <Text style={styles.toggleText}>Express Class</Text>
          </View>
        </View>

        {/* 3. Date Picker Chip (Static) */}
        <TouchableOpacity style={styles.dateChip}>
          <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
          <Text style={styles.dateChipText}>Select Departure Date</Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.neutral} />
        </TouchableOpacity>

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
        <View style={styles.busContainer}>
          <View style={styles.driverSection}>
            <Ionicons name="car-sport-outline" size={28} color={COLORS.neutral} />
          </View>
          
          <View style={styles.grid}>
            {DUMMY_REGULAR_SEATS.map((seat) => {
              // Menambahkan gap di tengah (aisle) dengan style margin
              const isAisleLeft = seat.col === 2;
              
              return (
                <View 
                  key={seat.id} 
                  style={[
                    styles.seat, 
                    isAisleLeft && { marginRight: SPACING.xl } // Jarak koridor
                  ]}
                >
                  <Text style={styles.seatLabel}>{seat.label}</Text>
                  <Text style={styles.seatPrice}>
                    {seat.price / 1000}k
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        
        {/* Spacer for bottom bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 6. Sticky Bottom Bar (Static) */}
      <View style={styles.bottomBar}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>0 Seats Selected</Text>
          <Text style={styles.summaryPrice}>Rp 0</Text>
        </View>
        <TouchableOpacity style={[styles.confirmButton, styles.confirmButtonDisabled]} disabled>
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
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
});
