# Bus Seat Booking (TrekBus)

LINK INSTALL APK
- Google Drive (APK): https://drive.google.com/drive/folders/1xHONWZ8_DkybOM6LC2BZdjL7V3ocotF5?usp=sharing
- GitHub repo: https://github.com/Krisnanda7

---


AUTHOR: I DEWA GEDE MAS BAGUS KRISNANDA
- Email: baguskrisna424@gmail.com

Brief description
-----------------
This project is a mobile application for bus seat booking (built with React Native + Expo). The app supports selecting bus type (Regular / Express), choosing a departure date, selecting seats, storing bookings locally using AsyncStorage, and viewing a simple sales history.

Main features
-------------
- Choose bus type: Regular (20 seats) or Express (12 seats)
- Select departure date (date picker)
- Select / deselect seats (max 5 seats per transaction)
- Live price updates based on selected seats
- Save bookings locally and view sales history

Prerequisites
-------------
- Node.js (LTS recommended)
- npm or yarn
- Expo CLI (optional for development): `npm install -g expo-cli`
- For building APK: EAS CLI (`npm install -g eas-cli`)

Installation & Running (Development)
-----------------------------------
1. Clone the repository (or download ZIP from GitHub):

```bash
git clone https://github.com/REPLACE-WITH-YOUR-GITHUB.git
cd BusSeatBooking
```

2. Install dependencies:

```bash
npm install
# or
# yarn install
```

3. Start the app (Expo web / device):

```bash
npx expo start
```

Build APK (EAS - recommended)
----------------------------
1. Install EAS CLI and login:

```bash
npm install -g eas-cli
eas login
```

2. Configure EAS for this project (if not configured yet):

```bash
eas build:configure
```

3. Start an Android build (preview/debug APK):

```bash
eas build -p android --profile preview
```

After the build completes, download the APK from the provided EAS link or upload the APK to Google Drive for distribution.

Note: If you prefer not to use EAS, run `npx expo prebuild` and open the native project in Android Studio to generate an APK locally.

Project structure (brief)
-------------------------
- `App.tsx` – entry point
- `src/screens/SeatSelectionScreen.tsx` – seat selection screen
- `src/screens/SalesHistoryScreen.tsx` – sales history screen
- `src/storage/bookingStorage.ts` – local storage helper
- `src/constants/busConfig.ts` – layout, pricing, colors, design tokens


