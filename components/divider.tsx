import { useColorScheme, View } from "react-native";

export default function Divider() {
  const isDark = useColorScheme() === "dark";
  return <View className={isDark ? "h-px bg-slate-800" : "h-px bg-slate-200"} />;
}