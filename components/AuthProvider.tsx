import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";

import {
  createUser,
  getUserById,
  loginUser,
  type UserEntity,
} from "@/lib/repositories/users.repository";
import {
  clearSession,
  getSessionUserId,
  setSessionUserId,
} from "@/lib/storage/auth-session";
import type { CreateUserDTO, LoginUserDTO } from "@/lib/validations/user.schema";

type AuthContextValue = {
  user: UserEntity | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (input: LoginUserDTO) => Promise<UserEntity>;
  signUp: (input: CreateUserDTO) => Promise<UserEntity>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();

  const [user, setUser] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const sessionUserId = await getSessionUserId();
        if (!sessionUserId) {
          return;
        }

        const sessionUser = await getUserById(sessionUserId);
        if (!sessionUser) {
          await clearSession();
          return;
        }

        if (isMounted) {
          setUser(sessionUser);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const isNavigationReady = Boolean(rootNavigationState?.key);
    if (!isNavigationReady || isLoading) {
      return;
    }

    const rootSegment = segments[0] as string | undefined;
    const inAuthGroup =
      rootSegment === "(auth)" ||
      rootSegment === "login" ||
      rootSegment === "register";

    if (!user && !inAuthGroup) {
      router.replace("/login" as never);
      return;
    }

    if (user && inAuthGroup) {
      router.replace("/" as never);
    }
  }, [isLoading, rootNavigationState?.key, router, segments, user]);

  const signIn = async (input: LoginUserDTO): Promise<UserEntity> => {
    const authenticatedUser = await loginUser(input);

    if (!authenticatedUser) {
      throw new Error("Email ou senha inválidos.");
    }

    await setSessionUserId(authenticatedUser.id);
    setUser(authenticatedUser);

    return authenticatedUser;
  };

  const signUp = async (input: CreateUserDTO): Promise<UserEntity> => {
    const createdUser = await createUser(input);
    await setSessionUserId(createdUser.id);
    setUser(createdUser);

    return createdUser;
  };

  const signOut = async (): Promise<void> => {
    await clearSession();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signIn,
      signUp,
      signOut,
    }),
    [isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
};
