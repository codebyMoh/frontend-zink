import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Redirect, Stack, useRouter } from "expo-router";
import { Pressable, Platform, View, StyleSheet } from "react-native";

import { useSignerStatus } from "@account-kit/react-native";
import { AlchemySignerStatus } from "@account-kit/signer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppLoadingIndicator } from "@/src/components/app-loading";

export default function MainLayout() {
	const { status, isAuthenticating } = useSignerStatus();
	const { top } = useSafeAreaInsets();
	const router = useRouter();

	if (isAuthenticating) {
		return <AppLoadingIndicator />;
	}

	if (status === AlchemySignerStatus.DISCONNECTED) {
		return <Redirect href="/(auth)/sign-in" />;
	}

	return (
		 <Stack screenOptions={{ headerShown: false }} />
		 
	);
}

const styles = StyleSheet.create({
	menuHeaderContainer: {
		width: "100%",
		backgroundColor: "white",
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	header: {
		width: "100%",
		backgroundColor: "white",
		paddingVertical: 10,
		paddingHorizontal: 10,
		shadowColor: "#585757",
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.2,
		shadowRadius: 5.62,
		elevation: 8,
	},
	closeButtonWrapper: {
		width: 35,
		height: 35,
		alignItems: "center",
		justifyContent: "center",
		marginLeft: "auto",
		borderRadius: 10,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "rgba(10, 10, 10, 0.5)",
	},
});

// import { AppLoadingIndicator } from "@/src/components/app-loading";
// import AnimationScreen from "@/src/components/start_animated_screen/AnimatedScreen";
// import { useSignerStatus } from "@account-kit/react-native";
// import { AlchemySignerStatus } from "@account-kit/signer";
// import { Redirect, Stack } from "expo-router";

// export default function TabsLayout() {
// 	const { status, isAuthenticating } = useSignerStatus();

// 		if (isAuthenticating) {
// 		return <AppLoadingIndicator />;
// 	}
// 		if (status === AlchemySignerStatus.DISCONNECTED) {
// 		return <Redirect href="/(auth)/sign-in" />;
// 	}

//   return (
//     <AnimationScreen>
//       {/* <Stack>
//         <Stack.Screen
//           name="index"
//           options={{ title: "Home", headerShown: false }}
//         />
//         <Stack.Screen
//           name="login"
//           options={{ title: "Login", headerShown: false }}
//         />
//         <Stack.Screen
//           name="signup"
//           options={{ title: "Signup", headerShown: false }}
//         />
//         <Stack.Screen
//           name="forgot_password"
//           options={{ title: "forgot_password", headerShown: false }}
//         />
//         <Stack.Screen
//           name="history"
//           options={{ title: "history", headerShown: false }}
//         />
//         <Stack.Screen
//           name="otp_verification"
//           options={{ title: "otp_verification", headerShown: false }}
//         />
//         <Stack.Screen
//           name="pay"
//           options={{ title: "pay", headerShown: false }}
//         />
//         <Stack.Screen
//           name="scan_qr"
//           options={{ title: "scan_qr", headerShown: false }}
//         />
//         <Stack.Screen
//           name="search_people"
//           options={{ title: "search_people", headerShown: false }}
//         />
//         <Stack.Screen
//           name="share_qr"
//           options={{ title: "share_qr", headerShown: false }}
//         />
//         <Stack.Screen
//           name="success_tx"
//           options={{ title: "success_tx", headerShown: false }}
//         />
//       </Stack> */}
	  
//       <Stack screenOptions={{ headerShown: false }} />
//     </AnimationScreen>
//   );
// }
