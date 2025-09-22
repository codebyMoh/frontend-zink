import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, StatusBar } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

interface AboutOptionProps {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
  showChevron?: boolean;
}

const AboutOption: React.FC<AboutOptionProps> = ({ icon, title, onPress, showChevron = true }) => (
  <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={0.7}>
    {icon}
    <Text style={styles.optionTitle}>{title}</Text>
    <View style={{ flex: 1 }} />
    {showChevron && <AntDesign name="right" size={16} color="#888" />}
  </TouchableOpacity>
);

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.optionsGroup}>
          <AboutOption
            icon={<MaterialCommunityIcons name="file-document-outline" size={24} color="#1565C0" />}
            title="Terms of service"
            onPress={() => {
              // handle Terms of service navigation
            }}
          />
          <AboutOption
            icon={<MaterialCommunityIcons name="lock-outline" size={24} color="#1565C0" />}
            title="Privacy policy"
            onPress={() => {
              // handle Privacy policy navigation
            }}
          />
          <AboutOption
            icon={<Ionicons name="information-circle-outline" size={24} color="#1565C0" />}
            title="Software licences"
            onPress={() => {
              // handle Software licences navigation
            }}
          />
          <AboutOption
            icon={<MaterialCommunityIcons name="information-outline" size={24} color="#1565C0" />}
            title="Version 296.1.1 (arm64-v8a_release_flutter)"
            showChevron={false}
            onPress={() => {
              // handle version info
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