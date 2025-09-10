import { useAuthenticate, useSignerStatus } from "@account-kit/react-native";
import { AntDesign } from "@expo/vector-icons";
import { Redirect, router, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // const router = useRouter();
    const { authenticateAsync } = useAuthenticate();
    const { isConnected } = useSignerStatus();

    const onSignIn = useCallback(async () => {
        setErrorMessage("");
        setIsLoading(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email address.");
            setIsLoading(false);
            return;
        }

        try {
           authenticateAsync({
                type: "email",
                email,
                emailMode: "otp",
            });

            
            router.navigate({
                pathname: "/otp-verification",
                params: { email }
            });
            
        } catch (e) {
            console.error(
                "Unable to send OTP to user. Ensure your credentials are properly set: ",
                e
            );
            setErrorMessage("Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [email, authenticateAsync, router]);

    if (isConnected) {
        return <Redirect href="/(main)" />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.welcomeText}>Welcome!</Text>
                <Text style={styles.subtitle}>Enter your email to sign in</Text>

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
                        placeholder="john@doe.com"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(val) => setEmail(val.toLowerCase())}
                        editable={!isLoading}
                    />
                </View>

                {/* Error Message Display */}
                {errorMessage ? (
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                ) : null}

                {/* Sign In Button */}
                <TouchableOpacity
                    style={[
                        styles.signInButton,
                        { opacity: isLoading || email.length < 1 ? 0.5 : 1 }
                    ]}
                    onPress={onSignIn}
                    disabled={isLoading || email.length < 1}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.signInButtonText}>Sign In</Text>
                    )}
                </TouchableOpacity>
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
    content: {
        width: "100%",
        maxWidth: 400,
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
        backgroundColor: "#f0f0f0",
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
    signInButton: {
        backgroundColor: "#34C759",
        borderRadius: 15,
        paddingVertical: 15,
        width: "100%",
        alignItems: "center",
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3,
    },
    signInButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});