import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";

import { parseWithZod } from "./safe-parse";

const AUTH_SESSION_KEY = "@ticket-check/auth-session";

const authSessionSchema = z
  .object({
    userId: z.string().trim().min(1),
  })
  .strict();

export const getSessionUserId = async (): Promise<string | null> => {
  const rawValue = await AsyncStorage.getItem(AUTH_SESSION_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedJson = JSON.parse(rawValue);
    const session = parseWithZod(
      authSessionSchema,
      parsedJson,
      "auth session data"
    );

    return session.userId;
  } catch {
    await AsyncStorage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
};

export const setSessionUserId = async (userId: string): Promise<void> => {
  const session = parseWithZod(
    authSessionSchema,
    { userId },
    "setSessionUserId input"
  );

  await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
};

export const clearSession = async (): Promise<void> => {
  await AsyncStorage.removeItem(AUTH_SESSION_KEY);
};
