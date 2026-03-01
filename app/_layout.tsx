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
import "../global.css";

function AppRoot() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const showNavbar = ["/dashboard", "/newTicket", "/settings"].includes(pathname);


  return (
    <NavigationThemeProvider
      value={theme === "light" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        {showNavbar && <Navbar />}
      </AuthProvider>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
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
