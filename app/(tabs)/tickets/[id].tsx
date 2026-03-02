import { useAuth } from "@/components/AuthProvider";
import Divider from "@/components/divider";
import InfoRow from "@/components/infoRow";
import { getTicketById, updateTicket } from "@/lib/repositories";
import { ScreenState } from "@/lib/types/pageTypes";
import { isSingleTicket } from "@/lib/utils/ticketGuard";
import {
  CLOSED_STATUSES,
  type ClosedTicketStatus,
  ticketStatusLabel,
} from "@/lib/validations/ticket.schema";
import { STATUS_CONFIG } from "@/styles/TicketStatusConfig";
import { ticketStyles } from "@/styles/ticketStyles";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

type ClosingForm = {
  selectedStatus: ClosedTicketStatus;
  closingDetails: string;
};

const styles = {
  dark: {
    screen: "flex-1 bg-slate-950 px-4 py-6",
    header: "mb-6",
    title: "text-2xl font-bold text-white mb-2",
    card: "bg-slate-900 rounded-2xl p-4 mb-4 gap-4",
    cardBodyText: "text-slate-300 text-sm leading-relaxed",
    cardValueText: "text-slate-200 text-sm font-medium",
    sectionLabel: "text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3",
    dropdownTrigger: "flex-row items-center justify-between bg-slate-800 rounded-xl px-4 py-3 active:opacity-70",
    dropdownTriggerText: "text-slate-300 text-sm",
    modalBackdrop: "flex-1 bg-black/60 justify-end",
    modalSheet: "bg-slate-900 rounded-t-3xl p-6",
    modalTitle: "text-white font-bold text-lg mb-1 text-center",
    modalSubtitle: "text-slate-400 text-sm text-center mb-5",
    modalOption: "py-4 border-b border-slate-800 active:opacity-70",
    modalOptionText: "text-slate-200 text-base text-center",
    modalCancel: "mt-4 py-3 active:opacity-70",
    modalCancelText: "text-slate-400 text-base text-center",
    inputLabel: "text-slate-300 text-sm font-semibold mb-2",
    textArea: "bg-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm min-h-[100px] mb-4",
    confirmButton: "bg-blue-600 rounded-xl py-4 items-center active:opacity-70 disabled:opacity-40",
    confirmButtonText: "text-white font-bold",
  },
  light: {
    screen: "flex-1 bg-slate-100 px-4 py-6",
    header: "mb-6",
    title: "text-2xl font-bold text-slate-900 mb-2",
    card: "bg-white rounded-2xl p-4 mb-4 gap-4 shadow-sm shadow-black/5",
    cardBodyText: "text-slate-600 text-sm leading-relaxed",
    cardValueText: "text-slate-800 text-sm font-medium",
    sectionLabel: "text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3",
    dropdownTrigger: "flex-row items-center justify-between bg-slate-100 rounded-xl px-4 py-3 active:opacity-70",
    dropdownTriggerText: "text-slate-600 text-sm",
    modalBackdrop: "flex-1 bg-black/40 justify-end",
    modalSheet: "bg-white rounded-t-3xl p-6",
    modalTitle: "text-slate-900 font-bold text-lg mb-1 text-center",
    modalSubtitle: "text-slate-500 text-sm text-center mb-5",
    modalOption: "py-4 border-b border-slate-100 active:opacity-70",
    modalOptionText: "text-slate-700 text-base text-center",
    modalCancel: "mt-4 py-3 active:opacity-70",
    modalCancelText: "text-slate-400 text-base text-center",
    inputLabel: "text-slate-700 text-sm font-semibold mb-2",
    textArea: "bg-slate-100 rounded-xl px-4 py-3 text-slate-800 text-sm min-h-[100px] mb-4",
    confirmButton: "bg-blue-600 rounded-xl py-4 items-center active:opacity-70 disabled:opacity-40",
    confirmButtonText: "text-white font-bold",
  },
} as const;

