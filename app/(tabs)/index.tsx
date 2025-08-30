import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MoreOptions from "../components/home/Bottom";
import OffersAndRewards from "../components/home/OffersAndRewards";
import ProfileIconSection from "../components/home/ProfileIconSection";

const dummyPeople = [
  {
    id: "1",
    name: "Alice",
    number: "+1234567890",
    initial: "A",
    bgColor: "#da7b66ff",
  },
  {
    id: "2",
    name: "Bob",
    number: "+1987654321",
    initial: "B",
    bgColor: "#a963e6ff",
  },
  {
    id: "3",
    name: "Charlie",
    number: "+1122334455",
    initial: "C",
    bgColor: "#6a82eeff",
  },
  {
    id: "4",
    name: "David",
    number: "+1554433221",
    initial: "D",
    bgColor: "#e672b0ff",
  },
  {
    id: "5",
    name: "Eve",
    number: "+1667788990",
    initial: "E",
    bgColor: "#b571f1ff",
  },
  {
    id: "6",
    name: "Frank",
    number: "+1098765432",
    initial: "F",
    bgColor: "#647ff7ff",
  },
  {
    id: "7",
    name: "Grace",
    number: "+1231231230",
    initial: "G",
    bgColor: "#56a5ebff",
  },
  {
    id: "8",
    name: "Heidi",
    number: "+1456456456",
    initial: "H",
    bgColor: "#f79951ff",
  },
  {
    id: "9",
    name: "Ivan",
    number: "+1789789789",
    initial: "I",
    bgColor: "#a164f1ff",
  },
  {
    id: "10",
    name: "Judy",
    number: "+1010101010",
    initial: "J",
    bgColor: "#57a2e4ff",
  },
  {
    id: "11",
    name: "Kevin",
    number: "+1212121212",
    initial: "K",
    bgColor: "#a7e75eff",
  },
  {
    id: "12",
    name: "Liam",
    number: "+1343434343",
    initial: "L",
    bgColor: "#e66e84ff",
  },
  {
    id: "13",
    name: "Liam",
    number: "+1343434343",
    initial: "L",
    bgColor: "#56a5ebff",
  },
  {
    id: "14",
    name: "Liam",
    number: "+1343434343",
    initial: "L",
    bgColor: "#da7b66ff",
  },
];
function WalletHomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push("/search_people")}
        >
          <MaterialCommunityIcons name="magnify" size={24} color="#999" />
          <Text style={styles.searchPlaceholder}>
            Pay friends and merchants
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileIcon}>
          <Text style={styles.profileText}>M</Text>
        </TouchableOpacity>
      </View>
      <ImageBackground
        source={require("../../assets/images/home/homeBg.webp")}
        style={styles.card}
        imageStyle={styles.cardImageBackground}
      >
        <View style={styles.cardContentAbsolute}>
          <Text style={styles.balanceCurrency}>$</Text>
          <Text style={styles.balanceAmount}>
            3,753<Text style={styles.balanceDecimal}>.35</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={styles.cardMenuAbsolute}
          onPress={() => router.push("/share_qr")}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
        </TouchableOpacity>
      </ImageBackground>
      {/* Updated action grid layout */}
      <View style={styles.actionGrid}>
        <View style={styles.actionItemContainer}>
          <TouchableOpacity
            style={styles.actionIconButton}
            onPress={() => router.push("/scan_qr")}
          >
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={32}
              color="white"
            />
          </TouchableOpacity>
          <Text style={styles.actionText}>Scan any{"\n"}QR code</Text>
        </View>

        <View style={styles.actionItemContainer}>
          <TouchableOpacity
            style={styles.actionIconButton}
            onPress={() => router.push("/search_people")}
          >
            <MaterialCommunityIcons
              name="currency-usd"
              size={32}
              color="white"
            />
          </TouchableOpacity>
          <Text style={styles.actionText}>Pay{"\n"}anyone</Text>
        </View>

        <View style={styles.actionItemContainer}>
          <TouchableOpacity style={styles.actionIconButton}>
            <MaterialCommunityIcons name="bank" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.actionText}>Bank{"\n"}withdraw</Text>
        </View>

        <View style={styles.actionItemContainer}>
          <TouchableOpacity style={styles.actionIconButton}>
            <MaterialCommunityIcons
              name="gift-outline"
              size={32}
              color="white"
            />
          </TouchableOpacity>
          <Text style={styles.actionText}>Earn{"\n"}rewards</Text>
        </View>
      </View>
      {/* people */}
      <ProfileIconSection
        title="People"
        people={dummyPeople}
        initialVisibleCount={7} // Show only 4 initially
      />
      {/* buisness and merchent */}
      <ProfileIconSection
        title="Buisness"
        people={dummyPeople}
        initialVisibleCount={7} // Show only 4 initially
      />
      {/* offers and rewards section */}
      <OffersAndRewards />
      {/* bottom  */}
      <MoreOptions />
    </View>
  );
}

// The main App component that renders your home page
export default function App() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  async function checkIsLogin() {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setLoading(false);
  }
  useEffect(() => {
    checkIsLogin();
  }, []);
  //  loader while checking a validation
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <ScrollView>
      <WalletHomePage />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    marginHorizontal: 20,
    borderRadius: 16,
    height: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    overflow: "hidden",
    position: "relative",
  },
  cardImageBackground: {
    resizeMode: "cover",
    borderRadius: 16,
  },
  cardContentAbsolute: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceCurrency: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginRight: 5,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },
  balanceDecimal: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  cardMenuAbsolute: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    padding: 8,
    position: "absolute",
    top: 15,
    right: 15,
  },
  // Updated Styles
  actionGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
  },
  actionItemContainer: {
    alignItems: "center",
    width: "23%",
  },
  actionIconButton: {
    backgroundColor: "#5abb5eff", // A darker green for the icons
    borderRadius: 15, // Make it more of a rounded square
    padding: 12,
    marginBottom: 8, // Space between icon and text
  },
  actionText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f0f0f0", // Light gray background
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
  },
  searchPlaceholder: {
    color: "#555", // Dark gray text for visibility
    marginLeft: 10,
    fontSize: 16,
  },
  profileIcon: {
    backgroundColor: "#444", // A dark, neutral color
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    color: "#fff", // White text for contrast
    fontSize: 20,
    fontWeight: "bold",
  },
});
