import { Image, Pressable, Text, View } from "react-native";

export default function SignInWithGoogleButton({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View
        className="w-full h-[44] flex-row items-center justify-center rounded-[5px] bg-[#fff] border border-[#ccc]"
      >
        <Image
          source={require("../assets/images/google-icon.png")}
          style={{
            width: 18,
            height: 18,
            marginRight: 6,
          }}
        />
        <Text className="text-base font-semibold text-black">
          Continue with Google
        </Text>
      </View>
    </Pressable>
  );
}
