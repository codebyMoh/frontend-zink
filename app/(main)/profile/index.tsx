import { useLogout, useUser } from "@account-kit/react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const userName = "Jhone Doe";
  const user = useUser()
// console.log("User data:", user);
  const { logout } = useLogout();

  async function logoutHandler() {
    await AsyncStorage.clear();
    await logout();
    router.dismissAll();
    router.replace("/sign-in");
  }
  return (
    <ScrollView style={styles.container}>
      <View>
        <ImageBackground
          source={require("../../../assets/images/profile/profile-banner.png")}
          style={styles.header}
          imageStyle={{
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.name}>{userName}</Text>
              <Text style={styles.subText}>Email ID: {user?.email}</Text>
            </View>
            <TouchableOpacity
              style={styles.avatarContainer}
              activeOpacity={0.8}
              onPress={() => router.push("/")} // testing
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userName?.charAt(0)?.toUpperCase()}
                </Text>
              </View>

              {/* QR Code Icon */}
              <View style={styles.qrBadge}>
                <AntDesign name="qrcode" size={20} color="#333" />
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Pay with card */}
        <TouchableOpacity style={styles.option}>
          <Ionicons name="card" size={24} color="#4CAF50" />
          <View>
            <Text style={styles.optionText}>
              Pay with credit or debit cards
            </Text>
            <Text style={styles.smallText}>Pay bills with your cards</Text>
          </View>
        </TouchableOpacity>

        {/* QR Code */}
        <TouchableOpacity style={styles.option}>
          <AntDesign name="qrcode" size={24} color="#4CAF50" />
          <View>
            <Text style={styles.optionText}>Your QR code</Text>
            <Text style={styles.smallText}>
              Use to receive money from any UPI app
            </Text>
          </View>
        </TouchableOpacity>

        {/* Autopay */}
        <TouchableOpacity style={styles.option}>
          <MaterialCommunityIcons
            name="refresh-auto"
            size={24}
            color="#4CAF50"
          />
          <View>
            <Text style={styles.optionText}>Autopay</Text>
            <Text style={styles.smallText}>No pending requests</Text>
          </View>
        </TouchableOpacity>

        {/* UPI Circle */}
        <TouchableOpacity style={styles.option}>
          <MaterialIcons name="wifi-tethering" size={24} color="#4CAF50" />
          <View>
            <Text style={styles.optionText}>UPI Circle</Text>
            <Text style={styles.smallText}>
              Help people you trust make UPI payments
            </Text>
          </View>
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity style={styles.option}>
          <Ionicons name="settings-outline" size={24} color="#4CAF50" />
          <Text style={styles.optionText}>Settings</Text>
        </TouchableOpacity>

        {/* Manage Google Account */}
        <TouchableOpacity style={styles.option}>
          <FontAwesome6 name="user-circle" size={24} color="#4CAF50" />
          <Text style={styles.optionText}>Manage Google account</Text>
        </TouchableOpacity>

        {/* Get help */}
        <TouchableOpacity style={styles.option}>
          <Feather name="help-circle" size={24} color="#4CAF50" />
          <Text style={styles.optionText}>Get help</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Fontisto name="world-o" size={24} color="#4CAF50" />
          <Text style={styles.optionText}>Language</Text>
        </TouchableOpacity>
        {/* Divider */}
        <View style={styles.divider} />

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutOption}
          onPress={() => logoutHandler()}
        >
          <Ionicons name="log-out-outline" size={24} color="#E53935" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
    width: "auto",
    height: 250,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    height: 250,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: "100%",
    backgroundColor: "#5d4038",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  qrBadge: {
    position: "absolute",
    bottom: 3,
    right: 16,
    boxShadow: "#000",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  subText: {
    fontSize: 14,
    color: "#000000",
    marginTop: 2,
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  option: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  smallText: {
    fontSize: 12,
    color: "#666",
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  logoutOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 40,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 16,
    color: "#E53935",
    fontWeight: "600",
    marginLeft: 10,
  },
  avatarContainer: {
    position: "relative",
  },
});
