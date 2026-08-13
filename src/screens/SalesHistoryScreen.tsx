// ─────────────────────────────────────────────
//  TrekBus – Screen Placeholder
//  SalesHistoryScreen
// ─────────────────────────────────────────────
// TODO: Implement full sales history UI

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/busConfig';

export default function SalesHistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sales History Screen</Text>
      <Text style={styles.subtext}>Coming soon…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtext: {
    marginTop: SPACING.sm,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
