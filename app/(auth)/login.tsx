import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/components/AuthProvider";
import { FormInputRHF } from "@/components/FormInputRHF";
import { formStyles } from "@/styles/formStyle";
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
  const submitButtonClassName = `${formStyles.button} ${disabled ? formStyles.buttonDisabled : ""}`.trim();

  return (
    <View className={formStyles.container}>
      <Text className={formStyles.title}>Entrar</Text>

      <FormInputRHF
        control={control}
        name="email"
        trigger={trigger}
        type="email"
        placeholder="Email"
        inputProps={{
          autoCapitalize: "none",
        }}
      />

      <FormInputRHF
        control={control}
        name="password"
        trigger={trigger}
        type="password"
        placeholder="Senha"
      />

      {errors.root?.message ? (
        <Text className={formStyles.rootError}>{errors.root.message}</Text>
      ) : null}

      <Pressable
        disabled={disabled}
        onPress={handleSubmit(onSubmit)}
        className={submitButtonClassName}
      >
        <Text className={formStyles.buttonText}>
          {isSubmitting ? "Entrando..." : "Login"}
        </Text>
      </Pressable>

      <Link href="./register" asChild>
        <Text className={formStyles.link}>Criar conta</Text>
      </Link>
    </View>
  );
}
