import { useAuth } from "@/components/AuthProvider";
import { FormInputRHF } from "@/components/FormInputRHF";
import { createTicket } from "@/lib/repositories";
import { NewTicketFormOutput, newTicketFormSchema, NewTicketFormValues } from "@/lib/validations/ticket.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, useColorScheme, View } from "react-native";

const styles = {
  dark: {
    scroll: "flex-1 bg-slate-950",
    scrollContent: "px-5 pt-6 pb-14",
    header: "mb-8",
    headerTitle: "text-3xl font-bold tracking-tight text-white",
    headerSubtitle: "mt-1.5 text-base text-slate-400",
    form: "bg-slate-900 rounded-2xl px-4 pt-5 pb-2 mb-6",
    fieldWrapper: "mb-1",
    fieldWrapperLast: "mb-1",
    fieldLabel: "mb-1.5 text-sm font-semibold text-slate-200",
    fieldRequired: "text-red-400",
    detailsInput: "min-h-[108px] w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-base text-white",
    submitButton: "items-center rounded-2xl bg-blue-600 px-6 py-4 shadow-md shadow-blue-600/30 active:bg-blue-700 disabled:opacity-50",
    submitLabel: "text-base font-bold tracking-wide text-white",
  },
  light: {
    scroll: "flex-1 bg-slate-100",
    scrollContent: "px-5 pt-6 pb-14",
    header: "mb-8",
    headerTitle: "text-3xl font-bold tracking-tight text-slate-900",
    headerSubtitle: "mt-1.5 text-base text-slate-500",
    form: "bg-white rounded-2xl px-4 pt-5 pb-2 mb-6 shadow-sm shadow-black/5",
    fieldWrapper: "mb-1",
    fieldWrapperLast: "mb-1",
    fieldLabel: "mb-1.5 text-sm font-semibold text-slate-700",
    fieldRequired: "text-red-500",
    detailsInput: "min-h-[108px] w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-base text-slate-900",
    submitButton: "items-center rounded-2xl bg-blue-600 px-6 py-4 shadow-md shadow-blue-600/30 active:bg-blue-700 disabled:opacity-50",
    submitLabel: "text-base font-bold tracking-wide text-white",
  },
} as const;

export default function NewTicketScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useColorScheme() === "dark" ? styles.dark : styles.light;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, trigger, setValue } = useForm<NewTicketFormValues>({
    resolver: zodResolver(newTicketFormSchema),
    mode: "onBlur",
    defaultValues: { title: "", details: "", requester: "", requesterId: "", deadline: "" },
  });

  useEffect(() => {
    if (user?.name) setValue("requester", user.name, { shouldValidate: false });
    if (user?.id) setValue("requesterId", user.id, { shouldValidate: false });
  }, [user?.name, user?.id, setValue]);

  const onSubmit = useCallback(async (data: NewTicketFormOutput) => {
    try {
      setIsSubmitting(true);
      await createTicket(data);
      router.replace("/(tabs)/tickets");
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [router]);

  return (
    <ScrollView className={theme.scroll} contentContainerClassName={theme.scrollContent} keyboardShouldPersistTaps="handled">
      <View className={theme.header}>
        <Text className={theme.headerTitle}>Novo Chamado</Text>
        <Text className={theme.headerSubtitle}>Preencha os dados para abrir um chamado</Text>
      </View>

      <View className={theme.form}>
        <View className={theme.fieldWrapper}>
          <Text className={theme.fieldLabel}>Título <Text className={theme.fieldRequired}>*</Text></Text>
          <FormInputRHF<NewTicketFormValues> name="title" control={control} trigger={trigger} type="text" placeholder="Ex: Impressora do setor não funciona" />
        </View>
        <View className={theme.fieldWrapper}>
          <Text className={theme.fieldLabel}>Detalhes <Text className={theme.fieldRequired}>*</Text></Text>
          <FormInputRHF<NewTicketFormValues>
            name="details" control={control} trigger={trigger} type="text"
            placeholder="Descreva o problema ou solicitação com detalhes"
            inputProps={{ multiline: true, numberOfLines: 4, textAlignVertical: "top", className: theme.detailsInput }}
          />
        </View>
        <View className={theme.fieldWrapper}>
          <Text className={theme.fieldLabel}>Solicitante <Text className={theme.fieldRequired}>*</Text></Text>
          <FormInputRHF<NewTicketFormValues> name="requester" control={control} trigger={trigger} type="text" placeholder="Nome de quem está abrindo o chamado" readOnly={!!user?.name} />
        </View>
        <View className={theme.fieldWrapperLast}>
          <Text className={theme.fieldLabel}>Prazo de encerramento <Text className={theme.fieldRequired}>*</Text></Text>
          <FormInputRHF<NewTicketFormValues> name="deadline" control={control} trigger={trigger} type="date" placeholder="DD/MM/AAAA" />
        </View>
      </View>

      <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isSubmitting} activeOpacity={0.8} className={theme.submitButton}>
        {isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Text className={theme.submitLabel}>Abrir Chamado</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}