import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar, Modal, Pressable, Switch } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

interface NotificationOptionProps {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const NotificationOption: React.FC<NotificationOptionProps> = ({ title, subtitle, value, onValueChange }) => (
  <View style={styles.option}>
    <View style={styles.optionContent}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </View>
    <Switch
      trackColor={{ false: "#E0E0E0", true: "#1565C0" }}
      thumbColor={value ? "#ffffff" : "#ffffff"}
      ios_backgroundColor="#E0E0E0"
      onValueChange={onValueChange}
      value={value}
      style={styles.switch}
    />
  </View>
);

export default function NotificationsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [zinkTips, setZinkTips] = useState(true);
  const [friendsActivity, setFriendsActivity] = useState(true);
  const [smartAlerts, setSmartAlerts] = useState(true);
  const [offersRewards, setOffersRewards] = useState(true);
  const [transactionHistory, setTransactionHistory] = useState(true);
  const [chatMessages, setChatMessages] = useState(true);
  const [locationAlerts, setLocationAlerts] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications and emails</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Info Text */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            You'll get a notification after every transaction and payment request. Manage all other notifications here.
          </Text>
        </View>

        {/* Notifications Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>

        <View style={styles.optionsGroup}>
          <NotificationOption
            title="Zink tips"
            subtitle="Get tips on getting the most out of Zink, made just for you"
            value={zinkTips}
            onValueChange={setZinkTips}
          />
          
          <NotificationOption
            title="Friends' activity"
            subtitle="Get alerts on what's new with your contacts & friends"
            value={friendsActivity}
            onValueChange={setFriendsActivity}
          />
          
          <NotificationOption
            title="Smart alerts"
            subtitle="Get notified of upcoming bills"
            value={smartAlerts}
            onValueChange={setSmartAlerts}
          />
          
          <NotificationOption
            title="Offers & rewards"
            subtitle="Find out when you earn new rewards, and stay up to date on offers"
            value={offersRewards}
            onValueChange={setOffersRewards}
          />
          
          <NotificationOption
            title="Transaction history & recommendations"
            subtitle="Get summaries and useful recommendations based on your Google Pay transaction history"
            value={transactionHistory}
            onValueChange={setTransactionHistory}
          />
          
          <NotificationOption
            title="Chat messages"
            subtitle="Get notified about incoming chat messages"
            value={chatMessages}
            onValueChange={setChatMessages}
          />
          
          <View style={[styles.option, { borderBottomWidth: 0 }]}>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Location based alerts</Text>
              <Text style={styles.optionSubtitle}>
                Turn on background location to get timely reminders from stores around you
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#1565C0" }}
              thumbColor={locationAlerts ? "#ffffff" : "#ffffff"}
              ios_backgroundColor="#E0E0E0"
              onValueChange={setLocationAlerts}
              value={locationAlerts}
              style={styles.switch}
            />
          </View>
        </View>
      </ScrollView>

      {/* Options Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <Pressable style={styles.centeredView} onPress={() => setModalVisible(false)}>
          <View style={styles.modalView}>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => {
                setModalVisible(false);
                // Handle get help
              }}
            >
              <Text style={styles.modalOptionText}>Get help</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => {
                setModalVisible(false);
                // Handle send feedback
              }}
            >
              <Text style={styles.modalOptionText}>Send feedback</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#F0F4F7",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  backButton: {
    padding: 5,
  },
  menuButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoContainer: {
    paddingVertical: 20,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  optionsGroup: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  option: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  optionContent: {
    flex: 1,
    marginRight: 15,
  },
  optionTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginTop: 50,
    marginRight: 20,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOption: {
    width: 150,
    padding: 10,
  },
  modalOptionText: {
    fontSize: 16,
  },
});