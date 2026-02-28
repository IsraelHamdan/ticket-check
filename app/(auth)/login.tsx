import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useAuth } from "@/components/AuthProvider";
import type { LoginUserDTO } from "@/lib/validations/user.schema";

const initialState: LoginUserDTO = {
  email: "",
  password: "",
};

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();

  const [formData, setFormData] = useState<LoginUserDTO>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await signIn(formData);
    } catch (submitError) {
      const fallbackError = "Falha ao fazer login.";
      setError(submitError instanceof Error ? submitError.message : fallbackError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = isSubmitting || isLoading;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor="#94A3B8"
        style={styles.input}
        value={formData.email}
        onChangeText={(value) =>
          setFormData((current) => ({
            ...current,
            email: value,
          }))
        }
      />

      <TextInput
        secureTextEntry
        placeholder="Senha"
        placeholderTextColor="#94A3B8"
        style={styles.input}
        value={formData.password}
        onChangeText={(value) =>
          setFormData((current) => ({
            ...current,
            password: value,
          }))
        }
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        disabled={disabled}
        onPress={onSubmit}
        style={({ pressed }) => [
          styles.submitButton,
          (pressed || disabled) && styles.submitButtonDisabled,
        ]}
      >
        <Text style={styles.submitText}>
          {isSubmitting ? "Entrando..." : "Login"}
        </Text>
      </Pressable>

      <Link href="./register" style={styles.link}>
        Criar conta
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#0F172A",
  },
  title: {
    color: "#F8FAFC",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#1E293B",
    color: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  submitButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: "#16A34A",
  },
  submitButtonDisabled: {
    opacity: 0.75,
  },
  submitText: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
  },
  error: {
    color: "#FCA5A5",
    marginBottom: 10,
  },
  link: {
    color: "#93C5FD",
    marginTop: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});