export default function TicketView() {
  const { id } = useLocalSearchParams<{ id: string; }>();
  const { user } = useAuth();
  const isDark = useColorScheme() === "dark";
  const theme = isDark ? styles.dark : styles.light;

  const [state, setState] = useState<ScreenState>({ status: "loading" });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [closingForm, setClosingForm] = useState<ClosingForm | null>(null);
  const [updating, setUpdating] = useState(false);

  const getTicket = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const ticket = await getTicketById(id);
      if (!ticket) { setState({ status: "error", message: "Chamado não encontrado." }); return; }
      setState({ status: "success", data: ticket });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Erro desconhecido ao carregar chamado." });
    }
  }, [id]);

  useFocusEffect(useCallback(() => { getTicket(); }, [getTicket]));

  const openClosingForm = (status: ClosedTicketStatus) => {
    setDropdownVisible(false);
    setClosingForm({ selectedStatus: status, closingDetails: "" });
  };

  const confirmClose = async () => {
    if (state.status !== "success" || !isSingleTicket(state.data) || !closingForm || !user) return;
    setUpdating(true);
    try {
      const updated = await updateTicket(
        state.data.id,
        { status: closingForm.selectedStatus, provider: user.name, providerId: user.id, closingDetails: closingForm.closingDetails },
        user.id,
      );
      if (!updated) { setState({ status: "error", message: "Não foi possível atualizar o chamado." }); return; }
      setClosingForm(null);
      setState({ status: "success", data: updated });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Erro ao atualizar o status." });
    } finally {
      setUpdating(false);
    }
  };

  if (state.status === "loading") {
    return (
      <View className={ticketStyles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={ticketStyles.loadingText}>Carregando chamado...</Text>
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View className={ticketStyles.errorWrapper}>
        <Feather name="alert-circle" size={40} color="#ef4444" />
        <Text className={ticketStyles.errorTitle}>Falha ao carregar</Text>
        <Text className={ticketStyles.errorSubtitle}>{state.message}</Text>
      </View>
    );
  }

  if (!isSingleTicket(state.data)) return null;

  const ticket = state.data;
  const statusConfig = STATUS_CONFIG[ticket.status];

  return (
    <ScrollView className={theme.screen}>
      <View className={theme.header}>
        <Text className={theme.title}>{ticket.title}</Text>
        {/* Badge: estrutura de ticketStyles, cor de STATUS_CONFIG — igual ao TicketCard */}
        <View className={`${ticketStyles.badge} ${statusConfig.badgeBg}`}>
          <View className={`${ticketStyles.badgeDot} ${statusConfig.dotColor}`} />
          <Text className={`${ticketStyles.badgeText} ${statusConfig.badgeText}`}>
            {ticketStatusLabel[ticket.status]}
          </Text>
        </View>
      </View>

      <View className={theme.card}>
        <InfoRow icon="file-text" label="Descrição">
          <Text className={theme.cardBodyText}>{ticket.details}</Text>
        </InfoRow>
        <Divider />
        <InfoRow icon="user" label="Solicitante">
          <Text className={theme.cardValueText}>{ticket.requester}</Text>
        </InfoRow>
        <Divider />
        <InfoRow icon="clock" label="Prazo">
          <Text className={theme.cardValueText}>{new Date(ticket.deadline).toLocaleDateString("pt-BR")}</Text>
        </InfoRow>
        {ticket.provider && (
          <>
            <Divider />
            <InfoRow icon="tool" label="Responsável">
              <Text className={theme.cardValueText}>{ticket.provider}</Text>
            </InfoRow>
          </>
        )}
        {ticket.closingDetails && (
          <>
            <Divider />
            <InfoRow icon="check-circle" label="Detalhes do encerramento">
              <Text className={theme.cardBodyText}>{ticket.closingDetails}</Text>
            </InfoRow>
          </>
        )}
      </View>

      <View className={theme.card}>
        <Text className={theme.sectionLabel}>Encerrar chamado</Text>
        <Pressable onPress={() => setDropdownVisible(true)} disabled={updating} className={theme.dropdownTrigger}>
          <Text className={theme.dropdownTriggerText}>Selecionar resolução...</Text>
          {updating
            ? <ActivityIndicator size="small" color="#3b82f6" />
            : <Feather name="chevron-down" size={16} color={isDark ? "#94a3b8" : "#64748b"} />
          }
        </Pressable>
      </View>

      <Modal transparent visible={dropdownVisible} animationType="fade" onRequestClose={() => setDropdownVisible(false)}>
        <Pressable className={theme.modalBackdrop} onPress={() => setDropdownVisible(false)}>
          <View className={theme.modalSheet}>
            <Text className={theme.modalTitle}>Encerrar chamado como...</Text>
            {CLOSED_STATUSES.map((status) => (
              <Pressable key={status} onPress={() => openClosingForm(status)} className={theme.modalOption}>
                <Text className={theme.modalOptionText}>{ticketStatusLabel[status]}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setDropdownVisible(false)} className={theme.modalCancel}>
              <Text className={theme.modalCancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal transparent visible={closingForm !== null} animationType="slide" onRequestClose={() => setClosingForm(null)}>
        <Pressable className={theme.modalBackdrop} onPress={() => setClosingForm(null)}>
          <View className={theme.modalSheet}>
            <Text className={theme.modalTitle}>
              {closingForm ? ticketStatusLabel[closingForm.selectedStatus] : ""}
            </Text>
            <Text className={theme.modalSubtitle}>Responsável: {user?.name}</Text>
            <Text className={theme.inputLabel}>Descreva os detalhes do encerramento</Text>
            <TextInput
              multiline numberOfLines={4} textAlignVertical="top"
              placeholder="Ex: Problema resolvido após reinicialização do equipamento."
              placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
              value={closingForm?.closingDetails ?? ""}
              onChangeText={(text) => setClosingForm((prev) => prev ? { ...prev, closingDetails: text } : prev)}
              className={theme.textArea}
            />
            <Pressable onPress={confirmClose} disabled={updating || !closingForm?.closingDetails.trim()} className={theme.confirmButton}>
              {updating ? <ActivityIndicator color="#fff" /> : <Text className={theme.confirmButtonText}>Confirmar encerramento</Text>}
            </Pressable>
            <Pressable onPress={() => setClosingForm(null)} className={theme.modalCancel}>
              <Text className={theme.modalCancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}