import { Redirect, Stack } from "expo-router";
import React from "react";

import { AppLoadingIndicator } from "@/src/components/app-loading";
import AnimationScreen from "@/src/components/start_animated_screen/AnimatedScreen";
import { useAppAuth } from "@/hooks/useAppAuth";

export default function MainLayout() {
  const { isAppAuthenticated, isLoading } = useAppAuth();

  if (isLoading) {
    return <AppLoadingIndicator />;
  }

  if (!isAppAuthenticated) {
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