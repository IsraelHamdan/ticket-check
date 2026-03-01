import { FormInputRHF } from "@/components/FormInputRHF";
import { createTicket } from "@/lib/repositories";
import { CreateTicketDTO, NewTicketFormOutput, newTicketFormSchema } from "@/lib/validations/ticket.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type NewTicketFormValues = CreateTicketDTO;

export default function NewTicketScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, trigger } = useForm<NewTicketFormValues>({
    resolver: zodResolver(newTicketFormSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      details: "",
      requester: "",
      deadline: "",
    },
  });

  const onSubmit = useCallback(
    async (data: NewTicketFormOutput) => {
      try {
        setIsSubmitting(true);
        await createTicket(data);
        router.replace("/(tabs)/home/index");
      } catch (error) {
        console.error("Erro ao criar ticket:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  return (
    <ScrollView
      className={styles.scroll}
      contentContainerClassName={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View className={styles.header}>
        <Text className={styles.headerTitle}>Novo Chamado</Text>
        <Text className={styles.headerSubtitle}>
          Preencha os dados para abrir um chamado
        </Text>
      </View>

      <View className={styles.fieldWrapper}>
        <Text className={styles.fieldLabel}>
          Título <Text className={styles.fieldRequired}>*</Text>
        </Text>
        <FormInputRHF<NewTicketFormValues>
          name="title"
          control={control}
          trigger={trigger}
          type="text"
          placeholder="Ex: Impressora do setor não funciona"
        />
      </View>

      <View className={styles.fieldWrapper}>
        <Text className={styles.fieldLabel}>
          Detalhes <Text className={styles.fieldRequired}>*</Text>
        </Text>
        <FormInputRHF<NewTicketFormValues>
          name="details"
          control={control}
          trigger={trigger}
          type="text"
          placeholder="Descreva o problema ou solicitação com detalhes"
          inputProps={{
            multiline: true,
            numberOfLines: 4,
            textAlignVertical: "top",
            className: styles.detailsInput,
          }}
        />
      </View>

      <View className={styles.fieldWrapper}>
        <Text className={styles.fieldLabel}>
          Solicitante <Text className={styles.fieldRequired}>*</Text>
        </Text>
        <FormInputRHF<NewTicketFormValues>
          name="requester"
          control={control}
          trigger={trigger}
          type="text"
          placeholder="Nome de quem está abrindo o chamado"
        />
      </View>

      <View className={styles.fieldWrapperLast}>
        <Text className={styles.fieldLabel}>
          Prazo de encerramento <Text className={styles.fieldRequired}>*</Text>
        </Text>
        <FormInputRHF<NewTicketFormValues>
          name="deadline"
          control={control}
          trigger={trigger}
          type="date"
          placeholder="DD/MM/AAAA"
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        activeOpacity={0.8}
        className={styles.submitButton}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className={styles.submitLabel}>Abrir Chamado</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = {
  scroll: "flex-1 bg-slate-50 dark:bg-slate-900",
  scrollContent: "px-4 py-6 pb-12",
  header: "mb-8",
  headerTitle: "text-2xl font-bold text-slate-900 dark:text-white",
  headerSubtitle: "mt-1 text-sm text-slate-500 dark:text-slate-400",
  fieldWrapper: "mb-2",
  fieldWrapperLast: "mb-8",
  fieldLabel: "mb-1 text-sm font-medium text-slate-700 dark:text-slate-300",
  fieldRequired: "text-red-500",
  detailsInput:
    "min-h-[96px] w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white",
  submitButton:
    "items-center rounded-xl bg-blue-600 px-6 py-4 active:bg-blue-700 disabled:opacity-50",
  submitLabel: "text-base font-semibold text-white",
} as const;