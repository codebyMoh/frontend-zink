import { Redirect, Stack } from "expo-router";
import React from "react";

import { AppLoadingIndicator } from "@/src/components/app-loading";
import AnimationScreen from "@/src/components/start_animated_screen/AnimatedScreen";
import { useSignerStatus } from "@account-kit/react-native";
import { AlchemySignerStatus } from "@account-kit/signer";

export default function MainLayout() {
  const { status, isAuthenticating } = useSignerStatus();
  if (isAuthenticating) {
    return <AppLoadingIndicator />;
  }

  if (status === AlchemySignerStatus.DISCONNECTED) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <AnimationScreen>
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
      />
    </AnimationScreen>
  );
}
