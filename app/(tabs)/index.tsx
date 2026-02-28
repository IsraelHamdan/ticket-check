import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAuth } from "@/components/AuthProvider";

export default function HomeScreen() {
  const { user, signOut, isLoading } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sessão autenticada</Text>
      <Text style={styles.subtitle}>Olá, {user?.name ?? "Usuário"}.</Text>
      <Text style={styles.subtitle}>Email: {user?.email ?? "-"}</Text>

      <Pressable
        disabled={isLoading}
        onPress={signOut}
        style={({ pressed }) => [
          styles.logoutButton,
          (pressed || isLoading) && styles.logoutButtonDisabled,
        ]}
      >
        <Text style={styles.logoutText}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#020617",
  },
  title: {
    color: "#F8FAFC",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    color: "#CBD5E1",
    fontSize: 16,
    marginBottom: 4,
  },
  logoutButton: {
    marginTop: 24,
    borderRadius: 10,
    backgroundColor: "#DC2626",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoutButtonDisabled: {
    opacity: 0.8,
  },
  logoutText: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
  },
});
