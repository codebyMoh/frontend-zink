import { useAuth } from "@/context/auth";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ProtectedRequestCard() {
  const { fetchWithAuth } = useAuth();
  const [data, setData] = useState<any>(null);

  async function fetchProtectedData() {
    const response = await fetchWithAuth(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/protected/data`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    setData(data);
  }

  return (
    <View
      className="border-[#808080] w-[90%] p-[10px] rounded-[10px]"
      style={{
        borderWidth: StyleSheet.hairlineWidth,
      }}
    >
      <Text className="text-base font-semibold">Protected Request</Text>
      <Text className="font-mono p-[10px] rounded-[5px] my-2.5 text-xs">
        {data ? JSON.stringify(data, null, 2) : "No data fetched yet"}
      </Text>
      <Button title="Fetch protected data" onPress={fetchProtectedData} />
    </View>
  );
}
