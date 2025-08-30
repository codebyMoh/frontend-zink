import { AntDesign } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    NativeSyntheticEvent,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    TouchableOpacity,
    View,
} from "react-native";

export default function OTPScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Refs for focusing individual OTP input fields
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Timer logic for resend OTP
  useEffect(() => {
    let timer: number | undefined;
    if (isResending && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000) as unknown as number;
    } else if (resendTimer === 0) {
      setIsResending(false);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isResending, resendTimer]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    // If last digit and text is entered, dismiss keyboard
    if (text && index === otp.length - 1) {
      Keyboard.dismiss();
    }
  };

  const handleBackspace = (index: number) => {
    const newOtp = [...otp];
    // Check if the current input is empty before moving to the previous one
    if (newOtp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    newOtp[index] = ""; // Clear current input
    setOtp(newOtp);
  };

  const handleVerifyOtp = async () => {
    setErrorMessage("");
    setIsLoading(true);
    const fullOtp = otp.join("");

    if (fullOtp.length !== 6 || !/^\d+$/.test(fullOtp)) {
      setErrorMessage("Please enter a valid 6-digit OTP.");
      setIsLoading(false);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    router.replace("/login");
  };

  const handleResendOtp = () => {
    setErrorMessage("");
    setIsResending(true);
    setResendTimer(60); // Reset timer
    // In a real app, trigger backend call to resend OTP
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()} // Go back to the previous screen (e.g., Forgot Password or Sign Up)
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Verify your account</Text>
        <Text style={styles.subtitle}>
          We have sent a 6-digit OTP to your email address. Please enter it
          below.
        </Text>

        {/* OTP Input Fields */}
        <View style={styles.otpInputContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={({
                nativeEvent,
              }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
                if (nativeEvent.key === "Backspace") {
                  handleBackspace(index);
                }
              }}
              value={digit}
              ref={(ref: TextInput | null) => {
                inputRefs.current[index] = ref;
              }}
              autoFocus={index === 0} // Auto-focus the first input
            />
          ))}
        </View>

        {/* Error Message Display */}
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        {/* Verify Button */}
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerifyOtp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify</Text>
          )}
        </TouchableOpacity>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the OTP? </Text>
          <TouchableOpacity onPress={handleResendOtp} disabled={isResending}>
            <Text
              style={[
                styles.resendLink,
                isResending && styles.resendLinkDisabled,
              ]}
            >
              Resend OTP {isResending ? `(${resendTimer}s)` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Light theme background
    justifyContent: "center", // Centers content block vertically
    alignItems: "center", // Centers content block horizontally
    padding: 20,
  },
  header: {
    width: "100%",
    alignItems: "flex-start",
    position: "absolute", // Position absolutely to allow content to center freely
    top: 0, // Position at the very top of the safe area
    left: 0, // Position at the very left
    paddingTop: 50, // Added padding to push the button down from the actual screen top
    paddingLeft: 20, // Added padding to push the button right from the edge
  },
  backButton: {
    padding: 5,
  },
  content: {
    width: "100%",
    maxWidth: 400, // Limit width on larger screens
    alignItems: "center",
    // Removed flex: 1 and justifyContent: 'center' from here
    // The container's justifyContent and alignItems will now center this whole block
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
    textAlign: "center",
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 300, // Max width for OTP inputs
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  errorMessage: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
    marginHorizontal: 20,
  },
  verifyButton: {
    backgroundColor: "#34C759", // Green, consistent with your theme
    borderRadius: 15,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resendContainer: {
    flexDirection: "row",
    marginTop: "auto", // Push to bottom
    alignItems: "center",
  },
  resendText: {
    color: "#555",
    fontSize: 14,
  },
  resendLink: {
    color: "#34C759", // Green, consistent with theme
    fontSize: 14,
    fontWeight: "bold",
  },
  resendLinkDisabled: {
    color: "#888", // Grey out when disabled
  },
});
