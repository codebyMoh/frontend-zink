import {
  ApiTransaction,
  getTransactionsForTwoUsers,
  recipientuser,
} from "@/services/api/transaction";
import { TokenManager } from "@/services/tokenManager";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
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
  Image,
} from "react-native";
import UsdcIcon from "../../../assets/images/token/usdc.png";

export default function PaymentChatScreen() {
  const params = useLocalSearchParams();
  const recipientName = (params.recipientName as string) || "Lacey Turner";
  const recipientId = (params.recipientId as string) || "";

  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [recipientuser, setRecipientuser] = useState<recipientuser>();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);

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
        recipientAddress: recipientuser?.smartWalletAddress,
      },
    });
  };

  const handleRequestPress = () => {
    // TODO: Implement request functionality
    console.log("Request payment from", recipientName);
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const renderTransaction = (transaction: ApiTransaction) => {
    if (!currentUser) return null;

    const isCurrentUserSender = transaction.userId === currentUser._id;
    const transactionType = isCurrentUserSender ? "sent" : "received";
    const formattedAmount = transaction.amount.toLocaleString("en-IN");
    const currencyDisplay = transaction.currency === "INR" ? "₹" : "";

    return (
      <View key={transaction._id}>
        {/* Date separator */}
        <View style={styles.dateSeparator}>
          <Text style={styles.dateSeparatorText}>
            {getFormattedDate(transaction.createdAt)}
            {`, ${new Date(transaction.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}`}
          </Text>
        </View>

        {/* Transaction card */}
        <TouchableOpacity
          style={[
            styles.transactionCard,
            transactionType === "sent" ? styles.sentCard : styles.receivedCard,
          ]}
          onPress={() => {
            router.push({
              pathname: "/transaction_details",
              params: {
                amount: transaction.amount,
                currency: transaction.currency,
                recipient: transaction.recipientUserName,
                transactionHash: transaction.tx,
                date: transaction.createdAt,
                transactionType:
                  transactionType === "sent" ? "send" : "receive",
              },
            });
          }}
        >
          <Text style={styles.transactionTitle}>
            {transactionType === "sent"
              ? `Payment to ${recipientName}`
              : "Payment to you"}
          </Text>

          {transaction.message && (
            <Text style={styles.transactionDescription}>
              {transaction.message}
            </Text>
          )}

          <View style={styles.amountContainer}>
            {transaction.currency === "USDC" && (
              <Image source={UsdcIcon} style={styles.usdcIcon} />
            )}
            <Text style={styles.transactionAmount}>
              {currencyDisplay}
              {formattedAmount}
            </Text>
          </View>

          <TouchableOpacity style={styles.transactionStatus} onPress={() => {}}>
            <FontAwesome name="check-circle" size={14} color="#34C759" />
            <Text style={styles.statusText}>
              Paid • {getFormattedDate(transaction.createdAt)}
            </Text>
            <AntDesign name="right" size={14} color="#B0B0B0" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDropdownMenu = () => {
    if (!showMenu) return null;

    const menuItems = [
      "Start new group",
      "Block this person",
      "Turn off messaging",
      "Report user",
      "Refresh",
      "Get help",
      "Send feedback",
    ];

    return (
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              console.log("Menu item pressed:", item);
              setShowMenu(false);
            }}
          >
            <Text style={styles.menuText}>{item}</Text>
          </TouchableOpacity>
        ))}
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

        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => setShowMenu(!showMenu)}
        >
          <MaterialIcons name="more-vert" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      {renderDropdownMenu()}

      {/* Transaction History */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20 }}
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
        <TouchableOpacity
          style={styles.requestButton}
          onPress={handleRequestPress}
        >
          <Text style={styles.requestButtonText}>Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.messageButtonText}>Message...</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 10,
    paddingTop: Platform.OS === "android" ? 10 : 50,
    backgroundColor: "#FFF",
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  headerIcon: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  transactionContainer: {
    paddingHorizontal: 16,
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
    justifyContent: "center",
    marginVertical: 10,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: "#777",
    paddingHorizontal: 12,
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
  },
  transactionCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    width: 250,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sentCard: {
    alignSelf: "flex-end",
  },
  receivedCard: {
    alignSelf: "flex-start",
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 13,
    color: "#777",
    marginBottom: 6,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  transactionAmount: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
  },
  usdcIcon: {
    width: 28,
    height: 28,
    marginRight: 4,
  },
  transactionStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
    marginLeft: 4,
    flex: 1,
  },
  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: Platform.OS === "ios" ? 34 : 10,
    backgroundColor: "#FFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E0E0E0",
    gap: 12,
    alignItems: "center",
  },
  payButton: {
    flex: 1,
    backgroundColor: "#1A73E8",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  requestButton: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  requestButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  messageButton: {
    flex: 1.5,
    backgroundColor: "#F0F0F0",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  messageButtonText: {
    color: "#777",
    fontSize: 16,
  },
  menuContainer: {
    position: "absolute",
    top: Platform.OS === "android" ? 50 : 80,
    right: 16,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
});
