import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar, Modal, Pressable, Switch } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

interface PrivacyOptionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress?: () => void;
  showChevron?: boolean;
  showToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
}

const PrivacyOption: React.FC<PrivacyOptionProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showChevron = true, 
  showToggle = false,
  toggleValue = false,
  onToggleChange 
}) => (
  <TouchableOpacity 
    style={styles.option} 
    onPress={onPress} 
    activeOpacity={showToggle ? 1 : 0.7}
    disabled={showToggle}
  >
    {icon}
    <View style={styles.optionContent}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </View>
    {showToggle ? (
      <Switch
        trackColor={{ false: "#E0E0E0", true: "#1565C0" }}
        thumbColor={toggleValue ? "#ffffff" : "#ffffff"}
        ios_backgroundColor="#E0E0E0"
        onValueChange={onToggleChange}
        value={toggleValue}
        style={styles.switch}
      />
    ) : showChevron ? (
      <AntDesign name="right" size={16} color="#888" />
    ) : null}
  </TouchableOpacity>
);

export default function PrivacySecurityScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [appLockEnabled, setAppLockEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & security</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsGroup}>
          <PrivacyOption
            icon={<MaterialIcons name="security" size={24} color="#1565C0" />}
            title="Data and personalisation"
            subtitle="Manage how your info is saved and used"
            onPress={() => {
              router.push("/settings/privacy-security/data-personalisation");
            }}
          />
          
          <View style={styles.appLockSection}>
            <PrivacyOption
              icon={<Ionicons name="lock-closed-outline" size={24} color="#1565C0" />}
              title="Enable app lock"
              subtitle="Use your existing passcode to keep your app secure"
              showToggle={true}
              toggleValue={appLockEnabled}
              onToggleChange={setAppLockEnabled}
              showChevron={false}
            />
            
            {appLockEnabled && (
              <TouchableOpacity style={styles.manageAppLock} onPress={() => {
                router.push("/settings/privacy-security/app-lock");
              }}>
                <Text style={styles.manageAppLockText}>Manage your app lock</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <PrivacyOption
            icon={<MaterialCommunityIcons name="message-text-outline" size={24} color="#1565C0" />}
            title="Get OTP code"
            subtitle="Enter this one-time code when you call Zink Support"
            onPress={() => {
              // router.push("/settings/privacy-security/otp-code");
            }}
          />
          
          <PrivacyOption
            icon={<MaterialCommunityIcons name="account-cancel-outline" size={24} color="#1565C0" />}
            title="Blocked people"
            subtitle="See and edit people you've blocked"
            onPress={() => {
              router.push("/settings/privacy-security/blocked-people");
            }}
          />
          
          <PrivacyOption
            icon={<Ionicons name="search-outline" size={24} color="#1565C0" />}
            title="How people find you on Zink"
            subtitle="Manage your profile preferences"
            onPress={() => {
              // router.push("/settings/privacy-security/how-people-find-you");
            }}
            showChevron={true}
          />
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
                router.push("/settings/help-feedback");
              }}
            >
              <Text style={styles.modalOptionText}>Get help</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => {
                setModalVisible(false);
                router.push("/settings/help-feedback");
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
    paddingTop: 10,
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
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  optionContent: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
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
  appLockSection: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  manageAppLock: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 59, // Align with the text above (20 + 24 + 15)
  },
  manageAppLockText: {
    fontSize: 16,
    color: "#1565C0",
    fontWeight: "500",
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
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