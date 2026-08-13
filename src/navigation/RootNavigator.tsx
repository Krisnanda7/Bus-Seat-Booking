// ─────────────────────────────────────────────
//  TrekBus – Root Navigator
//  Stack Navigator dengan 2 route utama:
//  - SeatSelection (layar utama)
//  - SalesHistory  (riwayat pemesanan)
// ─────────────────────────────────────────────

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import SalesHistoryScreen from '../screens/SalesHistoryScreen';
import { COLORS, FONT_FAMILY } from '../constants/busConfig';

// ── Route Params Type ───────────────────────────
export type RootStackParamList = {
  SeatSelection: undefined;
  SalesHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ── Shared Header Options ───────────────────────
const sharedScreenOptions = {
  headerStyle: {
    backgroundColor: COLORS.primary,
  },
  headerTintColor: COLORS.textOnDark,
  headerTitleStyle: {
    fontFamily: FONT_FAMILY,
    fontWeight: '700' as const,
    fontSize: 18,
  },
  headerBackTitleVisible: false,
  contentStyle: {
    backgroundColor: COLORS.background,
  },
};

// ── Navigator ───────────────────────────────────
export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SeatSelection"
        screenOptions={sharedScreenOptions}
      >
        <Stack.Screen
          name="SeatSelection"
          component={SeatSelectionScreen}
          options={{
            title: 'TrekBus – Pilih Kursi',
          }}
        />
        <Stack.Screen
          name="SalesHistory"
          component={SalesHistoryScreen}
          options={{
            title: 'Riwayat Pemesanan',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
