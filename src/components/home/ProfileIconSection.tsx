import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface ContactItem {
  id: string;
  name: string;
  number: string;
  initial: string;
  bgColor: string;
}


interface PeopleListWithToggleProps {
  title: string;
  people: ContactItem[];
  initialVisibleCount?: number;
}

const ProfileIconSection: React.FC<PeopleListWithToggleProps> = ({
  title,
  people,
  initialVisibleCount = 8,
}) => {
  const [showAll, setShowAll] = useState<boolean>(false);

  const visiblePeople = showAll ? people : people.slice(0, initialVisibleCount);
  const hasMore = people.length > initialVisibleCount;

  const renderPersonItem = (person: ContactItem) => (
    <TouchableOpacity
      key={person.id}
      style={styles.personItem}
      onPress={() => router.push("/payment_chat")}
    >
      <View style={[styles.personAvatar, { backgroundColor: person.bgColor }]}>
        <Text style={styles.personAvatarText}>{person.initial}</Text>
      </View>
      <Text style={styles.personName}>{person.name.split(" ")[0]}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>{title}</Text>
      <View style={styles.peopleGrid}>
        {visiblePeople.map(renderPersonItem)}
        {hasMore && !showAll && (
          <TouchableOpacity
            style={styles.personItem}
            onPress={() => setShowAll(true)}
          >
            <View style={[styles.personAvatar, styles.moreButtonBackground]}>
              <MaterialCommunityIcons
                name="chevron-down"
                size={30}
                color="#000"
              />
            </View>
            <Text style={styles.personName}>More</Text>
          </TouchableOpacity>
        )}
        {hasMore && showAll && (
          <TouchableOpacity
            style={styles.personItem}
            onPress={() => setShowAll(false)}
          >
            <View style={[styles.personAvatar, styles.moreButtonBackground]}>
              <MaterialCommunityIcons
                name="chevron-up"
                size={30}
                color="#000"
              />
            </View>
            <Text style={styles.personName}>Less</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  peopleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  personItem: {
    width: "25%", // 4 items per row
    alignItems: "center",
    marginBottom: 15,
  },
  personAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  personAvatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  personName: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
  },
  moreButtonBackground: {
    backgroundColor: "#f0f0f0",
  },
});

export default ProfileIconSection;
