import { useAuth } from "@/context/auth";
import { tokenCache } from "@/utils/cache";
import * as jose from "jose";
import { useEffect, useRef, useState } from "react";
import { Button, Image, Platform, StyleSheet, Text, View } from "react-native";

export default function ProfileCard() {
  const { signOut, user } = useAuth();
  useEffect(() => {
    console.log("user", user)
  }, [user])
  const [accessTokenExpiration, setAccessTokenExpiration] = useState<
    string | null
  >(null);
  const [refreshTokenExpiration, setRefreshTokenExpiration] = useState<
    string | null
  >(null);
  const isWeb = Platform.OS === "web";
  const accessTokenExpiryRef = useRef<number | null>(null);
  const refreshTokenExpiryRef = useRef<number | null>(null);

  // Helper function to format expiration time as relative time
  const formatExpirationTime = (timestamp: number) => {
    if (!timestamp) return null;

    const now = Math.floor(Date.now() / 1000);
    const secondsRemaining = timestamp - now;

    if (secondsRemaining <= 0) {
      return "expired";
    }

    // Convert to appropriate units
    if (secondsRemaining < 60) {
      return `expires in ${secondsRemaining}s`;
    } else if (secondsRemaining < 3600) {
      const minutes = Math.floor(secondsRemaining / 60);
      return `expires in ${minutes}min`;
    } else if (secondsRemaining < 86400) {
      const hours = Math.floor(secondsRemaining / 3600);
      return `expires in ${hours}h`;
    } else {
      const days = Math.floor(secondsRemaining / 86400);
      return `expires in ${days} day${days > 1 ? "s" : ""}`;
    }
  };

  // Update expiration display every second
  useEffect(() => {
    const updateExpirationDisplay = () => {
      if (accessTokenExpiryRef.current) {
        setAccessTokenExpiration(
          formatExpirationTime(accessTokenExpiryRef.current)
        );
      }

      if (refreshTokenExpiryRef.current) {
        setRefreshTokenExpiration(
          formatExpirationTime(refreshTokenExpiryRef.current)
        );
      }
    };

    // Set up interval to update the display every second
    const intervalId = setInterval(updateExpirationDisplay, 1000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchTokenExpirations = async () => {
      // For web, we use the user object which contains cookie expiration
      if (isWeb && user) {
        const expTime = (user as any).cookieExpiration || user.exp || 0;
        accessTokenExpiryRef.current = expTime;
        setAccessTokenExpiration(formatExpirationTime(expTime));
      }
      // For native, we get the tokens from cache and decode them
      else if (!isWeb) {
        // Get access token expiration
        const storedAccessToken = await tokenCache?.getToken("accessToken");
        if (storedAccessToken) {
          try {
            const decoded = jose.decodeJwt(storedAccessToken);
            const expTime = (decoded as any).exp || 0;
            accessTokenExpiryRef.current = expTime;
            setAccessTokenExpiration(formatExpirationTime(expTime));
          } catch (e) {
            console.error("Error decoding access token:", e);
          }
        }

        // Get refresh token expiration
        const storedRefreshToken = await tokenCache?.getToken("refreshToken");
        if (storedRefreshToken) {
          try {
            const decoded = jose.decodeJwt(storedRefreshToken);
            const expTime = (decoded as any).exp || 0;
            refreshTokenExpiryRef.current = expTime;
            setRefreshTokenExpiration(formatExpirationTime(expTime));
          } catch (e) {
            console.error("Error decoding refresh token:", e);
          }
        }
      }
    };

    // Fetch token expirations once when component mounts
    fetchTokenExpirations();
  }, [user, isWeb]);

  return (
    <View
      style={{
        width: "90%",
        gap: 20,
        padding: 20,
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "gray",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Image
          source={{ uri: user?.picture }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
          }}
        />

        <View>
          <Text className="text-base font-semibold text-start">
            {`Hi, ${user?.name}`}
          </Text>
          <Text className="text-[14px] color-gray-500">
            {user?.email}
          </Text>
        </View>
      </View>

      <View>
        <Text className="text-base font-semibold text-center">
          {isWeb ? "Session" : "Access Token"}:
        </Text>
        <Text className="text-base font-semibold text-center">
          {accessTokenExpiration !== null ? accessTokenExpiration : "..."}
        </Text>
      </View>

      {!isWeb && (
        <View>
          <Text className="text-base font-semibold text-center">
            Refresh Token:
          </Text>
          <Text className="text-base font-semibold text-center">
            {refreshTokenExpiration !== null ? refreshTokenExpiration : "..."}
          </Text>
        </View>
      )}

      <Button title="Sign Out" onPress={signOut} color={"red"} />
    </View>
  );
}
