import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Share,
} from "react-native";

export default function TransactionSuccessScreen() {

  const params = useLocalSearchParams();
  const amount = params.amount || "0.00";
  const recipient = params.recipient as string || "Lance Whitney";
  const transactionHash = params.transactionHash as string;
  const transactionType = params.transactionType as 'sent' | 'received';
  const date = params.date || new Date().toLocaleDateString();

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
      const message = `I just sent ${amount} USDC to ${recipient} using crypto! 💰\n\nTransaction: https://basescan.org/tx/${transactionHash}`;

      await Share.share({
        message,
        title: "Transaction Details",
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

<View style={styles.header}>
  <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
    <AntDesign name="arrowleft" size={28} color="black" />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>ZINK</Text>
  <View style={styles.placeholder} />
</View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
  <View style={styles.successCircle}>
    <Text style={styles.recipientInitial}>
      {recipient.charAt(0).toUpperCase()}
    </Text>
  </View>
</View>

        <View style={styles.textContainer}>
  <Text style={styles.title}>
    {transactionType === 'sent' ? 'To' : 'From'} {recipient}
  </Text>
  <Text style={styles.email}>{recipient.toLowerCase().replace(' ', '')}@zink.app</Text>
  <Text style={styles.amountText}>{amount} USDC</Text>
  {params.message && <Text style={styles.messageText}>{params.message}</Text>}
  
  <View style={styles.statusRow}>
    <AntDesign name="checkcircle" size={16} color="#34C759" />
    <Text style={styles.completedText}>Completed</Text>
  </View>
  
  <View style={styles.divider} />
  <Text style={styles.dateText}>{date}</Text>
</View>

        {/* Transaction Details Card */}
       <View style={styles.detailsCard}>
  <Text style={styles.detailsTitle}>Transaction Details</Text>

  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Amount:</Text>
    <Text style={styles.detailValue}>{amount} USDC</Text>
  </View>

  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Recipient:</Text>
    <Text style={styles.detailValue}>{recipient}</Text>
  </View>

  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Network:</Text>
    <Text style={styles.detailValue}>Base Mainnet</Text>
  </View>

  <View style={styles.detailRow}>
  <Text style={styles.detailLabel}>Date:</Text>
  <Text style={styles.detailValue}>{date}</Text>
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

  <View style={styles.statusBadge}>
    <Ionicons name="checkmark-circle" size={16} color="#34C759" />
    <Text style={styles.statusText}>Confirmed on Base</Text>
  </View>
</View>

        {/* Action Buttons */}
        <View
          style={[
            styles.actionButtons
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
        </View>
      </View>

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
  header: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 20,
  paddingVertical: 15,
  borderBottomWidth: 1,
  borderBottomColor: "#f0f0f0",
},
backButton: {
  padding: 5,
},
headerTitle: {
  flex: 1,
  textAlign: "center",
  fontSize: 18,
  fontWeight: "600",
  color: "#34C759",
},
placeholder: {
  width: 38,
},
recipientInitial: {
  fontSize: 32,
  fontWeight: "bold",
  color: "#fff",
},
email: {
  fontSize: 14,
  color: "#666",
  marginBottom: 20,
},
messageText: {
  fontSize: 16,
  color: "#666",
  textAlign: "center",
  marginBottom: 20,
  fontStyle: "italic",
},
statusRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 10,
},
completedText: {
  fontSize: 16,
  color: "#34C759",
  fontWeight: "600",
  marginLeft: 6,
},
divider: {
  height: 1,
  backgroundColor: "#e0e0e0",
  width: "100%",
  marginBottom: 10,
},
dateText: {
  fontSize: 14,
  color: "#666",
  textAlign: "center",
},
});