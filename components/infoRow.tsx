import { FeatherName } from "@/lib/types/fatherName";
import { Feather } from "@expo/vector-icons";
import { Text, useColorScheme, View } from "react-native";

const styles = {
  dark: {
    labelText: "text-slate-400 text-xs font-semibold uppercase tracking-widest",
  },
  light: {
    labelText: "text-slate-500 text-xs font-semibold uppercase tracking-widest",
  },
} as const;

export default function InfoRow({
  icon,
  label,
  children,
}: {
  icon: FeatherName;
  label: string;
  children: React.ReactNode;
}) {
  const isDark = useColorScheme() === "dark";
  const iconColor = isDark ? "#64748b" : "#94a3b8";
  const { labelText } = isDark ? styles.dark : styles.light;

  return (
    <View className="gap-1">
      <View className="flex-row items-center gap-2 mb-1">
        <Feather name={icon} size={14} color={iconColor} />
        <Text className={labelText}>{label}</Text>
      </View>
      {children}
    </View>
  );
}