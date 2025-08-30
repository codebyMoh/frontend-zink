import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function QrScan() {
  const [torchOn, setTorchOn] = useState(false);
  const [scanned, setScanned] = useState(false);
  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    console.log("QR Data:", data);
    setScanned(true);
    // Linking.openURL(data).catch(() => {});
    router.push("/pay");
  };

  // upload image and scan the qr code
  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission required to access gallery");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Camera background */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
        enableTorch={torchOn}
      />

      {/* Top bar (close / flash / qr icons) */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topIcon}
          onPress={() => router.push("/")}
        >
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>

        <View style={styles.topRight}>
          {/* Flashlight toggle */}
          <TouchableOpacity
            style={styles.topIcon}
            onPress={() => setTorchOn((prev) => !prev)}
          >
            <Ionicons
              name={torchOn ? "flash" : "flash-off"}
              size={26}
              color={torchOn ? "#ebde6dff" : "#fff"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topIcon}
            onPress={() => router.push("/share_qr")}
          >
            <Ionicons name="qr-code" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Centered QR frame */}
      <View style={styles.frameWrap}>
        <View style={styles.frameBox}>
          <View style={styles.frameInner} />
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>

        {/* Upload pill overlapping bottom-center of the frame */}
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => handlePickImage()}
        >
          <Ionicons name="image-outline" size={16} color="#000" />
          <Text style={styles.uploadText}>Upload from gallery</Text>
        </TouchableOpacity>
      </View>
      {/* <Bottom /> */}
    </SafeAreaView>
  );
}

/* Styles - tweak sizes/colors to taste */
const FRAME_SIDE_MARGIN = 0.12;
const FRAME_WIDTH = width * (1 - FRAME_SIDE_MARGIN * 2);
const FRAME_HEIGHT = Math.min(360, FRAME_WIDTH);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", height: "100%" },

  topBar: {
    position: "absolute",
    top: 45,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topIcon: {
    padding: 6,
  },
  topRight: { flexDirection: "row", alignItems: "center" },

  frameWrap: {
    position: "absolute",
    top: "12%",
    left: FRAME_SIDE_MARGIN * width,
    right: FRAME_SIDE_MARGIN * width,
    alignItems: "center",
  },

  frameBox: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    borderRadius: 18,
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
  },

  frameInner: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  corner: {
    position: "absolute",
    width: 52,
    height: 52,
  },
  cornerTL: {
    top: -6,
    left: -6,
    borderTopWidth: 6,
    borderLeftWidth: 6,
    borderTopLeftRadius: 12,
    borderTopColor: "#7CFC00",
    borderLeftColor: "#7CFC00",
  },
  cornerTR: {
    top: -6,
    right: -6,
    borderTopWidth: 6,
    borderRightWidth: 6,
    borderTopRightRadius: 12,
    borderTopColor: "#7CFC00",
    borderRightColor: "#7CFC00",
  },
  cornerBL: {
    bottom: -6,
    left: -6,
    borderBottomWidth: 6,
    borderLeftWidth: 6,
    borderBottomLeftRadius: 12,
    borderBottomColor: "#7CFC00",
    borderLeftColor: "#7CFC00",
  },
  cornerBR: {
    bottom: -6,
    right: -6,
    borderBottomWidth: 6,
    borderRightWidth: 6,
    borderBottomRightRadius: 12,
    borderBottomColor: "#7CFC00",
    borderRightColor: "#7CFC00",
  },

  uploadBtn: {
    position: "absolute",
    bottom: -100,
    alignSelf: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  uploadText: { color: "#000", fontWeight: "600", fontSize: 14 },
});
