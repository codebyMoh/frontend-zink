import { useUser, useSmartAccountClient } from "@account-kit/react-native";
import { StyleSheet, View, Text, Linking, ScrollView, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { encodeFunctionData, formatEther, parseAbi } from "viem";
import WalletHomePage from "@/src/components/home/HomePage";
import { UserOperationReceipt, TransactionError, BalanceState } from "@/src/types/menu.types";

export default function TabOneScreen() {
  const user = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [balances, setBalances] = useState<BalanceState>({
    eth: "0",
    usdc: "0"
  });

  const { bottom } = useSafeAreaInsets();
  const { client } = useSmartAccountClient({
    type: "ModularAccountV2",
  });

  const account = client?.account;
  
  // Base Sepolia USDC contract address
//   const BASE_SEPOLIA_USDC = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
  const BASE_USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; //actual usdc address

  if (!user) return null;

  useEffect(() => {
    if (client && account?.address) {
      loadBalances();
    }
  }, [client, account?.address]);

  const loadBalances = async () => {
    if (!client || !account?.address) return;

    try {
      // Get ETH balance
      const ethBalance = await client.getBalance({ address: account.address });
      const ethFormatted = formatEther(ethBalance);

      // Get USDC balance
      const usdcBalance = await client.readContract({
        address: BASE_USDC,
        abi: parseAbi([
          'function balanceOf(address owner) view returns (uint256)'
        ]),
        functionName: 'balanceOf',
        args: [account.address]
      });

      const usdcFormatted = (Number(usdcBalance) / 1e6).toFixed(2); // USDC has 6 decimals

      setBalances({
        eth: parseFloat(ethFormatted).toFixed(6),
        usdc: usdcFormatted
      });

    } catch (error) {
      console.error('Failed to load balances:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadBalances();
    setIsRefreshing(false);
  };

  const checkDetailedBalance = async () => {
    if (!client || !account?.address) {
      Alert.alert("Error", "Smart account client not ready");
      return;
    }

    try {
      await loadBalances();
      
      Alert.alert(
        "Account Balances", 
        `Address: ${account.address}\n\nETH: ${balances.eth}\nUSDC: ${balances.usdc}\n\nNote: You need ETH for gas fees to send transactions.`
      );
      
    } catch (error) {
      console.error('Balance check failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert("Error", `Failed to check balance: ${errorMessage}`);
    }
  };

  const sendUSDCTransfer = async () => {
    if (!client || !account?.address) {
      Alert.alert("Error", "Smart account client not ready");
      return;
    }

    // Check if we have USDC and ETH
    const ethBalance = parseFloat(balances.eth);
    const usdcBalance = parseFloat(balances.usdc);

    if (ethBalance < 0.001) {
      Alert.alert(
        "Insufficient ETH", 
        `You need Base Sepolia ETH for gas fees.\n\nCurrent ETH: ${balances.eth}\nGet ETH from: https://faucet.quicknode.com/base/sepolia`
      );
      return;
    }

    if (usdcBalance < 0.1) {
      Alert.alert(
        "Insufficient USDC", 
        `Current USDC: ${balances.usdc}\nGet more from: https://faucet.circle.com/`
      );
      return;
    }

    setIsLoading(true);
    setTransactionStatus("Sending USDC transfer...");

    try {
      const { hash } = await client.sendUserOperation({
        uo: {
          target: BASE_USDC,
          data: encodeFunctionData({
            abi: parseAbi([
              'function transfer(address to, uint256 amount) returns (bool)'
            ]),
            functionName: 'transfer',
            args: [
              '0xF62177704d06a8C9d97622f44fbC9EBC6a667ACA', // test recipient
              BigInt(100000) // 0.1 USDC (6 decimals)
            ]
          }),
          value: 0n,
        },
      });

      // Show full hash - no slicing!
      setTransactionStatus(`USDC transfer sent! User Op Hash: ${hash}`);
      Alert.alert("Success!", `USDC transfer sent!\n\nUser Operation Hash:\n${hash}`);

      // Wait for confirmation
      const receipt: UserOperationReceipt = await client.waitForUserOperationTransaction({ hash });
      
      // Check if receipt has transactionHash property
    if (receipt && typeof receipt === 'object' && 'transactionHash' in receipt) {
      setTransactionStatus(`USDC transfer confirmed!\n\nTransaction Hash:\n${receipt.transactionHash}`);
    } else if (typeof receipt === 'string') {
      // If receipt is just a hash string
      setTransactionStatus(`USDC transfer confirmed!\n\nTransaction Hash:\n${receipt}`);
    } else {
      setTransactionStatus(`USDC transfer completed!\n\nUser Op Hash:\n${hash}`);
    }
      
      // Refresh balances
      await loadBalances();

    } catch (error) {
      console.error('USDC transfer failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setTransactionStatus(`Failed: ${errorMessage}`);
      Alert.alert("USDC Transfer Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const sendETHTransfer = async () => {
    if (!client || !account?.address) {
      Alert.alert("Error", "Smart account client not ready");
      return;
    }

    const ethBalance = parseFloat(balances.eth);

    if (ethBalance < 0.002) {
      Alert.alert(
        "Insufficient ETH", 
        `You need more Base Sepolia ETH.\n\nCurrent: ${balances.eth} ETH\nNeed: ~0.002 ETH minimum\n\nGet more from faucets.`
      );
      return;
    }

    setIsLoading(true);
    setTransactionStatus("Sending ETH transfer...");

    try {
      const { hash } = await client.sendUserOperation({
        uo: {
          target: '0x742d35Cc6634C0532925a3b8D400c1dFA0B00a2A',
          data: '0x', 
          value: BigInt('1000000000000000'), // 0.001 ETH
        },
      });

      // Show full hash - no slicing!
      setTransactionStatus(`ETH transfer sent! User Op Hash: ${hash}`);
      Alert.alert("Success!", `ETH transfer sent!\n\nUser Operation Hash:\n${hash}`);

      const receipt: UserOperationReceipt = await client.waitForUserOperationTransaction({ hash });

// Check if receipt has transactionHash property
if (receipt && typeof receipt === 'object' && 'transactionHash' in receipt) {
  setTransactionStatus(`ETH transfer confirmed!\n\nTransaction Hash:\n${receipt.transactionHash}`);
} else if (typeof receipt === 'string') {
  // If receipt is just a hash string
  setTransactionStatus(`ETH transfer confirmed!\n\nTransaction Hash:\n${receipt}`);
} else {
  setTransactionStatus(`ETH transfer completed!\n\nUser Op Hash:\n${hash}`);
}
      
      // Refresh balances
      await loadBalances();

    } catch (error) {
      console.error('ETH transfer failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTransactionStatus(`Failed: ${errorMessage}`);
      Alert.alert("ETH Transfer Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add this debug function to your component to troubleshoot the USDC balance issue
  const debugBalances = async () => {
    if (!client || !account?.address || !user?.address) {
      Alert.alert("Error", "Account not ready");
      return;
    }

    
    try {
      // Check current network
      const chainId = await client.getChainId();
      
      // Check both addresses
      const smartAccountAddress = account.address;
      const userEOAAddress = user.address;
      
      
      // Base Sepolia USDC contract

      const BASE_USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
      
      // Check USDC balance on both addresses
      try {
        const usdcBalanceSmartAccount = await client.readContract({
          address: BASE_USDC,
          abi: parseAbi([
            'function balanceOf(address owner) view returns (uint256)'
          ]),
          functionName: 'balanceOf',
          args: [smartAccountAddress]
        });

        const usdcBalanceEOA = await client.readContract({
          address: BASE_USDC,
          abi: parseAbi([
            'function balanceOf(address owner) view returns (uint256)'
          ]),
          functionName: 'balanceOf',
          args: [userEOAAddress]
        });

        const smartAccountUSDC = (Number(usdcBalanceSmartAccount) / 1e6).toFixed(6);
        const eoaUSDC = (Number(usdcBalanceEOA) / 1e6).toFixed(6);


        // Check ETH balances too
        const ethBalanceSmart = await client.getBalance({ address: smartAccountAddress });
        const ethBalanceEOA = await client.getBalance({ address: userEOAAddress });


        Alert.alert(
          "Debug Results",
          `Chain ID: ${chainId} ${chainId === 84532 ? '✅' : '❌ Wrong network!'}\n\n` +
          `Smart Account USDC: ${smartAccountUSDC}\n` +
          `EOA USDC: ${eoaUSDC}\n\n` +
          `Smart Account ETH: ${formatEther(ethBalanceSmart)}\n` +
          `EOA ETH: ${formatEther(ethBalanceEOA)}\n\n` +
          `${chainId !== 84532 ? 'Switch to Base Sepolia network!' : ''}` +
          `${Number(eoaUSDC) > 0 && Number(smartAccountUSDC) === 0 ? '\n\nUSDC is on your EOA, not smart account!' : ''}`
        );

      } catch (contractError) {
        console.log("Contract read error:", contractError);
        const errorMessage = contractError instanceof Error ? contractError.message : String(contractError);
        Alert.alert(
          "Contract Error", 
          `Failed to read USDC contract.\n\nChain ID: ${chainId}\nExpected: 84532 (Base Sepolia)\n\nError: ${errorMessage}`
        );
      }

    } catch (error) {
      console.error('Debug failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert("Debug Failed", errorMessage);
    }
  };

  // Also add this function to transfer USDC from EOA to Smart Account if needed
  const transferUSDCToSmartAccount = async () => {
    if (!client || !account?.address || !user?.address) {
      Alert.alert("Error", "Account not ready");
      return;
    }

    Alert.alert(
      "Transfer USDC to Smart Account",
      `Your USDC might be on your EOA address instead of your smart account.\n\nEOA: ${user.address}\nSmart Account: ${account.address}\n\nTo use USDC with Account Kit, you need to transfer it to your smart account first.`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "How to Transfer",
          onPress: () => Alert.alert(
            "How to Transfer",
            "1. Open MetaMask or your wallet\n2. Connect to Base Sepolia\n3. Send USDC to your smart account address:\n\n" + account.address
          )
        }
      ]
    );
  };

  return (
    <ScrollView>
      <WalletHomePage />
    </ScrollView>
  );
}