/* eslint-disable prettier/prettier */
import {
  ApiTransaction,
  declineRequestPayment,
  getTransactionsForTwoUsers,
  recipientuser,
  storeChatMessage,
} from "@/services/api/transaction";
import { TokenManager } from "@/services/tokenManager";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useRef } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  TextInput,
  Keyboard,
  BackHandler,
} from "react-native";
import UsdcIcon from "../../../assets/images/token/usdc.png";
import { isMoreThanOneHourAgo } from "@/utils/constant";
import Toast from "react-native-toast-message";
import RequestPayment from "@/src/components/chat_screen/RequestPayment";

export default function PaymentChatScreen() {
  const params = useLocalSearchParams();
  const recipientName = (params.recipientName as string) || "Lacey Turner";
  const recipientId = (params.recipientId as string) || "";
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [message, setMessage] = useState<string>("");
  const [recipientuser, setRecipientuser] = useState<recipientuser>();
  const [isLoading, setIsLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isRequestPopupOpen, setIsRequestPopupOpen] = useState(false);

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

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [transactions, isLoading]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsInputFocused(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsInputFocused(false);
      }
    );

    // This handles the Android hardware back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isInputFocused) {
          inputRef.current?.blur();
          return true; // Prevent default behavior
        }
        return false; // Allow default behavior
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      backHandler.remove();
    };
  }, [isInputFocused]);

  // scroll to bottom handler
  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  };

  // load transactions
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
  // generate avatar color

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

  // handler pay
  const handlePayPress = () => {
    router.push({
      pathname: "/pay",
      params: {
        recipientId: recipientuser?._id,
        recipientName: recipientuser?.userName,
        recipientAddress: recipientuser?.smartWalletAddress,
        amount: 0,
        type: "tx",
        requestSuccessId: "unknown",
        chatMessage: "unknown",
      },
    });
  };

  // request payment handler
  const handleRequestPress = () => {
    setIsRequestPopupOpen(true);
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  //  handler pay request
  function payRequestHandler(transaction: ApiTransaction) {
    router.push({
      pathname: "/pay",
      params: {
        recipientId: recipientuser?._id,
        recipientName: recipientuser?.userName,
        recipientAddress: recipientuser?.smartWalletAddress,
        amount: transaction?.amount,
        requestSuccessId: transaction?._id,
        chatMessage: "unknown",
        type: "request_payment_success",
      },
    });
  }
  // handler to decline request payment
  async function declinePayment(transaction: ApiTransaction, index: number) {
    try {
      await declineRequestPayment(transaction?._id?.toString());
      // updating a state
      let tempTransactions = [...transactions];
      tempTransactions[index] = {
        ...tempTransactions[index],
        isDeclined: true,
      };
      setTransactions(tempTransactions);
      Toast.show({
        type: "success",
        text1: "Payment declined.",
      });
    } catch (error) {
      console.log("🚀 ~ declinePayment ~ error:", error);
      Toast.show({
        type: "error",
        text1: error instanceof Error ? error.message : "Unable to decline.",
      });
    }
  }

  // main function to render transaction
  const renderTransaction = (transaction: ApiTransaction, index: number) => {
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

        {/* original transaction */}
        {transaction?.type === "tx" && (
          <TouchableOpacity
            style={[
              styles.transactionCard,
              transactionType === "sent"
                ? styles.sentCard
                : styles.receivedCard,
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

            <TouchableOpacity
              style={styles.transactionStatus}
              onPress={() => {}}
            >
              <FontAwesome name="check-circle" size={14} color="#34C759" />
              <Text style={styles.statusText}>
                Paid • {getFormattedDate(transaction.createdAt)}
              </Text>
              <AntDesign name="right" size={14} color="#B0B0B0" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        {/* chatting */}
        {transaction?.type === "chat" && (
          <View
            style={[
              styles.chatBubble,
              transactionType === "sent"
                ? styles.sentBubble
                : styles.receivedBubble,
            ]}
          >
            <Text style={styles.chatMessageText}>
              {transaction.chatMessage}
            </Text>
          </View>
        )}
        {/* payment request */}
        {transaction?.type === "request_payment" && (
          <TouchableOpacity
            style={[
              styles.transactionCard,
              transactionType === "sent"
                ? styles.sentCard
                : styles.receivedCard,
            ]}
            onPress={() => {
              if (transaction?.requestFullFilled) {
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
              }
            }}
          >
            <Text style={styles.transactionTitle}>
              {transactionType === "sent"
                ? `Request from you.`
                : `Request from ${recipientName}.`}
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
            <View style={styles.transactionStatus}>
              {transaction?.isDeclined ? (
                <>
                  <FontAwesome name="ban" size={14} color="#757575ff" />
                  <Text style={styles.statusText}>
                    {"Declined"} • {getFormattedDate(transaction.createdAt)}
                  </Text>
                </>
              ) : isMoreThanOneHourAgo(transaction?.createdAt) &&
                !transaction?.requestFullFilled ? (
                <>
                  <FontAwesome name="ban" size={14} color="#757575ff" />
                  <Text style={styles.statusText}>
                    {"Expired"} • {getFormattedDate(transaction.createdAt)}
                  </Text>
                </>
              ) : transaction?.requestFullFilled ? (
                <>
                  <FontAwesome name="check-circle" size={14} color="#34C759" />
                  <Text style={styles.statusText}>
                    {"Paid"} • {getFormattedDate(transaction.createdAt)}
                  </Text>
                </>
              ) : (
                <>
                  <FontAwesome name="clock-o" size={14} color="#757575ff" />
                  <Text style={styles.statusText}>
                    {"pending"} • {getFormattedDate(transaction.createdAt)}
                  </Text>
                </>
              )}
              <AntDesign name="right" size={14} color="#B0B0B0" />
            </View>
            {transactionType == "received" &&
              !transaction?.isDeclined &&
              !isMoreThanOneHourAgo(transaction?.createdAt) &&
              !transaction?.requestFullFilled && (
                <View style={styles.requestButtonsContainer}>
                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => declinePayment(transaction, index)}
                  >
                    <Text style={styles.declineButtonText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.payButtonRequest}
                    onPress={() => payRequestHandler(transaction)}
                  >
                    <Text style={styles.payButtonRequestText}>Pay</Text>
                  </TouchableOpacity>
                </View>
              )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // render three dot menu
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

  // handle sen message
  const handleSendMessage = async () => {
    try {
      if (message?.trim().length <= 0) {
        return;
      }
      setChatLoading(true);
      // store mesage in the BK
      const storeTx = await storeChatMessage({
        recipientId: recipientId.toString(),
        amount: 1,
        currency: "chat message",
        message: "chat message",
        tx: "chat message",
        type: "chat",
        chatMessage: message,
      });
      const newTx = [...transactions, storeTx?.data?.transaction];
      setTransactions(newTx?.slice(-20));
      setMessage("");
      setChatLoading(false);
    } catch (error) {
      console.log("🚀 ~ handleSendMessage ~ error:", error);
      setChatLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (isInputFocused) {
              inputRef.current?.blur();
            } else {
              router.back();
            }
          }}
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A73E8" />
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No transactions yet</Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 20 }}
        >
          <View style={styles.transactionContainer}>
            {transactions.map(renderTransaction)}
          </View>
        </ScrollView>
      )}

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        {!isInputFocused && (
          <>
            <TouchableOpacity style={styles.payButton} onPress={handlePayPress}>
              <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.requestButton}
              onPress={handleRequestPress}
            >
              <Text style={styles.requestButtonText}>Request</Text>
            </TouchableOpacity>
          </>
        )}

        <TextInput
          ref={inputRef}
          style={[
            styles.messageInput,
            isInputFocused && styles.messageInputFocused,
          ]}
          placeholder="Message..."
          placeholderTextColor="#777"
          value={message}
          onChangeText={setMessage}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={chatLoading}
        >
          <MaterialIcons name="send" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>
      {isRequestPopupOpen && recipientuser && (
        <RequestPayment
          isRequestPopupOpen={isRequestPopupOpen}
          setIsRequestPopupOpen={setIsRequestPopupOpen}
          transactions={transactions}
          setTransactions={setTransactions}
          recipientuser={recipientuser}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F7FA",
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    borderRadius: 10,
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
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  requestButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  messageInput: {
    flex: 2.5, // Starts with a flex of 0 to allow buttons to be visible
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
  },
  messageInputFocused: {
    flex: 1, // Expands to fill the available space when focused
  },
  sendButton: {
    backgroundColor: "#1A73E8",
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
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
  // New Styles for Chat Bubbles
  chatBubble: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    maxWidth: "80%",
    marginBottom: 10,
  },
  sentBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#bbd5f8ff",
    color: "#FFFFFF",
  },
  receivedBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  chatMessageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: "#FFFFFF",
  },
  receivedMessageText: {
    color: "#000000",
  },
  requestButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignSelf: "flex-end",
  },
  declineButton: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  declineButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  payButtonRequest: {
    flex: 1,
    backgroundColor: "#1A73E8",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonRequestText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
