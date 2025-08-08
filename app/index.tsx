import LoginForm from "@/components/LoginForm";
import ProfileCard from "@/components/ProfileCard";
import ProtectedRequestCard from "@/components/ProtectedRequestCard";
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
    <View className="flex-1 w-full items-center gap-2 bg-[#F8FFF7]">
      <ProfileCard />
      <ProtectedRequestCard />
    </View>
  );
}
