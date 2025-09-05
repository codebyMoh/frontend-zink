import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Interface for suggested category items
interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  onPress: () => void;
}

// Interface for contact items
interface ContactItem {
  id: string;
  name: string;
  number: string;
  initial: string;
  bgColor: string;
}

export default function SearchPaymentsScreen() {
  const [searchText, setSearchText] = useState<string>("");

  const allPeople: ContactItem[] = [
    {
      id: "p1",
      name: "Self transfer",
      number: "Transfer money between your accounts",
      initial: "S",
      bgColor: "#34C759",
    }, // Green for self
    {
      id: "p2",
      name: "Split expenses",
      number: "Share expenses with a group",
      initial: "S",
      bgColor: "#FF8C00",
    }, // Orange for split
    {
      id: "p3",
      name: "7D_15_GAJERA SHREYANS RAMES...",
      number: "+91 98793 53622",
      initial: "G",
      bgColor: "#6A5ACD",
    },
    {
      id: "p4",
      name: "Alagiya Bakul",
      number: "+91 95375 03445",
      initial: "A",
      bgColor: "#B0415E",
    },
    {
      id: "p5",
      name: "Alagiya Suresh",
      number: "+91 90998 52904",
      initial: "A",
      bgColor: "#4682B4",
    },
    {
      id: "p6",
      name: "John Doe",
      number: "+1 123 456 7890",
      initial: "J",
      bgColor: "#20B2AA",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Top App Bar with Back Button and Search Input */}
      <View style={styles.appBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.appBarSearchInput}
          placeholder="Pay anyone on UPI"
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
          autoFocus={true}
        />
        <TouchableOpacity
          style={styles.moreOptionsButton}
          onPress={() => console.log("More Options")}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* All People on UPI */}
        <Text style={styles.sectionHeader}>All people on ZINK</Text>
        <View style={styles.peopleList}>
          {allPeople.map((person) => (
            <TouchableOpacity
              key={person.id}
              style={styles.personListItem}
              onPress={() => router.push("/pay")}
            >
              <View
                style={[
                  styles.personListAvatar,
                  { backgroundColor: person.bgColor },
                ]}
              >
                <Text style={styles.personListAvatarText}>
                  {person.initial}
                </Text>
              </View>
              <View style={styles.personListDetails}>
                <Text style={styles.personListName}>{person.name}</Text>
                <Text style={styles.personListNumber}>{person.number}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "android" ? 10 : 0,
    paddingTop: Platform.OS === "android" ? 10 : 50,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 10,
  },
  appBarSearchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000",
    marginHorizontal: 10,
  },
  moreOptionsButton: {
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  // Categories Grid
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  categoryItem: {
    width: "25%",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 10,
  },
  categoryIconBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },
  // People List
  peopleList: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  personListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  personListAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  personListAvatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  personListDetails: {
    flex: 1,
  },
  personListName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  personListNumber: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
});
