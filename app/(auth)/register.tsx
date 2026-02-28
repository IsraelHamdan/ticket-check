import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/components/AuthProvider";
import { FormInputRHF } from "@/components/FormInputRHF";
import {
  userBaseSchema,
  type CreateUserDTO,
} from "@/lib/validations/user.schema";

export default function RegisterScreen() {
  const { signUp, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    setError,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserDTO>({
    resolver: zodResolver(userBaseSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (values: CreateUserDTO) => {
    try {
      await signUp(values);
    } catch (submitError) {
      const fallbackError = "Falha ao criar conta.";
      setError("root", {
        message: submitError instanceof Error ? submitError.message : fallbackError,
      });
    }
  };

  const disabled = isSubmitting || isLoading;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      <FormInputRHF
        name="name"
        control={control}
        trigger={trigger}
        type="text"
        placeholder="Nome"
        inputProps={{
          style: styles.input,
          placeholderTextColor: "#94A3B8",
        }}
      />

      <FormInputRHF
        name="email"
        control={control}
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
        name="phone"
        control={control}
        trigger={trigger}
        type="phone"
        placeholder="Telefone ex: (11)91234-5678"
        inputProps={{
          style: styles.input,
          placeholderTextColor: "#94A3B8",
        }}
      />

      <FormInputRHF
        name="password"
        control={control}
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
          {isSubmitting ? "Criando..." : "Registrar"}
        </Text>
      </Pressable>

      <Link href="./login" style={styles.link}>
        Já tenho conta
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
    backgroundColor: "#0284C7",
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
