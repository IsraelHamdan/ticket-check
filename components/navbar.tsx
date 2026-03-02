import { usePathname, useRouter } from "expo-router";
import { Form, House, Settings, Ticket } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

const TABS = [
  { href: "/tickets", label: "Home", Icon: House },
  { href: "/newTicket", label: "Novo", Icon: Ticket },
  { href: "/dashboard", label: "Dashboard", Icon: Form },
  { href: "/settings", label: "Config", Icon: Settings },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isDark = useColorScheme() === "dark";

  return (
    <View style={[navStyles.container, isDark ? navStyles.dark : navStyles.light]}>
      {TABS.map(({ href, label, Icon }) => {
        const isActive = pathname.startsWith(href);
        const color = isActive ? "#2563eb" : isDark ? "#71717a" : "#52525b";

        return (
          <TouchableOpacity
            key={href}
            style={navStyles.tab}
            onPress={() => router.push(href as any)}
          >
            <Icon size={22} color={color} />
            <Text style={[navStyles.label, { color }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const navStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 70,
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
  },
  light: { backgroundColor: "#ffffff", borderTopColor: "#e4e4e7" },
  dark: { backgroundColor: "#0f172a", borderTopColor: "#1e293b" },
  tab: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 },
  label: { fontSize: 12, fontWeight: "500" },
});