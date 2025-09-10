import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { getSentTransactions, getReceivedTransactions, ApiTransaction } from "@/services/api/transaction";

interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: string;
  status: "success" | "failed";
  initial: string;
  bgColor: string;
  txHash: string;
  currency: string;
}

const convertApiToDisplayTransaction = (apiTransaction: ApiTransaction, type: 'sent' | 'received'): Transaction => {
  const colors = [
    "#56a5ebff", "#f79951ff", "#a164f1ff", "#57a2e4ff", 
    "#a7e75eff", "#e66e84ff", "#da7b66ff", "#a963e6ff",
    "#6a82eeff", "#e672b0ff", "#b571f1ff", "#647ff7ff"
  ];
  
  const colorIndex = parseInt(apiTransaction._id.slice(-1), 16) % colors.length;
  
  const date = new Date(apiTransaction.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long'
  });

  const name = type === 'sent' 
    ? `To: ${apiTransaction.recipientAddress.slice(0, 6)}...${apiTransaction.recipientAddress.slice(-4)}`
    : `From: ${apiTransaction.recipientAddress.slice(0, 6)}...${apiTransaction.recipientAddress.slice(-4)}`;

  return {
    id: apiTransaction._id,
    name: name,
    date: date,
    amount: apiTransaction.amount.toString(),
    status: "success", //coz all stored tx are successfull
    initial: type === 'sent' ? 'S' : 'R',
    bgColor: colors[colorIndex],
    txHash: apiTransaction.tx,
    currency: apiTransaction.currency,
  };
};

const TransactionHistoryScreen: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadTransactions = async (reset: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const limit = 20;
      
      let apiTransactions: ApiTransaction[] = [];
      
      if (activeTab === 'sent') {
        apiTransactions = await getSentTransactions(currentPage, limit);
      } else {
        apiTransactions = await getReceivedTransactions(currentPage, limit);
      }

      const displayTransactions = apiTransactions.map(transaction => 
        convertApiToDisplayTransaction(transaction, activeTab)
      );

      if (reset) {
        setAllTransactions(displayTransactions);
        setPage(2);
      } else {
        setAllTransactions(prev => [...prev, ...displayTransactions]);
        setPage(prev => prev + 1);
      }

      setHasMore(displayTransactions.length === limit);
    } catch (error) {
      // Alert.alert('Error', 'Failed to load transactions. Please try again.');
      // console.error('Load transactions error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText === "") {
      setFilteredTransactions(allTransactions);
    } else {
      const filtered = allTransactions.filter((transaction) =>
        transaction.name.toLowerCase().includes(searchText.toLowerCase()) ||
        transaction.txHash.toLowerCase().includes(searchText.toLowerCase()) ||
        transaction.currency.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  }, [searchText, allTransactions]);

  useEffect(() => {
    setPage(1);
    setAllTransactions([]);
    loadTransactions(true);
  }, [activeTab]);

 const totalAmount = filteredTransactions.reduce((sum, transaction) => {
  const amount = parseFloat(transaction.amount);
 return sum + amount;
}, 0);

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
            value={searchText}
            onChangeText={setSearchText}
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

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'sent' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('sent')}
        >
          <MaterialCommunityIcons 
            name="arrow-up" 
            size={20} 
            color={activeTab === 'sent' ? '#fff' : '#666'} 
          />
          <Text style={[
            styles.tabButtonText,
            activeTab === 'sent' && styles.activeTabButtonText
          ]}>
            Sent Transactions
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'received' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('received')}
        >
          <MaterialCommunityIcons 
            name="arrow-down" 
            size={20} 
            color={activeTab === 'received' ? '#fff' : '#666'} 
          />
          <Text style={[
            styles.tabButtonText,
            activeTab === 'received' && styles.activeTabButtonText
          ]}>
            Received Transactions
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Monthly Summary */}
        <View style={styles.monthSummary}>
          <Text style={styles.monthYear}>
            {activeTab === 'sent' ? 'Total Sent' : 'Total Received'}
          </Text>
          <Text style={styles.monthTotal}>
            {totalAmount.toFixed(4)} USDC
          </Text>
        </View>

        {/* Loading indicator */}
        {loading && allTransactions.length === 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5abb5eff" />
            <Text style={styles.loadingText}>Loading transactions...</Text>
          </View>
        )}

        {/* No transactions message */}
        {!loading && filteredTransactions.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons 
              name="receipt" 
              size={60} 
              color="#ccc" 
            />
            <Text style={styles.emptyText}>
              No {activeTab} transactions found
            </Text>
          </View>
        )}

        {/* Transaction List */}
        {filteredTransactions.map((transaction) => (
          <TouchableOpacity 
            key={transaction.id} 
            style={styles.transactionItem}
            onPress={() => {
              // TODO: add navigation to transaction details here
              Alert.alert(
                'Transaction Details',
                `Transaction Hash: ${transaction.txHash}\nAmount: ${transaction.amount} ${transaction.currency}\nDate: ${transaction.date}`
              );
            }}
          >
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
              <Text style={styles.transactionHash}>
                {transaction.txHash.slice(0, 10)}...{transaction.txHash.slice(-6)}
              </Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={[
                styles.transactionAmount,
                { color: activeTab === 'sent' ? '#E53935' : '#4CAF50' }
              ]}>
                {activeTab === 'sent' ? '-' : '+'}{transaction.amount}
              </Text>
              <Text style={styles.currencyText}>{transaction.currency}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Load More Button */}
        {hasMore && !loading && filteredTransactions.length > 0 && (
          <TouchableOpacity 
            style={styles.loadMoreButton}
            onPress={() => loadTransactions(false)}
          >
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}

        {/* Loading more indicator */}
        {loading && allTransactions.length > 0 && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color="#5abb5eff" />
          </View>
        )}
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
    backgroundColor: "#f0f0f0",
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  activeTabButton: {
    backgroundColor: '#5abb5eff',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 8,
  },
  activeTabButtonText: {
    color: '#fff',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
  transactionHash: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  currencyText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  loadMoreButton: {
    backgroundColor: '#5abb5eff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 15,
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingMoreContainer: {
    paddingVertical: 15,
    alignItems: 'center',
  },
});

export default TransactionHistoryScreen;