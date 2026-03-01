import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/components/AuthProvider";
import { FormInputRHF } from "@/components/FormInputRHF";
import { formStyles } from "@/styles/formStyle";
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
  const submitButtonClassName = `${formStyles.button} ${disabled ? formStyles.buttonDisabled : ""}`.trim();

  return (
    <View className={formStyles.container}>
      <Text className={formStyles.title}>Criar conta</Text>

      <FormInputRHF
        name="name"
        control={control}
        trigger={trigger}
        type="text"
        placeholder="Nome"
      />

      <FormInputRHF
        name="email"
        control={control}
        trigger={trigger}
        type="email"
        placeholder="Email"
        inputProps={{
          autoCapitalize: "none",
        }}
      />

      <FormInputRHF
        name="phone"
        control={control}
        trigger={trigger}
        type="phone"
        placeholder="Telefone ex: (11)91234-5678"
      />

      <FormInputRHF
        name="password"
        control={control}
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
          {isSubmitting ? "Criando..." : "Registrar"}
        </Text>
      </Pressable>

      <Link href="./login" asChild>
        <Text className={formStyles.link}>Já tenho conta</Text>
      </Link>
    </View>
  );
}
