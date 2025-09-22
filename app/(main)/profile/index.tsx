import { TokenManager } from "@/services/tokenManager";
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
import { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import * as Clipboard from 'expo-clipboard';

interface ProfileOptionProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

const ProfileOption: React.FC<ProfileOptionProps> = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={0.7}>
    {icon}
    <View style={styles.optionTextContainer}>
      <Text style={styles.optionTitle}>{title}</Text>
      {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const user = useUser();
  const { logout } = useLogout();
  const [userName, setUserName] = useState("Jhone Doe");

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await TokenManager.getUserData();
      if (userData?.userName) {
        setUserName(userData.userName);
      }
    };
    loadUserData();
  }, []);

  async function logoutHandler() {
    await TokenManager.clearAll();
    await AsyncStorage.clear();
    await logout();
    router.dismissAll();
    router.replace("/sign-in");
  }

  const handleCopyUsername = async () => {
    try {
      await Clipboard.setStringAsync(userName);
      Toast.show({
        type: "success",
        text1: "Copied!",
        text2: "Username copied to clipboard",
      });
    } catch (error) {
      console.log("Error copying username:", error);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View>
          <ImageBackground
            source={require("../../../assets/images/profile/city-2.jpg")}
            style={styles.header}
            imageStyle={{
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            <View style={styles.overlay}>
              <View style={styles.headerContent}>
                <View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.name}>{userName}</Text>
                    <TouchableOpacity onPress={handleCopyUsername} style={styles.copyButton}>
                      <MaterialCommunityIcons name="content-copy" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.subText}>Email ID: {user?.email}</Text>
                </View>
                <TouchableOpacity
                  style={styles.avatarContainer}
                  activeOpacity={0.8}
                  onPress={() => router.push("/share_qr")}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {userName?.charAt(0)?.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.qrBadge}>
                    <AntDesign name="qrcode" size={20} color="#333" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.content}>
          <View style={styles.optionsGroup}>
            <ProfileOption
              icon={<Ionicons name="card" size={24} color="#1565C0" />}
              title="Pay with credit or debit cards"
              subtitle="Pay bills with your cards"
            />
            <ProfileOption
              icon={<AntDesign name="qrcode" size={24} color="#1565C0" />}
              title="Your QR code"
              subtitle="Use to receive money from ZINK"
              onPress={() => router.push("/share_qr")}
            />
            <ProfileOption
              icon={<MaterialCommunityIcons name="refresh-auto" size={24} color="#1565C0" />}
              title="Autopay"
              subtitle="No pending requests"
              onPress={() => router.push("/autopay")}
            />
            <ProfileOption
              icon={<Ionicons name="settings-outline" size={24} color="#1565C0" />}
              title="Settings"
              onPress={() => router.push("/settings")}
            />
            <ProfileOption
              icon={<FontAwesome6 name="user-circle" size={24} color="#1565C0" />}
              title="Manage Google account"
            />
            <ProfileOption
              icon={<Feather name="help-circle" size={24} color="#1565C0" />}
              title="Get help"
              onPress={() => router.push("/get_help")}
            />
            <ProfileOption
              icon={<Fontisto name="world-o" size={24} color="#1565C0" />}
              title="Language"
              onPress={() => router.push("/language")}
            />
          </View>

          <View style={styles.logoutGroup}>
            <TouchableOpacity style={styles.logoutOption} onPress={() => logoutHandler()}>
              <Ionicons name="log-out-outline" size={24} color="#E53935" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F7",
  },
  header: {
    width: "100%",
    height: 250,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "flex-end",
    padding: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subText: {
    fontSize: 16,
    color: "#ffffff",
    marginTop: 4,
    opacity: 0.8,
  },
  copyButton: {
    padding: 4,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#5d4038",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  qrBadge: {
    position: "absolute",
    bottom: 3,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  content: {
    padding: 20,
  },
  optionsGroup: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  optionTextContainer: {
    marginLeft: 15,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  optionSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  logoutGroup: {
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
  logoutOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  logoutText: {
    fontSize: 16,
    color: "#E53935",
    fontWeight: "600",
    marginLeft: 15,
  },
});
