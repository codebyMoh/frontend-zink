import { AntDesign } from "@expo/vector-icons"; // For icons
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router } from "expo-router"; // For navigation
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignUp = async () => {
    setErrorMessage("");
    setIsLoading(true);

    // Basic Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    // Basic Password Validation (e.g., minimum 8 characters, at least one uppercase, one lowercase, one number, one special character)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`-])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      setIsLoading(false);
      return;
    }

    // Password Confirmation Logic
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setIsLoading(false);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    await AsyncStorage.setItem("token", "token");
    router.replace("/");
  };

  const handleGoogleSignUp = () => {
    // Implement Google OAuth sign-up here
    console.log("Initiating Google Sign Up...");
    router.replace("/");
  };

  const handleAppleSignUp = () => {
    // Implement Apple OAuth sign-up here
    console.log("Initiating Apple Sign Up...");
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Hide the default Expo Router header for this screen */}
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Create Account</Text>
        <Text style={styles.subtitle}>
          Sign up to start your journey with us!
        </Text>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <AntDesign
            name="user"
            size={20}
            color="#888"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <AntDesign
            name="lock"
            size={20}
            color="#888"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputGroup}>
          <AntDesign
            name="lock"
            size={20}
            color="#888"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Error Message Display */}
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        {/* Sign Up Button */}
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Or Divider */}
        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        {/* Google Sign Up Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignUp}
          disabled={isLoading} // Disable button when loading
        >
          <Image
            source={require("../../../assets/images/login/google.png")}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Apple Sign Up Button */}
        <TouchableOpacity
          style={styles.appleButton}
          onPress={handleAppleSignUp}
        >
          <AntDesign
            name="apple1"
            size={24}
            color="#fff"
            style={styles.appleIcon}
          />
          <Text style={styles.appleButtonText}>Continue with Apple</Text>
        </TouchableOpacity>

        {/* Login Text */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={styles.loginLink}>Login</Text>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 400, // Limit width on larger screens
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
    textAlign: "center",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Light grey background for inputs
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#000",
    fontSize: 16,
  },
  errorMessage: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
    marginHorizontal: 20,
  },
  signUpButton: {
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
  signUpButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 20, // Adjusted margin for spacing
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0", // Light grey line
  },
  orText: {
    marginHorizontal: 10,
    color: "#888",
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingVertical: 15,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 3,
  },
  googleIcon: {
    width: 24, // Set the width for the image
    height: 24, // Set the height for the image
    marginRight: 10,
  },
  googleButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  appleButton: {
    backgroundColor: "#000", // Apple's brand black color
    borderRadius: 15,
    paddingVertical: 15,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30, // Space before login link
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  appleIcon: {
    marginRight: 10,
  },
  appleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: "auto", // Push to bottom
  },
  loginText: {
    color: "#555",
    fontSize: 14,
  },
  loginLink: {
    color: "#34C759", // Green, consistent with theme
    fontSize: 14,
    fontWeight: "bold",
  },
});
