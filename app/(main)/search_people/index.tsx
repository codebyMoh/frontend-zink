import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { searchUserByUserName } from "@/services/api/user"; // Import the API function
import {
  ApiTransaction,
  getReceivedTransactions,
  getSentTransactions,
} from "@/services/api/transaction";
import { TokenManager } from "@/services/tokenManager";
import { debouncing } from "@/utils/debouncing";

interface ApiUser {
  _id: string;
  email: string;
  userName?: string | undefined;
  walletAddressEVM: string;
  smartWalletAddress: string;
  active: boolean;
}

// Interface for contact items
interface ContactItem {
  id: string;
  name: string;
  number: string;
  initial: string;
  bgColor: string;
  isApiResult?: boolean;
  userData?: ApiUser;
}

export default function SearchPaymentsScreen() {
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ContactItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>("");
  const [recentTransactions, setRecentTransactions] = useState<ContactItem[]>(
    []
  );

  // useEffect(() => {
  //   const loadRecentTransactions = async () => {
  //     try {
  //       const currentUserId = (await TokenManager.getUserData())._id || "";

  //       const [sentTxs, receivedTxs] = await Promise.all([
  //         getSentTransactions(1, 10),
  //         getReceivedTransactions(1, 10),
  //       ]);

  //       const allTxs = [...sentTxs, ...receivedTxs].sort(
  //         (a, b) =>
  //           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //       );

  //       const recentContacts = convertTransactionsToUniqueContacts(
  //         allTxs,
  //         currentUserId
  //       );
  //       setRecentTransactions(recentContacts.slice(0, 5));
  //     } catch (error) {
  //       console.error("Failed to load recent transactions:", error);
  //     }
  //   };

  //   loadRecentTransactions();
  // }, []);

  const convertTransactionsToUniqueContacts = (
    transactions: ApiTransaction[],
    currentUserId: string
  ): ContactItem[] => {
    const userMap = new Map<string, ContactItem>();
    const colors = [
      "#34C759",
      "#FF8C00",
      "#6A5ACD",
      "#B0415E",
      "#4682B4",
      "#20B2AA",
    ];

    transactions.forEach((transaction) => {
      const isReceived = transaction.recipientId === currentUserId;
      const otherUserId = isReceived
        ? transaction.userId
        : transaction.recipientId;
      const otherUserName = isReceived
        ? transaction.userName
        : transaction.recipientUserName;

      if (otherUserId === currentUserId) return;

      if (!otherUserName || otherUserName.trim() === "") return;

      if (!userMap.has(otherUserId)) {
        const colorIndex = parseInt(otherUserId.slice(-1), 16) % colors.length;

        userMap.set(otherUserId, {
          id: otherUserId,
          name: otherUserName,
          number: `Recent transaction • ${transaction.currency}`,
          initial: otherUserName.charAt(0).toUpperCase(),
          bgColor: colors[colorIndex],
          isApiResult: false,
          userData: isReceived
            ? {
                _id: transaction.userId,
                userName: transaction.userName,
                email: "", // not available in transaction data
                walletAddressEVM: transaction.recipientAddress,
                smartWalletAddress: transaction.recipientAddress,
                active: true,
              }
            : {
                _id: transaction.recipientId,
                userName: transaction.recipientUserName,
                email: "", // not available in transaction data
                walletAddressEVM: transaction.recipientAddress,
                smartWalletAddress: transaction.recipientAddress,
                active: true,
              },
        });
      }
    });

    return Array.from(userMap.values());
  };

  const generateRandomColor = () => {
    const colors = [
      "#34C759",
      "#FF8C00",
      "#6A5ACD",
      "#B0415E",
      "#4682B4",
      "#20B2AA",
      "#FF6B6B",
      "#4ECDC4",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const convertApiUsersToContacts = (apiUsers: ApiUser[]): ContactItem[] => {
    return apiUsers.map((user) => ({
      id: user._id,
      name: user.userName ?? "",
      number: user.email,
      initial: (user.userName ?? "").charAt(0).toUpperCase(),
      bgColor: generateRandomColor(),
      isApiResult: true,
      userData: user,
    }));
  };

   const performSearch = async (query: string) => {
     setIsLoading(true);
     setSearchError("");

     try {
       const response = await searchUserByUserName(query);
       if (response.success && response.data?.users) {
         const contactItems = convertApiUsersToContacts(response.data.users);
         setSearchResults(contactItems);
       } else {
         setSearchResults([]);
         setSearchError("No users found");
       }
     } catch (error: any) {
       console.error("Search error:", error);
       setSearchResults([]);
       setSearchError(error.message || "Failed to search users");
     } finally {
       setIsLoading(false);
     }
   };

   // creating debounce function
   const debounsPerformSearch = useCallback(debouncing(performSearch, 700), []);

   useEffect(() => {
     const timeoutId = setTimeout(() => {
       if (searchText.trim().length >= 3) {
         debounsPerformSearch(searchText.trim());
       } else {
         setSearchResults([]);
         setSearchError("");
       }
     }, 500);

     return () => clearTimeout(timeoutId);
   }, [searchText]);

  const filteredRecentTransactions =
    searchText.trim().length > 0
      ? recentTransactions.filter(
          (transaction) =>
            transaction.name.toLowerCase().includes(searchText.toLowerCase()) ||
            transaction.number.toLowerCase().includes(searchText.toLowerCase())
        )
      : recentTransactions;

  // When searching (searchText >= 3 chars), exclude recent transactions that match search results
  const uniqueRecentTransactions =
    searchText.trim().length >= 3
      ? filteredRecentTransactions.filter(
          (recent) =>
            !searchResults.some(
              (searchResult) =>
                searchResult.userData?._id === recent.userData?._id ||
                searchResult.userData?.userName === recent.userData?.userName
            )
        )
      : filteredRecentTransactions;

  const displayedPeople =
    searchText.trim().length >= 3 ? searchResults : filteredRecentTransactions;

  const handlePersonPress = (person: ContactItem) => {
    console.log("Selected person:", person);
    if (person.userData) {
      router.replace({
        pathname: "/payment_chat",
        params: {
          recipientAddress: person.userData.smartWalletAddress,
          recipientId: person.userData._id,
          recipientName: person.name,
          recipientUsername: person.userData.userName || person.name,
        },
      });
    } else {
      // Handle cases with no userData - redirect to payment_chat with basic info
      router.replace({
        pathname: "/payment_chat",
        params: {
          recipientName: person.name,
          recipientUsername: person.name,
        },
      });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Top App Bar with Back Button and Search Input */}
      <View style={styles.appBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.appBarSearchInput}
          placeholder="Pay anyone on ZINK"
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
          autoFocus={true}
        />
        <TouchableOpacity
          style={styles.moreOptionsButton}
          onPress={() => console.log("More Options")}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Searching users...</Text>
          </View>
        )}

        {searchError && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{searchError}</Text>
          </View>
        )}

        {searchText.trim().length >= 3 && searchResults.length > 0 && (
          <Text style={styles.sectionHeader}>Search Results</Text>
        )}

        {searchText.trim().length < 3 && (
          <Text style={styles.sectionHeader}>Recents</Text>
        )}

        <View style={styles.peopleList}>
          {displayedPeople.map((person) => (
            <TouchableOpacity
              key={person.id}
              style={styles.personListItem}
              onPress={() => handlePersonPress(person)}
            >
              <View
                style={[
                  styles.personListAvatar,
                  { backgroundColor: person.bgColor },
                ]}
              >
                <Text style={styles.personListAvatarText}>
                  {person.initial}
                </Text>
              </View>
              <View style={styles.personListDetails}>
                <Text style={styles.personListName}>
                  {person.name}
                  {person.isApiResult && (
                    <Text style={styles.apiResultBadge}> • ZINK User</Text>
                  )}
                </Text>
                <Text style={styles.personListNumber}>{person.number}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {!isLoading &&
          displayedPeople.length === 0 &&
          searchText.trim().length >= 3 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No users found for "{searchText}"
              </Text>
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "android" ? 10 : 0,
    paddingTop: Platform.OS === "android" ? 10 : 50,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 10,
  },
  appBarSearchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
    marginHorizontal: 10,
  },
  moreOptionsButton: {
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  peopleList: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  personListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  personListAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  personListAvatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  personListDetails: {
    flex: 1,
  },
  personListName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  personListNumber: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  apiResultBadge: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "normal",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 20,
    marginHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 40,
    marginHorizontal: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});
