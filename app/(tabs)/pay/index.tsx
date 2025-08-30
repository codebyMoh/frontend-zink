import { AntDesign } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PaymentScreen() {
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  async function payHandler() {
    try {
      setIsLoading(true);
      if (Number(amount) <= 0) {
        setErrorMessage("Invalid amount.");
        setIsLoading(false);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.replace("/success_tx");
      setIsLoading(false);
    } catch (error) {
      console.log("🚀 ~ payHandler ~ error:", error);
      setIsLoading(false);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={28} color="black" />
      </TouchableOpacity>

      {/* Avatar + Name */}
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>L</Text>
        </View>
        <Text style={styles.name}>Paying Lance Whitney</Text>
      </View>

      {/* Amount Input */}
      <View style={styles.amountInputContainer}>
        <Text style={styles.dollar}>$</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="0.00"
          placeholderTextColor="#888" // Darker placeholder for light background
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>
      {/* Error Message Display */}
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}

      {/* Message */}
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>Here&apos;s the money I owe you.</Text>
      </View>

      {/* Pay Button */}
      <TouchableOpacity
        style={styles.payButton}
        onPress={() => payHandler()}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>Pay ${amount || "0.00"}</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    alignItems: "flex-start",
    marginTop: 30,
  },
  closeButton: {
    padding: 5,
  },
  close: {
    fontSize: 22,
    color: "#000",
  },
  userInfo: {
    marginTop: 30,
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 22,
    color: "#000",
    fontWeight: "bold",
  },
  name: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginTop: 40,
    marginHorizontal: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 10,
  },
  dollar: {
    fontSize: 32,
    color: "#000",
    marginRight: 5,
    paddingBottom: 5,
    fontWeight: "bold",
  },
  amountInput: {
    fontSize: 48,
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
    paddingVertical: 0,
  },
  messageBox: {
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    padding: 15,
    marginTop: 30,
    marginHorizontal: 20,
    alignSelf: "stretch",
  },
  messageText: {
    color: "#555",
    fontSize: 16,
    textAlign: "center",
  },
  payButton: {
    backgroundColor: "#34C759",
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorMessage: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
    marginHorizontal: 20,
  },
  backButton: {
    padding: 10,
    marginTop: 20,
  },
});
