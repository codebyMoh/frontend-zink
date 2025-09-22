import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";

interface HelpOptionProps {
  title: string;
  onPress: () => void;
}

const HelpOption: React.FC<HelpOptionProps> = ({ title, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <Text style={styles.optionTitle}>{title}</Text>
    <AntDesign name="right" size={16} color="#888" />
  </TouchableOpacity>
);

export default function GetHelpScreen() {
  const helpTopics = [
    { title: "How to send money", onPress: () => {} },
    { title: "How to receive money", onPress: () => {} },
    { title: "How to pay bills", onPress: () => {} },
    { title: "How to link a bank account", onPress: () => {} },
    { title: "How to change password", onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.optionsGroup}>
          <Text style={styles.groupTitle}>Popular Topics</Text>
          {helpTopics.map((item, index) => (
            <HelpOption key={index} title={item.title} onPress={item.onPress} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F7",
  },
  scrollViewContent: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 50,
    color: "#333",
  },
  optionsGroup: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  optionTitle: {
    fontSize: 16,
    color: "#333",
  },
});