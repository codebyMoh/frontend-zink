import "react-native-get-random-values";
// Add global shims
import "@account-kit/react-native";
import "react-native-reanimated";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AlchemyAuthSessionProvider } from "@src/context/AlchemyAuthSessionProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(main)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <AlchemyAuthSessionProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            paddingTop: 0,
            paddingBottom: 0,
            margin: 0,
            marginTop: 0,
          },
        }}
      >
        {/* Authentication Flow */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* Main App Flow */}
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
      </Stack>
    </AlchemyAuthSessionProvider>
  );
}
