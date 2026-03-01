import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  type ListRenderItem,
} from "react-native";

import { TicketCard } from "@/components/TicketCard/TicketCard";
import { listTickets } from "@/lib/repositories/tickets.repository";
import type { TicketEntity } from "@/lib/validations/ticket.schema";

const styles = {
  container: "flex-1 bg-slate-50 dark:bg-slate-900",
  centered: "flex-1 items-center justify-center bg-slate-50 dark:bg-slate-900",
  loadingText: "mt-3 text-sm text-slate-400 dark:text-slate-500",
  listContent: "px-4 pt-4 pb-10 gap-3",
  emptyWrapper: "flex-1 items-center justify-center px-8 gap-3",
  emptyIcon: "mb-1 opacity-30",
  emptyTitle: "text-base font-semibold text-slate-500 dark:text-slate-400 text-center",
  emptySubtitle: "text-sm text-slate-400 dark:text-slate-500 text-center leading-relaxed",
  errorWrapper: "flex-1 items-center justify-center px-8 gap-3",
  errorTitle: "text-base font-semibold text-red-500 text-center",
  errorSubtitle: "text-sm text-slate-400 dark:text-slate-500 text-center",
} as const;

type ScreenState =
  | { status: "loading"; }
  | { status: "error"; message: string; }
  | { status: "success"; data: TicketEntity[]; };

const keyExtractor = (item: TicketEntity): string => item.id;

const renderItem: ListRenderItem<TicketEntity> = ({ item }) => (
  <TicketCard ticket={item} />
);

const EmptyList = () => (
  <View className={styles.emptyWrapper}>
    <Feather name="inbox" size={48} color="#94a3b8" />
    <Text className={styles.emptyTitle}>Nenhum chamado encontrado</Text>
    <Text className={styles.emptySubtitle}>
      Abra um novo chamado pela aba "Novo" para ele aparecer aqui.
    </Text>
  </View>
);

export default function HomePage() {
  const [state, setState] = useState<ScreenState>({ status: "loading" });

  const fetchTickets = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const tickets = await listTickets();
      setState({ status: "success", data: tickets });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro desconhecido ao carregar chamados.";
      setState({ status: "error", message });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, [fetchTickets])
  );

  if (state.status === "loading") {
    return (
      <View className={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={styles.loadingText}>Carregando chamados...</Text>
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View className={styles.errorWrapper}>
        <Feather name="alert-circle" size={40} color="#ef4444" />
        <Text className={styles.errorTitle}>Falha ao carregar</Text>
        <Text className={styles.errorSubtitle}>{state.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      className={styles.container}
      contentContainerClassName={styles.listContent}
      contentContainerStyle={state.data.length === 0 ? { flex: 1 } : undefined}
      data={state.data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListEmptyComponent={EmptyList}
      showsVerticalScrollIndicator={false}
    />
  );
}