import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar, Modal, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function SendFeedbackScreen() {
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSendFeedback = () => {
    setShowGoogleModal(true);
  };

  const handleGetStarted = () => {
    setShowGoogleModal(false);
    // here implement the actual feedback flow
    // this might involve opening a form or external feedback system
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send feedback</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Help us improve by sharing your thoughts and suggestions about the app.
          </Text>
          
          <TouchableOpacity style={styles.feedbackButton} onPress={handleSendFeedback}>
            <MaterialCommunityIcons name="message-text-outline" size={24} color="#1565C0" />
            <Text style={styles.feedbackButtonText}>Send Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Google Feedback Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showGoogleModal}
        onRequestClose={() => setShowGoogleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowGoogleModal(false)} />
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowGoogleModal(false)} style={styles.modalCloseButton}>
                <AntDesign name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Send feedback to Google</Text>
              <View style={styles.placeholder} />
            </View>
            
            <View style={styles.modalContent}>
              <View style={styles.welcomeTag}>
                <Text style={styles.welcomeText}>Welcome! 👋</Text>
              </View>
              
              <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.modalOption}>
                  <MaterialCommunityIcons name="message-question-outline" size={24} color="#666" />
                  <Text style={styles.modalOptionTitle}>Answer a few questions</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.modalOption}>
                  <MaterialCommunityIcons name="send" size={24} color="#666" />
                  <Text style={styles.modalOptionTitle}>Share your feedback</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.privacyText}>
                Some account and system information may be sent to Google, subject to our Privacy Policy and Terms of Service. Go to Legal Help to report illegal content.
              </Text>
              
              <TouchableOpacity style={styles.manageInfoButton}>
                <MaterialCommunityIcons name="shield-outline" size={16} color="#666" />
                <Text style={styles.manageInfoText}>Manage your Account and system information</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
                <Text style={styles.getStartedText}>Get started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  content: {
    paddingVertical: 20,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    lineHeight: 24,
  },
  feedbackButton: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  feedbackButtonText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
    fontWeight: "500",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalCloseButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  modalContent: {
    padding: 20,
  },
  welcomeTag: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
  },
  optionsContainer: {
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  modalOptionTitle: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  privacyText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
    marginBottom: 15,
  },
  manageInfoButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  manageInfoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  getStartedButton: {
    backgroundColor: "#5F6368",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
  },
  getStartedText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});