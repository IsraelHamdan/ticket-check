import { AuthProvider } from "@/components/AuthProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { Navbar } from "@/components/navbar";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

function AppRoot() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const showNavbar = ["/dashboard", "/newTicket", "/settings", "/tickets"].includes(pathname);


  return (
    <NavigationThemeProvider
      value={theme === "light" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <SafeAreaView className={styles.safeArea(theme)} edges={["top", "bottom"]}>
          <View className={styles.root}>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            </Stack>
            {showNavbar && <Navbar />}
          </View>

        </SafeAreaView>
      </AuthProvider>
      <StatusBar translucent style={theme === "dark" ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {

  return (
    <ThemeProvider>
      <AppRoot />
    </ThemeProvider>
  );
}

const styles = {
  root: "flex-1",
  safeArea: (theme: string) =>
    `flex-1 ${theme === "dark" ? "bg-zinc-900" : "bg-white"}`,
};