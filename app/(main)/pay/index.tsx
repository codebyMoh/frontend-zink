import { AntDesign } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const colors = [
  "#da7b66ff",
  "#a963e6ff",
  "#6a82eeff",
  "#e672b0ff",
  "#b571f1ff",
  "#647ff7ff",
  "#56a5ebff",
  "#f79951ff",
  "#a164f1ff",
  "#57a2e4ff",
  "#a7e75eff",
  "#e66e84ff",
];
export default function PaymentScreen() {
  const [avatarColor, setAvatarColor] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("Here's the money I owe you.");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const params = useLocalSearchParams();
  const recipientAddress = params.recipientAddress as string;
  const recipient = params.recipientName as string;
  const amountFromParam = params?.amount as string;

  async function payHandler() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const numericAmount = parseFloat(amount);

      if (!amount || numericAmount <= 0) {
        setErrorMessage("Please enter a valid amount.");
        setIsLoading(false);
        return;
      }

      if (numericAmount > 10000) {
        setErrorMessage("Amount too large. Maximum is $10,000.");
        setIsLoading(false);
        return;
      }

      router.navigate({
        pathname: "/payment-confirmation",
        params: {
          amount: amount,
          message: message,
          recipient: params.recipientName,
          recipientAddress: params.recipientAddress,
          recipientId: params.recipientId,
        },
      });

      setIsLoading(false);
    } catch (error) {
      console.log("🚀 ~ payHandler ~ error:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    setAvatarColor(colors[randomIndex]);
  }, []);
  useEffect(() => {
    if (Number(amountFromParam) > 0) {
      setAmount(amountFromParam);
    }
  }, [amountFromParam]);

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
        <Text style={styles.headerTitle}>Send Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Name */}
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>
              {recipient?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{recipient}</Text>
          <Text style={styles.address}>{recipientAddress}</Text>
        </View>

        {/* Amount Input */}
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
              editable={Number(amountFromParam) > 0 ? false : true}
            />
            <Text style={styles.currency}>USDC</Text>
          </View>
        </View>

        <View style={styles.messageSection}>
          <Text style={styles.sectionLabel}>Message (Optional)</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Add a note..."
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
            multiline={true}
            maxLength={100}
          />
        </View>

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <AntDesign name="exclamationcircleo" size={16} color="#ff4444" />
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.infoContainer}>
          <AntDesign name="infocirlceo" size={16} color="#34C759" />
          <Text style={styles.infoText}>
            Payment will be sent using USDC on Base network
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            {
              opacity:
                isLoading || !amount || parseFloat(amount) <= 0 ? 0.5 : 1,
              backgroundColor:
                amount && parseFloat(amount) > 0 ? "#34C759" : "#ccc",
            },
          ]}
          onPress={payHandler}
          disabled={isLoading || !amount || parseFloat(amount) <= 0}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.payButtonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.payButtonText}>
              Continue • {amount || "0.00"} USDC
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
});
