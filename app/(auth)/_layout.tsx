import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { formStyles } from "@/styles/formStyle";

export default function AuthLayout() {
  return (
    <SafeAreaView className={formStyles.layoutContainer}>
      <View className="absolute right-6 top-4 z-10">
        <ThemeToggleButton />
      </View>

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </SafeAreaView>
  );
}
