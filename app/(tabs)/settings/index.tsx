import { useAuth } from "@/components/AuthProvider";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { Alert, Text, TouchableOpacity, View } from "react-native";

const styles = {
  container: "flex-1 bg-slate-100 dark:bg-slate-900 px-6 pt-16",
  section: "mb-8",
  sectionTitle: "text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3",

  // User card
  card: "bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm",
  avatarWrapper: "w-14 h-14 rounded-full bg-indigo-500 items-center justify-center mb-4",
  avatarInitial: "text-white text-xl font-bold",
  userName: "text-lg font-bold text-slate-900 dark:text-white",
  userEmail: "text-sm text-slate-500 dark:text-slate-400 mt-1",

  // Theme row
  themeRow: "bg-white dark:bg-slate-800 rounded-2xl px-5 py-4 shadow-sm flex-row items-center justify-between",
  themeLabel: "text-base font-medium text-slate-800 dark:text-slate-200",

  // Logout button
  logoutButton: "bg-red-500 rounded-2xl py-4 items-center shadow-sm",
  logoutLabel: "text-white font-semibold text-base",
};

const LOGOUT_ALERT = {
  title: "Sair da conta",
  message: "Tem certeza que deseja sair?",
  cancelLabel: "Cancelar",
  confirmLabel: "Sair",
} as const;

export default function SettingsScreen() {
  const { user, signOut } = useAuth();

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  const handleLogoutPress = () => {
    Alert.alert(LOGOUT_ALERT.title, LOGOUT_ALERT.message, [
      {
        text: LOGOUT_ALERT.cancelLabel,
        style: "cancel",
      },
      {
        text: LOGOUT_ALERT.confirmLabel,
        style: "destructive",
        onPress: signOut,
      },
    ]);
  };

  return (
    <View className={styles.container}>

      {/* User info card */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>Perfil</Text>
        <View className={styles.card}>
          <View className={styles.avatarWrapper}>
            <Text className={styles.avatarInitial}>{initial}</Text>
          </View>
          <Text className={styles.userName}>{user?.name ?? "Usuário"}</Text>
          <Text className={styles.userEmail}>{user?.email ?? "—"}</Text>
        </View>
      </View>

      {/* Theme toggle */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>Aparência</Text>
        <View className={styles.themeRow}>
          <Text className={styles.themeLabel}>Alternar tema</Text>
          <ThemeToggleButton />
        </View>
      </View>

      {/* Logout */}
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>Conta</Text>
        <TouchableOpacity
          className={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogoutPress}
        >
          <Text className={styles.logoutLabel}>Sair da conta</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}