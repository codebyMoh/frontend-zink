import {
  ApiTransaction,
  getTransactionsForTwoUsers,
  recipientuser,
} from "@/services/api/transaction";
import { TokenManager } from "@/services/tokenManager";
import { AntDesign } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PaymentChatScreen() {
  const params = useLocalSearchParams();
  const recipientName = (params.recipientName as string) || "Lacey Turner";
  const recipientId = (params.recipientId as string) || "";

  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [recipientuser, setRecipientuser] = useState<recipientuser>();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userData = await TokenManager.getUserData();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Failed to load current user:", error);
      }
    };
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (recipientId) {
      loadTransactions();
    }
  }, [recipientId]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const apiTransactions = await getTransactionsForTwoUsers(
        1,
        20,
        recipientId
      );
      setTransactions(apiTransactions?.transactions || []);
      setRecipientuser(apiTransactions?.recipientuser);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const generateAvatarColor = (name: string) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const handlePayPress = () => {
    router.push({
      pathname: "/pay",
      params: {
        recipientId: recipientuser?._id,
        recipientName: recipientuser?.userName,
        recipientAddress: recipientuser?.walletAddressEVM,
      },
    });
  };

  const handleRequestPress = () => {
    // TODO: Implement request functionality
    console.log("Request payment from", recipientName);
  };

  const renderTransaction = (transaction: ApiTransaction) => {
    if (!currentUser) return null;

    const isCurrentUserSender = transaction.userId === currentUser._id;
    const transactionType = isCurrentUserSender ? "sent" : "received";

    return (
      <View key={transaction._id}>
        {/* Date separator */}
        <View style={styles.dateSeparator}>
          <View style={styles.dateSeparatorLine} />
          <Text style={styles.dateSeparatorText}>
            {new Date(transaction.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            ,{" "}
            {new Date(transaction.createdAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </Text>
          <View style={styles.dateSeparatorLine} />
        </View>

        {/* Transaction card */}
        <View
          style={[
            styles.transactionCard,
            transactionType === "sent" ? styles.sentCard : styles.receivedCard,
          ]}
        >
          <Text
            style={[
              styles.transactionTitle,
              transactionType === "sent" && styles.sentText,
            ]}
          >
            {transactionType === "sent"
              ? `Payment to ${recipientName}`
              : "Payment to you"}
          </Text>

          {transaction.message && (
            <Text
              style={[
                styles.transactionDescription,
                transactionType === "sent" && styles.sentText,
              ]}
            >
              {transaction.message}
            </Text>
          )}

          <Text
            style={[
              styles.transactionAmount,
              transactionType === "sent" && styles.sentText,
            ]}
          >
            {transaction.amount.toLocaleString("en-IN")} {transaction.currency}
          </Text>

          <View style={styles.transactionStatus}>
            <View
              style={[styles.statusIndicator, { backgroundColor: "#4CAF50" }]}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color: "#4CAF50",
                },
              ]}
            >
              Paid •{" "}
              {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
            <AntDesign
              name="right"
              size={16}
              color={transactionType === "sent" ? "#E6F2FF" : "#999"}
              style={styles.statusArrow}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: generateAvatarColor(recipientName) },
            ]}
          >
            <Text style={styles.avatarText}>{getInitial(recipientName)}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{recipientName}</Text>
          </View>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* Transaction History */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.transactionContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
          ) : transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            transactions.map(renderTransaction)
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayPress}>
          <Text style={styles.payButtonText}>Pay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === "android" ? 12 : 50,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  headerUsername: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  transactionContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  dateSeparator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: "#999",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
  },
  dateSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  transactionCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  transactionAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  transactionStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  statusArrow: {
    marginLeft: 8,
  },
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    gap: 12,
  },
  payButton: {
    flex: 1,
    backgroundColor: "#34C759",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sentCard: {
    alignSelf: "flex-end",
    backgroundColor: "#FFF",
  },
  receivedCard: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF",
  },
  sentText: {
    color: "#000",
  },
  receivedText: {
    color: "#000",
  },
});
