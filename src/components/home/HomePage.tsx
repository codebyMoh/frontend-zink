import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useUser, useSmartAccountClient } from "@account-kit/react-native";
import { parseAbi } from "viem";
import MoreOptions from "./Bottom";
import OffersAndRewards from "./OffersAndRewards";
import ProfileIconSection, { ContactItem } from "./ProfileIconSection";
import { TokenManager } from "@/services/tokenManager";
import {
  getRecentTransactions,
  ApiTransaction,
} from "@/services/api/transaction";

interface BalanceState {
  usdc: string;
  isLoading: boolean;
}
interface userData {
  _id: string;
  email: string;
  paymentId: string;
  userName?: string;
  walletAddressEVM?: string;
  smartWalletAddress?: string;
  userIdAlchemy?: string;
  orgIdAlchemy?: string;
  referralId?: string;
  active: boolean;
  lastLogin?: Date;
  isPaymentIdEdited?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const dummyPeople = [
  {
    id: "1",
    name: "Alice",
    initial: "A",
    bgColor: "#da7b66ff",
  },
  {
    id: "2",
    name: "Bob",
    initial: "B",
    bgColor: "#a963e6ff",
  },
  {
    id: "3",
    name: "Charlie",
    initial: "C",
    bgColor: "#6a82eeff",
  },
  {
    id: "4",
    name: "David",
    initial: "D",
    bgColor: "#e672b0ff",
  },
  {
    id: "5",
    name: "Eve",
    initial: "E",
    bgColor: "#b571f1ff",
  },
  {
    id: "6",
    name: "Frank",
    initial: "F",
    bgColor: "#647ff7ff",
  },
  {
    id: "7",
    name: "Grace",
    initial: "G",
    bgColor: "#56a5ebff",
  },
  {
    id: "8",
    name: "Heidi",
    initial: "H",
    bgColor: "#f79951ff",
  },
  {
    id: "9",
    name: "Ivan",
    initial: "I",
    bgColor: "#a164f1ff",
  },
  {
    id: "10",
    name: "Judy",
    initial: "J",
    bgColor: "#57a2e4ff",
  },
  {
    id: "11",
    name: "Kevin",
    initial: "K",
    bgColor: "#a7e75eff",
  },
  {
    id: "12",
    name: "Liam",
    initial: "L",
    bgColor: "#e66e84ff",
  },
  {
    id: "13",
    name: "Liam",
    initial: "L",
    bgColor: "#56a5ebff",
  },
  {
    id: "14",
    name: "Liam",
    initial: "L",
    bgColor: "#da7b66ff",
  },
];

export default function WalletHomePage() {
  const [recentPeople, setRecentPeople] = useState<ContactItem[]>([]);
  const [isLoadingPeople, setIsLoadingPeople] = useState(true);
  const [balances, setBalances] = useState<BalanceState>({
    usdc: "0",
    isLoading: true,
  });

  const user = useUser();
  const { client } = useSmartAccountClient({
    type: "ModularAccountV2",
  });

  const account = client?.account;

  const [userData, setUserData] = useState<userData>(); // fallback name

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await TokenManager.getUserData();
      if (userData?._id) {
        setUserData(userData);
      }
    };
    loadUserData();
  }, []);

  // Base mainnet USDC contract address
  const BASE_USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

  useEffect(() => {
    if (client && account?.address) {
      loadBalances();
    }
  }, [client, account?.address]);

  const loadBalances = async () => {
    if (!client || !account?.address || !user?.address) return;

    try {
      setBalances((prev) => ({ ...prev, isLoading: true }));

      // get USDC balance
      const smartAccountUsdcBalance = await client.readContract({
        address: BASE_USDC,
        abi: parseAbi([
          "function balanceOf(address owner) view returns (uint256)",
        ]),
        functionName: "balanceOf",
        args: [account.address],
      });

      const smartUsdcFormatted = (
        Number(smartAccountUsdcBalance) / 1e6
      ).toFixed(3);
      setBalances({
        usdc: parseFloat(smartUsdcFormatted).toFixed(3),
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load balances:", error);
      setBalances((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // helper function to format the balance for display
  const formatBalanceForDisplay = (balance: string) => {
    const [whole, decimal] = balance.split(".");
    return {
      whole: whole || "0",
      decimal: decimal || "00",
    };
  };

  const displayBalance = formatBalanceForDisplay(balances.usdc);

  const transformTransactionToContact = (
    transaction: ApiTransaction
  ): ContactItem => {
    const actualUserToShow =
      transaction?.userId?.toString() == userData?._id?.toString()
        ? true
        : false;
    const recipientName =
      (actualUserToShow
        ? transaction.recipientUserName
        : transaction.userName) || "Unknown user";

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

    const colorIndex =
      recipientName
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

    return {
      id: actualUserToShow ? transaction?.recipientId : transaction.userId,
      name: recipientName,
      initial: recipientName.charAt(0).toUpperCase(),
      bgColor: colors[colorIndex],
    };
  };

  const loadRecentPeople = async () => {
    try {
      setIsLoadingPeople(true);
      const transactions = await getRecentTransactions();

      const transformedPeople = transactions.map((transaction) =>
        transformTransactionToContact(transaction)
      );

      setRecentPeople(transformedPeople);
    } catch (error) {
      console.error("Failed to load recent people:", error);
      setRecentPeople([]);
    } finally {
      setIsLoadingPeople(false);
    }
  };

  useEffect(() => {
    if (user?.address && userData?._id) {
      loadRecentPeople();
    }
  }, [user?.address, userData?._id]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/home/city.png")}
        style={styles.topSectionContainer}
        resizeMode="cover"
      >
        <View style={styles.searchHeader}>
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => router.push("/search_people")}
          >
            <MaterialCommunityIcons name="magnify" size={20} color="#999" />
            <Text style={styles.searchPlaceholder}>
              Pay friends and merchants
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.profileText}>
              {userData?.userName?.charAt(0)?.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Balance Card with QR and Illustration */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceContent}>
            <View style={styles.balanceDisplay}>
              <Image
                source={require("../../../assets/images/token/usdc.png")}
                style={styles.usdcIcon}
              />
              {balances.isLoading ? (
                <ActivityIndicator color="#2E7D32" size="large" />
              ) : (
                <Text style={styles.balanceAmount}>
                  {displayBalance.whole}
                  <Text style={styles.balanceDecimal}>
                    .{displayBalance.decimal}
                  </Text>
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => router.push("/share_qr")}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="#2E7D32" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Updated action grid layout */}
      <View style={styles.actionGrid}>
        <View style={styles.actionItemContainer}>
          <TouchableOpacity
            style={styles.actionIconButton}
            onPress={() => router.push("/scan_qr")}
          >
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={28}
              color="#1565C0"
            />
          </TouchableOpacity>
          <Text style={styles.actionText}>Scan any{"\n"}QR code</Text>
        </View>

        <View style={styles.actionItemContainer}>
          <TouchableOpacity
            style={styles.actionIconButton}
            onPress={() => router.push("/search_people")}
          >
            <MaterialCommunityIcons
              name="currency-usd"
              size={28}
              color="#1565C0"
            />
          </TouchableOpacity>
          <Text style={styles.actionText}>Pay{"\n"}anyone</Text>
        </View>

        <View style={styles.actionItemContainer}>
          <TouchableOpacity style={styles.actionIconButton}>
            <MaterialCommunityIcons name="bank" size={28} color="#1565C0" />
          </TouchableOpacity>
          <Text style={styles.actionText}>Stake</Text>
        </View>

        <View style={styles.actionItemContainer}>
          <TouchableOpacity style={styles.actionIconButton}>
            <MaterialCommunityIcons
              name="gift-outline"
              size={28}
              color="#1565C0"
            />
          </TouchableOpacity>
          <Text style={styles.actionText}>Earn{"\n"}rewards</Text>
        </View>
      </View>

      {/* people */}
      <ProfileIconSection
        title="People"
        people={isLoadingPeople ? [] : recentPeople}
        userId={userData?._id}
        initialVisibleCount={7}
        isLoading={isLoadingPeople}
      />

      {/* business and merchant */}
      <ProfileIconSection
        userId={userData?._id}
        title="Businesses"
        people={dummyPeople}
        initialVisibleCount={7}
      />

      {/* offers and rewards section */}
      <OffersAndRewards />

      {/* bottom */}
      <MoreOptions />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSectionContainer: {
    paddingBottom: 20,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  searchPlaceholder: {
    color: "#666",
    marginLeft: 8,
    fontSize: 15,
  },
  profileIcon: {
    backgroundColor: "#444",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  balanceCard: {
    marginHorizontal: 20,
    // backgroundColor: "#E8F5E8",
    borderRadius: 16,
    height: 160,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  balanceContent: {
    flex: 1,
    paddingLeft: 24,
    justifyContent: "center",
  },
  balanceDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  usdcIcon: {
    width: 24,
    height: 24,
    marginRight: 6,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  balanceDecimal: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  cardIllustration: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: "60%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingRight: 10,
    paddingBottom: 0,
  },
  illustrationImage: {
    width: 210, 
    height: 140, 
    resizeMode: "contain",
  },
  qrButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
    padding: 8,
  },
  actionGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  actionItemContainer: {
    alignItems: "center",
    width: "23%",
  },
  actionIconButton: {
    backgroundColor: "rgba(13, 71, 247, 0.2)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    lineHeight: 16,
  },
});