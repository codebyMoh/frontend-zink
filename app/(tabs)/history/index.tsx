import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router"; // Import Stack for header options
import React, { useEffect, useState } from "react"; // Import useState and useEffect
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Define an interface for a single transaction item
interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: string;
  status: "success" | "failed";
  initial: string;
  bgColor: string; // Background color for the initial icon
}

// Dummy data for transactions to simulate history
const dummyTransactions: Transaction[] = [
  {
    id: "9",
    name: "GADGETKING",
    date: "23 August",
    amount: "200", // Changed from ₹ to
    status: "success",
    initial: "G",
    bgColor: "#56a5ebff", // Example color
  },
  {
    id: "10",
    name: "BADRI LAL",
    date: "23 August",
    amount: "120", // Changed from ₹ to
    status: "failed",
    initial: "B",
    bgColor: "#f79951ff", // Example color
  },
  // --- Added 30 more dummy transactions below ---
  {
    id: "11",
    name: "Grocery Store",
    date: "22 August",
    amount: "550", // Changed from ₹ to
    status: "success",
    initial: "G",
    bgColor: "#56a5ebff",
  },
  {
    id: "12",
    name: "Online Subscription",
    date: "22 August",
    amount: "99", // Changed from ₹ to
    status: "failed",
    initial: "O",
    bgColor: "#a164f1ff",
  },
  {
    id: "13",
    name: "Coffee Shop",
    date: "21 August",
    amount: "180", // Changed from ₹ to
    status: "success",
    initial: "C",
    bgColor: "#57a2e4ff",
  },
  {
    id: "14",
    name: "Electricity Bill",
    date: "21 August",
    amount: "1,250", // Changed from ₹ to
    status: "failed",
    initial: "E",
    bgColor: "#a7e75eff",
  },
  {
    id: "15",
    name: "Mobile Recharge",
    date: "20 August",
    amount: "399", // Changed from ₹ to
    status: "success",
    initial: "M",
    bgColor: "#e66e84ff",
  },
  {
    id: "16",
    name: "Restaurant Dinner",
    date: "20 August",
    amount: "850", // Changed from ₹ to
    status: "success",
    initial: "R",
    bgColor: "#da7b66ff",
  },
  {
    id: "17",
    name: "Taxi Ride",
    date: "19 August",
    amount: "230", // Changed from ₹ to
    status: "success",
    initial: "T",
    bgColor: "#a963e6ff",
  },
  {
    id: "18",
    name: "Book Store",
    date: "19 August",
    amount: "450", // Changed from ₹ to
    status: "failed",
    initial: "B",
    bgColor: "#6a82eeff",
  },
  {
    id: "19",
    name: "Gym Membership",
    date: "18 August",
    amount: "1,500", // Changed from ₹ to
    status: "success",
    initial: "G",
    bgColor: "#e672b0ff",
  },
  {
    id: "20",
    name: "Online Shopping",
    date: "18 August",
    amount: "7,200", // Changed from ₹ to
    status: "failed",
    initial: "O",
    bgColor: "#b571f1ff",
  },
  {
    id: "21",
    name: "Water Bill",
    date: "17 August",
    amount: "300", // Changed from ₹ to
    status: "success",
    initial: "W",
    bgColor: "#647ff7ff",
  },
  {
    id: "22",
    name: "Movie Tickets",
    date: "17 August",
    amount: "600", // Changed from ₹ to
    status: "success",
    initial: "M",
    bgColor: "#56a5ebff",
  },
  {
    id: "23",
    name: "Fuel Station",
    date: "16 August",
    amount: "2,500", // Changed from ₹ to
    status: "success",
    initial: "F",
    bgColor: "#f79951ff",
  },
  {
    id: "24",
    name: "Pharmacy",
    date: "16 August",
    amount: "150", // Changed from ₹ to
    status: "failed",
    initial: "P",
    bgColor: "#a164f1ff",
  },
  {
    id: "25",
    name: "Internet Bill",
    date: "15 August",
    amount: "799", // Changed from ₹ to
    status: "failed",
    initial: "I",
    bgColor: "#57a2e4ff",
  },
  {
    id: "26",
    name: "Gift Purchase",
    date: "15 August",
    amount: "1,000", // Changed from ₹ to
    status: "success",
    initial: "G",
    bgColor: "#a7e75eff",
  },
  {
    id: "27",
    name: "Car Wash",
    date: "14 August",
    amount: "350", // Changed from ₹ to
    status: "success",
    initial: "C",
    bgColor: "#e66e84ff",
  },
  {
    id: "28",
    name: "Pet Supplies",
    date: "14 August",
    amount: "400", // Changed from ₹ to
    status: "success",
    initial: "P",
    bgColor: "#da7b66ff",
  },
  {
    id: "29",
    name: "Travel Booking",
    date: "13 August",
    amount: "12,000", // Changed from ₹ to
    status: "success",
    initial: "T",
    bgColor: "#a963e6ff",
  },
  {
    id: "30",
    name: "Furniture Store",
    date: "13 August",
    amount: "8,500", // Changed from ₹ to
    status: "success",
    initial: "F",
    bgColor: "#6a82eeff",
  },
  {
    id: "31",
    name: "Home Repair",
    date: "12 August",
    amount: "3,000", // Changed from ₹ to
    status: "failed",
    initial: "H",
    bgColor: "#e672b0ff",
  },
  {
    id: "32",
    name: "Clothing Store",
    date: "12 August",
    amount: "2,200", // Changed from ₹ to
    status: "success",
    initial: "C",
    bgColor: "#b571f1ff",
  },
  {
    id: "33",
    name: "Donation",
    date: "11 August",
    amount: "500", // Changed from ₹ to
    status: "success",
    initial: "D",
    bgColor: "#647ff7ff",
  },
  {
    id: "34",
    name: "Music Streaming",
    date: "11 August",
    amount: "149", // Changed from ₹ to
    status: "success",
    initial: "M",
    bgColor: "#56a5ebff",
  },
  {
    id: "35",
    name: "Online Course",
    date: "10 August",
    amount: "999", // Changed from ₹ to
    status: "success",
    initial: "O",
    bgColor: "#f79951ff",
  },
  {
    id: "36",
    name: "Hardware Store",
    date: "10 August",
    amount: "750", // Changed from ₹ to
    status: "success",
    initial: "H",
    bgColor: "#a164f1ff",
  },
  {
    id: "37",
    name: "Supermarket",
    date: "09 August",
    amount: "1,800", // Changed from ₹ to
    status: "success",
    initial: "S",
    bgColor: "#57a2e4ff",
  },
  {
    id: "38",
    name: "Laundry Service",
    date: "09 August",
    amount: "200", // Changed from ₹ to
    status: "success",
    initial: "L",
    bgColor: "#a7e75eff",
  },
  {
    id: "39",
    name: "Bank Transfer",
    date: "08 August",
    amount: "5,000", // Changed from ₹ to
    status: "success",
    initial: "B",
    bgColor: "#e66e84ff",
  },
  {
    id: "40",
    name: "Spa Treatment",
    date: "08 August",
    amount: "1,200", // Changed from ₹ to
    status: "failed",
    initial: "S",
    bgColor: "#da7b66ff",
  },
];

