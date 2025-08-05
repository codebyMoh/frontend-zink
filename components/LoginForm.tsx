import { useAuth } from "@/context/auth";
import { Image, Text, useColorScheme, View } from "react-native";
import { SignInWithAppleButton } from "./SignInWithAppleButton";
import SignInWithGoogleButton from "./SignInWithGoogleButton";

export default function LoginForm() {
  const { signIn, isLoading } = useAuth();
  const theme = useColorScheme();

  return (
    <View className="flex-1 justify-center items-center p-4 bg-[#F8FFF7]">
      <View className="w-full max-w-[360px] items-center">
        <View className="w-full gap-8">
          <View className="items-center gap-3">
            <Image source={require("../assets/images/zink-logo.png")} style={{
              width: 128,
              height: 128
            }}/>
            <Text className="text-[30px] font-bold text-center">
              Welcome to Zink
            </Text>
          </View>

          <View className="w-full gap-3">
            <SignInWithGoogleButton onPress={signIn} disabled={isLoading} />
            <SignInWithAppleButton />
          </View>
        </View>
      </View>
    </View>
  );
}