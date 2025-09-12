import { AntDesign } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { useAuthenticate, useLogout, useSignerStatus, useSmartAccountClient, useUser } from "@account-kit/react-native";
import { TokenManager } from "@/services/tokenManager";
import { registerUser } from "@/services/api/user";

export default function OTPScreen() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shouldRegister, setShouldRegister] = useState<boolean>(false);

  const { email } = useLocalSearchParams<{ email: string }>();
  const { authenticate, authenticateAsync } = useAuthenticate();
const { isConnected } = useSignerStatus();
  const userData = useUser();

  const { client } = useSmartAccountClient({
    type: "ModularAccountV2",
  });

  const { logout } = useLogout();

  const inputRefs = useRef<Array<TextInput | null>>([]);

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
  
  
useEffect(() => {
  const handleRegistration = async () => {
    if (!shouldRegister) return;

    if (!userData || !client?.account?.address) {
      return;
    }

    try {
      const smartWalletAddress = client.account.address;

      if (userData.email && userData.solanaAddress && smartWalletAddress) {
        const response = await registerUser({
          email: userData.email,
          addressEvm: userData.address,
          addressSolana: userData.solanaAddress,
          smartWalletAddress: smartWalletAddress,
          userId: userData.userId,
          orgId: userData.orgId,
        });

        await TokenManager.saveToken(response.data.token);
        await TokenManager.saveUserData(response.data.user);

        router.replace("/");
      } else {
        console.error("Missing required user data:", {
          email: userData?.email,
          solanaAddress: userData?.solanaAddress,
          smartWalletAddress,
        });
        setErrorMessage("Failed to get user information. Please try again.");
        // Logout from Account Kit when backend registration fails
        await logout();
        await TokenManager.clearAll();
      }
    } catch (registrationError) {
      console.error("Backend registration failed:", registrationError);
      setErrorMessage("Registration failed. Please try again.");
      // Logout from Account Kit when backend registration fails
      await logout();
      // Clear any stored tokens
      await TokenManager.clearAll();
    } finally {
      setIsLoading(false);
      setShouldRegister(false);
    }
  };

  handleRegistration();
}, [shouldRegister, client?.account?.address, userData, logout]);


  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (text && index === otp.length - 1) {
      Keyboard.dismiss();
    }
  };

  const handleBackspace = (index: number) => {
    const newOtp = [...otp];
    if (newOtp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    newOtp[index] = "";
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

   try {
    await authenticate({
      otpCode: fullOtp,
      type: "otp",
    });
    
    
    clearOtpInputs();
    setShouldRegister(true);
    
  } catch (error) {
    console.error("OTP verification failed:", error);
    setErrorMessage("Invalid OTP. Please try again.");
    setIsLoading(false);
    clearOtpInputs();
  }
};

  const handleResendOtp = async () => {
    if (!email) {
      setErrorMessage("Email not found. Please go back and try again.");
      return;
    }

    setErrorMessage("");
    setIsResending(true);
    setResendTimer(60);

    try {
      authenticateAsync({
        type: "email",
        email,
        emailMode: "otp",
      });

      // Alert.alert("Success", "OTP has been resent to your email address.");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      setErrorMessage("Failed to resend OTP. Please try again.");
      setIsResending(false);
      setResendTimer(0);
    }
  };

  const clearOtpInputs = () => {
  setOtp(["", "", "", "", "", ""]);
  inputRefs.current[0]?.focus();
};

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Verify your account</Text>
        <Text style={styles.subtitle}>
          We have sent a 6-digit OTP to {email ? `${email}` : 'your email address'}. 
          Please enter it below.
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
              autoFocus={index === 0}
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
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    width: "100%",
    alignItems: "flex-start",
    position: "absolute",
    top: 0,
    left: 0,
    paddingLeft: 20,
  },
  backButton: {
    padding: 5,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
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
    maxWidth: 300,
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
    backgroundColor: "#34C759",
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
    marginTop: "auto",
    alignItems: "center",
  },
  resendText: {
    color: "#555",
    fontSize: 14,
  },
  resendLink: {
    color: "#34C759",
    fontSize: 14,
    fontWeight: "bold",
  },
  resendLinkDisabled: {
    color: "#888",
  },
});