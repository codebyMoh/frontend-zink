import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AutopayScreen() {
  const handleCreateAutopay = () => {
    // Logic to navigate to the "Create Autopay" flow
    console.log("Create Autopay button pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <MaterialCommunityIcons name="refresh-auto" size={120} color="#ccc" />
        <Text style={styles.message}>No active autopay found</Text>
        <Text style={styles.subtext}>You can create a new autopay for your monthly bills.</Text>
        <TouchableOpacity style={styles.button} onPress={handleCreateAutopay}>
          <Text style={styles.buttonText}>Create Autopay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F7",
    padding: 20,
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  subtext: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#1565C0",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});