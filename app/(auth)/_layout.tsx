import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { Stack } from "expo-router";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >

        <View className="flex-1 px-6 justify-center">

          {/* Botão tema */}
          <View className="absolute right-0 top-0">
            <ThemeToggleButton />
          </View>

          {/* Título */}
          <View className="mb-10 items-center">
            <Text className="text-5xl font-extrabold tracking-tight">
              <Text className="text-slate-900 dark:text-white">
                Ticket{" "}
              </Text>
              <Text className="text-indigo-600 dark:text-indigo-400">
                Check
              </Text>
            </Text>
          </View>

          {/* Stack */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
          </Stack>

        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}