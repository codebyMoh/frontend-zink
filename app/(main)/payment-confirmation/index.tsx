import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useUser, useSmartAccountClient } from "@account-kit/react-native";
import { encodeFunctionData, formatEther, parseAbi } from "viem";

interface BalanceState {
  eth: string;
  usdc: string;
}

export default function PaymentConfirmationScreen() {
  const params = useLocalSearchParams();
  const amount = params.amount as string || "0.00";
  const recipient = params.recipient as string || "Lance Whitney";
  const recipientAddress = (params.recipientAddress as string || "0xF62177704d06a8C9d97622f44fbC9EBC6a667ACA") as `0x${string}`;

  const [isLoading, setIsLoading] = useState(false);
  const [balances, setBalances] = useState<BalanceState>({
    eth: "0",
    usdc: "0"
  });

  // console.log("balances:", balances);
  const user = useUser();
  const { client } = useSmartAccountClient({
    type: "ModularAccountV2",
  });


  const account = client?.account;
  // console.log("-------------------------------")
  // console.log("User info:", user);
  // console.log("User address:", user?.address);
  // console.log("Smart account info:", account);
  // console.log("Smart account address:", account?.address);
  // console.log("-------------------------------")

  
  // Base mainnet USDC contract address
  const BASE_USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

  useEffect(() => {
    if (client && account?.address) {
      loadBalances();
    }
  }, [client, account?.address]);


const loadBalances = async () => {
  if (!client || !account?.address || !user?.address) return;

  try {
    // *** Get ETH balance for both accounts
    const smartAccountEthBalance = await client.getBalance({ address: account.address });
    // const eoaEthBalance = await client.getBalance({ address: user.address });

    // Get USDC balance for both accounts
    const smartAccountUsdcBalance = await client.readContract({
      address: BASE_USDC,
      abi: parseAbi([
        'function balanceOf(address owner) view returns (uint256)'
      ]),
      functionName: 'balanceOf',
      args: [account.address]
    });

    // const eoaUsdcBalance = await client.readContract({
    //   address: BASE_USDC,
    //   abi: parseAbi([
    //     'function balanceOf(address owner) view returns (uint256)'
    //   ]),
    //   functionName: 'balanceOf',
    //   args: [user.address]
    // });

    const smartUsdcFormatted = (Number(smartAccountUsdcBalance) / 1e6).toFixed(2);
    // const eoaUsdcFormatted = (Number(eoaUsdcBalance) / 1e6).toFixed(2);

    // setBalances({
    //   eth: parseFloat(formatEther(smartAccountEthBalance + eoaEthBalance)).toFixed(6),
    //   usdc: (parseFloat(smartUsdcFormatted) + parseFloat(eoaUsdcFormatted)).toFixed(2)
    // });

    setBalances({
      eth: parseFloat(formatEther(smartAccountEthBalance)).toFixed(5),
      usdc: parseFloat(smartUsdcFormatted).toFixed(3)
    });

  } catch (error) {
    console.error('Failed to load balances:', error);
  }
};

const executeSmartAccountPayment = async () => {
  if (!client || !account?.address) {
    Alert.alert("Error", "Smart account client not ready");
    return;
  }

  const paymentAmount = parseFloat(amount);
  const usdcAmount = BigInt(Math.floor(paymentAmount * 1000000));

  try {
    const { hash } = await client.sendUserOperation({
      uo: {
        target: BASE_USDC,
        data: encodeFunctionData({
          abi: parseAbi([
            'function transfer(address to, uint256 amount) returns (bool)'
          ]),
          functionName: 'transfer',
          args: [recipientAddress, usdcAmount]
        }),
        value: 0n,
      },
    });

const transactionHash = await client.waitForUserOperationTransaction({ hash });
    
    return {
      transactionHash: transactionHash || hash,
      userOpHash: hash
    };
  } catch (error) {
    throw error;
  }
};

const executePayment = async () => {
  if (!client || !account?.address || !user?.address) {
    Alert.alert("Error", "Account not ready");
    return;
  }

  try {
    const smartUsdcBalance = await client.readContract({
      address: BASE_USDC,
      abi: parseAbi(['function balanceOf(address owner) view returns (uint256)']),
      functionName: 'balanceOf',
      args: [account.address]
    });

    // const eoaUsdcBalance = await client.readContract({
    //   address: BASE_USDC,
    //   abi: parseAbi(['function balanceOf(address owner) view returns (uint256)']),
    //   functionName: 'balanceOf',
    //   args: [user.address]
    // });

    const paymentAmount = parseFloat(amount);
    const smartUsdcFormatted = Number(smartUsdcBalance) / 1e6;
    // const eoaUsdcFormatted = Number(eoaUsdcBalance) / 1e6;

    if (smartUsdcFormatted >= paymentAmount) {
      // use smart account
      setIsLoading(true);
      const result = await executeSmartAccountPayment();
      
      router.replace({
        pathname: "/success_tx",
        params: {
          amount,
          recipient,
          transactionHash: result?.transactionHash,
          userOpHash: result?.userOpHash
        }
      });
    }
    // else {
    //   Alert.alert(
    //     "Insufficient USDC", 
    //     `Total USDC: ${(smartUsdcFormatted + eoaUsdcFormatted).toFixed(2)}\nRequired: ${amount}\n\nSmart Account: ${smartUsdcFormatted.toFixed(2)}\nEOA: ${eoaUsdcFormatted.toFixed(2)}`
    //   );
    // }
  } catch (error) {
    console.error('Payment failed:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    Alert.alert("Payment Failed", `Transaction could not be completed.\n\nError: ${errorMessage}`);
  } finally {
    setIsLoading(false);
  }
};

  const handleBack = () => {
    router.back();
  };

  const handleCancel = () => {
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Payment Details Card */}
        <View style={styles.paymentCard}>
          <View style={styles.recipientSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {recipient.split(' ').map(name => name[0]).join('').toUpperCase()}
              </Text>
            </View>
            <Text style={styles.recipientName}>Paying {recipient}</Text>
          </View>

          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amount}>${amount} USDC</Text>
          </View>

          <View style={styles.messageSection}>
            <Text style={styles.messageLabel}>Message</Text>
            <Text style={styles.message}>Here's the money I owe you.</Text>
          </View>
        </View>

        {/* Balance Information */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Your Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>USDC:</Text>
            <Text style={styles.balanceValue}>${balances.usdc}</Text>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>ETH (for gas):</Text>
            <Text style={styles.balanceValue}>{balances.eth}</Text>
          </View>
        </View>

        {/* Security Info */}
        <View style={styles.securityInfo}>
          <Ionicons name="shield-checkmark" size={20} color="#34C759" />
          <Text style={styles.securityText}>
            Secured by smart wallet technology on Base
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={handleCancel}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmButton, { opacity: isLoading ? 0.7 : 1 }]}
          onPress={executePayment}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.confirmButtonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.confirmButtonText}>
              Confirm & Pay ${amount}
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
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
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
    width: 34, // Same as back button to center title
  },
  content: {
    flex: 1,
    padding: 20,
  },
  paymentCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipientSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
  },
  recipientName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  amountSection: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  amountLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#34C759",
  },
  messageSection: {
    alignItems: "center",
  },
  messageLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  message: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    fontStyle: "italic",
  },
  balanceCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#888",
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f8f0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  securityText: {
    fontSize: 12,
    color: "#34C759",
    marginLeft: 6,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  confirmButton: {
    flex: 2,
    backgroundColor: "#34C759",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});