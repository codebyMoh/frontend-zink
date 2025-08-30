import { AntDesign } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Animated,
    Easing,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function TransactionSuccessScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current; // For icon scale animation
  const opacityAnim = useRef(new Animated.Value(0)).current; // For text fade-in animation

  // Get parameters if passed from PaymentScreen
  const params = useLocalSearchParams();
  const amount = params.amount || "0.00";
  const recipient = params.recipient || "Lance Whitney"; // Default recipient if not passed

  useEffect(() => {
    // Sequence animations for a smooth effect
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500, // Scale up in 0.5 seconds
        easing: Easing.out(Easing.ease), // Smooth deceleration
        useNativeDriver: true, // Use native driver for performance
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300, // Fade in text in 0.3 seconds
        delay: 100, // Start fading text slightly after icon scales
        useNativeDriver: true, // Use native driver for performance
      }),
    ]).start(); // Start the animation sequence
  }, [scaleAnim, opacityAnim]); // Depend on animation values

  const handleGoHome = () => {
    router.replace("/"); // Navigate back to the main home screen, replacing history
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Hide the default Expo Router header for this screen */}
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        {/* Animated Checkmark Icon */}
        <Animated.View
          style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}
        >
          <AntDesign name="checkcircleo" size={100} color="#34C759" />
        </Animated.View>

        {/* Animated Success Message Title */}
        <Animated.Text style={[styles.title, { opacity: opacityAnim }]}>
          Payment Sent Successfully!
        </Animated.Text>

        {/* Animated Transaction Details Subtitle */}
        <Animated.Text style={[styles.subtitle, { opacity: opacityAnim }]}>
          You have successfully sent
          <Text style={styles.amountText}> ${amount}</Text> to{" "}
          <Text style={styles.recipientText}>{recipient}</Text>.
        </Animated.Text>

        {/* Go to Home Button */}
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Light theme background
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    padding: 20,
  },
  content: {
    flex: 1, // Allow content to take up space and center vertically
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: 400, // Limit width on larger screens for better aesthetics
  },
  iconContainer: {
    marginBottom: 30, // Space below the icon
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
    textAlign: "center",
    paddingHorizontal: 20, // Padding for text readability
  },
  amountText: {
    fontWeight: "bold",
    color: "#34C759", // Green, consistent with your theme for positive values
  },
  recipientText: {
    fontWeight: "bold",
    color: "#000", // Black for recipient name
  },
  homeButton: {
    backgroundColor: "#34C759", // Green, consistent with your theme
    borderRadius: 15,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000", // Subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