const TransactionHistoryScreen: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>(dummyTransactions);

  // Filter transactions whenever searchText changes
  useEffect(() => {
    if (searchText === "") {
      setFilteredTransactions(dummyTransactions);
    } else {
      const filtered = dummyTransactions.filter((transaction) =>
        transaction.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  }, [searchText]); // Depend on searchText

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search transactions"
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchText} // Bind value to searchText state
            onChangeText={setSearchText} // Update searchText on change
          />
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        {/* Monthly Summary */}
        <View style={styles.monthSummary}>
          <Text style={styles.monthYear}>2025</Text>
          <Text style={styles.monthTotal}>$1,27,360.17</Text>
        </View>
        {/* Transaction List */}
        {filteredTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View
              style={[
                styles.initialCircle,
                { backgroundColor: transaction.bgColor },
              ]}
            >
              <Text style={styles.initialText}>{transaction.initial}</Text>
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionName}>{transaction.name}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
              {transaction.status === "failed" && (
                <View style={styles.failedStatus}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={14}
                    color="#E53935"
                  />
                  <Text style={styles.failedText}> Failed</Text>
                </View>
              )}
            </View>
            <Text style={styles.transactionAmount}>${transaction.amount}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Light gray background
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginLeft: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  micIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0", // Light gray background for filter buttons
  },
  filterButtonText: {
    fontSize: 14,
    color: "#000",
    marginRight: 5,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  monthSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 15,
    marginTop: 10,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  monthTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  initialCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  initialText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  transactionDate: {
    fontSize: 13,
    color: "#666",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  failedStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  failedText: {
    fontSize: 13,
    color: "#E53935", // Red color for failed status
    marginLeft: 3,
  },
});

export default TransactionHistoryScreen;
