import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import WalletHomePage from "../components/home/HomePage";

// The main App component that renders your home page
export default function App() {
  const [loading, setLoading] = useState(true);
  async function checkIsLogin() {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setLoading(false);
    }
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
