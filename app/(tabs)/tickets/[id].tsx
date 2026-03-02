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
  View,
} from "react-native";

type ClosingForm = {
  selectedStatus: ClosedTicketStatus;
  closingDetails: string;
};

export default function TicketView() {
  const { id } = useLocalSearchParams<{ id: string; }>();
  const { user } = useAuth();
  const [state, setState] = useState<ScreenState>({ status: "loading" });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [closingForm, setClosingForm] = useState<ClosingForm | null>(null);
  const [updating, setUpdating] = useState(false);

  const getTicket = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const ticket = await getTicketById(id);
      if (!ticket) {
        setState({ status: "error", message: "Chamado não encontrado." });
        return;
      }
      setState({ status: "success", data: ticket });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido ao carregar chamado.";
      setState({ status: "error", message });
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
        {
          status: closingForm.selectedStatus,
          provider: user.name,
          providerId: user.id,
          closingDetails: closingForm.closingDetails,
        },
        user.id,
      );

      if (!updated) {
        setState({ status: "error", message: "Não foi possível atualizar o chamado." });
        return;
      }

      setClosingForm(null);
      setState({ status: "success", data: updated });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar o status.";
      setState({ status: "error", message });
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

  return (
    <ScrollView className="flex-1 bg-slate-950 px-4 py-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-white mb-1">{ticket.title}</Text>
        <View className="bg-blue-600 self-start rounded-full px-3 py-1">
          <Text className="text-white text-xs font-semibold">
            {ticketStatusLabel[ticket.status]}
          </Text>
        </View>
      </View>

      <View className="bg-slate-900 rounded-2xl p-4 mb-4 gap-4">
        <InfoRow icon="file-text" label="Descrição">
          <Text className="text-slate-300 text-sm leading-relaxed">{ticket.details}</Text>
        </InfoRow>
        <Divider />
        <InfoRow icon="user" label="Solicitante">
          <Text className="text-slate-200 text-sm font-medium">{ticket.requester}</Text>
        </InfoRow>
        <Divider />
        <InfoRow icon="clock" label="Prazo">
          <Text className="text-slate-200 text-sm font-medium">
            {new Date(ticket.deadline).toLocaleDateString("pt-BR")}
          </Text>
        </InfoRow>
        {ticket.provider && (
          <>
            <Divider />
            <InfoRow icon="tool" label="Responsável">
              <Text className="text-slate-200 text-sm font-medium">{ticket.provider}</Text>
            </InfoRow>
          </>
        )}
        {ticket.closingDetails && (
          <>
            <Divider />
            <InfoRow icon="check-circle" label="Detalhes do encerramento">
              <Text className="text-slate-300 text-sm leading-relaxed">{ticket.closingDetails}</Text>
            </InfoRow>
          </>
        )}
      </View>

      <View className="bg-slate-900 rounded-2xl p-4 mb-8">
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
          Encerrar chamado
        </Text>
        <Pressable
          onPress={() => setDropdownVisible(true)}
          disabled={updating}
          className="flex-row items-center justify-between bg-slate-800 rounded-xl px-4 py-3 active:opacity-70"
        >
          <Text className="text-slate-300 text-sm">Selecionar resolução...</Text>
          {updating
            ? <ActivityIndicator size="small" color="#3b82f6" />
            : <Feather name="chevron-down" size={16} color="#94a3b8" />
          }
        </Pressable>
      </View>

      {/* Passo 1 — tipo de encerramento */}
      <Modal
        transparent
        visible={dropdownVisible}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable className="flex-1 bg-black/60 justify-end" onPress={() => setDropdownVisible(false)}>
          <View className="bg-slate-900 rounded-t-3xl p-6">
            <Text className="text-white font-bold text-lg mb-4 text-center">
              Encerrar chamado como...
            </Text>
            {CLOSED_STATUSES.map((status) => (
              <Pressable
                key={status}
                onPress={() => openClosingForm(status)}
                className="py-4 border-b border-slate-800 active:opacity-70"
              >
                <Text className="text-slate-200 text-base text-center">
                  {ticketStatusLabel[status]}
                </Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setDropdownVisible(false)} className="mt-4 py-3 active:opacity-70">
              <Text className="text-slate-400 text-base text-center">Cancelar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Passo 2 — detalhes do encerramento */}
      <Modal
        transparent
        visible={closingForm !== null}
        animationType="slide"
        onRequestClose={() => setClosingForm(null)}
      >
        <Pressable className="flex-1 bg-black/60 justify-end" onPress={() => setClosingForm(null)}>
          <View className="bg-slate-900 rounded-t-3xl p-6">
            <Text className="text-white font-bold text-lg mb-1 text-center">
              {closingForm ? ticketStatusLabel[closingForm.selectedStatus] : ""}
            </Text>
            <Text className="text-slate-400 text-sm text-center mb-5">
              Responsável: {user?.name}
            </Text>
            <Text className="text-slate-300 text-sm font-semibold mb-2">
              Descreva os detalhes do encerramento
            </Text>
            <TextInput
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="Ex: Problema resolvido após reinicialização do equipamento."
              placeholderTextColor="#64748b"
              value={closingForm?.closingDetails ?? ""}
              onChangeText={(text) =>
                setClosingForm((prev) => prev ? { ...prev, closingDetails: text } : prev)
              }
              className="bg-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm min-h-[100px] mb-4"
            />
            <Pressable
              onPress={confirmClose}
              disabled={updating || !closingForm?.closingDetails.trim()}
              className="bg-blue-600 rounded-xl py-4 items-center active:opacity-70 disabled:opacity-40"
            >
              {updating
                ? <ActivityIndicator color="#fff" />
                : <Text className="text-white font-bold">Confirmar encerramento</Text>
              }
            </Pressable>
            <Pressable onPress={() => setClosingForm(null)} className="mt-3 py-3 active:opacity-70">
              <Text className="text-slate-400 text-base text-center">Cancelar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}