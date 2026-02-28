import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/components/AuthProvider";
import { FormInputRHF } from "@/components/FormInputRHF";
import {
  loginUserSchema,
  type LoginUserDTO,
} from "@/lib/validations/user.schema";

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    setError,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<LoginUserDTO>({
    resolver: zodResolver(loginUserSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginUserDTO) => {
    try {
      await signIn(values);
    } catch (submitError) {
      const fallbackError = "Falha ao fazer login.";
      setError("root", {
        message: submitError instanceof Error ? submitError.message : fallbackError,
      });
    }
  };

  const disabled = isSubmitting || isLoading;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      <FormInputRHF
        control={control}
        name="email"
        trigger={trigger}
        type="email"
        placeholder="Email"
        inputProps={{
          style: styles.input,
          placeholderTextColor: "#94A3B8",
          autoCapitalize: "none",
        }}
      />

      <FormInputRHF
        control={control}
        name="password"
        trigger={trigger}
        type="password"
        placeholder="Senha"
        inputProps={{
          style: styles.input,
          placeholderTextColor: "#94A3B8",
        }}
      />

      {errors.root?.message ? <Text style={styles.error}>{errors.root.message}</Text> : null}

      <Pressable
        disabled={disabled}
        onPress={handleSubmit(onSubmit)}
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
