// ─────────────────────────────────────────────
//  TrekBus – Sales History Screen
// ─────────────────────────────────────────────

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/busConfig';
import { getAllBookings } from '../storage/bookingStorage';
import { Booking } from '../types';
import { Ionicons } from '@expo/vector-icons';

export default function SalesHistoryScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const all = await getAllBookings();
      if (!mounted) return;
      setBookings(all);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const visibleBookings = useMemo(() => {
    if (!filterDate) return bookings;
    return bookings.filter((b) => b.departureDate === filterDate);
  }, [bookings, filterDate]);

  const totalRevenue = useMemo(() => visibleBookings.reduce((s, b) => s + (b.totalPrice || 0), 0), [visibleBookings]);

  function formatCurrency(v: number) {
    return `Rp ${v.toLocaleString('id-ID')}`;
  }

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

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Sales History</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.headerIcon}>
          <Ionicons name="calendar-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Revenue</Text>
        <Text style={styles.summaryValue}>{formatCurrency(totalRevenue)}</Text>
      </View>

      <FlatList
        data={visibleBookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.md }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.badge, { backgroundColor: item.busType === 'Regular' ? COLORS.primary : COLORS.tertiary }]}>
                <Text style={styles.badgeText}>{item.items.map((it) => it.seatLabel).join(', ')}</Text>
              </View>
              <View style={styles.meta}>
                <Text style={styles.routeText}>Jakarta - Bandung</Text>
                <Text style={styles.dateText}>{item.departureDate} • {new Date(item.createdAt).toLocaleString()}</Text>
              </View>
              <View style={styles.tagContainer}>
                <Text style={styles.tag}>{item.busType.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.priceText}>{formatCurrency(item.totalPrice)}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}><Text style={styles.emptyText}>No bookings found.</Text></View>
        )}
      />

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Departure Date</Text>
            <FlatList
              data={getNextDates(30)}
              keyExtractor={(i) => i.iso}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dateItem}
                  onPress={() => {
                    setFilterDate(item.iso);
                    setIsModalVisible(false);
                  }}
                >
                  <Text style={styles.dateItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => { setFilterDate(null); setIsModalVisible(false); }}>
                <Text style={styles.clearText}>Clear filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  headerIcon: { padding: SPACING.xs },
  summaryCard: { backgroundColor: COLORS.surface, marginHorizontal: SPACING.md, padding: SPACING.md, borderRadius: BORDER_RADIUS.base, borderWidth: 1, borderColor: COLORS.border },
  summaryLabel: { fontSize: 12, color: COLORS.textSecondary },
  summaryValue: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginTop: SPACING.sm },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.base, padding: SPACING.md, marginTop: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  badge: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  badgeText: { color: COLORS.textOnDark, fontWeight: '700', fontSize: 12, textAlign: 'center' },
  meta: { flex: 1 },
  routeText: { fontWeight: '700', color: COLORS.textPrimary },
  dateText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  tagContainer: { marginLeft: SPACING.sm },
  tag: { backgroundColor: COLORS.tertiary, color: COLORS.textOnDark, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm, color: COLORS.textOnDark, fontWeight: '700' },
  cardFooter: { marginTop: SPACING.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceText: { fontWeight: '800', color: COLORS.primary },
  empty: { padding: SPACING.md, alignItems: 'center' },
  emptyText: { color: COLORS.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.surface, maxHeight: '60%', borderTopLeftRadius: BORDER_RADIUS.lg, borderTopRightRadius: BORDER_RADIUS.lg, padding: SPACING.md },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: SPACING.sm, color: COLORS.textPrimary },
  dateItem: { paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  dateItemText: { fontSize: 14, color: COLORS.textPrimary },
  modalActions: { marginTop: SPACING.md, alignItems: 'center' },
  clearText: { color: COLORS.secondary, fontWeight: '700' },
});
