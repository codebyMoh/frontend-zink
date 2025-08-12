import TransactionHistory from "@/components/home/transactionHistory";
import HomeWallet from "@/components/home/wallet";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/context/auth";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
export default function HomeScreen() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log("user", user);
  }, [user])

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <View className="w-full flex h-full items-center">
      <View className="flex-1 w-full max-w-[393px] flex items-center gap-2">
        <HomeWallet />
        <TransactionHistory />
        {/* <ProfileCard /> */}
        {/* <ProtectedRequestCard /> */}
      </View>
    </View>
  );
}
