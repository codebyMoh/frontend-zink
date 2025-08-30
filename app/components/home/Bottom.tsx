import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Define an interface for the shape of each option object
interface Option {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap; // Type for icon names
  onPress?: () => void; // onPress is optional as it's not always defined in the initial dummy data
}

const MoreOptions: React.FC = () => {
  const router = useRouter();

  // Explicitly type the options array using the Option interface
  const options: Option[] = [
    {
      id: "2",
      name: "See transaction history",
      icon: "history",
      onPress: () => router.push("/history"),
    },
  ];

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.optionItem}
          onPress={option.onPress} // Use the onPress defined in the option object
        >
          <View style={styles.iconContainer}>
            {/* Changed icon color to the theme's green */}
            <MaterialCommunityIcons
              name={option.icon}
              size={30}
              color="#5abb5eff"
            />
          </View>
          {/* Changed text color to black for better contrast on white background */}
          <Text style={styles.optionText}>{option.name}</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff", // Changed to white background
    borderRadius: 16, // Keep rounded corners for consistency
    marginBottom: 20,
    // Removed shadow properties for a simpler look
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    // Removed borderBottomWidth and borderBottomColor for a simpler look
  },
  iconContainer: {
    marginRight: 15,
  },
  optionText: {
    color: "#000", // Changed to black text color
    fontSize: 20,
    flex: 1,
  },
});

export default MoreOptions;
