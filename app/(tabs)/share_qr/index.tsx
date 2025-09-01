import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
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

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Header */}
      <TouchableOpacity style={styles.backButton}>
        <AntDesign
          name="arrowleft"
          size={28}
          color="black"
          onPress={() => router.back()}
        />
        <Octicons name="download" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.userName}>{userName}</Text>

        <View style={styles.qrContainer}>
          <QRCodeSvg
            value={walletAddress}
            size={220}
            color="black"
            backgroundColor="white"
            logo={require("../../../assets/images/logos/Zink-Logo.png")}
            logoSize={80}
            logoMargin={0}
            logoBackgroundColor="white"
            logoBorderRadius={40}
          />
        </View>

        <Text style={styles.walletText}>Id: 97AdAdf0e5C4606BB5f7</Text>
      </View>
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.scannerButton}
          onPress={() => router.push("/scan_qr")}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
          <Text
            style={styles.scannerButtonText}
            onPress={() => router.push("/scan_qr")}
          >
            Open scanner
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <MaterialCommunityIcons name="share-variant" size={24} color="#fff" />
          <Text style={styles.shareButtonText}>Share QR code</Text>
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
    justifyContent: "space-between",
  },
  backButton: {
    padding: 10,
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    alignItems: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  walletText: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  shareButton: {
    width: "45%",
    display: "flex",
    flexDirection: "row",
    gap: 3,
    justifyContent: "center",
    backgroundColor: "#5abb5eff",
    borderRadius: 30,
    padding: 12,
    marginBottom: 8,
    marginHorizontal: 5,
    paddingVertical: 15,
    alignItems: "center",
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  scannerButton: {
    width: "45%",
    display: "flex",
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    borderColor: "#f0f0f0",
    borderWidth: 3,
    borderRadius: 30,
    padding: 12,
    marginBottom: 8,
    marginHorizontal: 5,
    paddingVertical: 15,
    alignItems: "center",
  },
  scannerButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
});
