import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar, Modal, Pressable, Switch } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DataPersonalisationScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [personalisationEnabled, setPersonalisationEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data and personalisation</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.infoText}>
          Your personal information is never shared publicly or sold to anyone.
        </Text>
        
        <Text style={styles.description}>
          You can change your app settings here and manage payment info, transactions and activity in your{" "}
          <TouchableOpacity onPress={() => console.log("Navigate to Zink account")}>
            <Text style={styles.linkText}>Zink account</Text>
          </TouchableOpacity>.
        </Text>

        <View style={styles.personalisationSection}>
          <View style={styles.personalisationHeader}>
            <Text style={styles.sectionTitle}>Personalisation within Zink</Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#1565C0" }}
              thumbColor={personalisationEnabled ? "#ffffff" : "#ffffff"}
              ios_backgroundColor="#E0E0E0"
              onValueChange={setPersonalisationEnabled}
              value={personalisationEnabled}
              style={styles.switch}
            />
          </View>

          <View style={styles.infoBox}>
            <MaterialIcons name="location-on" size={20} color="#666" />
            <Text style={styles.infoBoxText}>
              For example, get offers from stores where you shop and recommendations for ways to save
            </Text>
          </View>

          <Text style={styles.detailText}>
            When you use Zink, info from things like your transactions and payment methods are saved in your Zink Account. If you turn on personalisation within Zink, this data and additional info (like the location where you made a purchase) will also be saved and used to personalise your Zink experience.
          </Text>

          <Text style={styles.detailText}>
            Zink still works with this setting off. Things you do and keep will still be saved to personalise the service, but they will not be used for personalisation. For example, you'll be able to make contactless payments, but you see might be less relevant.
          </Text>

          <Text style={styles.detailText}>
            Turning this setting on or off will not change how your purchases are saved and used in other Zink services (like apps you buy in Zink Play or movies you rent in YouTube).
          </Text>

          <TouchableOpacity onPress={() => console.log("Learn more about personalisation")}>
            <Text style={styles.linkText}>Learn more about personalisation</Text>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    lineHeight: 22,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 30,
    lineHeight: 22,
  },
  linkText: {
    color: "#1565C0",
    textDecorationLine: "underline",
  },
  personalisationSection: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  personalisationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F8F9FA",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoBoxText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
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