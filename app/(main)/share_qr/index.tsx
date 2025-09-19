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
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import QRCodeSvg from "react-native-qrcode-svg";
import Toast from "react-native-toast-message";
import ViewShot from "react-native-view-shot";
import * as Clipboard from "expo-clipboard";
import { editPaymentId } from "@/services/api/user";
import { useSmartAccountClient } from "@account-kit/react-native";
import { parseAbi } from "viem";

interface BalanceState {
  usdc: string;
  isLoading: boolean;
}

export default function ShareQRCodeScreen() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [actualUserName, setActualUserName] = useState<string>("");
  const [paymentId, setPaymentId] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editablePaymentId, setEditablePaymentId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isPaymentIdEdited, setIsPaymentIdEdited] = useState(false);
  const viewShotRef = useRef<string | any>(null);

  const [balances, setBalances] = useState<BalanceState>({
    usdc: "0",
    isLoading: true,
  });

  const { client } = useSmartAccountClient({
    type: "ModularAccountV2",
  });
  const account = client?.account;

  // TODO: add this in env
  const BASE_USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

  // load balance
  const loadBalances = async () => {
    if (!client || !account?.address) return;

    try {
      setBalances((prev) => ({ ...prev, isLoading: true }));

      // get USDC balance
      const smartAccountUsdcBalance = await client.readContract({
        address: BASE_USDC,
        abi: parseAbi([
          "function balanceOf(address owner) view returns (uint256)",
        ]),
        functionName: "balanceOf",
        args: [account.address],
      });

      const smartUsdcFormatted = (
        Number(smartAccountUsdcBalance) / 1e6
      ).toFixed(3);
      setBalances({
        usdc: parseFloat(smartUsdcFormatted).toFixed(3),
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load balances:", error);
      setBalances((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // formate balance for display
  const formatBalanceForDisplay = (balance: string) => {
    const [whole, decimal] = balance.split(".");
    return {
      whole: whole || "0",
      decimal: decimal || "00",
    };
  };

  const displayBalance = formatBalanceForDisplay(balances.usdc);
  // handle set amount
  function handleSetAmount() {
    if (!actualUserName || !userId) {
      Toast.show({
        type: "error",
        text1: "Set amount",
        text2: "userid or username not found.",
      });
      return;
    }
    router.push({
      pathname: "/request_payment",
      params: {
        userId: userId,
        userName: actualUserName,
      },
    });
  }

  // get userdata
  const getUserData = async () => {
    const userData = await TokenManager.getUserData();
    if (userData?._id) {
      setUserId(userData?._id || null);
      setActualUserName(userData?.userName || "");
      setPaymentId(userData?.paymentId || "");
      setIsPaymentIdEdited(userData?.isPaymentIdEdited || false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (client && account?.address) {
      loadBalances();
    }
  }, [client, account?.address]);

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

  const handleCopyPaymentId = async () => {
    try {
      await Clipboard.setStringAsync(paymentId);
      Toast.show({
        type: "success",
        text1: "Copied!",
        text2: "Payment ID copied to clipboard",
      });
    } catch (error) {
      console.log("Error copying paymentId:", error);
    }
  };

  const handleEditPaymentId = async () => {
    if (isPaymentIdEdited) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "You can only edit paymentId once.",
      });
      return;
    }

    const usernameWithoutZink = paymentId?.replace(".zink", "") || "";
    setEditablePaymentId(usernameWithoutZink);
    setShowEditModal(true);
  };

  const handleSavePaymentId = async () => {
    try {
      setIsEditing(true);
      const response = await editPaymentId(editablePaymentId);

      setPaymentId(`${editablePaymentId}.zink`);
      setIsPaymentIdEdited(true);

      const userData = await TokenManager.getUserData();
      if (userData) {
        userData.paymentId = `${editablePaymentId}.zink`;
        userData.isPaymentIdEdited = true;
        await TokenManager.saveUserData(userData);
      }

      setShowEditModal(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Payment ID updated successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back and download buttons */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <AntDesign
            name="arrowleft"
            size={28}
            color="black"
            onPress={() => router.back()}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDownloadQR}>
          {isDownloading ? (
            <ActivityIndicator size={24} color="black" />
          ) : (
            <Octicons name="download" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>

      {/* Main Card for Display - Contains all interactive elements */}
      <View style={styles.card}>
        {/* Content to be shared - Wrapped in ViewShot */}
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
          <View style={styles.shareableCardContent}>
            {" "}
            {/* New style for the shareable portion */}
            <View style={styles.profileSection}>
              <View style={styles.profileInitialCircle}>
                <Text style={styles.profileInitialText}>
                  {actualUserName?.charAt(0)?.toUpperCase() || "Z"}
                </Text>
              </View>
              <Text style={styles.profileName}>
                {actualUserName || "Your Name"}
              </Text>
            </View>
            <View style={styles.qrCodeWrapper}>
              <View style={styles.qrContainer}>
                {userId && (
                  <QRCodeSvg
                    value={JSON.stringify({ userId: userId })}
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
              <Text style={styles.scanInstructionText}>
                Scan to pay with any ZINK app
              </Text>
            </View>
          </View>
        </ViewShot>

        {/* Payment ID details and Balance/Set Amount - These are NOT part of the shared image */}
        <View style={styles.paymentIdDetails}>
          <Text style={styles.paymentIdLabel}>Payment ID:</Text>
          <Text style={styles.paymentIdText}>{paymentId}</Text>
          <TouchableOpacity
            onPress={handleCopyPaymentId}
            style={styles.actionButton}
          >
            <MaterialCommunityIcons
              name="content-copy"
              size={20}
              color="#666"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleEditPaymentId}
            style={styles.actionButton}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceButtonsContainer}>
          <TouchableOpacity
            style={[styles.balanceButton, styles.greenBackground]}
            disabled={true}
          >
            <Image
              source={require("../../../assets/images/token/usdc.png")}
              style={styles.usdcIcon}
            />
            {balances.isLoading ? (
              <ActivityIndicator color="#2E7D32" size="small" />
            ) : (
              <Text style={styles.balanceAmount}>
                {displayBalance.whole}
                <Text style={styles.balanceDecimal}>
                  .{displayBalance.decimal}
                </Text>
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.balanceButton, styles.whiteBackground]}
            onPress={() => handleSetAmount()}
          >
            <Text style={styles.setAmountText}>Set amount</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.scannerButton}
          onPress={() => router.replace("/scan_qr")}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
          <Text style={styles.scannerButtonText}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={handleShareQR}>
          <MaterialCommunityIcons name="share-variant" size={24} color="#fff" />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Payment ID Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Payment ID</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={editablePaymentId}
                onChangeText={setEditablePaymentId}
                placeholder="Enter username"
                maxLength={20}
              />
              <Text style={styles.zinkSuffix}>.zink</Text>
            </View>
            <Text style={styles.modalNote}>
              Payment ID can only be edited once and must be 6-20 characters.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSavePaymentId}
                disabled={isEditing || editablePaymentId.length < 6}
              >
                {isEditing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Toast />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    paddingRight: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 15,
    elevation: 5,
    width: "100%",
    minHeight: 500,
  },
  // New style for the content that is specifically for sharing
  shareableCardContent: {
    backgroundColor: "white", // Explicitly set white background for sharing
    borderRadius: 20,
    alignItems: "center",
    padding: 15,
    width: "100%",
    // Remove shadow and elevation here as they are on the parent `card` for overall app display
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  profileInitialCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  profileInitialText: {
    color: "#4a4a4a",
    fontSize: 28,
    fontWeight: "bold",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  qrCodeWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 2,
  },
  scanInstructionText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
  paymentIdDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginBottom: 20,
    width: "100%",
  },
  paymentIdLabel: {
    fontSize: 14,
    color: "#888",
    marginRight: 5,
  },
  paymentIdText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  balanceButtonsContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  balanceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "90%",
    marginBottom: 10,
  },
  greenBackground: {
    backgroundColor: "#e4ecf7ff",
  },
  whiteBackground: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  usdcIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  setAmountText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a4a4a",
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A73E8",
  },
  balanceDecimal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A73E8",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    backgroundColor: "#1A73E8",
    borderRadius: 30,
    padding: 18,
    alignItems: "center",
    marginLeft: 10,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  scannerButton: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    borderColor: "#e0e0e0",
    borderWidth: 2,
    borderRadius: 30,
    padding: 18,
    alignItems: "center",
    marginRight: 10,
  },
  scannerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  zinkSuffix: {
    fontSize: 16,
    color: "#999",
    paddingLeft: 5,
  },
  modalNote: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    marginRight: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 15,
    marginLeft: 10,
    borderRadius: 12,
    backgroundColor: "#5abb5e",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
  },
  saveButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});
