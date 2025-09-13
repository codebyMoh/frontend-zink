import { AntDesign } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  currency: string;
  date: string;
  time: string;
  status: 'paid' | 'pending' | 'failed';
  description?: string;
}

export default function PaymentChatScreen() {
  const params = useLocalSearchParams();
  const recipientName = params.recipientName as string || "Lacey Turner";
  const recipientUsername = params.recipientUsername as string || "";
  const recipientId = params.recipientId as string || "";

  // Mock transaction data - replace with API call later
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'sent',
      amount: 1637,
      currency: 'USDC',
      date: '12 Aug',
      time: '9:45 am',
      status: 'paid',
    },
    {
      id: '2',
      type: 'received',
      amount: 500,
      currency: 'USDC',
      date: '20 Aug',
      time: '9:57 pm',
      status: 'paid',
      description: 'airbnb refund'
    },
    {
      id: '3',
      type: 'received',
      amount: 3802,
      currency: 'USDC',
      date: '24 Aug',
      time: '7:56 pm',
      status: 'paid',
      description: 'amazon refund'
    }
  ]);

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const generateAvatarColor = (name: string) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];
    const index = name.length % colors.length;
    return colors[index];
  };

  const handlePayPress = () => {
    router.push({
      pathname: "/pay",
      params: {
        recipientId,
        recipientName,
        recipientUsername,
      }
    });
  };

  const handleRequestPress = () => {
    // TODO: Implement request functionality
    console.log("Request payment from", recipientName);
  };

  const formatDate = (dateStr: string, timeStr: string) => {
    return `${dateStr}, ${timeStr}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
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
            <Text style={styles.avatarText}>
              {getInitial(recipientName)}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{recipientName}</Text>
            {recipientUsername && (
              <Text style={styles.headerUsername}>@{recipientUsername}</Text>
            )}
          </View>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* Transaction History */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.transactionContainer}>
          {transactions.map((transaction, index) => (
            <View key={transaction.id}>
              {/* Date separator */}
              <Text style={styles.dateSeparator}>
                {formatDate(transaction.date, transaction.time)}
              </Text>

              {/* Transaction card */}
              <View style={[styles.transactionCard, transaction.type === 'sent' ? styles.sentCard : styles.receivedCard]}>
                <Text style={styles.transactionTitle}>
                  {transaction.type === 'sent' 
                    ? `Payment to ${recipientName}` 
                    : 'Payment to you'}
                </Text>
                
                {transaction.description && (
                  <Text style={[styles.transactionDescription,transaction.type === 'sent' && styles.sentText]}>
                    {transaction.description}
                  </Text>
                )}

                <Text style={[styles.transactionAmount,transaction.type === 'sent' && styles.sentText]}>
                  {transaction.amount.toLocaleString('en-IN')} {transaction.currency}
                </Text>

                <View style={styles.transactionStatus}>
                  <View style={[
                    styles.statusIndicator, 
                    { backgroundColor: transaction.status === 'paid' ? '#4CAF50' : '#FFC107' }
                  ]} />
                  <Text style={[
                    styles.statusText,
                    { 
                      color: transaction.status === 'paid' ? '#4CAF50' : '#FFC107',
                      ...(transaction.type === 'sent' && { color: '#E6F2FF' })
                    }
                  ]}>
                    {transaction.status === 'paid' ? 'Paid' : 'Pending'} • {transaction.date}
                  </Text>
                  <AntDesign 
                    name="right" 
                    size={16} 
                    color={transaction.type === 'sent' ? '#E6F2FF' : '#999'} 
                    style={styles.statusArrow} 
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayPress}>
          <Text style={styles.payButtonText}>Pay</Text>
        </TouchableOpacity>
        
        {/* <TouchableOpacity style={styles.requestButton} onPress={handleRequestPress}>
          <Text style={styles.requestButtonText}>Request</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'android' ? 12 : 50,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerUsername: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  transactionContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  dateSeparator: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginVertical: 20,
    backgroundColor: '#F5F5F5',
  },
  transactionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  transactionAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  transactionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  statusArrow: {
    marginLeft: 8,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  payButton: {
    flex: 1,
    backgroundColor: '#34C759',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  requestButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestButtonText: {
    color: '#34C759',
    fontSize: 16,
    fontWeight: '600',
  },


sentCard: {
    alignSelf: 'flex-end',
    backgroundColor: '#34C759',
},
receivedCard: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
},
sentText: {
    color: '#E6F2FF',
},
receivedText: {
    color: '#000',
},
});