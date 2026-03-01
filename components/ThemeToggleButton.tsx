import { Moon, Sun } from "lucide-react-native";
import { Pressable, type PressableProps } from "react-native";

import { useTheme } from "@/context/ThemeContext";

const styles = {
  button: "p-2 rounded-full bg-slate-200 dark:bg-slate-700",
  icon: "text-slate-900 dark:text-white",
} as const;

const joinClasses = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

type ThemeToggleButtonProps = Omit<PressableProps, "onPress">;

export function ThemeToggleButton({ className, ...props }: ThemeToggleButtonProps) {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === "light" ? Moon : Sun;
  const buttonClassName = joinClasses(styles.button, className);

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel="Alternar tema"
      onPress={toggleTheme}
      className={buttonClassName}>
      <Icon size={18} className={styles.icon} />
    </Pressable>
  );
}
