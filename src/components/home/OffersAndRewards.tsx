import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RewardItem {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  bgColor: string;
  onPress?: () => void;
}

const OffersAndRewards: React.FC = () => {
  const rewardOptions: RewardItem[] = [
    {
      id: "1",
      name: "Rewards",
      icon: "trophy",
      bgColor: "#f7cf47",
      onPress: () => console.log("Navigating to Rewards"),
    },
    {
      id: "2",
      name: "Offers",
      icon: "tag",
      bgColor: "#ec6382",
      onPress: () => console.log("Navigating to Offers"),
    },
    {
      id: "3",
      name: "Referrals",
      icon: "account-group",
      bgColor: "#4793f7",
      onPress: () => console.log("Navigating to Referrals"),
    },
    {
      id: "4",
      name: "E-commerce",
      icon: "shopping",
      bgColor: "#60bb54",
      onPress: () => console.log("Navigating to RuPay Shop"),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Offers & rewards</Text>
      <View style={styles.rewardsGrid}>
        {rewardOptions.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.rewardItem}
            onPress={item.onPress}
          >
            <View
              style={[styles.iconCircle, { backgroundColor: item.bgColor }]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={28}
                color="white"
              />
            </View>
            <Text style={styles.itemName}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  rewardsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 10,
  },
  rewardItem: {
    alignItems: "center",
    width: 80,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  itemName: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    fontWeight: "500",
  },
});

export default OffersAndRewards;
