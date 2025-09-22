import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar, Modal, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';

interface SettingsOptionProps {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
  showChevron?: boolean;
}

const SettingsOption: React.FC<SettingsOptionProps> = ({ icon, title, onPress, showChevron = true }) => (
  <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={0.7}>
    {icon}
    <Text style={styles.optionTitle}>{title}</Text>
    <View style={{ flex: 1 }} />
    {showChevron && <AntDesign name="right" size={16} color="#888" />}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.optionsGroup}>
          <SettingsOption
            icon={<Ionicons name="person-outline" size={24} color="#1565C0" />}
            title="Personal info"
            onPress={() => router.push("/settings/personal-info")}
          />
          <SettingsOption
            icon={<Ionicons name="notifications-outline" size={24} color="#1565C0" />}
            title="Notifications & emails"
            // onPress={() => router.push("/settings/notifications")}
          />
          <SettingsOption
            icon={<MaterialCommunityIcons name="shield-lock-outline" size={24} color="#1565C0" />}
            title="Privacy & security"
            // onPress={() => router.push("/settings/privacy-security")}
          />
        </View>

        <View style={styles.optionsGroup}>
          <SettingsOption
            icon={<Feather name="info" size={24} color="#1565C0" />}
            title="About"
            // onPress={() => router.push("/settings/about")}
          />
          <SettingsOption
            icon={<Ionicons name="help-circle-outline" size={24} color="#1565C0" />}
            title="Help & feedback"
            // onPress={() => router.push("/settings/help-feedback")}
          />
          <SettingsOption
            icon={<MaterialCommunityIcons name="lock-outline" size={24} color="#1565C0" />}
            title="Lock app"
            // onPress={() => router.push("/settings/lock-app")}
          />
        </View>

        <TouchableOpacity style={styles.signOutOption} onPress={() => {}}>
          <Ionicons name="log-out-outline" size={24} color="#D32F2F" />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Pressable style={styles.centeredView} onPress={() => setModalVisible(false)}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.modalOption} onPress={() => {
              // Handle Get help
              setModalVisible(false);
            }}>
              <Text style={styles.modalOptionText}>Get help</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => {
              // Handle Send feedback
              setModalVisible(false);
            }}>
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  backButton: {
    padding: 5,
  },
  menuButton: {
    padding: 5,
  },
  scrollView: {
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
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  optionTitle: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  signOutOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 20,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#D32F2F",
    marginLeft: 15,
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
    // textAlign: "flex-end",
    fontSize: 16,
  },
});