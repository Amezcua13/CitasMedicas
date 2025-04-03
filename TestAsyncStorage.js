import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { View, Text } from "react-native";

export default function TestAsyncStorage() {
  useEffect(() => {
    const testStorage = async () => {
      try {
        await AsyncStorage.setItem("test", "working");
        const value = await AsyncStorage.getItem("test");
        console.log("✅ AsyncStorage está funcionando:", value);
      } catch (error) {
        console.error("❌ Error con AsyncStorage:", error);
      }
    };

    testStorage();
  }, []);

  return (
    <View>
      <Text>Probando AsyncStorage...</Text>
    </View>
  );
}
