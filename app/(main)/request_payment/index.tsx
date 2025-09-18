import {
  AntDesign,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCodeSvg from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import Toast from "react-native-toast-message";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
export default function PaymentScreen() {
  const [amount, setAmount] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const params = useLocalSearchParams();
  const viewShotRef = useRef<string | any>(null);
  const userId = params.userId as string;
  const userName = (params?.userName as string) || "Unknown User";

  async function generateQrCode() {
    if (showQr) {
      return;
    }
    if (!userId || !amount) {
      Alert.alert("UserId or amount required.");
      return;
    }
    setShowQr(true);
  }
  const handleDownloadQR = async () => {
    try {
      setIsDownloading(true);
      const uri = await viewShotRef.current.capture();

      await MediaLibrary.requestPermissionsAsync();
      await MediaLibrary.saveToLibraryAsync(uri);

      Toast.show({
        type: "success",
        text1: "QR Downloaded",
        text2: "Saved to gallery",
      });
    } catch (error) {
      console.log("Error saving QR:", error);
    } finally {
      setIsDownloading(false); // back to icon
    }
  };

  const handleShareQR = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log("Error sharing QR:", error);
    }
  };
  useEffect(() => {
    setShowQr(false);
  }, [amount]);
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receive Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.amountSection}>
          <Text style={styles.sectionLabel}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <Text style={styles.currency}>USDC</Text>
          </View>
        </View>
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <AntDesign name="exclamationcircleo" size={16} color="#ff4444" />
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
        ) : null}
        {showQr && (
          <>
            <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
              <View style={styles.card}>
                <View style={styles.profileSection}>
                  <View style={styles.profileInitialCircle}>
                    <Text style={styles.profileInitialText}>
                      {userName?.charAt(0)?.toUpperCase() || "U"}
                    </Text>
                  </View>
                  <Text style={styles.profileName}>{userName}</Text>
                </View>

                <View style={styles.qrCodeWrapper}>
                  <View style={styles.qrContainer}>
                    <View style={styles.qrContainer}>
                      <QRCodeSvg
                        value={JSON.stringify({
                          userId: userId,
                          amount: amount,
                        })}
                        size={250}
                        color="black"
                        backgroundColor="white"
                        logo={require("../../../assets/images/logos/Zink-Qr-Logo.png")}
                        logoSize={50}
                        logoBackgroundColor="white"
                        logoBorderRadius={25}
                      />
                    </View>
                  </View>
                  <Text style={styles.scanInstructionText}>
                    Scan to pay with any ZINK app
                  </Text>
                </View>
              </View>
            </ViewShot>
            <View style={styles.bottomButtons}>
              <TouchableOpacity
                onPress={handleDownloadQR}
                style={styles.downloadButton}
              >
                {isDownloading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Octicons name="download" size={24} color="#fff" />
                )}
                <Text style={styles.downloadButtonText}>Download QR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShareQR}
              >
                <MaterialCommunityIcons
                  name="share-variant"
                  size={24}
                  color="#fff"
                />
                <Text style={styles.shareButtonText}>Share QR code</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => generateQrCode()}
          style={[
            styles.payButton,
            {
              opacity:
                isLoading || !amount || parseFloat(amount) <= 0 ? 0.5 : 1,
              backgroundColor:
                amount && parseFloat(amount) > 0 ? "#1A73E8" : "#ccc",
            },
          ]}
          disabled={isLoading || !amount || parseFloat(amount) <= 0}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.payButtonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.payButtonText}>
              Generate QR for • {amount || "0.00"} USDC
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  placeholder: {
    width: 38, // Same as back button to center title
  },
  content: {
    flex: 1,
    padding: 20,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#f0f0f0",
  },
  avatarText: {
    fontSize: 24,
    color: "#000",
    fontWeight: "bold",
  },
  name: {
    color: "#000",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  address: {
    color: "#888",
    fontSize: 14,
    fontFamily: "monospace",
  },
  amountSection: {
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: "#e9ecef",
  },
  dollar: {
    fontSize: 28,
    color: "#000",
    marginRight: 8,
    fontWeight: "600",
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    color: "#000",
    textAlign: "left",
    fontWeight: "600",
    paddingVertical: 8,
  },
  currency: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
    backgroundColor: "#e9ecef",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  messageSection: {
    marginBottom: 20,
  },
  messageInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#e9ecef",
    fontSize: 16,
    color: "#000",
    minHeight: 80,
    textAlignVertical: "top",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff5f5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ff4444",
  },
  errorMessage: {
    color: "#ff4444",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8f0",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#34C759",
  },
  infoText: {
    color: "#34C759",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    fontWeight: "500",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  payButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qrCodeWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
  scanInstructionText: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
    textAlign: "center",
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
    width: "100%",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    justifyContent: "center",
  },
  profileInitialCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#9e9e9e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  profileInitialText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
    width: "100%",
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    gap: 3,
    justifyContent: "center",
    backgroundColor: "#1A73E8",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  downloadButton: {
    flex: 1,
    flexDirection: "row",
    gap: 3,
    justifyContent: "center",
    backgroundColor: "#1A73E8",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
