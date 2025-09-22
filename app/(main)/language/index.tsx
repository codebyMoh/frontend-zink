import { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";

interface LanguageOptionProps {
  language: string;
  isSelected: boolean;
  onPress: () => void;
}

const LanguageOption: React.FC<LanguageOptionProps> = ({ language, isSelected, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <Text style={styles.optionTitle}>{language}</Text>
    {isSelected && (
      <MaterialCommunityIcons name="check-circle" size={24} color="#1565C0" />
    )}
  </TouchableOpacity>
);

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const languages = ["English", "Spanish", "French", "German", "Italian"];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.optionsGroup}>
          {languages.map((lang, index) => (
            <LanguageOption
              key={index}
              language={lang}
              isSelected={selectedLanguage === lang}
              onPress={() => setSelectedLanguage(lang)}
            />
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