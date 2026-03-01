import { usePathname, useRouter } from "expo-router";
import { Form, House, Ticket } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TABS = [
  { href: "/dashboard", label: "Dashboard", Icon: Form },
  { href: "/newTicket", label: "Novo", Icon: Ticket },
  { href: "/tickets", label: "Home", Icon: House }
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {TABS.map(({ href, label, Icon }) => {
        // Verifica se esta tab está ativa comparando com a rota atual
        const isActive = pathname.startsWith(href);
        const color = isActive ? "#2563eb" : "#71717a";

        return (
          <TouchableOpacity
            key={href}
            style={styles.tab}
            onPress={() => router.push(href as any)}
          >
            <Icon size={22} color={color} />
            <Text style={[styles.label, { color }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "white", // ou use uma variável de tema
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingBottom: 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
});