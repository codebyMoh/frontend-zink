import {
  ApiTransaction,
  recipientuser,
  requestPaymentStore,
} from "@/services/api/transaction";
import { AntDesign } from "@expo/vector-icons";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface RequestPaymentProps {
  isRequestPopupOpen: boolean;
  setIsRequestPopupOpen: Dispatch<SetStateAction<boolean>>;
  transactions: ApiTransaction[];
  setTransactions: Dispatch<SetStateAction<ApiTransaction[]>>;
  recipientuser: recipientuser;
}

const RequestPayment: React.FC<RequestPaymentProps> = ({
  isRequestPopupOpen,
  setIsRequestPopupOpen,
  transactions,
  setTransactions,
  recipientuser,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const closeAndReset = () => {
    setIsRequestPopupOpen(false);
    setAmount("");
    setMessage("");
  };

  async function handlerSentRequest() {
    setIsLoading(true);
    try {
      if (!amount || parseFloat(amount) <= 0) {
        Toast.show({
          type: "error",
          text1: "Invalid Amount",
          text2: "Please enter a valid amount to request.",
        });
        return;
      }
      const amountInNumber = Number(amount);
      // Your API call and state update logic here
      // For example:
      const newTransaction = await requestPaymentStore({
        amount: amountInNumber,
        currency: "USDC",
        message: message?.trim().length ? message : "Payment request.",
        recipientId: recipientuser?._id,
        tx: "payment request",
        type: "request_payment",
      });
      const tempTransactions = [
        ...transactions,
        newTransaction.data.transaction,
      ];
      setTransactions(tempTransactions?.slice(-20));
      closeAndReset();
    } catch (error) {
      console.log("🚀 ~ handlerSentRequest ~ error:", error);
      Toast.show({
        type: "error",
        text1: "Request Failed",
        text2: "Unable to send request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      visible={isRequestPopupOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={closeAndReset}
    >
      {/* 💡 The outer TouchableOpacity handles clicks outside the modal content */}
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={closeAndReset}
      >
        {/* 💡 This TouchableWithoutFeedback prevents clicks on the modal content from closing it */}
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={closeAndReset}>
            <AntDesign name="close" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.modalHeader}>
            <AntDesign name="user" size={30} color="#1A73E8" />
            <Text style={styles.modalTitle}>
              Send request to {recipientuser?.userName}
            </Text>
          </View>

          <View style={styles.amountSection}>
            <Text style={styles.sectionLabel}>Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currency}>USDC</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="#A0A0A0"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.messageSection}>
            <Text style={styles.sectionLabel}>Message (Optional)</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Add a note..."
              placeholderTextColor="#A0A0A0"
              value={message}
              onChangeText={setMessage}
              multiline={true}
              maxLength={100}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handlerSentRequest}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    paddingTop: 50,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    padding: 5,
    zIndex: 1,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginTop: 10,
    textAlign: "center",
  },
  amountSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4A4A4A",
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F3F6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
    textAlign: "left",
    paddingVertical: 0,
    marginLeft: 10,
  },
  currency: {
    fontSize: 18,
    color: "#666",
    fontWeight: "600",
    marginLeft: 8,
  },
  messageSection: {
    marginBottom: 20,
  },
  messageInput: {
    backgroundColor: "#F0F3F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#1A73E8",
    borderRadius: 12,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  submitButtonDisabled: {
    backgroundColor: "#A0A0A0",
  },
});

export default RequestPayment;
