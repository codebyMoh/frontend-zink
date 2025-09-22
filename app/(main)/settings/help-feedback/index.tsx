import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

interface HelpOptionProps {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
  showChevron?: boolean;
}

const HelpOption: React.FC<HelpOptionProps> = ({ icon, title, onPress, showChevron = true }) => (
  <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={0.7}>
    {icon}
    <Text style={styles.optionTitle}>{title}</Text>
    <View style={{ flex: 1 }} />
    {showChevron && <AntDesign name="right" size={16} color="#888" />}
  </TouchableOpacity>
);

export default function HelpFeedbackScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & feedback</Text>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.optionsGroup}>
          <HelpOption
            icon={<Ionicons name="help-circle-outline" size={24} color="#1565C0" />}
            title="Get help"
            onPress={() => {
              // handle Get help navigation
            }}
          />
          <HelpOption
            icon={<MaterialCommunityIcons name="message-text-outline" size={24} color="#1565C0" />}
            title="Send feedback"
            onPress={() => {
              // handle Send feedback navigation
            }}
          />
          <HelpOption
            icon={<MaterialCommunityIcons name="file-document-outline" size={24} color="#1565C0" />}
            title="Raise BBPS dispute"
            onPress={() => {
              // handle BBPS dispute navigation
            }}
          />
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
    flex: 1,
  },
});