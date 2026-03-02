import { FeatherName } from "@/lib/types/fatherName";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function InfoRow({
  icon,
  label,
  children,
}: {
  icon: FeatherName;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-1">
      <View className="flex-row items-center gap-2 mb-1">
        <Feather name={icon} size={14} color="#64748b" />
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
          {label}
        </Text>
      </View>
      {children}
    </View>
  );
}