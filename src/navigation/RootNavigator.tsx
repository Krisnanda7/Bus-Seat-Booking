import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import SalesHistoryScreen from '../screens/SalesHistoryScreen';
import { COLORS, FONT_FAMILY } from '../constants/busConfig';

// Root stack navigator parameter list
export type RootStackParamList = {
  SeatSelection: undefined;
  SalesHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Shared screen options untuk semua layar di RootNavigator, termasuk header dan background
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

// Root navigator component untuk mengatur navigasi antara layar SeatSelection dan SalesHistory
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
