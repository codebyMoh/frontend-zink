import { TokenManager } from "@/services/tokenManager";
import { useUser } from "@account-kit/react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onEditPress?: () => void;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, onEditPress }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLeft}>
      {icon}
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  </View>
);

export default function PersonalInfoScreen() {
  const user = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState("Jhone Doe");

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await TokenManager.getUserData();
      if (userData?.userName) {
        setUserName(userData.userName);
      }
    };
    loadUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal info</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>
                {userName?.charAt(0)?.toUpperCase() || "J"}
              </Text>
            </View>
            <TouchableOpacity style={styles.editImageButton}>
              <Ionicons name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Section - Username and Email */}
        <View style={styles.infoSection}>
          <InfoRow
            icon={<Ionicons name="person-outline" size={24} color="#1565C0" />}
            label="Username"
            value={userName}
          />
          
          <InfoRow
            icon={<MaterialCommunityIcons name="email-outline" size={24} color="#666" />}
            label="Email"
            value={user?.email || ""}
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
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 40,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#5d4038",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1565C0",
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#F0F4F7",
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editText: {
    fontSize: 16,
    color: "#1565C0",
    fontWeight: "500",
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