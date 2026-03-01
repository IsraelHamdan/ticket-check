import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "nativewind";

export type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  isThemeLoaded: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const STORAGE_THEME_KEY = "@ticket-check/theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

const normalizeTheme = (value: string | null | undefined): ThemeMode =>
  value === "dark" ? "dark" : "light";

const parseStoredTheme = (value: string | null): ThemeMode | null => {
  if (value === "light" || value === "dark") {
    return value;
  }

  return null;
};

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const initialThemeRef = useRef<ThemeMode>(normalizeTheme(colorScheme));

  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const restoreTheme = async () => {
      try {
        const storedTheme = parseStoredTheme(
          await AsyncStorage.getItem(STORAGE_THEME_KEY)
        );

        const resolvedTheme = storedTheme ?? initialThemeRef.current;

        if (!isMounted) {
          return;
        }

        setThemeState(resolvedTheme);
        setColorScheme(resolvedTheme);
      } finally {
        if (isMounted) {
          setIsThemeLoaded(true);
        }
      }
    };

    void restoreTheme();

    return () => {
      isMounted = false;
    };
  }, [setColorScheme]);

  useEffect(() => {
    if (!isThemeLoaded) {
      return;
    }

    setColorScheme(theme);
    void AsyncStorage.setItem(STORAGE_THEME_KEY, theme);
  }, [isThemeLoaded, setColorScheme, theme]);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isThemeLoaded,
      setTheme,
      toggleTheme,
    }),
    [isThemeLoaded, setTheme, theme, toggleTheme]
  );

  if (!isThemeLoaded) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return context;
}
