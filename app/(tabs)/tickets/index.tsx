import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, useColorScheme, View, type ListRenderItem } from "react-native";

import { TicketCard } from "@/components/TicketCard/TicketCard";
import { listTickets } from "@/lib/repositories/tickets.repository";
import { ScreenState } from "@/lib/types/pageTypes";
import type { TicketEntity } from "@/lib/validations/ticket.schema";
import { ticketStyles } from "@/styles/ticketStyles";

const keyExtractor = (item: TicketEntity): string => item.id;

const styles = {
  dark: {
    list: "flex-1 bg-slate-950",
    listContent: "px-4 py-4 gap-3",
    emptyWrapper: "flex-1 items-center justify-center gap-3 px-6",
    emptyTitle: "text-slate-300 text-lg font-semibold text-center",
    emptySubtitle: "text-slate-500 text-sm text-center",
  },
  light: {
    list: "flex-1 bg-slate-100",
    listContent: "px-4 py-4 gap-3",
    emptyWrapper: "flex-1 items-center justify-center gap-3 px-6",
    emptyTitle: "text-slate-600 text-lg font-semibold text-center",
    emptySubtitle: "text-slate-400 text-sm text-center",
  },
} as const;

type HomeTheme = typeof styles.dark | typeof styles.light;

function EmptyList({ theme }: { theme: HomeTheme; }) {
  return (
    <View className={theme.emptyWrapper}>
      <Feather name="inbox" size={48} color="#94a3b8" />
      <Text className={theme.emptyTitle}>Nenhum chamado encontrado</Text>
      <Text className={theme.emptySubtitle}>Abra um novo chamado pela aba 'Novo' para ele aparecer aqui.</Text>
    </View>
  );
}

export default function HomePage() {
  const theme = useColorScheme() === "dark" ? styles.dark : styles.light;
  const [state, setState] = useState<ScreenState>({ status: "loading" });

  const fetchTickets = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const tickets = await listTickets();
      setState({ status: "success", data: tickets });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Erro desconhecido ao carregar chamados." });
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchTickets(); }, [fetchTickets]));

  const renderItem: ListRenderItem<TicketEntity> = useCallback(({ item }) => <TicketCard ticket={item} />, []);

  if (state.status === "loading") {
    return (
      <View className={ticketStyles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className={ticketStyles.loadingText}>Carregando chamados...</Text>
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

  const tickets = Array.isArray(state.data) ? state.data : [state.data];

  return (
    <FlatList
      className={theme.list}
      contentContainerClassName={theme.listContent}
      contentContainerStyle={tickets.length === 0 ? { flex: 1 } : undefined}
      data={tickets}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListEmptyComponent={<EmptyList theme={theme} />}
      showsVerticalScrollIndicator={false}
    />
  );
}