import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar, Modal, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

interface LockOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

const LockOption: React.FC<LockOptionProps> = ({ icon, title, description, isSelected, onSelect }) => (
  <TouchableOpacity 
    style={[styles.lockOption, isSelected && styles.selectedOption]} 
    onPress={onSelect}
    activeOpacity={0.7}
  >
    <View style={styles.optionContent}>
      <Text style={styles.optionTitle}>{title}</Text>
      <View style={styles.optionDetails}>
        {icon}
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
      <View style={styles.offlineInfo}>
        <MaterialIcons name="wifi-off" size={16} color="#666" />
        <Text style={styles.offlineText}>Works offline</Text>
      </View>
    </View>
    <View style={[styles.radioButton, isSelected && styles.selectedRadio]}>
      {isSelected && <View style={styles.radioInner} />}
    </View>
  </TouchableOpacity>
);

export default function AppLockScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'screenLock' | 'zinkPin'>('screenLock');

  const handleContinue = () => {
    if (selectedOption === 'screenLock') {
      // handle screen lock setup
      console.log("Setting up screen lock");
      // navigate back or show success
      router.back();
    } else {
      // navigate to Zink PIN setup
      console.log("Navigate to Zink PIN setup");
    //   router.push("/settings/privacy-security/app-lock/setup-pin");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enable app lock</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <LockOption
          icon={<MaterialIcons name="security" size={20} color="#666" />}
          title="Use your screen lock"
          description="Use your existing PIN, pattern, face ID, or fingerprint"
          isSelected={selectedOption === 'screenLock'}
          onSelect={() => setSelectedOption('screenLock')}
        />

        <LockOption
          icon={<MaterialIcons name="person" size={20} color="#666" />}
          title="Use a 4-digit Zink PIN"
          description="Create a Zink PIN so only you can pay with your phone"
          isSelected={selectedOption === 'zinkPin'}
          onSelect={() => setSelectedOption('zinkPin')}
        />

        {selectedOption === 'zinkPin' && (
          <View style={styles.internetInfo}>
            <MaterialIcons name="wifi" size={16} color="#666" />
            <Text style={styles.internetText}>Needs internet connection</Text>
          </View>
        )}

        <TouchableOpacity style={styles.learnMoreButton} onPress={() => console.log("Learn more")}>
          <Ionicons name="information-circle-outline" size={20} color="#1565C0" />
          <Text style={styles.learnMoreText}>Learn more</Text>
          <AntDesign name="right" size={16} color="#1565C0" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

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
                // handle get help
              }}
            >
              <Text style={styles.modalOptionText}>Get help</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => {
                setModalVisible(false);
                // handle send feedback
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  lockOption: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedOption: {
    borderColor: "#1565C0",
    backgroundColor: "#F3F8FF",
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  optionDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  offlineInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  offlineText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  internetInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  internetText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D0D0D0",
    marginLeft: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRadio: {
    borderColor: "#1565C0",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1565C0",
  },
  learnMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 15,
  },
  learnMoreText: {
    fontSize: 16,
    color: "#1565C0",
    marginLeft: 8,
    flex: 1,
    fontWeight: "500",
  },
  continueButton: {
    backgroundColor: "#1565C0",
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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