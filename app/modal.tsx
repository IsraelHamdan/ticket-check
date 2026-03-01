import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-5 dark:bg-slate-900">
      <Text className="text-3xl font-bold text-slate-900 dark:text-white">
        This is a modal
      </Text>

      <Link
        href="/"
        dismissTo
        className="mt-4 py-4 text-base font-medium text-indigo-600 dark:text-indigo-400">
        Go to home screen
      </Link>
    </View>
  );
}
