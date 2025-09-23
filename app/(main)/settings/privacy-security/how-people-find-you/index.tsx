import { router } from "expo-router";
import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar, Modal, Pressable, Switch, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { TokenManager } from "@/services/tokenManager";
import { useUser } from "@account-kit/react-native";

interface FindYouOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  toggleValue: boolean;
  onToggleChange: (value: boolean) => void;
  showProfile?: boolean;
  userName?: string;
  paymentId?: string;
}

const FindYouOption: React.FC<FindYouOptionProps> = ({ 
  icon, 
  title, 
  description, 
  toggleValue,
  onToggleChange,
  showProfile = false,
  userName,
  paymentId
}) => (
  <View style={styles.optionContainer}>
    <View style={styles.option}>
      {icon}
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
      <Switch
        trackColor={{ false: "#E0E0E0", true: "#1565C0" }}
        thumbColor={toggleValue ? "#ffffff" : "#ffffff"}
        ios_backgroundColor="#E0E0E0"
        onValueChange={onToggleChange}
        value={toggleValue}
        style={styles.switch}
      />
    </View>
    
    {showProfile && toggleValue && (
      <>
        <Text style={styles.profileNote}>
          If you have set your Payment ID as your UPI number, people can still pay your Payment ID from any UPI app.
        </Text>
        
        <View style={styles.profileInfo}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileImageText}>
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{userName || "Your Name"}</Text>
            <Text style={styles.profileId}>{paymentId || "@your_payment_id"}</Text>
          </View>
        </View>
      </>
    )}
  </View>
);

export default function HowPeopleFindYouScreen() {
  const user = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [allowPeopleToFindYou, setAllowPeopleToFindYou] = useState(true);
  const [allowGroupInvites, setAllowGroupInvites] = useState(false);
  const [syncContacts, setSyncContacts] = useState(true);
  
  const [userName, setUserName] = useState("Your Name");
  const [paymentId, setPaymentId] = useState("@your_payment_id");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await TokenManager.getUserData();
        if (userData?.userName) {
          setUserName(userData.userName);
        }
        if (userData?.paymentId) {
          setPaymentId(userData.paymentId);
        }
      } catch (error) {
        console.log("Error loading user data:", error);
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
        <Text style={styles.headerTitle}>How people find you</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <FindYouOption
          icon={<Ionicons name="people" size={24} color="#1565C0" />}
          title="Allow people to find you"
          description="Let people with your Payment ID connect with you across Zink services you use like Zink photos. In Zink, they will see your name and picture."
          toggleValue={allowPeopleToFindYou}
          onToggleChange={setAllowPeopleToFindYou}
          showProfile={true}
          userName={userName}
          paymentId={paymentId}
        />

        <FindYouOption
          icon={<Ionicons name="people-outline" size={24} color="#1565C0" />}
          title="Allow people to add you to groups"
          description="Allow your Zink contacts to add you to groups"
          toggleValue={allowGroupInvites}
          onToggleChange={setAllowGroupInvites}
        />

        <FindYouOption
          icon={<MaterialIcons name="contacts" size={24} color="#1565C0" />}
          title="Sync your contacts"
          description="Zink will use your contacts to help you find friends and avoid fraud"
          toggleValue={syncContacts}
          onToggleChange={setSyncContacts}
        />
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
  optionContainer: {
    backgroundColor: "#fff",
    borderRadius: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  option: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  optionContent: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  optionTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
    marginTop: 5,
  },
  profileNote: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#5d4038",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  profileDetails: {
    marginLeft: 15,
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  profileId: {
    fontSize: 14,
    color: "#666",
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