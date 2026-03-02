import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/context/ThemeContext";
import { Text, TouchableOpacity } from "react-native";

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      activeOpacity={0.8}
      className={styles.logout}
    >
      <Text>Logout</Text>
    </TouchableOpacity>
  );
}

const styles = {
  logout: "bg:red-500"
};