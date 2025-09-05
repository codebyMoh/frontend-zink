import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function AuthLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="sign-in" />
			<Stack.Screen
				name="otp-verification"
				options={{
					presentation: Platform.OS === "ios" ? "formSheet" : "containedTransparentModal",
					animation: Platform.OS === "android" ? "slide_from_bottom" : "default",
				}}
			/>
		</Stack>
	);
}