import { AntDesign } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Stack, router } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCodeSvg from "react-native-qrcode-svg";

export default function ShareQRCodeScreen() {
  const walletAddress = "0xE947D41FC4459818f8697AdAdf0e5C4606BB5f73";
  const userName = "meetdesai10";

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(walletAddress);
    console.log("Wallet address copied to clipboard!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={28} color="black" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Scan to Pay {userName}</Text>
        <Text style={styles.subtitle}>Show this QR code to receive money</Text>

        <View style={styles.qrCodeContainer}>
          {/* QR Code Generator */}
          <QRCodeSvg
            value={walletAddress}
            size={200}
            color="black"
            backgroundColor="white"
          />
        </View>

        <Text style={styles.walletAddressText}>{walletAddress}</Text>
        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
          <Text style={styles.copyButtonText}>Copy Wallet Address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    padding: 10,
    marginTop: 20,
  },
  header: {
    width: "100%",
    alignItems: "flex-start",
    marginTop: 20,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  qrCodeContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 30,
  },
  walletAddressText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  copyButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  copyButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
