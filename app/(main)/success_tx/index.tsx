import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Share,
} from "react-native";

export default function TransactionSuccessScreen() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Get parameters passed from confirmation screen
  const params = useLocalSearchParams();
  const amount = params.amount || "0.00";
  const recipient = params.recipient || "Lance Whitney";
  const transactionHash = params.transactionHash as string;
  const userOpHash = params.userOpHash as string;

  useEffect(() => {
    // Enhanced animation sequence
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [scaleAnim, opacityAnim, slideAnim]);

  const handleGoHome = () => {
    router.replace("/");
  };

  const handleViewOnExplorer = () => {
    if (transactionHash) {
      const explorerUrl = `https://basescan.org/tx/${transactionHash}`;
      Linking.openURL(explorerUrl);
    }
  };

  const handleShare = async () => {
    try {
      const message = `I just sent $${amount} USDC to ${recipient} using crypto! 💰\n\nTransaction: https://basescan.org/tx/${transactionHash}`;
      
      await Share.share({
        message,
        title: "Payment Sent Successfully!",
      });
    } catch (error) {
      console.log("Share failed:", error);
    }
  };

  const formatHash = (hash: string) => {
    if (!hash) return "";
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        {/* Animated Success Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <View style={styles.successCircle}>
            <AntDesign name="check" size={50} color="#fff" />
          </View>
        </Animated.View>

        {/* Animated Content */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: opacityAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Payment Sent Successfully!</Text>
          <Text style={styles.subtitle}>
            You have successfully sent{" "}
            <Text style={styles.amountText}>${amount} USDC</Text> to{" "}
            <Text style={styles.recipientText}>{recipient}</Text>.
          </Text>
        </Animated.View>

        {/* Transaction Details Card */}
       <View style={styles.detailsCard}>
  <Text style={styles.detailsTitle}>Transaction Details</Text>
  
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Amount:</Text>
    <Text style={styles.detailValue}>${amount} USDC</Text>
  </View>
  
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Recipient:</Text>
    <Text style={styles.detailValue}>{recipient}</Text>
  </View>
  
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Network:</Text>
    <Text style={styles.detailValue}>Base Mainnet</Text>
  </View>
  
  {transactionHash && (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>Transaction Hash:</Text>
      <TouchableOpacity onPress={handleViewOnExplorer}>
        <Text style={styles.hashLink}>
          {formatHash(transactionHash)} ↗
        </Text>
      </TouchableOpacity>
    </View>
  )}

  {userOpHash && userOpHash !== transactionHash && (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>User Op Hash:</Text>
      <Text style={[styles.detailValue, { fontFamily: "monospace", fontSize: 12 }]}>
        {formatHash(userOpHash)}
      </Text>
    </View>
  )}

  <View style={styles.statusBadge}>
    <Ionicons name="checkmark-circle" size={16} color="#34C759" />
    <Text style={styles.statusText}>Confirmed on Base</Text>
  </View>
</View>

        {/* Action Buttons */}
        <Animated.View
          style={[
            styles.actionButtons,
            {
              opacity: opacityAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color="#34C759" />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>

          {transactionHash && (
            <TouchableOpacity style={styles.explorerButton} onPress={handleViewOnExplorer}>
              <Ionicons name="open-outline" size={20} color="#007AFF" />
              <Text style={styles.explorerButtonText}>View on Explorer</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>

      {/* Home Button */}
      <Animated.View
        style={[
          styles.bottomButton,
          {
            opacity: opacityAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#34C759",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  amountText: {
    fontWeight: "bold",
    color: "#34C759",
  },
  recipientText: {
    fontWeight: "bold",
    color: "#000",
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
  hashLink: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
    fontFamily: "monospace",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f8f0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 16,
  },
  statusText: {
    fontSize: 14,
    color: "#34C759",
    fontWeight: "600",
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8f0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#34C759",
  },
  shareButtonText: {
    fontSize: 14,
    color: "#34C759",
    fontWeight: "600",
    marginLeft: 6,
  },
  explorerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  explorerButtonText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
    marginLeft: 6,
  },
  bottomButton: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  homeButton: {
    backgroundColor: "#34C759",
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});