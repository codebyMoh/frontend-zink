import { TokenManager } from "@/services/tokenManager";
import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCodeSvg from "react-native-qrcode-svg";
import Toast from "react-native-toast-message";
import ViewShot from "react-native-view-shot";

export default function ShareQRCodeScreen() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const viewShotRef = useRef<string | any>(null);

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

  const getUserData = async () => {
    const userData = await TokenManager.getUserData();
    if (userData?._id) {
      setUserId(userData?._id || null);
      setUserName(userData?.userName || null);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton}>
        <AntDesign
          name="arrowleft"
          size={28}
          color="black"
          onPress={() => router.back()}
        />
        {isDownloading ? (
          <ActivityIndicator size={24} color="black" />
        ) : (
          <Octicons
            onPress={handleDownloadQR}
            name="download"
            size={24}
            color="black"
          />
        )}
      </TouchableOpacity>
      <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
        <View style={styles.card}>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.qrContainer}>
            {userId && (
              <QRCodeSvg
                value={userId}
                size={220}
                color="black"
                backgroundColor="white"
                logo={require("../../../assets/images/logos/Zink-Qr-Logo.png")}
                logoSize={50}
                logoBackgroundColor="white"
                logoBorderRadius={25}
              />
            )}
          </View>
        </View>
      </ViewShot>
      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.scannerButton}
          onPress={() => router.replace("/scan_qr")}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
          <Text style={styles.scannerButtonText}>Open scanner</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={handleShareQR}>
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
    paddingHorizontal: 10,
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
