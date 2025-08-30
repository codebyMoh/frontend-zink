import { Stack } from "expo-router";
import AnimationScreen from "../components/start_animated_screen/AnimatedScreen";

export default function TabsLayout() {
  return (
    <AnimationScreen>
      {/* <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "Home", headerShown: false }}
        />
        <Stack.Screen
          name="login"
          options={{ title: "Login", headerShown: false }}
        />
        <Stack.Screen
          name="signup"
          options={{ title: "Signup", headerShown: false }}
        />
        <Stack.Screen
          name="forgot_password"
          options={{ title: "forgot_password", headerShown: false }}
        />
        <Stack.Screen
          name="history"
          options={{ title: "history", headerShown: false }}
        />
        <Stack.Screen
          name="otp_verification"
          options={{ title: "otp_verification", headerShown: false }}
        />
        <Stack.Screen
          name="pay"
          options={{ title: "pay", headerShown: false }}
        />
        <Stack.Screen
          name="scan_qr"
          options={{ title: "scan_qr", headerShown: false }}
        />
        <Stack.Screen
          name="search_people"
          options={{ title: "search_people", headerShown: false }}
        />
        <Stack.Screen
          name="share_qr"
          options={{ title: "share_qr", headerShown: false }}
        />
        <Stack.Screen
          name="success_tx"
          options={{ title: "success_tx", headerShown: false }}
        />
      </Stack> */}
      <Stack screenOptions={{ headerShown: false }} />
    </AnimationScreen>
  );
}
