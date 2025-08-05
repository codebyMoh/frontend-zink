import { useAuth } from "@/context/auth";
import { Image, Pressable, Text, View } from "react-native";

export function SignInWithAppleButton() {
  const { signInWithAppleWebBrowser } = useAuth();

  return (
    <Pressable onPress={signInWithAppleWebBrowser}>
      <View className="w-full h-[44px] flex-row items-center justify-center rounded-[5px] border bg-[#000]">
        <Image
          source={require("../assets/images/apple-icon.png")}
          style= {{
            width: 24,
            height: 24,
            marginRight: 6
          }}
        />
        <Text className="text-base font-semibold text-white">
          Continue with Apple
        </Text>
      </View>
    </Pressable>
  );
}